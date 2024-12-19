export function generateQueryParameters(
  props: Record<string, string | number | boolean | undefined | null>,
) {
  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== null && value !== "undefined"),
  )
}
