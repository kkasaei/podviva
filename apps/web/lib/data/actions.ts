"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { client } from "./index"
import type { Cadence } from "./types"

function cadenceFromForm(data: FormData): Cadence {
  const count = Number(data.get("cadence_count") ?? 1)
  const unit = (data.get("cadence_unit") as Cadence["unit"]) ?? "weekly"
  return {
    count: Number.isFinite(count) && count > 0 ? Math.min(count, 10) : 1,
    unit,
  }
}

export async function createShowAction(data: FormData) {
  const mode = (data.get("mode") as "agent" | "human") ?? "agent"
  const prompt = String(data.get("prompt") ?? "").trim()
  const name = String(data.get("name") ?? "").trim()
  const audience = String(data.get("audience") ?? "").trim()
  const category = String(data.get("category") ?? "").trim()

  const show = await client.createShow({
    mode,
    name: name || undefined,
    prompt: prompt || undefined,
    audience: audience || undefined,
    category: category || undefined,
    cadence: cadenceFromForm(data),
  })
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/shows")
  redirect(`/dashboard/shows/${show.id}`)
}

export async function createEpisodeAction(data: FormData) {
  const showId = String(data.get("show_id"))
  const mode = (data.get("mode") as "agent" | "human_upload") ?? "agent"

  const episode =
    mode === "agent"
      ? await client.createEpisode({
          showId,
          mode: "agent",
          topic: String(data.get("topic") ?? "").trim(),
        })
      : await client.createEpisode({
          showId,
          mode: "human_upload",
          title: String(data.get("title") ?? "").trim() || "Untitled episode",
          audioFileName: String(data.get("audio_file_name") ?? "upload.mp3"),
        })

  revalidatePath(`/dashboard/shows/${showId}`)
  revalidatePath("/dashboard")
  redirect(`/dashboard/episodes/${episode.id}`)
}
