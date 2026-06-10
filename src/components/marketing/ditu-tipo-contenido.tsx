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
  tabs?: ContentTab[];
}

export function DituTipoContenidoBlock({
  anchorId = "tipo-contenido",
  tabs: tabsProp,
  /** Intervalo de autoplay en ms. Default 5000 (5s). */
  autoplayInterval = 5000,
}: DituTipoContenidoProps & { autoplayInterval?: number }) {
  const finalTabs = tabsProp && tabsProp.length > 0 ? tabsProp : TABS;
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const tab = finalTabs[activeTab]!;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // --- Autoplay (spec Camilo): avanza automáticamente entre los 3 tabs.
  //     Pausa al hover en desktop (vía isPaused state, set por onMouseEnter/Leave). ---
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % finalTabs.length);
    }, autoplayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, autoplayInterval, resetKey, finalTabs]);

  // Scroll activo centrado en el contenedor de tabs (mobile).
  useEffect(() => {
    const container = tabsContainerRef.current;
    const btn = tabRefs.current[activeTab];
    if (!container || !btn) return;
    const containerCenter = container.offsetWidth / 2;
    const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
    container.scrollTo({ left: btnCenter - containerCenter, behavior: "smooth" });
  }, [activeTab]);

  // Manual click reinicia el ciclo de autoplay para evitar saltos confusos.
  const handleTabClick = (idx: number) => {
    setActiveTab(idx);
    setResetKey((k) => k + 1);
  };

  return (
    <section
      id={anchorId}
      className="relative w-full overflow-hidden lg:flex lg:h-screen lg:max-h-[1080px] lg:items-center lg:justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        // Figma: stops 11.561% / 63.291% / 101.84%
        background:
          "linear-gradient(115.78deg, #7129D4 11.561%, #5F20DF 63.291%, #1E1446 101.84%)",
      }}
    >
      {/* bg-up estático en la parte superior — mismas características que ADN
          pero en posición static (flujo normal), empuja el contenido hacia abajo. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/ditu/icons/picos-down.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none w-full object-contain lg:absolute lg:top-0 lg:left-0"
      />

      <div className="mx-auto flex max-w-360 flex-col items-center gap-2.25 py-24 sm:px-12 sm:pb-32 lg:px-[120px] lg:pt-[220px] lg:pb-[180px]">
        {/* Micro icon encima del sticker */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ditu/icons/micro-icon.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none -mb-2 w-[110px] w-[120px] lg:w-[151px]"
        />
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
          className="font-display mb-2 text-center text-[42px] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]"
          style={{ lineHeight: 1 }}
        >
          <span className="block">Tres formas de</span>
          <span className="block">habitar la pantalla</span>
        </h2>

        {/* Tabs row — Figma 750:2738: gap-[32px], items-center.
            Font lh-96 (2× font-size) da espacio vertical extra. */}
        <div
          ref={tabsContainerRef}
          className="flex w-full scrollbar-none items-center overflow-x-auto scroll-smooth px-4 sm:justify-center lg:w-auto lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
          style={{ gap: "1rem" }}
        >
          {finalTabs.map((t, idx) => (
            <div key={t.label} className="flex items-center gap-4 lg:gap-[32px]">
              {idx > 0 ? (
                // Separator dot — Figma 750:2743/2741: size-[20px] cyan circle
                <span
                  className="inline-block h-3 w-3 rounded-full lg:h-[20px] lg:w-[20px]"
                  style={{ backgroundColor: `${NAVY_DARK}99` }}
                  aria-hidden="true"
                />
              ) : null}
              <motion.button
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => handleTabClick(idx)}
                whileHover={idx !== activeTab ? { scale: 1.06 } : {}}
                whileTap={idx !== activeTab ? { scale: 0.97 } : {}}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="font-display cursor-pointer text-[24px] font-bold whitespace-nowrap uppercase transition-colors sm:text-[36px] lg:text-[48px]"
                style={{
                  color: idx === activeTab ? "#FFFFFF" : "#77EDED",
                  lineHeight: "2",
                  transformOrigin: "center",
                }}
              >
                {t.label}
              </motion.button>
            </div>
          ))}
        </div>

        {/* Description — Figma 750:2719: Spline Sans 22px lh normal center white,
            max-w-[840px] (= 1440 - 2×300px).
            Wrapped en AnimatePresence para fade-in 300ms al cambiar tab. */}
        <div className="flex min-h-[100px] w-full max-w-[840px] items-center justify-center px-[24px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={activeTab}
              initial={{ opacity: 0, x: 40, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
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
          {finalTabs.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              aria-label={`Tab ${idx + 1}`}
              className="h-3 w-3 rounded-full transition-all lg:h-[16px] lg:w-[16px]"
              style={{
                backgroundColor: idx === activeTab ? "#FFFFFF" : `${CYAN}99`,
                border: "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
