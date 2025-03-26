import { defineRelations } from "drizzle-orm"

import * as schema from "."

export const relations = defineRelations(schema, (r) => ({
  users: {
    sessions: r.many.sessions({ from: r.users.id, to: r.sessions.userId }),
    accounts: r.many.oauthAccounts({ from: r.users.id, to: r.oauthAccounts.userId }),
  },
  sessions: {
    user: r.one.users({ from: r.sessions.userId, to: r.users.id }),
  },
  oauthAccounts: {
    user: r.one.users({ from: r.oauthAccounts.userId, to: r.users.id }),
  },
}))
