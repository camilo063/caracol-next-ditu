"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface RevealSectionProps {
  children: React.ReactNode;
  /** Delay opcional en ms para escalonar reveals contiguos. */
  delay?: number;
  /** Distancia inicial en px del slide-up. Default 24px. */
  offset?: number;
  /** Margin del viewport (negativo = dispara antes de entrar 100%). */
  rootMargin?: string;
  className?: string;
}

/**
 * RevealSection — fade-in + slide-up sutil al entrar en viewport.
 * Spec: 400ms ease, slide de abajo hacia arriba.
 * Se mantiene en mobile (la spec lo pide).
 * Respeta `prefers-reduced-motion`.
 */
export function RevealSection({
  children,
  delay = 0,
  offset = 32,
  // Margen conservador: la animación dispara cuando el top del bloque ha
  // entrado al menos 80px dentro del viewport (no antes de que el usuario
  // realmente llegue al bloque vía scroll — fix bug "secciones aparecen
  // antes de que el usuario llegue a ellas").
  rootMargin = "0px 0px -10% 0px",
  className,
}: RevealSectionProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: rootMargin, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
