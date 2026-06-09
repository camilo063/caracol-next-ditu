"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * DituVideoBlock — fullwidth video/image showcase, Figma 512:2244.
 *
 * Specs Figma:
 *  - Container: bg-gradient-to-b from #291763 (0%) via #32197b (25.483%)
 *    to #3b1a93 (100.01%).
 *  - Image wrapper: aspect-[507/285] (1.778:1), rounded-[12px], full width.
 *  - Image cropped via offsets: w-[139.45%] h-[1437.19%] top-[-414.39%]
 *    left-[-19.72%].
 *
 * Spec usuario (Camilo) — Video fullscreen:
 *  - El video inicia en tamaño REDUCIDO (scale 0.6)
 *  - Al hacer scroll hacia la sección escala progresivamente hasta 100% viewport
 *  - Una vez llega al 100% queda FIJO — no regresa al tamaño reducido (clamp)
 *  - Librería: Framer Motion — useScroll + useTransform
 *  - Transición suave ligada al scroll
 *
 * NOTA: el `<img>` raw se usa en vez de next/image porque necesitamos el crop
 * exacto del Figma con percentages negativos absolutos.
 */
export interface DituVideoBlockProps {
  /** Imagen/video del bloque (default: /ditu/video-block.png). */
  src?: string;
  alt?: string;
  /** Anchor ID opcional para navegación. */
  anchorId?: string;
  /** Override del fondo CSS. */
  background?: string;
}

export function DituVideoBlock({
  src = "/ditu/video-block.png",
  alt = "",
  anchorId,
  background = "linear-gradient(90deg, #1E0E4C 0%, #3A1A92 100%)",
}: DituVideoBlockProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Mobile: sin animación de scroll (< 768px).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <section
      ref={containerRef}
      id={anchorId}
      className="relative -mt-1 flex w-full flex-col items-center justify-center overflow-hidden"
      style={{ background }}
    >
      {/* Video wrapper — scale animado vía Framer Motion useScroll/useTransform.
          En reduced-motion: scale fijo a 1. */}
      <motion.div
        className="relative aspect-[507/285] w-full shrink-0 rounded-[12px]"
        style={{
          scale: reduceMotion || isMobile ? 1 : scale,
          transformOrigin: "center center",
        }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="absolute block"
            style={{
              width: "139.45%",
              height: "1437.19%",
              top: "-414.39%",
              left: "-19.72%",
              maxWidth: "none",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
