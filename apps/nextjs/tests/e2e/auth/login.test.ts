import { expect, test } from "@acme/playwright/fixtures"

test.describe("Login", () => {
  test("Unauthorized - Redirect to login page", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/auth/)
    await expect(page).toHaveTitle("Acme Inc - Sign in")
  })

  test("Login as mock user", async ({ auth }) => {
    await auth.login("mock_user")
  })

  test("Delete cookie to force redirect to /auth on page change", async ({ page, auth }) => {
    await auth.login("mock_user")
    await auth.clearSessionCookie()
    await page.goto("/")
    await expect(page).toHaveURL(/auth\?redirectTo=.*/)
  })
})
