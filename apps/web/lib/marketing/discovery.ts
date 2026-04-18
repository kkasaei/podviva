// Public discovery data — shown on /discover and on the marketing home page.
// This is a *different* dataset than the creator dashboard's mock shows, because
// discovery represents all Podviva-hosted podcasts, not just the signed-in user's.

export type ProductionMode = "fully-autonomous" | "host-led" | "hybrid"

export type DiscoveryShow = {
  id: string
  name: string
  tagline: string
  host: string
  hostType: "agent" | "human"
  category: string
  cadence: string
  coverArtUrl: string
  accent: string
  durationLabel: string
  listens: string
  mode: ProductionMode
  trending?: boolean
  newThisWeek?: boolean
  editorsPick?: boolean
  languages: string[]
}

export const CATEGORIES = [
  "Technology",
  "Business",
  "Science",
  "Design",
  "Culture",
  "News",
  "Finance",
  "Health",
] as const

export const discoveryShows: DiscoveryShow[] = [
  {
    id: "shw_future_protocols",
    name: "Future Protocols",
    tagline: "The weekly briefing on emerging internet protocols.",
    host: "Rachel (agent)",
    hostType: "agent",
    category: "Technology",
    cadence: "Weekly · Saturdays",
    coverArtUrl: "https://picsum.photos/seed/future-protocols/600",
    accent: "#f07a3a",
    durationLabel: "18 min",
    listens: "28.4k",
    mode: "hybrid",
    trending: true,
    editorsPick: true,
    languages: ["EN", "DE", "JA"],
  },
  {
    id: "shw_daily_llm",
    name: "The Daily LLM",
    tagline: "Two minutes a day on what shipped in model land.",
    host: "Atlas (agent)",
    hostType: "agent",
    category: "Technology",
    cadence: "Daily",
    coverArtUrl: "https://picsum.photos/seed/daily-llm/600",
    accent: "#4cc38a",
    durationLabel: "2 min",
    listens: "102k",
    mode: "fully-autonomous",
    trending: true,
    languages: ["EN", "ES"],
  },
  {
    id: "shw_ops_corner",
    name: "Ops Corner with Sam",
    tagline: "Real voices, real scars — infra war stories.",
    host: "Sam Patel",
    hostType: "human",
    category: "Technology",
    cadence: "Biweekly",
    coverArtUrl: "https://picsum.photos/seed/ops-corner/600",
    accent: "#6a84c4",
    durationLabel: "48 min",
    listens: "61k",
    mode: "host-led",
    editorsPick: true,
    languages: ["EN", "ES", "FR"],
  },
  {
    id: "shw_field_notes",
    name: "Field Notes",
    tagline: "Monthly long-form essays on practitioner craft.",
    host: "June (agent)",
    hostType: "agent",
    category: "Design",
    cadence: "Monthly",
    coverArtUrl: "https://picsum.photos/seed/field-notes/600",
    accent: "#e5b85b",
    durationLabel: "26 min",
    listens: "8.1k",
    mode: "hybrid",
    newThisWeek: true,
    languages: ["EN"],
  },
  {
    id: "shw_market_brief",
    name: "Market Brief",
    tagline: "Ninety seconds to catch you up on the open.",
    host: "Nora (agent)",
    hostType: "agent",
    category: "Finance",
    cadence: "Daily · weekdays",
    coverArtUrl: "https://picsum.photos/seed/market-brief/600",
    accent: "#2dbbb3",
    durationLabel: "90s",
    listens: "214k",
    mode: "fully-autonomous",
    trending: true,
    languages: ["EN", "DE", "FR", "ES"],
  },
  {
    id: "shw_half_life",
    name: "Half-Life",
    tagline: "The papers that changed physics this month.",
    host: "Dr. Irene Okonkwo",
    hostType: "human",
    category: "Science",
    cadence: "Monthly",
    coverArtUrl: "https://picsum.photos/seed/half-life/600",
    accent: "#b277ea",
    durationLabel: "44 min",
    listens: "19k",
    mode: "host-led",
    editorsPick: true,
    languages: ["EN"],
  },
  {
    id: "shw_founder_tapes",
    name: "Founder Tapes",
    tagline: "Unpolished conversations with founders at exit.",
    host: "Marco Vela",
    hostType: "human",
    category: "Business",
    cadence: "Weekly",
    coverArtUrl: "https://picsum.photos/seed/founder-tapes/600",
    accent: "#f3766a",
    durationLabel: "52 min",
    listens: "47k",
    mode: "host-led",
    languages: ["EN", "ES"],
  },
  {
    id: "shw_after_hours",
    name: "After Hours",
    tagline: "Bedtime stories written by agents, voiced nightly.",
    host: "Elara (agent)",
    hostType: "agent",
    category: "Culture",
    cadence: "Nightly",
    coverArtUrl: "https://picsum.photos/seed/after-hours/600",
    accent: "#8a6fff",
    durationLabel: "12 min",
    listens: "89k",
    mode: "fully-autonomous",
    newThisWeek: true,
    languages: ["EN", "JA", "IT"],
  },
  {
    id: "shw_newsdesk",
    name: "Newsdesk · 18:00",
    tagline: "The evening headlines in a single agent-read bulletin.",
    host: "Cyrus (agent)",
    hostType: "agent",
    category: "News",
    cadence: "Daily · 18:00 local",
    coverArtUrl: "https://picsum.photos/seed/newsdesk/600",
    accent: "#d86464",
    durationLabel: "7 min",
    listens: "306k",
    mode: "fully-autonomous",
    trending: true,
    languages: ["EN", "DE", "ES", "FR", "PT", "JA"],
  },
  {
    id: "shw_slow_craft",
    name: "Slow Craft",
    tagline: "Conversations about doing one thing extremely well.",
    host: "Ingrid Hasle",
    hostType: "human",
    category: "Design",
    cadence: "Every two weeks",
    coverArtUrl: "https://picsum.photos/seed/slow-craft/600",
    accent: "#c08a56",
    durationLabel: "38 min",
    listens: "14k",
    mode: "host-led",
    editorsPick: true,
    languages: ["EN"],
  },
  {
    id: "shw_night_shift",
    name: "Night Shift",
    tagline: "A nurse, a firefighter, and a surgeon walk us through.",
    host: "Rui Morais",
    hostType: "human",
    category: "Health",
    cadence: "Weekly",
    coverArtUrl: "https://picsum.photos/seed/night-shift/600",
    accent: "#5f8fdc",
    durationLabel: "34 min",
    listens: "22k",
    mode: "host-led",
    newThisWeek: true,
    languages: ["EN", "PT"],
  },
  {
    id: "shw_operator_playbook",
    name: "Operator Playbook",
    tagline: "How real teams ship, from standup to post-mortem.",
    host: "Fern (agent) · Priya Devi",
    hostType: "agent",
    category: "Business",
    cadence: "Weekly",
    coverArtUrl: "https://picsum.photos/seed/operator-playbook/600",
    accent: "#6ac0a8",
    durationLabel: "24 min",
    listens: "33k",
    mode: "hybrid",
    languages: ["EN"],
  },
]

