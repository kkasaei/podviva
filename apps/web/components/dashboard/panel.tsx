import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

export function Panel({
  label,
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: {
  label?: string
  title: string
  description?: string
  action?: { label: string; href: string }
  children: React.ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <section
      className={cn(
        "relative flex min-w-0 flex-col rounded-xl border border-border/70 bg-card/60 shadow-inset-glow",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div className="flex min-w-0 flex-col gap-1">
          {label && (
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              {label}
            </span>
          )}
          <h2 className="font-display text-[1.15rem] leading-tight tracking-tight text-foreground">
            {title}
          </h2>
          {description && (
            <p className="text-[0.8rem] text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="shrink-0 inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            {action.label}
            <ArrowUpRight className="size-3" />
          </Link>
        )}
      </header>
      <div className={cn("flex-1 px-5 py-4", contentClassName)}>{children}</div>
    </section>
  )
}
