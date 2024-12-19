import type { FormatOptions } from "date-fns"
import React from "react"
import { format } from "date-fns"

export default function FormattedDate<DateType extends Date>({
  date,
  formatStr,
  options,
}: {
  date: string | number | DateType
  formatStr: string
  options?: FormatOptions
}) {
  const formattedDate = format(date, formatStr, options)
  return <p>{formattedDate}</p>
}
