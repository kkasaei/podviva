import { DashboardHeader } from "@/components/dashboard/header"
import { ComingSoon } from "@/components/dashboard/coming-soon"

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: "Control room", href: "/dashboard" }, { label: "Settings" }]}
      />
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <ComingSoon
          label="Org · next up"
          title="Settings"
          description="Org, billing, members, webhooks (including the Slack publish ping), and default voice/art identity."
          cta={{ href: "/dashboard", label: "Back to overview" }}
        />
      </div>
    </>
  )
}
