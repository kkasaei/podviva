"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  BellRing,
  Gauge,
  Languages,
  Library,
  Radio,
  Satellite,
  Settings2,
  Terminal,
  Waves,
} from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { Wordmark } from "@/components/dashboard/wordmark"

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  matchExact?: boolean
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Studio",
    items: [
      { label: "Overview", href: "/dashboard", icon: Gauge, matchExact: true },
      { label: "Shows", href: "/dashboard/shows", icon: Radio },
      { label: "Episodes", href: "/dashboard/episodes", icon: Waves },
      { label: "Library", href: "/dashboard/library", icon: Library },
    ],
  },
  {
    label: "Pipeline",
    items: [
      { label: "Approvals", href: "/dashboard/approvals", icon: BellRing, badge: "2" },
      { label: "Activity", href: "/dashboard/activity", icon: Activity },
    ],
  },
  {
    label: "Reach",
    items: [
      { label: "Distribution", href: "/dashboard/distribution", icon: Satellite },
      { label: "Translations", href: "/dashboard/translations", icon: Languages },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "API & MCP", href: "/dashboard/api", icon: Terminal, badge: "Premium" },
      { label: "Settings", href: "/dashboard/settings", icon: Settings2 },
    ],
  },
]

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href
  if (href === "/dashboard") return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function DashboardSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-14 justify-center px-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <Wordmark href="/dashboard" />
      </SidebarHeader>
      <SidebarContent className="gap-1">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-3 pb-1 text-[0.65rem] font-mono font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href, item.matchExact)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={cn(
                          "h-8 gap-2 rounded-md px-2 text-[0.85rem]",
                          active
                            ? "bg-sidebar-accent text-foreground shadow-inset-glow"
                            : "text-sidebar-foreground/75",
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4 opacity-80" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge
                          className={cn(
                            "font-mono text-[0.65rem] uppercase tracking-wider",
                            item.badge === "Premium"
                              ? "text-signal"
                              : "text-on-air",
                          )}
                        >
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:hidden">
        <div className="group/card relative overflow-hidden rounded-md border border-sidebar-border bg-sidebar-accent/40 p-3">
          <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="on-air-dot" aria-hidden />
            <span>Live pipeline</span>
          </div>
          <p className="mt-2 font-display text-[0.95rem] leading-tight text-foreground">
            3 episodes mid-production
          </p>
          <p className="mt-1 text-[0.7rem] text-muted-foreground">
            2 waiting on approval · 1 rendering
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
