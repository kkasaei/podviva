import Link from "next/link"
import { Apple, ExternalLink, Music2, PlaySquare, Rss } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type { Distribution, DistributionPlatform } from "@/lib/data"

const meta: Record<
  DistributionPlatform,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  rss: { label: "RSS", Icon: Rss },
  youtube: { label: "YouTube", Icon: PlaySquare },
  apple: { label: "Apple Podcasts", Icon: Apple },
  spotify: { label: "Spotify", Icon: Music2 },
}

const statusTone = {
  published: "text-success",
  pending: "text-signal",
  failed: "text-destructive",
  disabled: "text-muted-foreground/50",
} as const

export function DistributionGrid({ distributions }: { distributions: Distribution[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {distributions.map((d) => {
        const m = meta[d.platform]
        return (
          <div
            key={d.platform}
            className={cn(
              "group relative flex flex-col gap-2 rounded-xl border border-border/70 bg-card/60 p-4 shadow-inset-glow",
              d.status === "disabled" && "opacity-60",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md border border-border bg-muted/50">
                  <m.Icon className="size-3.5" />
                </span>
                <span className="font-display text-[0.95rem] tracking-tight">{m.label}</span>
              </div>
              {d.externalUrl && (
                <Link
                  href={d.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground/60 hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                </Link>
              )}
            </div>
            <div
              className={cn(
                "font-mono text-[0.7rem] uppercase tracking-wider",
                statusTone[d.status],
              )}
            >
              {d.status}
            </div>
            {d.listens24h != null && d.status === "published" && (
              <div className="mt-auto flex items-baseline gap-1">
                <span className="nums-tabular font-display text-[1.4rem] leading-none">
                  {d.listens24h.toLocaleString()}
                </span>
                <span className="text-[0.7rem] text-muted-foreground">listens · 24h</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
