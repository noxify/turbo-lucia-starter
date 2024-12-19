import { drizzle } from "drizzle-orm/node-postgres"

import { env } from "./env"
import * as schema from "./schemas"

export const db = drizzle({
  connection: {
    host: env.RDS_HOST,
    port: env.RDS_PORT,
    user: env.RDS_USERNAME,
    password: env.RDS_PASSWORD,
    database: env.RDS_DBNAME,
    ssl: false,
  },
  schema,
  casing: "snake_case",
})
