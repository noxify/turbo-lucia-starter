"use client"

import type { ComponentProps } from "react"
import { NextIntlClientProvider } from "next-intl"

export default function LocaleProvider({
  locale,
  now,
  timeZone,
  messages,
  formats,
  children,
}: ComponentProps<typeof NextIntlClientProvider>) {
  return (
    <NextIntlClientProvider
      onError={() => {
        return
      }}
      getMessageFallback={({ namespace, key }) => (namespace ? `${namespace}.${key}` : `${key}`)}
      // Make sure to forward these props to avoid markup mismatches
      locale={locale}
      now={now}
      timeZone={timeZone}
      // Provide as necessary
      messages={messages}
      formats={formats}
    >
      {children}
    </NextIntlClientProvider>
  )
}
