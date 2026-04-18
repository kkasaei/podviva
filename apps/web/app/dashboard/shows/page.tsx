import Link from "next/link"
import { ArrowUpRight, Bot, Mic2, Plus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { client } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/header"

const CADENCE_UNIT: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
}

export default async function ShowsPage() {
  const shows = await client.listShows()
  const agentAuthored = shows.filter((s) => s.createdBy === "agent").length
  const totalListens = shows.reduce((acc, s) => acc + s.totalListens, 0)

  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: "Control room", href: "/dashboard" }, { label: "Shows" }]}
      />

      <div className="flex flex-1 flex-col gap-8 px-6 pb-16 pt-8 lg:px-10">
        <section className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              Shows · {shows.length}
            </p>
            <h1 className="font-display text-[2.4rem] leading-[1.05] tracking-tight">
              Your show fleet
            </h1>
            <p className="max-w-2xl text-[0.9rem] text-muted-foreground">
              {agentAuthored} agent-authored · {shows.length - agentAuthored} host-led ·{" "}
              {totalListens.toLocaleString()} listens across 30 days.
            </p>
          </div>
          <Button asChild className="gap-1.5">
            <Link href="/dashboard/shows/new">
              <Plus className="size-3.5" />
              New show
            </Link>
          </Button>
        </section>

        {shows.length === 0 ? (
          <section className="flex flex-col items-start gap-4 rounded-3xl border border-dashed border-border/70 bg-card/40 p-10">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              Your fleet
            </span>
            <div className="flex max-w-xl flex-col gap-1">
              <h2 className="font-display text-[1.6rem] leading-tight tracking-tight">
                Nothing here yet.
              </h2>
              <p className="text-[0.9rem] text-muted-foreground">
                Give the agent a topic, or bring your own audio. Either way, your first show lives
                here — with every episode, every stage, every language.
              </p>
            </div>
            <Button asChild className="gap-1.5">
              <Link href="/dashboard/shows/new">
                <Plus className="size-3.5" />
                Start your first show
              </Link>
            </Button>
          </section>
        ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shows.map((show) => {
            const gatedCount = Object.values(show.autonomyConfig).filter(
              (v) => v === "approve",
            ).length
            const trendPositive = show.trend30d >= 0
            return (
              <Link
                key={show.id}
                href={`/dashboard/shows/${show.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 shadow-inset-glow transition-colors hover:border-border"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={show.coverArtUrl}
                    alt=""
                    className="aspect-[16/7] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/90" />
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-border/80 bg-background/80 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider backdrop-blur">
                    {show.createdBy === "agent" ? (
                      <>
                        <Bot className="size-3 text-signal" /> Agent
                      </>
                    ) : (
                      <>
                        <Mic2 className="size-3" /> Host
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-display text-[1.3rem] leading-tight tracking-tight">
                    {show.name}
                  </h3>
                  <p className="line-clamp-2 text-[0.85rem] text-muted-foreground">
                    {show.concept}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.7rem]">
                    <span className="rounded-full border border-border/70 bg-muted/30 px-2 py-0.5 font-mono uppercase tracking-wider text-muted-foreground">
                      {CADENCE_UNIT[show.cadence.unit]}
                    </span>
                    <span className="rounded-full border border-border/70 bg-muted/30 px-2 py-0.5 font-mono uppercase tracking-wider text-muted-foreground">
                      {show.voiceLabel.split(" ")[0]}
                    </span>
                    {gatedCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-on-air/40 bg-on-air/10 px-2 py-0.5 font-mono uppercase tracking-wider text-on-air">
                        {gatedCount} gated
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    <div>
                      <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                        Listens · 30d
                      </p>
                      <p className="nums-tabular font-display text-[1.4rem] leading-none">
                        {show.totalListens.toLocaleString()}
                      </p>
                      <p
                        className={cn(
                          "nums-tabular font-mono text-[0.75rem]",
                          trendPositive ? "text-success" : "text-on-air",
                        )}
                      >
                        {trendPositive ? "+" : ""}
                        {show.trend30d.toFixed(1)}%
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                  </div>
                </div>
              </Link>
            )
          })}
        </section>
        )}
      </div>
    </>
  )
}
