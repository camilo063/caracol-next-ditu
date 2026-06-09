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
      className="relative w-full overflow-hidden py-[84px]"
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
          className="font-display w-full max-w-[720px] text-[42px] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]"
          style={{ lineHeight: 1 }}
        >
          <span className="inline">Cada audiencia tiene</span>
          <span className="inline" style={{ color: CYAN }}>
            {" "}
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

        {/* Tabs — centrado en mobile, alineado a la derecha en desktop */}
        <div className="relative mt-4 flex w-full flex-col items-center sm:items-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ditu/icons/action-icon.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none -top-[169px] -mr-[18px] -mb-[18px] w-[100px] sm:-mr-[20px] sm:-mb-[20px] sm:w-[120px] lg:absolute lg:mr-0 lg:mb-2 lg:h-[197px] lg:w-[100px] lg:w-[173px]"
          />
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
                  className="font-display lg:min-w-none relative inline-flex min-w-[80px] cursor-pointer items-center justify-center rounded-[64px] px-[16px] py-[4px] text-[14px] whitespace-nowrap uppercase hover:opacity-90 sm:min-w-[100px] sm:text-[20px] lg:text-[24px]"
                  style={{
                    color: isActive ? NAVY_DARK : "#FFFFFF",
                    fontWeight: isActive ? 700 : 500,
                    lineHeight: "24px",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tab-active-pill"
                      className="absolute inset-0 rounded-[64px]"
                      style={{ backgroundColor: CYAN }}
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards grid: 1 col mobile → 2 cols sm → 3 cols desktop.
            min-h separado del py para que el alto no varíe entre tabs.
            Calculado por el tab más largo (envivo: 7 cards):
            - 1 col: 7×84 + 6×16 = 684px
            - 2 cols: 4×84 + 3×16 = 384px
            - 3 cols: 3×84 + 2×16 = 284px */}
        <div className="w-full py-8 lg:py-[48px]">
          <div className="min-h-[684px] sm:min-h-[384px] lg:min-h-[284px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3"
              >
                {channels.map((ch) => (
                  <ChannelCardComponent key={ch.id} channel={ch} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
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
            className="font-display ms:text-[20px] w-full text-[18px] text-white uppercase"
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

const BRAND_LOGO: Record<string, string> = {
  caracoltv: "/logos/logo - Caracol.svg",
  ditu: "/logos/logo - Caracol.svg",
  bluradio: "/logos/logo - Caracol.svg",
  lakalle: "/logos/logo - Caracol.svg",
  caracolsports: "/logos/logo - Caracol.svg",
  caracolmedios: "/logos/logo - Caracol.svg",
};

function BrandLogoPlaceholder({ name, brand }: { name: string; brand?: string }) {
  const logoSrc = brand
    ? (BRAND_LOGO[brand] ?? "/logos/logo - Caracol.svg")
    : "/logos/logo - Caracol.svg";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoSrc} alt={name} className="h-[40px] w-[52px] object-contain" />
  );
}
