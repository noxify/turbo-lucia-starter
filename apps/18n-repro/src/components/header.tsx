import { LanguageToggle } from "@acme/ui/components/language"
import { SidebarTrigger } from "@acme/ui/components/sidebar"
import { ThemeToggle } from "@acme/ui/components/theme"

export function SiteHeader() {
  return (
    <header className="sticky top-0 mb-4 flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="flex gap-2 px-4">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </header>
  )
}
