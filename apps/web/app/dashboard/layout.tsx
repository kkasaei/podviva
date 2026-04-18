import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-background">
        <div className="relative flex min-h-svh flex-col">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-signal/[0.05] via-transparent to-transparent"
          />
          <div className="bg-grain pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="relative z-10 flex flex-1 flex-col">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
