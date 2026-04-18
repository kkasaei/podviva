"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Check, Sparkles } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

type Period = "monthly" | "yearly"

type Tier = {
  name: string
  monthly: number | null // null = custom pricing
  pitch: string
  cta: string
  ctaHref: string
  features: string[]
  highlight?: boolean
  custom?: boolean
}

const tiers: Tier[] = [
  {
    name: "Listener",
    monthly: 0,
    pitch: "For everyone who presses play.",
    cta: "Start listening",
    ctaHref: "/discover",
    features: [
      "Unlimited listening",
      "Discover Podviva",
      "Multi-language transcripts",
      "Follow shows across devices",
    ],
  },
  {
    name: "Creator",
    monthly: 29,
    pitch: "Everything a modern show needs — including the agent.",
    cta: "Start 14-day trial",
    ctaHref: "/sign-up",
    highlight: true,
    features: [
      "Host unlimited episodes",
      "Agentic production (up to 5 shows)",
      "Distribution · RSS, YouTube, Apple, Spotify",
      "Transcripts + subtitle translations",
      "Approval gates per show",
      "Slack publish webhook",
    ],
  },
  {
    name: "Studio",
    monthly: 99,
    pitch: "For fleets — API, MCP, and priority production.",
    cta: "Start 14-day trial",
    ctaHref: "/sign-up",
    features: [
      "Everything in Creator",
      "Unlimited shows",
      "API access (REST + OpenAPI)",
      "MCP server for your agents",
      "Priority production queue",
      "Custom voice library",
      "SSO + audit log",
    ],
  },
  {
    name: "Custom",
    monthly: null,
    pitch: "Built around how your team ships — procurement, residency, scale.",
    cta: "Talk to sales",
    ctaHref: "mailto:sales@podviva.fm",
    custom: true,
    features: [
      "Volume production pricing",
      "Dedicated inference capacity",
      "Regional data residency (EU, US, APAC)",
      "Bespoke contracts + SLAs",
      "Security review & SOC2 docs",
      "Named onboarding team",
    ],
  },
]

const YEARLY_DISCOUNT = 0.2

function formatPrice(t: Tier, period: Period) {
  if (t.monthly === null) return { value: "Let's talk", suffix: null }
  if (t.monthly === 0) return { value: "$0", suffix: null }
  if (period === "monthly") {
    return { value: `$${t.monthly}`, suffix: "/mo" }
  }
  const yearlyMonthly = Math.round(t.monthly * (1 - YEARLY_DISCOUNT))
  return { value: `$${yearlyMonthly}`, suffix: "/mo, billed yearly" }
}

function yearlyTotal(t: Tier) {
  if (t.monthly === null || t.monthly === 0) return null
  return Math.round(t.monthly * 12 * (1 - YEARLY_DISCOUNT))
}

export function PricingTiers() {
  const [period, setPeriod] = React.useState<Period>("yearly")

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <PeriodToggle period={period} onChange={setPeriod} />
        <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
          <Sparkles className="size-3 text-signal" />
          <span>14-day trial · no card required</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((t) => {
          const p = formatPrice(t, period)
          const yt = yearlyTotal(t)
          return (
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
                    {p.value}
                  </span>
                  {p.suffix && (
                    <span className="font-mono text-[0.75rem] text-muted-foreground">
                      {p.suffix}
                    </span>
                  )}
                </div>
                {period === "yearly" && yt != null && (
                  <p className="nums-tabular font-mono text-[0.7rem] text-signal">
                    ${yt}/year · save 20%
                  </p>
                )}
                {period === "monthly" && t.monthly && t.monthly > 0 && (
                  <p className="font-mono text-[0.7rem] text-muted-foreground">
                    or ${Math.round(t.monthly * (1 - YEARLY_DISCOUNT))}/mo billed yearly
                  </p>
                )}
                <p className="pt-1 text-[0.85rem] text-muted-foreground">{t.pitch}</p>
              </div>
              <ul className="flex flex-col gap-2 text-[0.85rem]">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-signal" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={t.highlight ? "default" : t.custom ? "outline" : "outline"}
                className="mt-auto w-full"
              >
                <Link href={t.ctaHref}>
                  {t.cta}
                  {!t.custom && t.monthly !== 0 && <ArrowRight className="size-3.5" />}
                </Link>
              </Button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function PeriodToggle({
  period,
  onChange,
}: {
  period: Period
  onChange: (p: Period) => void
}) {
  return (
    <div className="relative inline-flex items-center rounded-full border border-border/70 bg-muted/30 p-1 font-mono text-[0.75rem] uppercase tracking-[0.14em]">
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-signal/15 ring-1 ring-signal/40 transition-transform duration-300 ease-out",
          period === "monthly" ? "translate-x-0" : "translate-x-full",
        )}
      />
      {(
        [
          { v: "monthly", label: "Monthly" },
          { v: "yearly", label: "Yearly" },
        ] as const
      ).map((opt) => {
        const active = period === opt.v
        return (
          <button
            key={opt.v}
            type="button"
            onClick={() => onChange(opt.v)}
            className={cn(
              "relative z-10 flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors",
              active ? "text-signal" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>{opt.label}</span>
            {opt.v === "yearly" && (
              <span
                className={cn(
                  "rounded-full border px-1.5 py-0.5 text-[0.6rem]",
                  active
                    ? "border-signal/40 bg-signal/10 text-signal"
                    : "border-border bg-background/40 text-muted-foreground",
                )}
              >
                −20%
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
