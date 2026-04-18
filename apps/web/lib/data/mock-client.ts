import type { PodvivaClient } from "./client"
import type {
  ActivityItem,
  ApprovalItem,
  AutonomyConfig,
  CreateEpisodeInput,
  CreateShowInput,
  DashboardSnapshot,
  Episode,
  EpisodeStage,
  ListenPoint,
  RecentPublish,
  Show,
  StageName,
} from "./types"

const STAGE_ORDER: StageName[] = [
  "research",
  "script",
  "voice_cast",
  "tts",
  "artwork",
  "assemble",
  "publish",
]

const FULL_AUTO: AutonomyConfig = {
  research: "auto",
  script: "auto",
  voice_cast: "auto",
  tts: "auto",
  artwork: "auto",
  assemble: "auto",
  publish: "auto",
}

const GATED_SCRIPT: AutonomyConfig = {
  ...FULL_AUTO,
  script: "approve",
  publish: "approve",
}

const GATED_PUBLISH: AutonomyConfig = { ...FULL_AUTO, publish: "approve" }

// Deterministic pseudo-randomness so mocks don't flicker between renders.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeListens(
  seed: number,
  base: number,
  days = 30,
  growth = 0,
): { series: ListenPoint[]; total: number; trend: number } {
  const rand = mulberry32(seed)
  const series: ListenPoint[] = []
  const today = new Date("2026-04-19T00:00:00Z")
  let total = 0
  let firstHalf = 0
  let secondHalf = 0
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setUTCDate(d.getUTCDate() - i)
    const dow = d.getUTCDay()
    const weekday = dow >= 1 && dow <= 5 ? 1 : 0.72
    const drift = 1 + growth * ((days - i) / days)
    const noise = 0.78 + rand() * 0.5
    const listens = Math.round(base * weekday * drift * noise)
    series.push({ date: d.toISOString().slice(0, 10), listens })
    total += listens
    if (i < days / 2) secondHalf += listens
    else firstHalf += listens
  }
  const trend = firstHalf === 0 ? 0 : Math.round(((secondHalf - firstHalf) / firstHalf) * 1000) / 10
  return { series, total, trend }
}

function makeStages(
  through: StageName,
  final: "completed" | "pending_approval" | "running" | "failed",
  details?: Partial<Record<StageName, { summary?: string; detail?: string; durationMs?: number }>>,
): EpisodeStage[] {
  const stages: EpisodeStage[] = []
  const cutoff = STAGE_ORDER.indexOf(through)
  for (let i = 0; i < STAGE_ORDER.length; i++) {
    const name = STAGE_ORDER[i]!
    const meta = details?.[name] ?? {}
    if (i < cutoff) {
      stages.push({
        name,
        status: "completed",
        summary: meta.summary ?? defaultStageSummary(name, "completed"),
        detail: meta.detail ?? defaultStageDetail(name),
        durationMs: meta.durationMs ?? defaultDurationMs(name),
      })
    } else if (i === cutoff) {
      stages.push({
        name,
        status: final,
        summary: meta.summary ?? defaultStageSummary(name, final),
        detail: meta.detail ?? defaultStageDetail(name),
        durationMs: meta.durationMs,
      })
    } else {
      stages.push({ name, status: "pending" })
    }
  }
  return stages
}

function defaultStageSummary(stage: StageName, status: EpisodeStage["status"]): string {
  const done = {
    research: "14 citations gathered, clustered into 4 arcs",
    script: "11-beat script, 2,140 words, target read 18:40",
    voice_cast: "Voice matched to show identity",
    tts: "Synthesised 19m of audio across 2 segments",
    artwork: "Cover + hero image rendered, 2048×2048",
    assemble: "Mixed with intro bed, loudness −16 LUFS",
    publish: "Pushed to 4 platforms",
  } as const
  const progress = {
    research: "Gathering sources…",
    script: "Drafting with Claude 4.7…",
    voice_cast: "Selecting voice profile…",
    tts: "Rendering audio…",
    artwork: "Generating cover art…",
    assemble: "Mixing final master…",
    publish: "Uploading to distribution network…",
  } as const
  const awaiting = {
    research: "Review the sourced material before script stage starts",
    script: "Agent-written script is waiting on your approval",
    voice_cast: "Confirm the voice profile before synthesis burns credits",
    tts: "Audio ready — confirm before assembly",
    artwork: "Approve cover art",
    assemble: "Approve final master",
    publish: "Approve to publish across platforms",
  } as const
  if (status === "completed") return done[stage]
  if (status === "running") return progress[stage]
  if (status === "pending_approval") return awaiting[stage]
  if (status === "failed") return "Stage failed — see logs"
  return "Pending"
}

