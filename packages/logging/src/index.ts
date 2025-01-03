import { inspect } from "util"
import { WinstonTransport } from "@loglayer/transport-winston"
import { ConsoleTransport, LogLayer } from "loglayer"
import { serializeError } from "serialize-error"
import { format, transports, createLogger as winstonLogger } from "winston"

import { env } from "./env"

const { combine, errors, timestamp, colorize, splat, printf } = format

const devFormat = combine(
  format((info) => {
    info.level = info.level.toUpperCase()
    return info
  })(),
  colorize(),
  timestamp(),
  splat(),
  errors({ stack: true }),
  printf(({ timestamp, level, message, ...rest }) => {
    const stripped = Object.assign({}, Object.fromEntries(Object.entries(rest)))
    const { context, metadata } = Object.assign({ context: {}, metadata: { error: {} } }, stripped)
    const { error, ...restMetadata } = metadata
    const coloredContext = inspect(context, {
      depth: 10,
      showHidden: false,
      colors: true,
      compact: true,
    })
    const coloredMetadata = inspect(restMetadata, {
      depth: 10,
      showHidden: false,
      colors: true,
      compact: true,
    })
    const coloredError = inspect(error, {
      depth: 10,
      showHidden: false,
      colors: true,
      compact: false,
    })

    const hasContext = coloredContext !== "{}"
    const hasMetadata = coloredMetadata !== "{}"
    const hasError = coloredError !== "{}"

    const contextOutput = hasContext ? "\nContext: " + coloredContext : ""
    const metadataOutput = hasMetadata ? "\nMetadata: " + coloredMetadata : ""
    const errorOutput = hasError ? "\nError: " + coloredError : ""

    return `[${timestamp as string}] ${level} - ${message as string}${contextOutput}${metadataOutput}${errorOutput}`
  }),
)
const w = winstonLogger({
  format: devFormat,
  transports: [new transports.Console()],
  level: env.LOG_LEVEL,
})

export const createLogger = (preset: "console" | "winston" = "winston") => {
  const presets = [
    new ConsoleTransport({ logger: console, enabled: preset === "console", id: "console" }),
    new WinstonTransport({ logger: w, enabled: preset === "winston", id: "winston" }),
  ]

  return new LogLayer({
    transport: presets,
    errorFieldInMetadata: false,
    metadataFieldName: "metadata",
    contextFieldName: "context",
    errorSerializer: serializeError,
  })
}
