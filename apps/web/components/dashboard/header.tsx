"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Bell, Command, Plus, Search } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"

type Breadcrumb = { label: string; href?: string }

export function DashboardHeader({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="size-7" />
      <Separator orientation="vertical" className="h-5" />
      <nav className="flex min-w-0 items-center gap-2 text-sm">
        {breadcrumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-muted-foreground/60" aria-hidden>
                /
              </span>
            )}
            {c.href ? (
              <Link
                href={c.href}
                className="text-muted-foreground hover:text-foreground transition-colors truncate"
              >
                {c.label}
              </Link>
            ) : (
              <span className="truncate font-medium text-foreground">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="group hidden sm:flex h-8 items-center gap-2 rounded-md border border-border bg-muted/40 pl-2.5 pr-1.5 text-[0.8rem] text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
        >
          <Search className="size-3.5" />
          <span>Jump to show, episode, command…</span>
          <kbd className="ml-6 inline-flex items-center gap-0.5 rounded border border-border bg-background px-1 font-mono text-[0.65rem] text-muted-foreground">
            <Command className="size-2.5" />K
          </kbd>
        </button>
        <ThemeToggle />
        <Button size="icon-sm" variant="ghost" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/dashboard/shows/new">
            <Plus className="size-3.5" />
            New show
          </Link>
        </Button>
        <UserButton />
      </div>
    </header>
  )
}
