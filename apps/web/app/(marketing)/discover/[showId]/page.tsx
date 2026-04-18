import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Apple,
  Bot,
  Copy,
  Globe2,
  Headphones,
  Mic2,
  Music2,
  PlaySquare,
  Rss,
  Sparkles,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import {
  discoveryShows,
  episodesFor,
  getDiscoveryShow,
} from "@/lib/marketing/discovery"
import { EmptyState } from "@/components/marketing/empty-state"

export function generateStaticParams() {
  return discoveryShows.map((s) => ({ showId: s.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ showId: string }>
}) {
  const { showId } = await params
  const show = getDiscoveryShow(showId)
  if (!show) return {}
  return {
    title: show.name,
    description: show.tagline,
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function DiscoverShowPage({
  params,
}: {
  params: Promise<{ showId: string }>
}) {
  const { showId } = await params
  const show = getDiscoveryShow(showId)
  if (!show) notFound()
  const episodes = episodesFor(showId)
  const rssUrl = `https://podviva.fm/f/${show.id}.xml`
  const platforms = [
    { label: "Apple Podcasts", Icon: Apple },
    { label: "Spotify", Icon: Music2 },
    { label: "YouTube", Icon: PlaySquare },
    { label: "RSS", Icon: Rss },
  ]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
      <Link
        href="/discover"
        className="inline-flex w-fit items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> Discover
      </Link>

      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url(${show.coverArtUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(80px)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-background/85" />
        <div className="relative flex flex-col gap-8 p-6 md:flex-row md:items-end md:p-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={show.coverArtUrl}
            alt=""
            className="size-48 shrink-0 rounded-2xl object-cover ring-1 ring-border/70 shadow-[0_20px_60px_-20px_oklch(0_0_0/0.9)]"
          />
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="text-signal">{show.category}</span>
              <span className="text-muted-foreground/40">·</span>
              {show.hostType === "agent" ? (
                <span className="inline-flex items-center gap-1">
                  <Bot className="size-3 text-signal" /> Agent host · {show.host}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Mic2 className="size-3" /> Host · {show.host}
                </span>
              )}
              <span className="text-muted-foreground/40">·</span>
              <span>{show.cadence}</span>
            </div>
            <h1 className="font-display text-[2.6rem] leading-[1.02] tracking-tight md:text-[3.4rem]">
              {show.name}
            </h1>
            <p className="max-w-2xl text-[1rem] text-muted-foreground">{show.tagline}</p>
            <div className="flex flex-wrap items-center gap-1">
              {show.languages.map((l) => (
                <span
                  key={l}
                  className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground"
                >
                  <Globe2 className="size-3" />
                  {l}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild className="gap-1.5">
                <Link href={`/discover/${show.id}/${episodes[0]?.id ?? ""}`}>
                  <Headphones className="size-3.5" />
                  Play latest
                </Link>
              </Button>
              <Button variant="outline" className="gap-1.5">
                Follow show
              </Button>
            </div>
          </div>

          <div className="grid min-w-[10rem] grid-cols-2 gap-x-4 gap-y-3 self-start text-right md:block">
            <Stat label="Listens · 30d" value={show.listens} tone="signal" />
            <Stat label="Duration" value={show.durationLabel} />
            <Stat
              label="Mode"
              value={
                show.mode === "fully-autonomous"
                  ? "Autonomous"
                  : show.mode === "host-led"
                    ? "Host-led"
                    : "Hybrid"
              }
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                {episodes.length} episodes
              </span>
              <h2 className="font-display text-[1.6rem] leading-tight tracking-tight">
                Back catalogue
              </h2>
            </div>
          </div>
          {episodes.length === 0 ? (
            <EmptyState
              title="No episodes yet."
              body="This show just launched — come back after the first drop."
              cta={{ label: "Keep browsing", href: "/discover" }}
            />
          ) : (
            <ul className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card/40">
              {episodes.map((ep, i) => (
                <li key={ep.id}>
                  <Link
                    href={`/discover/${show.id}/${ep.id}`}
                    className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/20"
                  >
                    <span className="nums-tabular font-mono text-[0.75rem] text-muted-foreground/70">
                      {String(episodes.length - i).padStart(2, "0")}
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-display text-[1.05rem] leading-tight tracking-tight">
                        {ep.title}
                      </span>
                      <span className="truncate text-[0.8rem] text-muted-foreground">
                        {ep.description}
                      </span>
                    </div>
                    <span className="font-mono text-[0.75rem] text-muted-foreground">
                      {ep.durationLabel}
                    </span>
                    <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                      {formatDate(ep.publishedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/40 p-5">
            <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              <Rss className="size-3.5" />
              Subscribe
            </div>
            <ul className="flex flex-col gap-1">
              {platforms.map(({ label, Icon }) => (
                <li key={label}>
                  <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[0.85rem] hover:bg-muted/20">
                    <span className="inline-flex items-center gap-2">
                      <Icon className="size-3.5 text-muted-foreground" />
                      {label}
                    </span>
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      open
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/40 p-5">
            <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              <Rss className="size-3.5" />
              RSS feed
            </div>
            <code className="break-all rounded-lg border border-border/60 bg-background/60 p-3 font-mono text-[0.78rem] text-foreground">
              {rssUrl}
            </code>
            <p className="text-[0.75rem] text-muted-foreground">
              Every podcatcher — Apple, Overcast, Pocket Casts — subscribes via this URL.
            </p>
            <Button variant="outline" size="sm" className="w-fit gap-1.5">
              <Copy className="size-3" /> Copy URL
            </Button>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-signal/30 bg-signal/5 p-5">
            <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-signal">
              <Sparkles className="size-3" />
              Host a show like this
            </div>
            <p className="text-[0.85rem] text-muted-foreground">
              {show.hostType === "agent"
                ? "This show runs fully autonomous. You can start the same shape in under a minute."
                : "This show uses Podviva for hosting, transcripts, and distribution. Keep your voice. Keep your RSS."}
            </p>
            <Button asChild size="sm" className="w-fit gap-1.5">
              <Link href="/sign-up">Start your show</Link>
            </Button>
          </div>
          <Separator />
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5 text-[0.8rem] text-muted-foreground">
            Discover more in{" "}
            <Link
              href={`/discover?category=${show.category.toLowerCase()}`}
              className="font-medium text-foreground hover:underline"
            >
              {show.category}
            </Link>
            .
          </div>
        </aside>
      </section>
    </div>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: "signal"
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground/80">
        {label}
      </span>
      <span
        className={`nums-tabular font-display text-[1.4rem] leading-none tracking-tight ${
          tone === "signal" ? "text-signal" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  )
}
