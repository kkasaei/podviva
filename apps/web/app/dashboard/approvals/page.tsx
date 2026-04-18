import { client } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/header"
import { ApprovalsList } from "@/components/dashboard/approvals-list"
import { Panel } from "@/components/dashboard/panel"

export default async function ApprovalsPage() {
  const snapshot = await client.getDashboardSnapshot()

  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: "Control room", href: "/dashboard" }, { label: "Approvals" }]}
      />
      <div className="flex flex-1 flex-col gap-8 px-6 pb-16 pt-8 lg:px-10">
        <section className="flex flex-col gap-1">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
            Approvals · {snapshot.approvals.length}
          </p>
          <h1 className="font-display text-[2rem] leading-none tracking-tight">
            Everything waiting on you
          </h1>
          <p className="text-[0.85rem] text-muted-foreground">
            Approve to continue the pipeline. Reject to kick the stage back to the agent.
          </p>
        </section>

        <Panel title="Pending review" description="Ordered by how long they've been waiting">
          <ApprovalsList items={snapshot.approvals} />
        </Panel>
      </div>
    </>
  )
}
