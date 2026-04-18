"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Check, Copy, Terminal } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32)
}

function mockToken(org: string) {
  const seed = org.length * 37 + 101
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789"
  let out = ""
  let x = seed
  for (let i = 0; i < 24; i++) {
    x = (x * 1103515245 + 12345) % 2147483647
    out += alphabet[x % alphabet.length]
  }
  return `pv_mcp_${out}`
}

const tools = [
  { name: "list_shows", desc: "List every show the caller owns." },
  { name: "create_show", desc: "Spin up a new show — agent- or human-authored." },
  { name: "create_episode", desc: "Kick off an episode — agent topic or upload." },
  { name: "get_episode", desc: "Fetch pipeline + distribution state." },
  { name: "approve_stage", desc: "Resume a paused pipeline stage." },
  { name: "translate_episode", desc: "Request transcripts in a specific language." },
  { name: "publish_episode", desc: "Fan out to RSS, YouTube, Apple, Spotify, webhooks." },
]

export function McpConfig() {
  const [org, setOrg] = React.useState("acme-audio")
  const slug = slugify(org) || "your-org"
  const token = React.useMemo(() => mockToken(slug), [slug])

  const claudeConfig = `{
  "mcpServers": {
    "podviva": {
      "url": "https://podviva.fm/mcp",
      "headers": {
        "authorization": "Bearer ${token}",
        "x-podviva-org": "${slug}"
      }
    }
  }
}`

  const cursorConfig = `{
  "mcpServers": {
    "podviva": {
      "command": "npx",
      "args": ["-y", "@podviva/mcp-proxy"],
      "env": {
        "PODVIVA_TOKEN": "${token}",
        "PODVIVA_ORG": "${slug}"
      }
    }
  }
}`

  const curlSnippet = `curl https://podviva.fm/api/v1/shows \\
  -H "authorization: Bearer ${token}" \\
  -H "x-podviva-org: ${slug}"`

  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 rounded-3xl border border-border/60 bg-card/40 p-6 md:grid-cols-[1fr_1.2fr] md:items-end md:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
              Org slug
            </Label>
            <Input value={org} onChange={(e) => setOrg(e.target.value)} className="font-mono" />
            <p className="text-[0.75rem] text-muted-foreground">
              Anything — this tool generates a placeholder config. Real tokens appear in your
              Studio's API & MCP page once you sign up.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background/60 p-5">
          <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
            <Terminal className="size-3.5" />
            Preview
          </div>
          <p className="mt-2 break-all font-mono text-[0.8rem] text-foreground">
            <span className="text-muted-foreground">org</span> {slug}
            <br />
            <span className="text-muted-foreground">token</span> {token}
          </p>
        </div>
      </section>

      <Tabs defaultValue="claude" className="flex flex-col gap-4">
        <TabsList className="h-auto w-fit gap-1 bg-muted/30 p-1">
          {[
            { value: "claude", label: "Claude Desktop" },
            { value: "cursor", label: "Cursor" },
            { value: "http", label: "Raw HTTP" },
          ].map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-md px-3 py-1.5 text-[0.85rem] text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="claude">
          <ConfigBlock
            title="claude_desktop_config.json"
            hint="Paste into ~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%\\Claude\\claude_desktop_config.json (Windows). Restart Claude Desktop after saving."
            code={claudeConfig}
          />
        </TabsContent>
        <TabsContent value="cursor">
          <ConfigBlock
            title="cursor mcp.json"
            hint="Settings → Tools → MCP → paste this config. Cursor hot-reloads after save."
            code={cursorConfig}
          />
        </TabsContent>
        <TabsContent value="http">
          <ConfigBlock
            title="Example REST call"
            hint="The same surface, with a plain HTTPS client. Every MCP tool is also a typed REST endpoint."
            code={curlSnippet}
          />
        </TabsContent>
      </Tabs>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          <Check className="size-3.5 text-success" />
          Once wired, your agent can call
        </div>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {tools.map((t) => (
            <li
              key={t.name}
              className="flex flex-col gap-0.5 rounded-xl border border-border/60 bg-card/40 p-4"
            >
              <code className="font-mono text-[0.82rem] text-foreground">{t.name}</code>
              <span className="text-[0.8rem] text-muted-foreground">{t.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-3 rounded-3xl border border-signal/30 bg-signal/5 p-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl text-[0.9rem] text-muted-foreground">
          Ready to mint a real token? The Studio generates one, scoped to your org and rotatable
          at any time. Plain REST works too — same surface, same tokens.
        </p>
        <Button asChild className="shrink-0 gap-1.5">
          <Link href="/sign-up">
            Get a real token <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function ConfigBlock({ title, hint, code }: { title: string; hint: string; code: string }) {
  const [copied, setCopied] = React.useState(false)
  const onCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className={cn(
            "inline-flex items-center gap-1 rounded-md border border-border/70 bg-muted/30 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider transition-colors hover:bg-muted/60",
            copied ? "text-success" : "text-muted-foreground",
          )}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-2xl border border-border/60 bg-background/60 p-5 font-mono text-[0.82rem] leading-relaxed">
        {code}
      </pre>
      <p className="text-[0.75rem] text-muted-foreground">{hint}</p>
    </div>
  )
}
