import { client } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/header"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { Panel } from "@/components/dashboard/panel"

export default async function ActivityPage() {
  const snapshot = await client.getDashboardSnapshot()

  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: "Control room", href: "/dashboard" }, { label: "Activity" }]}
      />
      <div className="flex flex-1 flex-col gap-6 px-6 pb-16 pt-8 lg:px-10">
        <section>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
            Activity
          </p>
          <h1 className="font-display text-[2rem] leading-none tracking-tight">
            Every pipeline event, in one feed
          </h1>
        </section>
        <Panel title="Live feed" description="Newest first · across all shows and platforms">
          <ActivityFeed items={snapshot.activity} />
        </Panel>
      </div>
    </>
  )
}
