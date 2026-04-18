import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

type Cta = { label: string; href: string; variant?: "default" | "outline" }

export function EmptyState({
  title,
  body,
  cta,
  secondary,
  icon: Icon = Sparkles,
  tone = "neutral",
  className,
}: {
  title: string
  body?: string
  cta?: Cta
  secondary?: Cta
  icon?: React.ComponentType<{ className?: string }>
  tone?: "neutral" | "signal"
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border p-8",
        tone === "signal"
          ? "border-signal/30 bg-signal/5"
          : "border-border/60 bg-card/40",
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/60">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex max-w-lg flex-col gap-2">
        <h3 className="font-display text-[1.3rem] leading-tight tracking-tight">{title}</h3>
        {body && <p className="text-[0.9rem] text-muted-foreground">{body}</p>}
      </div>
      {(cta || secondary) && (
        <div className="flex flex-wrap gap-2">
          {cta && (
            <Button asChild size="sm" variant={cta.variant ?? "default"} className="gap-1.5">
              <Link href={cta.href}>
                {cta.label}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
          {secondary && (
            <Button asChild size="sm" variant="ghost">
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
