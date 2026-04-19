import type { Metadata } from "next"
import { Fraunces, Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { ClerkProvider } from "@clerk/nextjs"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" })
const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "opsz"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://podviva.com"),
  title: {
    default: "Podviva — the podcast control room",
    template: "%s · Podviva",
  },
  description:
    "API and MCP-first podcast platform. Agentic production, human uploads, hosting, translation, distribution — one control room.",
  alternates: { canonical: "/" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#f07a3a",
          colorBackground: "#191922",
          colorText: "#f4f4f5",
          colorInputBackground: "#1f1f2a",
          colorInputText: "#f4f4f5",
          fontFamily: "var(--font-sans)",
          borderRadius: "0.5rem",
        },
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          "antialiased",
          fontSans.variable,
          fontMono.variable,
          fontDisplay.variable,
        )}
      >
        <body className="bg-background text-foreground font-sans min-h-svh">
          <ThemeProvider defaultTheme="dark">
            <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          </ThemeProvider>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-184X2NEX2H"
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-184X2NEX2H');`}
          </Script>
        </body>
      </html>
    </ClerkProvider>
  )
}
