import { db } from "../client"
import { createRepository } from "../repository"

export const oauthAccountRepository = createRepository({
  db,
  table: "oauthAccounts",
  queryBuilder: db.query.oauthAccounts,
})
