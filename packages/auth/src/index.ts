import { cache } from "react"
import { cookies } from "next/headers"
import { sha256 } from "@oslojs/crypto/sha2"
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding"

import type { Session as BaseSession, User as BaseUser, SessionInput } from "@acme/db/schemas"
import { sessionRepository } from "@acme/db/repositories"
import { createLogger } from "@acme/logging"

import { env } from "./env"
import * as discordProvider from "./providers/discord"
import * as githubProvider from "./providers/github"
import * as mockUserProvider from "./providers/mock-user"

export type User = BaseUser
export type Session = BaseSession

export type AuthResponse =
  | {
      user: User
      session: Session
    }
  | { user: null; session: null }

const logger = createLogger().withPrefix("@acme/auth")

const maxSessionDuration = 8
const sessionUpdateAfter = 4

function calculateDateTime(hours: number) {
  const asMs = 1000 * 60 * 60 * hours
  const fromNow = new Date(Date.now() + asMs)

  return {
    asMs,
    fromNow,
  }
}

export function generateSessionToken() {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}

export async function createDbSessionAndCookie(
  userId: string,
  options: Omit<SessionInput, "id" | "expiresAt" | "userId">,
) {
  const token = generateSessionToken()
  const session = await createSession(token, userId, options)

  if (!session) {
    throw new Error(`Could not create session`)
  }

  await setSessionTokenCookie(token, session.expiresAt)

  return session.id
}

export async function createSession(
  token: string,
  userId: string,
  options: Omit<SessionInput, "id" | "expiresAt" | "userId">,
) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const expiresAt = calculateDateTime(maxSessionDuration).fromNow

  logger.withMetadata({ sessionId, expiresAt, maxSessionDuration }).debug("Creating new session")

  return await sessionRepository.create({ id: sessionId, userId, expiresAt, ...options })
}

export async function validateSessionToken(token: string): Promise<AuthResponse> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const result = await sessionRepository.findFirst({
    where: (session, { eq }) => eq(session.id, sessionId),
    with: { user: true },
  })

  if (!result) return { session: null, user: null }

  const { user, ...session } = result

  logger
    .withMetadata({
      now: Date.now(),
      expiresAt: session.expiresAt.getTime(),
      expired: Date.now() >= session.expiresAt.getTime(),
    })
    .debug("checking session")

  if (Date.now() >= session.expiresAt.getTime()) {
    await invalidateSession(sessionId)
    await deleteSessionTokenCookie()
    return { session: null, user: null }
  }

  if (Date.now() >= session.expiresAt.getTime() - calculateDateTime(sessionUpdateAfter).asMs) {
    session.expiresAt = calculateDateTime(maxSessionDuration).fromNow
    await sessionRepository.update({
      where: (t, { eq }) => eq(t.id, session.id),
      data: {
        expiresAt: calculateDateTime(maxSessionDuration).fromNow,
      },
    })
  }

  return { session, user: { ...user } }
}

export async function invalidateSession(sessionId: string) {
  logger.withContext({ sessionId }).debug("invalidate session")
  await sessionRepository.delete({ where: (t, { eq }) => eq(t.id, sessionId) })
}

export async function setSessionTokenCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies()

  logger.withMetadata({ expiresAt }).debug("set session cookie")

  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })
}

export async function deleteSessionTokenCookie() {
  const cookieStore = await cookies()

  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
}

export const auth = cache(async () => {
  const cookieStore = await cookies()

  const token = cookieStore.get("session")?.value ?? null

  if (token === null) return { session: null, user: null }

  const result = await validateSessionToken(token)
  return result
})

export const providers = {
  ...(env.OAUTH_MOCK_ENABLED && {
    mock_user: mockUserProvider,
  }),
  github: githubProvider,
  discord: discordProvider,
} as const

export type Providers = keyof typeof providers
