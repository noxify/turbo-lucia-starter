// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { inferParserType } from "nuqs/server"
import {
  createParser,
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"

export const parseAsSorting = createParser({
  parse(queryValue) {
    const [by, direction] = queryValue.split(".")
    const isValid = by !== "" && direction !== ""
    if (!isValid) return null
    return {
      by,
      direction,
    }
  },
  serialize(value) {
    return value.by !== "" && value.direction !== "" ? `${value.by}.${value.direction}` : ""
  },
})

export const searchParams = {
  filter: parseAsString.withDefault("(1 = 1)"),
  pageIndex: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
  sort: parseAsSorting.withDefault({ by: "", direction: "desc" }),
}

export const searchParamsCache = createSearchParamsCache(searchParams)

// workaround to solve the current type issue for
// export const serialize = createSerializer({ ...searchParams })
export const serialize = (path: string, options: Partial<inferParserType<typeof searchParams>>) => {
  const fn = createSerializer({ ...searchParams })

  return fn(path, options)
}
