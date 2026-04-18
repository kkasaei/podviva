"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Bot, Mic2, Sparkles } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

import { DashboardHeader } from "@/components/dashboard/header"
import { createShowAction } from "@/lib/data/actions"

type Mode = "agent" | "human"

export default function NewShowPage() {
  const [mode, setMode] = React.useState<Mode>("agent")
  const [pending, startTransition] = React.useTransition()

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Control room", href: "/dashboard" },
          { label: "Shows", href: "/dashboard/shows" },
          { label: "New show" },
        ]}
      />
      <div className="flex flex-1 flex-col gap-8 px-6 pb-16 pt-8 lg:px-10">
        <section className="flex flex-col gap-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            New show
          </p>
          <h1 className="font-display text-[2.4rem] leading-[1.05] tracking-tight">
            Start a show<span className="text-signal">.</span>
          </h1>
          <p className="max-w-2xl text-[0.95rem] text-muted-foreground">
            Podviva can produce every episode end-to-end, or it can host a show you voice yourself.
            Pick the mode that fits — you can change it later per episode.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <ModeCard
            active={mode === "agent"}
            onClick={() => setMode("agent")}
            icon={Bot}
            label="Agent-led"
            headline="Hand the mic to the agent."
            body="Podviva's agent writes, voices, and produces each episode on cadence. You approve the stages you care about and let the rest run."
            tags={["Hands-off", "Recurring", "Fastest to ship"]}
          />
          <ModeCard
            active={mode === "human"}
            onClick={() => setMode("human")}
            icon={Mic2}
            label="Host-led"
            headline="Your voice, our platform."
            body="Bring your own recordings. Podviva handles hosting, transcripts, translation, and distribution so you can focus on the conversation."
            tags={["Upload", "Transcripts", "API-friendly"]}
          />
        </div>

        <form
          action={(data) => startTransition(() => createShowAction(data))}
          className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-card/60 p-6 shadow-inset-glow lg:p-8"
        >
          <input type="hidden" name="mode" value={mode} />

          {mode === "agent" ? (
            <>
              <Field
                label="Concept"
                hint="One or two sentences. The agent will fill in a name, audience, and art from this."
              >
                <Textarea
                  name="prompt"
                  required
                  rows={4}
                  placeholder="Weekly five-minute briefing on emerging internet protocols, for senior engineers who love a good spec fight."
                  className="resize-none font-sans"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Category" optional>
                  <Input
                    name="category"
                    placeholder="Technology, Design, News…"
                  />
                </Field>
                <CadenceField />
              </div>
              <HintBlock
                icon={Sparkles}
                title="What the agent will decide for you"
                body="Show name, audience, cover art, voice profile, and a starter episode draft. Each field is flagged 'agent-set' so you can override from the show page."
              />
            </>
          ) : (
            <>
              <Field label="Show name">
                <Input name="name" required placeholder="Ops Corner with Sam" />
              </Field>
              <Field label="Concept">
                <Textarea
                  name="prompt"
                  required
                  rows={3}
                  placeholder="Sam interviews platform engineers about ops war stories."
                  className="resize-none"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Who's it for?">
                  <Input name="audience" placeholder="Platform and SRE teams" />
                </Field>
                <Field label="Category">
                  <Input name="category" placeholder="Engineering" />
                </Field>
              </div>
              <CadenceField />
            </>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/shows">Cancel</Link>
            </Button>
            <Button type="submit" disabled={pending} className="gap-1.5">
              {pending ? "Starting…" : "Create show"}
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

function ModeCard({
  active,
  onClick,
  icon: Icon,
  label,
  headline,
  body,
  tags,
}: {
  active: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
  headline: string
  body: string
  tags: string[]
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border bg-card/60 p-6 text-left transition-colors shadow-inset-glow",
        active
          ? "border-signal/70 bg-signal/5 ring-1 ring-signal/30"
          : "border-border/60 hover:border-border",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-md border px-2 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em]",
            active
              ? "border-signal/40 bg-signal/10 text-signal"
              : "border-border bg-muted/40 text-muted-foreground",
          )}
        >
          <Icon className="size-3.5" />
          {label}
        </span>
        <span
          className={cn(
            "size-2.5 rounded-full border transition-colors",
            active ? "border-signal bg-signal" : "border-border",
          )}
          aria-hidden
        />
      </div>
      <h3 className="font-display text-[1.5rem] leading-tight tracking-tight">{headline}</h3>
      <p className="text-[0.9rem] text-muted-foreground">{body}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border/70 bg-muted/30 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </button>
  )
}

function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string
  hint?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </Label>
        {optional && (
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground/60">
            optional
          </span>
        )}
      </div>
      {children}
      {hint && <p className="text-[0.75rem] text-muted-foreground">{hint}</p>}
    </div>
  )
}

function CadenceField() {
  return (
    <Field label="Cadence">
      <div className="flex items-center gap-2">
        <Input
          name="cadence_count"
          type="number"
          min={1}
          max={10}
          defaultValue={1}
          className="w-20 font-mono"
        />
        <Select name="cadence_unit" defaultValue="weekly">
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">per day</SelectItem>
            <SelectItem value="weekly">per week</SelectItem>
            <SelectItem value="biweekly">every two weeks</SelectItem>
            <SelectItem value="monthly">per month</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Field>
  )
}

function HintBlock({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-signal/20 bg-signal/5 p-4">
      <Icon className="mt-0.5 size-4 shrink-0 text-signal" />
      <div className="flex flex-col gap-1">
        <p className="text-[0.85rem] font-medium">{title}</p>
        <p className="text-[0.78rem] text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}
