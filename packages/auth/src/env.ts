/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    AUTH_GITHUB_ID: z.string().min(1),
    AUTH_GITHUB_SECRET: z.string().min(1),
    AUTH_DISCORD_ID: z.string().min(1),
    AUTH_DISCORD_SECRET: z.string().min(1),
    APPLICATION_URL: z.string().optional(),
    OAUTH_MOCK_ENABLED: z.coerce
      .string()
      .transform((val) => val === "true")
      .default("false"),
    OAUTH_MOCK_ENDPOINT: z.string().optional(),
  },

  client: {},
  experimental__runtimeEnv: process.env,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
})
