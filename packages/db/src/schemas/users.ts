import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

import { oauthAccounts } from "./oauth-accounts"
import { sessions } from "./sessions"

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 256 }).notNull(),
  email: varchar({ length: 256 }).notNull().unique(),
})

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions, { relationName: "userSessions" }),
  accounts: many(oauthAccounts, { relationName: "userOAuthAccounts" }),
}))

export type User = typeof users.$inferSelect
export type UserInput = typeof users.$inferInsert
