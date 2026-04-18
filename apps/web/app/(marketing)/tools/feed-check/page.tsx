import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { FeedCheck } from "./check"

export const metadata = {
  title: "RSS feed health check",
  description: "Drop an RSS URL and get a plain-English checklist of what's working and what to fix.",
}

export default function FeedCheckPage() {
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
          RSS health check
        </span>
        <h1 className="max-w-3xl font-display text-[2.6rem] leading-[1.02] tracking-tight md:text-[3.4rem]">
          Is your feed <span className="italic text-signal">actually healthy</span>?
        </h1>
        <p className="max-w-2xl text-[1rem] text-muted-foreground">
          Paste any podcast RSS URL. We'll inspect the feed structure, episode cadence, artwork,
          and distribution footprint — and tell you what to fix before your next publish.
        </p>
      </header>
      <FeedCheck />
    </div>
  )
}
