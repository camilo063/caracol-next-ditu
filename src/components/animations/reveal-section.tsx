"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface RevealSectionProps {
  children: React.ReactNode;
  /** Delay opcional en ms para escalonar reveals contiguos. */
  delay?: number;
  /** Distancia inicial en px del slide-up. Default 40px. */
  offset?: number;
  /** Margin del viewport. */
  rootMargin?: string;
  className?: string;
}

/**
 * RevealSection — Opción B "premium editorial":
 * scale 0.97→1 + opacity 0→1 + slide-up sutil al entrar en viewport.
 * Duración 900ms, ease-out suave. Respeta prefers-reduced-motion.
 */
export function RevealSection({
  children,
  delay = 0,
  offset = 40,
  rootMargin = "0px 0px -8% 0px",
  className,
}: RevealSectionProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: offset, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: rootMargin, amount: 0.1 }}
      transition={{
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: delay / 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
