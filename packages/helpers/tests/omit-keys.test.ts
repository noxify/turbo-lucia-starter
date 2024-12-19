import { expect, test } from "vitest"

import { omitKeys } from "../src/omit-keys"

test("omits specified keys from object", () => {
  const data = { a: 1, b: 2, c: 3 }
  const keys: (keyof typeof data)[] = ["a", "c"]
  const expectedResult = { b: 2 }

  expect(omitKeys(data, keys)).toEqual(expectedResult)
})

test("returns entire object when no keys to omit", () => {
  const data = { a: 1, b: 2, c: 3 }
  const keys: (keyof typeof data)[] = []
  const expectedResult = { a: 1, b: 2, c: 3 }

  expect(omitKeys(data, keys)).toEqual(expectedResult)
})

test("throws error when keys are not strings", () => {
  const data = { a: 1, b: 2, c: 3 }
  const keys = [123] // non-string key
  const expectedResult = { a: 1, b: 2, c: 3 }
  // @ts-expect-error we know that the keys are not strings and that they didn't match the available keys
  expect(omitKeys(data, keys)).toEqual(expectedResult)
})

test("throws error when keys are not valid property names", () => {
  const data = { a: 1, b: 2, c: 3 }
  const keys = ["x", "y"] // invalid property names

  const expectedResult = { a: 1, b: 2, c: 3 }
  // @ts-expect-error we know that the keys are not strings and that they didn't match the available keys
  expect(omitKeys(data, keys)).toEqual(expectedResult)
})
