"use client"

import { useViews } from "@/hooks/use-views"
import { Eye } from "lucide-react"

interface ViewCounterProps {
  postId: string
}

function formatViewCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

export function ViewCounter({ postId }: ViewCounterProps) {
  const { viewCount, isLoading } = useViews(postId)

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Eye className="h-3 w-3" />
        <span>...</span>
      </div>
    )
  }

  if (viewCount === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Eye className="h-3 w-3" />
      <span>
        {formatViewCount(viewCount)} {viewCount === 1 ? "vista" : "vistas"}
      </span>
    </div>
  )
}
