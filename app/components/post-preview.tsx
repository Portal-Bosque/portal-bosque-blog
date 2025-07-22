"use client"

import Link from "next/link"
import Avatar from "./avatar"
import DateComponent from "./date"
import CoverImage from "./cover-image"
import type { PostMetaFragment } from "./hero-post"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { ShareButton } from "./share-button"
import { useLikes } from "@/hooks/use-likes"
import { ViewCounter } from "./view-counter"
import { LikeButton } from "./like-button"

export function PostPreview({ _title, coverImage, date, excerpt, author, _slug, _id }: PostMetaFragment) {
  const postUrl = typeof window !== "undefined" ? `${window.location.origin}/posts/${_slug}` : `/posts/${_slug}`

  return (
    <div className="w-full max-w-xl border-b sm:mb-8">
      <header className="flex items-center p-4">
        {author && <Avatar title={author._title} url={author.avatar.url} />}
      </header>

      <div>
        <Link href={`/posts/${_slug}`} aria-label={_title}>
          <CoverImage
            title={_title}
            url={coverImage.url}
            width={700}
            height={700}
            className="aspect-square w-full object-cover"
          />
        </Link>
      </div>

      <footer className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <LikeButton postId={_id} />
          </div>
          <ShareButton title={_title} excerpt={excerpt} url={postUrl} />
        </div>

        <div className="mt-2 w-full space-y-1 text-sm">
          <Link href={`/posts/${_slug}`} className="text-base font-bold hover:underline">
            {_title}
          </Link>
          <p className="text-balance text-muted-foreground">{excerpt}</p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <Link href={`/posts/${_slug}`} className="hover:underline">
              <DateComponent dateString={date} />
            </Link>
          </div>
          <ViewCounter postId={_id} />
        </div>
      </footer>
    </div>
  )
}
