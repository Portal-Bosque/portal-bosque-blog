import { redis } from "@/lib/upstash"
import { type NextRequest, NextResponse } from "next/server"

interface LikeData {
  count: number
  likedBy: string[]
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params

    // Get like count
    const likeCount = await redis.get(`likes:${postId}`)
    
    // Handle invalid count values
    let normalizedLikeCount = 0
    if (likeCount !== null && likeCount !== undefined) {
      const parsedCount = Number(likeCount)
      if (!isNaN(parsedCount) && isFinite(parsedCount)) {
        normalizedLikeCount = parsedCount
      }
    }

    // Get user's like status
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    let isLiked = false
    if (userId) {
      isLiked = (await redis.sismember(`likes:${postId}:users`, userId)) === 1
    }

    const response = {
      likeCount: normalizedLikeCount,
      isLiked,
    }
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching likes:", error)
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params
    
    // Validate postId
    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 })
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { userId, action } = body

    // Validate required fields
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: "User ID is required and must be a string" }, { status: 400 })
    }

    if (!action || !['like', 'unlike'].includes(action)) {
      return NextResponse.json({ error: "Action must be 'like' or 'unlike'" }, { status: 400 })
    }

    const userKey = `likes:${postId}:users`
    const countKey = `likes:${postId}`

    if (action === "like") {
      // Check if user already liked
      const alreadyLiked = await redis.sismember(userKey, userId)
      if (alreadyLiked === 1) {
        return NextResponse.json({ error: "User already liked this post" }, { status: 409 })
      }

      // Clean up invalid count value before incrementing
      const currentCount = await redis.get(countKey)
      if (currentCount === null || currentCount === undefined || isNaN(Number(currentCount))) {
        // Reset to 0 if the value is invalid
        await redis.set(countKey, 0)
      }

      // Add user to liked users set
      await redis.sadd(userKey, userId)
      // Increment like count
      const newCount = await redis.incr(countKey)

      return NextResponse.json({
        likeCount: newCount,
        isLiked: true,
      })
    } else if (action === "unlike") {
      // Check if user hasn't liked
      const hasLiked = await redis.sismember(userKey, userId)
      
      if (hasLiked === 0) {
        return NextResponse.json({ error: "User hasn't liked this post" }, { status: 409 })
      }

      // Remove user from liked users set
      await redis.srem(userKey, userId)
      
      // Decrement like count (but don't go below 0)
      const currentCount = await redis.get(countKey)
      
      // Handle invalid count values
      let validCurrentCount = 0
      if (currentCount !== null && currentCount !== undefined) {
        const parsedCount = Number(currentCount)
        if (!isNaN(parsedCount) && isFinite(parsedCount)) {
          validCurrentCount = parsedCount
        }
      }
      
      const newCount = Math.max(0, validCurrentCount - 1)
      await redis.set(countKey, newCount)

      return NextResponse.json({
        likeCount: newCount,
        isLiked: false,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating likes:", error)
    
    // Check if it's a Redis connection error
    if (error instanceof Error && error.message.includes('Redis')) {
      return NextResponse.json({ error: "Database connection error" }, { status: 503 })
    }
    
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 })
  }
}
