import { db } from "@acme/db/client"
import { oauthAccounts, users } from "@acme/db/schemas"

import type { Providers } from "."

export interface HandleUserProps {
  provider: Providers
  providerUserId: string
  name: string
  email: string
}

export const handleUser = async (data: HandleUserProps) => {
  const existingUser = await db.query.users.findFirst({
    where: {
      email: { eq: data.email },
    },
  })

  const existingAccount = await db.query.oauthAccounts.findFirst({
    where: { providerId: { eq: data.provider }, providerUserId: { eq: data.providerUserId } },
  })

  // both records exists, nothing to do here
  if (existingUser && existingAccount) {
    return existingUser
  }

  // if we have multiple oauth provider and the user
  // uses the same email, we only have to create the oauth account and link them
  // to the existing user account
  if (existingUser && !existingAccount) {
    const newOAuthAccount = (
      await db
        .insert(oauthAccounts)
        .values({
          providerId: data.provider,
          providerUserId: data.providerUserId,
          userId: existingUser.id,
        })
        .returning()
    )[0]

    if (!newOAuthAccount) {
      throw "Could not create OAuth account"
    }

    return existingUser
  }

  // if we have no user and no oauth account, create both
  if (!existingAccount && !existingUser) {
    const user = (
      await db.insert(users).values({ name: data.name, email: data.email }).returning()
    )[0]

    if (!user) {
      throw "Could not create user"
    }

    const newOAuthAccount = (
      await db
        .insert(oauthAccounts)
        .values({ providerId: data.provider, providerUserId: data.providerUserId, userId: user.id })
        .returning()
    )[0]

    if (!newOAuthAccount) {
      throw "Could not create OAuth account"
    }

    return user
  }

  // maybe I have forgot an case
  throw "something went wrong"
}
