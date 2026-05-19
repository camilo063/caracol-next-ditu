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
  offset = 24,
  rootMargin = "0px 0px -120px 0px",
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
      viewport={{ once: true, margin: rootMargin }}
      transition={{ duration: 0.4, ease: "easeOut", delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
