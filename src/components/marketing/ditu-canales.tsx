"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * DituCanalesBlock — Figma 756:7691.
 *
 * Specs Figma exactos:
 *  - Container: bg-gradient 199.26deg #12082D 15.056% → #3B1A93 45.857% →
 *    #12082D 79.425%, py-[120px]
 *  - Inner wrapper: px-[120px] py-[64px] gap-[10px] items-start
 *  - Sticker: w-[419px] Ditu Display Bold 48/lh-48 px-8 py-6 rotate -1.97deg
 *  - Heading 84/lh-84: "Cada audiencia tiene" white + "su espacio." cyan
 *  - Subtitle: Spline Sans 22px white
 *  - Tabs pill (alineada a la derecha):
 *    · Container bg-rgba(255,255,255,0.2) border-white p-[8px] rounded-[54px]
 *    · Active: bg #77EDED Bold 24/24 navy #12082d px-16 py-4 rounded-64
 *    · Inactive: transparent Medium 24/24 white px-16 py-4 rounded-64
 *  - Cards grid: 3 cols × N rows, gap-[16px], py-[48px]
 *  - Card: h-[84px] rounded-[12px], outer violet #8232f0 border, inner #312163
 *    · Logo section: bg #12082d w-[119px] (logo area)
 *    · Name section: bg #312163 flex-1 px-[8px], Ditu Display Medium 20/28
 *      uppercase white
 *
 * Spec usuario (Camilo):
 *  - Click cambia tab con fade-in 300ms ease (Framer Motion AnimatePresence)
 *  - Mobile: grid 2 columnas (responsive)
 */

const CYAN = "#77EDED";
const NAVY_DARK = "#12082D";
const VIOLET = "#8232F0";
const VIOLET_MID = "#312163";

type TabKey = "envivo" | "fast" | "aliados";

interface ChannelCard {
  /** ID único para key. */
  id: string;
  /** Nombre del canal (mostrado en el panel derecho). */
  name: string;
  /** Slug del brand para mapear al logo (opcional). */
  brand?: string;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "envivo", label: "EN VIVO" },
  { key: "fast", label: "FAST" },
  { key: "aliados", label: "Aliados" },
];

