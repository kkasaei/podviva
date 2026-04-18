import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Download,
  Globe2,
  Play,
  Share2,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  discoveryShows,
  episodesFor,
  getDiscoveryEpisode,
  getDiscoveryShow,
} from "@/lib/marketing/discovery"
import { Waveform } from "@/components/dashboard/waveform"

export function generateStaticParams() {
  return discoveryShows.flatMap((s) =>
    episodesFor(s.id).map((ep) => ({ showId: s.id, episodeId: ep.id })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ showId: string; episodeId: string }>
}) {
  const { showId, episodeId } = await params
  const ep = getDiscoveryEpisode(showId, episodeId)
  const show = getDiscoveryShow(showId)
  if (!ep || !show) return {}
  return {
    title: `${ep.title} · ${show.name}`,
    description: ep.description,
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function DiscoverEpisodePage({
  params,
}: {
  params: Promise<{ showId: string; episodeId: string }>
}) {
  const { showId, episodeId } = await params
  const ep = getDiscoveryEpisode(showId, episodeId)
  const show = getDiscoveryShow(showId)
  if (!ep || !show) notFound()

  const siblings = episodesFor(showId).filter((e) => e.id !== ep.id).slice(0, 3)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
      <Link
        href={`/discover/${show.id}`}
        className="inline-flex w-fit items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> {show.name}
      </Link>

      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="text-signal">{show.category}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{formatDate(ep.publishedAt)}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{ep.durationLabel}</span>
        </div>
        <h1 className="font-display text-[2.6rem] leading-[1.02] tracking-tight md:text-[3.2rem]">
          {ep.title}
        </h1>
        <p className="max-w-2xl text-[1rem] text-muted-foreground">{ep.description}</p>
      </header>

      <section className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-6 shadow-inset-glow">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url(${ep.coverArtUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(80px)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-card/80" />
        <div className="relative flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ep.coverArtUrl}
            alt=""
            className="size-24 shrink-0 rounded-xl object-cover ring-1 ring-border/60"
          />
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              Now playing
            </span>
            <Link
              href={`/discover/${show.id}`}
              className="truncate font-display text-[1.1rem] tracking-tight hover:underline"
            >
              {show.name}
            </Link>
            <span className="font-mono text-[0.75rem] text-muted-foreground">
              {show.host}
            </span>
          </div>
        </div>
        <div className="relative">
          <Waveform seed={ep.id.length * 17 + 3} bars={80} animated />
        </div>
        <div className="relative flex items-center justify-between font-mono text-[0.75rem] text-muted-foreground">
          <span>00:00</span>
          <span>{ep.durationLabel}</span>
        </div>
        <div className="relative flex items-center gap-2">
          <Button size="icon" className="rounded-full">
            <Play className="size-4" />
          </Button>
          <div className="ml-auto flex gap-1">
            <Button size="icon-sm" variant="ghost">
              <Download className="size-3.5" />
            </Button>
            <Button size="icon-sm" variant="ghost">
              <Share2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          Transcript languages
        </span>
        <div className="flex flex-wrap gap-1.5">
          {ep.transcriptLanguages.map((l) => (
            <span
              key={l}
              className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-success"
            >
              <Globe2 className="size-3" />
              {l}
            </span>
          ))}
        </div>
        <p className="text-[0.8rem] text-muted-foreground">
          Ready at publish time. Captions load with the player on supported hosts.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          More from {show.name}
        </h2>
        <ul className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card/40">
          {siblings.map((s) => (
            <li key={s.id}>
              <Link
                href={`/discover/${show.id}/${s.id}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/20"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-display text-[1rem] tracking-tight">
                    {s.title}
                  </span>
                  <span className="truncate text-[0.8rem] text-muted-foreground">
                    {s.description}
                  </span>
                </div>
                <span className="font-mono text-[0.7rem] text-muted-foreground">
                  {s.durationLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
