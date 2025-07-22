"use client"

import { useState, useEffect, useCallback } from "react"

export function useViews(postId: string) {
  const [viewCount, setViewCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string>("")

  // Generate or get session ID
  useEffect(() => {
    let id = sessionStorage.getItem("session-id")
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("session-id", id)
    }
    setSessionId(id)
  }, [])

  // Fetch initial view count
  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await fetch(`/api/views/${postId}`)
        if (response.ok) {
          const data = await response.json()
          setViewCount(data.viewCount)
        } else {
          // Fallback to localStorage
          const localCount = Number.parseInt(localStorage.getItem(`views:${postId}`) || "0")
          setViewCount(localCount)
        }
      } catch (error) {
        console.error("Error fetching views:", error)
        // Fallback to localStorage
        const localCount = Number.parseInt(localStorage.getItem(`views:${postId}`) || "0")
        setViewCount(localCount)
      } finally {
        setIsLoading(false)
      }
    }

    fetchViews()
  }, [postId])

  const incrementView = useCallback(async () => {
    if (!sessionId) return

    try {
      const response = await fetch(`/api/views/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })

      if (response.ok) {
        const data = await response.json()
        setViewCount(data.viewCount)

        // Update localStorage as backup
        localStorage.setItem(`views:${postId}`, data.viewCount.toString())
      } else {
        // Fallback: increment localStorage count
        const currentCount = Number.parseInt(localStorage.getItem(`views:${postId}`) || "0")
        const sessionKey = `viewed:${postId}`

        if (!sessionStorage.getItem(sessionKey)) {
          const newCount = currentCount + 1
          localStorage.setItem(`views:${postId}`, newCount.toString())
          sessionStorage.setItem(sessionKey, "true")
          setViewCount(newCount)
        }
      }
    } catch (error) {
      console.error("Error incrementing view:", error)
      // Fallback: increment localStorage count
      const currentCount = Number.parseInt(localStorage.getItem(`views:${postId}`) || "0")
      const sessionKey = `viewed:${postId}`

      if (!sessionStorage.getItem(sessionKey)) {
        const newCount = currentCount + 1
        localStorage.setItem(`views:${postId}`, newCount.toString())
        sessionStorage.setItem(sessionKey, "true")
        setViewCount(newCount)
      }
    }
  }, [postId, sessionId])

  return {
    viewCount,
    incrementView,
    isLoading,
  }
}
