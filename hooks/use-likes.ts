"use client"

import { useState, useEffect, useCallback } from "react"

interface LikesData {
  likeCount: number
  isLiked: boolean
}

export function useLikes(postId: string, initialCount = 0) {
  const [likeCount, setLikeCount] = useState(initialCount)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string>("")

  // Generate or get user ID
  useEffect(() => {
    let id = localStorage.getItem("user-id")
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("user-id", id)
    }
    setUserId(id)
  }, [])

  // Fetch initial likes data
  useEffect(() => {
    if (!userId) return

    const fetchLikes = async () => {
      try {
        const response = await fetch(`/api/likes/${postId}?userId=${userId}`)
        
        if (response.ok) {
          const data: LikesData = await response.json()
          setLikeCount(data.likeCount)
          setIsLiked(data.isLiked)
        } else {
          // Fallback to localStorage
          const localLikes = JSON.parse(localStorage.getItem("likes") || "{}")
          const localCount = Number.parseInt(localStorage.getItem(`likes:${postId}:count`) || "0")
          setIsLiked(!!localLikes[postId])
          setLikeCount(localCount || initialCount)
        }
      } catch (error) {
        console.error("Error fetching likes:", error)
        // Fallback to localStorage
        const localLikes = JSON.parse(localStorage.getItem("likes") || "{}")
        const localCount = Number.parseInt(localStorage.getItem(`likes:${postId}:count`) || "0")
        setIsLiked(!!localLikes[postId])
        setLikeCount(localCount || initialCount)
      }
    }

    fetchLikes()
  }, [postId, userId, initialCount])

  const toggleLike = useCallback(async () => {
    if (!userId || isLoading) return

    setIsLoading(true)
    const newIsLiked = !isLiked
    const newCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1)

    // Optimistic update
    setIsLiked(newIsLiked)
    setLikeCount(newCount)

    try {
      const response = await fetch(`/api/likes/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          action: newIsLiked ? "like" : "unlike",
        }),
      })

      if (response.ok) {
        const data: LikesData = await response.json()
        setLikeCount(data.likeCount)
        setIsLiked(data.isLiked)

        // Update localStorage as backup
        const localLikes = JSON.parse(localStorage.getItem("likes") || "{}")
        if (data.isLiked) {
          localLikes[postId] = true
        } else {
          delete localLikes[postId]
        }
        localStorage.setItem("likes", JSON.stringify(localLikes))
        localStorage.setItem(`likes:${postId}:count`, data.likeCount.toString())
      } else {
        // Revert optimistic update on error
        setIsLiked(!newIsLiked)
        setLikeCount(likeCount)

        // Update localStorage as fallback
        const localLikes = JSON.parse(localStorage.getItem("likes") || "{}")
        if (newIsLiked) {
          localLikes[postId] = true
        } else {
          delete localLikes[postId]
        }
        localStorage.setItem("likes", JSON.stringify(localLikes))
        localStorage.setItem(`likes:${postId}:count`, newCount.toString())
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      
      // Revert optimistic update on network error
      setIsLiked(!newIsLiked)
      setLikeCount(likeCount)
      
      // Update localStorage as fallback
      const localLikes = JSON.parse(localStorage.getItem("likes") || "{}")
      if (newIsLiked) {
        localLikes[postId] = true
      } else {
        delete localLikes[postId]
      }
      localStorage.setItem("likes", JSON.stringify(localLikes))
      localStorage.setItem(`likes:${postId}:count`, newCount.toString())
    } finally {
      setIsLoading(false)
    }
  }, [postId, userId, isLiked, likeCount, isLoading])

  return {
    likeCount,
    isLiked,
    toggleLike,
    isLoading,
  }
}
