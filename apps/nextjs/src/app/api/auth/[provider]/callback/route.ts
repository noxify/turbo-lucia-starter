import type { NextRequest } from "next/server"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { OAuth2RequestError } from "arctic"

import type { Providers } from "@acme/auth"
import { createDbSessionAndCookie, providers } from "@acme/auth"
import { createLogger } from "@acme/logging"

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

  const cookieStore = await cookies()
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const storedState = cookieStore.get(`oauth_state`)?.value ?? null
  const codeVerifier = cookieStore.get(`code_verifier`)?.value ?? null
  const redirectUrl = cookieStore.get("redirect_to_url")?.value ?? "/"

  if (!code || !codeVerifier || !state || !storedState || state !== storedState) {
    logger.error(
      "token mismatch",
      "Could be an old cookie value or without a secured connection (https://...).",
    )

    return new Response(null, {
      status: 200,
      headers: {
        Location: `/auth?error=AUTH_CODE_ERROR&redirectTo=${encodeURIComponent(redirectUrl)}`,
      },
    })
  }

  try {
    // @TODO: with the current implementation for the mock providers
    //        we could have `undefined` as value - Currently, i don't care, but we should fix it somehow

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentProvider = providers[provider as Providers]!

    const userId = await currentProvider.handleCallback(code, codeVerifier)

    const headersList = await headers()

    await createDbSessionAndCookie(userId, {
      ipAddress: headersList.get("X-Forwarded-For") ?? "127.0.0.1",
      userAgent: headersList.get("user-agent"),
    })

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    })
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      logger.withError(e).info("oauth error")

      return redirect(
        `/auth?error=AUTH_CALLBACK_ERROR&redirectTo=${encodeURIComponent(redirectUrl)}`,
      )
    }
    logger.withError(e).error("Something went totally wrong inside the auth callback")
    return redirect(`/auth?error=AUTH_UNKNOWN_ERROR&redirectTo=${encodeURIComponent(redirectUrl)}`)
  }
}
