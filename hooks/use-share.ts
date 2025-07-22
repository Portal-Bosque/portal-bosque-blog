"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ShareData {
  title: string
  text: string
  url: string
}

export function useShare() {
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  const share = async (data: ShareData) => {
    setIsSharing(true)

    try {
      // Check if Web Share API is available
      if (navigator.share && navigator.canShare && navigator.canShare(data)) {
        await navigator.share(data)
        toast({
          title: "¡Compartido!",
          description: "El post se ha compartido exitosamente.",
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(data.url)
        toast({
          title: "¡Enlace copiado!",
          description: "El enlace del post se ha copiado al portapapeles.",
        })
      }
    } catch (error) {
      // Handle user cancellation or other errors
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error sharing:", error)
        toast({
          title: "Error al compartir",
          description: "No se pudo compartir el post. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSharing(false)
    }
  }

  return {
    share,
    isSharing,
  }
}
