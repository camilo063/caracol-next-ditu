"use client";

import Image from "next/image";

import { CountUp } from "@/components/animations";

/**
 * DituAdnBlock — Figma 747:2597 (ADN Ditu, Sabemos a quién le hablas).
 *
 * Estructura:
 *  1. Sticker "ADN DITU" + heading "**Sabemos** a quién le hablas."
 *  2. 2 cards: Género (52% hombres, donut) + Edad pico (bar chart con peak)
 *  3. Heading "y dónde **encontrarlo**" + descripción NSE
 *  4. 4 cards NSE: Estrato 1 o 2 | Estrato 3 (gradient highlight) | 4 | 5 o 6
 *  5. Fuente
 *
 * Tokens:
 *  - #77EDED Cyan accent
 *  - #8232F0 Violeta (peak bar + estrato 3)
 *  - #561BDB Violeta medio
 *  - #12082D Violeta oscuro
 *  - Gradient bg: 175.3deg #12082D 10% → #291266 48% → #12082D 85%
 */

const CYAN = "#77EDED";
const VIOLET = "#8232F0";
const VIOLET_MED = "#561BDB";
const NAVY_DARK = "#12082D";

/**
 * AGE_BARS — alturas visibles del Rectangle 46 en Figma 747:2627.
 *
 * Estructura Figma: container `h-[77/99/114/77/N/93px] flex-col gap-2 justify-end`,
 * con bar `flex-1` (no-peak) o `h-[148px] shrink-0` (peak).
 * Visible bar height = container - label(17) - gap(2):
 *  - 18-24: 77 - 19 = 58
 *  - 25-34: 99 - 19 = 80
 *  - 35-44: 114 - 19 = 95
 *  - 45-54: 77 - 19 = 58
 *  - 55-64 PEAK: 148 (bg #8232F0, fijo)
 *  - +65: 93 - 19 = 74
 */
const AGE_BARS = [
  { label: "18-24", height: 58, peak: false },
  { label: "25-34", height: 80, peak: false },
  { label: "35-44", height: 95, peak: false },
  { label: "45-54", height: 58, peak: false },
  { label: "55-64", height: 148, peak: true },
  { label: "+65", height: 74, peak: false },
];

const NSE_CARDS = [
  { label: "ESTRATO 1 o 2", value: 22.7, big: false },
  { label: "ESTRATO 3", value: 37.8, big: true },
  { label: "ESTRATO 4", value: 28.9, big: false },
  { label: "ESTRATO 5 o 6", value: 10.6, big: false },
];

export interface DituAdnProps {
  anchorId?: string;
}

