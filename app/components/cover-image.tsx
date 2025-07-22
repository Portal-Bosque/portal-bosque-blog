import Link from "next/link"
import { clsx } from "clsx"
import { BaseHubImage } from "basehub/next-image"

export default function CoverImage({
  title,
  url,
  slug,
  width,
  height,
  priority,
  className,
}: {
  title: string
  url: string
  slug?: string
  width: number
  height: number
  priority?: boolean
  className?: string
}) {
  const image = (
    <BaseHubImage
      alt={`Cover Image for ${title}`}
      width={width}
      height={height}
      priority={priority}
      className={clsx("shadow-sm object-cover", className, {
        "hover:shadow-md transition-shadow duration-200": slug,
      })}
      src={url}
    />
  )

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
