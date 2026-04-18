import { auth } from "@clerk/nextjs/server"
import { MarketingNav } from "@/components/marketing/nav"
import { MarketingFooter } from "@/components/marketing/footer"

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  return (
    <div className="relative flex min-h-svh flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_at_50%_-10%,oklch(0.76_0.17_52_/_0.14),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-60"
      />
      <div className="relative z-10 flex flex-1 flex-col">
        <MarketingNav signedIn={Boolean(userId)} />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
      </div>
    </div>
  )
}
