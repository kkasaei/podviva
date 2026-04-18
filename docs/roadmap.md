# Roadmap

## Phase 1 — Frontend with mocks

Build `apps/web` against typed in-memory fixtures. No DB, no API, no Clerk, no Trigger, no real model calls. Goal: get the product shape in front of the owner fast and let UX discoveries inform the API surface.

See [frontend-phase-1.md](./frontend-phase-1.md) for screens, mock data contract, and open UX questions.

**Exit criteria:** every core-loop screen renders with realistic fixture data, navigation works, and all data access goes through the mock module (ready to swap).

## Phase 2 — Backend + real wiring

Scaffold the full stack and swap the frontend's mock layer for real calls.

1. `packages/env` — zod schemas for `DATABASE_URL`, `R2_*`, `TRIGGER_*`, `CLERK_*`, `STRIPE_*`, `ELEVENLABS_API_KEY`, `ANTHROPIC_API_KEY`.
2. `packages/db` — Drizzle + `postgres` driver, `docker-compose.yml` for local PG, initial migrations. Same `DATABASE_URL` switches to Neon in prod.
3. `packages/core` — service layer. Start with `shows` + `episodes` services, zod contracts.
4. `apps/api` — Hono app, `/api/v1/*` REST + `/mcp` MCP, both wrapping `core`. Clerk middleware + `requirePremium()` entitlements (no-op until Stripe is live).
5. Trigger.dev v4 init, hello-world job, then the episode production job graph.
6. R2 client + signed-URL helper in `packages/core/storage`.
7. Distribution adapters: `RssAdapter`, `YouTubeAdapter`, Slack webhook notifier.
8. Stripe integration for the premium-API paywall.
9. Swap `apps/web` mocks for real API calls.

## Phase 3 — Translation

Transcripts/subtitles in multiple languages. Dubbed audio is out of scope.

## Open questions

Unresolved, in priority order:

1. **Phase 1 screen scope** — all nine proposed screens or a tighter slice? (See frontend-phase-1.md.)
2. **Design direction** — clean SaaS (Linear/Vercel), bold/creative podcast-app vibe, or something specific?
3. **Phase 1 auth mock** — always-signed-in fake user, or a pretend sign-in page?
4. **Artwork model** — `gpt-image-1`, Flux, or other?
5. **Hono placement** — standalone `apps/api` (chosen) vs Next.js route handlers (rejected).

## Resolved decisions (2026-04-19)

- API/MCP-first architecture.
- API/MCP access is a premium tier; UI is free.
- Dual-mode show creation (human or agent).
- Configurable autonomy per show, per stage.
- Translation v1 = transcripts only.
- Distribution is pluggable; v1 ships RSS + YouTube + Slack webhook.
- Stack: Next.js, Hono, Postgres (local + Neon), Drizzle, Trigger.dev, R2, Clerk, Stripe, ElevenLabs, Claude.
- Monorepo adds: `apps/api`, `packages/core`, `packages/db`, `packages/env`.
- Phase 1 = frontend mocks only; Phase 2 = everything else.
