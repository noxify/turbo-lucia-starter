import { defineWorkspace } from "vitest/config"

export default defineWorkspace([
  {
    test: {
      name: "unit",
      include: ["packages/**/*.test.ts"],
    },
  },
])
