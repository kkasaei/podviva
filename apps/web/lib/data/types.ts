// Shared types for the frontend. Phase 1 mocks and (eventually) Phase 2 HTTP
// client both return these exact shapes. When Phase 2 lands, these types should
// be lifted into packages/core as zod schemas — mirror naming to avoid drift.

export type CadenceUnit = "daily" | "weekly" | "biweekly" | "monthly"
export type Cadence = { count: number; unit: CadenceUnit }

export type StageName =
  | "research"
  | "script"
  | "voice_cast"
  | "tts"
  | "artwork"
  | "assemble"
  | "publish"

export type StageStatus =
  | "pending"
  | "running"
  | "pending_approval"
  | "completed"
  | "failed"

export type AutonomyMode = "auto" | "approve"

export type AutonomyConfig = Record<StageName, AutonomyMode>

export type AuthorKind = "human" | "agent"

export type ShowFieldOrigins = Partial<
  Record<"name" | "concept" | "audience" | "cadence" | "voice" | "coverArt", AuthorKind>
>

export type Show = {
  id: string
  name: string
  concept: string
  audience: string
  category: string
  tags: string[]
  cadence: Cadence
  voiceId: string
  voiceLabel: string
  coverArtUrl: string
  createdAt: string
  createdBy: AuthorKind
  fieldOrigins: ShowFieldOrigins
  autonomyConfig: AutonomyConfig
  episodeCount: number
  totalListens: number
  trend30d: number
  latestEpisodeAt?: string
}

export type EpisodeStage = {
  name: StageName
  status: StageStatus
  startedAt?: string
  completedAt?: string
  summary?: string
  /** Short model-style annotation for UI (e.g. "Claude 4.7 · 2,141 tokens"). */
  detail?: string
  durationMs?: number
}

export type DistributionPlatform = "rss" | "youtube" | "spotify" | "apple"

export type DistributionStatus = "disabled" | "pending" | "published" | "failed"

export type Distribution = {
  platform: DistributionPlatform
  status: DistributionStatus
  externalUrl?: string
  publishedAt?: string
  listens24h?: number
}

export type TranslationStatus = "pending" | "ready" | "failed"

export type Translation = {
  language: string
  label: string
  status: TranslationStatus
  transcriptUrl?: string
  updatedAt?: string
}

export type EpisodeProductionMode = "agent" | "human_upload"

export type ListenPoint = { date: string; listens: number }

export type Episode = {
  id: string
  showId: string
  title: string
  description: string
  mode: EpisodeProductionMode
  durationSeconds?: number
  audioUrl?: string
  coverArtUrl?: string
  publishedAt?: string
  createdAt: string
  stages: EpisodeStage[]
  distributions: Distribution[]
  translations: Translation[]
  listens30d: ListenPoint[]
  totalListens: number
}

export type CreateShowInput = {
  mode: AuthorKind
  name?: string
  prompt?: string
  audience?: string
  cadence?: Cadence
  category?: string
}

export type CreateEpisodeInput =
  | { showId: string; mode: "agent"; topic: string }
  | { showId: string; mode: "human_upload"; title: string; audioFileName: string }

export type ActivityKind =
  | "stage_completed"
  | "stage_started"
  | "episode_published"
  | "translation_ready"
  | "approval_requested"
  | "distribution_published"
  | "show_created"

export type ActivityItem = {
  id: string
  kind: ActivityKind
  at: string
  message: string
  showId?: string
  showName?: string
  episodeId?: string
  episodeTitle?: string
  icon: string
}

export type ApprovalItem = {
  episodeId: string
  episodeTitle: string
  showId: string
  showName: string
  showCoverUrl: string
  stage: StageName
  waitingSinceMinutes: number
  summary?: string
}

export type RecentPublish = {
  episodeId: string
  episodeTitle: string
  showId: string
  showName: string
  showCoverUrl: string
  publishedAt: string
  distributions: Distribution[]
  listens24h: number
}

export type DashboardSnapshot = {
  kpis: {
    shows: number
    publishedThisWeek: number
    inPipeline: number
    pendingApproval: number
    totalListens30d: number
    listenChange30dPct: number
  }
  audienceSeries: { date: string; listens: number; downloads: number }[]
  approvals: ApprovalItem[]
  activity: ActivityItem[]
  recentPublishes: RecentPublish[]
  showsSummary: {
    id: string
    name: string
    coverArtUrl: string
    createdBy: AuthorKind
    cadence: Cadence
    episodesInPipeline: number
    latestStage?: StageName
    latestStageStatus?: StageStatus
    totalListens: number
    trend30d: number
  }[]
}
