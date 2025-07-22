"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Check, Clock, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlaygroundSetupModalProps {
  playgroundInfo: {
    expiresAt: string | null
    editUrl: string
    claimUrl: string | null
  }
  envs: Record<string, { isValid: boolean; name: string; label: string }>
}

export function PlaygroundSetupModal({
  playgroundInfo,
  envs,
}: PlaygroundSetupModalProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [open, setOpen] = useState(false)

  // Convert envs object to EnvCheckResult array
  const envResults = Object.values(envs)

  const validCount = envResults.filter((env) => env.isValid).length
  const allValid = validCount === envResults.length
  const hasPlaygroundExpiry = !!playgroundInfo.expiresAt

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const formatTimeRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return "expired"
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()

    if (diff <= 0) return "expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${hours !== 1 ? "s" : ""}`
    }
    return `${hours} hour${hours !== 1 ? "s" : ""}`
  }

  if (isDismissed) return null

  // Show if playground has expiry OR environment variables are missing
  const shouldShow = !allValid

  if (!shouldShow) return null

  return (
    <div className="fixed inset-0 flex items-start justify-end z-50 p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "absolute inset-0 transition-all duration-200",
          open
            ? "pointer-events-auto bg-black/30 opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex absolute top-4 right-4 items-center justify-center text-center gap-2 px-4 h-9 font-medium transition-all duration-200 rounded-lg outline-none pointer-events-auto bg-orange-600 hover:bg-orange-700 text-sm text-white shadow-sm",
          open && "opacity-20 scale-95 pointer-events-none",
        )}
      >
        {hasPlaygroundExpiry ? (
          <Clock className="w-4 h-4 text-white" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-white" />
        )}
        <span className={cn("text-base text-white")}>Blog Setup</span>
      </button>
      {/* Modal */}
      <div
        className={cn(
          "pointer-events-auto absolute top-16 right-4 w-[500px] bg-neutral-100 outline-none flex flex-col rounded-xl shadow-xl border border-neutral-200 transition-all duration-200 origin-top",
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
        )}
        style={{ maxHeight: "500px" }}
      >
        <div className="flex items-center justify-between flex-shrink-0 px-4 py-3 border-b border-dashed bg-neutral-50 border-neutral-200 rounded-t-xl">
          <div className="flex items-center gap-2">
            <span className={cn("text-base font-semibold text-black")}>
              Blog Setup
            </span>
          </div>
          <a
            href={playgroundInfo.editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 h-7 font-medium transition-all duration-200 rounded-lg outline-none bg-orange-600 hover:bg-orange-700 text-sm text-white shadow-sm border border-orange-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
          >
            <ExternalLink className="w-4 h-4" /> Open Playground
          </a>
        </div>

        <div className="flex-1 overflow-y-auto">
          {playgroundInfo.expiresAt && (
            <div className="p-4 border-b border-neutral-200 bg-orange-50">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-orange-900 mb-1">
                      This playground expires in{" "}
                      <span className="font-medium">
                        {formatTimeRemaining(playgroundInfo.expiresAt)}.{" "}
                        {playgroundInfo.claimUrl && (
                          <a
                            href={playgroundInfo.claimUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-orange-700 hover:text-orange-900 font-medium"
                          >
                            Claim it.
                          </a>
                        )}
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Environment Variables List */}
          {!allValid && (
            <div className="bg-white">
              <div className="p-4 space-y-3">
                {envResults.map((env, index) => (
                  <div
                    key={env.name}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg bg-neutral-50 border-neutral-200 transition-all duration-200",
                      open && `animate-in slide-in-from-bottom-2 duration-300`,
                    )}
                    style={{
                      animationDelay: open ? `${index * 50}ms` : "0ms",
                      animationFillMode: "both",
                    }}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center transition-colors duration-150",
                        env.isValid
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-600",
                      )}
                    >
                      {env.isValid ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-neutral-900">
                        {env.label}
                      </div>
                      <div className="font-mono text-xs truncate text-neutral-500">
                        {env.name}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "text-xs font-medium",
                        env.isValid ? "text-green-600" : "text-amber-600",
                      )}
                    >
                      {env.isValid ? "Set" : "Missing"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <div className="flex-shrink-0 p-4 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
          <button
            onClick={() => setIsDismissed(true)}
            className="w-full px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-150"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
