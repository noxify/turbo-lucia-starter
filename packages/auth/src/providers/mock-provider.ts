import { OAuth2Client } from "arctic"

export interface MockJWTPayload {
  iss: string
  iat: number
  exp: number
  nbf: number
  sub: string
  amr: string[]
  scope: string
}

export class MockProvider {
  private client: OAuth2Client
  private baseUrl: string
  private authorizeEndpoint: string
  private tokenEndpoint: string
  constructor(
    clientId: string,
    clientSecret: string,
    options: {
      redirectURI: string | null
      baseUrl: string
    },
  ) {
    const baseUrl = options.baseUrl

    this.baseUrl = baseUrl

    this.authorizeEndpoint = baseUrl + "/authorize"
    this.tokenEndpoint = baseUrl + "/token"

    this.client = new OAuth2Client(clientId, clientSecret, options.redirectURI)
  }

  public getBaseUrl() {
    return this.baseUrl
  }

  public createAuthorizationURL(
    state: string,
    options?: {
      scopes?: string[]
    },
  ): URL {
    return this.client.createAuthorizationURL(this.authorizeEndpoint, state, options?.scopes ?? [])
  }

  public async validateAuthorizationCode(code: string): Promise<MockTokens> {
    const result = await this.client.validateAuthorizationCode(this.tokenEndpoint, code, null)
    const tokens: MockTokens = {
      accessToken: result.accessToken(),
    }
    return tokens
  }
}

export interface MockTokens {
  accessToken: string
}
