import { SYMBOLS } from "./constants"

export const success = (message: string) => {
  return `${SYMBOLS.Tick} ${message}`
}

export const error = (message: string) => {
  return `${SYMBOLS.Cross} ${message}`
}
