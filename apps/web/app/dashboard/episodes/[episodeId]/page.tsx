import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Bot,
  Download,
  Gauge,
  Languages,
  Pause,
  Play,
  Share2,
  UserCheck,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { client } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/header"
import { Panel } from "@/components/dashboard/panel"
import { StageTimeline } from "@/components/dashboard/stage-timeline"
import { Waveform } from "@/components/dashboard/waveform"
import { DistributionGrid } from "@/components/dashboard/distribution-grid"

function fmtDuration(s?: number) {
  if (!s) return "—"
  const m = Math.floor(s / 60)
  const sec = Math.round(s % 60)
  return `${m}:${String(sec).padStart(2, "0")}`
}

function fmtDate(iso?: string) {
  if (!iso) return "unpublished"
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ episodeId: string }>
}) {
  const { episodeId } = await params
  const episode = await client.getEpisode(episodeId)
  if (!episode) notFound()
  const show = await client.getShow(episode.showId)
  if (!show) notFound()

  const approvalStage = episode.stages.find((s) => s.status === "pending_approval")
  const hasAudio = Boolean(episode.audioUrl)

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Control room", href: "/dashboard" },
          { label: "Shows", href: "/dashboard/shows" },
          { label: show.name, href: `/dashboard/shows/${show.id}` },
          { label: episode.title },
        ]}
      />

      <div className="flex flex-1 flex-col gap-8 px-6 pb-16 pt-6 lg:px-10">
        <Link
          href={`/dashboard/shows/${show.id}`}
          className="inline-flex w-fit items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3" /> {show.name}
        </Link>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              {episode.mode === "agent" ? (
                <span className="inline-flex items-center gap-1 text-signal">
                  <Bot className="size-3" /> Agent-produced
                </span>
              ) : (
                <span>Human upload</span>
              )}
              <span className="text-muted-foreground/50">·</span>
              <span>{fmtDate(episode.publishedAt ?? episode.createdAt)}</span>
              <span className="text-muted-foreground/50">·</span>
              <span>{fmtDuration(episode.durationSeconds)}</span>
            </div>
            <h1 className="font-display text-[2.4rem] leading-[1.05] tracking-tight md:text-[2.8rem]">
              {episode.title}
            </h1>
            <p className="max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
              {episode.description}
            </p>

            {approvalStage && (
              <div className="flex flex-col gap-3 rounded-2xl border border-on-air/40 bg-on-air/5 p-5 shadow-inset-glow md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-7 items-center justify-center rounded-full border border-on-air/50 bg-on-air/10 text-on-air">
                    <UserCheck className="size-3.5" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-on-air">
                      Awaiting your sign-off
                    </p>
                    <p className="text-[0.95rem] font-medium text-foreground">
                      {approvalStage.summary}
                    </p>
                    <p className="text-[0.78rem] text-muted-foreground">
                      Pipeline paused — stages after this won't run until you approve.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">Reject & regenerate</Button>
                  <Button>Approve & continue</Button>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 shadow-inset-glow">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage: `url(${episode.coverArtUrl ?? show.coverArtUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(80px)",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-card/70" />
            <div className="relative flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={episode.coverArtUrl ?? show.coverArtUrl}
                alt=""
                className="size-24 shrink-0 rounded-xl object-cover ring-1 ring-border/60 shadow-[0_10px_30px_-12px_oklch(0_0_0/0.8)]"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Listening booth
                </p>
                <p className="truncate font-display text-[1.05rem] tracking-tight">{show.name}</p>
                <p className="truncate text-[0.8rem] text-muted-foreground">
                  {show.voiceLabel}
                </p>
              </div>
            </div>

            {hasAudio ? (
              <div className="relative">
                <Waveform seed={episode.id.length * 13 + 7} bars={72} animated />
              </div>
            ) : (
              <div className="relative flex h-20 items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/20 text-[0.78rem] text-muted-foreground">
                Audio will appear here once TTS completes
              </div>
            )}

            <div className="relative flex items-center justify-between font-mono text-[0.7rem] text-muted-foreground">
              <span>00:00</span>
              <span>{fmtDuration(episode.durationSeconds)}</span>
            </div>

            <div className="relative flex items-center gap-2">
              <Button size="icon" className="rounded-full" disabled={!hasAudio}>
                {hasAudio ? <Play className="size-4" /> : <Pause className="size-4" />}
              </Button>
              <div className="ml-auto flex items-center gap-1">
                <Button size="icon-sm" variant="ghost" disabled={!hasAudio}>
                  <Download className="size-3.5" />
                </Button>
                <Button size="icon-sm" variant="ghost">
                  <Share2 className="size-3.5" />
                </Button>
              </div>
            </div>
            <div className="relative grid grid-cols-3 gap-2 pt-1 text-[0.75rem]">
              <MiniStat
                icon={<Gauge className="size-3" />}
                label="Listens"
                value={episode.totalListens > 0 ? episode.totalListens.toLocaleString() : "—"}
              />
              <MiniStat
                icon={<Languages className="size-3" />}
                label="Languages"
                value={episode.translations.length.toString()}
              />
              <MiniStat
                icon={<Share2 className="size-3" />}
                label="Platforms"
                value={episode.distributions.filter((d) => d.status === "published").length.toString()}
              />
            </div>
          </div>
        </section>

        <Panel
          label="Production pipeline"
          title="What happened, and what's next"
          description="Each stage writes its output here so you can see exactly how this episode got made"
        >
          <div className="overflow-x-auto">
            <StageTimeline stages={episode.stages} variant="rail" />
          </div>
          <Separator className="my-6" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <StageTimeline stages={episode.stages} variant="list" />
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                  Episode ID
                </p>
                <code className="font-mono text-[0.8rem] text-foreground">{episode.id}</code>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                  Created
                </p>
                <p className="text-[0.85rem]">{fmtDate(episode.createdAt)}</p>
              </div>
              {episode.publishedAt && (
                <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                    Published
                  </p>
                  <p className="text-[0.85rem]">{fmtDate(episode.publishedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </Panel>

        <Panel
          label="Distribution"
          title="Where this episode is landing"
          description="Per-platform publish status and first-day listens"
        >
          <DistributionGrid distributions={episode.distributions} />
        </Panel>

        <Panel
          label="Translations"
          title="Transcripts & subtitles"
          description="Auto-generated on publish · dubbed audio coming later"
        >
          {episode.translations.length === 0 ? (
            <p className="text-[0.85rem] text-muted-foreground">
              Translations will appear here once the episode is published.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {episode.translations.map((t) => (
                <li
                  key={t.language}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 p-4"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="font-display text-[1rem] leading-tight tracking-tight">
                      {t.label}
                    </span>
                    <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                      {t.language}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider ${
                      t.status === "ready"
                        ? "border-success/40 bg-success/10 text-success"
                        : t.status === "pending"
                          ? "border-signal/40 bg-signal/10 text-signal"
                          : "border-destructive/40 bg-destructive/10 text-destructive"
                    }`}
                  >
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  )
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border/60 bg-card/40 px-2 py-1.5">
      <span className="flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
        {icon} {label}
      </span>
      <span className="nums-tabular font-display text-[1.1rem] leading-none">{value}</span>
    </div>
  )
}
