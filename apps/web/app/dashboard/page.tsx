import { currentUser } from "@clerk/nextjs/server"
import {
  Activity as ActivityIcon,
  BellRing,
  Radio,
  Waves,
} from "lucide-react"

import { client } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { AudienceChart } from "@/components/dashboard/audience-chart"
import { ApprovalsList } from "@/components/dashboard/approvals-list"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { RecentPublishes } from "@/components/dashboard/recent-publishes"
import { FleetTable } from "@/components/dashboard/fleet-table"
import { Panel } from "@/components/dashboard/panel"

function greeting() {
  const h = new Date("2026-04-19T08:30:00Z").getUTCHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

export default async function DashboardPage() {
  const [user, snapshot] = await Promise.all([currentUser(), client.getDashboardSnapshot()])
  const firstName = user?.firstName ?? user?.username ?? "Producer"

  const totalListensFormatted = snapshot.kpis.totalListens30d.toLocaleString()

  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: "Control room" }]} />

      <div className="flex flex-1 flex-col gap-8 px-6 pb-16 pt-8 lg:px-10">
        {/* Hero */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="on-air-dot" aria-hidden />
              <span>On air</span>
            </span>
            <span className="text-muted-foreground/50">/</span>
            <span>Sat · 19 Apr · 08:30 UTC</span>
          </div>
          <h1 className="font-display text-[2.2rem] leading-[1.05] tracking-tight sm:text-[2.6rem]">
            {greeting()}, {firstName}.
            <span className="block text-muted-foreground">
              <span className="italic">{snapshot.kpis.inPipeline}</span> episodes are moving through
              the pipeline.
            </span>
          </h1>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard
            label="Shows"
            icon={<Radio className="size-3.5" />}
            value={snapshot.kpis.shows.toString()}
            hint={`${snapshot.kpis.inPipeline} in production`}
            tone="signal"
          />
          <KpiCard
            label="Published this week"
            icon={<Waves className="size-3.5" />}
            value={snapshot.kpis.publishedThisWeek.toString()}
            hint="across all shows"
          />
          <KpiCard
            label="Listens · 30d"
            icon={<ActivityIcon className="size-3.5" />}
            value={
              snapshot.kpis.totalListens30d >= 1000
                ? `${(snapshot.kpis.totalListens30d / 1000).toFixed(1)}k`
                : totalListensFormatted
            }
            delta={{ value: snapshot.kpis.listenChange30dPct, label: "vs prev 30d" }}
          />
          <KpiCard
            label="Waiting on you"
            icon={<BellRing className="size-3.5" />}
            value={snapshot.kpis.pendingApproval.toString()}
            hint={snapshot.kpis.pendingApproval > 0 ? "approvals queued" : "clear"}
            tone={snapshot.kpis.pendingApproval > 0 ? "on-air" : "neutral"}
          />
        </section>

        {/* Audience + Approvals */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <Panel
            label="Audience"
            title="Listens · past 30 days"
            description="Aggregated across all shows and platforms"
            action={{ label: "Full report", href: "/dashboard/analytics" }}
            contentClassName="pb-6"
          >
            <AudienceChart data={snapshot.audienceSeries} />
          </Panel>

          <Panel
            label={`Approvals · ${snapshot.approvals.length}`}
            title="Waiting on you"
            description="Stages that require your sign-off before continuing"
            action={{ label: "View all", href: "/dashboard/approvals" }}
            contentClassName="py-0"
          >
            <ApprovalsList items={snapshot.approvals} />
          </Panel>
        </section>

        {/* Activity + Recent publishes */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
          <Panel
            label="Live feed"
            title="Pipeline activity"
            description="Last 48 hours across shows and distribution"
            action={{ label: "Open activity", href: "/dashboard/activity" }}
            contentClassName="py-3"
          >
            <ActivityFeed items={snapshot.activity.slice(0, 7)} />
          </Panel>
          <Panel
            label="Reach"
            title="Recent publishes"
            description="New episodes and the platforms they landed on"
            action={{ label: "Distribution", href: "/dashboard/distribution" }}
            contentClassName="py-0"
          >
            <RecentPublishes items={snapshot.recentPublishes} />
          </Panel>
        </section>

        {/* Fleet */}
        <section className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                Fleet
              </p>
              <h2 className="font-display text-[1.5rem] tracking-tight">Every show at a glance</h2>
            </div>
          </div>
          <FleetTable rows={snapshot.showsSummary} />
        </section>
      </div>
    </>
  )
}
