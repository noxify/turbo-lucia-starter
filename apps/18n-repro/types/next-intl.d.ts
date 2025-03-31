import type { formats } from "@/i18n/request"

import type en from "@acme/locales/lang/en"

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof en
    Formats: typeof formats
  }
}
