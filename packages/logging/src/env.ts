/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    LOG_LEVEL: z.enum(["info", "warn", "error", "debug"]).default("warn"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  shared: {
    LOG_LEVEL: z.enum(["info", "warn", "error", "debug"]).default("warn"),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
})
