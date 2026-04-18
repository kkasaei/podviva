import { Copy, KeyRound, Sparkles, Terminal } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { DashboardHeader } from "@/components/dashboard/header"
import { Panel } from "@/components/dashboard/panel"

export default function ApiPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: "Control room", href: "/dashboard" }, { label: "API & MCP" }]}
      />
      <div className="flex flex-1 flex-col gap-8 px-6 pb-16 pt-8 lg:px-10">
        <section className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-signal">
            <Sparkles className="size-3" />
            Premium
          </span>
          <h1 className="font-display text-[2.4rem] leading-[1.05] tracking-tight">
            Drive Podviva from your own stack.
          </h1>
          <p className="max-w-2xl text-[0.95rem] text-muted-foreground">
            Every capability in the UI is also a REST endpoint and an MCP tool. Point Claude, Cursor,
            or your own service at Podviva and let the agent own the show.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel
            label="MCP"
            title="Wire it into Claude or Cursor"
            description="A paste-ready config for MCP-aware hosts"
          >
            <div className="flex flex-col gap-3">
              <pre className="overflow-x-auto rounded-xl border border-border/70 bg-background/60 p-4 font-mono text-[0.8rem] leading-relaxed">
{`{
  "mcpServers": {
    "podviva": {
      "url": "https://podviva.fm/mcp",
      "token": "pv_mcp_•••••••••••••"
    }
  }
}`}
              </pre>
              <Button variant="outline" className="w-fit gap-1.5">
                <Copy className="size-3.5" /> Copy config
              </Button>
            </div>
          </Panel>

          <Panel
            label="REST"
            title="Same surface over HTTPS"
            description="Auth with an API key; every route is zod-validated"
          >
            <div className="flex flex-col gap-3">
              <pre className="overflow-x-auto rounded-xl border border-border/70 bg-background/60 p-4 font-mono text-[0.8rem] leading-relaxed">
{`curl https://podviva.fm/api/v1/shows \\
  -H "authorization: Bearer pv_key_•••••"
`}
              </pre>
              <Button variant="outline" className="w-fit gap-1.5">
                <Terminal className="size-3.5" /> Open docs
              </Button>
            </div>
          </Panel>
        </div>

        <Panel
          label="Keys"
          title="API keys"
          description="Rotate anytime · live + test environments · scoped to your org"
          action={{ label: "New key", href: "#" }}
        >
          <ul className="flex flex-col divide-y divide-border/60">
            {[
              { name: "Production", prefix: "pv_key_live_•••", lastUsed: "12m ago" },
              { name: "Staging", prefix: "pv_key_test_•••", lastUsed: "2d ago" },
            ].map((k) => (
              <li key={k.name} className="flex items-center gap-4 py-3">
                <span className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/40">
                  <KeyRound className="size-3.5" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="text-[0.9rem] font-medium">{k.name}</span>
                  <code className="font-mono text-[0.75rem] text-muted-foreground">{k.prefix}</code>
                </div>
                <span className="ml-auto font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                  last used {k.lastUsed}
                </span>
                <Button variant="ghost" size="sm">
                  Rotate
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  )
}
