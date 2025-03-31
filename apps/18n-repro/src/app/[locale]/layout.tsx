import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { getLocale, getNow, getTimeZone } from "next-intl/server"

import { routing } from "@acme/locales/routing"
import { SidebarInset, SidebarProvider } from "@acme/ui/components/sidebar"

import { SiteHeader } from "~/components/header"
import LocaleProvider from "~/components/locale-provider"
import { SiteSidebar } from "~/components/sidebar"

export interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!routing.locales.includes(locale)) {
    notFound()
  }

  const currentLocale = await getLocale()
  const now = await getNow()
  const timeZone = await getTimeZone()
  return (
    <LocaleProvider locale={currentLocale} now={now} timeZone={timeZone}>
      <SidebarProvider>
        <SiteSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="h-fit 2xl:container 2xl:mx-auto 2xl:px-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </LocaleProvider>
  )
}