const CHANNELS_BY_TAB: Record<TabKey, ChannelCard[]> = {
  envivo: [
    { id: "ctv", name: "caracol televisión", brand: "caracoltv" },
    { id: "blu", name: "blu", brand: "bluradio" },
    { id: "noticias", name: "noticias caracol en vivo", brand: "caracoltv" },
    { id: "lakalle", name: "la kalle", brand: "lakalle" },
    { id: "csports", name: "Caracol Sports", brand: "caracolsports" },
    { id: "aotronivel", name: "a otro nivel", brand: "caracolmedios" },
    { id: "negocios", name: "negocios ditu", brand: "ditu" },
  ],
  fast: [
    { id: "ctv-fast", name: "Caracol FAST", brand: "caracoltv" },
    { id: "sports-fast", name: "Sports FAST", brand: "caracolsports" },
  ],
  aliados: [
    { id: "eventos", name: "Eventos Caracol en vivo", brand: "caracoltv" },
    { id: "anivel", name: "A otro Nivel", brand: "caracolmedios" },
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
        // Figma 756:6921: 199.26deg, stops 15.056% / 45.857% / 79.425%
        background:
          "linear-gradient(199.26deg, #12082D 15.056%, #3B1A93 45.857%, #12082D 79.425%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[10px] px-6 py-12 sm:px-12 sm:py-16 lg:px-[120px] lg:py-[64px]">
        {/* Sticker — Figma 756:6665 */}
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
            Nuestros canales
          </p>
        </div>

        {/* Heading — Figma 756:6667: 2 lines, line 2 cyan */}
        <h2
          className="font-display text-[36px] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]"
          style={{ lineHeight: 1 }}
        >
          <span className="block">Cada audiencia tiene</span>
          <span className="block" style={{ color: CYAN }}>
            su espacio.
          </span>
        </h2>

        {/* Subtitle — Figma 756:6668: Spline Sans 22px white */}
        <p
          className="text-[16px] text-white sm:text-[20px] lg:text-[22px]"
          style={{
            fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
            lineHeight: "normal",
          }}
        >
          La tuya está esperando por verte.
        </p>

        {/* Tabs row — Figma 756:6669: justify-end */}
        <div className="mt-4 flex w-full justify-end">
          {/* Pill container — Figma 756:6670: bg-white/20 border-white
              gap-[10px] p-[8px] rounded-[54px] */}
          <div
            className="inline-flex items-start gap-[10px] overflow-clip rounded-[54px] border border-white p-[8px]"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            {TABS.map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className="font-display inline-flex items-center justify-center rounded-[64px] px-[16px] py-[4px] text-[14px] whitespace-nowrap uppercase transition-colors sm:text-[20px] lg:text-[24px]"
                  style={{
                    backgroundColor: isActive ? CYAN : "transparent",
                    color: isActive ? NAVY_DARK : "#FFFFFF",
                    // Active = Bold, inactive = Medium
                    fontWeight: isActive ? 700 : 500,
                    lineHeight: "24px",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards grid — Figma 756:6675: grid-cols-3 gap-[16px] py-[48px]
            Mobile (spec Camilo): 2 cols.
            Wrapped in AnimatePresence + motion.div para fade-in 300ms entre tabs. */}
        <div className="w-full py-8 lg:py-[48px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid grid-cols-2 gap-[16px] lg:grid-cols-3"
            >
              {channels.map((ch) => (
                <ChannelCardComponent key={ch.id} channel={ch} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/**
 * ChannelCardComponent — Figma 829:4881 (Card ads/calendar card).
 *
 * Estructura:
 *  - Outer: rounded-[12px] h-[84px], border violet #8232F0, bg violet #8232F0
 *  - Inner row: bg #312163 (violet medio), full width h-84, flex items-center
 *    - Logo cell: bg #12082d (navy oscuro) w-[119px], px-[16px] py-[8px]
 *    - Name cell: flex-1 px-[8px], Ditu Display Medium 20/28 uppercase white
 */
function ChannelCardComponent({ channel }: { channel: ChannelCard }) {
  return (
    <article
      className="flex h-[84px] overflow-clip rounded-[12px] border"
      style={{
        backgroundColor: VIOLET,
        borderColor: VIOLET,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="flex h-full w-full items-center"
        style={{ backgroundColor: VIOLET_MID }}
      >
        {/* Logo cell — bg navy oscuro, w-119, px-16 py-8 */}
        <div
          className="flex h-full w-[100px] shrink-0 items-center justify-center px-3 py-2 sm:w-[119px] sm:px-[16px] sm:py-[8px]"
          style={{ backgroundColor: NAVY_DARK }}
        >
          {/* Placeholder logo — brand label simple en color cyan accent.
              TODO: cuando Caracol entregue los logos finales de cada canal,
              reemplazar por SVGs reales. */}
          <BrandLogoPlaceholder name={channel.name} brand={channel.brand} />
        </div>
        {/* Name cell — Ditu Display Medium 20/28 uppercase white */}
        <div className="flex flex-1 flex-col items-start justify-center px-[8px]">
          <p
            className="font-display w-full text-[14px] text-white uppercase sm:text-[16px] lg:text-[20px]"
            style={{
              fontWeight: 500,
              lineHeight: "28px",
            }}
          >
            {channel.name}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * Placeholder visual del logo de canal — texto compacto sobre fondo oscuro.
 * Se reemplazará por SVGs reales cuando Caracol los entregue.
 */
function BrandLogoPlaceholder({ name, brand }: { name: string; brand?: string }) {
  // Genera iniciales para placeholder
  const initials = brand
    ? brand
        .replace(/[^a-z]/gi, "")
        .slice(0, 3)
        .toUpperCase()
    : name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

  return (
    <span
      className="font-display text-[12px] font-bold tracking-wide sm:text-[14px]"
      style={{ color: CYAN, lineHeight: 1 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
