/**
 * Picks specific keys from an object of type `Data` and returns a new object with only those keys.
 *
 * @param data The input object of type `Data`.
 * @param keys An array of key names to pick from `data`.
 * @returns A new object of type `Pick<Data, Keys>` containing the picked keys.
 */
export function pickKeys<Data extends object, Keys extends keyof Data>(
  data: Data,
  keys: Keys[],
): Pick<Data, Keys> {
  const result = {} as Pick<Data, Keys>

  const dataKeys = Object.keys(data)
  for (const key of keys) {
    // @ts-expect-error (no type check)
    if (dataKeys.includes(key)) {
      result[key] = data[key]
    }
  }

  return result
}
