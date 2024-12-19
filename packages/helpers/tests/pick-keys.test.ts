import { expect, test } from "vitest"

import { pickKeys } from "../src/pick-keys"

test("picks specified keys from object", () => {
  const data = { a: 1, b: 2, c: 3 }
  const keys: (keyof typeof data)[] = ["a", "c"]
  const expectedResult = { a: 1, c: 3 }

  expect(pickKeys(data, keys)).toEqual(expectedResult)
})

test("returns an empty object when no keys to pick", () => {
  const data = { a: 1, b: 2, c: 3 }
  const keys: (keyof typeof data)[] = []
  const expectedResult = {}

  expect(pickKeys(data, keys)).toEqual(expectedResult)
})

test("returns an empty object when keys are not strings", () => {
  const data = { a: 1, b: 2, c: 3 }
  const keys = [123] // non-string key
  const expectedResult = {}
  // @ts-expect-error we know that the keys are not strings and that they didn't match the available keys
  expect(pickKeys(data, keys)).toEqual(expectedResult)
})

test("returns an empty object when keys are not valid property names", () => {
  const data = { a: 1, b: 2, c: 3 }
  const keys = ["x", "y"] // invalid property names

  const expectedResult = {}
  // @ts-expect-error we know that the keys are not strings and that they didn't match the available keys
  expect(pickKeys(data, keys)).toEqual(expectedResult)
})
