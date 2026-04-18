import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import type { ApprovalItem, StageName } from "@/lib/data"

const stageLabel: Record<StageName, string> = {
  research: "Research",
  script: "Script",
  voice_cast: "Voice",
  tts: "TTS",
  artwork: "Artwork",
  assemble: "Assemble",
  publish: "Publish",
}

function waitingLabel(mins: number) {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

export function ApprovalsList({ items }: { items: ApprovalItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 py-8 text-center">
        <p className="font-display text-[1.05rem] tracking-tight">All clear.</p>
        <p className="text-[0.8rem] text-muted-foreground">
          Nothing waiting on your review right now.
        </p>
      </div>
    )
  }
  return (
    <ul className="flex flex-col divide-y divide-border/70">
      {items.map((item) => (
        <li key={item.episodeId} className="group relative flex flex-col gap-3 py-3">
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.showCoverUrl}
              alt=""
              className="size-10 shrink-0 rounded-md object-cover ring-1 ring-border/60"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-2 text-[0.7rem]">
                <span className="font-mono uppercase tracking-[0.14em] text-on-air">
                  {stageLabel[item.stage]} gate
                </span>
                <span className="text-muted-foreground/60">·</span>
                <span className="font-mono text-muted-foreground">
                  waiting {waitingLabel(item.waitingSinceMinutes)}
                </span>
              </div>
              <h3 className="truncate text-[0.95rem] font-medium text-foreground">
                {item.episodeTitle}
              </h3>
              <p className="truncate text-[0.75rem] text-muted-foreground">
                {item.showName}
                {item.summary ? ` · ${item.summary}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-[3.25rem]">
            <Button asChild size="xs" variant="outline">
              <Link href={`/dashboard/episodes/${item.episodeId}`}>
                Review
                <ArrowUpRight className="size-3" />
              </Link>
            </Button>
            <Button size="xs" variant="ghost">
              Approve
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
