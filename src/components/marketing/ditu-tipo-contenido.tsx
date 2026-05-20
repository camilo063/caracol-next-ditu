"use client";

import { useState } from "react";

/**
 * DituTipoContenidoBlock — Figma 750:3361.
 *
 * Estructura:
 *  - Bg gradient diagonal 115.78deg #7129D4 → #5F20DF → #1E1446
 *  - Sticker "tipo de contenido" + heading "Tres formas de habitar la pantalla."
 *  - 3 tabs (FAST · Simulcasts / en vivo · VOD / Catchup) en row con dots
 *  - Descripción del tab activo
 *  - 3 dot pagination indicators
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
        background:
          "linear-gradient(115.78deg, #7129D4 11.56%, #5F20DF 63.29%, #1E1446 101.84%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-9 px-6 py-24 sm:px-12 sm:py-32 lg:gap-[36px] lg:px-[120px] lg:py-[180px]">
        {/* Sticker */}
        <div
          className="inline-flex items-center rounded-[8px] px-2 py-1.5"
          style={{
            backgroundColor: CYAN,
            color: NAVY_DARK,
            transform: "rotate(-1.97deg)",
          }}
        >
          <p className="font-display text-[24px] leading-[1] font-bold whitespace-nowrap uppercase sm:text-[36px] lg:text-[48px]">
            tipo de contenido
          </p>
        </div>

        {/* Heading */}
        <h2 className="font-display text-center text-[36px] leading-[1.1] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]">
          Tres formas de
          <br />
          habitar la pantalla.
        </h2>

        {/* Tabs row */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 sm:gap-x-6 lg:gap-x-8">
          {TABS.map((t, idx) => (
            <div key={t.label} className="flex items-center gap-4 lg:gap-8">
              {idx > 0 ? (
                <span
                  className="inline-block h-3 w-3 rounded-full lg:h-5 lg:w-5"
                  style={{ backgroundColor: CYAN }}
                />
              ) : null}
              <button
                type="button"
                onClick={() => setActiveTab(idx)}
                className="font-display text-[24px] leading-[1] font-bold whitespace-nowrap uppercase transition-colors sm:text-[36px] lg:text-[48px]"
                style={{ color: idx === activeTab ? "#FFFFFF" : CYAN }}
              >
                {t.label}
              </button>
            </div>
          ))}
        </div>

        {/* Description */}
        <p
          className="max-w-[840px] text-center text-[16px] leading-relaxed text-white sm:text-[20px] lg:text-[22px]"
          style={{
            fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
          }}
        >
          {tab.description}
        </p>

        {/* Pagination dots */}
        <div className="flex items-center gap-3">
          {TABS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              aria-label={`Tab ${idx + 1}`}
              className="h-3 w-3 rounded-full transition-all lg:h-4 lg:w-4"
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
