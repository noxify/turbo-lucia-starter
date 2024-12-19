/**
 * Source: https://github.com/TopCli/prompts/blob/main/src/utils.ts
 * License: ISC - https://github.com/TopCli/prompts/blob/main/LICENSE
 * Copyright: 2023-2024 Pierre Demailly
 */

import kleur from "kleur"

import { isUnicodeSupported } from "./utils"

const kMainSymbols = {
  tick: "✔",
  cross: "✖",
  pointer: "›",
  previous: "⭡",
  next: "⭣",
  active: "●",
  inactive: "○",
}
const kFallbackSymbols = {
  tick: "√",
  cross: "×",
  pointer: ">",
  previous: "↑",
  next: "↓",
  active: "(+)",
  inactive: "(-)",
}
const kSymbols =
  // eslint-disable-next-line no-restricted-properties
  isUnicodeSupported() || process.env.CI ? kMainSymbols : kFallbackSymbols
const kPointer = kleur.gray(kSymbols.pointer)

export const SYMBOLS = {
  QuestionMark: kleur.blue().bold("?"),
  Tick: kleur.green().bold(kSymbols.tick),
  Cross: kleur.red().bold(kSymbols.cross),
  Pointer: kPointer,
  Previous: kSymbols.previous,
  Next: kSymbols.next,
  ShowCursor: "\x1B[?25h",
  HideCursor: "\x1B[?25l",
  Active: kleur.cyan(kSymbols.active),
  Inactive: kleur.gray(kSymbols.inactive),
}
