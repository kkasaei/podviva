# Architecture

## Guiding principle: API/MCP-first

Every capability is exposed as a typed API endpoint **and** as an MCP tool before any UI is built. The Next.js UI is just another client of that API — it must not reach into the database or services directly. This keeps feature parity between UI, external REST clients, and MCP hosts automatic, and lets Podviva be driven from Claude, Cursor, or any MCP host out of the box.

## Layers

```text
                     ┌──────────────────┐
                     │  Service layer   │  pure functions, owns DB + R2 + Trigger
                     │  (packages/core) │
                     └────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
         ┌────▼────┐    ┌─────▼─────┐    ┌────▼─────┐
         │ REST API│    │ MCP server│    │ Internal │
         │ (/api/v1)│   │ (/mcp)    │    │ RPC (RSC)│
         └────┬────┘    └───────────┘    └────┬─────┘
              │                               │
         external                         Next.js UI
         clients                          (apps/web)
```

- `packages/core` — service layer. One function per capability (`createShow`, `generateEpisode`, `translateEpisode`, `publishEpisode`, …). Inputs/outputs are zod schemas.
- `apps/api` — thin adapters. REST (`/api/v1/*`) and MCP (`/mcp`) both call the same service functions. Zod → OpenAPI spec + MCP tool schemas, auto-generated.
- `apps/web` — UI. Reads via Server Components / API fetch; writes via REST. Zero direct DB access.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js (existing monorepo) |
| API | Hono in `apps/api` |
| DB | Postgres — local in Docker, Neon in prod |
| ORM | Drizzle |
| Job queue | Trigger.dev v4 |
| Object storage | Cloudflare R2 |
| Auth | Clerk |
| Billing / entitlements | Stripe |
| TTS | ElevenLabs |
| Agent reasoning + scripts | Claude |
| Artwork | TBD — `gpt-image-1` or Flux |

## Monorepo layout

```text
apps/web        Next.js UI — consumer of the API
apps/api        Hono REST + MCP server
packages/core   Service layer (business logic, pure functions)
packages/db     Drizzle schema + client
packages/env    zod-validated env vars, shared across apps
packages/ui     shadcn components (existing)
```

## Key patterns

### Dual-mode show creation

Shows can be authored by a human **or** an agent. Same `show` entity either way. Each field tracks origin (`human | agent`) so the UI can show provenance.

### Configurable autonomy per show

Autonomy is **not** a global setting. Every show chooses, per stage (script / voice / artwork / publish), whether it runs fully autonomous or pauses for user approval. The production pipeline reads the show's `autonomy_config` and uses Trigger.dev `waitForEvent` to gate stages flagged `approve`.

### Pluggable distribution adapters

A `DistributionAdapter` interface exposes `publish(episode) → { externalUrl }`. v1 ships `RssAdapter` (covers Apple/Spotify) and `YouTubeAdapter` (OAuth + resumable upload). Additional platforms slot in without changing the publish job. The Slack webhook is a separate notifier, not an adapter.

### Premium API entitlements

The UI is free. Programmatic access (REST + MCP) requires a paid Stripe subscription. Auth middleware resolves every request to a `userId` + `plan`; a `requirePremium()` helper gates API/MCP routes. UI sessions bypass this check.

### Mock-first frontend (phase 1 only)

Phase 1 builds `apps/web` against typed in-memory fixtures behind the same interface the real API will expose. Phase 2 swaps the mock implementation for real API calls — no call-site changes.
