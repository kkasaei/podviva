"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

type Inputs = {
  shows: number
  episodesPerMonth: number
  minutesPerEpisode: number
  languages: number
  mode: "agent" | "host"
}

function fmt$(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`
  return `$${n.toLocaleString()}`
}

function computePodviva(inputs: Inputs) {
  const studioFee = inputs.shows > 5 ? 49 : 15 // upgrade threshold
  const annualSubscription = studioFee * 12 * 0.8 // yearly 20% off
  const episodes = inputs.episodesPerMonth * 12
  const minutes = episodes * inputs.minutesPerEpisode
  const production = inputs.mode === "agent" ? minutes * 0.04 : minutes * 0.01
  const translation = minutes * 0.02 * Math.max(0, inputs.languages - 1)
  return {
    total: Math.round(annualSubscription + production + translation),
    lines: [
      { label: "Platform (yearly)", value: annualSubscription },
      {
        label: inputs.mode === "agent" ? "Agentic production" : "Hosting + processing",
        value: production,
      },
      { label: "Translation fan-out", value: translation },
    ],
  }
}

function computeTraditional(inputs: Inputs) {
  const hosting = 240 * inputs.shows // ~$20/mo Buzzsprout-equivalent per show
  const episodes = inputs.episodesPerMonth * 12
  const minutes = episodes * inputs.minutesPerEpisode
  const editing = inputs.mode === "host" ? minutes * 0.75 : minutes * 2.4 // editor rate (fake)
  const voiceArt =
    inputs.mode === "agent" ? episodes * 6 + episodes * 4 : episodes * 18
  const translation = episodes * inputs.languages * 28
  const distribution = 360 // YT + Slack automation tools
  const scripting = inputs.mode === "agent" ? minutes * 0.9 : minutes * 1.1
  return {
    total: Math.round(hosting + editing + voiceArt + translation + distribution + scripting),
    lines: [
      { label: "Hosting (Buzzsprout-class, × shows)", value: hosting },
      { label: "Editor time", value: editing },
      { label: "Voice + artwork tooling", value: voiceArt },
      { label: "Translation agency", value: translation },
      { label: "Distribution glue (YT + Slack + RSS)", value: distribution },
      { label: "Script + research", value: scripting },
    ],
  }
}

export function CostCalculator() {
  const [inputs, setInputs] = React.useState<Inputs>({
    shows: 3,
    episodesPerMonth: 12,
    minutesPerEpisode: 18,
    languages: 2,
    mode: "agent",
  })
  const podviva = computePodviva(inputs)
  const trad = computeTraditional(inputs)
  const delta = Math.max(0, trad.total - podviva.total)
  const savingsPct = trad.total === 0 ? 0 : Math.round((delta / trad.total) * 100)

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 rounded-3xl border border-border/60 bg-card/40 p-6 md:grid-cols-2 md:p-8">
        <ModeToggle
          value={inputs.mode}
          onChange={(mode) => setInputs((s) => ({ ...s, mode }))}
        />
        <SliderField
          label="Shows"
          value={inputs.shows}
          min={1}
          max={20}
          onChange={(v) => setInputs((s) => ({ ...s, shows: v }))}
          suffix=""
        />
        <SliderField
          label="Episodes per month"
          value={inputs.episodesPerMonth}
          min={1}
          max={120}
          onChange={(v) => setInputs((s) => ({ ...s, episodesPerMonth: v }))}
          suffix=" /mo"
        />
        <SliderField
          label="Minutes per episode"
          value={inputs.minutesPerEpisode}
          min={2}
          max={90}
          onChange={(v) => setInputs((s) => ({ ...s, minutesPerEpisode: v }))}
          suffix=" min"
        />
        <SliderField
          label="Languages"
          value={inputs.languages}
          min={1}
          max={8}
          onChange={(v) => setInputs((s) => ({ ...s, languages: v }))}
          suffix={inputs.languages === 1 ? " · source only" : " total"}
        />
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ResultCard
          label="Podviva"
          tone="signal"
          total={podviva.total}
          lines={podviva.lines}
        />
        <ResultCard
          label="Traditional stack"
          tone="muted"
          total={trad.total}
          lines={trad.lines}
        />
      </section>

      <div className="relative flex flex-col gap-3 overflow-hidden rounded-3xl border border-signal/30 bg-signal/5 p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-signal/20 blur-3xl"
        />
        <div className="relative flex flex-col gap-2">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal">
            Annual delta
          </span>
          <h3 className="font-display text-[3rem] leading-none tracking-tight md:text-[4rem]">
            {fmt$(delta)}{" "}
            <span className="italic text-muted-foreground">
              saved ({savingsPct}% less)
            </span>
          </h3>
          <p className="max-w-xl text-[0.9rem] text-muted-foreground">
            Same output — same episodes, same languages, same distribution — assembled on Podviva
            versus stitched from {trad.lines.length} separate tools and contracts.
          </p>
        </div>
        <div className="relative flex flex-wrap gap-3 pt-2">
          <Button asChild className="gap-1.5">
            <Link href="/sign-up">
              Start saving <ArrowRight className="size-3.5" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ModeToggle({
  value,
  onChange,
}: {
  value: Inputs["mode"]
  onChange: (v: Inputs["mode"]) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
        Production style
      </span>
      <div className="relative inline-flex items-center rounded-full border border-border/70 bg-muted/30 p-1 font-mono text-[0.75rem] uppercase tracking-[0.14em]">
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-signal/15 ring-1 ring-signal/40 transition-transform duration-300 ease-out",
            value === "agent" ? "translate-x-0" : "translate-x-full",
          )}
        />
        {(
          [
            { v: "agent", label: "Agent-led" },
            { v: "host", label: "Host-led" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.v}
            type="button"
            onClick={() => onChange(opt.v)}
            className={cn(
              "relative z-10 rounded-full px-4 py-1.5 transition-colors",
              value === opt.v ? "text-signal" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SliderField({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  suffix?: string
}) {
  const step = (max - min) < 12 ? 1 : max > 60 ? 2 : 1
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <span className="nums-tabular font-display text-[1.6rem] leading-none tracking-tight">
          {value}
          <span className="font-mono text-[0.8rem] text-muted-foreground">
            {suffix}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="grid size-7 place-items-center rounded-md border border-border/70 bg-muted/30 text-muted-foreground hover:text-foreground"
          aria-label="Decrease"
        >
          <ChevronDown className="size-3" />
        </button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted/40 accent-signal"
          style={{
            background: `linear-gradient(to right, var(--signal) ${((value - min) / (max - min)) * 100}%, oklch(1 0 0 / 0.08) ${((value - min) / (max - min)) * 100}%)`,
          }}
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          className="grid size-7 place-items-center rounded-md border border-border/70 bg-muted/30 text-muted-foreground hover:text-foreground"
          aria-label="Increase"
        >
          <ChevronUp className="size-3" />
        </button>
      </div>
    </div>
  )
}

function ResultCard({
  label,
  tone,
  total,
  lines,
}: {
  label: string
  tone: "signal" | "muted"
  total: number
  lines: { label: string; value: number }[]
}) {
  return (
    <article
      className={cn(
        "relative flex flex-col gap-5 overflow-hidden rounded-3xl border p-6",
        tone === "signal"
          ? "border-signal/60 bg-signal/5"
          : "border-border/60 bg-card/40",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "font-mono text-[0.65rem] uppercase tracking-[0.16em]",
            tone === "signal" ? "text-signal" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
          annual
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="nums-tabular font-display text-[3.2rem] leading-none tracking-tight">
          {fmt$(total)}
        </span>
        <span className="font-mono text-[0.85rem] text-muted-foreground">/year</span>
      </div>
      <ul className="flex flex-col divide-y divide-border/60 text-[0.85rem]">
        {lines.map((l) => (
          <li key={l.label} className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">{l.label}</span>
            <span className="nums-tabular font-mono">{fmt$(Math.round(l.value))}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
