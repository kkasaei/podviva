// Initialize OpenNext Cloudflare during `next dev` so `getCloudflareContext()`
// works locally against wrangler bindings. Guarded to dev so it doesn't spin
// up miniflare during production builds.
if (process.env.NODE_ENV === "development") {
  const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare")
  initOpenNextCloudflareForDev()
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/env"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.podviva.com" }],
        destination: "https://podviva.com/:path*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
