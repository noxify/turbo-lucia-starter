import { describe, expect, test } from "vitest"

import { generateQueryParameters } from "../src/query-params"

describe("Helpers - generate query parameters", () => {
  test("empty parameters", () => {
    const input = {}
    const output = generateQueryParameters(input)
    expect(Object.keys(output)).toHaveLength(0)
  })

  test("parameters are filled", () => {
    const input = {
      string: "value",
      number: 123,
      bool_true: true,
      bool_false: false,
    }
    const output = generateQueryParameters(input)
    expect(Object.keys(output)).toHaveLength(4)
  })

  test("parameters are filled with null and undefined", () => {
    const input = {
      string: "value",
      null_field: null,
      number: 123,
      undefined_field: "undefined",
      bool_true: true,
      bool_false: false,
    }
    const output = generateQueryParameters(input)
    expect(output).not.toBeUndefined()
    expect(Object.keys(output)).toHaveLength(4)
  })
})
