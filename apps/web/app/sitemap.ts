import type { MetadataRoute } from "next"
import { posts } from "@/lib/marketing/blog"
import { discoveryShows } from "@/lib/marketing/discovery"

const SITE_URL = "https://podviva.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${SITE_URL}/discover`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/tools`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/tools/name-generator`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${SITE_URL}/tools/feed-check`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${SITE_URL}/tools/mcp-config`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${SITE_URL}/tools/cost-calculator`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${SITE_URL}/resources/glossary`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
  ]

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const showRoutes: MetadataRoute.Sitemap = discoveryShows.map((show) => ({
    url: `${SITE_URL}/discover/${show.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes, ...showRoutes]
}
