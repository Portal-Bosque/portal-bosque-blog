"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useLikes } from "@/hooks/use-likes"

interface LikeButtonProps {
  postId: string
  initialCount?: number
  size?: "sm" | "md" | "lg"
  className?: string
  numberMargin?: string // nueva prop
}

export function LikeButton({ postId, initialCount = 0, size = "md", className = "", numberMargin = "ml-2" }: LikeButtonProps) {
  const { isLiked, likeCount, toggleLike, isLoading } = useLikes(postId, initialCount)

  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6"
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"

  return (
    <div className={`flex items-center gap-0 ${className}`}>
      <button
        type="button"
        onClick={toggleLike}
        disabled={isLoading}
        className={`group p-0 m-0 border-none bg-transparent outline-none focus:outline-none focus:ring-0 active:scale-110 transition-none select-none flex items-center justify-center
          ${isLoading ? "opacity-50" : ""}`}
        style={{ boxShadow: "none" }}
      >
        <Heart
          className={
            `${iconSize} transition-transform duration-150 ease-out
            ${isLiked ? "fill-current text-red-500" : "text-gray-400"}
            group-hover:text-red-300
            group-hover:scale-110
            group-active:scale-125
            ${isLoading ? "animate-pulse" : ""}`
          }
        />
        <span className="sr-only">{isLiked ? "Quitar me gusta" : "Me gusta"}</span>
      </button>
      <span className={`font-semibold ${textSize} ${numberMargin}`}>{(likeCount).toLocaleString()}</span>
    </div>
  )
}