function defaultStageDetail(stage: StageName): string {
  return {
    research: "Claude · 42 sources scanned",
    script: "Claude 4.7 · 2,141 tokens",
    voice_cast: "ElevenLabs · turbo v3",
    tts: "ElevenLabs · multilingual v3",
    artwork: "gpt-image-1 · 2 variants",
    assemble: "ffmpeg mix · 48kHz stereo",
    publish: "RSS + YouTube + Spotify + Apple",
  }[stage]
}

function defaultDurationMs(stage: StageName): number {
  return {
    research: 42_000,
    script: 87_000,
    voice_cast: 4_000,
    tts: 186_000,
    artwork: 21_000,
    assemble: 11_000,
    publish: 16_000,
  }[stage]
}

const shows: Show[] = [
  {
    id: "shw_future_protocols",
    name: "Future Protocols",
    concept:
      "A weekly briefing on emerging internet protocols — what's shipping, who's fighting over it, and why it matters. Written and voiced by an agent, edited by a human.",
    audience: "Senior engineers, infra-curious founders, protocol nerds",
    category: "Technology",
    tags: ["protocols", "infra", "weekly"],
    cadence: { count: 1, unit: "weekly" },
    voiceId: "voice_rachel",
    voiceLabel: "Rachel · EN-US · warm",
    coverArtUrl: "https://picsum.photos/seed/future-protocols/600",
    createdAt: "2026-03-02T10:00:00Z",
    createdBy: "agent",
    fieldOrigins: {
      name: "agent",
      concept: "agent",
      audience: "agent",
      cadence: "human",
      voice: "human",
      coverArt: "agent",
    },
    autonomyConfig: GATED_SCRIPT,
    episodeCount: 6,
    totalListens: 28_412,
    trend30d: 18.2,
    latestEpisodeAt: "2026-04-12T09:00:00Z",
  },
  {
    id: "shw_ops_corner",
    name: "Ops Corner with Sam",
    concept:
      "Sam interviews platform engineers about ops war stories. Real voices, real scars. Host-led; transcripts and clips are auto-generated.",
    audience: "Platform and SRE teams",
    category: "Engineering",
    tags: ["interviews", "ops", "sre"],
    cadence: { count: 2, unit: "monthly" },
    voiceId: "voice_host_sam",
    voiceLabel: "Sam · human host",
    coverArtUrl: "https://picsum.photos/seed/ops-corner/600",
    createdAt: "2026-01-18T14:30:00Z",
    createdBy: "human",
    fieldOrigins: {
      name: "human",
      concept: "human",
      audience: "human",
      cadence: "human",
      voice: "human",
      coverArt: "human",
    },
    autonomyConfig: FULL_AUTO,
    episodeCount: 11,
    totalListens: 61_309,
    trend30d: 4.1,
    latestEpisodeAt: "2026-04-05T16:00:00Z",
  },
  {
    id: "shw_daily_llm",
    name: "The Daily LLM",
    concept:
      "Two minutes a day on what shipped in the model-provider world. Fully autonomous — an agent owns the whole pipeline.",
    audience: "AI product builders, model-curious engineers",
    category: "AI & Data",
    tags: ["daily", "ai", "news"],
    cadence: { count: 1, unit: "daily" },
    voiceId: "voice_atlas",
    voiceLabel: "Atlas · EN-US · news",
    coverArtUrl: "https://picsum.photos/seed/daily-llm/600",
    createdAt: "2026-04-01T06:00:00Z",
    createdBy: "agent",
    fieldOrigins: {
      name: "agent",
      concept: "agent",
      audience: "agent",
      cadence: "human",
      voice: "agent",
      coverArt: "agent",
    },
    autonomyConfig: FULL_AUTO,
    episodeCount: 19,
    totalListens: 102_784,
    trend30d: 32.6,
    latestEpisodeAt: "2026-04-18T06:00:00Z",
  },
  {
    id: "shw_field_notes",
    name: "Field Notes",
    concept:
      "Monthly long-form essays on practitioner craft — essays from our founders, voiced through Podviva.",
    audience: "Designers, builders, founders",
    category: "Design",
    tags: ["essays", "monthly", "craft"],
    cadence: { count: 1, unit: "monthly" },
    voiceId: "voice_june",
    voiceLabel: "June · EN-GB · warm",
    coverArtUrl: "https://picsum.photos/seed/field-notes/600",
    createdAt: "2026-02-14T09:00:00Z",
    createdBy: "human",
    fieldOrigins: {
      name: "human",
      concept: "human",
      audience: "human",
      cadence: "human",
      voice: "agent",
      coverArt: "agent",
    },
    autonomyConfig: GATED_PUBLISH,
    episodeCount: 3,
    totalListens: 8_120,
    trend30d: -4.8,
    latestEpisodeAt: "2026-04-01T09:00:00Z",
  },
]