export function DituAdnBlock({ anchorId = "adn" }: DituAdnProps) {
  return (
    <section
      id={anchorId}
      className="relative w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(175.32deg, #12082D 9.84%, #291266 47.99%, #12082D 85.01%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-6 pt-16 pb-24 sm:gap-16 sm:px-12 sm:pb-32 lg:gap-[64px] lg:px-[120px] lg:pb-[180px]">
        {/* Heading */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="inline-flex items-center rounded-[8px] px-2 py-1.5"
            style={{
              backgroundColor: CYAN,
              color: NAVY_DARK,
              transform: "rotate(-1.97deg)",
            }}
          >
            <p className="font-display text-[24px] leading-[1] font-bold whitespace-nowrap uppercase sm:text-[36px] lg:text-[48px]">
              ADN DITU
            </p>
          </div>
          <h2 className="font-display text-center text-[36px] leading-[1] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]">
            <span style={{ color: CYAN }}>Sabemos</span> a quién le hablas.
          </h2>
        </div>

        {/* 2 cards: Género + Edad */}
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[455fr_713fr] lg:gap-8">
          {/* Card Género */}
          <article className="flex flex-col items-start gap-2 rounded-[16px] border border-white p-6 sm:p-8 lg:p-[40px]">
            <div className="flex items-center gap-2 self-end">
              <Image
                src="/ditu/icon-male.svg"
                alt=""
                width={30}
                height={30}
                className="h-7 w-7 lg:h-[30px] lg:w-[30px]"
              />
              <span
                className="font-display inline-flex items-center rounded-[4px] px-3 py-1 text-[14px] leading-[1] font-medium whitespace-nowrap uppercase sm:text-[16px] lg:text-[18px]"
                style={{ backgroundColor: CYAN, color: NAVY_DARK }}
              >
                Género
              </span>
            </div>
            <p
              className="text-[16px] text-white"
              style={{
                fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              }}
            >
              52% nos prefieren
            </p>

            {/* Donut visual con porcentajes */}
            <div className="mt-4 flex w-full items-center justify-center gap-4">
              {/* 52% Hombres */}
              <div className="flex flex-col items-center gap-1">
                <p className="font-display text-[36px] leading-[1] font-medium text-white sm:text-[47px]">
                  52%
                </p>
                <span
                  className="font-display inline-flex items-center rounded-[4px] px-2 py-1 text-[14px] leading-[1] font-medium whitespace-nowrap uppercase sm:text-[16px]"
                  style={{ backgroundColor: CYAN, color: NAVY_DARK }}
                >
                  Hombres
                </span>
              </div>

              {/* Donut SVG */}
              <div className="relative h-[140px] w-[140px] shrink-0 sm:h-[186px] sm:w-[186px]">
                <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={VIOLET_MED}
                    strokeWidth="40"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={CYAN}
                    strokeWidth="40"
                    strokeDasharray={`${0.52 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                  />
                </svg>
              </div>

              {/* 48% Mujeres */}
              <div className="flex flex-col items-center gap-1">
                <p className="font-display text-[36px] leading-[1] font-medium text-white sm:text-[47px]">
                  48%
                </p>
                <span
                  className="font-display inline-flex items-center rounded-[4px] px-2 py-1 text-[14px] leading-[1] font-medium whitespace-nowrap text-white uppercase sm:text-[16px]"
                  style={{ backgroundColor: VIOLET_MED }}
                >
                  Mujeres
                </span>
              </div>
            </div>
          </article>

          {/* Card Edad pico */}
          <article className="flex flex-col items-start gap-2 rounded-[16px] border border-white p-6 sm:p-8 lg:p-[40px]">
            <div className="flex items-center gap-2 self-end">
              <Image
                src="/ditu/icon-cake.svg"
                alt=""
                width={21}
                height={25}
                className="h-5 w-5 lg:h-[25px] lg:w-[21px]"
              />
              <span
                className="font-display inline-flex items-center rounded-[4px] px-3 py-1 text-[14px] leading-[1] font-medium whitespace-nowrap uppercase sm:text-[16px] lg:text-[18px]"
                style={{ backgroundColor: CYAN, color: NAVY_DARK }}
              >
                EDAD PICO
              </span>
            </div>
            <p
              className="text-[16px] text-white"
              style={{
                fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              }}
            >
              Pico: 55-64 años
            </p>

            {/* Bar chart — Figma 747:2627: items-end gap-[12px] h-[201px].
                Cada bar wrapper h-[Xpx] flex-col gap-[2px] justify-end, bar flex-1
                (peak: bar h-[148px] shrink-0 sin h del wrapper). */}
            <div className="mt-4 flex w-full items-end gap-3 lg:gap-[12px]">
              {AGE_BARS.map((bar) => {
                // Container heights del Figma: 77/99/114/77/(auto peak)/93.
                const containerH = bar.peak ? undefined : bar.height + 19; // bar + label + gap
                return (
                  <div
                    key={bar.label}
                    className="flex flex-1 flex-col items-start justify-end gap-[2px]"
                    style={containerH ? { height: `${containerH}px` } : undefined}
                  >
                    {bar.peak ? (
                      <div
                        className="w-full shrink-0 rounded-tl-[4px] rounded-tr-[4px]"
                        style={{
                          height: `${bar.height}px`,
                          backgroundColor: VIOLET,
                        }}
                      />
                    ) : (
                      <div
                        className="min-h-px w-full flex-1 rounded-tl-[4px] rounded-tr-[4px]"
                        style={{ backgroundColor: "#D9D9D9" }}
                      />
                    )}
                    <p
                      className="w-full text-center text-[14px] text-white"
                      style={{
                        fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                        lineHeight: "normal",
                      }}
                    >
                      {bar.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        {/* Y dónde encontrarlo */}
        <div className="flex w-full flex-col gap-3">
          <h3 className="font-display text-[36px] leading-[1] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]">
            y dónde <span style={{ color: CYAN }}>encontrarlo</span>
          </h3>
          <p
            className="max-w-[687px] text-[18px] leading-snug text-white sm:text-[22px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
            }}
          >
            El nivel socioeconómico de nuestra audiencia refleja la Colombia real.
            Diversa, masiva y lista para conectar con tu marca.
          </p>
        </div>

        {/* NSE cards */}
        <div className="flex w-full flex-wrap items-end justify-between gap-4 sm:gap-6">
          {NSE_CARDS.map((card) => (
            <div
              key={card.label}
              className="flex w-full max-w-[272px] flex-col items-start gap-2 rounded-[16px] border p-5"
              style={
                card.big
                  ? {
                      background: "linear-gradient(180deg, #8232F0 0%, #561BDB 100%)",
                      borderColor: "#FFFFFF",
                      borderWidth: "2px",
                    }
                  : {
                      borderColor: "#FFFFFF",
                      backgroundColor: "rgba(255,255,255,0.02)",
                      backdropFilter: "blur(10px)",
                    }
              }
            >
              <p className="font-display text-[24px] leading-[1] font-bold whitespace-nowrap text-white sm:text-[28px] lg:text-[32px]">
                {card.label}
              </p>
              <p
                className={`font-display leading-[1] font-medium whitespace-nowrap text-white uppercase ${card.big ? "text-[64px] sm:text-[80px] lg:text-[96px]" : "text-[44px] sm:text-[56px] lg:text-[64px]"}`}
              >
                <CountUp value={card.value} format={(v) => `${v.toFixed(1)}%`} />
              </p>
            </div>
          ))}
        </div>

        {/* Source */}
        <div className="flex w-full items-center justify-end gap-1">
          <span
            className="inline-block h-[10px] w-[10px] rounded-full"
            style={{ backgroundColor: CYAN }}
          />
          <p
            className="font-display text-[12px] leading-[18px] text-white"
            style={{ fontWeight: 500 }}
          >
            Fuente: TGI CO 2025
          </p>
        </div>
      </div>
    </section>
  );
}
