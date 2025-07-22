import { BaseHubImage } from "basehub/next-image"

export function BodyImage({
  className = "",
  ...props
}: {
  src: string
  alt?: string | undefined
  width?: number | undefined
  height?: number | undefined
  caption?: string | undefined
  className?: string
}) {
  return (
    <figure>
      <BaseHubImage
        {...props}
        alt={props.caption ?? "Image"}
        className={`rounded-lg ${className}`}
        width={700}
        height={700}
      />
      {props.caption && (
        <figcaption className="text-center">{props.caption}</figcaption>
      )}
    </figure>
  )
}
