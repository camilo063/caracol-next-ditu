"use client";

import { useState } from "react";

import { BrandLogoBadge } from "@/components/marketing/brand-logo-badge";

/**
 * DituCanalesBlock — Figma 756:7691.
 *
 * Estructura:
 *  - Sticker "Nuestros canales" + heading "Cada audiencia tiene su espacio."
 *  - 3 tabs: EN VIVO · FAST · ALIADOS
 *  - Grid de cards de canales (logo + descripción)
 *  - Mascot decorativo
 */

const CYAN = "#77EDED";
const NAVY_DARK = "#12082D";

type TabKey = "envivo" | "fast" | "aliados";

interface ChannelCard {
  brand: string;
  label: string;
  description: string;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "envivo", label: "EN VIVO" },
  { key: "fast", label: "FAST" },
  { key: "aliados", label: "ALIADOS" },
];

const CHANNELS_BY_TAB: Record<TabKey, ChannelCard[]> = {
  envivo: [
    {
      brand: "caracol-tv",
      label: "Caracol Televisión",
      description: "Canal nacional principal con cobertura del 99% del país.",
    },
    {
      brand: "la-kalle",
      label: "La Kalle",
      description: "Programación urbana, música y entretenimiento.",
    },
    {
      brand: "negocios-ditu",
      label: "Negocios Ditu",
      description: "Contenido especializado en negocios y economía.",
    },
    {
      brand: "blu",
      label: "Blu",
      description: "Información en vivo con análisis y opinión.",
    },
    {
      brand: "caracol-sports",
      label: "Caracol Sports",
      description: "El mejor deporte nacional e internacional.",
    },
  ],
  fast: [
    {
      brand: "caracol-tv",
      label: "Caracol FAST",
      description: "Programación curada 24/7 de novelas y series.",
    },
    {
      brand: "caracol-sports",
      label: "Sports FAST",
      description: "Deportes en formato FAST sin pausas.",
    },
  ],
  aliados: [
    {
      brand: "caracol-tv",
      label: "Eventos Caracol en vivo",
      description: "Cobertura de eventos especiales premium.",
    },
    {
      brand: "caracol-tv",
      label: "A otro Nivel",
      description: "Producciones especiales del grupo Caracol.",
    },
  ],
};

export interface DituCanalesProps {
  anchorId?: string;
}

export function DituCanalesBlock({ anchorId = "canales" }: DituCanalesProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("envivo");
  const channels = CHANNELS_BY_TAB[activeTab];

  return (
    <section
      id={anchorId}
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #1E1446 0%, #12082D 50%, #1E1446 100%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 py-24 sm:gap-12 sm:px-12 sm:py-32 lg:px-[120px] lg:py-[180px]">
        {/* Top: sticker + heading + tabs */}
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-3">
            <div
              className="inline-flex w-fit items-center rounded-[8px] px-2 py-1.5"
              style={{
                backgroundColor: CYAN,
                color: NAVY_DARK,
                transform: "rotate(-1.97deg)",
              }}
            >
              <p className="font-display text-[20px] leading-[1] font-bold whitespace-nowrap uppercase sm:text-[32px] lg:text-[40px]">
                Nuestros canales
              </p>
            </div>
            <h2 className="font-display text-[36px] leading-[1] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]">
              Cada audiencia tiene
              <br />
              su espacio.
            </h2>
            <p
              className="max-w-[460px] text-[15px] text-white sm:text-[16px]"
              style={{
                fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              }}
            >
              La tuya está esperando por verte.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className="font-display rounded-[8px] px-4 py-2 text-[14px] leading-[1] font-bold whitespace-nowrap uppercase transition-colors sm:text-[16px] lg:text-[18px]"
                style={{
                  backgroundColor: activeTab === t.key ? CYAN : "transparent",
                  color: activeTab === t.key ? NAVY_DARK : "#FFFFFF",
                  border: `1.5px solid ${CYAN}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de canales */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {channels.map((ch) => (
            <article
              key={ch.label}
              className="flex flex-col gap-4 rounded-[16px] border p-5 lg:p-6"
              style={{
                borderColor: "rgba(119,237,237,0.3)",
                backgroundColor: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex h-[60px] items-center">
                <BrandLogoBadge brand={ch.brand} size="md" />
              </div>
              <div>
                <h3 className="font-display text-[18px] leading-[1.1] font-bold text-white uppercase lg:text-[20px]">
                  {ch.label}
                </h3>
                <p
                  className="mt-2 text-[14px] leading-snug text-white/80 sm:text-[15px]"
                  style={{
                    fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                  }}
                >
                  {ch.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
