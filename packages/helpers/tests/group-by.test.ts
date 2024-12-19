import { describe, expect, it } from "vitest"

import { groupBy } from "../src/group-by"

describe("groupBy", () => {
  it("groups items by a simple key", () => {
    const iterable = [{ id: "a" }, { id: "b" }, { id: "a" }]
    const result = groupBy(iterable, (item) => item.id)
    expect(result).toEqual({
      a: [{ id: "a" }, { id: "a" }],
      b: [{ id: "b" }],
    })
  })

  it("groups items by a numeric key", () => {
    const iterable = [1, 2, 3, 4, 5]
    const result = groupBy(iterable, (item) => item)
    expect(result).toEqual({
      1: [1],
      2: [2],
      3: [3],
      4: [4],
      5: [5],
    })
  })

  it("groups items by a dynamic key", () => {
    const iterable = [{ name: "John" }, { name: "Jane" }, { name: "John" }]
    const result = groupBy(iterable, (item) => item.name)
    expect(result).toEqual({
      John: [{ name: "John" }, { name: "John" }],
      Jane: [{ name: "Jane" }],
    })
  })

  it("handles empty iterable", () => {
    const iterable: { id: string; name: string }[] = []
    const result = groupBy(iterable, (item) => item.id)
    expect(result).toEqual({})
  })

  it("handles null and undefined values in the iterable", () => {
    const iterable = [{ id: "a" }, { id: "b" }, null, undefined]
    const result = groupBy(iterable, (item) => item?.id ?? "")
    expect(result).toEqual({
      a: [{ id: "a" }],
      b: [{ id: "b" }],
      "": [null, undefined],
    })
  })
})
