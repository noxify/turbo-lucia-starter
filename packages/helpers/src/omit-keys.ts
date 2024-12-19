/**
 * Creates a new object from the provided data with the specified keys omitted.
 *
 * @param data The original object to omit keys from.
 * @param keys An array of keys to omit from the resulting object.
 *
 * @returns A new object with the specified keys removed from the original data.
 */
export function omitKeys<Data extends object, Keys extends keyof Data>(
  data: Data,
  keys: Keys[],
): Omit<Data, Keys> {
  const result = { ...data }

  for (const key of keys) {
    delete result[key]
  }

  return result as Omit<Data, Keys>
}
