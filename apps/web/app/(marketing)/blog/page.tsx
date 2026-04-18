import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

import { posts } from "@/lib/marketing/blog"

export const metadata = {
  title: "Field notes",
  description: "Essays from the Podviva control room.",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function BlogIndexPage() {
  const featured = posts.find((p) => p.featured) ?? posts[0]!
  const rest = posts.filter((p) => p.slug !== featured.slug)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20">
      <header className="flex flex-col gap-4">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          Field notes
        </span>
        <h1 className="max-w-3xl font-display text-[2.8rem] leading-[1.02] tracking-tight md:text-[3.6rem]">
          Writing from the <span className="italic text-signal">control room</span>.
        </h1>
        <p className="max-w-xl text-[1rem] text-muted-foreground">
          What we're building, what surprised us, and the posts we wish existed when we started.
        </p>
      </header>

      <Link
        href={`/blog/${featured.slug}`}
        className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/50 lg:grid lg:grid-cols-[1.1fr_1fr]"
      >
        <div className="relative aspect-[16/10] lg:aspect-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featured.heroImage}
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent lg:bg-gradient-to-r"
          />
        </div>
        <div className="flex flex-col justify-between gap-6 p-8 lg:p-12">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-signal">
              Editor's pick · {featured.category}
            </span>
            <h2 className="font-display text-[2.2rem] leading-tight tracking-tight md:text-[2.8rem]">
              {featured.title}
            </h2>
            <p className="text-[0.98rem] leading-relaxed text-muted-foreground">
              {featured.excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between text-[0.75rem] text-muted-foreground">
            <div className="flex items-center gap-3">
              <Avatar seed={featured.author.avatarSeed} />
              <div className="flex flex-col">
                <span className="text-foreground">{featured.author.name}</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider">
                  {featured.author.role}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-wider">
              <span>{formatDate(featured.publishedAt)}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {featured.readingMinutes} min
              </span>
            </div>
          </div>
        </div>
      </Link>

      <section className="flex flex-col gap-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-[1.8rem] leading-tight tracking-tight md:text-[2.2rem]">
            Recent writing
          </h2>
          <Link
            href="/blog?feed=rss"
            className="inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            RSS <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-border"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.heroImage}
                  alt=""
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-signal">
                  {p.category}
                </span>
                <h3 className="font-display text-[1.2rem] leading-tight tracking-tight">
                  {p.title}
                </h3>
                <p className="line-clamp-3 text-[0.85rem] text-muted-foreground">{p.excerpt}</p>
              </div>
              <div className="mt-auto flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                <span>{formatDate(p.publishedAt)}</span>
                <span>{p.readingMinutes} min</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function Avatar({ seed }: { seed: string }) {
  return (
    <div className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-muted/50 font-mono text-[0.8rem] uppercase text-foreground">
      {seed.slice(0, 2)}
    </div>
  )
}
