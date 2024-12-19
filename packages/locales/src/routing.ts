import { defineRouting } from "next-intl/routing"

import { locales } from "."

export const routing = defineRouting({
  locales: locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
})
