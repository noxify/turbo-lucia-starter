"use client"

import type { LucideIcon } from "lucide-react"
import type { LinkProps } from "next/link"
import { useState } from "react"
import { resolveHref } from "next/dist/client/resolve-href"
import { usePathname } from "next/navigation"
import Router from "next/router"
import { ChevronsUpDown, ExternalLinkIcon, LayoutDashboardIcon } from "lucide-react"
import multimatch from "multimatch"

import type { AuthResponse } from "@acme/auth"
import { Link } from "@acme/locales/react"
import { cn } from "@acme/ui"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@acme/ui/collapsible"

interface NavigationElement {
  type: "navigation"
  items: (LinkElement | CollapsibleElement | GroupElement)[]
  hidden?: boolean | ((user: AuthResponse["user"] | null) => boolean)
}

interface DividerElement {
  type: "divider"
  hidden?: boolean | ((user: AuthResponse["user"] | null) => boolean)
}

interface GroupElement {
  type: "group"
  name: string
  hidden?: boolean | ((user: AuthResponse["user"] | null) => boolean)
}

interface LinkElement {
  type: "link"
  name: string
  href: LinkProps["href"] | ((user: AuthResponse["user"] | null) => LinkProps["href"])
  icon?: LucideIcon
  external?: boolean
  hidden?: boolean | ((user: AuthResponse["user"] | null) => boolean)
}

interface CollapsibleElement {
  type: "collapsible"
  name: string
  icon?: LucideIcon
  hidden?: boolean | ((user: AuthResponse["user"] | null) => boolean)
  children: Omit<
    CollapsibleElement & {
      external?: boolean
      href: LinkProps["href"] | ((user: AuthResponse["user"] | null) => LinkProps["href"])
    },
    "icon" | "children" | "type"
  >[]
}

interface BaseItemProps {
  mobile?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  user: AuthResponse["user"] | null
}
interface NavigationItemProps extends BaseItemProps {
  item: LinkElement
}

interface CollapsibleItemProps extends BaseItemProps {
  item: CollapsibleElement
}

interface MobileLinkProps extends LinkProps<string> {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export type SidebarNavigation = DividerElement | NavigationElement

function isActive(currentPath: string | string[], checkPath: string | string[]) {
  return multimatch(currentPath, checkPath).length > 0
}

const elements: SidebarNavigation[] = [
  {
    type: "navigation",
    items: [
      {
        type: "link",
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboardIcon,
      },
    ],
  },
]

function MobileLink({ href, onOpenChange, className, children }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={cn(className)}
    >
      {children}
    </Link>
  )
}

