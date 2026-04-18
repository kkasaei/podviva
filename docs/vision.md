# Vision

Podviva is a podcast platform with two personas sharing one backbone.

## Personas

1. **AI-first creators.** Agents autonomously create shows, creatives, scripts, voices, artwork, and final audio. The user gives intent; the system produces episodes on cadence.
2. **Human podcasters.** They bring their own audio and use Podviva for modern tooling — hosting, translation, publishing, and a developer API.
3. **Listeners.** The public discovery surface (marketing `/discover`) lets anyone browse shows hosted on Podviva by category, trending, and featured picks — establishing Podviva as a hosting + discovery platform, not only a creator tool.

## Shared platform

Both personas use the same platform primitives:

- **Shows** and **episodes** as first-class entities.
- **Audio hosting** on R2 with an **RSS feed** per show.
- **Multi-platform distribution** through a pluggable adapter interface (YouTube + RSS ship in v1, others slot in later).
- **Slack webhook** on every publish.
- **Transcripts/subtitles** in multiple languages (dubbed audio deferred).

## The four pillars

Any feature falls into one of four buckets. Use these to scope work.

| Pillar | Scope |
| --- | --- |
| **Show creation** | Concept, audience, cadence, voice, artwork. Human or agent authored. |
| **Creatives** | Cover art, episode artwork, titles, descriptions, show notes. |
| **Episode production** | Research → script → voice cast → TTS → artwork → assemble. Agentic, human upload, or hybrid. |
| **Hosting & distribution** | R2 storage, RSS, platform adapters, webhooks, translation. |

## Non-goals (for now)

- Dubbed audio in other languages — transcripts only for v1.
- A full DAW/editor — Podviva produces finished episodes, it does not compete with editing tools.
- Live podcasting.
