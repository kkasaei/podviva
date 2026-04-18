"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"

const config = {
  listens: {
    label: "Listens",
    color: "var(--signal)",
  },
  downloads: {
    label: "Downloads",
    color: "var(--success)",
  },
} satisfies ChartConfig

export function AudienceChart({
  data,
}: {
  data: { date: string; listens: number; downloads: number }[]
}) {
  const formatted = React.useMemo(
    () =>
      data.map((d) => ({
        ...d,
        short: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      })),
    [data],
  )
  return (
    <ChartContainer config={config} className="aspect-[16/7] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 16, right: 12, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="listens-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--signal)" stopOpacity={0.45} />
              <stop offset="95%" stopColor="var(--signal)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="downloads-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--success)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="oklch(1 0 0 / 0.05)"
            strokeDasharray="2 4"
          />
          <XAxis
            dataKey="short"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(v, i) => (i % 5 === 0 ? v : "")}
            stroke="var(--muted-foreground)"
            style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            width={42}
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `${v}`
            }
            stroke="var(--muted-foreground)"
            style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="downloads"
            type="monotone"
            stroke="var(--success)"
            strokeWidth={1.5}
            fill="url(#downloads-fill)"
          />
          <Area
            dataKey="listens"
            type="monotone"
            stroke="var(--signal)"
            strokeWidth={2}
            fill="url(#listens-fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
