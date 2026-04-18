import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Glossary",
  description:
    "Every Podviva term in one place — cadence, autonomy, stages, distribution adapters, and more.",
}

const terms = [
  {
    term: "Show",
    kind: "Entity",
    body: "The top-level container. A recurring podcast identity — name, concept, audience, voice, cadence. Can be human-authored or agent-authored.",
  },
  {
    term: "Episode",
    kind: "Entity",
    body: "A single published audio piece belonging to a show. Produced end-to-end by the pipeline, or uploaded directly by a human.",
  },
  {
    term: "Agent-led",
    kind: "Production mode",
    body: "An episode produced by the agentic pipeline — research, script, voice cast, TTS, artwork, assemble, publish. Can pause at configured approval gates.",
  },
  {
    term: "Host-led",
    kind: "Production mode",
    body: "An episode where a human records the audio. Podviva handles hosting, transcripts, translations, and distribution — no production pipeline runs.",
  },
  {
    term: "Stage",
    kind: "Pipeline",
    body: "One step in the agentic production pipeline. Seven stages ship by default: research, script, voice cast, TTS, artwork, assemble, publish.",
  },
  {
    term: "Autonomy config",
    kind: "Control",
    body: "A per-show map from stage to `auto` or `approve`. Approve stages pause the pipeline until you sign off. Lets you keep judgment where it matters.",
  },
  {
    term: "Cadence",
    kind: "Scheduling",
    body: "How often a show ships. Daily, weekly, biweekly, monthly — or a custom count per unit. The agent uses this to decide when to start the next episode.",
  },
  {
    term: "Distribution adapter",
    kind: "Reach",
    body: "A typed publisher that fans an episode out to a platform — RSS, YouTube, Apple, Spotify, Slack, custom webhooks. Toggleable per show.",
  },
  {
    term: "RSS feed",
    kind: "Reach",
    body: "The feed podcatchers subscribe to. Podviva generates one per show at a stable URL; it's what Apple and Spotify ingest.",
  },
  {
    term: "Translation",
    kind: "Languages",
    body: "Auto-generated transcript + subtitles per language on every publish. Dubbed audio is on the roadmap, not shipped.",
  },
  {
    term: "MCP server",
    kind: "Developer",
    body: "Podviva exposes every capability as an MCP tool at /mcp. Claude Desktop, Cursor, and any MCP-aware host can drive the platform with typed tool calls.",
  },
  {
    term: "Approval queue",
    kind: "Control",
    body: "The inbox of pipeline stages waiting for your sign-off. Visible on the dashboard and callable via API.",
  },
  {
    term: "Premium tier",
    kind: "Commerce",
    body: "API + MCP access lives behind the Studio tier. The UI, hosting, and distribution are available from the Creator tier upward.",
  },
  {
    term: "Voice identity",
    kind: "Brand",
    body: "The locked voice a show uses across every episode. Voice identities can be shared across a fleet or reserved to a single show.",
  },
]

const groups = Array.from(new Set(terms.map((t) => t.kind)))

export default function GlossaryPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
      <Link
        href="/tools"
        className="inline-flex w-fit items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> Free tools
      </Link>
      <header className="flex flex-col gap-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          Glossary
        </span>
        <h1 className="max-w-3xl font-display text-[2.6rem] leading-[1.02] tracking-tight md:text-[3.4rem]">
          The Podviva <span className="italic text-signal">vocabulary</span>.
        </h1>
        <p className="max-w-2xl text-[1rem] text-muted-foreground">
          One-line definitions for every primitive — skim it before your first show, reference it
          when reading the API docs.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {groups.map((g) => (
          <a
            key={g}
            href={`#${g.toLowerCase().replace(/\s+/g, "-")}`}
            className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            {g}
          </a>
        ))}
      </nav>

      {groups.map((g) => (
        <section
          key={g}
          id={g.toLowerCase().replace(/\s+/g, "-")}
          className="flex flex-col gap-4 border-t border-border/60 pt-8"
        >
          <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
            {g}
          </h2>
          <dl className="flex flex-col divide-y divide-border/50">
            {terms
              .filter((t) => t.kind === g)
              .map((t) => (
                <div key={t.term} className="flex flex-col gap-1.5 py-4 md:flex-row md:gap-8">
                  <dt className="min-w-[12rem] font-display text-[1.2rem] leading-tight tracking-tight">
                    {t.term}
                  </dt>
                  <dd className="text-[0.95rem] leading-relaxed text-muted-foreground">
                    {t.body}
                  </dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  )
}
