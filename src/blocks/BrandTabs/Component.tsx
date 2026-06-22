"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { brandFromDoc } from "@/lib/brand";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BrandTabsBlockProps } from "../types";
import { AgePeakBarChart } from "./AgePeakBarChart";
import { BrandNetworkIcon } from "./BrandNetworkIcon";
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

  // overflow-x-auto nativo no soporta click+arrastre con mouse — lo agregamos a mano.
  const tabsScrollRef = React.useRef<HTMLDivElement>(null);
  const dragState = React.useRef({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  const onTabsMouseDown = (e: React.MouseEvent) => {
    const el = tabsScrollRef.current;
    if (!el) return;
    dragState.current = {
      isDown: true,
      startX: e.pageX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
  };
  const onTabsMouseMove = (e: React.MouseEvent) => {
    const el = tabsScrollRef.current;
    if (!el || !dragState.current.isDown) return;
    const delta = e.pageX - dragState.current.startX;
    if (Math.abs(delta) > 3) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScrollLeft - delta;
  };
  const endTabsDrag = () => {
    dragState.current.isDown = false;
  };
  // Si hubo arrastre, cancela el click para no seleccionar tab por error.
  const onTabsClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (!tabs || tabs.length === 0) return null;
  const safeIndex = Math.min(Math.max(active, 0), tabs.length - 1);
  const current = tabs[safeIndex]!;

  // Heading split: si el editor pone "Una marca para|cada audiencia",
  // la primera parte se renderiza Regular y la segunda Bold (patrón Figma).
  const [headingRegular, headingBoldPart] = (heading ?? "")
    .split("|")
    .map((s: string) => s.trim());

  return (
    <section id={anchorId ?? "marcas"} className="py-6 sm:py-8 lg:py-10">
      {/* Bug: "Eliminar el fondo y marco redondeado de la sección que no
          existen en el diseño original." Antes había bg-muted + rounded-[2rem]
          envolviendo todo el bloque. Ahora el bloque se integra al fondo
          de la página y solo la card del tab activo tiene su marco. */}
      <div className="w-full py-10 sm:py-12 lg:py-16">
        {/* Wrapper custom (no Container) — Figma: 1280px inner content,
            con px-[80px] en desktop (1440 - 160 = 1280). Permite que los tabs
            quepan exactamente en 1 línea sin scroll horizontal. */}
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-[80px]">
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

          {/* Negative margin cancela el padding del wrapper por breakpoint,
              así el scroll llega hasta el borde sin espacio blanco. */}
          <div
            ref={tabsScrollRef}
            className="-mx-4 mt-8 cursor-grab scrollbar-none overflow-x-auto select-none active:cursor-grabbing sm:-mx-8 lg:-mx-20"
            role="tablist"
            aria-label="Marcas del ecosistema"
            onMouseDown={onTabsMouseDown}
            onMouseMove={onTabsMouseMove}
            onMouseUp={endTabsDrag}
            onMouseLeave={endTabsDrag}
            onClickCapture={onTabsClickCapture}
          >
            <div className="flex w-max items-center gap-2 px-4 sm:px-8 lg:px-20">
              {tabs.map((tab: Tab, i: number) => {
                const meta = brandFromDoc(tab.brand);
                const isActive = i === safeIndex;
                const AZUL_MEDIO = "#015BC4";
                return (
                  <button
                    key={meta.slug ?? i}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={(e) => {
                      setActive(i);
                      e.currentTarget.scrollIntoView({
                        behavior: "smooth",
                        inline: "center",
                        block: "nearest",
                      });
                    }}
                    className={cn(
                      "font-display cursor-pointer rounded-[4px] border px-[20px] py-[12px] text-[16px] leading-[24px] font-semibold whitespace-nowrap transition-all duration-200 hover:opacity-90 sm:px-[32px]",
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

          {/* Tab content */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={brandFromDoc(current.brand).slug ?? safeIndex}
                initial={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, scale: 0.99, filter: "blur(3px)" }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <TabPanel tab={current} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
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

const BRAND_ICON_COLOR: Record<string, string> = {
  caracoltv: "#003381",
  golcaracol: "#071D49",
  caracolsports: "#005294",
  bluradio: "#005BAA",
  lakalle: "#353535",
};

const BRAND_AVATAR_PATHS: Record<string, string> = {
  caracoltv: "/caracol-next/brand-tabs/caracoltv-avatar.png",
  golcaracol: "/caracol-next/brand-tabs/golcaracol-avatar.png",
  caracolsports: "/caracol-next/brand-tabs/caracolsports-avatar.png",
  bluradio: "/caracol-next/brand-tabs/bluradio-avatar.png",
  lakalle: "/caracol-next/brand-tabs/lakalle-avatar.png",
  bumbox: "/caracol-next/brand-tabs/bumbox-avatar.png",
  volk: "/caracol-next/brand-tabs/volk-avatar.png",
};

function TabPanel({ tab }: { tab: Tab }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerInView = useInView(containerRef, {
    once: true,
    margin: "0px 0px -5% 0px",
  });
  const meta = brandFromDoc(tab.brand);
  const brandSlug = meta.slug;
  const displayName = tab.displayName ?? meta.label;
  const avatarUrl = brandSlug ? BRAND_AVATAR_PATHS[brandSlug] : undefined;
  // Colores por brand (Figma): heading usa brand.color, panel usa brand.colorDark,
  // chart peak usa brand.chartPeak. Cada brand tiene su propia paleta.
  const brandColor = meta.color;
  const brandPanelBg = meta.colorDark ?? meta.color;
  const brandChartPeak = meta.chartPeak ?? meta.color;
  const brandAccent = meta.colorAccent;

  // Figma override: BumBox (402:8734) y Volk (402:8828) NO tienen los bloques
  // WEB ni REDES en su diseño. Solo se renderiza AUDIENCIA + CTA.
  const showWebAndNetworks = brandSlug !== "bumbox" && brandSlug !== "volk";

  // Figma La Kalle (402:8626): pie chart con colores invertidos vs el resto.
  // Mujeres (mayoría 71%) = NEGRO #353535, Hombres (29%) = AMARILLO #FEFF00.
  // En el resto de brands el slice MAYOR usa brandAccent (más claro).
  const isLaKalle = brandSlug === "lakalle";
  const piePrimaryColor = isLaKalle
    ? brandPanelBg // larger slice = #353535 (negro)
    : (brandAccent ?? brandColor);
  const pieSecondaryColor = isLaKalle
    ? (brandAccent ?? brandColor) // smaller slice = #FEFF00 (amarillo)
    : brandPanelBg;

  return (
    <div
      ref={containerRef}
      className="grid overflow-hidden rounded-3xl bg-white xl:grid-cols-[3fr_2fr]"
      style={{ border: "1px solid rgba(207,206,204,0.81)" }}
    >
      {/* Columna izquierda — content */}
      <div className="relative flex flex-col items-center gap-5 p-6 sm:p-8 md:pt-10 md:pr-10 md:pb-10 md:pl-20 lg:items-start">
        {/* Brand icon top-right corner — visible solo en mobile, usa avatar */}
        {avatarUrl ? (
          <div
            className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg lg:hidden"
            style={{ backgroundColor: brandPanelBg }}
          >
            <Image
              src={avatarUrl}
              alt={displayName}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        {/* Brand name + tagline — siempre left-aligned */}
        <div className="flex w-full flex-col gap-5">
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

        {/* WEB + REDES side by side — Figma override: NO renderiza para
            BumBox (402:8734) ni Volk (402:8828) — esos tabs solo tienen
            AUDIENCIA + CTA. */}
        {showWebAndNetworks ? (
          <div className="m-auto flex flex-col gap-5 min-[920px]:flex-row lg:items-start">
            {/* WEB box */}
            {tab.webMetrics &&
            (tab.webMetrics.usersPerMonth || tab.webMetrics.viewsPerMonth) ? (
              <div
                className="flex h-full w-full flex-col items-start gap-2 rounded-[8px] bg-white p-5 md:w-auto"
                style={{ border: `1px solid ${CARD_BORDER}` }}
              >
                <Pill>WEB</Pill>
                <div className="m-auto flex flex-col gap-4 px-5">
                  {tab.webMetrics.usersPerMonth ? (
                    <div className="flex flex-col items-end justify-center gap-2 whitespace-nowrap">
                      <motion.p
                        key={(brandSlug ?? "") + "-users"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={
                          containerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                        }
                        transition={{
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94],
                          delay: 0.1,
                        }}
                        className="font-display text-[24px] leading-none font-bold sm:text-[28px] lg:text-[32px]"
                        style={{ color: "#100201" }}
                      >
                        {formatNumber(tab.webMetrics.usersPerMonth)}
                      </motion.p>
                      <p
                        className="font-display text-right text-[16px] leading-none font-normal lg:text-[20px]"
                        style={{ color: NEUTRO_NEGRO }}
                      >
                        {tab.webMetrics.usersLabel ?? "Usuarios/mes"}
                      </p>
                    </div>
                  ) : null}
                  {tab.webMetrics.usersPerMonth && tab.webMetrics.viewsPerMonth ? (
                    <div
                      className="h-px w-full"
                      style={{ backgroundColor: CARD_BORDER }}
                    />
                  ) : null}
                  {tab.webMetrics.viewsPerMonth ? (
                    <div className="flex flex-col items-end justify-center gap-2 whitespace-nowrap">
                      <motion.p
                        key={(brandSlug ?? "") + "-views"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={
                          containerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                        }
                        transition={{
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94],
                          delay: 0.18,
                        }}
                        className="font-display text-[24px] leading-none font-bold sm:text-[28px] lg:text-[32px]"
                        style={{ color: "#100201" }}
                      >
                        {formatNumber(tab.webMetrics.viewsPerMonth)}
                      </motion.p>
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
                className="flex h-full w-full flex-1 flex-col items-start gap-2 rounded-[8px] bg-white p-5"
                style={{ border: `1px solid ${CARD_BORDER}` }}
              >
                <Pill>REDES</Pill>
                <div className="flex w-full flex-col gap-4 py-2">
                  {/* 3 rows × 2 cols layout. */}
                  <ul className="grid grid-cols-1 gap-x-4.5 gap-y-4 md:grid-cols-2">
                    {tab.networks
                      .slice(0, 6)
                      .map((net: NonNullable<Tab["networks"]>[number], i: number) => {
                        const netHref = (net.url ??
                          (net as Record<string, unknown>).href) as string | undefined;
                        const icon = (
                          <BrandNetworkIcon
                            network={net.network}
                            color={
                              (brandSlug ? BRAND_ICON_COLOR[brandSlug] : undefined) ??
                              brandPanelBg
                            }
                            className="h-8 w-8 shrink-0"
                          />
                        );
                        return (
                          <li
                            key={net.id ?? net.network}
                            className="flex min-w-0 items-start gap-3"
                          >
                            {netHref ? (
                              <a
                                href={netHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 transition-transform duration-200 ease-out hover:scale-110"
                              >
                                {icon}
                              </a>
                            ) : (
                              <span className="shrink-0">{icon}</span>
                            )}
                            <div className="flex min-w-0 flex-col items-start justify-center whitespace-nowrap">
                              <motion.p
                                key={(brandSlug ?? "") + "-" + net.network}
                                initial={{ opacity: 0, y: 6 }}
                                animate={
                                  containerInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 6 }
                                }
                                transition={{
                                  duration: 0.35,
                                  ease: [0.25, 0.46, 0.45, 0.94],
                                  delay: 0.1 + i * 0.05,
                                }}
                                className={cn(
                                  "font-display text-[20px] leading-7 font-semibold",
                                )}
                                style={{ color: NEUTRO_NEGRO }}
                              >
                                {formatNumber(net.followers)}
                              </motion.p>
                              <p
                                className="font-display text-[16px] leading-5 font-normal"
                                style={{ color: NEUTRO_NEGRO }}
                              >
                                Seguidores
                              </p>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* AUDIENCIA — pie + bar charts */}
        {tab.audience?.genderSplit?.femalePercent !== undefined &&
        tab.audience?.genderSplit?.femalePercent !== null ? (
          <div
            className="m-auto flex flex-col items-start gap-2 rounded-[8px] bg-white p-4"
            style={{ border: `1px solid ${CARD_BORDER}` }}
          >
            <Pill>AUDIENCIA</Pill>

            <div className="m-auto flex flex-col gap-4 min-[920px]:flex-row sm:gap-4 sm:px-5 lg:items-start">
              {/* Género — text + pie chart side by side.
                  Mobile: flex-col o flex-row compacto. El w-[184px] fijo causa
                  overflow en mobile — se usa min-w-0 flex-1 en su lugar. */}
              <div className="flex items-center justify-between gap-3 sm:justify-center sm:gap-2.5">
                <div className="flex min-w-0 flex-1 flex-col items-start sm:w-46 sm:flex-none">
                  <p
                    className="font-display text-[22px] leading-7.5 font-bold sm:text-[24px] sm:leading-8"
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
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={
                    containerInView
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.4, opacity: 0 }
                  }
                  transition={{
                    duration: 0.55,
                    ease: [0.34, 1.56, 0.64, 1],
                    delay: 0.25,
                  }}
                  className="shrink-0"
                >
                  <GenderPieChart
                    femalePercent={tab.audience.genderSplit.femalePercent}
                    femaleLabel={tab.audience.genderSplit.femaleLabel ?? "Mujeres"}
                    maleLabel={tab.audience.genderSplit.maleLabel ?? "Hombres"}
                    primaryColor={piePrimaryColor}
                    secondaryColor={pieSecondaryColor}
                  />
                </motion.div>
              </div>

              {/* Divisor vertical */}
              <div
                className="hidden w-px sm:block"
                style={{ backgroundColor: CARD_BORDER }}
              />

              {/* Edad Pico */}
              {tab.audience?.agePicks && tab.audience.agePicks.length > 0 ? (
                <div className="flex flex-col items-start gap-2.5">
                  <div className="flex flex-col items-end whitespace-nowrap">
                    <p
                      className="font-display text-[24px] leading-8 font-bold"
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
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={
                      containerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
                    }
                    transition={{
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.35,
                    }}
                  >
                    <AgePeakBarChart
                      data={tab.audience.agePicks.map(
                        (
                          a: NonNullable<
                            NonNullable<Tab["audience"]>["agePicks"]
                          >[number],
                        ) => ({
                          range: a.range,
                          value: a.value,
                          isPeak: a.isPeak,
                        }),
                      )}
                      peakColor={brandChartPeak}
                      baseColor="#D9D9D9"
                    />
                  </motion.div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* CTA "Conoce más" bottom-right — bg #015BC4 size Medium */}
        {tab.ctaContact?.label && tab.ctaContact?.href ? (
          <div className="m-auto flex justify-center pt-2 min-[920px]:m-0 min-[920px]:ml-auto min-[920px]:justify-end">
            <Link
              href={tab.ctaContact.href}
              target={tab.ctaContact.openInNewTab ? "_blank" : undefined}
              className="font-display inline-flex items-center justify-center rounded-[4px] border border-[#015BC4] bg-[#015BC4] px-8 py-2 text-[14px] leading-5 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-white hover:text-[#015BC4]"
            >
              {tab.ctaContact.label}
            </Link>
          </div>
        ) : null}
      </div>

      {/* Columna derecha — brand panel. Figma 402:5117-5195.
          Background sólido brandPanelBg + wordmark logo centrado + avatar
          76×76 absolute top-right. Oculta en mobile. */}
      <div
        className="relative hidden items-center justify-center lg:flex"
        style={{ backgroundColor: brandPanelBg }}
      >
        {/* Wordmark logo centrado — pendiente de assets definitivos */}
        {/* Avatar top-right (76×76 rounded-16 border-2) — Figma muestra una
            imagen distinta del logo (avatar/icon del brand).
            Excepciones de border: La Kalle yellow, BumBox/Volk white,
            default azul medio #015BC4 (Caracol TV variant). */}
        <div
          className="absolute top-7.5 right-7.5 flex h-19 w-19 items-center justify-center overflow-hidden rounded-2xl border-2"
          style={{
            backgroundColor: brandPanelBg,
            borderColor:
              meta.label === "La Kalle"
                ? brandAccent
                : meta.label === "BumBox" || meta.label === "Volk"
                  ? "#FFFFFF"
                  : "#015BC4",
          }}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`${displayName} avatar`}
              width={72}
              height={72}
              className="h-18 w-18 object-cover"
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
      className="font-display inline-flex items-center justify-center rounded-[4px] px-2 py-1 text-[14px] leading-4 font-bold text-white uppercase"
      style={{ backgroundColor: PILL_BG }}
    >
      {children}
    </span>
  );
}
