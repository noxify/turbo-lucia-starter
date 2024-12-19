// @credits
// https://github.com/whitecrownclown/merge-headers/blob/master/index.ts
// https://github.com/vercel/next.js/discussions/53997#discussioncomment-8259481

function isObject(value: unknown) {
  return value !== null && typeof value === "object"
}

/**
 * Merges multiple `RequestInit["headers"]` objects into a single `Headers` object.
 *
 * @param {...RequestInit["headers"]} sources - The headers to merge, passed as separate arguments.
 * @returns {Headers} A new `Headers` object containing the merged headers.
 */
export function mergeHeaders(...sources: RequestInit["headers"][]): Headers {
  const result: Record<string, string> = {}

  for (const source of sources) {
    if (!isObject(source)) {
      throw new TypeError("All arguments must be of type object")
    }

    const headers: Headers = new Headers(source)

    for (const [key, value] of Array.from(headers.entries())) {
      if (value === "undefined") {
        delete result[key]
      } else {
        result[key] = value
      }
    }
  }

  return new Headers(result)
}
