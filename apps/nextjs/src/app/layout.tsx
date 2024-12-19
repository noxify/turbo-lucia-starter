import type { Metadata, Viewport } from "next"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { cn } from "@acme/ui"
import { ThemeProvider } from "@acme/ui/theme"
import { Toaster } from "@acme/ui/toaster"

import "~/app/globals.css"

import { env } from "~/env"
import { TailwindIndicator } from "../components/tailwind-indicator"

export const metadata: Metadata = {
  metadataBase: new URL(env.APPLICATION_URL ?? "http://localhost:3000"),
  title: {
    template: "Acme Inc - %s",
    default: "Acme Inc",
  },
  description: "Acme Inc",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    //{ media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={cn("h-full bg-background font-sans text-foreground antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <NuqsAdapter>{props.children}</NuqsAdapter>

          <Toaster />
        </ThemeProvider>
        <TailwindIndicator />
      </body>
    </html>
  )
}
