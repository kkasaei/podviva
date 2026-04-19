# Podviva

The podcast platform for agents and humans — agentic production, hosting, translation, and multi-platform distribution on the same rails. API and MCP-first; the UI is just another client.

> **Phase 1 preview.** This repo currently ships the full frontend against a typed mock client. Phase 2 plugs the real backend (Hono API + MCP server, Postgres, R2, Trigger.dev, ElevenLabs, Claude) into the same call sites without touching the UI.

## What's in here

- **Marketing site** — home, discover (public shows + episodes + RSS), pricing (monthly/yearly toggle, Custom tier), blog, free tools (name generator, RSS health check, MCP quickstart, cost calculator), glossary.
- **Studio dashboard** — protected control room with sidebar nav, approvals queue, activity feed, audience chart, episode pipeline timeline, autonomy config per show, distribution grid, translation manifest.
- **Auth** — Clerk v7 (sign-in, sign-up, `/dashboard` gated via a proxy).
- **Design system** — dark-first "Broadcast Operator" aesthetic: Fraunces display serif, Geist sans + mono, amber signal accent on deep neutrals, on-air pulse and waveform motifs.
- **Docs** — product vision, architecture, roadmap, problem/differentiator pressure test under [`docs/`](./docs).

## Stack

- **Framework** — Next.js 16 (Turbopack), React 19, Tailwind 4, shadcn/ui.
- **Monorepo** — pnpm workspaces + Turborepo.
- **Auth** — Clerk.
- **Data (phase 1)** — typed mock client at `apps/web/lib/data`.
- **Data (phase 2, planned)** — Hono REST + MCP server wrapping `packages/core`, Drizzle on Postgres (Neon), Cloudflare R2 for audio, Trigger.dev v4 for production jobs, Stripe for premium entitlements.

## Monorepo layout

```
apps/
  web/              # Next.js app — marketing + studio dashboard
packages/
  env/              # Zod-validated env vars, shared
  ui/               # shadcn/ui components (theme + primitives)
  eslint-config/    # Shared ESLint config
  typescript-config/# Shared tsconfigs
docs/               # Vision, architecture, roadmap, problem framing
```

## Getting started

```bash
pnpm install

# Fill in Clerk test keys (and the rest, as you enable them)
cp .env.example apps/web/.env.local

pnpm dev
```

Visit:

- `http://localhost:3000/` — marketing home
- `http://localhost:3000/discover` — public browse
- `http://localhost:3000/pricing` — pricing with monthly/yearly toggle
- `http://localhost:3000/tools` — free tools
- `http://localhost:3000/dashboard` — studio (requires sign-in)

### Commands

```bash
pnpm dev          # turbo dev — next dev on apps/web
pnpm build        # turbo build
pnpm typecheck    # turbo typecheck across the workspace
pnpm lint         # turbo lint
pnpm format       # prettier across the workspace
```

## Deploying to Cloudflare

The Next.js app is wired for Cloudflare Workers via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare). Worker config lives in `apps/web/wrangler.jsonc`; the OpenNext adapter config lives in `apps/web/open-next.config.ts`.

```bash
cd apps/web

# Build the Worker bundle into apps/web/.open-next
pnpm cf:build

# Preview the production build locally in workerd (builds first)
pnpm preview

# Deploy to Cloudflare (builds first)
pnpm deploy
```

First-time setup: `wrangler login`, then set secrets (they don't live in `wrangler.jsonc`):

```bash
wrangler secret put CLERK_SECRET_KEY
wrangler secret put NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# …repeat for any phase-2 secrets you actually use
```

The apex `podviva.com` is served by the Worker; `www.podviva.com` 308-redirects to apex (see `next.config.mjs`). Both hostnames are declared as custom domains in `wrangler.jsonc`.

SEO surfaces (`/sitemap.xml`, `/robots.txt`) are generated from `app/sitemap.ts` and `app/robots.ts`.

## Environment

Required in phase 1 (Clerk test keys):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_…
CLERK_SECRET_KEY=sk_test_…
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

Optional in phase 1, required in phase 2 (see [`.env.example`](./.env.example)):

```
DATABASE_URL=
R2_ACCOUNT_ID= R2_ACCESS_KEY_ID= R2_SECRET_ACCESS_KEY= R2_BUCKET=
TRIGGER_SECRET_KEY=
STRIPE_SECRET_KEY= STRIPE_WEBHOOK_SECRET=
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
SLACK_WEBHOOK_URL=
```

## Mock data layer

The UI never talks to a database or external API in phase 1. All reads and mutations flow through `apps/web/lib/data`:

```ts
import { client, type Show } from "@/lib/data"

const shows = await client.listShows()
```

`PodvivaClient` is the contract. `mockClient` satisfies it today; Phase 2 will add an `HttpClient` that calls `/api/v1/*` and swap at the `apps/web/lib/data/index.ts` seam — no call-site changes.

## Docs

- [**Problem & differentiator**](./docs/problem.md) — honest pressure test of the thesis. Read first.
- [**Vision**](./docs/vision.md) — personas, pillars, what's in and out of scope.
- [**Architecture**](./docs/architecture.md) — API/MCP-first, layering, patterns.
- [**Roadmap**](./docs/roadmap.md) — phased build order, resolved decisions, open questions.
- [**Frontend phase 1**](./docs/frontend-phase-1.md) — screen inventory, mock contract.

## Aesthetic

Podviva is deliberately opinionated. The "Broadcast Operator" theme — Fraunces italic accents on signal-orange keywords, dense data viz, on-air pulse indicators, waveform decorations — is the visual identity. Don't water it down when adding screens; use the existing primitives in `apps/web/components/dashboard/*` and `apps/web/components/marketing/*`.

## License

Proprietary · © 2026 Podviva Labs.
