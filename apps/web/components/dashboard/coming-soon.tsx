import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

export function ComingSoon({
  label,
  title,
  description,
  cta,
}: {
  label: string
  title: string
  description: string
  cta?: { href: string; label: string }
}) {
  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col items-start gap-5 rounded-3xl border border-border/70 bg-card/60 p-8 shadow-inset-glow md:p-12">
      <span className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-signal">
        <Sparkles className="size-3" />
        {label}
      </span>
      <h1 className="font-display text-[2.2rem] leading-[1.05] tracking-tight md:text-[2.6rem]">
        {title}
      </h1>
      <p className="max-w-xl text-[0.95rem] text-muted-foreground">{description}</p>
      {cta && (
        <Button asChild className="gap-1.5">
          <Link href={cta.href}>
            {cta.label}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      )}
    </div>
  )
}
