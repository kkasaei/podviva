import Link from "next/link"
import { ArrowUpRight, Bot, Mic2 } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type { DashboardSnapshot, StageName, StageStatus } from "@/lib/data"

const stageLabel: Record<StageName, string> = {
  research: "Research",
  script: "Script",
  voice_cast: "Voice",
  tts: "TTS",
  artwork: "Artwork",
  assemble: "Assemble",
  publish: "Publish",
}

function cadenceLabel(c: { count: number; unit: string }) {
  const unitLabel =
    c.unit === "daily" ? "day" : c.unit === "weekly" ? "week" : c.unit === "biweekly" ? "2w" : "month"
  return `${c.count}×/${unitLabel}`
}

function stageTone(status?: StageStatus) {
  if (status === "running") return "text-signal"
  if (status === "pending_approval") return "text-on-air"
  if (status === "failed") return "text-destructive"
  return "text-muted-foreground"
}

export function FleetTable({ rows }: { rows: DashboardSnapshot["showsSummary"] }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-border/70 bg-card/40 p-8">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
          Fleet
        </span>
        <div className="flex max-w-lg flex-col gap-1">
          <p className="font-display text-[1.3rem] leading-tight tracking-tight">
            No shows in your fleet yet.
          </p>
          <p className="text-[0.85rem] text-muted-foreground">
            Shows land here once you create one — agent-led or host-led. Both flow into the same
            pipeline surface.
          </p>
        </div>
        <Link
          href="/dashboard/shows/new"
          className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-foreground hover:bg-muted/60"
        >
          Start a show <ArrowUpRight className="size-3" />
        </Link>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card/60">
      <div className="grid grid-cols-[minmax(12rem,2fr)_minmax(6rem,1fr)_minmax(8rem,1.2fr)_minmax(7rem,1fr)_minmax(6rem,0.8fr)_auto] gap-2 border-b border-border/70 bg-muted/30 px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
        <span>Show</span>
        <span>Cadence</span>
        <span>Pipeline</span>
        <span className="text-right">Listens (30d)</span>
        <span className="text-right">Trend</span>
        <span className="sr-only">Open</span>
      </div>
      <ul className="divide-y divide-border/60">
        {rows.map((row) => {
          const trendPositive = row.trend30d >= 0
          return (
            <li
              key={row.id}
              className="group grid grid-cols-[minmax(12rem,2fr)_minmax(6rem,1fr)_minmax(8rem,1.2fr)_minmax(7rem,1fr)_minmax(6rem,0.8fr)_auto] items-center gap-2 px-4 py-3 text-[0.85rem] transition-colors hover:bg-muted/30"
            >
              <Link
                href={`/dashboard/shows/${row.id}`}
                className="flex min-w-0 items-center gap-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={row.coverArtUrl}
                  alt=""
                  className="size-9 shrink-0 rounded-md object-cover ring-1 ring-border/60"
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-foreground">{row.name}</span>
                  <span className="flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                    {row.createdBy === "agent" ? (
                      <>
                        <Bot className="size-3" /> Agent-authored
                      </>
                    ) : (
                      <>
                        <Mic2 className="size-3" /> Host-led
                      </>
                    )}
                  </span>
                </div>
              </Link>
              <span className="font-mono text-[0.75rem] text-muted-foreground">
                {cadenceLabel(row.cadence)}
              </span>
              <div className="flex items-center gap-2">
                {row.episodesInPipeline > 0 ? (
                  <>
                    <span
                      className={cn(
                        "inline-flex size-1.5 rounded-full",
                        row.latestStageStatus === "pending_approval"
                          ? "bg-on-air"
                          : "bg-signal",
                      )}
                    />
                    <span className={cn("font-mono text-[0.75rem]", stageTone(row.latestStageStatus))}>
                      {row.latestStage ? stageLabel[row.latestStage] : "queued"}
                    </span>
                    <span className="text-[0.7rem] text-muted-foreground">
                      · {row.episodesInPipeline} in flight
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-[0.75rem] text-muted-foreground/70">idle</span>
                )}
              </div>
              <span className="nums-tabular text-right font-mono">
                {row.totalListens.toLocaleString()}
              </span>
              <span
                className={cn(
                  "nums-tabular text-right font-mono text-[0.8rem]",
                  trendPositive ? "text-success" : "text-on-air",
                )}
              >
                {trendPositive ? "+" : ""}
                {row.trend30d.toFixed(1)}%
              </span>
              <Link
                href={`/dashboard/shows/${row.id}`}
                className="justify-self-end text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <ArrowUpRight className="size-4" />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
