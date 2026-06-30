"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { useIsMobile } from "@/lib/hooks/use-media-query";

export interface ParallaxBackgroundProps {
  children: React.ReactNode;
  /**
   * Velocidad del parallax (0.3–0.5 según spec).
   * 0 = sin movimiento; 1 = se mueve a la par del scroll.
   */
  speed?: number;
  className?: string;
}

/**
 * ParallaxBackground — envuelve la imagen/video de fondo del Hero.
 * Cuando el usuario scrollea, el contenido se traslada verticalmente al
 * `speed` indicado para dar la ilusión de profundidad.
 *
 * - Desactivado en mobile (≤767px) por performance.
 * - Desactivado si el usuario tiene `prefers-reduced-motion`.
 */
export function ParallaxBackground({
  children,
  speed = 0.4,
  className,
}: ParallaxBackgroundProps) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  // Maps 0 → 800px de scroll a 0 → speed*800 de translateY.
  const y: MotionValue<number> = useTransform(scrollY, [0, 800], [0, 800 * speed]);

  if (reduced || isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
