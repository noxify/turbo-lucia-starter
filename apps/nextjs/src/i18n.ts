import type { NestedKeyOf } from "next-intl"
import { getRequestConfig } from "next-intl/server"

import { routing } from "@acme/locales/routing"

export type AllowedTranslationKeys = NestedKeyOf<IntlMessages>

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    messages: (await import(`../../../packages/locales/src/lang/${locale}.json`)).default,

    // supress all kind of error messages ;)
    onError: () => {
      return
    },
    // show the translation key as fallback if we can't find a translation for the given key
    // if there is a namespace, we will add them to the fallback, too.
    getMessageFallback: ({ namespace, key }) => (namespace ? `${namespace}.${key}` : `${key}`),
  }
})
