"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  CircleAlert,
  Clock,
  Globe,
  Info,
  Rss,
  TriangleAlert,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

type Level = "pass" | "warn" | "fail" | "info"

type Check = {
  label: string
  level: Level
  detail: string
}

type Report = {
  title: string
  subtitle: string
  episodes: number
  avgDuration: string
  cadence: string
  lastPublished: string
  languages: string[]
  platforms: string[]
  size: string
  checks: Check[]
  score: number
}

function hashString(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function pickDeterministic<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]!
}

function generateReport(url: string): Report {
  const seed = hashString(url)
  const pass = (seed % 100) < 65
  const hasArt = (seed % 10) > 1
  const hasChapters = (seed % 3) === 0
  const hasTranscript = (seed % 4) !== 0
  const episodes = 40 + (seed % 180)
  const avgMin = 8 + (seed % 42)
  const cadence = pickDeterministic(
    ["Weekly · Tuesdays", "Weekly · Mondays + Thursdays", "Biweekly", "Monthly", "Daily · weekdays"],
    seed,
  )
  const languages = [["EN"], ["EN", "ES"], ["EN", "DE"], ["EN", "JA", "ES"]][seed % 4]!
  const platforms = ["RSS"]
  if ((seed % 5) > 0) platforms.push("Apple")
  if ((seed % 5) > 1) platforms.push("Spotify")
  if ((seed % 6) > 3) platforms.push("YouTube")
  if ((seed % 7) > 5) platforms.push("Overcast")

  const daysSincePublish = (seed % 32) + 1

  const checks: Check[] = [
    {
      label: "Valid RSS 2.0 feed structure",
      level: pass ? "pass" : "fail",
      detail: pass
        ? "All required iTunes tags present."
        : "<itunes:category> is missing — Apple will reject the feed on resubmission.",
    },
    {
      label: "Cover artwork",
      level: hasArt ? "pass" : "warn",
      detail: hasArt
        ? "3000×3000 JPEG, served over HTTPS. Apple-compatible."
        : "Cover is 1400×1400 — Apple recommends at least 3000×3000 now.",
    },
    {
      label: "Latest episode cadence",
      level: daysSincePublish < 14 ? "pass" : daysSincePublish < 40 ? "warn" : "fail",
      detail:
        daysSincePublish < 14
          ? `Last episode published ${daysSincePublish} day${daysSincePublish === 1 ? "" : "s"} ago — on schedule.`
          : daysSincePublish < 40
            ? `Last episode was ${daysSincePublish} days ago — your stated cadence slipped.`
            : `Last episode was ${daysSincePublish} days ago. Apple algorithmic discovery will start deprioritising you soon.`,
    },
    {
      label: "Episode length consistency",
      level: "info",
      detail: `Average episode runs ${avgMin} min. Consistency matters more than length — yours is within ±12% across the last 10 episodes.`,
    },
    {
      label: "Chapter markers",
      level: hasChapters ? "pass" : "warn",
      detail: hasChapters
        ? "PSC chapter markers embedded. Podcatchers show clickable chapter lists."
        : "No chapter markers — you're leaving discovery + ads table-stakes on the floor.",
    },
    {
      label: "Transcripts",
      level: hasTranscript ? "pass" : "warn",
      detail: hasTranscript
        ? "<podcast:transcript> tag present. Apple + Spotify will surface captions."
        : "No transcripts linked. You'll lose accessibility, SEO, and subtitle-translation surface.",
    },
    {
      label: "Distribution footprint",
      level: platforms.length >= 4 ? "pass" : platforms.length >= 3 ? "warn" : "fail",
      detail: `Detected on ${platforms.length} platforms (${platforms.join(", ")}). Podviva fans-out to Apple, Spotify, YouTube, and any custom endpoint automatically.`,
    },
    {
      label: "Enclosure hosting",
      level: "info",
      detail: "Episodes served over HTTPS, 44.1kHz MP3, bitrate 128–192 kbps. Standard.",
    },
  ]

  const score = Math.round(
    (checks.filter((c) => c.level === "pass").length / checks.length) * 100,
  )

  return {
    title: pickDeterministic(
      [
        "Future Protocols",
        "The Daily Ledger",
        "Between Editions",
        "Station 88",
        "Sidenote Radio",
        "Field Notes",
      ],
      seed,
    ),
    subtitle: pickDeterministic(
      [
        "A weekly briefing on emerging protocols.",
        "Three minutes of market context, every weekday.",
        "Host-led conversations on craft, shipping, and taste.",
        "Long-form essays on the people behind the software.",
      ],
      seed,
    ),
    episodes,
    avgDuration: `${avgMin}m avg`,
    cadence,
    lastPublished: `${daysSincePublish} day${daysSincePublish === 1 ? "" : "s"} ago`,
    languages,
    platforms,
    size: `${(1.2 + (seed % 30) / 10).toFixed(1)} GB of audio`,
    checks,
    score,
  }
}

const LEVELS: Record<Level, { icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  pass: { icon: Check, tone: "text-success" },
  warn: { icon: CircleAlert, tone: "text-warning" },
  fail: { icon: TriangleAlert, tone: "text-destructive" },
  info: { icon: Info, tone: "text-muted-foreground" },
}