const fpSeries = makeListens(101, 420, 30, 0.35)
const fp010 = makeListens(102, 360, 30, 0.3)
const fp011 = makeListens(103, 390, 30, 0.25)
const fp012 = makeListens(104, 680, 30, 0.5)
const oc005 = makeListens(205, 720, 30, 0.05)
const oc006 = makeListens(206, 810, 30, 0.08)
const oc007 = makeListens(207, 940, 30, 0.12)
const dl017 = makeListens(305, 1240, 30, 0.22)
const dl018 = makeListens(306, 1380, 30, 0.28)
const dl019 = makeListens(307, 1640, 30, 0.32)
const fn002 = makeListens(405, 280, 30, -0.05)
const fn003 = makeListens(406, 240, 30, -0.04)

void fpSeries

const episodes: Episode[] = [
  {
    id: "ep_fp_012",
    showId: "shw_future_protocols",
    title: "What ATProto v2 changes for federated social",
    description:
      "Deep dive on the v2 spec changes and what it means for teams already shipping against v1. Interview clips spliced in from three engineers on the reference implementation.",
    mode: "agent",
    durationSeconds: 18 * 60 + 40,
    audioUrl: "https://example.com/mock-audio-fp012.mp3",
    coverArtUrl: "https://picsum.photos/seed/fp-012/800",
    publishedAt: "2026-04-12T09:00:00Z",
    createdAt: "2026-04-10T09:00:00Z",
    stages: makeStages("publish", "completed"),
    distributions: [
      {
        platform: "rss",
        status: "published",
        externalUrl: "https://podviva.fm/f/shw_future_protocols.xml",
        publishedAt: "2026-04-12T09:00:01Z",
        listens24h: 412,
      },
      {
        platform: "youtube",
        status: "published",
        externalUrl: "https://youtube.com/watch?v=mock-fp-012",
        publishedAt: "2026-04-12T09:03:00Z",
        listens24h: 218,
      },
      { platform: "apple", status: "published", listens24h: 1024 },
      { platform: "spotify", status: "published", listens24h: 886 },
    ],
    translations: [
      {
        language: "en",
        label: "English",
        status: "ready",
        transcriptUrl: "https://example.com/ep_fp_012.en.vtt",
        updatedAt: "2026-04-12T09:02:00Z",
      },
      {
        language: "de",
        label: "Deutsch",
        status: "ready",
        transcriptUrl: "https://example.com/ep_fp_012.de.vtt",
        updatedAt: "2026-04-12T11:10:00Z",
      },
      { language: "ja", label: "日本語", status: "pending" },
    ],
    listens30d: fp012.series,
    totalListens: fp012.total,
  },
  {
    id: "ep_fp_013",
    showId: "shw_future_protocols",
    title: "Draft: MCP hosts beyond Claude",
    description:
      "Agent-proposed script explores the MCP ecosystem beyond Claude — Cursor, Windsurf, and a grab-bag of independent hosts.",
    mode: "agent",
    createdAt: "2026-04-18T12:00:00Z",
    coverArtUrl: "https://picsum.photos/seed/fp-013/800",
    stages: makeStages("script", "pending_approval", {
      research: {
        summary: "9 citations gathered across 3 clusters",
        detail: "Claude · 31 sources scanned",
      },
    }),
    distributions: [
      { platform: "rss", status: "disabled" },
      { platform: "youtube", status: "disabled" },
      { platform: "apple", status: "disabled" },
      { platform: "spotify", status: "disabled" },
    ],
    translations: [],
    listens30d: [],
    totalListens: 0,
  },
  {
    id: "ep_fp_011",
    showId: "shw_future_protocols",
    title: "Why SPIFFE is suddenly everywhere",
    description: "Workload identity finally gets an opinionated default.",
    mode: "agent",
    durationSeconds: 17 * 60 + 12,
    audioUrl: "https://example.com/mock-audio-fp011.mp3",
    coverArtUrl: "https://picsum.photos/seed/fp-011/800",
    publishedAt: "2026-04-05T09:00:00Z",
    createdAt: "2026-04-03T09:00:00Z",
    stages: makeStages("publish", "completed"),
    distributions: [
      { platform: "rss", status: "published", listens24h: 402 },
      { platform: "youtube", status: "published", listens24h: 181 },
      { platform: "apple", status: "published", listens24h: 840 },
      { platform: "spotify", status: "published", listens24h: 612 },
    ],
    translations: [
      { language: "en", label: "English", status: "ready" },
      { language: "de", label: "Deutsch", status: "ready" },
    ],
    listens30d: fp011.series,
    totalListens: fp011.total,
  },
  {
    id: "ep_fp_010",
    showId: "shw_future_protocols",
    title: "The quiet rise of Nomad over Kubernetes",
    description: "Where teams are moving, where they're not.",
    mode: "agent",
    durationSeconds: 19 * 60,
    audioUrl: "https://example.com/mock-audio-fp010.mp3",
    coverArtUrl: "https://picsum.photos/seed/fp-010/800",
    publishedAt: "2026-03-29T09:00:00Z",
    createdAt: "2026-03-27T09:00:00Z",
    stages: makeStages("publish", "completed"),
    distributions: [
      { platform: "rss", status: "published", listens24h: 328 },
      { platform: "youtube", status: "published", listens24h: 212 },
      { platform: "apple", status: "published", listens24h: 756 },
      { platform: "spotify", status: "published", listens24h: 590 },
    ],
    translations: [{ language: "en", label: "English", status: "ready" }],
    listens30d: fp010.series,
    totalListens: fp010.total,
  },
  {
    id: "ep_oc_007",
    showId: "shw_ops_corner",
    title: "Postmortem culture at a 400-person infra team",
    description:
      "Sam interviews a platform lead whose team runs three blameless reviews every week — and ships twice as often for it.",
    mode: "human_upload",
    durationSeconds: 47 * 60 + 20,
    audioUrl: "https://example.com/mock-audio-oc007.mp3",
    coverArtUrl: "https://picsum.photos/seed/oc-007/800",
    publishedAt: "2026-04-05T16:00:00Z",
    createdAt: "2026-04-05T15:00:00Z",
    stages: [
      {
        name: "publish",
        status: "completed",
        summary: "Human upload — production stages skipped",
        detail: "Direct upload · 92.4 MB",
      },
    ],
    distributions: [
      { platform: "rss", status: "published", listens24h: 421 },
      { platform: "youtube", status: "published", listens24h: 312 },
      { platform: "apple", status: "published", listens24h: 1102 },
      { platform: "spotify", status: "published", listens24h: 980 },
    ],
    translations: [
      { language: "en", label: "English", status: "ready" },
      { language: "es", label: "Español", status: "ready" },
      { language: "fr", label: "Français", status: "pending" },
    ],
    listens30d: oc007.series,
    totalListens: oc007.total,
  },
  {
    id: "ep_oc_006",
    showId: "shw_ops_corner",
    title: "Rolling out Istio without breaking prod",
    description: "A two-year migration told in six chapters.",
    mode: "human_upload",
    durationSeconds: 52 * 60,
    audioUrl: "https://example.com/mock-audio-oc006.mp3",
    coverArtUrl: "https://picsum.photos/seed/oc-006/800",
    publishedAt: "2026-03-20T16:00:00Z",
    createdAt: "2026-03-20T15:00:00Z",
    stages: [
      { name: "publish", status: "completed", summary: "Human upload", detail: "Direct upload" },
    ],
    distributions: [
      { platform: "rss", status: "published", listens24h: 302 },
      { platform: "youtube", status: "published", listens24h: 220 },
      { platform: "apple", status: "published", listens24h: 892 },
      { platform: "spotify", status: "published", listens24h: 720 },
    ],
    translations: [{ language: "en", label: "English", status: "ready" }],
    listens30d: oc006.series,
    totalListens: oc006.total,
  },
  {
    id: "ep_oc_005",
    showId: "shw_ops_corner",
    title: "Rebuilding the deploy pipeline at Cauldron",
    description: "From 40-minute deploys to 90 seconds, told without the glow-up.",
    mode: "human_upload",
    durationSeconds: 43 * 60,
    audioUrl: "https://example.com/mock-audio-oc005.mp3",
    coverArtUrl: "https://picsum.photos/seed/oc-005/800",
    publishedAt: "2026-03-05T16:00:00Z",
    createdAt: "2026-03-05T15:00:00Z",
    stages: [
      { name: "publish", status: "completed", summary: "Human upload", detail: "Direct upload" },
    ],
    distributions: [
      { platform: "rss", status: "published", listens24h: 270 },
      { platform: "youtube", status: "published", listens24h: 190 },
      { platform: "apple", status: "published", listens24h: 812 },
      { platform: "spotify", status: "published", listens24h: 640 },
    ],
    translations: [{ language: "en", label: "English", status: "ready" }],
    listens30d: oc005.series,
    totalListens: oc005.total,
  },
  {
    id: "ep_dl_019",
    showId: "shw_daily_llm",
    title: "Fri update: Anthropic compaction API + OpenAI realtime pricing",
    description: "Two minutes. All the headlines from the last 24 hours in model-provider land.",
    mode: "agent",
    durationSeconds: 2 * 60 + 8,
    audioUrl: "https://example.com/mock-audio-dl019.mp3",
    coverArtUrl: "https://picsum.photos/seed/dl-019/800",
    publishedAt: "2026-04-18T06:00:00Z",
    createdAt: "2026-04-18T05:45:00Z",
    stages: makeStages("publish", "completed"),
    distributions: [
      { platform: "rss", status: "published", listens24h: 1210 },
      { platform: "youtube", status: "published", listens24h: 820 },
      { platform: "apple", status: "published", listens24h: 2104 },
      { platform: "spotify", status: "published", listens24h: 1720 },
    ],
    translations: [
      { language: "en", label: "English", status: "ready" },
      { language: "es", label: "Español", status: "ready" },
    ],
    listens30d: dl019.series,
    totalListens: dl019.total,
  },
  {
    id: "ep_dl_018",
    showId: "shw_daily_llm",
    title: "Thu update: Gemini 3 numbers + Mistral enterprise",
    description: "Two minutes on the latest numbers.",
    mode: "agent",
    durationSeconds: 2 * 60 + 3,
    audioUrl: "https://example.com/mock-audio-dl018.mp3",
    coverArtUrl: "https://picsum.photos/seed/dl-018/800",
    publishedAt: "2026-04-17T06:00:00Z",
    createdAt: "2026-04-17T05:45:00Z",
    stages: makeStages("publish", "completed"),
    distributions: [
      { platform: "rss", status: "published", listens24h: 1120 },
      { platform: "youtube", status: "published", listens24h: 740 },
      { platform: "apple", status: "published", listens24h: 1890 },
      { platform: "spotify", status: "published", listens24h: 1520 },
    ],
    translations: [
      { language: "en", label: "English", status: "ready" },
      { language: "es", label: "Español", status: "ready" },
    ],
    listens30d: dl018.series,
    totalListens: dl018.total,
  },
  {
    id: "ep_dl_017",
    showId: "shw_daily_llm",
    title: "Wed update: Anthropic pricing cuts + new tool-use format",
    description: "Two minutes on the latest.",
    mode: "agent",
    durationSeconds: 2 * 60,
    audioUrl: "https://example.com/mock-audio-dl017.mp3",
    coverArtUrl: "https://picsum.photos/seed/dl-017/800",
    publishedAt: "2026-04-16T06:00:00Z",
    createdAt: "2026-04-16T05:45:00Z",
    stages: makeStages("publish", "completed"),
    distributions: [
      { platform: "rss", status: "published", listens24h: 1080 },
      { platform: "youtube", status: "published", listens24h: 700 },
      { platform: "apple", status: "published", listens24h: 1720 },
      { platform: "spotify", status: "published", listens24h: 1420 },
    ],
    translations: [{ language: "en", label: "English", status: "ready" }],
    listens30d: dl017.series,
    totalListens: dl017.total,
  },
  {
    id: "ep_dl_020",
    showId: "shw_daily_llm",
    title: "Sat update: researching in progress…",
    description: "Today's run — currently gathering sources for the weekend recap.",
    mode: "agent",
    createdAt: "2026-04-19T05:30:00Z",
    coverArtUrl: "https://picsum.photos/seed/dl-020/800",
    stages: makeStages("research", "running", {
      research: { summary: "Scanning 42 sources from the last 24h…" },
    }),
    distributions: [
      { platform: "rss", status: "disabled" },
      { platform: "youtube", status: "disabled" },
      { platform: "apple", status: "disabled" },
      { platform: "spotify", status: "disabled" },
    ],
    translations: [],
    listens30d: [],
    totalListens: 0,
  },
  {
    id: "ep_fn_003",
    showId: "shw_field_notes",
    title: "Draft: On the patience of good interfaces",
    description:
      "April essay — an argument for letting interfaces breathe. Agent voiced the written piece; waiting on final publish approval.",
    mode: "agent",
    durationSeconds: 26 * 60,
    audioUrl: "https://example.com/mock-audio-fn003.mp3",
    coverArtUrl: "https://picsum.photos/seed/fn-003/800",
    createdAt: "2026-04-01T09:00:00Z",
    stages: makeStages("publish", "pending_approval", {
      assemble: {
        summary: "Mixed against ambient intro bed, −16 LUFS",
        detail: "ffmpeg · 48kHz stereo",
      },
    }),
    distributions: [
      { platform: "rss", status: "pending" },
      { platform: "youtube", status: "pending" },
      { platform: "apple", status: "pending" },
      { platform: "spotify", status: "pending" },
    ],
    translations: [{ language: "en", label: "English", status: "ready" }],
    listens30d: fn003.series,
    totalListens: fn003.total,
  },
  {
    id: "ep_fn_002",
    showId: "shw_field_notes",
    title: "On revising in public",
    description: "Essay on publishing imperfect drafts and letting readers in early.",
    mode: "agent",
    durationSeconds: 24 * 60,
    audioUrl: "https://example.com/mock-audio-fn002.mp3",
    coverArtUrl: "https://picsum.photos/seed/fn-002/800",
    publishedAt: "2026-03-02T09:00:00Z",
    createdAt: "2026-02-28T09:00:00Z",
    stages: makeStages("publish", "completed"),
    distributions: [
      { platform: "rss", status: "published", listens24h: 92 },
      { platform: "youtube", status: "published", listens24h: 44 },
      { platform: "apple", status: "published", listens24h: 212 },
      { platform: "spotify", status: "published", listens24h: 168 },
    ],
    translations: [{ language: "en", label: "English", status: "ready" }],
    listens30d: fn002.series,
    totalListens: fn002.total,
  },
]

