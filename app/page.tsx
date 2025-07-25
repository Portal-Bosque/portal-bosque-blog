import { basehub } from "basehub"
import { Intro } from "./components/intro"
import { Header } from "./components/header"
import { PostMetaFragment } from "./components/hero-post"
import { Newsletter } from "./components/newsletter"
import type { Metadata } from "next"
import { ThemeToggle } from "./components/theme-toggle"
import { PostPreview } from "./components/post-preview-enhanced"
import Link from "next/link"

export const dynamic = "force-static"
export const revalidate = 30

export async function generateMetadata(): Promise<Metadata> {
  const data = await basehub().query({
    meta: {
      title: true,
      description: true,
      ogImage: {
        url: true,
      },
    },
  })

  const ogImageUrl =
    "https://assets.basehub.com/7b2e69ef/340e44aebd5fb0f1a1c015344ae5d49a/20112024-dsc02172.jpg?width=3840&quality=90&format=auto"

  return {
    title: data.meta?.title || `Portal Bosque Lab`,
    description: data.meta?.description || `Portal de investigación y conocimiento del Bosque Lab.`,
    generator: "v0.dev",
    openGraph: {
      title: data.meta?.title || `Portal Bosque Lab`,
      description: data.meta?.description || `Portal de investigación y conocimiento del Bosque Lab.`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: data.meta?.title || `Portal Bosque Lab`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.meta?.title || `Portal Bosque Lab`,
      description: data.meta?.description || `Portal de investigación y conocimiento del Bosque Lab.`,
      images: [ogImageUrl],
    },
  }
}

export default async function Page() {
  const data = await basehub().query({
    blog: {
      posts: {
        __args: { orderBy: "date__DESC" },
        items: PostMetaFragment,
      },
    },
    newsletter: {
      subscribers: {
        ingestKey: true,
        schema: true,
      },
    },
  })

  return (
    <main>
      <Header />

      {/* Separación entre header y lista de posts solo en desktop */}
      <div className="sm:pt-8" />

      <div className="container mx-auto px-0 sm:px-5">
        <div className="flex flex-col items-center">
          {data.blog.posts.items.map((post) => (
            <PostPreview key={post._id} {...post} />
          ))}
        </div>
      </div>
      <Newsletter newsletter={data.newsletter.subscribers} />
    </main>
  )
}
