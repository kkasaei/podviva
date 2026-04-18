import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { CostCalculator } from "./calculator"

export const metadata = {
  title: "Podcast cost calculator",
  description:
    "Compare what a year of podcast production costs on Podviva versus a traditional stack.",
}

export default function CostCalculatorPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
      <Link
        href="/tools"
        className="inline-flex w-fit items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> Free tools
      </Link>
      <header className="flex flex-col gap-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          Cost calculator
        </span>
        <h1 className="max-w-3xl font-display text-[2.6rem] leading-[1.02] tracking-tight md:text-[3.4rem]">
          What a year of this <span className="italic text-signal">actually costs</span>.
        </h1>
        <p className="max-w-2xl text-[1rem] text-muted-foreground">
          Tune the sliders. See the delta between running a modern podcast shop on Podviva versus
          stitching together the tools you'd need to reproduce it.
        </p>
      </header>
      <CostCalculator />
    </div>
  )
}
