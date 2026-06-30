import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Skeleton — placeholder de carga. Útil para suspense en bloques que cargan datos.
 */
const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-muted animate-pulse rounded-md", className)}
        aria-hidden="true"
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
