import type { NextFetchEvent, NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { routing } from "@acme/locales/routing"

import type { CustomMiddleware } from "~/middlewares/chain-middleware"

const handleI18nRouting = createMiddleware(routing)

export function withI18n(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = handleI18nRouting(request)
    return middleware(request, event, response)
  }
}
