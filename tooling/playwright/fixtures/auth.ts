import type { Page } from "@playwright/test"
import { expect } from "@playwright/test"

import type { Providers } from "@acme/auth"

export class Auth {
  constructor(public readonly page: Page) {}

  async loginPage() {
    await this.page.goto("/auth")
    await expect(this.page).toHaveURL(/auth/)
    await expect(this.page).toHaveTitle("itAPS - Sign in")
  }

  async login(user: Providers) {
    await this.page.goto("/")
    await expect(this.page).toHaveURL(/auth/)
    await expect(this.page).toHaveTitle("itAPS - Sign in")

    const loginButton = this.page.locator(`#${user}`)

    await loginButton.click()

    await this.page.waitForURL("/", { timeout: 5000 })

    await expect(this.page).toHaveURL("/")
    await expect(this.page).toHaveTitle("itAPS - Dashboard")
  }

  async clearSessionCookie() {
    await this.page.context().clearCookies({ name: "session" })
  }
}
