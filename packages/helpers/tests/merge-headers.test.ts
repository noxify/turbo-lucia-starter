import { describe, expect, it } from "vitest"

import { mergeHeaders } from "../src/merge-headers"

describe("mergeHeaders", () => {
  it("merges headers from multiple sources", () => {
    const source1 = { "Content-Type": "application/json" }
    const source2 = { Authorization: "Bearer token" }
    const result = mergeHeaders(source1, source2)

    expect(Object.fromEntries(result.entries())).toHaveProperty("content-type", "application/json")
    expect(Object.fromEntries(result.entries())).toHaveProperty("authorization", "Bearer token")
  })

  it("ignores non-object sources", () => {
    const source = "non-object"
    expect(() => mergeHeaders({})).not.toThrow()
    try {
      // @ts-expect-error to test the error handling, we have to pass an invalid argument
      mergeHeaders(source)
    } catch (error) {
      expect((error as Error).message).toBe("All arguments must be of type object")
    }
  })

  it("deletes headers with undefined values", () => {
    const source = {
      "Content-Type": "application/json",
      "undefined-header": "undefined",
    }
    const result = mergeHeaders(source)

    expect(result.has("content-type")).toBeTruthy()
    expect(result.has("undefined-header")).toBeFalsy()
  })

  it("returns an empty Headers object when no sources are provided", () => {
    const result = mergeHeaders()
    expect(result).toEqual(new Headers())
  })

  it("merges multiple headers with same name from different sources", () => {
    const source1 = { "Content-Type": "application/json" }
    const source2 = { "Content-Type": "application/xml" }
    const result = mergeHeaders(source1, source2)
    expect(result.get("Content-Type")).toEqual("application/xml")
  })
})
