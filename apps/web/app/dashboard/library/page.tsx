import { DashboardHeader } from "@/components/dashboard/header"
import { ComingSoon } from "@/components/dashboard/coming-soon"

export default function LibraryPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: "Control room", href: "/dashboard" }, { label: "Library" }]}
      />
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <ComingSoon
          label="Studio · next up"
          title="Your library"
          description="Voices, music beds, intros, stingers, and brand guidelines — the palette every show draws from. Locked per-show or shared across the fleet."
          cta={{ href: "/dashboard", label: "Back to overview" }}
        />
      </div>
    </>
  )
}
