import type { ReactNode } from "react"
import slugify from "@sindresorhus/slugify"

import { cn } from "@acme/ui"

import { Label } from "./label"

export type DescriptionListItem =
  | {
      id?: string
      label: string
      content: ReactNode
      type: "element"
    }
  | {
      id?: string
      label?: never
      content?: never
      type: "row"
      force?: boolean
      items: Omit<DescriptionListItem, "items" | "type">[]
    }

export const DescriptionList = ({
  items,
  force = false,
  className,
  itemClassName,
}: {
  force?: boolean
  items: DescriptionListItem[]
  className?: string
  itemClassName?: string
}) => {
  return (
    <dl
      className={cn(
        `grid gap-y-4`,
        force ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2",
        className,
      )}
    >
      {items.flatMap((item, index) => {
        if (item.type == "element") {
          return (
            <div className={cn(force ? "col-span-2" : "sm:col-span-2", itemClassName)} key={index}>
              <dt className="text-sm font-medium leading-6">
                <Label htmlFor={slugify(item.id ?? item.label)}>{item.label}</Label>
              </dt>
              <dd className="text-sm leading-6" id={slugify(item.id ?? item.label)}>
                {item.content}
              </dd>
            </div>
          )
        }

        return item.items.map((subitem, subindex) => {
          return (
            <div
              className={cn(
                force && item.force !== false ? "col-span-1" : "col-span-full sm:col-span-1",
              )}
              key={`${index}-${subindex}`}
            >
              <dt className="text-sm font-medium leading-6">
                <Label htmlFor={slugify(subitem.id ?? subitem.label ?? `${index}-${subindex}`)}>
                  {subitem.label}
                </Label>
              </dt>
              <dd
                className="text-sm leading-6"
                id={slugify(subitem.id ?? subitem.label ?? `${index}-${subindex}`)}
              >
                {subitem.content}
              </dd>
            </div>
          )
        })
      })}
    </dl>
  )
}
