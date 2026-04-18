"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, RefreshCw, Sparkles, Wand2 } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

type Suggestion = {
  name: string
  italicSuffix?: string
  tagline: string
  audience: string
  artDirection: string
  accent: string
}

const NAME_TEMPLATES = [
  (kw: string) => `The ${cap(kw)} Desk`,
  (kw: string) => `${cap(kw)}, Daily`,
  (kw: string) => `Between ${cap(kw)}`,
  (kw: string) => `${cap(kw)} & Co.`,
  (kw: string) => `The ${cap(kw)} Transmission`,
  (kw: string) => `After ${cap(kw)}`,
  (kw: string) => `${cap(kw)} Field Notes`,
  (kw: string) => `${cap(kw)}, Off-Air`,
  (kw: string) => `Station ${cap(kw)}`,
]

const ACCENTS = ["#f07a3a", "#4cc38a", "#6ac0a8", "#e5b85b", "#8a6fff", "#f3766a", "#2dbbb3", "#6a84c4"]

const ART_DIRECTIONS = [
  "Risograph print, two-colour, newspaper texture.",
  "Editorial photography with a high-contrast serif lockup.",
  "Vector illustration, geometric, flat colours with grain.",
  "Late-night talk-show gradient, lens glow, 1:1 square.",
  "Muted photographic portrait, quarter-tone typographic overlay.",
  "Brutalist monospace type, stark black-and-white, thin rule.",
  "Analog tape aesthetic, warm grain, handwritten title.",
]

function cap(s: string) {
  if (!s) return ""
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function deriveKeywords(text: string) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4)
    .filter((w) => !STOPWORDS.has(w))
  return Array.from(new Set(words))
}

const STOPWORDS = new Set([
  "about",
  "with",
  "from",
  "this",
  "that",
  "have",
  "will",
  "been",
  "into",
  "your",
  "podcast",
  "show",
  "weekly",
  "daily",
  "every",
  "some",
  "like",
  "just",
  "they",
  "what",
  "when",
  "where",
  "which",
  "there",
  "their",
  "more",
  "also",
  "each",
  "those",
])

function pickOne<T>(arr: T[], i: number): T {
  return arr[i % arr.length]!
}

function buildSuggestions(concept: string, audience: string, category: string): Suggestion[] {
  const kws = deriveKeywords(`${concept} ${category}`)
  if (kws.length === 0) {
    kws.push("signal", "studio", "transmission", "archive", "desk", "field")
  }
  const audKw =
    deriveKeywords(audience)[0] ??
    (category.toLowerCase() === "business"
      ? "operators"
      : category.toLowerCase() === "technology"
        ? "engineers"
        : "listeners")

  const out: Suggestion[] = []
  for (let i = 0; i < 6; i++) {
    const kw = pickOne(kws, i)
    const template = pickOne(NAME_TEMPLATES, i)
    const fullName = template(kw)
    const [base, ...restWords] = fullName.split(" ")
    const italicSuffix = restWords.join(" ")
    out.push({
      name: base!,
      italicSuffix: italicSuffix || undefined,
      tagline: pickOne(
        [
          `A weekly briefing on ${kw} — for ${audKw} who'd rather be ahead.`,
          `Short-form ${kw} for ${audKw}. Two, maybe three minutes.`,
          `The long version of ${kw}, told the way ${audKw} actually read.`,
          `Every ${kw} story we wish someone had told us. Hosted by an agent.`,
          `Where ${audKw} go when the news about ${kw} gets boring.`,
          `${cap(kw)}, in the voice of someone who's been there.`,
        ],
        i,
      ),
      audience: audKw,
      artDirection: pickOne(ART_DIRECTIONS, i),
      accent: pickOne(ACCENTS, i),
    })
  }
  return out
}

export function NameGenerator() {
  const [concept, setConcept] = React.useState(
    "A weekly briefing on emerging internet protocols, for senior engineers who love a good spec fight.",
  )
  const [audience, setAudience] = React.useState("Senior engineers & infra founders")
  const [category, setCategory] = React.useState("Technology")
  const [results, setResults] = React.useState<Suggestion[]>(() =>
    buildSuggestions(
      "A weekly briefing on emerging internet protocols, for senior engineers who love a good spec fight.",
      "Senior engineers & infra founders",
      "Technology",
    ),
  )
  const [seed, setSeed] = React.useState(0)
  const [pending, startTransition] = React.useTransition()

  const generate = () => {
    startTransition(() => {
      setSeed((s) => s + 1)
      setResults(buildSuggestions(concept, audience, category))
    })
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.3fr]">
      <aside className="flex flex-col gap-5 rounded-3xl border border-border/60 bg-card/40 p-6">
        <Field label="Concept">
          <Textarea
            rows={4}
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            className="resize-none"
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Audience">
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} />
          </Field>
          <Field label="Category">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Technology",
                  "Business",
                  "Science",
                  "Design",
                  "Culture",
                  "News",
                  "Finance",
                  "Health",
                ].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={generate} disabled={pending} className="gap-1.5">
            <Wand2 className="size-3.5" />
            {pending ? "Generating…" : seed === 0 ? "Generate names" : "Generate another batch"}
          </Button>
          <p className="text-[0.75rem] text-muted-foreground">
            Output is illustrative — the real pipeline runs research + rationale before settling on
            a name. Try different angles in the concept to see it shift.
          </p>
        </div>
      </aside>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
            <Sparkles className="size-3 text-signal" />
            <span>Batch #{seed + 1}</span>
          </div>
          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={cn("size-3", pending && "animate-spin")} />
            Shuffle
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {results.map((r, i) => (
            <article
              key={`${r.name}-${i}-${seed}`}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-5 shadow-inset-glow"
            >
              <div
                aria-hidden
                className="absolute -right-12 -top-12 size-32 rounded-full blur-2xl opacity-50"
                style={{ background: r.accent }}
              />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col">
                  <span
                    className="font-mono text-[0.65rem] uppercase tracking-[0.16em]"
                    style={{ color: r.accent }}
                  >
                    {category} · for {r.audience}
                  </span>
                  <h3 className="truncate font-display text-[1.7rem] leading-tight tracking-tight">
                    {r.name}{" "}
                    {r.italicSuffix && (
                      <span className="italic text-muted-foreground">{r.italicSuffix}</span>
                    )}
                  </h3>
                </div>
                <span
                  className="shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider"
                  style={{
                    borderColor: `${r.accent}60`,
                    color: r.accent,
                    background: `${r.accent}18`,
                  }}
                >
                  #{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="relative text-[0.9rem] text-muted-foreground">{r.tagline}</p>
              <p className="relative font-mono text-[0.7rem] text-muted-foreground/80">
                Art · {r.artDirection}
              </p>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="relative mt-auto w-fit gap-1.5"
              >
                <Link
                  href={`/sign-up?name=${encodeURIComponent(r.name + (r.italicSuffix ? ` ${r.italicSuffix}` : ""))}`}
                >
                  Start this show <ArrowRight className="size-3" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}
