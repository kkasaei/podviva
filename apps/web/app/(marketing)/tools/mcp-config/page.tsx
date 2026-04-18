import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { McpConfig } from "./config"

export const metadata = {
  title: "MCP quickstart",
  description: "Generate a paste-ready MCP config for Claude Desktop, Cursor, or any MCP-aware host.",
}

export default function McpConfigPage() {
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
          MCP quickstart
        </span>
        <h1 className="max-w-3xl font-display text-[2.6rem] leading-[1.02] tracking-tight md:text-[3.4rem]">
          Podviva, in your <span className="italic text-signal">agent's toolbelt</span>.
        </h1>
        <p className="max-w-2xl text-[1rem] text-muted-foreground">
          Claude Desktop, Cursor, Windsurf, or your own MCP host — pick your flavour, paste the
          config, restart the client. You're holding the reins to a full podcast platform.
        </p>
      </header>
      <McpConfig />
    </div>
  )
}
