/**
 * Source: https://www.omarileon.me/blog/typescript-groupby
 * Owner: Omari Thompson-Edwards <othompsonedwards@gmail.com>
 * License: <tbd>
 */

/**
 * Groups an iterable of objects by a given key.
 *
 * Args:
 *     iterable: The input iterable to be grouped.
 *     fn: A function that takes each item in the iterable and returns a key.
 *
 * Returns:
 *     An object where each key is a unique value from `fn` applied to each item,
 *     and the corresponding value is an array of items for which `fn` returned that key.
 */
export function groupBy<T>(
  iterable: Iterable<T>,
  fn: (item: T) => string | number,
): Record<string, T[]> {
  return [...iterable].reduce<Record<string, T[]>>((groups, curr) => {
    const key = fn(curr)
    const group = groups[key] ?? []
    group.push(curr)
    return { ...groups, [key]: group }
  }, {})
}
