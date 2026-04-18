import { Bot, Headphones, Mic2, Search, Sparkles } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import {
  CATEGORIES,
  byCategory,
  discoveryShows,
  featured,
  newThisWeek,
  trending,
} from "@/lib/marketing/discovery"
import { PodcastCard } from "@/components/marketing/podcast-card"

export const metadata = {
  title: "Discover",
  description: "Browse every show hosted on Podviva — agent-produced, host-led, and in between.",
}

export default function DiscoverPage() {
  const editorsPicks = featured()
  const trendingShows = trending()
  const newShows = newThisWeek()
  const agentShows = discoveryShows.filter((s) => s.hostType === "agent").slice(0, 4)
  const hostShows = discoveryShows.filter((s) => s.hostType === "human").slice(0, 4)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20">
      <Hero />

      <Section
        label="Editor's picks"
        title="What's worth your ears this week"
        body="Five shows our editors keep listening to — picked for craft, not the trending algorithm."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {editorsPicks.map((s) => (
            <PodcastCard key={s.id} show={s} />
          ))}
        </div>
      </Section>

      <Section
        label="Trending · 24h"
        title="Climbing right now"
        body="Biggest listen growth in the last day, across all categories."
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {trendingShows.map((s) => (
            <PodcastCard key={s.id} show={s} size="sm" />
          ))}
        </div>
      </Section>

      <Section
        label="Fresh this week"
        title="New voices on Podviva"
        body="Shows that launched in the last 7 days — give them a first listen."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newShows.map((s) => (
            <PodcastCard key={s.id} show={s} />
          ))}
        </div>
      </Section>

      <Section label="By format" title="Agents, hosts, or a bit of both.">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/40 p-6">
            <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal">
              <Bot className="size-3.5" />
              Fully autonomous
            </div>
            <p className="text-[0.88rem] text-muted-foreground">
              Produced end-to-end by an agent. No humans touch these between topic and publish.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {agentShows.map((s) => (
                <PodcastCard key={s.id} show={s} size="sm" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/40 p-6">
            <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              <Mic2 className="size-3.5" />
              Host-led
            </div>
            <p className="text-[0.88rem] text-muted-foreground">
              Real voices. The human does the conversation, Podviva handles the rest.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {hostShows.map((s) => (
                <PodcastCard key={s.id} show={s} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {CATEGORIES.slice(0, 4).map((cat) => {
        const list = byCategory(cat)
        if (list.length === 0) return null
        return (
          <Section
            key={cat}
            label={cat}
            title={`In ${cat}`}
            body={categoryCopy[cat] ?? ""}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((s) => (
                <PodcastCard key={s.id} show={s} />
              ))}
            </div>
          </Section>
        )
      })}
    </div>
  )
}

const categoryCopy: Partial<Record<string, string>> = {
  Technology: "Shows about protocols, models, and the teams shipping them.",
  Business: "Operators, founders, and the quiet mechanics of building a company.",
  Science: "Papers, breakthroughs, and the humans who read them so you don't have to.",
  Design: "Long-form on craft — typography, product, taste.",
}

function Hero() {
  return (
    <section className="relative flex flex-col gap-8 overflow-hidden rounded-[2rem] border border-border/60 bg-card/50 p-8 md:p-14">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,oklch(0.76_0.17_52_/_0.15),transparent_60%)]"
      />
      <div className="relative flex flex-col gap-5">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal">
          <Headphones className="size-3" />
          Discover Podviva
        </span>
        <h1 className="max-w-3xl font-display text-[2.8rem] leading-[1.04] tracking-tight md:text-[3.8rem]">
          Every show on Podviva, <span className="italic text-signal">one surface</span>.
        </h1>
        <p className="max-w-2xl text-[1rem] leading-relaxed text-muted-foreground">
          Agent-produced, host-led, and everything between. Browse by category, sort by format,
          stumble across the next two-minute briefing that replaces your morning newsletter.
        </p>
      </div>
      <div className="relative flex max-w-3xl flex-col gap-4 md:flex-row md:items-center">
        <label className="flex w-full items-center gap-3 rounded-full border border-border/60 bg-background/70 px-5 py-3 backdrop-blur">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search for a show, host, or topic"
            className="w-full border-none bg-transparent text-[0.95rem] outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[0.7rem] text-muted-foreground">
            ⌘K
          </kbd>
        </label>
      </div>
      <div className="relative flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => (
          <span
            key={c}
            className={cn(
              "rounded-full border border-border/60 bg-muted/30 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground",
              c === "Technology" && "border-signal/50 bg-signal/10 text-signal",
            )}
          >
            {c}
          </span>
        ))}
        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
          <Sparkles className="size-3 text-signal" />
          Agent-only
        </span>
      </div>
    </section>
  )
}

function Section({
  label,
  title,
  body,
  children,
}: {
  label: string
  title: string
  body?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <h2 className="font-display text-[1.8rem] leading-tight tracking-tight md:text-[2.2rem]">
          {title}
        </h2>
        {body && <p className="max-w-2xl text-[0.9rem] text-muted-foreground">{body}</p>}
      </div>
      {children}
    </section>
  )
}
