import { cn } from "@workspace/ui/lib/utils"

export function KpiCard({
  label,
  value,
  hint,
  delta,
  icon,
  tone = "neutral",
  className,
}: {
  label: string
  value: string
  hint?: string
  delta?: { value: number; label?: string }
  icon?: React.ReactNode
  tone?: "neutral" | "signal" | "on-air"
  className?: string
}) {
  const toneRing = {
    neutral: "",
    signal: "ring-1 ring-signal/30",
    "on-air": "ring-1 ring-on-air/40",
  }[tone]

  const deltaSign = (delta?.value ?? 0) >= 0 ? "+" : ""
  const deltaClass =
    delta == null
      ? ""
      : delta.value >= 0
        ? "text-success"
        : "text-on-air"

  return (
    <div
      className={cn(
        "group relative flex min-w-0 flex-col gap-2 rounded-xl border border-border/80 bg-card/80 p-4 transition-colors hover:border-border shadow-inset-glow",
        toneRing,
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
          {icon && <span className="text-muted-foreground/80">{icon}</span>}
          <span>{label}</span>
        </div>
        {delta != null && (
          <span className={cn("nums-tabular font-mono text-[0.7rem]", deltaClass)}>
            {deltaSign}
            {delta.value.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="nums-tabular font-display text-[2.2rem] leading-none tracking-tight text-foreground">
          {value}
        </span>
        {delta?.label && (
          <span className="text-[0.7rem] text-muted-foreground">{delta.label}</span>
        )}
      </div>
      {hint && <p className="text-[0.75rem] text-muted-foreground">{hint}</p>}
    </div>
  )
}
