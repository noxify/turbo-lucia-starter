"use server"

import { getLocale } from "next-intl/server"

import { auth, deleteSessionTokenCookie, invalidateSession } from "@acme/auth"
import { redirect } from "@acme/locales/react"

export async function logoutAction() {
  const { session } = await auth()
  if (!session) {
    return redirect({ href: "/auth", locale: await getLocale() })
  }
  await invalidateSession(session.id)

  await deleteSessionTokenCookie()
  return redirect({ href: "/auth", locale: await getLocale() })
}
