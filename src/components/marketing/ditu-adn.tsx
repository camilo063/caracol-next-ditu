"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

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
/**
 * AGE_BARS — Recharts BarChart data. Cada bar tiene un valor numérico (height
 * en Figma como proxy del porcentaje relativo) y un flag peak.
 * Heights del Figma 747:2627 (bar visible Rectangle 46).
 */
const AGE_BARS = [
  { label: "18-24", value: 58, peak: false },
  { label: "25-34", value: 80, peak: false },
  { label: "35-44", value: 95, peak: false },
  { label: "45-54", value: 58, peak: false },
  { label: "55-64", value: 148, peak: true },
  { label: "+65", value: 74, peak: false },
];

/**
 * GENDER_DATA — Recharts PieChart (donut) data.
 * 52% hombres + 48% mujeres (Figma 747:2597).
 */
const GENDER_DATA = [
  { name: "Hombres", value: 52, color: "#77EDED" },
  { name: "Mujeres", value: 48, color: "#561BDB" },
];

/**
 * NSE_CARDS — Estratos socioeconómicos. La tarjeta con mayor % es destacada
 * automáticamente (spec Camilo: calculado dinámicamente, no hardcoded).
 */
const NSE_CARDS = [
  { label: "ESTRATO 1 o 2", value: 22.7 },
  { label: "ESTRATO 3", value: 37.8 },
  { label: "ESTRATO 4", value: 28.9 },
  { label: "ESTRATO 5 o 6", value: 10.6 },
];

export interface DituAdnProps {
  anchorId?: string;
  genderMalePercent?: number;
  ageBars?: typeof AGE_BARS;
  nseCards?: typeof NSE_CARDS;
}

