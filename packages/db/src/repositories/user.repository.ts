import { db } from "../client"
import { createRepository } from "../repository"

export const userRepository = createRepository({ db, table: "users", queryBuilder: db.query.users })
