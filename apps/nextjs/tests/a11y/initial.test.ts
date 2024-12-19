import AxeBuilder from "@axe-core/playwright" // 1
import { expect, test } from "@playwright/test"

test.describe("homepage", () => {
  // 2
  test.skip("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("https://your-site.com/") // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze() // 4

    expect(accessibilityScanResults.violations).toEqual([]) // 5
  })
})
