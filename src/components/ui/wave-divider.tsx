import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * WaveDivider — SVG decorativo con onda.
 * Pensado para el footer Ditu ("Footer con onda — referencia de tono del Wix actual").
 * Sirve para insertar entre secciones cuando se quiera transición orgánica.
 */
export interface WaveDividerProps extends React.SVGProps<SVGSVGElement> {
  position?: "top" | "bottom";
  /** Color del fill (CSS color o var(--token)). Por defecto currentColor. */
  fill?: string;
  /** Amplitud relativa de la onda (1 = default). */
  amplitude?: number;
}

const WaveDivider = React.forwardRef<SVGSVGElement, WaveDividerProps>(
  (
    { position = "bottom", fill = "currentColor", amplitude = 1, className, ...props },
    ref,
  ) => {
    const a = Math.max(0.3, Math.min(2, amplitude));
    const height = 80 * a;
    const path = `M0,${height * 0.5} C${360 * 0.5},${height * 1.2} ${720 * 0.5},0 1440,${height * 0.5} L1440,${height} L0,${height} Z`;
    return (
      <svg
        ref={ref}
        viewBox={`0 0 1440 ${height}`}
        preserveAspectRatio="none"
        className={cn(
          "pointer-events-none block w-full",
          position === "top" ? "rotate-180" : "",
          className,
        )}
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        <path d={path} fill={fill} />
      </svg>
    );
  },
);
WaveDivider.displayName = "WaveDivider";

export { WaveDivider };
