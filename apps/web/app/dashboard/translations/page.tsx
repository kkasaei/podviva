import { DashboardHeader } from "@/components/dashboard/header"
import { ComingSoon } from "@/components/dashboard/coming-soon"

export default function TranslationsPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Control room", href: "/dashboard" },
          { label: "Translations" },
        ]}
      />
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <ComingSoon
          label="Languages · next up"
          title="Translations studio"
          description="Transcripts and subtitles per episode in every language you ship. Dubbed audio lands later once we're confident the voice identity survives translation."
          cta={{ href: "/dashboard", label: "Back to overview" }}
        />
      </div>
    </>
  )
}
