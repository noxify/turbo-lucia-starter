import { oauthAccountRepository, userRepository } from "@acme/db/repositories"

import type { Providers } from "."

export interface HandleUserProps {
  provider: Providers
  providerUserId: string
  name: string
  email: string
}

export const handleUser = async (data: HandleUserProps) => {
  const existingUser = await userRepository.findFirst({
    where: (fields, { eq }) => eq(fields.email, data.email),
  })

  const existingAccount = await oauthAccountRepository.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.providerId, data.provider), eq(fields.providerUserId, data.providerUserId)),
  })

  // both records exists, nothing to do here
  if (existingUser && existingAccount) {
    return existingUser
  }

  // if we have multiple oauth provider and the user
  // uses the same email, we only have to create the oauth account and link them
  // to the existing user account
  if (existingUser && !existingAccount) {
    const newOAuthAccount = await oauthAccountRepository.create({
      providerId: data.provider,
      providerUserId: data.providerUserId,
      userId: existingUser.id,
    })

    if (!newOAuthAccount) {
      throw "Could not create OAuth account"
    }

    return existingUser
  }

  // if we have no user and no oauth account, create both
  if (!existingAccount && !existingUser) {
    const user = await userRepository.create({ name: data.name, email: data.email })

    if (!user) {
      throw "Could not create user"
    }
    const newOAuthAccount = await oauthAccountRepository.create({
      providerId: data.provider,
      providerUserId: data.providerUserId,
      userId: user.id,
    })

    if (!newOAuthAccount) {
      throw "Could not create OAuth account"
    }

    return user
  }

  // maybe I have forgot an case
  throw "something went wrong"
}
