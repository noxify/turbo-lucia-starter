import type { ReactNode } from "react"

import { LanguageToggle } from "@acme/ui/components/language"
import { ThemeToggle } from "@acme/ui/components/theme"

export interface UnauthorizedLayoutProps {
  children: ReactNode
}

export default function UnauthorizedLayout({ children }: UnauthorizedLayoutProps) {
  return (
    <>
      {children}
      <div className="absolute right-4 bottom-4 space-x-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </>
  )
}
