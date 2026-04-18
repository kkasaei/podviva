export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  author: { name: string; role: string; avatarSeed: string }
  category: string
  readingMinutes: number
  publishedAt: string
  heroImage: string
  featured?: boolean
  content: { kind: "p" | "h2" | "quote" | "list"; text: string; items?: string[] }[]
}

export const posts: BlogPost[] = [
  {
    slug: "mcp-is-eating-podcasting",
    title: "MCP is quietly eating podcasting",
    excerpt:
      "The shows that ship first every morning aren't the ones with the biggest studios — they're the ones wired into an agent's toolbelt.",
    author: {
      name: "Keyvan Kasaee",
      role: "Co-founder, Podviva",
      avatarSeed: "kk",
    },
    category: "Product",
    readingMinutes: 7,
    publishedAt: "2026-04-15",
    heroImage: "https://picsum.photos/seed/mcp-eats/1600",
    featured: true,
    content: [
      {
        kind: "p",
        text: "In the last six months, three of the fastest-growing podcasts on our platform were not produced by humans. They were produced by agents — Claude, sometimes Cursor, sometimes bespoke Python scripts — pointed at Podviva through MCP. They write, they voice, they publish, and they hit the train window before any human producer has filed their coffee order.",
      },
      {
        kind: "h2",
        text: "The shape of a podcast shop in 2026",
      },
      {
        kind: "p",
        text: "A traditional podcast studio is a network of glued-together SaaS tools: a script doc, a recording platform, an editor, a host, a YouTube uploader, and a spreadsheet that no one wants to maintain. Every step is a handoff. Every handoff is a delay.",
      },
      {
        kind: "p",
        text: "An MCP-native podcast stack collapses all of that into one surface. An agent holding the tools can research, draft, voice, mix, and publish in the same call stack. The handoff cost is zero because there is no handoff.",
      },
      {
        kind: "quote",
        text: "We stopped asking 'how many producers do we need' and started asking 'how many shows can one operator run before they stop sleeping.'",
      },
      {
        kind: "h2",
        text: "What changes when the tools collapse",
      },
      {
        kind: "list",
        text: "",
        items: [
          "Cadence becomes cheap. Daily shows stop being a stunt.",
          "Translation stops being a back-catalog project and becomes a publish-time default.",
          "Quality control moves from editing to approvals — human judgment at gates, not at keystrokes.",
          "Distribution stops being a separate job. Every publish is a multi-platform event.",
        ],
      },
      {
        kind: "p",
        text: "If you're building a podcast business today and you're not thinking about which parts of the pipeline should be agent-driven, you're losing ground — quietly, to people who figured it out this month.",
      },
    ],
  },
  {
    slug: "translating-a-show-in-one-call",
    title: "Translating a whole show in one call",
    excerpt:
      "A walkthrough of the translation pipeline we ship on every Podviva publish — and why we chose transcripts over dubbed audio for v1.",
    author: {
      name: "Rune Halvorsen",
      role: "Engineering, Podviva",
      avatarSeed: "rh",
    },
    category: "Engineering",
    readingMinutes: 5,
    publishedAt: "2026-04-09",
    heroImage: "https://picsum.photos/seed/translation/1600",
    content: [
      {
        kind: "p",
        text: "When an episode publishes on Podviva, three things happen in parallel: the audio lands on R2, the RSS feed updates, and a fan-out of translation jobs spins up. The latter is what this post is about.",
      },
      {
        kind: "h2",
        text: "Transcript first, dubbed audio later",
      },
      {
        kind: "p",
        text: "We made a deliberate choice with v1: transcripts and subtitles per language, not dubbed audio. Dubbing is seductive — there's a demo moment where the host sounds like they speak five languages — but the craft gap between 'good transcript' and 'convincing dubbed voice' is two orders of magnitude. Until the agent can reliably preserve humour, rhythm, and intentional pauses, we'd rather ship text that respects the audience than audio that lies to them.",
      },
      {
        kind: "h2",
        text: "The actual call",
      },
      {
        kind: "p",
        text: "Under the hood it's a Trigger.dev job graph: one task per language, fanning out from the source transcript. The translator is a Claude call prompted with the episode's topic cluster — not a bare translation — which keeps domain jargon consistent. Output lands in R2 as VTT + TXT, and the RSS feed advertises each language.",
      },
    ],
  },
  {
    slug: "editorial-case-for-letting-an-agent-drive",
    title: "The editorial case for letting an agent drive",
    excerpt:
      "Every time we propose fully autonomous production, someone asks 'but what about editorial taste?' Here's the argument.",
    author: {
      name: "Mei Tanaka",
      role: "Editorial, Podviva",
      avatarSeed: "mt",
    },
    category: "Editorial",
    readingMinutes: 6,
    publishedAt: "2026-04-02",
    heroImage: "https://picsum.photos/seed/editorial/1600",
    content: [
      {
        kind: "p",
        text: "I was a print editor for ten years before I took this job. I approached the idea of agent-driven podcasts with the same suspicion I used to reserve for automated copy-editing tools. Then I ran the math on what a human editor produces in a week versus what a well-prompted agent can produce in a day, and my suspicion got quieter.",
      },
      {
        kind: "h2",
        text: "Taste is a policy, not a keystroke",
      },
      {
        kind: "p",
        text: "The editors I admire don't edit line by line. They write the policy. They decide what kind of story the outlet tells. The actual rewriting is almost clerical. The hard part — the taste part — is the frame.",
      },
      {
        kind: "p",
        text: "Agent-driven production forces you to externalise that frame. You can't vibe your way through it. You write down, explicitly, what this show is and isn't. What voice it uses. What it never does. And then the agent enforces that policy on every episode, uniformly, at 4 a.m. on a Tuesday when no human editor is available.",
      },
    ],
  },
  {
    slug: "what-we-learned-from-50-agent-episodes",
    title: "What we learned from our first 50 agent-produced episodes",
    excerpt:
      "Approval rates, retry reasons, where listeners dropped off, and the one stage that surprised us every time.",
    author: {
      name: "Priya Devi",
      role: "Product, Podviva",
      avatarSeed: "pd",
    },
    category: "Data",
    readingMinutes: 8,
    publishedAt: "2026-03-24",
    heroImage: "https://picsum.photos/seed/first-fifty/1600",
    content: [
      {
        kind: "p",
        text: "We just hit fifty fully agent-produced episodes on the platform. Small sample, but enough to see some patterns. This post is what we saw and what we changed because of it.",
      },
      {
        kind: "h2",
        text: "Approval rates by stage",
      },
      {
        kind: "list",
        text: "",
        items: [
          "Research: 94% approved first pass — this stage is easy.",
          "Script: 71% — the biggest bottleneck, mostly because openings are hard.",
          "Voice cast: 98% — creators lock a voice early and rarely revisit.",
          "Artwork: 83% — agents over-index on gradients. We nudged the prompt.",
          "Publish: 100% — by this point the creator has usually tuned out.",
        ],
      },
      {
        kind: "h2",
        text: "Retries cluster around openings",
      },
      {
        kind: "p",
        text: "The single most common reason for a script rejection is the first 30 seconds. Not the argument, not the structure, not the voice — the hook. We added a dedicated 'cold open' micro-stage in the pipeline that drafts three openings and ranks them against the show's top-performing past episodes. Approval rate on scripts jumped 14 points the week we shipped it.",
      },
    ],
  },
]

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}
