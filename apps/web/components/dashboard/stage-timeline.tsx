import { Check, Circle, Loader2, TriangleAlert, UserCheck } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type { EpisodeStage, StageName } from "@/lib/data"

const stageLabel: Record<StageName, string> = {
  research: "Research",
  script: "Script",
  voice_cast: "Voice cast",
  tts: "TTS",
  artwork: "Artwork",
  assemble: "Assemble",
  publish: "Publish",
}

function fmtDuration(ms?: number) {
  if (!ms) return null
  if (ms < 1000) return `${ms}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`
}

export function StageTimeline({
  stages,
  variant = "rail",
}: {
  stages: EpisodeStage[]
  variant?: "rail" | "list"
}) {
  if (variant === "rail") {
    return (
      <div className="flex w-full overflow-hidden rounded-lg border border-border/70 bg-card/70">
        {stages.map((s, i) => {
          const last = i === stages.length - 1
          const { icon: Icon, tone, label: statusLabel } = stageVisual(s)
          return (
            <div
              key={s.name}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col gap-1 px-3 py-3",
                !last && "border-r border-border/60",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {i + 1} · {stageLabel[s.name]}
                </span>
                <Icon className={cn("size-3.5", tone)} />
              </div>
              <div className="flex items-center gap-1 text-[0.72rem] font-mono">
                <span className={tone}>{statusLabel}</span>
              </div>
              <p className="line-clamp-2 text-[0.7rem] text-muted-foreground">{s.summary ?? ""}</p>
              {s.durationMs && (
                <span className="mt-auto font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground/70">
                  {fmtDuration(s.durationMs)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <ol className="flex flex-col gap-0">
      {stages.map((s, i) => {
        const { icon: Icon, tone, label } = stageVisual(s)
        const isLast = i === stages.length - 1
        return (
          <li key={s.name} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[0.95rem] top-7 bottom-0 w-px bg-gradient-to-b from-border to-border/30"
              />
            )}
            <div
              className={cn(
                "relative z-10 flex size-[1.9rem] shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-inset-glow",
                tone,
              )}
            >
              <Icon className="size-3.5" />
            </div>
            <div className="flex min-w-0 flex-col gap-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-display text-[1rem] tracking-tight text-foreground">
                  {stageLabel[s.name]}
                </span>
                <span className={cn("font-mono text-[0.7rem] uppercase tracking-wider", tone)}>
                  {label}
                </span>
                {s.durationMs && (
                  <span className="font-mono text-[0.7rem] text-muted-foreground">
                    {fmtDuration(s.durationMs)}
                  </span>
                )}
              </div>
              {s.summary && <p className="text-[0.85rem] text-muted-foreground">{s.summary}</p>}
              {s.detail && (
                <span className="font-mono text-[0.7rem] text-muted-foreground/80">
                  {s.detail}
                </span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function stageVisual(s: EpisodeStage) {
  switch (s.status) {
    case "completed":
      return { icon: Check, tone: "text-success", label: "Done" }
    case "running":
      return { icon: Loader2, tone: "text-signal animate-spin", label: "Running" }
    case "pending_approval":
      return { icon: UserCheck, tone: "text-on-air", label: "Awaiting you" }
    case "failed":
      return { icon: TriangleAlert, tone: "text-destructive", label: "Failed" }
    default:
      return { icon: Circle, tone: "text-muted-foreground/60", label: "Pending" }
  }
}
