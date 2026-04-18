import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { getPost, posts } from "@/lib/marketing/blog"

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16">
      <Link
        href="/blog"
        className="inline-flex w-fit items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> Field notes
      </Link>

      <header className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="text-signal">{post.category}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" /> {post.readingMinutes} min
          </span>
        </div>
        <h1 className="font-display text-[2.6rem] leading-[1.04] tracking-tight md:text-[3.4rem]">
          {post.title}
        </h1>
        <p className="text-[1.05rem] leading-relaxed text-muted-foreground">{post.excerpt}</p>
      </header>

      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.heroImage}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"
        />
      </div>

      <div className="flex items-center gap-4 border-y border-border/50 py-4">
        <div className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-muted/50 font-mono text-[0.85rem] uppercase">
          {post.author.avatarSeed.slice(0, 2)}
        </div>
        <div className="flex flex-col">
          <span className="text-[0.95rem] text-foreground">{post.author.name}</span>
          <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
            {post.author.role}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6 [&_p]:text-[1.05rem] [&_p]:leading-[1.75] [&_p]:text-foreground/90">
        {post.content.map((block, i) => {
          if (block.kind === "h2") {
            return (
              <h2
                key={i}
                className="mt-4 font-display text-[1.8rem] leading-tight tracking-tight"
              >
                {block.text}
              </h2>
            )
          }
          if (block.kind === "quote") {
            return (
              <blockquote
                key={i}
                className="border-l-2 border-signal/60 pl-5 font-display text-[1.4rem] italic leading-snug tracking-tight text-foreground"
              >
                &ldquo;{block.text}&rdquo;
              </blockquote>
            )
          }
          if (block.kind === "list") {
            return (
              <ul key={i} className="flex flex-col gap-2 pl-4">
                {block.items?.map((it) => (
                  <li
                    key={it}
                    className="relative pl-5 text-[1rem] leading-relaxed text-foreground/85"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-[0.7rem] size-1.5 rounded-full bg-signal"
                    />
                    {it}
                  </li>
                ))}
              </ul>
            )
          }
          return <p key={i}>{block.text}</p>
        })}
      </div>

      <hr className="border-border/60" />

      <section className="flex flex-col gap-4">
        <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          Keep reading
        </h3>
        <ul className="flex flex-col divide-y divide-border/60">
          {related.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex items-center justify-between gap-4 py-4"
              >
                <div className="flex min-w-0 flex-col">
                  <span
                    className={cn(
                      "font-display text-[1.15rem] leading-tight tracking-tight transition-colors",
                      "group-hover:text-signal",
                    )}
                  >
                    {p.title}
                  </span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                    {p.category} · {p.readingMinutes} min
                  </span>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
