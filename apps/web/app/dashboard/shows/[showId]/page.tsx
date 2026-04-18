import Link from "next/link"
import { notFound } from "next/navigation"
import { Bot, Calendar, Mic2, Plus, Radio, Sparkles, Volume2 } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { client } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/header"
import { EpisodeRow } from "@/components/dashboard/episode-row"
import { DistributionGrid } from "@/components/dashboard/distribution-grid"
import { Panel } from "@/components/dashboard/panel"

const CADENCE_UNIT: Record<string, string> = {
  daily: "daily",
  weekly: "weekly",
  biweekly: "every two weeks",
  monthly: "monthly",
}

function stageReadable(name: string) {
  return (
    {
      research: "Research",
      script: "Script",
      voice_cast: "Voice cast",
      tts: "TTS",
      artwork: "Artwork",
      assemble: "Assemble",
      publish: "Publish",
    }[name] ?? name
  )
}

export default async function ShowDetailPage({
  params,
}: {
  params: Promise<{ showId: string }>
}) {
  const { showId } = await params
  const [show, episodes] = await Promise.all([
    client.getShow(showId),
    client.listEpisodes(showId),
  ])
  if (!show) notFound()

  const latestDistributions = episodes[0]?.distributions ?? []
  const autonomyEntries = Object.entries(show.autonomyConfig)
  const approveCount = autonomyEntries.filter(([, v]) => v === "approve").length

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Control room", href: "/dashboard" },
          { label: "Shows", href: "/dashboard/shows" },
          { label: show.name },
        ]}
      />

      <div className="flex flex-1 flex-col gap-8 px-6 pb-16 pt-8 lg:px-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-inset-glow">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url(${show.coverArtUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(60px)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-background/85" />
          <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-end md:gap-8 md:p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={show.coverArtUrl}
              alt={show.name}
              className="size-40 shrink-0 rounded-2xl object-cover ring-1 ring-border/60 shadow-[0_10px_40px_-12px_oklch(0_0_0/0.9)]"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                {show.createdBy === "agent" ? (
                  <span className="inline-flex items-center gap-1 text-signal">
                    <Bot className="size-3" /> Agent-authored
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Mic2 className="size-3" /> Host-led
                  </span>
                )}
                <span className="text-muted-foreground/50">·</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" /> {CADENCE_UNIT[show.cadence.unit]}
                </span>
                <span className="text-muted-foreground/50">·</span>
                <span className="inline-flex items-center gap-1">
                  <Volume2 className="size-3" /> {show.voiceLabel}
                </span>
              </div>
              <h1 className="font-display text-[2.4rem] leading-[1.05] tracking-tight md:text-[2.8rem]">
                {show.name}
              </h1>
              <p className="max-w-2xl text-[0.95rem] text-muted-foreground">{show.concept}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {show.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button asChild>
                  <Link href={`/dashboard/shows/${show.id}/episodes/new`}>
                    <Plus className="size-3.5" /> New episode
                  </Link>
                </Button>
                <Button variant="outline">
                  <Sparkles className="size-3.5" /> Adjust autonomy
                </Button>
                <Button variant="ghost">View RSS feed</Button>
              </div>
            </div>

            <div className="grid min-w-[12rem] grid-cols-2 gap-x-4 gap-y-2 text-right md:block md:grid-cols-1">
              <Stat label="Episodes" value={show.episodeCount.toString()} />
              <Stat
                label="Listens · 30d"
                value={show.totalListens.toLocaleString()}
                tone={show.trend30d >= 0 ? "success" : "warn"}
                trend={`${show.trend30d >= 0 ? "+" : ""}${show.trend30d.toFixed(1)}%`}
              />
              <Stat label="Gated stages" value={approveCount.toString()} />
            </div>
          </div>
        </section>

        <Tabs defaultValue="episodes">
          <TabsList className="bg-transparent border-b border-border/60 rounded-none p-0 h-auto w-full justify-start gap-6">
            {[
              { value: "episodes", label: "Episodes" },
              { value: "autonomy", label: "Autonomy" },
              { value: "distribution", label: "Distribution" },
              { value: "translations", label: "Translations" },
            ].map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="relative rounded-none bg-transparent px-0 py-3 text-[0.85rem] text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2px] after:rounded-full after:bg-transparent data-[state=active]:after:bg-signal"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="episodes" className="pt-6">
            <Panel
              label={`${episodes.length} episodes`}
              title="All episodes"
              description="Drafts, in-production, and published"
              action={{
                label: "New episode",
                href: `/dashboard/shows/${show.id}/episodes/new`,
              }}
              contentClassName="px-0 py-0"
            >
              {episodes.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <p className="font-display text-[1.15rem]">No episodes yet.</p>
                  <p className="text-[0.85rem] text-muted-foreground">
                    Start the next one — agentic or from a finished file you already have.
                  </p>
                  <Button asChild className="mt-2">
                    <Link href={`/dashboard/shows/${show.id}/episodes/new`}>
                      <Plus className="size-3.5" /> New episode
                    </Link>
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-border/60">
                  {episodes.map((ep) => (
                    <li key={ep.id}>
                      <EpisodeRow ep={ep} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="autonomy" className="pt-6">
            <Panel
              label="Autonomy"
              title="Who decides what, at each stage"
              description="Toggle a stage to 'approve' and the agent will pause for your sign-off"
            >
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {autonomyEntries.map(([name, mode]) => {
                  const approving = mode === "approve"
                  return (
                    <li
                      key={name}
                      className={`flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/60 p-4 ${approving ? "ring-1 ring-on-air/30" : ""}`}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                          Stage
                        </span>
                        <span className="font-display text-[1rem] tracking-tight">
                          {stageReadable(name)}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider ${
                          approving
                            ? "border-on-air/50 bg-on-air/10 text-on-air"
                            : "border-border bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        {approving ? "Approve gate" : "Auto"}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <Separator className="my-6" />
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-4">
                <div>
                  <p className="text-[0.85rem] font-medium">Voice identity</p>
                  <p className="text-[0.75rem] text-muted-foreground">
                    Locked across every episode unless you unpin it.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[0.8rem]">
                  <Radio className="size-4 text-signal" />
                  {show.voiceLabel}
                </div>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="distribution" className="pt-6">
            <Panel
              label="Distribution"
              title="Where new episodes land"
              description="Connected platforms + RSS feed for podcatchers"
            >
              <DistributionGrid distributions={latestDistributions} />
              <Separator className="my-6" />
              <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/10 p-4">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                  RSS feed
                </span>
                <code className="break-all font-mono text-[0.8rem] text-foreground">
                  https://podviva.fm/f/{show.id}.xml
                </code>
                <p className="text-[0.75rem] text-muted-foreground">
                  Podcatchers (Apple, Overcast, Pocket Casts) ingest from this URL automatically.
                </p>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="translations" className="pt-6">
            <Panel
              label="Translations"
              title="Transcripts & subtitles per episode"
              description="Auto-generated on publish. Dubbed audio coming later."
            >
              {episodes.filter((e) => e.translations.length > 0).length === 0 ? (
                <p className="text-[0.85rem] text-muted-foreground">No translations yet.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {episodes
                    .filter((e) => e.translations.length > 0)
                    .map((ep) => (
                      <li
                        key={ep.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/40 p-4"
                      >
                        <Link
                          href={`/dashboard/episodes/${ep.id}`}
                          className="flex min-w-0 flex-1 flex-col"
                        >
                          <span className="truncate text-[0.9rem] font-medium">{ep.title}</span>
                          <span className="truncate text-[0.75rem] text-muted-foreground">
                            {ep.translations.length} languages
                          </span>
                        </Link>
                        <div className="flex flex-wrap items-center gap-1">
                          {ep.translations.map((t) => (
                            <span
                              key={t.language}
                              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider ${
                                t.status === "ready"
                                  ? "border-success/40 bg-success/10 text-success"
                                  : t.status === "pending"
                                    ? "border-signal/40 bg-signal/10 text-signal"
                                    : "border-destructive/40 bg-destructive/10 text-destructive"
                              }`}
                            >
                              {t.language}
                            </span>
                          ))}
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

function Stat({
  label,
  value,
  tone,
  trend,
}: {
  label: string
  value: string
  tone?: "success" | "warn"
  trend?: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground/80">
        {label}
      </span>
      <span className="nums-tabular font-display text-[1.4rem] leading-none text-foreground">
        {value}
      </span>
      {trend && (
        <span
          className={`nums-tabular font-mono text-[0.75rem] ${tone === "success" ? "text-success" : "text-on-air"}`}
        >
          {trend}
        </span>
      )}
    </div>
  )
}