export type DiscoveryEpisode = {
  id: string
  showId: string
  title: string
  description: string
  durationLabel: string
  durationSeconds: number
  publishedAt: string
  listens: string
  coverArtUrl: string
  transcriptLanguages: string[]
}

const EPISODE_TEMPLATES: Record<
  string,
  { title: string; summary: string; duration: number }[]
> = {
  Technology: [
    { title: "ATProto v2: what actually changed", summary: "A spec diff no one asked for, everyone needed.", duration: 1120 },
    { title: "Why SPIFFE became table-stakes", summary: "Workload identity gets an opinionated default.", duration: 1050 },
    { title: "The quiet migration off Kubernetes", summary: "Where teams are going. Where they're not.", duration: 1200 },
    { title: "Anthropic's compaction API, explained", summary: "Context windows stop being a thing.", duration: 720 },
    { title: "RSC, two years in", summary: "What landed, what blew up, what quietly stuck.", duration: 1480 },
    { title: "CRDTs for people who hate CRDTs", summary: "The shape of post-centralised software.", duration: 1260 },
  ],
  Business: [
    { title: "Our first 90 days without standups", summary: "The rituals we removed and the ones we kept.", duration: 2400 },
    { title: "Pricing as a product team", summary: "Three price changes in a year, told honestly.", duration: 2160 },
    { title: "Retention lessons from a dying SaaS", summary: "What churn was really telling us.", duration: 1980 },
    { title: "On firing your best engineer", summary: "A candid conversation with Marco.", duration: 2820 },
  ],
  Science: [
    { title: "Three papers that quietly changed physics", summary: "A monthly catch-up with Dr. Okonkwo.", duration: 2640 },
    { title: "When replication failed", summary: "What the failure taught us about the discipline.", duration: 2400 },
  ],
  Design: [
    { title: "On the patience of good interfaces", summary: "An essay read aloud. Twenty-six minutes.", duration: 1560 },
    { title: "Typography as product strategy", summary: "The brief we wish we'd been given.", duration: 1620 },
    { title: "Slow craft in a speed-run industry", summary: "An argument for doing one thing well.", duration: 2280 },
  ],
  Culture: [
    { title: "The year bedtime audio went agentic", summary: "Elara's first 100 nights.", duration: 720 },
    { title: "Voice identity & the uncanny valley", summary: "When listeners notice the seams, and when they don't.", duration: 780 },
  ],
  News: [
    { title: "Fri 18:00 · AI policy week", summary: "Everything that happened between Mon and Fri.", duration: 420 },
    { title: "Thu 18:00 · Market open recap", summary: "Numbers, gossip, and the Fed chair's face.", duration: 420 },
    { title: "Wed 18:00 · Labour strike aftermath", summary: "What it means for the autumn.", duration: 420 },
  ],
  Finance: [
    { title: "Open · 14 bp and no surprises", summary: "Ninety seconds on the morning bell.", duration: 90 },
    { title: "Open · powell said the thing", summary: "What just moved, and by how much.", duration: 90 },
    { title: "Open · earnings week primer", summary: "Ten tickers to watch, in ninety seconds.", duration: 90 },
  ],
  Health: [
    { title: "A night in the ER", summary: "Rui spends eight hours with a night-shift nurse.", duration: 2040 },
    { title: "On compassion fatigue", summary: "The thing no one teaches in residency.", duration: 1920 },
  ],
}

