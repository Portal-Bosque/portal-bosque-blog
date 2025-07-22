import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { basehub } from "basehub"
import { Post, PostFragment } from "@/app/components/post"
import { MoreStories } from "@/app/components/more-stories"
import { PostMetaFragment } from "@/app/components/hero-post"
import { PostViewTracker } from "@/app/components/post-view-tracker"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { Header } from "@/app/components/header"

export const dynamic = "force-static"
export const revalidate = 30

export async function generateStaticParams() {
  const data = await basehub().query({
    blog: { posts: { items: { _slug: true } } },
  })

  return data.blog.posts.items.map((post) => ({ slug: post._slug }))
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const postData = await basehub().query({
    meta: {
      title: true,
    },
    blog: {
      posts: {
        __args: { first: 1, filter: { _sys_slug: { eq: slug } } },
        items: PostMetaFragment,
      },
    },
  })
  const [post] = postData.blog.posts.items
  if (!post) notFound()

  const postTitle = post._title
  const postDescription = post.excerpt
  const postOgImage =
    post.coverImage?.url ||
    "https://assets.basehub.com/7b2e69ef/340e44aebd5fb0f1a1c015344ae5d49a/20112024-dsc02172.jpg?width=3840&quality=90&format=auto"
  const siteTitle = postData.meta?.title || `Portal Bosque Lab`

  return {
    title: `${postTitle} | ${siteTitle}`,
    description: postDescription,
    openGraph: {
      title: postTitle,
      description: postDescription,
      images: [
        {
          url: postOgImage,
          width: 1200,
          height: 630,
          alt: postTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: postTitle,
      description: postDescription,
      images: [postOgImage],
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params

  const [postData, morePostsData] = await Promise.all([
    basehub().query({
      blog: {
        morePosts: true,
        posts: {
          __args: { first: 1, filter: { _sys_slug: { eq: slug } } },
          items: PostFragment,
        },
      },
    }),
    basehub().query({
      blog: {
        posts: {
          __args: {
            filter: { _sys_slug: { notEq: slug } },
            first: 8,
            orderBy: "date__DESC",
          },
          items: PostMetaFragment,
        },
      },
    }),
  ])

  const [post] = postData.blog.posts.items
  if (!post) notFound()

  return (
    <main>
      <Header />
      <PostViewTracker postId={post._id} />
      <section className="container mx-auto px-0 sm:px-5">
        <Post {...post} />
        <hr className="mt-28 mb-24" />
        <div className="mx-4 sm:mx-0">
          <MoreStories morePosts={morePostsData.blog.posts.items} title="Más Posteos" />
        </div>
      </section>
    </main>
  )
}
