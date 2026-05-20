"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { CountUp } from "@/components/animations";
import { Container } from "@/components/ui";
import { NetworkIcon } from "@/components/marketing";
import { brandMeta } from "@/lib/brand";
import { formatNumber } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { BrandTabsBlockProps } from "../types";
import { AgePeakBarChart } from "./AgePeakBarChart";
import { GenderPieChart } from "./GenderPieChart";

type Tab = NonNullable<BrandTabsBlockProps["tabs"]>[number];

/**
 * BrandTabsBlock — "Una marca para cada audiencia" (Figma caracol-next.png).
 *
 * Spec:
 *  - Tabs pill horizontales arriba. Mobile = scroll horizontal sin scrollbar.
 *  - Card grande 2-col: izquierda contenido (WEB + REDES + AUDIENCIA + CTA),
 *    derecha card brand color con logo grande. Mobile = card derecha oculta,
 *    pero el logo aparece como ícono pequeño en esquina superior derecha
 *    de la card izquierda.
 *  - Tab change: AnimatePresence fade 300ms ease. Re-monta contenido,
 *    re-anima charts (grow-from-0 con Recharts) y CountUps.
 */
export function BrandTabsBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  tabs,
  defaultTab,
}: BrandTabsBlockProps) {
  const [active, setActive] = React.useState(defaultTab ?? 0);
  if (!tabs || tabs.length === 0) return null;
  const safeIndex = Math.min(Math.max(active, 0), tabs.length - 1);
  const current = tabs[safeIndex]!;

  // Heading split: si el editor pone "Una marca para|cada audiencia",
  // la primera parte se renderiza Regular y la segunda Bold (patrón Figma).
  const [headingRegular, headingBoldPart] = (heading ?? "")
    .split("|")
    .map((s) => s.trim());

  return (
    <section id={anchorId ?? "marcas"} className="py-6 sm:py-8 lg:py-10">
      <div className="bg-muted w-full overflow-hidden rounded-[2rem] py-14 sm:rounded-[2.5rem] sm:py-16 lg:py-20">
        <Container size="xl">
          {/* Figma 400:2128: eyebrow Poppins Bold 20px #00ACFF uppercase, SIN tracking ancho. */}
          <p
            className="font-poppins text-[16px] leading-normal font-bold uppercase sm:text-[18px] lg:text-[20px]"
            style={{ color: "#00ACFF" }}
          >
            {eyebrow ?? "El ecosistema Caracol"}
          </p>
          {/* Figma 400:2148/2149: heading 2 líneas, 64px line-height 60 tracking -1px.
              Línea 1 (Una marca para): Medium 500 color #464553 (gris).
              Línea 2 (cada audiencia): ExtraBold 800 color #003381 (navy). */}
          <h2 className="font-display mt-3 text-[40px] leading-[1] tracking-[-1px] sm:text-[48px] lg:text-[64px] lg:leading-[60px]">
            <span className="block font-medium" style={{ color: "#464553" }}>
              {headingRegular}
            </span>
            {headingBoldPart ? (
              <span className="block font-extrabold" style={{ color: "#003381" }}>
                {headingBoldPart}
              </span>
            ) : null}
          </h2>
          {description ? (
            <p className="text-muted-foreground text-fluid-body mt-2">{description}</p>
          ) : null}

          {/* Tabs pill row — wrap si no caben en 1 línea, scroll horizontal en mobile. */}
          <div
            className="-mx-4 mt-8 [scrollbar-width:none] overflow-x-auto px-4 [-ms-overflow-style:none] sm:overflow-visible [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Marcas del ecosistema"
          >
            <div className="flex w-max gap-2 sm:w-full sm:flex-wrap">
              {tabs.map((tab, i) => {
                const meta = brandMeta(tab.brand);
                const isActive = i === safeIndex;
                // Figma 402:5117: tabs uniformes en Azul Medio #015BC4.
                // Active = filled, Inactive = outline.
                const AZUL_MEDIO = "#015BC4";
                return (
                  <button
                    key={tab.brand}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    className={cn(
                      // Figma 402:5002: Large size px-48 py-12 todos los tabs.
                      "font-display rounded-[4px] border px-[20px] py-[12px] text-[16px] leading-[24px] font-semibold whitespace-nowrap transition-colors sm:px-[36px] lg:px-[48px]",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                    )}
                    style={
                      isActive
                        ? {
                            backgroundColor: AZUL_MEDIO,
                            borderColor: AZUL_MEDIO,
                            color: "white",
                          }
                        : {
                            backgroundColor: "white",
                            borderColor: AZUL_MEDIO,
                            color: AZUL_MEDIO,
                          }
                    }
                  >
                    {tab.displayName ?? meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content — fade 300ms ease entre tabs */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.brand}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TabPanel tab={current} />
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </div>
    </section>
  );
}

/**
 * TabPanel — implementación 1:1 del frame Figma 402:5117 (Caracol TV variant).
 *
 * Estructura:
 *  - Card outer: bg white, border rgba(207,206,204,0.81), rounded-24
 *  - Columna izquierda (~60%): content area pl-80 pr-40 py-40
 *    - Brand heading 64px Bold #003381 tracking -1.5px
 *    - Tagline 20px Regular #464553
 *    - WEB + REDES cards side by side
 *    - AUDIENCIA card (pie + bar charts)
 *    - "Conoce más" button bottom-right (Medium size)
 *  - Columna derecha (~40%): bg #003381 navy con logo grande + small brand icon
 *
 * Tokens Figma:
 *  - Pills "WEB"/"REDES"/"AUDIENCIA": bg #00ACFF, white Bold 14px uppercase
 *  - Card border: #95999A, rounded-8, p-20
 *  - Numbers WEB: 32px Bold #100201
 *  - Labels: 20px Regular #121212
 *  - Networks: icon 32x32 + number 20px Bold/SemiBold + "Seguidores" 16px Regular
 */
const PILL_BG = "#00ACFF";
const CARD_BORDER = "#95999A";
const NEUTRO_NEGRO = "#121212";
const NEUTRO_GRIS_OSCURO = "#464553";
const AZUL_MEDIO = "#015BC4";

function TabPanel({ tab }: { tab: Tab }) {
  const meta = brandMeta(tab.brand);
  const displayName = tab.displayName ?? meta.label;
  const logoUrl = mediaUrl(tab.brandLogo);
  // Colores por brand (Figma): heading usa brand.color, panel usa brand.colorDark,
  // chart peak usa brand.chartPeak. Cada brand tiene su propia paleta.
  const brandColor = meta.color;
  const brandPanelBg = meta.colorDark ?? meta.color;
  const brandChartPeak = meta.chartPeak ?? meta.color;
  const brandAccent = meta.colorAccent;

  return (
    <div
      className="grid overflow-hidden rounded-[24px] bg-white md:grid-cols-[3fr_2fr]"
      style={{ border: "1px solid rgba(207,206,204,0.81)" }}
    >
      {/* Columna izquierda — content */}
      <div className="relative flex flex-col gap-5 p-6 sm:p-8 md:pt-10 md:pr-10 md:pb-10 md:pl-20">
        {/* Brand icon top-right corner — visible solo en mobile */}
        {logoUrl ? (
          <div
            className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-lg md:hidden"
            style={{ backgroundColor: brandPanelBg }}
          >
            <Image
              src={logoUrl}
              alt={displayName}
              width={40}
              height={40}
              className="h-7 w-auto object-contain"
            />
          </div>
        ) : null}

        {/* Brand name + tagline */}
        <div className="flex flex-col gap-5">
          <h3
            className="font-display text-[40px] leading-[0.95] font-bold tracking-[-1.5px] sm:text-[48px] lg:text-[64px]"
            style={{ color: brandColor }}
          >
            {displayName}
          </h3>
          {tab.tagline ? (
            <p
              className="font-display text-[16px] leading-normal font-normal lg:text-[20px]"
              style={{ color: NEUTRO_GRIS_OSCURO }}
            >
              {tab.tagline}
            </p>
          ) : null}
        </div>

        {/* WEB + REDES side by side */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* WEB box */}
          {tab.webMetrics &&
          (tab.webMetrics.usersPerMonth || tab.webMetrics.viewsPerMonth) ? (
            <div
              className="flex flex-col items-start gap-2 rounded-[8px] bg-white p-5"
              style={{ border: `1px solid ${CARD_BORDER}` }}
            >
              <Pill>WEB</Pill>
              <div className="flex flex-col gap-4 px-5">
                {tab.webMetrics.usersPerMonth ? (
                  <div className="flex flex-col items-end justify-center gap-2 whitespace-nowrap">
                    <p
                      className="font-display text-[24px] leading-none font-bold sm:text-[28px] lg:text-[32px]"
                      style={{ color: "#100201" }}
                    >
                      <CountUp
                        value={tab.webMetrics.usersPerMonth}
                        format={(v) => formatNumber(Math.round(v))}
                      />
                    </p>
                    <p
                      className="font-display text-right text-[16px] leading-none font-normal lg:text-[20px]"
                      style={{ color: NEUTRO_NEGRO }}
                    >
                      {tab.webMetrics.usersLabel ?? "Usuarios/mes"}
                    </p>
                  </div>
                ) : null}
                {tab.webMetrics.usersPerMonth && tab.webMetrics.viewsPerMonth ? (
                  <div className="h-px w-full" style={{ backgroundColor: CARD_BORDER }} />
                ) : null}
                {tab.webMetrics.viewsPerMonth ? (
                  <div className="flex flex-col items-end justify-center gap-2 whitespace-nowrap">
                    <p
                      className="font-display text-[24px] leading-none font-bold sm:text-[28px] lg:text-[32px]"
                      style={{ color: "#100201" }}
                    >
                      <CountUp
                        value={tab.webMetrics.viewsPerMonth}
                        format={(v) => formatNumber(Math.round(v))}
                      />
                    </p>
                    <p
                      className="font-display text-right text-[16px] leading-none font-normal lg:text-[20px]"
                      style={{ color: NEUTRO_NEGRO }}
                    >
                      {tab.webMetrics.viewsLabel ?? "Vistas/mes"}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* REDES box */}
          {tab.networks && tab.networks.length > 0 ? (
            <div
              className="flex flex-1 flex-col items-start gap-2 rounded-[8px] bg-white p-5"
              style={{ border: `1px solid ${CARD_BORDER}` }}
            >
              <Pill>REDES</Pill>
              <div className="flex w-full flex-col gap-4 px-5 py-2">
                {/* 3 rows × 2 cols layout. */}
                <ul className="grid grid-cols-1 gap-x-[18px] gap-y-4 sm:grid-cols-2">
                  {tab.networks.slice(0, 6).map((net, i) => (
                    <li
                      key={net.id ?? net.network}
                      className="flex min-w-0 items-start gap-3"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center"
                        style={{ color: brandColor }}
                      >
                        <NetworkIcon network={net.network} className="h-8 w-8" />
                      </span>
                      <div className="flex min-w-0 flex-col items-start justify-center whitespace-nowrap">
                        <p
                          className={cn(
                            "font-display text-[20px] leading-[28px]",
                            i === 0 ? "font-bold" : "font-semibold",
                          )}
                          style={{ color: NEUTRO_NEGRO }}
                        >
                          <CountUp
                            value={net.followers}
                            format={(v) => formatNumber(Math.round(v))}
                          />
                        </p>
                        <p
                          className="font-display text-[16px] leading-[20px] font-normal"
                          style={{ color: NEUTRO_NEGRO }}
                        >
                          Seguidores
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {/* AUDIENCIA — pie + bar charts */}
        {tab.audience?.genderSplit?.femalePercent !== undefined &&
        tab.audience?.genderSplit?.femalePercent !== null ? (
          <div
            className="flex flex-col items-start gap-2 rounded-[8px] bg-white p-5"
            style={{ border: `1px solid ${CARD_BORDER}` }}
          >
            <Pill>AUDIENCIA</Pill>

            <div className="flex flex-col gap-4 px-5 sm:flex-row sm:items-start sm:gap-4">
              {/* Género — text + pie chart side by side */}
              <div className="flex items-center justify-center gap-[10px]">
                <div className="flex w-[184px] flex-col items-start">
                  <p
                    className="font-display text-[24px] leading-[32px] font-bold whitespace-nowrap"
                    style={{ color: NEUTRO_NEGRO }}
                  >
                    Género
                  </p>
                  <p
                    className="font-display text-[14px] leading-normal font-normal"
                    style={{ color: NEUTRO_GRIS_OSCURO }}
                  >
                    Del total de la audiencia{" "}
                    <span className="font-semibold">
                      {tab.audience.genderSplit.femalePercent}% son{" "}
                      {(tab.audience.genderSplit.femaleLabel ?? "mujeres").toLowerCase()}.
                    </span>
                  </p>
                </div>
                <GenderPieChart
                  femalePercent={tab.audience.genderSplit.femalePercent}
                  femaleLabel={tab.audience.genderSplit.femaleLabel ?? "Mujeres"}
                  maleLabel={tab.audience.genderSplit.maleLabel ?? "Hombres"}
                  primaryColor={brandAccent ?? brandColor}
                  secondaryColor={brandPanelBg}
                />
              </div>

              {/* Divisor vertical */}
              <div
                className="hidden w-px sm:block"
                style={{ backgroundColor: CARD_BORDER }}
              />

              {/* Edad Pico */}
              {tab.audience?.agePicks && tab.audience.agePicks.length > 0 ? (
                <div className="flex flex-col items-start gap-[10px]">
                  <div className="flex flex-col items-end whitespace-nowrap">
                    <p
                      className="font-display text-[24px] leading-[32px] font-bold"
                      style={{ color: NEUTRO_NEGRO }}
                    >
                      Edad Pico
                    </p>
                    {tab.audience.peakAgeRange ? (
                      <p
                        className="font-display text-right text-[14px] leading-normal font-normal"
                        style={{ color: NEUTRO_GRIS_OSCURO }}
                      >
                        {tab.audience.peakAgeRange}
                      </p>
                    ) : null}
                  </div>
                  <AgePeakBarChart
                    data={tab.audience.agePicks.map((a) => ({
                      range: a.range,
                      value: a.value,
                      isPeak: a.isPeak,
                    }))}
                    peakColor={brandChartPeak}
                    baseColor="#D9D9D9"
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* CTA "Conoce más" bottom-right — bg #015BC4 size Medium */}
        {tab.ctaContact?.label && tab.ctaContact?.href ? (
          <div className="flex justify-end pt-2">
            <Link
              href={tab.ctaContact.href}
              target={tab.ctaContact.openInNewTab ? "_blank" : undefined}
              className="font-display inline-flex items-center justify-center rounded-[4px] px-[32px] py-[8px] text-[14px] leading-[20px] font-semibold text-white"
              style={{ backgroundColor: AZUL_MEDIO }}
            >
              {tab.ctaContact.label}
            </Link>
          </div>
        ) : null}
      </div>

      {/* Columna derecha — brand panel. Oculta en mobile. */}
      <div
        className="relative hidden items-center justify-center md:flex"
        style={{ backgroundColor: brandPanelBg }}
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={displayName}
            width={320}
            height={180}
            className="h-auto max-h-[60%] w-auto max-w-[70%] object-contain"
          />
        ) : (
          <span className="font-display text-3xl font-black text-white sm:text-4xl">
            {displayName.toUpperCase()}
          </span>
        )}
        {/* Small brand icon top-right (Figma: 76x76 con border #015BC4 default).
            Excepciones: La Kalle border #FEFF00 (yellow), BumBox/Volk border white. */}
        <div
          className="absolute top-[30px] right-[30px] flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[16px] border-2"
          style={{
            backgroundColor: brandPanelBg,
            // Para LaKalle usa accent yellow. Para BumBox/Volk usa white.
            // Para los demás usa azul medio #015BC4 (matching Caracol TV variant).
            borderColor:
              meta.label === "La Kalle"
                ? brandAccent
                : meta.label === "BumBox" || meta.label === "Volk"
                  ? "#FFFFFF"
                  : "#015BC4",
          }}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={displayName}
              width={72}
              height={72}
              className="h-[72px] w-[72px] object-cover"
            />
          ) : (
            <span className="text-[10px] font-bold text-white">
              {meta.label.split(" ")[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Pill badge — bg #00ACFF, text Bold 14px white uppercase (Figma 402:8110). */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-display inline-flex items-center justify-center rounded-[4px] px-2 py-1 text-[14px] leading-[16px] font-bold text-white uppercase"
      style={{ backgroundColor: PILL_BG }}
    >
      {children}
    </span>
  );
}
