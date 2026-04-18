import Link from "next/link"
import { Bot, Mic2, Play } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type { DiscoveryShow } from "@/lib/marketing/discovery"

export function PodcastCard({
  show,
  size = "md",
  className,
}: {
  show: DiscoveryShow
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const aspect = size === "lg" ? "aspect-[4/5]" : size === "sm" ? "aspect-square" : "aspect-[4/5]"
  return (
    <Link
      href={`/discover/${show.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 transition-transform duration-300 hover:-translate-y-1 hover:border-border",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden", aspect)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={show.coverArtUrl}
          alt={show.name}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-90"
        />
        <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2 text-[0.65rem]">
          <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/75 px-2 py-0.5 font-mono uppercase tracking-wider text-muted-foreground backdrop-blur">
            {show.hostType === "agent" ? (
              <>
                <Bot className="size-3 text-signal" /> Agent
              </>
            ) : (
              <>
                <Mic2 className="size-3" /> Host
              </>
            )}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/75 px-2 py-0.5 font-mono uppercase tracking-wider text-muted-foreground backdrop-blur"
          >
            {show.durationLabel}
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1">
          <span
            className="font-mono text-[0.65rem] uppercase tracking-[0.14em]"
            style={{ color: show.accent }}
          >
            {show.category}
          </span>
          <h3 className="font-display text-[1.3rem] leading-tight tracking-tight text-foreground">
            {show.name}
          </h3>
        </div>
        <button
          type="button"
          aria-label="Play preview"
          className="absolute right-4 bottom-4 grid size-9 place-items-center rounded-full bg-foreground text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <Play className="size-3.5 fill-current" />
        </button>
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">
        <p className="line-clamp-2 text-[0.82rem] text-muted-foreground">{show.tagline}</p>
        <div className="flex items-center justify-between font-mono text-[0.7rem] text-muted-foreground/80">
          <span>{show.cadence}</span>
          <span className="nums-tabular">{show.listens}</span>
        </div>
      </div>
    </Link>
  )
}
