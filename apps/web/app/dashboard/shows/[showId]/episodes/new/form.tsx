"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Bot, FileAudio2, Upload } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"

import { createEpisodeAction } from "@/lib/data/actions"

export function NewEpisodeForm({ showId }: { showId: string }) {
  const [mode, setMode] = React.useState<"agent" | "human_upload">("agent")
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()

  return (
    <form
      action={(data) => {
        if (mode === "human_upload" && fileName) {
          data.set("audio_file_name", fileName)
        }
        startTransition(() => createEpisodeAction(data))
      }}
      className="flex flex-col gap-6"
    >
      <input type="hidden" name="show_id" value={showId} />
      <input type="hidden" name="mode" value={mode} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ModeCard
          active={mode === "agent"}
          onClick={() => setMode("agent")}
          icon={Bot}
          label="Agent"
          headline="Give the agent a topic."
          body="It researches, writes, casts the voice, and renders the audio. You'll be pinged if a stage needs your review."
        />
        <ModeCard
          active={mode === "human_upload"}
          onClick={() => setMode("human_upload")}
          icon={Upload}
          label="Upload"
          headline="Drop a finished recording."
          body="We'll host it, transcribe it, and publish across your distribution channels. Transcripts and translations happen automatically."
        />
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 p-6 shadow-inset-glow lg:p-8">
        {mode === "agent" ? (
          <div className="flex flex-col gap-5">
            <Field label="Topic" hint="Two or three sentences is plenty.">
              <Textarea
                name="topic"
                rows={5}
                required
                placeholder="Deep dive on what ATProto v2 changes for federated social teams already shipping against v1."
                className="resize-none"
              />
            </Field>
            <div className="flex gap-3 rounded-xl border border-signal/20 bg-signal/5 p-4 text-[0.8rem] text-muted-foreground">
              <span className="mt-0.5 inline-flex size-4 items-center justify-center rounded-full bg-signal/20 text-signal">
                ●
              </span>
              <p>
                Research starts immediately. The script stage will wait for your review if it's
                gated in the show's autonomy config.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <Field label="Title">
              <Input name="title" required placeholder="Postmortem culture at a 400-person infra team" />
            </Field>

            <Field label="Audio">
              <UploadBox fileName={fileName} onFile={setFileName} />
            </Field>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/dashboard/shows/${showId}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending} className="gap-1.5">
            {pending
              ? "Starting…"
              : mode === "agent"
                ? "Kick off agent"
                : "Create episode"}
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </form>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[0.75rem] text-muted-foreground">{hint}</p>}
    </div>
  )
}

function ModeCard({
  active,
  onClick,
  icon: Icon,
  label,
  headline,
  body,
}: {
  active: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
  headline: string
  body: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border bg-card/60 p-5 text-left transition-colors shadow-inset-glow",
        active
          ? "border-signal/60 bg-signal/5 ring-1 ring-signal/30"
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
            "size-2.5 rounded-full border",
            active ? "border-signal bg-signal" : "border-border",
          )}
          aria-hidden
        />
      </div>
      <h3 className="font-display text-[1.2rem] leading-tight tracking-tight">{headline}</h3>
      <p className="text-[0.82rem] text-muted-foreground">{body}</p>
    </button>
  )
}

function UploadBox({
  fileName,
  onFile,
}: {
  fileName: string | null
  onFile: (name: string | null) => void
}) {
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const f = e.dataTransfer.files?.[0]
        if (f) onFile(f.name)
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/10 px-6 py-10 text-center transition-colors",
        dragging
          ? "border-signal/60 bg-signal/10 text-signal"
          : "border-border hover:border-border/80",
      )}
    >
      <div className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card">
        <FileAudio2 className="size-4" />
      </div>
      {fileName ? (
        <>
          <p className="font-mono text-[0.85rem]">{fileName}</p>
          <button
            type="button"
            onClick={() => {
              onFile(null)
              if (inputRef.current) inputRef.current.value = ""
            }}
            className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Replace file
          </button>
        </>
      ) : (
        <>
          <p className="font-display text-[1rem] leading-tight">Drop audio here</p>
          <p className="text-[0.78rem] text-muted-foreground">WAV, MP3, or FLAC · up to 2GB</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 rounded-md border border-border bg-background px-3 py-1 text-[0.75rem] hover:bg-muted/40"
          >
            Or choose a file
          </button>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0]?.name ?? null)}
      />
    </div>
  )
}
