import Link from "next/link"
import { Apple, ExternalLink, Rss, Music2, PlaySquare } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type { DistributionPlatform, RecentPublish } from "@/lib/data"

const platformMeta: Record<
  DistributionPlatform,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  rss: { label: "RSS", Icon: Rss },
  youtube: { label: "YouTube", Icon: PlaySquare },
  apple: { label: "Apple", Icon: Apple },
  spotify: { label: "Spotify", Icon: Music2 },
}

function relativeDate(iso: string) {
  const now = new Date("2026-04-19T08:30:00Z").getTime()
  const then = new Date(iso).getTime()
  const days = Math.floor((now - then) / 86_400_000)
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function RecentPublishes({ items }: { items: RecentPublish[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2 py-8 text-left">
        <p className="font-display text-[1.1rem] leading-tight tracking-tight">
          Nothing's shipped yet.
        </p>
        <p className="text-[0.85rem] text-muted-foreground">
          Your first publish will show up here with every platform it landed on, plus first-day
          listens per channel.
        </p>
      </div>
    )
  }
  return (
    <ul className="flex flex-col divide-y divide-border/70">
      {items.map((item) => (
        <li key={item.episodeId} className="group flex items-center gap-3 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.showCoverUrl}
            alt=""
            className="size-11 shrink-0 rounded-md object-cover ring-1 ring-border/60"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <Link
              href={`/dashboard/episodes/${item.episodeId}`}
              className="truncate text-[0.9rem] font-medium text-foreground hover:underline"
            >
              {item.episodeTitle}
            </Link>
            <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground">
              <Link
                href={`/dashboard/shows/${item.showId}`}
                className="truncate hover:text-foreground"
              >
                {item.showName}
              </Link>
              <span className="text-muted-foreground/50">·</span>
              <span className="font-mono">{relativeDate(item.publishedAt)}</span>
            </div>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            {item.distributions
              .filter((d) => d.status === "published")
              .map((d) => {
                const meta = platformMeta[d.platform]
                return (
                  <span
                    key={d.platform}
                    title={meta.label}
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md border border-border/70 bg-muted/40 text-muted-foreground",
                    )}
                  >
                    <meta.Icon className="size-3" />
                  </span>
                )
              })}
          </div>
          <div className="flex flex-col items-end gap-0.5 pl-2">
            <span className="nums-tabular font-mono text-[0.85rem] text-foreground">
              {item.listens24h.toLocaleString()}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              24h
            </span>
          </div>
          <Link
            href={`/dashboard/episodes/${item.episodeId}`}
            className="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ExternalLink className="size-3.5" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
