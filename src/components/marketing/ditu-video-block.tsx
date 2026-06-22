"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";

import { getYouTubeEmbedUrl, getYouTubeThumb } from "@/lib/youtube";

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
  /** URL de YouTube — si está, se muestra el embed (poster + play → iframe). */
  youtubeUrl?: string;
}

export function DituVideoBlock({
  src,
  alt = "",
  anchorId,
  background = "linear-gradient(90deg, #1E0E4C 0%, #3A1A92 100%)",
  youtubeUrl,
}: DituVideoBlockProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // YouTube: el CMS pasa la URL; acá extraemos el embed y el thumbnail.
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
  // Poster del video: imagen subida → thumbnail de YouTube → placeholder.
  const posterUrl =
    src || getYouTubeThumb(youtubeUrl, "maxres") || "/ditu/video-block.png";
  // Fallback solo-imagen (sin YouTube).
  const imageSrc = src || "/ditu/video-block.png";
  const [playing, setPlaying] = useState(false);

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
        {embedUrl ? (
          /* YouTube: poster + play → iframe (patrón "lite", más liviano). */
          <div className="absolute inset-0 overflow-hidden rounded-[12px] bg-black">
            {playing ? (
              <iframe
                src={`${embedUrl}&autoplay=1`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={alt || "Video de YouTube"}
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Reproducir ${alt || "video"}`}
                className="group absolute inset-0 h-full w-full cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posterUrl}
                  alt={alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center transition-colors group-hover:bg-black/10">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-2xl transition-transform group-hover:scale-105">
                    <Play className="ml-1 h-7 w-7 fill-white text-white" />
                  </span>
                </span>
              </button>
            )}
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
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
        )}
      </motion.div>
    </section>
  );
}
