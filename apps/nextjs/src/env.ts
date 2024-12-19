/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

import { env as authEnv } from "@acme/auth/env"
import { env as dbEnv } from "@acme/db/env"

export const env = createEnv({
  extends: [dbEnv, authEnv],

  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {},

  shared: {
    APPLICATION_URL: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {},
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    APPLICATION_URL: process.env.APPLICATION_URL,
  },
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
})
