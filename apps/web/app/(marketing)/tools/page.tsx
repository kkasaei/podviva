import Link from "next/link"
import {
  ArrowRight,
  FileAudio2,
  Globe,
  Radio,
  Rss,
  Sparkles,
  Terminal,
  TrendingUp,
} from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

export const metadata = {
  title: "Free tools",
  description:
    "Podcast tools that don't cost you anything — name generators, RSS health checks, MCP setup, cost calculators.",
}

type Tool = {
  slug: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  copy: string
  tag: string
  highlight?: boolean
}

const tools: Tool[] = [
  {
    slug: "name-generator",
    icon: Radio,
    label: "Name & concept generator",
    copy:
      "Feed the agent a topic. Get six podcast names with a tagline, audience, and art direction for each.",
    tag: "For new shows",
    highlight: true,
  },
  {
    slug: "feed-check",
    icon: Rss,
    label: "RSS feed health check",
    copy:
      "Drop your existing feed URL. Get a checklist of what looks good, what's broken, and what to fix before your next episode.",
    tag: "For existing shows",
  },
  {
    slug: "mcp-config",
    icon: Terminal,
    label: "MCP quickstart",
    copy:
      "Paste-ready config for Claude Desktop and Cursor. Connects to Podviva in under a minute.",
    tag: "For developers",
  },
  {
    slug: "cost-calculator",
    icon: TrendingUp,
    label: "Podcast cost calculator",
    copy:
      "Compare what a year of production costs on Podviva vs. a traditional stack. With and without translation.",
    tag: "For operators",
  },
]

const resources = [
  {
    href: "/resources/glossary",
    label: "Glossary",
    copy: "Cadence, autonomy, distribution adapters — the vocabulary in one place.",
    icon: Globe,
  },
  {
    href: "/blog",
    label: "Field notes",
    copy: "Long-form essays on running agent-driven and host-led shows.",
    icon: Sparkles,
  },
  {
    href: "/dashboard/api",
    label: "API & MCP reference",
    copy: "Typed endpoints, OpenAPI, MCP tool list — the whole surface.",
    icon: FileAudio2,
  },
]

export default function ToolsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-20">
      <section className="flex flex-col items-start gap-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal">
          <Sparkles className="size-3" />
          Free · no sign-up
        </span>
        <h1 className="max-w-3xl font-display text-[3rem] leading-[1.02] tracking-tight md:text-[4rem]">
          Useful, even if you <span className="italic text-signal">never pay us</span>.
        </h1>
        <p className="max-w-2xl text-[1rem] leading-relaxed text-muted-foreground">
          A handful of tools that solve real tasks in podcast production. Built the same way the
          rest of Podviva is — with taste.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {tools.map((t) => (
          <Link
            key={t.slug}
            href={`/tools/${t.slug}`}
            className={cn(
              "group relative flex flex-col gap-4 overflow-hidden rounded-3xl border p-7 transition-colors",
              t.highlight
                ? "border-signal/40 bg-signal/5 hover:border-signal/70"
                : "border-border/60 bg-card/40 hover:border-border",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/60">
                <t.icon className="size-4" />
              </span>
              <span className="rounded-full border border-border/70 bg-muted/30 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                {t.tag}
              </span>
            </div>
            <h3 className="font-display text-[1.5rem] leading-tight tracking-tight">{t.label}</h3>
            <p className="text-[0.9rem] text-muted-foreground">{t.copy}</p>
            <div className="mt-auto flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-signal">
              Open tool <ArrowRight className="size-3" />
            </div>
            {t.highlight && (
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-signal/15 blur-3xl"
              />
            )}
          </Link>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
            Resources
          </span>
          <h2 className="font-display text-[2rem] leading-tight tracking-tight md:text-[2.2rem]">
            Read the rest, for free.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {resources.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-border"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
                <r.icon className="size-4" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-display text-[1.1rem] leading-tight tracking-tight">
                  {r.label}
                </span>
                <span className="text-[0.8rem] text-muted-foreground">{r.copy}</span>
                <span className="mt-1 inline-flex items-center gap-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                  Open <ArrowRight className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
