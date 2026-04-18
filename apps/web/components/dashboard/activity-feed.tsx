import Link from "next/link"
import { BellRing, CheckCircle2, Globe2, Sparkles, Wand2 } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type { ActivityItem } from "@/lib/data"

const iconMap = {
  alert: BellRing,
  check: CheckCircle2,
  globe: Globe2,
  spark: Sparkles,
  sparkle: Wand2,
} as const

const toneMap: Record<ActivityItem["kind"], string> = {
  approval_requested: "text-on-air",
  episode_published: "text-success",
  stage_started: "text-signal",
  stage_completed: "text-muted-foreground",
  translation_ready: "text-foreground",
  distribution_published: "text-success",
  show_created: "text-signal",
}

function timeAgo(iso: string) {
  const now = new Date("2026-04-19T08:30:00Z").getTime()
  const then = new Date(iso).getTime()
  const s = Math.max(1, Math.floor((now - then) / 1000))
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 48) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2 py-6 text-left">
        <p className="font-display text-[1.05rem] leading-tight tracking-tight">Quiet in here.</p>
        <p className="text-[0.85rem] text-muted-foreground">
          Pipeline events — stage starts, approvals, publishes, translation completions — will
          stream here as they happen.
        </p>
      </div>
    )
  }
  return (
    <ol className="relative flex flex-col">
      <span
        aria-hidden
        className="pointer-events-none absolute left-[0.95rem] top-3 bottom-3 w-px bg-gradient-to-b from-border via-border/60 to-transparent"
      />
      {items.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Sparkles
        return (
          <li key={item.id} className="relative flex gap-3 py-2 pl-0">
            <div
              className={cn(
                "relative z-10 flex size-[1.9rem] shrink-0 items-center justify-center rounded-full border border-border/80 bg-card shadow-inset-glow",
                toneMap[item.kind],
              )}
            >
              <Icon className="size-3.5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col pt-0.5">
              <p className="truncate text-[0.85rem] text-foreground">
                {item.showName && (
                  <Link
                    href={item.showId ? `/dashboard/shows/${item.showId}` : "#"}
                    className="font-medium hover:underline"
                  >
                    {item.showName}
                  </Link>
                )}
                {item.episodeTitle && (
                  <>
                    <span className="text-muted-foreground"> · </span>
                    {item.episodeId ? (
                      <Link
                        href={`/dashboard/episodes/${item.episodeId}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {item.episodeTitle}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">{item.episodeTitle}</span>
                    )}
                  </>
                )}
              </p>
              <p className="truncate text-[0.75rem] text-muted-foreground">{item.message}</p>
            </div>
            <span className="shrink-0 pt-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              {timeAgo(item.at)}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
