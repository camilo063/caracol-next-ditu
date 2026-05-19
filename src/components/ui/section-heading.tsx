import * as React from "react";

import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";

/**
 * SectionHeading — patrón recurrente eyebrow + title + description.
 * Eyebrow usa `.text-fluid-tag` (12 → 14px) y description `.text-fluid-body`
 * (14 → 18px) — clamp para escalar fluidamente hasta 1440px.
 */
type SectionHeadingBaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title">;

export interface SectionHeadingProps extends SectionHeadingBaseProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  titleLevel?: "display" | "h1" | "h2" | "h3";
  titleAs?: "h1" | "h2" | "h3" | "h4";
}

const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(
  (
    {
      eyebrow,
      title,
      description,
      align = "left",
      titleLevel = "h2",
      titleAs,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-4",
          align === "center" ? "items-center text-center" : "items-start text-left",
          className,
        )}
        {...props}
      >
        {eyebrow ? (
          <p className="text-fluid-tag text-primary font-bold tracking-[0.18em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <Heading level={titleLevel} as={titleAs} align={align}>
          {title}
        </Heading>
        {description ? (
          <p
            className={cn(
              "text-fluid-body text-muted-foreground max-w-3xl leading-relaxed",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    );
  },
);
SectionHeading.displayName = "SectionHeading";

export { SectionHeading };
