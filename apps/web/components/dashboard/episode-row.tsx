import Link from "next/link"
import { AudioLines, Clock, Upload, UserCheck } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type { Episode } from "@/lib/data"

function fmtDuration(s?: number) {
  if (!s) return "—"
  const m = Math.floor(s / 60)
  const sec = Math.round(s % 60)
  return `${m}:${String(sec).padStart(2, "0")}`
}

function fmtDate(iso?: string) {
  if (!iso) return "unpublished"
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function statusChip(ep: Episode) {
  const active = ep.stages.find((s) => s.status === "running" || s.status === "pending_approval")
  if (active?.status === "pending_approval") {
    return {
      label: "Awaiting review",
      icon: UserCheck,
      tone: "text-on-air border-on-air/40 bg-on-air/10",
    }
  }
  if (active?.status === "running") {
    return {
      label: "In production",
      icon: AudioLines,
      tone: "text-signal border-signal/40 bg-signal/10",
    }
  }
  if (ep.publishedAt) {
    return {
      label: ep.mode === "human_upload" ? "Published · upload" : "Published",
      icon: ep.mode === "human_upload" ? Upload : AudioLines,
      tone: "text-muted-foreground border-border bg-muted/40",
    }
  }
  return {
    label: "Draft",
    icon: Clock,
    tone: "text-muted-foreground border-border bg-muted/40",
  }
}

export function EpisodeRow({ ep }: { ep: Episode }) {
  const chip = statusChip(ep)
  return (
    <Link
      href={`/dashboard/episodes/${ep.id}`}
      className="group grid grid-cols-[3.25rem_minmax(0,1fr)_auto_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/20"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ep.coverArtUrl ?? "https://picsum.photos/seed/podviva/200"}
        alt=""
        className="size-12 rounded-md object-cover ring-1 ring-border/60"
      />
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-2 text-[0.7rem]">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-mono uppercase tracking-wider",
              chip.tone,
            )}
          >
            <chip.icon className="size-3" />
            {chip.label}
          </span>
          <span className="font-mono text-muted-foreground">{fmtDate(ep.publishedAt)}</span>
        </div>
        <h3 className="truncate pt-1 text-[0.95rem] font-medium text-foreground">{ep.title}</h3>
        <p className="truncate text-[0.75rem] text-muted-foreground">{ep.description}</p>
      </div>
      <span className="font-mono text-[0.8rem] text-muted-foreground">
        {fmtDuration(ep.durationSeconds)}
      </span>
      <span className="nums-tabular font-mono text-[0.85rem] text-foreground">
        {ep.totalListens > 0 ? ep.totalListens.toLocaleString() : "—"}
      </span>
    </Link>
  )
}
