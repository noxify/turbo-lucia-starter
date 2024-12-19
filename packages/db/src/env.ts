import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    RDS_ENGINE: z.string().min(1).optional().default("mysql"),
    RDS_HOST: z.string().min(1),
    RDS_PORT: z.coerce.number().optional().default(3306),
    RDS_USERNAME: z.string().min(1),
    RDS_PASSWORD: z.string().min(1),
    RDS_DBNAME: z.string().min(1),
    RDS_DEBUG: z.coerce
      .string()
      .transform((val) => val === "true")
      .default("false"),
  },
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI ||
    process.env.npm_lifecycle_event === "lint" ||
    process.env.npm_lifecycle_event === "test",
})
