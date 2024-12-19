import type { NamespaceKeys, NestedKeyOf, useTranslations } from "next-intl"
import type { getTranslations } from "next-intl/server"

import type { routing } from "./routing"

export const locales = ["de", "en"]

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type Messages = typeof import("@acme/locales/lang/en")
export type AllowedMessageKeys = NamespaceKeys<Messages, NestedKeyOf<Messages>>

type TranslationKeys = AllowedMessageKeys
export type ServerSideT<S extends TranslationKeys = never> = Awaited<
  ReturnType<typeof getTranslations<S>>
>
export type ClientSideT<S extends TranslationKeys = never> = ReturnType<typeof useTranslations<S>>
export type IsomorficT<S extends TranslationKeys = never> = ServerSideT<S> | ClientSideT<S>

export type Locale = (typeof routing.locales)[number]
