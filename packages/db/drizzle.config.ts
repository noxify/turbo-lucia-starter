import type { Config } from "drizzle-kit"

import { env } from "./src/env"

export default {
  schema: "./src/schemas/index.ts",
  dialect: "postgresql",
  out: "./drizzle",
  migrations: {
    // if you want to use a different schema for the table `__drizzle_migrations`
    // you can specify it here or remove the block to use the default schema ( `drizzle` )
    schema: "public",
  },
  dbCredentials: {
    host: env.RDS_HOST,
    port: env.RDS_PORT,
    user: env.RDS_USERNAME,
    password: env.RDS_PASSWORD,
    database: env.RDS_DBNAME,
    ssl: false,
  },
  casing: "snake_case",
} satisfies Config
