import { DashboardHeader } from "@/components/dashboard/header"
import { ComingSoon } from "@/components/dashboard/coming-soon"

export default function DistributionPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Control room", href: "/dashboard" },
          { label: "Distribution" },
        ]}
      />
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <ComingSoon
          label="Reach · next up"
          title="Distribution control"
          description="A single surface for the platforms every show reaches — connect YouTube, Apple, Spotify, custom RSS endpoints, and Slack notifications, then toggle per show."
          cta={{ href: "/dashboard", label: "Back to overview" }}
        />
      </div>
    </>
  )
}
