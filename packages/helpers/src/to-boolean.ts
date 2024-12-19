export const toBoolean = (input: string) => {
  switch (input.toLowerCase().trim()) {
    case "true":
    case "yes":
    case "1":
      return true

    case "false":
    case "no":
    case "0":
    default:
      return false
  }
}