function deriveApprovals(): ApprovalItem[] {
  const now = new Date("2026-04-19T08:30:00Z").getTime()
  return episodes
    .flatMap((ep) => {
      const stage = ep.stages.find((s) => s.status === "pending_approval")
      if (!stage) return []
      const show = shows.find((s) => s.id === ep.showId)
      if (!show) return []
      const createdAt = new Date(ep.createdAt).getTime()
      const waiting = Math.max(20, Math.round((now - createdAt) / 60000))
      return [
        {
          episodeId: ep.id,
          episodeTitle: ep.title,
          showId: show.id,
          showName: show.name,
          showCoverUrl: show.coverArtUrl,
          stage: stage.name,
          waitingSinceMinutes: waiting,
          summary: stage.summary,
        } satisfies ApprovalItem,
      ]
    })
}

function deriveRecentPublishes(): RecentPublish[] {
  return episodes
    .filter((ep) => ep.publishedAt)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 6)
    .map((ep) => {
      const show = shows.find((s) => s.id === ep.showId)!
      const listens24h = ep.distributions.reduce((acc, d) => acc + (d.listens24h ?? 0), 0)
      return {
        episodeId: ep.id,
        episodeTitle: ep.title,
        showId: show.id,
        showName: show.name,
        showCoverUrl: show.coverArtUrl,
        publishedAt: ep.publishedAt!,
        distributions: ep.distributions,
        listens24h,
      }
    })
}

