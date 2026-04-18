import { cn } from "@workspace/ui/lib/utils"

// Decorative pseudo-random waveform, deterministic per seed.
export function Waveform({
  seed = 1,
  bars = 72,
  className,
  animated = true,
}: {
  seed?: number
  bars?: number
  className?: string
  animated?: boolean
}) {
  const heights = React.useMemo(() => {
    const out: number[] = []
    let x = seed
    for (let i = 0; i < bars; i++) {
      x = (x * 9301 + 49297) % 233280
      const h = 0.2 + (x / 233280) * 0.8
      const envelope = Math.sin((i / bars) * Math.PI)
      out.push(Math.max(0.15, h * envelope))
    }
    return out
  }, [seed, bars])

  return (
    <div
      className={cn(
        "flex h-20 items-center gap-[2px] overflow-hidden rounded-md px-2",
        className,
      )}
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] rounded-full bg-signal/70",
            animated && "waveform-bar",
          )}
          style={{
            height: `${Math.round(h * 100)}%`,
            animationDelay: `${(i * 40) % 1600}ms`,
            animationPlayState: animated ? "running" : "paused",
          }}
        />
      ))}
    </div>
  )
}

import * as React from "react"
