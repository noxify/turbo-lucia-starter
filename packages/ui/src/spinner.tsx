import type { VariantProps } from "class-variance-authority"
import React from "react"
import { cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@acme/ui"

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      xs: "size-4",
      sm: "size-6",
      md: "size-8",
      lg: "size-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

interface SpinnerContentProps extends VariantProps<typeof loaderVariants> {
  className?: string
  children?: React.ReactNode
}

export function Spinner({ size, className }: SpinnerContentProps) {
  return <Loader2 className={cn(loaderVariants({ size }), className)} />
}
