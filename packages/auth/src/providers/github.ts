import type { Endpoints } from "@octokit/types"
import { GitHub } from "arctic"

import { env } from "../env"
import { handleUser } from "../user-handler"

const callbackUrl = env.APPLICATION_URL
  ? `https://${env.APPLICATION_URL}/api/auth/github/callback`
  : "http://localhost:3000/api/auth/github/callback"

const github = new GitHub(env.AUTH_GITHUB_ID, env.AUTH_GITHUB_SECRET, callbackUrl)

export const name = "Github"
export const getAuthorizationUrl = (state: string, _codeVerifier: string) => {
  return github.createAuthorizationURL(state, ["read:user", "user:email"])
}

export const handleCallback = async (code: string) => {
  const tokens = await github.validateAuthorizationCode(code)

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  })
  const githubUser = (await response.json()) as Endpoints["GET /user"]["response"]["data"]

  let userEmail: string

  if (!githubUser.email) {
    // If the user does not have a public email, get another via the GitHub API
    // See https://docs.github.com/en/rest/users/emails#list-public-email-addresses-for-the-authenticated-user
    const res = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
        "User-Agent": "luciaauth",
      },
    })

    if (res.ok) {
      const emails = (await res.json()) as Endpoints["GET /user/emails"]["response"]["data"]

      const primaryEmail = emails.find((ele) => ele.primary)

      // use first email from the /users/emails endpoint in case we can't fetch the primary email
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userEmail = primaryEmail?.email ?? emails[0]!.email
    } else {
      userEmail = `${githubUser.login}@github-noemail.com`
    }
  } else {
    userEmail = githubUser.email
  }

  const user = await handleUser({
    provider: "github",
    providerUserId: githubUser.id.toString(),
    name: githubUser.login,
    email: userEmail,
  })

  return user.id
}