function deriveActivity(): ActivityItem[] {
  const items: ActivityItem[] = [
    {
      id: "act_1",
      kind: "approval_requested",
      at: "2026-04-18T12:04:00Z",
      message: "Script draft waiting for your review",
      showId: "shw_future_protocols",
      showName: "Future Protocols",
      episodeId: "ep_fp_013",
      episodeTitle: "MCP hosts beyond Claude",
      icon: "alert",
    },
    {
      id: "act_2",
      kind: "episode_published",
      at: "2026-04-18T06:01:00Z",
      message: "Published across RSS, YouTube, Apple, Spotify · 5,854 listens in 24h",
      showId: "shw_daily_llm",
      showName: "The Daily LLM",
      episodeId: "ep_dl_019",
      episodeTitle: "Anthropic compaction API + OpenAI realtime",
      icon: "check",
    },
    {
      id: "act_3",
      kind: "stage_started",
      at: "2026-04-19T05:32:00Z",
      message: "Research agent gathering sources",
      showId: "shw_daily_llm",
      showName: "The Daily LLM",
      episodeId: "ep_dl_020",
      episodeTitle: "Sat update: weekend recap",
      icon: "spark",
    },
    {
      id: "act_4",
      kind: "approval_requested",
      at: "2026-04-01T09:06:00Z",
      message: "Final publish gate — essay is ready",
      showId: "shw_field_notes",
      showName: "Field Notes",
      episodeId: "ep_fn_003",
      episodeTitle: "On the patience of good interfaces",
      icon: "alert",
    },
    {
      id: "act_5",
      kind: "translation_ready",
      at: "2026-04-12T11:10:00Z",
      message: "German transcript ready",
      showId: "shw_future_protocols",
      showName: "Future Protocols",
      episodeId: "ep_fp_012",
      episodeTitle: "What ATProto v2 changes",
      icon: "globe",
    },
    {
      id: "act_6",
      kind: "episode_published",
      at: "2026-04-12T09:00:00Z",
      message: "Published across 4 platforms",
      showId: "shw_future_protocols",
      showName: "Future Protocols",
      episodeId: "ep_fp_012",
      episodeTitle: "What ATProto v2 changes",
      icon: "check",
    },
    {
      id: "act_7",
      kind: "stage_completed",
      at: "2026-04-18T05:58:00Z",
      message: "Assemble stage completed in 11s",
      showId: "shw_daily_llm",
      showName: "The Daily LLM",
      episodeId: "ep_dl_019",
      episodeTitle: "Anthropic compaction API",
      icon: "check",
    },
    {
      id: "act_8",
      kind: "show_created",
      at: "2026-04-01T06:00:00Z",
      message: "Agent created a new show",
      showId: "shw_daily_llm",
      showName: "The Daily LLM",
      icon: "sparkle",
    },
  ]
  return items.sort((a, b) => b.at.localeCompare(a.at))
}

