import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { NameGenerator } from "./generator"

export const metadata = {
  title: "Podcast name generator",
  description: "Drop a topic. Get six agent-generated podcast names, each with a tagline, audience hint, and art direction.",
}

export default function NameGeneratorPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
      <Link
        href="/tools"
        className="inline-flex w-fit items-center gap-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> Free tools
      </Link>
      <header className="flex flex-col gap-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          Name & concept generator
        </span>
        <h1 className="max-w-3xl font-display text-[2.6rem] leading-[1.02] tracking-tight md:text-[3.4rem]">
          Give us a concept.{" "}
          <span className="italic text-signal">Get six show identities.</span>
        </h1>
        <p className="max-w-2xl text-[1rem] text-muted-foreground">
          Fed into the same agent that runs real Podviva shows. No sign-up, no saved state — fire
          and refresh as many times as you like.
        </p>
      </header>
      <NameGenerator />
    </div>
  )
}
