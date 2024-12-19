"use client"

import React, { Suspense } from "react"
import { UserIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import type { auth } from "@acme/auth"
import { Button } from "@acme/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu"

import { logoutAction } from "~/actions/logout"

export function UserMenu({ user }: { user: ReturnType<typeof auth> }) {
  const t = useTranslations()

  const { user: userData } = React.use(user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Show user menu">
          <UserIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <Suspense fallback="">
              <p className="text-sm leading-none">
                {t.rich("welcome", { user: () => <strong>{userData?.name}</strong> })}
              </p>
            </Suspense>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <form action={logoutAction}>
          <button className="block w-full">
            <DropdownMenuItem className="cursor-pointer">{t("auth.signout")}</DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
