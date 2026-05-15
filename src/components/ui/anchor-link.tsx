import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * AnchorLink — link a un ancla `#id` interno con smooth scroll y estado activo.
 * Pensado para el nav del header (Marcas / Audiencia / Momentos / Pauta / Contacto).
 *
 * Implementación: anchor `<a>` plain — Next no necesita Link para hashes.
 * El smooth scroll viene del CSS global (`html { scroll-behavior: smooth }`).
 */
export interface AnchorLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: `#${string}`;
}

const AnchorLink = React.forwardRef<HTMLAnchorElement, AnchorLinkProps>(
  ({ className, href, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          "text-foreground/80 hover:text-foreground focus-visible:ring-ring inline-flex items-center rounded-sm text-sm font-semibold tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          className,
        )}
        {...props}
      >
        {children}
      </a>
    );
  },
);
AnchorLink.displayName = "AnchorLink";

export { AnchorLink };
