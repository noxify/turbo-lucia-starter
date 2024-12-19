import { test as base } from "@playwright/test"

import { Auth } from "./auth"

interface MyFixtures {
  auth: Auth
}

// Specify both option and fixture types.
export const test = base.extend<MyFixtures>({
  auth: async ({ page }, use) => {
    await use(new Auth(page))
  },
})
export { expect } from "@playwright/test"
