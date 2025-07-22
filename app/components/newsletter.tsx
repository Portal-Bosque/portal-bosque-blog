"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { parseFormData, sendEvent } from "basehub/events"
import { Subscribers } from "@/basehub"

interface NewsletterProps {
  newsletter: Pick<Subscribers, "ingestKey" | "schema">
}

export function Newsletter({ newsletter }: NewsletterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const parsedSubmission = parseFormData(
        newsletter.ingestKey,
        newsletter.schema,
        formData,
      )

      if (!parsedSubmission.success) {
        throw new Error(JSON.stringify(parsedSubmission.errors))
      }

      await sendEvent(newsletter.ingestKey, parsedSubmission.data)

      setMessage({
        type: "success",
        text: "Thanks for subscribing! You'll receive our latest updates.",
      })

      // Reset form
      const form = document.querySelector("form") as HTMLFormElement
      form?.reset()
    } catch (error) {
      console.error("Newsletter submission error:", error)
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="border-t bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-5">
        <div className="py-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter leading-tight mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest posts delivered
            straight to your inbox.
          </p>

          <form action={handleSubmit} className="max-w-md mx-auto space-y-4">
            {newsletter.schema.map((field) => (
              <div key={field.id} className="flex flex-col gap-2">
                {field.type === "email" ? (
                  <div className="flex gap-2">
                    <Input
                      {...field}
                      className="flex-1"
                      disabled={isSubmitting}
                      placeholder={field.placeholder || "Enter your email"}
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6"
                    >
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                    </label>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder={field.placeholder}
                    />
                  </div>
                )}
              </div>
            ))}

            {newsletter.schema.length === 0 && (
              <div className="flex gap-2">
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <Button type="submit" disabled={isSubmitting} className="px-6">
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
            )}

            {message && (
              <p
                className={`text-sm ${
                  message.type === "success"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {message.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