export function DituAdnBlock({
  anchorId = "adn",
  genderMalePercent,
  ageBars,
  nseCards,
}: DituAdnProps) {
  const finalGenderMale = genderMalePercent ?? 52;
  const finalGenderData = [
    { name: "Hombres", value: finalGenderMale, color: "#77EDED" },
    { name: "Mujeres", value: 100 - finalGenderMale, color: "#561BDB" },
  ];
  const finalAgeBars = ageBars && ageBars.length > 0 ? ageBars : AGE_BARS;
  const finalNseCards = nseCards && nseCards.length > 0 ? nseCards : NSE_CARDS;

  // NSE auto-highlight (spec Camilo): el estrato con mayor % es destacado.
  // Calculado dinámicamente, no hardcoded.
  const maxNseValue = useMemo(
    () => Math.max(...finalNseCards.map((c) => c.value)),
    [finalNseCards],
  );

  // Re-mount de las gráficas Recharts cuando entran al viewport (fix bug
  // usuario "La gráfica de torta no está animada"). Recharts solo dispara su
  // animación al mount; pre-mount no se ve. Usamos useInView para forzar
  // remount mediante key={chartKey} la primera vez que se ven.
  const chartsRef = useRef<HTMLDivElement>(null);
  const chartsInView = useInView(chartsRef, {
    once: true,
    margin: "0px 0px -15% 0px",
  });

  return (
    <section
      id={anchorId}
      className="relative w-full"
      style={{
        background: "linear-gradient(175.32deg, #12082D 5%, #291266 51%, #12082D 90%)",
      }}
    >
      {/* Wave — Figma 738:3033 (Frame 14504): transición visual entre la sección
          Audiencia stats y el bloque ADN. Silhoueta RGBA 1440×233 px. Solo desktop
          (en mobile las secciones hacen transición directa sin ola). */}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bg/bg-up.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-10 w-full object-contain"
        style={{ transform: "translateY(calc(-100% + 2px))" }}
      />

      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-6 py-16 sm:gap-16 sm:px-12 sm:py-20 lg:gap-[64px] lg:px-[120px] lg:py-[80px]">
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
          <h2 className="font-display text-center text-[46px] leading-[1] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]">
            <span style={{ color: CYAN }}>Sabemos</span> a quién le hablas.
          </h2>
        </div>

        {/* 2 cards: Género + Edad — ref para detectar viewport y forzar
            remount de los charts (animación dispara al entrar al view). */}
        <div
          ref={chartsRef}
          className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[455fr_713fr] lg:gap-8"
        >
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

              {/* Donut Recharts — Figma 747:2682: size-186 con animación de
                  entrada nativa (isAnimationActive). Spec Camilo: 1-1.5s suave.
                  key={chartsInView} fuerza remount cuando entra al viewport,
                  reiniciando la animación Recharts (que solo corre al mount). */}
              <div className="relative h-[140px] w-[140px] shrink-0 sm:h-[186px] sm:w-[186px]">
                {chartsInView ? (
                  <ResponsiveContainer width="100%" height="100%" key="pie-in">
                    <PieChart>
                      <Pie
                        data={finalGenderData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive
                        animationBegin={0}
                        animationDuration={1200}
                        animationEasing="ease-out"
                        stroke="none"
                      >
                        {finalGenderData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : null}
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
            {/* Figma 748:2639: header alineado a la DERECHA (justify-end). */}
            <div className="flex w-full items-center justify-end gap-2">
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

            {/* Bar chart Recharts — Figma 747:2627 + spec Camilo: barras crecen
                desde 0 hasta valor final al entrar viewport (isAnimationActive),
                duración ~1.2s. La barra peak (55-64) destacada en violet.
                Render condicional (chartsInView) → forzar animación al ver. */}
            <div className="mt-4 w-full xl:mt-2">
              <div className="h-[180px] w-full">
                {chartsInView ? (
                  <ResponsiveContainer width="100%" height="100%" key="bar-in">
                    <BarChart
                      data={finalAgeBars}
                      margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                    >
                      <Bar
                        dataKey="value"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive
                        animationBegin={0}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      >
                        {finalAgeBars.map((bar) => (
                          <Cell key={bar.label} fill={bar.peak ? VIOLET : "#D9D9D9"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : null}
              </div>
              {/* Labels debajo de cada bar — Figma 747:2630+: Spline Sans 14px white center */}
              <div className="flex w-full items-start gap-3 lg:gap-3">
                {finalAgeBars.map((bar) => (
                  <p
                    key={bar.label}
                    className="flex-1 text-center text-[14px] text-white"
                    style={{
                      fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                      lineHeight: "normal",
                    }}
                  >
                    {bar.label}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </div>

        {/* Y dónde encontrarlo — Figma 747:2646: DOS líneas separadas.
            Línea 1: "y dónde " blanco · Línea 2: "encontrarlo" cyan #77EDED.
            SIN whitespace-nowrap para que hagan break natural. */}
        <div className="flex w-full flex-col gap-3">
          <h3 className="font-display text-[46px] leading-none font-bold text-white uppercase sm:text-[60px] lg:text-[84px]">
            <span className="block">y dónde</span>
            <span className="block" style={{ color: CYAN }}>
              encontrarlo
            </span>
          </h3>
          <p
            className="max-w-171.75 text-[18px] leading-snug text-white sm:text-[22px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
            }}
          >
            El nivel socioeconómico de nuestra audiencia refleja la Colombia real.
            Diversa, masiva y lista para conectar con tu marca.
          </p>
        </div>

        {/* NSE cards — Figma 748:2609. Spec Camilo: estrato con % MAYOR se
            destaca automáticamente (no hardcoded). En esta data Estrato 3
            (37.8%) es el highlight, pero si cambia el dataset, se recalcula. */}
        <div className="mt-15 grid w-full flex-wrap justify-center gap-4 sm:grid-cols-2 sm:items-end sm:gap-6 xl:grid-cols-4">
          {finalNseCards.map((card, idx) => {
            const isMax = card.value === maxNseValue;
            const isLast = idx === finalNseCards.length - 1;
            return (
              <div
                key={card.label}
                className="tems-start relative flex w-full flex-col gap-1 rounded-2xl border p-5 text-center"
                style={
                  isMax
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
                {/* Desktop: cámara sobre la última tarjeta */}
                {isLast && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/ditu/icons/camera-ditu.svg"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-42.5 -right-5 hidden w-43.5 xl:block"
                  />
                )}
                {/* Mobile: cámara sobre la primera tarjeta */}
                {idx === 0 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/ditu/icons/camera-ditu.svg"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-25 right-2 w-25 xl:hidden"
                  />
                )}
                <p className="font-display text-[24px] leading-none font-bold whitespace-nowrap text-white sm:text-[28px] lg:text-[32px]">
                  {card.label}
                </p>
                <p
                  className={`font-display leading-none font-medium whitespace-nowrap text-white uppercase ${isMax ? "text-[64px] sm:text-[80px] lg:text-[96px]" : "text-[44px] sm:text-[56px] lg:text-[64px]"}`}
                >
                  <CountUp value={card.value} format={(v) => `${v.toFixed(1)}%`} />
                </p>
              </div>
            );
          })}
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
