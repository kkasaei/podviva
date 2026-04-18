import { client } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/header"
import { EpisodeRow } from "@/components/dashboard/episode-row"
import { Panel } from "@/components/dashboard/panel"

export default async function EpisodesPage() {
  const episodes = await client.listEpisodes()

  const active = episodes.filter((e) =>
    e.stages.some((s) => s.status === "running" || s.status === "pending_approval"),
  )
  const published = episodes.filter((e) => Boolean(e.publishedAt))

  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: "Control room", href: "/dashboard" }, { label: "Episodes" }]}
      />
      <div className="flex flex-1 flex-col gap-8 px-6 pb-16 pt-8 lg:px-10">
        <section className="flex flex-col gap-1">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
            Episodes
          </p>
          <h1 className="font-display text-[2rem] leading-none tracking-tight">
            Every episode across every show
          </h1>
          <p className="text-[0.85rem] text-muted-foreground">
            Sort by what needs your attention, or browse by what's already shipped.
          </p>
        </section>

        <Panel
          label={`${active.length} active`}
          title="In production right now"
          description="Drafts, mid-pipeline, and awaiting review"
          contentClassName="px-0 py-0"
        >
          {active.length === 0 ? (
            <div className="py-10 text-center text-[0.85rem] text-muted-foreground">
              Nothing running. Kick off a new episode from any show.
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {active.map((ep) => (
                <li key={ep.id}>
                  <EpisodeRow ep={ep} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          label={`${published.length} published`}
          title="Shipped"
          description="Everything live in the wild, most recent first"
          contentClassName="px-0 py-0"
        >
          <ul className="divide-y divide-border/60">
            {published.map((ep) => (
              <li key={ep.id}>
                <EpisodeRow ep={ep} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  )
}
