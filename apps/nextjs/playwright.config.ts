import playwrightConfig from "@acme/playwright"

const baseUrl = process.env.APPLICATION_URL ?? "http://localhost:3000"

export default playwrightConfig({
  basePath: "/",
  baseUrl,
})
