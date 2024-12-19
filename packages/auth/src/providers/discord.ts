import type { APIUser as DiscordUser } from "discord-api-types/v10"
import { Discord } from "arctic"
import { OAuth2Scopes } from "discord-api-types/v10"

import { env } from "../env"
import { handleUser } from "../user-handler"

const callbackUrl = env.APPLICATION_URL
  ? `https://${env.APPLICATION_URL}/api/auth/discord/callback`
  : "http://localhost:3000/api/auth/discord/callback"

const discord = new Discord(env.AUTH_DISCORD_ID, env.AUTH_DISCORD_SECRET, callbackUrl)

export const name = "Discord"

export const getAuthorizationUrl = (state: string) => {
  return discord.createAuthorizationURL(state, [OAuth2Scopes.Identify, OAuth2Scopes.Email])
}

export const handleCallback = async (code: string) => {
  const tokens = await discord.validateAuthorizationCode(code)

  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  })
  const discordUser = (await response.json()) as DiscordUser

  const user = await handleUser({
    provider: "discord",
    providerUserId: discordUser.id,
    name: discordUser.username,
    email: discordUser.email ?? `${discordUser.username}@discord-noemail.com`,
  })

  return user.id
}
