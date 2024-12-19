import { defineConfig } from "vitest/config"

export default defineConfig({
  envDir: "./",
  test: {
    passWithNoTests: true,
    coverage: {
      enabled: false,
      provider: "v8",
      include: ["packages/**/src/**/*.ts"],
    },
  },
})
