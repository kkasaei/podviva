import { notFound } from "next/navigation"
import { client } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/header"
import { NewEpisodeForm } from "./form"

export default async function NewEpisodePage({
  params,
}: {
  params: Promise<{ showId: string }>
}) {
  const { showId } = await params
  const show = await client.getShow(showId)
  if (!show) notFound()

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Control room", href: "/dashboard" },
          { label: "Shows", href: "/dashboard/shows" },
          { label: show.name, href: `/dashboard/shows/${show.id}` },
          { label: "New episode" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-8 px-6 pb-16 pt-8 lg:px-10">
        <section className="flex items-end gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={show.coverArtUrl}
            alt=""
            className="size-20 shrink-0 rounded-xl object-cover ring-1 ring-border/60"
          />
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              {show.name}
            </p>
            <h1 className="font-display text-[2.2rem] leading-none tracking-tight">
              New episode
            </h1>
            <p className="max-w-2xl text-[0.9rem] text-muted-foreground">
              Let the agent produce it from a topic, or upload a finished recording.
            </p>
          </div>
        </section>

        <NewEpisodeForm showId={show.id} />
      </div>
    </>
  )
}
