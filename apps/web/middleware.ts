import { NextResponse } from "next/server"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url)
  const incomingHost = req.headers.get("host") ?? url.host
  if (incomingHost === "www.podviva.com" || url.hostname === "www.podviva.com") {
    url.hostname = "podviva.com"
    url.protocol = "https:"
    url.port = ""
    return NextResponse.redirect(url, 308)
  }

  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
