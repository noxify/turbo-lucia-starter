import type { PlaywrightTestConfig } from "@playwright/test"
import { defineConfig, devices } from "@playwright/test"

const playwrightConfig = ({ basePath, baseUrl }: { basePath: string; baseUrl: string }) => {
  const baseURL = `${baseUrl}${basePath}`

  const config = {
    testMatch: "**/{e2e,a11y}/**/*.{e2e,test,spec}.{ts,tsx}",
    testDir: "tests",
    outputDir: "playwright-results",
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 1 : undefined,

    reporter: [
      ["list"],
      ["junit", { outputFile: "junit-report.xml" }],
      ["html", { open: "never", outputFolder: "playwright-report" }],
    ],
    use: {
      trace: "retain-on-failure",
    },

    projects: [
      {
        name: "headed",
        use: {
          ...devices["Desktop Chrome"],
          headless: false,
          baseURL,
          locale: "en",
          ignoreHTTPSErrors: true,
        },
      },
      {
        name: "headless",
        use: {
          ...devices["Desktop Chrome"],
          baseURL,
          locale: "en",
          headless: true,
          ignoreHTTPSErrors: true,
        },
      },
    ],
  } satisfies PlaywrightTestConfig

  return defineConfig(config)
}

export default playwrightConfig
