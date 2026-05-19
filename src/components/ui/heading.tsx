import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Heading — escala tipográfica fluida (clamp) calibrada a 1440px de diseño.
 * Min ↔ max según la spec del cliente:
 *   - display:   32px → 64px
 *   - h1:        28px → 56px
 *   - h2:        24px → 40px (subtítulos grandes)
 *   - h3:        20px → 32px (subtítulos)
 *   - h4:        18px → 24px
 *   - h5:        16px → 18px
 *   - h6:        14px → 16px (tags/eyebrows)
 *
 * Las fórmulas usan `clamp(min, base + slope·vw, max)` y se calibran para
 * tocar el max en ~1440px de viewport.
 */
const headingVariants = cva("font-display font-black tracking-tight text-foreground", {
  variants: {
    level: {
      display: "text-[clamp(2rem,1.3rem+3vw,4rem)] leading-[1.05]",
      h1: "text-[clamp(1.75rem,1.1rem+2.5vw,3.5rem)] leading-[1.1]",
      h2: "text-[clamp(1.5rem,1rem+2vw,2.5rem)] leading-[1.15]",
      h3: "text-[clamp(1.25rem,0.9rem+1.5vw,2rem)] leading-tight",
      h4: "text-[clamp(1.125rem,0.85rem+1vw,1.5rem)] leading-tight",
      h5: "text-[clamp(1rem,0.85rem+0.5vw,1.125rem)] font-extrabold leading-snug",
      h6: "text-[clamp(0.875rem,0.8rem+0.25vw,1rem)] font-extrabold uppercase tracking-wide leading-snug",
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
