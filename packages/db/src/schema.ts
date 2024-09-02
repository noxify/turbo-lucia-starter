import { relations, sql } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

export const Post = pgTable("post", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  title: varchar("name", { length: 256 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
})

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().min(3).max(256),
  content: z.string().min(10).max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const User = pgTable("user", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
})

export const UpdateUserSchema = createInsertSchema(User, {
  name: z.string().min(1).max(255),
}).omit({ email: true, id: true })

export const Session = pgTable("session", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => User.id),
  expiresAt: timestamp("expires_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
})

export const Account = pgTable("account", {
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  providerUserId: varchar("provider_user_id", { length: 255 }).notNull(),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => User.id),
})

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, {
    fields: [Session.userId],
    references: [User.id],
  }),
}))

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, {
    fields: [Account.userId],
    references: [User.id],
  }),
}))
