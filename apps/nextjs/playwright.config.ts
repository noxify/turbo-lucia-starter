import playwrightConfig from "@acme/playwright"

const baseUrl = process.env.APPLICATION_URL
  ? `${process.env.APPLICATION_URL}`
  : process.env.LOCAL_HTTPS
    ? "https://localhost:3000"
    : "http://localhost:3000"

export default playwrightConfig({
  basePath: "/",
  baseUrl,
})
