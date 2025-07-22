import { redis } from "@/lib/upstash"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params
    const viewCount = (await redis.get(`views:${postId}`)) || 0

    return NextResponse.json({
      viewCount: Number(viewCount),
    })
  } catch (error) {
    console.error("Error fetching views:", error)
    return NextResponse.json({ error: "Failed to fetch views" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const sessionKey = `views:${postId}:sessions`
    const countKey = `views:${postId}`

    // Check if this session has already viewed this post
    const hasViewed = await redis.sismember(sessionKey, sessionId)

    if (hasViewed === 0) {
      // Add session to viewed sessions set
      await redis.sadd(sessionKey, sessionId)
      // Increment view count
      const newCount = await redis.incr(countKey)

      return NextResponse.json({
        viewCount: newCount,
        wasIncremented: true,
      })
    }

    // Return current count without incrementing
    const currentCount = (await redis.get(countKey)) || 0
    return NextResponse.json({
      viewCount: Number(currentCount),
      wasIncremented: false,
    })
  } catch (error) {
    console.error("Error updating views:", error)
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 })
  }
}