function NavigationItem({
  item,
  mobile = false,
  onOpenChange,
  className,
  user,
}: NavigationItemProps) {
  const pathname = usePathname()

  const linkUrl = typeof item.href === "function" ? item.href(user) : item.href
  const resolvedUrl = resolveHref(Router, linkUrl)

  const current =
    ((pathname.startsWith(resolvedUrl) ||
      pathname.startsWith(`/de${resolvedUrl}`) ||
      pathname.startsWith(`/en${resolvedUrl}`)) &&
      linkUrl !== "/") ||
    (pathname === "/" && linkUrl === "/") ||
    (pathname === "/de" && linkUrl === "/") ||
    (pathname === "/en" && linkUrl === "/")
  const isHidden = typeof item.hidden === "function" ? item.hidden(user) : (item.hidden ?? false)

  if (isHidden) {
    return null
  }

  return mobile ? (
    <MobileLink
      onOpenChange={onOpenChange}
      href={linkUrl}
      className={cn(
        current
          ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
          : "hover:bg-primary hover:text-accent-foreground",
        "inline-flex h-9 w-full items-center justify-start whitespace-nowrap rounded-md px-3 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {item.icon && <item.icon className="mr-2 h-5 w-5 shrink-0" aria-hidden="true" />}
      {item.name} {item.external && <ExternalLinkIcon className="ml-2 h-4 w-4" />}
    </MobileLink>
  ) : (
    <Link
      href={linkUrl}
      className={cn(
        current ? "pulse-menu font-bold text-foreground" : "font-medium",
        "hover:bg-muted hover:text-accent-foreground",
        "inline-flex h-9 w-full items-center justify-start whitespace-nowrap rounded-md px-3 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {item.icon && <item.icon className="mr-2 h-5 w-5 shrink-0" aria-hidden="true" />}
      {item.name} {item.external && <ExternalLinkIcon className="ml-2 h-4 w-4" />}
    </Link>
  )
}

function CollapisbleItem({
  item,
  mobile = false,
  onOpenChange,
  className,
  user,
}: CollapsibleItemProps) {
  const pathname = usePathname()

  const current = isActive(
    pathname,
    item.children
      .map((ele) => {
        const linkUrl = typeof ele.href === "function" ? ele.href(user) : ele.href
        const resolvedUrl = resolveHref(Router, linkUrl)
        return [
          resolvedUrl,
          `/en${resolvedUrl}`,
          `/de${resolvedUrl}`,
          `${resolvedUrl}/**`,
          `/en${resolvedUrl}/**`,
          `/de${resolvedUrl}/**`,
        ]
      })
      .flat(),
  )

  const [isOpen, setIsOpen] = useState(current)

  const isHidden = typeof item.hidden === "function" ? item.hidden(user) : (item.hidden ?? false)

  if (isHidden) {
    return null
  }
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <div
          className={cn(
            current
              ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
              : "hover:bg-accent hover:text-accent-foreground",
            "inline-flex h-9 w-full items-center justify-start whitespace-nowrap rounded-md px-3 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            className,
          )}
        >
          <CollapsibleTrigger className="w-full">
            <div className="mx-auto flex w-full items-center justify-between">
              <div className="flex">
                {item.icon && <item.icon className="mr-2 h-5 w-5 shrink-0" aria-hidden="true" />}
                {item.name}
              </div>
              <div>
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </div>
            </div>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="">
        {item.children.length > 0 &&
          item.children.map((subItem, subItemIdx) => {
            const linkUrl = typeof subItem.href === "function" ? subItem.href(user) : subItem.href
            const resolvedUrl = resolveHref(Router, linkUrl)
            const currentSubitem = isActive(pathname, [
              resolvedUrl,
              `/de${resolvedUrl}`,
              `/en${resolvedUrl}`,
            ])
            return (
              <NavigationItem
                user={user}
                onOpenChange={onOpenChange}
                key={subItemIdx}
                mobile={mobile}
                item={subItem as LinkElement}
                className={cn(
                  currentSubitem ? "border-l-primary" : "",
                  "ml-4 rounded-none border-l-2 bg-transparent pl-4 text-foreground hover:border-l-primary/90 hover:bg-transparent hover:font-bold dark:bg-transparent dark:hover:bg-transparent",
                )}
              />
            )
          })}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function Navigation({
  mobile = false,
  onOpenChange,
  user,
}: {
  mobile?: boolean
  onOpenChange?: (open: boolean) => void
  user: AuthResponse["user"] | null
}) {
  return (
    <>
      {elements.map((item, itemIdx) => {
        const isHidden =
          typeof item.hidden === "function" ? item.hidden(user) : (item.hidden ?? false)

        if (isHidden) {
          return null
        }
        switch (item.type) {
          case "divider":
            return (
              <div
                key={itemIdx}
                data-orientation="horizontal"
                role="none"
                className="h-[1px] w-full shrink-0 bg-secondary"
              ></div>
            )

          case "navigation":
            return (
              <div
                className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
                key={itemIdx}
              >
                <nav className="group:justify-center group:px-2 grid gap-1 px-2">
                  {item.items.length > 0 &&
                    item.items.map((subItem, subItemIdx) => {
                      switch (subItem.type) {
                        case "link":
                          return (
                            <NavigationItem
                              key={`${itemIdx}-${subItemIdx}`}
                              item={subItem}
                              user={user}
                              mobile={mobile}
                              onOpenChange={onOpenChange}
                            />
                          )
                        case "collapsible":
                          return (
                            <CollapisbleItem
                              key={`${itemIdx}-${subItemIdx}`}
                              item={subItem}
                              user={user}
                              mobile={mobile}
                              onOpenChange={onOpenChange}
                            />
                          )
                        case "group":
                          return (
                            <div
                              key={`${itemIdx}-${subItemIdx}`}
                              className="ml-3 mt-4 text-xs font-semibold leading-6 text-gray-400 first:mt-0"
                            >
                              {subItem.name}
                            </div>
                          )
                        default:
                          return null
                      }
                    })}
                </nav>
              </div>
            )

          default:
            return null
        }
      })}
    </>
  )
}
