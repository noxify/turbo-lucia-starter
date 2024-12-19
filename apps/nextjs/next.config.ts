import { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const config = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  cleanDistDir: true,

  // without this, we get the following error: https://github.com/jaredwray/keyv/issues/1031
  // this is related to the used versions inside `got`
  serverExternalPackages: ["got"],

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@acme/auth",
    "@acme/db",
    "@acme/helpers",
    "@acme/locales",
    "@acme/logging",
    "@acme/ui",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
} satisfies NextConfig

const withNextIntl = createNextIntlPlugin("./src/i18n.ts")

export default withNextIntl(config)
