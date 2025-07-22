"use client"

import { useEffect } from "react"
import { useViews } from "@/hooks/use-views"

interface PostViewTrackerProps {
  postId: string
}

export function PostViewTracker({ postId }: PostViewTrackerProps) {
  const { incrementView } = useViews(postId)

  useEffect(() => {
    // Wait 1 second before counting the view to avoid accidental counts
    const timer = setTimeout(() => {
      incrementView()
    }, 1000)

    return () => clearTimeout(timer)
  }, [incrementView])

  // This component doesn't render anything
  return null
}
