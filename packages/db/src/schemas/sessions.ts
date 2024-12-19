import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { users } from "./users"

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  ipAddress: varchar(),
  userAgent: varchar(),
  expiresAt: timestamp({
    withTimezone: true,
    mode: "date",
  }).notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
})

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export type Session = typeof sessions.$inferSelect
export type SessionInput = typeof sessions.$inferInsert
