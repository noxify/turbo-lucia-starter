import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { getLocale, getMessages, getNow, getTimeZone } from "next-intl/server"

import { routing } from "@acme/locales/routing"

import LocaleProvider from "~/components/locale-provider"

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
  const messages = await getMessages()
  return (
    <LocaleProvider messages={messages} locale={currentLocale} now={now} timeZone={timeZone}>
      {children}
    </LocaleProvider>
  )
}
