import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Prose — wrapper para contenido rico (richText de Payload Lexical, descripciones
 * largas, listas, etc.). Aplica tipografía consistente con el brand.
 */
export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const sizeClass: Record<NonNullable<ProseProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const Prose = React.forwardRef<HTMLDivElement, ProseProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "text-foreground/90 max-w-prose leading-relaxed",
          sizeClass[size],
          // Typografía contextual para tags HTML que Lexical produce.
          "[&_h1]:font-display [&_h1]:mt-12 [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-black",
          "[&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-3xl [&_h2]:font-extrabold",
          "[&_h3]:font-display [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-2xl [&_h3]:font-extrabold",
          "[&_h4]:font-display [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-xl [&_h4]:font-bold",
          "[&_p]:my-4",
          "[&_a]:text-primary [&_a:hover]:text-primary/80 [&_a]:underline",
          "[&_strong]:font-bold",
          "[&_em]:italic",
          "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:my-1",
          "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:my-1",
          "[&_blockquote]:border-primary [&_blockquote]:text-muted-foreground [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic",
          "[&_code]:bg-muted [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm",
          "[&_hr]:border-border [&_hr]:my-8",
          className,
        )}
        {...props}
      />
    );
  },
);
Prose.displayName = "Prose";

export { Prose };
