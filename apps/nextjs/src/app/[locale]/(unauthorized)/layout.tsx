import type { ReactNode } from "react"

import { LanguageToggle } from "@acme/ui/language"
import { ThemeToggle } from "@acme/ui/theme"

export interface UnauthorizedLayoutProps {
  children: ReactNode
}

export default function UnauthorizedLayout({ children }: UnauthorizedLayoutProps) {
  return (
    <>
      {children}
      <div className="absolute bottom-4 right-4 space-x-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </>
  )
}
