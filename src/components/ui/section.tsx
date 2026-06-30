import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Section — wrapper semántico para secciones del landing.
 * - `id` se usa como ancla del header (#audiencia, #momentos, etc.).
 * - `tone` controla el fondo (default / muted / primary / dark / ditu).
 * - `padding` controla la altura vertical.
 */
const sectionVariants = cva("w-full", {
  variants: {
    tone: {
      default: "bg-background text-foreground",
      muted: "bg-muted text-foreground",
      primary: "bg-primary text-primary-foreground",
      dark: "bg-neutral-900 text-white",
      ditu: "theme-ditu bg-background text-foreground",
      "ditu-deep": "theme-ditu bg-[var(--color-brand-ditu-900)] text-white",
      transparent: "bg-transparent",
    },
    padding: {
      none: "py-0",
      sm: "py-12 md:py-16",
      md: "py-16 md:py-24",
      lg: "py-24 md:py-32",
      xl: "py-32 md:py-40",
    },
  },
  defaultVariants: {
    tone: "default",
    padding: "md",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {
  id?: string;
  as?: "section" | "div" | "article" | "header" | "footer";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, tone, padding, as = "section", ...props }, ref) => {
    return React.createElement(as, {
      ref,
      className: cn(sectionVariants({ tone, padding, className })),
      ...props,
    });
  },
);
Section.displayName = "Section";

export { Section, sectionVariants };
