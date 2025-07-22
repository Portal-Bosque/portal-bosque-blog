import { RichText } from "basehub/react-rich-text"
import { CodeBlock } from "basehub/react-code-block"
import CoverImage from "@/app/components/cover-image"
import Avatar from "@/app/components/avatar"
import Date from "@/app/components/date"
import { BodyImage } from "./body-image"
import { fragmentOn } from "basehub"
import { PostMetaFragment } from "./hero-post"
import { ViewCounter } from "./view-counter"
import { LikeButton } from "./like-button"

export const PostFragment = fragmentOn("PostsItem", {
  ...PostMetaFragment,
  body: { json: { content: true } },
})

export type PostFragment = fragmentOn.infer<typeof PostFragment>

export function Post({ _title, author, date, coverImage, body, _id }: PostFragment) {
  return (
    <article>
      <h1 className="mt-8 mb-8 text-center text-4xl font-bold leading-tight tracking-tighter md:text-left md:text-6xl md:leading-none lg:text-7xl font-serif">
        {_title}
      </h1>

      <div className="hidden md:block md:mb-6">
        {author && <Avatar title={author._title} url={author.avatar.url} />}
      </div>
      <div className="hidden md:flex md:items-center md:justify-between md:mb-12">
        <div className="text-base dark:text-white/60 text-black/60">
          <Date dateString={date} />
        </div>
        <div className="flex items-center gap-4">
          <LikeButton postId={_id} numberMargin="ml-2" />
          <ViewCounter postId={_id} />
        </div>
      </div>

      <div className="mb-8 sm:mx-0 md:mb-16">
        <CoverImage title={_title} url={coverImage.url} width={1500} height={1000} priority className="w-full aspect-square object-cover" />
      </div>

      {/* Bloques de autor, fecha, like y vistas en mobile con márgenes y separación */}
      <div className="mx-4 max-w-2xl">
        <div className="mb-4 block md:hidden">
          {author && <Avatar title={author._title} url={author.avatar.url} />}
        </div>
        <div className="mb-8 flex items-center justify-between block md:hidden">
          <div className="text-base dark:text-white/60 text-black/60">
            <Date dateString={date} />
          </div>
          <div className="flex items-center gap-4">
            <LikeButton postId={_id} size="sm" numberMargin="ml-2" />
            <ViewCounter postId={_id} />
          </div>
        </div>
      </div>

      <div className="mx-4 max-w-2xl sm:mx-auto">
        <div className="prose dark:prose-invert hover:prose-a:text-orange-500">
          <RichText
            components={{
              img: (props) => <BodyImage {...props} className="w-full aspect-square object-cover" />, 
              pre: ({ code, language }) => <CodeBlock theme="github-dark-default" snippets={[{ code, language }]} />, 
              li: (props) => <li {...props} className="[&>p]:my-0" />, 
            }}
          >
            {body.json.content}
          </RichText>
        </div>
      </div>
    </article>
  )
}
