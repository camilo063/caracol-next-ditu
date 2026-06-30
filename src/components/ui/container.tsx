import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Container — wrapper con ancho máximo + padding horizontal responsive.
 * Es el wrapper estándar de toda sección. Usa `size` para casos especiales
 * (hero ancho completo `xl`, columnas estrechas `sm`).
 */
const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      "2xl": "max-w-[1440px]",
      full: "max-w-none",
    },
  },
  defaultVariants: {
    size: "xl",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {
  as?: "div" | "section" | "article" | "header" | "footer" | "main" | "nav";
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, as: Comp = "div", ...props }, ref) => {
    return (
      <Comp ref={ref} className={cn(containerVariants({ size, className }))} {...props} />
    );
  },
);
Container.displayName = "Container";

export { Container, containerVariants };
