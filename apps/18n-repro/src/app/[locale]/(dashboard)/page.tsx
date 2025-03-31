import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"

import { auth } from "@acme/auth"
import { redirect } from "@acme/locales/react"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()

  return {
    title: t("dashboard.title"),
  }
}

export default async function DashboardPage() {
  const { user } = await auth()

  if (!user) {
    return redirect({
      href: { pathname: "/auth", query: { redirectTo: "/" } },
      locale: await getLocale(),
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl border bg-muted/50" />
        <div className="aspect-video rounded-xl border bg-muted/50" />
        <div className="aspect-video rounded-xl border bg-muted/50" />
      </div>
      <div className="mx-auto min-h-[100vh] w-full rounded-xl border bg-muted/50"></div>
    </div>
  )
}
