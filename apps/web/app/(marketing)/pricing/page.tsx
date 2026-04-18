import Link from "next/link"
import { Check, Minus, Sparkles } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { PricingTiers } from "./tiers"

export const metadata = {
  title: "Pricing",
  description: "Free to listen. $29 to produce. $99 to automate.",
}

const matrix: {
  group: string
  rows: { label: string; values: (boolean | string)[] }[]
}[] = [
  {
    group: "Production",
    rows: [
      {
        label: "Shows",
        values: ["—", "5", "Unlimited", "Unlimited"],
      },
      {
        label: "Episodes / month",
        values: ["—", "40", "400", "Custom"],
      },
      { label: "Agentic pipeline", values: [false, true, true, true] },
      { label: "Human upload", values: [false, true, true, true] },
      { label: "Approval gates", values: [false, true, true, true] },
    ],
  },
  {
    group: "Reach",
    rows: [
      { label: "RSS hosting", values: [true, true, true, true] },
      { label: "YouTube", values: [false, true, true, true] },
      { label: "Apple + Spotify", values: [false, true, true, true] },
      { label: "Translation languages", values: ["3", "10", "30", "Custom"] },
    ],
  },
  {
    group: "Platform",
    rows: [
      { label: "REST API", values: [false, false, true, true] },
      { label: "MCP server", values: [false, false, true, true] },
      { label: "Slack webhook", values: [false, true, true, true] },
      { label: "Custom webhooks", values: [false, false, true, true] },
      { label: "Priority queue", values: [false, false, true, true] },
    ],
  },
  {
    group: "Operations",
    rows: [
      { label: "Team members", values: ["—", "3", "15", "Custom"] },
      { label: "SSO", values: [false, false, true, true] },
      { label: "Audit log", values: [false, false, true, true] },
      { label: "SLA", values: [false, false, false, true] },
    ],
  },
]

const faqs = [
  {
    q: "Do listeners need an account?",
    a: "No. Anyone can discover and play shows hosted on Podviva. Listener accounts are free and let you follow shows across devices.",
  },
  {
    q: "What counts as 'agentic production'?",
    a: "Every stage the agent can run — research, script, voice casting, TTS, artwork, assembly, and distribution. You configure which stages require your approval per show.",
  },
  {
    q: "Is the API really premium-only?",
    a: "Yes. Studio and Enterprise tiers get REST + MCP access. The UI is free for Creator and Listener tiers because the platform should be usable without a developer.",
  },
  {
    q: "Can I bring my existing RSS feed?",
    a: "Yes. Point your current feed at Podviva and we migrate episodes, artwork, and metadata. Your subscribers stay subscribed.",
  },
  {
    q: "Dubbed audio — yes or no?",
    a: "Not yet. V1 ships transcripts and subtitles per language. Dubbed audio lands once we can guarantee voice identity and intent survive translation.",
  },
]

export default function PricingPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-20">
      <Hero />
      <PricingTiers />
      <Matrix />
      <Addons />
      <Faq />
      <Cta />
    </div>
  )
}

function Hero() {
  return (
    <section className="flex flex-col items-start gap-6">
      <span className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal">
        <Sparkles className="size-3" />
        Transparent pricing
      </span>
      <h1 className="max-w-3xl font-display text-[3rem] leading-[1.02] tracking-tight md:text-[4.2rem]">
        Free to listen. <span className="italic text-signal">$29</span> to produce.
        <br />
        <span className="text-muted-foreground">$99 to automate.</span>
      </h1>
      <p className="max-w-2xl text-[1.05rem] text-muted-foreground">
        Same podcast stack at every tier — hosting, distribution, translation. Higher plans
        unlock volume, priority production, and the API your agents need.
      </p>
    </section>
  )
}

function Matrix() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          Compare
        </span>
        <h2 className="font-display text-[2rem] leading-tight tracking-tight md:text-[2.4rem]">
          Every feature, side by side.
        </h2>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-border/60 bg-card/40">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-[0.85rem]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-card/40 px-5 py-4 text-left font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                Feature
              </th>
              {["Listener", "Creator", "Studio", "Custom"].map((name, i) => (
                <th
                  key={name}
                  className={cn(
                    "px-5 py-4 text-left font-mono text-[0.65rem] uppercase tracking-[0.14em]",
                    i === 1 ? "text-signal" : "text-muted-foreground",
                  )}
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((group) => (
              <MatrixGroup key={group.group} group={group} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function MatrixGroup({
  group,
}: {
  group: { group: string; rows: { label: string; values: (boolean | string)[] }[] }
}) {
  return (
    <>
      <tr>
        <td
          colSpan={5}
          className="border-t border-border/60 bg-muted/20 px-5 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground"
        >
          {group.group}
        </td>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.label}>
          <td className="sticky left-0 z-10 border-t border-border/40 bg-card/40 px-5 py-3 text-foreground">
            {row.label}
          </td>
          {row.values.map((v, i) => (
            <td
              key={i}
              className={cn(
                "border-t border-border/40 px-5 py-3",
                i === 1 && "bg-signal/[0.04]",
              )}
            >
              {typeof v === "boolean" ? (
                v ? (
                  <Check className="size-4 text-signal" />
                ) : (
                  <Minus className="size-4 text-muted-foreground/50" />
                )
              ) : (
                <span
                  className={cn(
                    "nums-tabular font-mono text-[0.8rem]",
                    v === "—" ? "text-muted-foreground/50" : "text-foreground",
                  )}
                >
                  {v}
                </span>
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

function Addons() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {[
        {
          title: "Concierge onboarding",
          price: "$500 one-off",
          body: "White-glove setup — migrations, voice casting, autonomy config tuned to your brand.",
        },
        {
          title: "Custom voice identity",
          price: "$300/voice",
          body: "Your own signature voice, cloned and locked to your org. Available on Studio+.",
        },
        {
          title: "Volume production",
          price: "from $0.04 / min",
          body: "Metered rate for teams producing hundreds of episodes monthly.",
        },
      ].map((a) => (
        <div key={a.title} className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/40 p-6">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-signal">
            {a.price}
          </span>
          <h3 className="font-display text-[1.25rem] leading-tight tracking-tight">{a.title}</h3>
          <p className="text-[0.85rem] text-muted-foreground">{a.body}</p>
        </div>
      ))}
    </section>
  )
}

function Faq() {
  return (
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          FAQ
        </span>
        <h2 className="font-display text-[2rem] leading-tight tracking-tight md:text-[2.4rem]">
          Answers, before you ask.
        </h2>
      </div>
      <dl className="flex flex-col divide-y divide-border/60">
        {faqs.map((f) => (
          <div key={f.q} className="py-5">
            <dt className="font-display text-[1.1rem] leading-tight tracking-tight text-foreground">
              {f.q}
            </dt>
            <dd className="mt-2 text-[0.9rem] text-muted-foreground">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Cta() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-signal/40 bg-signal/5 p-10 md:p-14">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,oklch(0.76_0.17_52_/_0.14),transparent_60%)]"
      />
      <div className="relative flex flex-col gap-5">
        <h2 className="max-w-2xl font-display text-[2.2rem] leading-tight tracking-tight md:text-[2.8rem]">
          Still undecided?
        </h2>
        <p className="max-w-xl text-[0.95rem] text-muted-foreground">
          Start on Creator — if you need the API or fleet pricing later, we'll move you up without
          losing any shows.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/sign-up">Start 14-day trial</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="mailto:sales@podviva.fm">Talk to sales</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
