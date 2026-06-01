"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * DituTipoContenidoBlock — Figma 750:3361.
 *
 * Specs Figma exactas:
 *  - Container: h-[1078px], bg-gradient 115.78deg #7129D4 11.561% →
 *    #5F20DF 63.291% → #1E1446 101.84%
 *  - Sticker: w-[419px] h-[74.356px], Ditu Display Bold 48px/lh-48,
 *    px-[8px] py-[6px], rounded-[8px], rotate(-1.97deg)
 *  - Heading: Ditu Display Bold 84px/lh-84 uppercase center white, 2 lines
 *  - Tabs row: gap-[32px] items-center, font 48px / lh-96 (lh-96 da extra
 *    vertical space). Activo = blanco, inactivo = #77eded cyan.
 *  - Tab dots (separators): size-[20px] circles cyan
 *  - Description: 22px Spline Sans white center, max-w 840 (1440-300×2)
 *  - Pagination dots: 3 dots size-[16px], gap-[16px] entre cada uno
 */

const CYAN = "#77EDED";
const NAVY_DARK = "#12082D";

interface ContentTab {
  label: string;
  description: string;
}

const TABS: ContentTab[] = [
  {
    label: "FAST",
    description:
      "Canales digitales con programación las 24 horas, especializados en temáticas específicas (cocina, películas de acción, series). Es la experiencia de la TV tradicional pero con contenido curado para nichos concretos.",
  },
  {
    label: "Simulcasts / en vivo",
    description:
      "Transmisión simultánea de la señal abierta y eventos en vivo. El usuario ve en streaming exactamente lo que está en pantalla, con la misma inmediatez que la TV tradicional.",
  },
  {
    label: "VOD / Catchup",
    description:
      "Biblioteca de contenido on-demand: novelas, series y producciones de Caracol disponibles cuando el usuario quiera. La libertad de elegir qué ver y cuándo.",
  },
];

export interface DituTipoContenidoProps {
  anchorId?: string;
}

export function DituTipoContenidoBlock({
  anchorId = "tipo-contenido",
  /** Intervalo de autoplay en ms. Default 5000 (5s). */
  autoplayInterval = 5000,
}: DituTipoContenidoProps & { autoplayInterval?: number }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const tab = TABS[activeTab]!;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Autoplay (spec Camilo): avanza automáticamente entre los 3 tabs.
  //     Pausa al hover en desktop (vía isPaused state, set por onMouseEnter/Leave). ---
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % TABS.length);
    }, autoplayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, autoplayInterval]);

  // Manual click reinicia el ciclo de autoplay para evitar saltos confusos.
  const handleTabClick = (idx: number) => {
    setActiveTab(idx);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      // El useEffect re-arma el interval en el siguiente render.
    }
  };

  return (
    <section
      id={anchorId}
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        // Figma: stops 11.561% / 63.291% / 101.84%
        background:
          "linear-gradient(115.78deg, #7129D4 11.561%, #5F20DF 63.291%, #1E1446 101.84%)",
      }}
    >
      {/* Wave de transición — Figma 803:3486: misma silueta cityscape que el
          wave del ADN, posicionada arriba del bloque (top≈-362px en Figma).
          scaleY(-1) voltea el PNG para que las shapes apunten HACIA ABAJO
          (desde el ADN oscuro hacia el fondo violeta de TipoContenido).
          mix-blend-mode:multiply hace el fondo blanco del PNG transparente. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/ditu/wave-hablamos-bottom.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 hidden w-full object-fill lg:block"
        style={{ height: "131px", transform: "scaleY(-1)", mixBlendMode: "multiply" }}
      />

      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-[9px] px-6 py-24 sm:px-12 sm:py-32 lg:px-[120px] lg:py-[180px]">
        {/* Sticker — Figma 750:2722. Texto literal: "tipo de contenido"
            (Figma sin uppercase explícito en p, pero usa `uppercase` class
            así que el render es UPPERCASE; mismo aquí). */}
        <div
          className="inline-flex items-center rounded-[8px] px-[8px] py-[6px]"
          style={{
            backgroundColor: CYAN,
            color: NAVY_DARK,
            transform: "rotate(-1.97deg)",
          }}
        >
          <p
            className="font-display text-[24px] font-bold whitespace-nowrap uppercase sm:text-[36px] lg:text-[48px]"
            style={{ lineHeight: 1 }}
          >
            tipo de contenido
          </p>
        </div>

        {/* Heading — Figma 650:7351: 84/lh-84, blanco, 2 lines como <p> */}
        <h2
          className="font-display text-center text-[36px] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]"
          style={{ lineHeight: 1 }}
        >
          <span className="block">Tres formas de</span>
          <span className="block">habitar la pantalla.</span>
        </h2>

        {/* Tabs row — Figma 750:2738: gap-[32px], items-center.
            Font lh-96 (2× font-size) da espacio vertical extra. */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 lg:gap-x-[32px]">
          {TABS.map((t, idx) => (
            <div key={t.label} className="flex items-center gap-4 lg:gap-[32px]">
              {idx > 0 ? (
                // Separator dot — Figma 750:2743/2741: size-[20px] cyan circle
                <span
                  className="inline-block h-3 w-3 rounded-full lg:h-[20px] lg:w-[20px]"
                  style={{ backgroundColor: CYAN }}
                  aria-hidden="true"
                />
              ) : null}
              <button
                type="button"
                onClick={() => handleTabClick(idx)}
                className="font-display text-[24px] font-bold whitespace-nowrap uppercase transition-colors sm:text-[36px] lg:text-[48px]"
                style={{
                  color: idx === activeTab ? "#FFFFFF" : CYAN,
                  // Figma usa lh-96 (= 2× font-size) para crear vertical space
                  // entre tabs row y description.
                  lineHeight: "2",
                }}
              >
                {t.label}
              </button>
            </div>
          ))}
        </div>

        {/* Description — Figma 750:2719: Spline Sans 22px lh normal center white,
            max-w-[840px] (= 1440 - 2×300px).
            Wrapped en AnimatePresence para fade-in 300ms al cambiar tab. */}
        <div className="flex min-h-[100px] w-full max-w-[840px] items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full text-center text-[16px] text-white sm:text-[20px] lg:text-[22px]"
              style={{
                fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                lineHeight: "normal",
              }}
            >
              {tab.description}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Pagination dots — Figma 750:2859: 3 dots size-[16px], gap-[16px].
            Activa = filled cyan, inactiva = outline cyan. */}
        <div className="mt-8 flex items-center gap-[16px]">
          {TABS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              aria-label={`Tab ${idx + 1}`}
              className="h-3 w-3 rounded-full transition-all lg:h-[16px] lg:w-[16px]"
              style={{
                backgroundColor: idx === activeTab ? CYAN : "transparent",
                border: `1.5px solid ${CYAN}`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
