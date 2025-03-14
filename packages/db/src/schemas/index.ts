import { pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 256 }).notNull(),
  email: varchar({ length: 256 }).notNull().unique(),
})

export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    providerId: varchar().notNull(),
    providerUserId: varchar().notNull(),
    userId: uuid().notNull(),
  },
  (t) => [primaryKey({ columns: [t.providerId, t.providerUserId] })],
)

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  ipAddress: varchar(),
  userAgent: varchar(),
  expiresAt: timestamp({
    withTimezone: true,
    mode: "date",
  }).notNull(),
  userId: uuid().notNull(),
})

export type OAuthAccount = typeof oauthAccounts.$inferSelect
export type OAuthAccountInput = typeof oauthAccounts.$inferInsert
export type User = typeof users.$inferSelect
export type UserInput = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type SessionInput = typeof sessions.$inferInsert
