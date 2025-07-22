"use client"

import { Button } from "@/components/ui/button"
import { Send, Copy, Share2 } from "lucide-react"
import { useShare } from "@/hooks/use-share"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ShareButtonProps {
  title: string
  excerpt: string
  url: string
  className?: string
}

export function ShareButton({ title, excerpt, url, className }: ShareButtonProps) {
  const { share, isSharing } = useShare()

  const handleNativeShare = () => {
    share({ title, text: excerpt, url })
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
    }
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, "_blank", "noopener,noreferrer")
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, "_blank", "noopener,noreferrer")
  }

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedinUrl, "_blank", "noopener,noreferrer")
  }

  // Check if Web Share API is available
  const hasNativeShare = typeof navigator !== "undefined" && navigator.share

  if (hasNativeShare) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNativeShare}
        disabled={isSharing}
        className={`hover:scale-110 transition-transform duration-200 hover:text-blue-500 ${className}`}
      >
        <Send className={`h-6 w-6 transition-all duration-200 ${isSharing ? "animate-pulse" : ""}`} />
        <span className="sr-only">Compartir post</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`hover:scale-110 transition-transform duration-200 hover:text-blue-500 ${className}`}
        >
          <Send className="h-6 w-6" />
          <span className="sr-only">Compartir post</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          Copiar enlace
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Compartir en Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebookShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Compartir en Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLinkedInShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Compartir en LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