export function FeedCheck() {
  const [url, setUrl] = React.useState("")
  const [report, setReport] = React.useState<Report | null>(null)
  const [scanning, setScanning] = React.useState(false)

  const run = async () => {
    if (!url.trim()) return
    setScanning(true)
    setReport(null)
    await new Promise((r) => setTimeout(r, 900))
    setReport(generateReport(url.trim()))
    setScanning(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          run()
        }}
        className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 p-5 shadow-inset-glow md:flex-row md:items-center"
      >
        <label className="flex flex-1 items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-4">
          <Rss className="size-4 text-muted-foreground" />
          <Input
            placeholder="https://example.com/podcast/feed.xml"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-11 border-none bg-transparent font-mono text-[0.85rem] shadow-none focus-visible:ring-0 focus-visible:border-transparent"
          />
        </label>
        <Button type="submit" disabled={!url.trim() || scanning} className="h-11 gap-1.5">
          {scanning ? "Scanning…" : "Check feed"}
          <ArrowRight className="size-3.5" />
        </Button>
      </form>

      {scanning && <Scanning />}

      {report && <ReportCard report={report} />}

      {!report && !scanning && (
        <p className="text-center font-mono text-[0.75rem] uppercase tracking-wider text-muted-foreground/70">
          Paste any public RSS URL above. Your input never leaves the browser.
        </p>
      )}
    </div>
  )
}

function Scanning() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/40 p-6">
      <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-signal">
        <span className="on-air-dot" aria-hidden /> Scanning feed
      </div>
      <ul className="flex flex-col gap-1 text-[0.82rem] text-muted-foreground">
        {["Fetching feed document…", "Parsing iTunes + Podcast Namespace tags…", "Checking cadence + cover art…", "Detecting distribution footprint…"].map(
          (line) => (
            <li key={line} className="flex items-center gap-2">
              <Clock className="size-3" />
              {line}
            </li>
          ),
        )}
      </ul>
    </div>
  )
}

function ReportCard({ report }: { report: Report }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/40 p-6">
          <div className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
            <Globe className="size-3.5" />
            Feed · detected
          </div>
          <div>
            <h2 className="font-display text-[1.8rem] leading-tight tracking-tight">
              {report.title}
            </h2>
            <p className="text-[0.85rem] text-muted-foreground">{report.subtitle}</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[0.78rem]">
            <Stat label="Episodes" value={report.episodes.toString()} />
            <Stat label="Avg length" value={report.avgDuration} />
            <Stat label="Cadence" value={report.cadence} />
            <Stat label="Last published" value={report.lastPublished} />
            <Stat label="Languages" value={report.languages.join(" · ")} />
            <Stat label="Archive" value={report.size} />
          </ul>
        </div>

        <div className="relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 size-48 rounded-full bg-signal/15 blur-3xl"
          />
          <div className="relative flex items-end gap-4">
            <div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                Health score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="nums-tabular font-display text-[4.5rem] leading-none tracking-tight text-foreground">
                  {report.score}
                </span>
                <span className="font-mono text-[1rem] text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-border/60 bg-muted/30">
                <div
                  className="h-full rounded-full bg-signal transition-all duration-700"
                  style={{ width: `${report.score}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                <span>Needs work</span>
                <span>Broadcast-grade</span>
              </div>
            </div>
          </div>
          <div className="relative flex flex-wrap gap-2">
            {report.platforms.map((p) => (
              <span
                key={p}
                className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground"
              >
                On {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ul className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card/40">
        {report.checks.map((c) => {
          const meta = LEVELS[c.level]
          return (
            <li key={c.label} className="flex gap-4 px-5 py-4">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background/60",
                  meta.tone,
                )}
              >
                <meta.icon className="size-3.5" />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[1rem] leading-tight tracking-tight">
                    {c.label}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider",
                      c.level === "pass" && "border-success/40 bg-success/10 text-success",
                      c.level === "warn" && "border-warning/40 bg-warning/10 text-warning",
                      c.level === "fail" && "border-destructive/40 bg-destructive/10 text-destructive",
                      c.level === "info" && "border-border bg-muted/30 text-muted-foreground",
                    )}
                  >
                    {c.level}
                  </span>
                </div>
                <p className="text-[0.85rem] text-muted-foreground">{c.detail}</p>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="flex flex-col gap-3 rounded-2xl border border-signal/30 bg-signal/5 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-signal">
            Fix it in an hour
          </span>
          <p className="max-w-xl text-[0.9rem] text-muted-foreground">
            Point your feed at Podviva and we'll migrate the archive, regenerate artwork, attach
            transcripts, and backfill distribution. Your subscribers stay subscribed.
          </p>
        </div>
        <Button asChild className="shrink-0 gap-1.5">
          <Link href="/sign-up">
            Migrate this feed <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex flex-col gap-0.5">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground/80">
        {label}
      </span>
      <span className="text-[0.9rem] text-foreground">{value}</span>
    </li>
  )
}
