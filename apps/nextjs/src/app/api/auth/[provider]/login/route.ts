import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { generateCodeVerifier, generateState } from "arctic"

import type { Providers } from "@acme/auth"
import { providers } from "@acme/auth"
import { createLogger } from "@acme/logging"

import { env } from "~/env"

const logger = createLogger()

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ provider: string }>
  },
): Promise<Response> {
  const { provider } = await params

  if (!Object.keys(providers).includes(provider)) {
    logger.withContext({ provider }).error("Invalid oauth provider")
    return new Response(null, {
      status: 200,
      headers: {
        Location: "/auth?error=AUTH_INVALID_PROVIDER",
      },
    })
  }

  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  const cookieStore = await cookies()

  cookieStore.set("redirect_to_url", request.nextUrl.searchParams.get("redirectTo") ?? "/", {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
  })

  // @TODO: with the current implementation for the mock providers
  //        we could have `undefined` as value - Currently, i don't care, but we should fix it somehow
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentProvider = providers[provider as Providers]!
  const url = currentProvider.getAuthorizationUrl(state, codeVerifier)
  cookieStore.set(`oauth_state`, state, {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  cookieStore.set("code_verifier", codeVerifier, {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
  })

  return Response.redirect(url)
}
