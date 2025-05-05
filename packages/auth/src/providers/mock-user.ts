import { env } from "../env"
import { handleUser } from "../user-handler"
import { MockProvider } from "./mock-provider"

const callbackUrl = env.APPLICATION_URL
  ? `https://${env.APPLICATION_URL}/api/auth/mock_user/callback`
  : "http://localhost:3000/api/auth/mock_user/callback"

const oauthMock = new MockProvider("dummy-client-id", "dummy-client-secret", {
  baseUrl: env.OAUTH_MOCK_ENDPOINT ?? "http://localhost:8080",
  redirectURI: `${callbackUrl}`,
})

export const name = "Mock User"

export const getAuthorizationUrl = (state: string, _codeVerifier: string) => {
  return oauthMock.createAuthorizationURL(state, {
    scopes: ["email"],
  })
}

export const handleCallback = async (code: string, _codeVerifier: string) => {
  await oauthMock.validateAuthorizationCode(code)

  const userId = "mock_user"

  const user = await handleUser({
    provider: "mock_user",
    providerUserId: userId,
    name: userId,
    email: `${userId}@example.com`,
  })

  return user.id
}