function deriveAudienceSeries() {
  const agg: Record<string, { listens: number; downloads: number }> = {}
  for (const ep of episodes) {
    for (const pt of ep.listens30d) {
      const prev = agg[pt.date] ?? { listens: 0, downloads: 0 }
      prev.listens += pt.listens
      prev.downloads += Math.round(pt.listens * 0.45)
      agg[pt.date] = prev
    }
  }
  return Object.entries(agg)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, listens: v.listens, downloads: v.downloads }))
}

function deriveShowsSummary() {
  return shows.map((s) => {
    const inPipeline = episodes.filter(
      (ep) =>
        ep.showId === s.id &&
        ep.stages.some((st) => st.status === "running" || st.status === "pending_approval"),
    )
    const latest = inPipeline[0]?.stages.find(
      (st) => st.status === "running" || st.status === "pending_approval",
    )
    return {
      id: s.id,
      name: s.name,
      coverArtUrl: s.coverArtUrl,
      createdBy: s.createdBy,
      cadence: s.cadence,
      episodesInPipeline: inPipeline.length,
      latestStage: latest?.name,
      latestStageStatus: latest?.status,
      totalListens: s.totalListens,
      trend30d: s.trend30d,
    }
  })
}

function buildSnapshot(): DashboardSnapshot {
  const publishedThisWeek = episodes.filter(
    (ep) => ep.publishedAt && ep.publishedAt >= "2026-04-12T00:00:00Z",
  ).length
  const inPipeline = episodes.filter((ep) =>
    ep.stages.some((s) => s.status === "running" || s.status === "pending_approval"),
  ).length
  const pendingApproval = episodes.filter((ep) =>
    ep.stages.some((s) => s.status === "pending_approval"),
  ).length
  const totalListens30d = shows.reduce((acc, s) => acc + s.totalListens, 0)
  return {
    kpis: {
      shows: shows.length,
      publishedThisWeek,
      inPipeline,
      pendingApproval,
      totalListens30d,
      listenChange30dPct: 14.3,
    },
    audienceSeries: deriveAudienceSeries(),
    approvals: deriveApprovals(),
    activity: deriveActivity(),
    recentPublishes: deriveRecentPublishes(),
    showsSummary: deriveShowsSummary(),
  }
}

