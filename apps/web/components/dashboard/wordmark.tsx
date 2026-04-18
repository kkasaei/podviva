import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"

export function Wordmark({
  className,
  href = "/",
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-display text-[1.1rem] leading-none tracking-[-0.015em]",
        className,
      )}
      aria-label="Podviva"
    >
      <Mark className="shrink-0" />
      <span className="flex items-baseline whitespace-nowrap group-data-[collapsible=icon]:hidden">
        <span className="text-foreground">Pod</span>
        <span className="italic text-signal">viva</span>
      </span>
    </Link>
  )
}

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-[1.35rem] text-signal", className)}
    >
      <circle cx="12" cy="12" r="10" strokeWidth="1.4" opacity="0.55" />
      <circle cx="12" cy="12" r="5.6" strokeWidth="1.4" opacity="0.85" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  )
}
