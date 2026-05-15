import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Heading — escala tipográfica unificada para títulos.
 * `as` controla el tag semántico (h1, h2…); `level` la escala visual.
 * Sincronizado con tokens Figma: display 64px, h1 56px, h2 40px, h3 32px, h4 24px.
 */
const headingVariants = cva("font-display font-black tracking-tight text-foreground", {
  variants: {
    level: {
      display:
        "text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-[clamp(3.5rem,6vw,4rem)]",
      h1: "text-4xl leading-[1.1] sm:text-5xl md:text-6xl",
      h2: "text-3xl leading-[1.15] sm:text-4xl md:text-[2.5rem]",
      h3: "text-2xl leading-tight sm:text-3xl md:text-[1.75rem]",
      h4: "text-xl leading-tight sm:text-2xl",
      h5: "text-lg font-extrabold leading-snug",
      h6: "text-base font-extrabold uppercase tracking-wide leading-snug",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      inverse: "text-white",
    },
  },
  defaultVariants: {
    level: "h2",
    align: "left",
    tone: "default",
  },
});

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: HeadingTag;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, align, tone, as, ...props }, ref) => {
    const Comp = (as ?? levelToTag(level)) as HeadingTag;
    return (
      <Comp
        ref={ref as React.Ref<HTMLHeadingElement>}
        className={cn(headingVariants({ level, align, tone, className }))}
        {...props}
      />
    );
  },
);
Heading.displayName = "Heading";

function levelToTag(level: HeadingProps["level"]): HeadingTag {
  switch (level) {
    case "display":
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    default:
      return "h2";
  }
}

export { Heading, headingVariants };
