import { Suspense } from "react"
import Link from "next/link"

import { auth } from "@acme/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@acme/ui/components/sidebar"

import Logo from "./logo"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

export function SiteSidebar() {
  const user = auth()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href={"/"}>
                  <Logo />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <Suspense>
          <NavUser user={user} />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  )
}
