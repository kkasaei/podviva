# Frontend — Phase 1

Goal: build `apps/web` against typed mock data to lock in the product shape before any backend exists. Every call site must go through a mock module whose interface matches what the real API will expose — Phase 2 swaps the implementation, not the callers.

## Proposed screens

| # | Screen | Purpose |
| --- | --- | --- |
| 1 | Landing / marketing | Hero, pitch, pricing (API = premium), CTA. |
| 2 | Dashboard | List of shows, create-show button. |
| 3 | Create show | Two-path picker: agent mode (*"let the agent build it"*) vs human mode (*"I'll set it up manually"*). Both land on show detail. |
| 4 | Show detail | Metadata, episode list, autonomy config toggles per stage, distribution settings. |
| 5 | Episode detail | Stages (research → script → voice → artwork → audio → published) with status chips, approval buttons for gated stages, audio player. |
| 6 | Create episode | Trigger agent mode (topic prompt) OR upload audio (human mode). |
| 7 | Distribution settings | Connected platforms (YouTube, RSS, Slack webhook), toggle per show. |
| 8 | API & MCP | Premium paywall; shows API keys + MCP connection string once subscribed. |
| 9 | Translations | Per-episode list of transcript languages with "translate" action. |

**Core loop (build first):** 2 → 3 → 4 → 5 → 6. The rest can ship as stubs until scope is confirmed.

## Mock data contract

All data access lives behind `apps/web/lib/data` with a stable interface:

```ts
// apps/web/lib/data/index.ts
export interface PodvivaClient {
  listShows(): Promise<Show[]>
  getShow(id: string): Promise<Show>
  createShow(input: CreateShowInput): Promise<Show>
  listEpisodes(showId: string): Promise<Episode[]>
  getEpisode(id: string): Promise<Episode>
  // …
}
```

Phase 1 ships a `MockClient` backed by typed fixtures in memory. Phase 2 adds a `HttpClient` that calls `/api/v1/*`. A single env flag picks the implementation — no call site changes.

Types (`Show`, `Episode`, `EpisodeStage`, `AutonomyConfig`, …) live in a shared file so Phase 2 can copy them into `packages/core` zod schemas without drift.

## Auth in phase 1

**Resolved:** use real Clerk auth from day one — mocking auth is throwaway work. Data stays mocked, but sign-in/sign-up hits the real Clerk test environment.

## Design direction

To be decided. Options:

- Clean SaaS (Linear/Vercel feel) — safest, ships fast, looks "serious."
- Bold/creative podcast-app vibe — more distinctive, riskier.
- Something specific provided by the owner.

Use the `frontend-design` skill once a direction is picked, to avoid generic AI aesthetics.

## Open questions

1. Which screens ship in Phase 1 — all nine, or just the core loop (2–6)?
2. Design direction?
3. Auth approach (always-signed-in vs pretend sign-in)?
