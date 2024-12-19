import { inspect } from "util"
import type { LogLayerConfig } from "loglayer"
import { LoggerType, LogLayer } from "loglayer"
import { serializeError } from "serialize-error"
import { format, transports, createLogger as winstonLogger } from "winston"

import { env } from "./env"

const { combine, errors, timestamp, colorize, splat, printf } = format

type Preset = keyof typeof presets.loggers

interface PresetConfig {
  default: Preset
  loggers: Record<string, LogLayerConfig>
}

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

export const presets: PresetConfig = {
  default: "winston",
  loggers: {
    console: {
      logger: {
        type: LoggerType.CONSOLE,
        instance: console,
      },
    },
    winston: {
      enabled: true,
      metadata: {
        fieldName: "metadata",
      },
      context: {
        fieldName: "context",
      },
      error: {
        serializer: serializeError,
        fieldName: "error",
      },
      logger: {
        instance: w,
        type: LoggerType.WINSTON,
      },
    },
  },
}

export const createLogger = (preset?: keyof typeof presets.loggers) => {
  const logPreset = preset ? presets.loggers[preset] : presets.loggers[presets.default]

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return new LogLayer(logPreset!)
}
