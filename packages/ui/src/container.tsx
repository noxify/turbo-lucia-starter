import React from "react"

import { cn } from "@acme/ui"

const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className }, ref) => (
    <div className="container gap-6" ref={ref}>
      <div className={cn("pb-8 pt-6", className)}>{children}</div>
    </div>
  ),
)
Container.displayName = "Container"

export { Container }
