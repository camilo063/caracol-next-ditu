"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "framer-motion";

export interface CountUpProps {
  value: number;
  /** Duración total en segundos. Default 2.4s. */
  duration?: number;
  format?: (v: number) => string;
  locale?: string;
  rootMargin?: string;
  className?: string;
  /**
   * Reserva el ancho del valor final desde el inicio con texto invisible,
   * evitando saltos de layout mientras el número crece.
   */
  reserveWidth?: boolean;
}

/**
 * CountUp — efecto odómetro digital.
 *
 * Los números cambian en ticks discretos a intervalo fijo (≈60ms),
 * con ease-out cubico: ticks rápidos al inicio, lentos al final.
 * Simula un marcador o reloj digital que "cae" hacia el valor final.
 */
export function CountUp({
  value,
  duration = 2.4,
  format,
  locale = "es-CO",
  rootMargin = "0px 0px -80px 0px",
  className,
  reserveWidth = false,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
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

    // Un tick cada ~60ms → ~16 ticks/s (sensación de display digital)
    const TICK_MS = 60;
    const totalSteps = Math.round((duration * 1000) / TICK_MS);
    let step = 0;

    const finalRounded = Math.round(value);

    const timer = setInterval(() => {
      step++;
      const t = step / totalSteps;
      const eased = 1 - Math.pow(1 - t, 3);
      const next = value * eased;

      setCurrent(next);

      // Para en cuanto el valor redondeado ya alcanzó el final,
      // evitando ticks "congelados" donde el display no cambia.
      if (step >= totalSteps || Math.round(next) >= finalRounded) {
        clearInterval(timer);
        setCurrent(value);
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [inView, value, duration, reduced]);

  const display = format?.(current) ?? Math.round(current).toLocaleString(locale);
  const finalDisplay = format?.(value) ?? Math.round(value).toLocaleString(locale);

  if (reserveWidth) {
    return (
      <span
        ref={ref}
        className={`relative inline-block ${className ?? ""}`}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        <span aria-hidden="true" className="invisible">
          {finalDisplay}
        </span>
        <span className="absolute inset-0 flex items-center justify-end">{display}</span>
      </span>
    );
  }

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {display}
    </span>
  );
}
