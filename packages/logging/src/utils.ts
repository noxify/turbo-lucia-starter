/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable no-restricted-properties */
/**
 * Source: https://github.com/TopCli/prompts/blob/main/src/utils.ts
 * License: ISC - https://github.com/TopCli/prompts/blob/main/LICENSE
 * Copyright: 2023-2024 Pierre Demailly
 */

import process from "node:process"

const kAnsiRegex = ansiRegex()

/**
 * @see https://github.com/chalk/ansi-regex
 */
export function ansiRegex({ onlyFirst = false } = {}) {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
  ].join("|")

  return new RegExp(pattern, onlyFirst ? undefined : "g")
}

export function stripAnsi(string: string) {
  return string.replace(kAnsiRegex, "")
}

/**
 * @see https://github.com/sindresorhus/is-unicode-supported
 */
export function isUnicodeSupported() {
  if (process.platform !== "win32") {
    // Linux console (kernel)
    return process.env.TERM !== "linux"
  }

  // Windows Terminal
  return (
    Boolean(process.env.WT_SESSION) ||
    // Terminus (<0.2.27)
    Boolean(process.env.TERMINUS_SUBLIME) ||
    // ConEmu and cmder
    process.env.ConEmuTask === "{cmd::Cmder}" ||
    process.env.TERM_PROGRAM === "Terminus-Sublime" ||
    process.env.TERM_PROGRAM === "vscode" ||
    process.env.TERM === "xterm-256color" ||
    process.env.TERM === "alacritty" ||
    process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm"
  )
}
