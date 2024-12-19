import { chainMiddleware } from "~/middlewares/chain-middleware"
import { withI18n } from "~/middlewares/i18n"

export default chainMiddleware([withI18n])

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)",

    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(de|en)/:path*",
  ],
}
