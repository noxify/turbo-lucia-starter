import type { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "@acme/ui/components/sidebar"

import { SiteHeader } from "~/components/header"
import { SiteSidebar } from "~/components/sidebar"

export interface AuthorizedLayoutProps {
  children: ReactNode
}

export default function AuthorizedLayout({ children }: AuthorizedLayoutProps) {
  return (
    <SidebarProvider>
      <SiteSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="h-fit 2xl:container 2xl:mx-auto 2xl:px-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
