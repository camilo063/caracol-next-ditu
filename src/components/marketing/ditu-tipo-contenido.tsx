"use client";

import { useState } from "react";

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
}: DituTipoContenidoProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tab = TABS[activeTab]!;

  return (
    <section
      id={anchorId}
      className="relative w-full overflow-hidden"
      style={{
        // Figma: stops 11.561% / 63.291% / 101.84%
        background:
          "linear-gradient(115.78deg, #7129D4 11.561%, #5F20DF 63.291%, #1E1446 101.84%)",
      }}
    >
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
                onClick={() => setActiveTab(idx)}
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
            max-w-[840px] (= 1440 - 2×300px). */}
        <p
          className="max-w-[840px] text-center text-[16px] text-white sm:text-[20px] lg:text-[22px]"
          style={{
            fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
            lineHeight: "normal",
          }}
        >
          {tab.description}
        </p>

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
