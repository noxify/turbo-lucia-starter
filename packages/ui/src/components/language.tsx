"use client"

import { useTransition } from "react"
import { useParams } from "next/navigation"
import { CheckIcon, LanguagesIcon } from "lucide-react"
import { useLocale } from "next-intl"

import type { Locale } from "@acme/locales"
import { usePathname, useRouter } from "@acme/locales/react"

import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu"

export function LanguageToggle() {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()
  const locale = useLocale()

  function onSelectChange(locale: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale },
      )
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <LanguagesIcon className="h-4 w-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSelectChange("de")}>
          <span>DE</span>
          {locale === "de" && (
            <DropdownMenuShortcut>
              <CheckIcon className="size-4" />
            </DropdownMenuShortcut>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onSelectChange("en")}>
          <span>EN</span>
          {locale === "en" && (
            <DropdownMenuShortcut>
              <CheckIcon className="size-4" />
            </DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