function delay<T>(value: T, ms = 40): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const mockClient: PodvivaClient = {
  async listShows() {
    return delay(shows.slice())
  },
  async getShow(id) {
    return delay(shows.find((s) => s.id === id) ?? null)
  },
  async createShow(input: CreateShowInput) {
    const id = `shw_${Math.random().toString(36).slice(2, 9)}`
    const next: Show = {
      id,
      name: input.name ?? "Untitled show",
      concept: input.prompt ?? "",
      audience: input.audience ?? "General",
      category: input.category ?? "General",
      tags: [],
      cadence: input.cadence ?? { count: 1, unit: "weekly" },
      voiceId: "voice_rachel",
      voiceLabel: "Rachel · EN-US · warm",
      coverArtUrl: `https://picsum.photos/seed/${id}/600`,
      createdAt: new Date().toISOString(),
      createdBy: input.mode,
      fieldOrigins: {},
      autonomyConfig: FULL_AUTO,
      episodeCount: 0,
      totalListens: 0,
      trend30d: 0,
    }
    shows.unshift(next)
    return delay(next)
  },
  async listEpisodes(showId) {
    const filtered = showId ? episodes.filter((e) => e.showId === showId) : episodes
    return delay(
      filtered.slice().sort((a, b) =>
        (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt),
      ),
    )
  },
  async getEpisode(id) {
    return delay(episodes.find((e) => e.id === id) ?? null)
  },
  async createEpisode(input) {
    const id = `ep_${Math.random().toString(36).slice(2, 9)}`
    const next: Episode =
      input.mode === "agent"
        ? {
            id,
            showId: input.showId,
            title: `Draft: ${input.topic.slice(0, 60)}`,
            description: input.topic,
            mode: "agent",
            createdAt: new Date().toISOString(),
            coverArtUrl: `https://picsum.photos/seed/${id}/800`,
            stages: makeStages("research", "running", {
              research: { summary: "Gathering sources…" },
            }),
            distributions: [
              { platform: "rss", status: "disabled" },
              { platform: "youtube", status: "disabled" },
              { platform: "apple", status: "disabled" },
              { platform: "spotify", status: "disabled" },
            ],
            translations: [],
            listens30d: [],
            totalListens: 0,
          }
        : {
            id,
            showId: input.showId,
            title: input.title,
            description: `Uploaded: ${input.audioFileName}`,
            mode: "human_upload",
            createdAt: new Date().toISOString(),
            coverArtUrl: `https://picsum.photos/seed/${id}/800`,
            stages: [
              {
                name: "publish",
                status: "running",
                summary: "Processing upload…",
                detail: "Direct upload",
              },
            ],
            distributions: [
              { platform: "rss", status: "pending" },
              { platform: "youtube", status: "pending" },
              { platform: "apple", status: "pending" },
              { platform: "spotify", status: "pending" },
            ],
            translations: [],
            listens30d: [],
            totalListens: 0,
          }
    episodes.unshift(next)
    return delay(next)
  },
  async getDashboardSnapshot() {
    return delay(buildSnapshot())
  },
}
