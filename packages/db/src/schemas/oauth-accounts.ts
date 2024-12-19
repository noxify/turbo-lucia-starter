import { relations } from "drizzle-orm"
import { pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core"

import { users } from "./users"

export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    providerId: varchar().notNull(),
    providerUserId: varchar().notNull(),
    userId: uuid()
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.providerId, t.providerUserId] }),
  }),
)

export const oauthAccountRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, { fields: [oauthAccounts.userId], references: [users.id] }),
}))

export type OAuthAccount = typeof oauthAccounts.$inferSelect
export type OAuthAccountInput = typeof oauthAccounts.$inferInsert
