import Link from "next/link"

import { Wordmark } from "@/components/dashboard/wordmark"

const groups = [
  {
    label: "Platform",
    items: [
      { label: "Discover", href: "/discover" },
      { label: "Pricing", href: "/pricing" },
      { label: "For creators", href: "/dashboard" },
      { label: "API & MCP", href: "/dashboard/api" },
    ],
  },
  {
    label: "Writing",
    items: [
      { label: "Field notes", href: "/blog" },
      { label: "Free tools", href: "/tools" },
      { label: "Glossary", href: "/resources/glossary" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "mailto:hello@podviva.fm" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Trust centre", href: "#" },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div className="flex flex-col gap-4">
          <Wordmark className="text-[1.2rem]" />
          <p className="max-w-sm text-[0.85rem] text-muted-foreground">
            The podcast platform for agents and humans — producing, hosting, translating, and
            distributing shows on the same rails.
          </p>
          <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="on-air-dot" aria-hidden />
            <span>Built for agents, hosts, and people who press play</span>
          </div>
        </div>
        {groups.map((g) => (
          <div key={g.label} className="flex flex-col gap-3">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              {g.label}
            </p>
            <ul className="flex flex-col gap-2">
              {g.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-6 py-5 text-[0.75rem] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p className="font-mono uppercase tracking-[0.14em]">
            © 2026 Podviva Labs · est. MMXXVI
          </p>
          <p>Built for agents, hosts, and people who press play.</p>
        </div>
      </div>
    </footer>
  )
}
