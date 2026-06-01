"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

export interface CountUpProps {
  /** Valor final hacia el que se anima. */
  value: number;
  /** Duración en segundos. Default 2.4s (smooth easing). */
  duration?: number;
  /** Función de formato para cada frame (ej. formatCompact, formatNumber, % con decimales). */
  format?: (v: number) => string;
  /** Locale de fallback si no se pasa `format`. Default es-CO. */
  locale?: string;
  /** Margen del viewport para disparar la animación. */
  rootMargin?: string;
  /** className passthrough. */
  className?: string;
}

/**
 * CountUp — anima un número de 0 al valor final cuando entra al viewport.
 * - Usa Framer Motion `animate()` con onUpdate para actualizar el estado del componente.
 * - Dispara una sola vez (useInView once:true).
 * - Respeta `prefers-reduced-motion` → muestra el valor final sin animar.
 */
export function CountUp({
  value,
  duration = 2.4,
  format,
  locale = "es-CO",
  rootMargin = "0px 0px -80px 0px",
  className,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  // Cast: framer-motion v11 tipa `margin` como template literal; nuestro
  // valor sigue el mismo formato `<X>px <X>px <X>px <X>px`.
  const inView = useInView(ref, {
    once: true,
    margin: rootMargin as `${number}px ${number}px ${number}px ${number}px`,
  });
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (reduced) {
      setCurrent(value);
      return;
    }
    if (!inView) return;
    // Curva cubic-bezier "smooth": arranque lento, llega suavemente al final.
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setCurrent(latest),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced]);

  const display = format?.(current) ?? Math.round(current).toLocaleString(locale);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