function episodeDateBack(days: number) {
  const d = new Date("2026-04-19T09:00:00Z")
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString()
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60)
  const r = s % 60
  if (m === 0) return `${r}s`
  if (r === 0) return `${m} min`
  return `${m}:${String(r).padStart(2, "0")}`
}

export function episodesFor(showId: string): DiscoveryEpisode[] {
  const show = discoveryShows.find((s) => s.id === showId)
  if (!show) return []
  const templates =
    EPISODE_TEMPLATES[show.category] ?? EPISODE_TEMPLATES.Technology!
  return templates.map((t, i) => ({
    id: `${showId}__${i}`,
    showId,
    title: t.title,
    description: t.summary,
    durationLabel: formatDuration(t.duration),
    durationSeconds: t.duration,
    publishedAt: episodeDateBack(i * 7 + 1),
    listens:
      i === 0
        ? show.listens
        : `${Math.max(0.4, Number((show.listens.match(/[\d.]+/) ?? ["0"])[0]) * (1 - i * 0.15)).toFixed(1)}k`,
    coverArtUrl: show.coverArtUrl,
    transcriptLanguages: show.languages,
  }))
}

export function getDiscoveryEpisode(showId: string, episodeId: string) {
  return episodesFor(showId).find((e) => e.id === episodeId) ?? null
}

export function getDiscoveryShow(id: string) {
  return discoveryShows.find((s) => s.id === id) ?? null
}

export function featured() {
  return discoveryShows.filter((s) => s.editorsPick)
}

export function trending() {
  return discoveryShows.filter((s) => s.trending)
}

export function newThisWeek() {
  return discoveryShows.filter((s) => s.newThisWeek)
}

export function byCategory(cat: (typeof CATEGORIES)[number]) {
  return discoveryShows.filter((s) => s.category === cat)
}
