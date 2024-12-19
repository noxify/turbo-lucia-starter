import { db } from "../client"
import { createRepository } from "../repository"

export const sessionRepository = createRepository({
  db,
  table: "sessions",
  queryBuilder: db.query.sessions,
})
