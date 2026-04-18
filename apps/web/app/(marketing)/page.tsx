import Link from "next/link"
import {
  ArrowRight,
  Bot,
  Calendar,
  CircuitBoard,
  Gauge,
  Globe2,
  Headphones,
  Languages,
  Mic2,
  PlayCircle,
  Radio,
  Satellite,
  Sparkles,
  Terminal,
  Waves,
  Wand2,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { featured, trending, newThisWeek, CATEGORIES } from "@/lib/marketing/discovery"
import { posts } from "@/lib/marketing/blog"
import { PodcastCard } from "@/components/marketing/podcast-card"

export default function MarketingHomePage() {
  const feat = featured()
  const trend = trending()
  const fresh = newThisWeek()
  const latestPost = posts[0]

  return (
    <>
      <Hero />
      <MarqueeShows />
      <DiscoverPreview featured={feat} trending={trend} newShows={fresh} />
      <ProblemFraming />
      <Features />
      <ProductSnapshot />
      <ICP />
      <PricingTeaser />
      <TestimonialStrip />
      <BlogTeaser latest={latestPost} />
      <FinalCta />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-24 md:py-32 lg:flex-row lg:items-end">
        <div className="flex max-w-3xl flex-col gap-7">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal">
            <span className="on-air-dot" aria-hidden />
            <span>On air · producing 42 shows right now</span>
          </div>
          <h1 className="font-display text-[3.25rem] leading-[0.95] tracking-[-0.03em] md:text-[4.5rem] lg:text-[5.2rem]">
            <span className="block">Podcasts that</span>
            <span className="block italic text-signal">produce themselves.</span>
            <span className="block text-muted-foreground">Hosted on the same platform</span>
            <span className="block text-muted-foreground">that powers them.</span>
          </h1>
          <p className="max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground">
            Podviva is the first podcast platform you can drive from an AI agent. Run fully
            autonomous shows, upload your own episodes, translate everything, and distribute to
            Apple, Spotify, YouTube, and RSS — from one control room, or from an API call.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-1.5">
              <Link href="/sign-up">
                Start a show <ArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-1.5">
              <Link href="/discover">
                <Headphones className="size-3.5" />
                Browse Podviva
              </Link>
            </Button>
            <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
              Free to listen · free to start · production from $29/mo
            </span>
          </div>
        </div>

        <div className="relative hidden shrink-0 lg:block">
          <FloatingTiles />
        </div>
      </div>
    </section>
  )
}

function FloatingTiles() {
  const tiles = featured().slice(0, 3)
  return (
    <div className="relative h-[22rem] w-[22rem]">
      {tiles.map((show, i) => (
        <div
          key={show.id}
          className={cn(
            "absolute inset-0 overflow-hidden rounded-2xl border border-border/70 shadow-[0_30px_60px_-20px_oklch(0_0_0/0.6)] transition-transform",
            i === 0 && "translate-x-[-1.2rem] translate-y-[2.4rem] rotate-[-6deg]",
            i === 1 && "translate-x-0 translate-y-0 rotate-[1deg] scale-95",
            i === 2 && "translate-x-[1.4rem] translate-y-[-1.8rem] rotate-[4deg] scale-90",
          )}
          style={{ zIndex: tiles.length - i }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={show.coverArtUrl} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex flex-col gap-1">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              {show.category} · {show.durationLabel}
            </span>
            <span className="font-display text-[1.2rem] leading-tight tracking-tight">
              {show.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function MarqueeShows() {
  const line = [...featured(), ...trending()]
  return (
    <section className="border-y border-border/50 bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-6">
        <span className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          On Podviva
        </span>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="flex animate-[marquee_40s_linear_infinite] items-center gap-10 whitespace-nowrap">
            {[...line, ...line].map((s, i) => (
              <span
                key={`${s.id}-${i}`}
                className="flex items-center gap-2 text-[0.9rem] text-muted-foreground"
              >
                <span
                  className="inline-block size-1.5 rounded-full"
                  style={{ background: s.accent }}
                />
                <span className="text-foreground">{s.name}</span>
                <span className="font-mono text-[0.7rem] uppercase tracking-wider">
                  {s.category}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

function DiscoverPreview({
  featured,
  trending,
  newShows,
}: {
  featured: ReturnType<typeof import("@/lib/marketing/discovery").featured>
  trending: ReturnType<typeof import("@/lib/marketing/discovery").trending>
  newShows: ReturnType<typeof import("@/lib/marketing/discovery").newThisWeek>
}) {
  void newShows
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHead
        label="Discover"
        title={
          <>
            Also a <span className="italic text-signal">place to listen</span>.
          </>
        }
        body="Podviva isn't just a producer tool — it's the home for the shows it hosts. Categories, editor picks, trending, and first-time breakouts all live on Discover."
        action={{ href: "/discover", label: "Open Discover" }}
      />
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {featured.slice(0, 4).map((s) => (
          <PodcastCard key={s.id} show={s} />
        ))}
      </div>
      <div className="mt-12 flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
        <span>Categories</span>
        <span className="text-muted-foreground/40">·</span>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/discover?category=${c.toLowerCase()}`}
            className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            {c}
          </Link>
        ))}
      </div>
      <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniCollection
          label="Trending · 24h"
          items={trending.slice(0, 3).map((s) => s.name)}
        />
        <MiniCollection
          label="New this week"
          items={newShows.slice(0, 3).map((s) => s.name)}
        />
        <MiniCollection
          label="Editor's picks"
          items={featured.slice(0, 3).map((s) => s.name)}
        />
        <MiniCollection
          label="Fully autonomous"
          items={["The Daily LLM", "Market Brief", "Newsdesk · 18:00"]}
        />
      </div>
    </section>
  )
}

function MiniCollection({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <ol className="mt-2 flex flex-col gap-1 text-[0.85rem]">
        {items.map((it, i) => (
          <li key={it} className="flex items-baseline gap-2">
            <span className="nums-tabular font-mono text-[0.7rem] text-muted-foreground/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ProblemFraming() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            The problem
          </span>
          <h2 className="font-display text-[2.4rem] leading-[1.05] tracking-tight md:text-[3rem]">
            Podcast production is{" "}
            <span className="italic text-signal">glued together</span> from ten tools you don't
            own.
          </h2>
          <p className="max-w-xl text-[1rem] leading-relaxed text-muted-foreground">
            A script doc. A recording app. An editor. A host. A YouTube uploader. A transcript
            tool. A translator. A scheduling spreadsheet. Every handoff is a delay, every delay is
            a cost, every cost is a reason your show missed its cadence this week.
          </p>
          <p className="max-w-xl text-[1rem] leading-relaxed text-muted-foreground">
            The shows that ship every day are the ones that collapsed the stack. Podviva is the
            stack, collapsed — and it lets agents drive.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 self-start">
          {[
            { label: "Tools you stop paying for", value: "6+" },
            { label: "Time to publish an episode", value: "90s" },
            { label: "Languages per episode", value: "10" },
            { label: "Minimum setup", value: "0 clicks" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/60 bg-card/50 p-5"
            >
              <p className="nums-tabular font-display text-[2.4rem] leading-none tracking-tight">
                {stat.value}
              </p>
              <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: Bot,
      title: "Agentic production",
      body: "Research, script, voice, art, mix, publish — every stage runs as a tool call. Claude, your own agent, or the default pipeline.",
    },
    {
      icon: Mic2,
      title: "For human podcasters too",
      body: "Upload your recordings. Podviva hosts, transcribes, translates, and ships — so you can spend time on the conversation.",
    },
    {
      icon: Terminal,
      title: "API & MCP first",
      body: "Everything in the UI is a typed REST endpoint and an MCP tool. Drive Podviva from Claude Desktop, Cursor, or your own service.",
    },
    {
      icon: Languages,
      title: "Translation at publish time",
      body: "Transcripts and subtitles in every language you ship. Dubbed audio on the roadmap — text is on by default.",
    },
    {
      icon: Satellite,
      title: "Distribution without the forms",
      body: "RSS covers Apple and Spotify. YouTube, Slack webhook, custom endpoints — all as pluggable adapters you toggle per show.",
    },
    {
      icon: Gauge,
      title: "Configurable autonomy",
      body: "Flip a stage to 'approve' and the pipeline pauses for your sign-off. Keep the gates that matter, remove the ones that don't.",
    },
  ]
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHead
        label="How it works"
        title={
          <>
            One platform, <span className="italic text-signal">seven tools removed</span>.
          </>
        }
        body="Podviva is the stack a modern podcast shop would build from scratch if they started today."
      />
      <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6 transition-colors hover:border-border"
          >
            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/40">
              <f.icon className="size-4" />
            </div>
            <h3 className="font-display text-[1.3rem] leading-tight tracking-tight">{f.title}</h3>
            <p className="text-[0.88rem] text-muted-foreground">{f.body}</p>
            <div
              aria-hidden
              className="absolute -bottom-12 -right-12 size-32 rounded-full bg-signal/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

function ProductSnapshot() {
  const stages = [
    { name: "Research", detail: "42 sources · Claude 4.7", status: "done" },
    { name: "Script", detail: "2,141 tokens · 18:40 read", status: "done" },
    { name: "Voice cast", detail: "ElevenLabs · multilingual v3", status: "done" },
    { name: "TTS", detail: "Rendering 19m of audio", status: "running" },
    { name: "Artwork", detail: "gpt-image-1 · 2 variants", status: "pending" },
    { name: "Assemble", detail: "—", status: "pending" },
    { name: "Publish", detail: "RSS, YouTube, Apple, Spotify", status: "pending" },
  ] as const
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            Inside the control room
          </span>
          <h2 className="font-display text-[2.4rem] leading-[1.05] tracking-tight md:text-[3rem]">
            Every stage, <span className="italic text-signal">inspectable</span>.
          </h2>
          <p className="max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
            The agent doesn't disappear behind a black box. Every stage writes its output here —
            sources, scripts, voice profiles, mix settings, distribution URLs — so you can
            intervene at any step and know exactly why the episode sounded the way it did.
          </p>
          <Button asChild variant="outline" className="w-fit gap-1.5">
            <Link href="/dashboard">
              See the studio <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-6 shadow-[0_30px_80px_-20px_oklch(0_0_0/0.7)]">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <span className="on-air-dot" aria-hidden />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Future Protocols · ep 013
                </span>
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-on-air">
                Pipeline 4/7
              </span>
            </div>
            <ol className="flex flex-col divide-y divide-border/70">
              {stages.map((s, i) => (
                <li key={s.name} className="flex items-center gap-3 py-3">
                  <span className="nums-tabular w-5 font-mono text-[0.7rem] text-muted-foreground/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      s.status === "done" && "bg-success",
                      s.status === "running" && "bg-signal",
                      s.status === "pending" && "bg-muted-foreground/30",
                    )}
                  />
                  <span className="w-28 font-display text-[0.95rem] tracking-tight">
                    {s.name}
                  </span>
                  <span className="flex-1 truncate font-mono text-[0.75rem] text-muted-foreground">
                    {s.detail}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[0.65rem] uppercase tracking-wider",
                      s.status === "done" && "text-success",
                      s.status === "running" && "text-signal",
                      s.status === "pending" && "text-muted-foreground/60",
                    )}
                  >
                    {s.status}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-signal/5 blur-3xl"
          />
        </div>
      </div>
    </section>
  )
}

function ICP() {
  const personas = [
    {
      icon: CircuitBoard,
      label: "Content operators",
      title: "Agencies, newsletters, education teams",
      body: "You're turning every piece of content into audio without staffing a production team. Podviva is the agentic back-office that lets one operator run what used to take five.",
      proof: "Run 20+ shows from one seat",
    },
    {
      icon: Wand2,
      label: "AI product builders",
      title: "Teams shipping agents that should 'make a podcast'",
      body: "Your product decided audio is a first-class output. Podviva is the MCP server you point it at — typed tool calls for shows, episodes, distribution, and analytics.",
      proof: "Metered usage, OpenAPI, SDKs",
    },
    {
      icon: Mic2,
      label: "Host-led podcasters",
      title: "Independent creators who code",
      body: "You bring the recording. Podviva brings the rails — hosting, transcripts, translations, multi-platform distribution, and an API you can pipe your CMS into.",
      proof: "Keep your RSS, gain the automations",
    },
  ]
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHead
        label="Built for"
        title={
          <>
            Three customers. <span className="italic text-signal">One stack.</span>
          </>
        }
        body="We deliberately did not design Podviva around a single persona. The product exists because the same platform serves operators, builders, and independents better than any of them is served today."
      />
      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {personas.map((p) => (
          <article
            key={p.label}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-7"
          >
            <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-signal">
              <p.icon className="size-3.5" />
              <span>{p.label}</span>
            </div>
            <h3 className="font-display text-[1.55rem] leading-tight tracking-tight">
              {p.title}
            </h3>
            <p className="text-[0.9rem] text-muted-foreground">{p.body}</p>
            <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-4 font-mono text-[0.75rem] text-muted-foreground">
              <Sparkles className="size-3 text-signal" />
              <span>{p.proof}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function PricingTeaser() {
  const tiers = [
    {
      name: "Listener",
      price: "Free",
      hint: "For everyone who presses play",
      features: ["Unlimited listening", "Discover Podviva", "Multi-language transcripts"],
    },
    {
      name: "Creator",
      price: "$23",
      suffix: "/mo",
      rack: "$29/mo monthly",
      hint: "Everything a modern show needs · billed yearly",
      features: [
        "Unlimited hosting",
        "Agentic production (5 shows)",
        "Distribution · RSS, YT, Apple, Spotify",
        "Transcripts & translations",
      ],
      highlight: true,
    },
    {
      name: "Studio",
      price: "$79",
      suffix: "/mo",
      rack: "$99/mo monthly",
      hint: "API, MCP, and show fleets · billed yearly",
      features: [
        "Everything in Creator",
        "Unlimited shows",
        "API & MCP access",
        "Priority production queue",
        "Slack, webhooks, SSO",
      ],
    },
    {
      name: "Custom",
      price: "Let's talk",
      hint: "Built around your team",
      features: [
        "Volume production pricing",
        "Dedicated inference capacity",
        "Residency · EU, US, APAC",
        "SLAs, SOC2 docs, SSO",
      ],
      custom: true,
    },
  ] satisfies Array<{
    name: string
    price: string
    suffix?: string
    rack?: string
    hint: string
    features: string[]
    highlight?: boolean
    custom?: boolean
  }>
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHead
        label="Pricing"
        title={
          <>
            Free to listen. <span className="italic text-signal">$23</span> to produce.
          </>
        }
        body="Yearly billing gets you 20% off every paid tier. Same podcast stack at every price — higher plans unlock volume, API access, and priority queues."
        action={{ href: "/pricing", label: "Compare plans" }}
      />
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={cn(
              "relative flex flex-col gap-5 rounded-3xl border p-7",
              t.highlight
                ? "border-signal/70 bg-signal/5 shadow-[0_20px_60px_-20px_oklch(0.76_0.17_52_/_0.35)]"
                : t.custom
                  ? "border-border/80 bg-gradient-to-br from-card/80 via-card/40 to-card/10"
                  : "border-border/60 bg-card/50",
            )}
          >
            {t.highlight && (
              <span className="absolute right-5 top-5 rounded-full border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-signal">
                Most chosen
              </span>
            )}
            {t.custom && (
              <span className="absolute right-5 top-5 rounded-full border border-border/70 bg-muted/40 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                Bespoke
              </span>
            )}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                {t.name}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="nums-tabular font-display text-[2.6rem] leading-none tracking-tight">
                  {t.price}
                </span>
                {t.suffix && (
                  <span className="font-mono text-[0.85rem] text-muted-foreground">
                    {t.suffix}
                  </span>
                )}
              </div>
              {t.rack && (
                <p className="font-mono text-[0.7rem] text-signal">
                  save 20% · {t.rack}
                </p>
              )}
              <p className="pt-1 text-[0.85rem] text-muted-foreground">{t.hint}</p>
            </div>
            <ul className="flex flex-col gap-2 text-[0.85rem]">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-signal" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant={t.highlight ? "default" : "outline"}
              className="mt-auto w-full"
            >
              <Link href={t.custom ? "mailto:sales@podviva.fm" : "/pricing"}>
                {t.custom
                  ? "Talk to sales"
                  : t.price === "Free"
                    ? "Start listening"
                    : "Start 14-day trial"}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}

function TestimonialStrip() {
  const quotes = [
    {
      who: "Priya, head of content, Lumen",
      note: "We turned our weekly newsletter into a daily audio briefing overnight. Podviva replaced four tools and a freelancer.",
    },
    {
      who: "Marco, indie, 2-person team",
      note: "First platform I've seen where shipping a podcast feels the same as shipping a feature. I call one API and it ships.",
    },
    {
      who: "Dr. Okonkwo, independent researcher",
      note: "I keep my RSS, my subscribers, my voice. Podviva just handles everything I used to hate.",
    },
  ]
  return (
    <section className="border-y border-border/50 bg-background/70">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-14 md:grid-cols-3">
        {quotes.map((q) => (
          <figure key={q.who} className="flex flex-col gap-4">
            <blockquote className="font-display text-[1.1rem] leading-snug tracking-tight text-foreground">
              &ldquo;{q.note}&rdquo;
            </blockquote>
            <figcaption className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              {q.who}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function BlogTeaser({ latest }: { latest: (typeof posts)[number] | undefined }) {
  if (!latest) return null
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHead
        label="Field notes"
        title={
          <>
            Essays from the <span className="italic text-signal">control room</span>.
          </>
        }
        action={{ href: "/blog", label: "All writing" }}
      />
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Link
          href={`/blog/${latest.slug}`}
          className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/60"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={latest.heroImage}
            alt=""
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="flex flex-col gap-3 p-7">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-signal">
              {latest.category} · {latest.readingMinutes} min
            </span>
            <h3 className="font-display text-[2rem] leading-tight tracking-tight">
              {latest.title}
            </h3>
            <p className="text-[0.95rem] text-muted-foreground">{latest.excerpt}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-3">
          {posts.slice(1, 4).map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.heroImage}
                  alt=""
                  className="size-20 shrink-0 rounded-xl object-cover"
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {p.category} · {p.readingMinutes} min
                  </span>
                  <h4 className="font-display text-[1.05rem] leading-tight tracking-tight">
                    {p.title}
                  </h4>
                  <p className="line-clamp-2 text-[0.8rem] text-muted-foreground">{p.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-signal/40 bg-signal/5 p-10 md:p-16">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,oklch(0.76_0.17_52_/_0.14),transparent_60%)]"
        />
        <div className="relative flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal">
            <Waves className="size-3.5" />
            Ready when you are
          </div>
          <h2 className="max-w-2xl font-display text-[2.6rem] leading-[1.02] tracking-tight md:text-[3.6rem]">
            Your show is one prompt away.
          </h2>
          <p className="max-w-xl text-[1rem] text-muted-foreground">
            Start a free account, kick off a show from an idea, and Podviva will produce the first
            episode before you finish your coffee.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-1.5">
              <Link href="/sign-up">
                Start a show <ArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-1.5">
              <Link href="/discover">
                <PlayCircle className="size-3.5" />
                Listen first
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionHead({
  label,
  title,
  body,
  action,
}: {
  label: string
  title: React.ReactNode
  body?: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
      <div className="flex max-w-2xl flex-col gap-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        <h2 className="font-display text-[2.2rem] leading-[1.05] tracking-tight md:text-[2.8rem]">
          {title}
        </h2>
        {body && <p className="text-[1rem] text-muted-foreground">{body}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 self-start rounded-full border border-border/60 bg-card/40 px-4 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground md:self-end"
        >
          {action.label}
          <ArrowRight className="size-3" />
        </Link>
      )}
    </div>
  )
}
