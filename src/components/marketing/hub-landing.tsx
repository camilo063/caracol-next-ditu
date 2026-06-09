"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { HomeContactModal, type ContactRepresentative } from "./home-contact-modal";

/** Easing común para la entrada escalonada (motion.dev/examples/react-hero-stagger). */
const STAGGER_STEP = 0.13; // delay entre elementos — más espaciado = más elegante

/** Fade-up: sube 56px + opacidad 0→1 + leve blur inicial. */
const staggerItemVariants = {
  hidden: { opacity: 0, y: 56, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.25, 0.46, 0.45, 0.94], // ease-out suave — no rush
    },
  },
};

/**
 * HubLanding — landing principal en `/` (Home Caracol Medios).
 *
 * Specs Figma 892:5740 — Home Caracol Medios:
 *  - Bg: solid #003381 con 2 radial gradients decorativos (rojos blueish glow)
 *  - Header: "Logo Caracol MEDIOS" + divider line + "DIGITAL" (top-40 left-40)
 *  - Left side (hero):
 *    · Eyebrow Poppins Bold 20 uppercase color #00ACFF
 *    · Heading Montserrat 74/lh-80 tracking -2.96px, mix Extra/Semi-Bold
 *    · CTA "Contáctenos" bg #00ACFF Montserrat SemiBold 18 white w-306
 *  - Right side: 2 product cards (Caracol Next 328 + Ditu 284) + 4 metric
 *    cards + 2 "Conoce" CTAs
 *  - Metric cards: bg #f1f1f1 border (#003381 ó #561BDB), 60/lh-48 ExtraBold,
 *    label 20/lh-24 SemiBold #464553, icon 40px abs top-left
 *  - 2 "Conoce" CTAs: outline white (Caracol Next) + gradient violet (Ditu)
 *  - Footer copyright: pill bg-black/25 rounded-90 p-10 Montserrat SemiBold 16
 *
 * Spec usuario (Camilo):
 *  - Mobile: todo apilado verticalmente, metrics OCULTOS, cards una debajo
 *    de la otra
 *  - Números animan 0 → final al entrar viewport (CountUp, Framer Motion)
 */
export interface HubLandingProps {
  eyebrow: string;
  heading: React.ReactNode;
  contactLabel: string;
  /** Si se pasa `representatives`, el CTA abre el modal de contacto.
      Si NO, el CTA navega a `contactHref` como Link normal. */
  contactHref?: string;
  /** Representantes para el modal de contacto (Figma 405:4864). */
  representatives?: ContactRepresentative[];
  brands: {
    caracolNext: {
      title: React.ReactNode;
      /** Soporta string (1 párrafo) o array (múltiples párrafos). */
      description: string | string[];
      ctaLabel: string;
      href: string;
    };
    ditu: {
      title: React.ReactNode;
      description: string | string[];
      ctaLabel: string;
      href: string;
    };
  };
  stats: Array<{
    icon: "users" | "tv" | "zap" | "clock";
    /** Valor numérico para CountUp. */
    numericValue?: number;
    /** Sufijo después del número animado (e.g. "M", "K", "Min"). */
    suffix?: string;
    /** Prefijo opcional (e.g. "+"). */
    prefix?: string;
    /** Fallback como string si no se quiere CountUp. */
    value: string;
    label: string;
    /** "caracolnext" → border #003381, number #003381. "ditu" → border
        #561BDB, number #12082D. */
    accent?: "caracolnext" | "ditu";
    /** Ancho desktop específico Figma (272/340/328/288). Mobile usa 100%. */
    lgWidth?: number;
  }>;
  copyright: string;
}

const ICON_PATHS = {
  users: "/home/icon-users.svg",
  tv: "/home/icon-screens.svg",
  zap: "/home/icon-followers.svg",
  clock: "/home/icon-watch.svg",
} as const;

export function HubLanding({
  eyebrow,
  heading,
  contactLabel,
  contactHref,
  representatives,
  brands,
  stats,
  copyright,
}: HubLandingProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactPos, setContactPos] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const contactBtnRef = useRef<HTMLButtonElement>(null);
  // Si hay representantes, el CTA abre el modal. Si no, navega como Link.
  const hasModal = !!representatives && representatives.length > 0;

  const handleContactClick = () => {
    if (!contactBtnRef.current) return;
    const rect = contactBtnRef.current.getBoundingClientRect();
    const GAP = 8;
    const isDesktop = window.innerWidth >= 1280; // breakpoint xl

    if (isDesktop) {
      // Desktop: a la derecha del botón, ancho fijo 256px, anclado por bottom
      setContactPos({
        bottom: window.innerHeight - rect.bottom,
        left: rect.right + GAP,
        width: 256,
      });
    } else {
      // Mobile/tablet: debajo del botón, mismo ancho que el botón
      setContactPos({
        top: rect.bottom + GAP,
        left: rect.left,
        width: rect.width,
      });
    }
    setContactOpen(true);
  };

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden text-white"
      style={{ backgroundColor: "#003381" }}
    >
      {/* Radial gradient decorativos — Figma 892:5741 + 892:5742 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden lg:block"
        style={{
          left: "calc(50% - 12px)",
          top: "-354px",
          width: "1210px",
          height: "1210px",
          background:
            "radial-gradient(circle 605px at center, rgba(1,91,196,1) 0%, rgba(0,51,129,0) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden lg:block"
        style={{
          left: "-565px",
          top: "0",
          width: "1210px",
          height: "1210px",
          background:
            "radial-gradient(circle 605px at center, rgba(1,91,196,1) 0%, rgba(0,51,129,0) 100%)",
        }}
      />

      {/* Header — Figma 892:6210 — centrado dentro del wrapper 1440 */}
      <motion.header
        className="relative z-10 w-full px-6 pt-8 sm:px-10 lg:pt-[40px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="mx-auto w-full max-w-[1377px] lg:px-[40px]">
          <CaracolMediosLogo />
        </div>
      </motion.header>

      {/* Body — desktop 2-col, mobile stacked. Centrado horizontalmente
          dentro de un wrapper max-w-[1377px] (mismo tope que Figma). */}
      <motion.main
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: STAGGER_STEP,
              delayChildren: 0.2,
            },
          },
        }}
        className="relative z-10 mx-auto flex w-full max-w-360 flex-1 flex-col gap-10 px-6 py-12 sm:px-10 xl:flex-row xl:items-center xl:gap-[26px] xl:px-[84px] xl:py-[60px]"
      >
        {/* Left — hero content. Cada nodo es un motion.div para stagger. */}
        <div className="flex flex-col items-center xl:max-w-152.75 xl:items-start">
          <motion.p
            variants={staggerItemVariants}
            className="text-center text-[14px] font-bold uppercase sm:text-[18px] xl:text-left xl:text-[20px]"
            style={{
              color: "#00ACFF",
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              lineHeight: "normal",
            }}
          >
            {eyebrow}
          </motion.p>
          {/* Heading Montserrat tracking-[-2.96px] mixed weights.
              line-height responsive: 1.05x sobre el font-size para evitar
              que en mobile el interlineado fijo 80px separe en exceso. */}
          <motion.h1
            variants={staggerItemVariants}
            className="mt-[16px] w-full text-center text-[40px] leading-[1.08] font-bold sm:text-[56px] sm:leading-[1.07] xl:mt-[24px] xl:text-left xl:text-[74px] xl:leading-[80px]"
            style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              color: "#FFFFFF",
              letterSpacing: "-2.96px",
            }}
          >
            {heading}
          </motion.h1>
          {/* CTA Contáctenos — bg #00ACFF. cursor-pointer + hover bg darker. */}
          <motion.div
            variants={staggerItemVariants}
            className="mt-[40px] w-full max-w-[306px] sm:mx-0"
          >
            {hasModal ? (
              <button
                ref={contactBtnRef}
                type="button"
                onClick={handleContactClick}
                className="group inline-flex w-full cursor-pointer items-center justify-center rounded-[4px] border border-[#00ACFF] bg-[#00ACFF] px-[48px] py-[12px] text-[16px] font-semibold text-white [transition:background-color_0.35s_ease-in-out,border-color_0.35s_ease-in-out,box-shadow_0.35s_ease-in-out,transform_0.12s_ease] hover:border-[#2862FF] hover:bg-[#2862FF] hover:shadow-lg hover:shadow-[#2862FF]/30 active:scale-[0.98] sm:text-[18px]"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  lineHeight: "24px",
                  // Mantiene estilos del hover mientras el popover está abierto
                  ...(contactOpen && {
                    backgroundColor: "#2862FF",
                    borderColor: "#2862FF",
                  }),
                  minHeight: "32px",
                }}
              >
                {contactLabel}
              </button>
            ) : (
              <Link
                href={contactHref ?? "#"}
                className="group inline-flex w-full cursor-pointer items-center justify-center rounded-[4px] border border-[#00ACFF] bg-[#00ACFF] px-[48px] py-[12px] text-[16px] font-semibold text-white [transition:background-color_0.35s_ease-in-out,border-color_0.35s_ease-in-out,box-shadow_0.35s_ease-in-out,transform_0.12s_ease] hover:border-[#2862FF] hover:bg-[#2862FF] hover:shadow-lg hover:shadow-[#2862FF]/30 active:scale-[0.98] sm:text-[18px]"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  lineHeight: "24px",
                  minHeight: "32px",
                }}
              >
                {contactLabel}
              </Link>
            )}
          </motion.div>
        </div>

        {/* Right — product cards + metrics + bottom CTAs */}
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 xl:mx-0 xl:max-w-[636px] xl:flex-1">
          {/* Product cards — Caracol Next (w-328 más largo) + Ditu (w-284). */}
          <motion.div
            variants={staggerItemVariants}
            className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-stretch"
          >
            {/* Caracol Next: card + CTA mobile debajo */}
            <div className="flex flex-col gap-3 sm:contents">
              <ProductCard
                variant="caracolnext"
                title={brands.caracolNext.title}
                description={brands.caracolNext.description}
                href={brands.caracolNext.href}
              />
              <Link
                href={brands.caracolNext.href}
                className="group mx-auto inline-flex w-full max-w-[360px] cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-white bg-transparent px-6 py-[12px] text-[14px] font-semibold text-white [transition:background-color_0.35s_ease-in-out,border-color_0.35s_ease-in-out,box-shadow_0.35s_ease-in-out,transform_0.12s_ease] hover:border-[#00ACFF] hover:bg-[#00ACFF]/15 active:scale-[0.98] sm:hidden"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  lineHeight: "24px",
                }}
              >
                {brands.caracolNext.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Ditu: card + CTA mobile debajo */}
            <div className="flex flex-col gap-3 sm:contents">
              <ProductCard
                variant="ditu"
                title={brands.ditu.title}
                description={brands.ditu.description}
                href={brands.ditu.href}
              />
              <Link
                href={brands.ditu.href}
                className="group relative mx-auto inline-flex w-full max-w-[360px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[10px] px-6 py-[12px] text-[14px] font-semibold text-[#FDFDFD] [transition:box-shadow_0.35s_ease-in-out,transform_0.12s_ease] active:scale-[0.98] sm:hidden"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  lineHeight: 1.5,
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to left, #8232F0 0%, #561BDB 100%)",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 transition-opacity duration-[350ms] ease-in-out group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(to left, #561BDB 0%, #8232F0 100%)",
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {brands.ditu.ctaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Metric cards — Spec usuario: en MOBILE se ocultan. Spec Figma:
              widths irregulares (272/340/328/288). 2 filas de 2 cards cada una. */}
          <motion.div
            variants={staggerItemVariants}
            className="hidden flex-col gap-4 sm:flex"
          >
            {/* Row 1 */}
            <div className="flex items-stretch gap-4">
              {stats.slice(0, 2).map((s, i) => (
                <MetricCard
                  key={i}
                  icon={ICON_PATHS[s.icon]}
                  numericValue={s.numericValue}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  fallbackValue={s.value}
                  label={s.label}
                  accent={s.accent ?? "caracolnext"}
                  lgWidth={s.lgWidth}
                />
              ))}
            </div>
            {/* Row 2 */}
            <div className="flex items-stretch gap-4">
              {stats.slice(2, 4).map((s, i) => (
                <MetricCard
                  key={i}
                  icon={ICON_PATHS[s.icon]}
                  numericValue={s.numericValue}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  fallbackValue={s.value}
                  label={s.label}
                  accent={s.accent ?? "caracolnext"}
                  lgWidth={s.lgWidth}
                />
              ))}
            </div>
          </motion.div>

          {/* Bottom CTAs — Conoce Caracol Next + Conoce ditu. Solo sm+. */}
          <motion.div
            variants={staggerItemVariants}
            className="hidden gap-4 sm:flex sm:flex-row lg:gap-[24px]"
          >
            <Link
              href={brands.caracolNext.href}
              className="group inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-white bg-transparent px-6 py-[12px] text-[14px] font-semibold whitespace-nowrap text-white [transition:background-color_0.35s_ease-in-out,border-color_0.35s_ease-in-out,box-shadow_0.35s_ease-in-out,transform_0.12s_ease] hover:border-[#00ACFF] hover:bg-[#00ACFF]/15 hover:shadow-lg hover:shadow-[#00ACFF]/30 active:scale-[0.98] lg:px-[24px] lg:text-[16px]"
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                lineHeight: "24px",
                minHeight: "32px",
              }}
            >
              {brands.caracolNext.ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={brands.ditu.href}
              className="group relative inline-flex flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[10px] px-6 py-[12px] text-[14px] font-semibold whitespace-nowrap text-[#FDFDFD] [transition:box-shadow_0.35s_ease-in-out,transform_0.12s_ease] hover:shadow-lg hover:shadow-[#8232F0]/40 active:scale-[0.98] lg:px-[24px] lg:text-[16px]"
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                lineHeight: 1.5,
              }}
            >
              {/* Gradiente base: derecha #8232F0 → izquierda #561BDB */}
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to left, #8232F0 0%, #561BDB 100%)",
                }}
              />
              {/* Gradiente hover invertido — fade-in 350ms */}
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-0 transition-opacity duration-[350ms] ease-in-out group-hover:opacity-100"
                style={{
                  background: "linear-gradient(to left, #561BDB 0%, #8232F0 100%)",
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                {brands.ditu.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.main>

      {/* Footer copyright pill — Figma 892:6164. Centrado igual que el resto. */}
      <motion.footer
        className="relative z-10 w-full px-6 pb-8 sm:px-10 lg:pb-[40px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.9 }}
      >
        <div className="mx-auto w-full max-w-[1377px] lg:px-[120px]">
          <div
            className="flex items-start justify-center overflow-clip rounded-[90px] p-[10px]"
            style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
          >
            <p
              className="text-[14px] font-semibold whitespace-nowrap text-white sm:text-[16px]"
              style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                lineHeight: "24px",
              }}
            >
              {copyright}
            </p>
          </div>
        </div>
      </motion.footer>

      {/* Modal contacto — abre al hacer click en CTA Contáctenos */}
      {hasModal ? (
        <HomeContactModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          representatives={representatives}
          position={contactPos}
        />
      ) : null}
    </div>
  );
}

/**
 * ProductCard — tarjetas de producto (Caracol Next / Ditu).
 *  - Caracol Next: bg #003381 border #00ACFF w-328
 *  - Ditu: bg gradient #8232F0 → #561BDB border #8232F0 w-284
 *  - Logo h-32 + descripción 14/lh-20 Medium center
 *  - pt-40 pb-30 px-20 gap-24
 */
function ProductCard({
  variant,
  title,
  description,
  href,
}: {
  variant: "caracolnext" | "ditu";
  title: React.ReactNode;
  description: string | string[];
  href: string;
}) {
  const isDitu = variant === "ditu";
  // Soporta 1 string o N párrafos.
  const paragraphs = Array.isArray(description) ? description : [description];

  return (
    <Link
      href={href}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center gap-[24px] rounded-[8px] border px-[20px] pt-[40px] pb-[30px] transition-all duration-500 hover:scale-[1.01] hover:shadow-lg",
        // Mobile/tablet: ambas cards al mismo ancho (w-full) — fix bug
        // "Next ocupa toda la pantalla y desplaza las demás tarjetas".
        // Desktop: Caracol Next más ancho (328) que Ditu (284) per Figma 334:1559.
        isDitu
          ? "mx-auto w-full max-w-[360px] sm:mx-0 sm:max-w-none sm:flex-1 lg:w-[284px] lg:flex-none"
          : "mx-auto w-full max-w-[360px] sm:mx-0 sm:max-w-none sm:flex-1 lg:max-w-[328px]",
      )}
      style={
        isDitu
          ? {
              background: "linear-gradient(180deg, #8232F0 0%, #561BDB 100%)",
              borderColor: "#8232F0",
            }
          : {
              backgroundColor: "#003381",
              borderColor: "#00ACFF",
            }
      }
    >
      <div className="flex h-[32px] items-center justify-center text-white">{title}</div>
      <div className="flex w-full flex-col gap-[8px]">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="w-full text-center text-[14px] font-medium text-white"
            style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              lineHeight: "20px",
            }}
          >
            {para}
          </p>
        ))}
      </div>
    </Link>
  );
}

/**
 * MetricCard — tarjeta métrica con CountUp animation.
 *  - bg #f1f1f1, border #003381 ó #561BDB, rounded-8 p-20 h-149
 *  - Icon 40px absolute top-left
 *  - Number 60/lh-48 ExtraBold text-right (color por accent)
 *  - Label 20/lh-24 SemiBold #464553 text-right
 */
function MetricCard({
  icon,
  numericValue,
  prefix,
  suffix,
  fallbackValue,
  label,
  accent,
  lgWidth,
}: {
  icon: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  fallbackValue: string;
  label: string;
  accent: "caracolnext" | "ditu";
  lgWidth?: number;
}) {
  const borderColor = accent === "ditu" ? "#561BDB" : "#003381";
  const numberColor = accent === "ditu" ? "#12082D" : "#003381";
  // Solo aplicar ancho fijo del Figma en desktop (≥ 1024px).
  // En sm/md los cards son flex-1 iguales para no desbordar el viewport.
  const [isLg, setIsLg] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsLg(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className="relative h-[149px] flex-1 rounded-[8px] border p-[20px]"
      style={{
        backgroundColor: "#F1F1F1",
        borderColor,
        ...(isLg && lgWidth ? { width: `${lgWidth}px`, flex: "0 0 auto" } : {}),
      }}
    >
      {/* Icon top-left 40px */}
      <div className="absolute top-[20px] left-[20px] h-[40px] w-[40px]">
        <Image
          src={icon}
          alt=""
          width={40}
          height={40}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Content right-aligned justified end */}
      <div className="flex h-full flex-col items-end justify-end gap-[4px]">
        <p
          className="text-right text-[40px] font-extrabold whitespace-nowrap sm:text-[48px] lg:text-[60px]"
          style={{
            color: numberColor,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            lineHeight: "48px",
          }}
        >
          {fallbackValue}
        </p>
        <p
          className="text-right text-[16px] font-semibold sm:text-[18px] lg:text-[20px]"
          style={{
            color: "#464553",
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            lineHeight: "24px",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

/**
 * Logo CARACOLMEDIOS | DIGITAL — Figma 334:1559 (397:1981).
 * Layout: logo SVG real w-241 h-32 + divider 1px #D9D9D9 + "DIGITAL" 25/lh-25
 */
function CaracolMediosLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full items-center gap-[24px] sm:w-[395px]", className)}>
      {/* Logo Caracol MEDIOS — h fija, w se adapta a la proporción natural del SVG */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/home/logo-caracol-medios.svg"
        alt="Caracol Medios"
        className="block h-[26px] w-auto flex-shrink-0 sm:h-[32px]"
      />
      {/* Divider — Figma 397:1984 (Rectangle 53): 2×32 px, #D9D9D9.
          self-stretch (sin h-full) deja que flexbox asigne la altura = 32 px del logo.
          h-full + self-stretch compiten: height:100% gana y resuelve a 0 en contenedor auto. */}
      <div
        className="block w-[2px] shrink-0 self-stretch"
        style={{ backgroundColor: "#D9D9D9" }}
        aria-hidden="true"
      />
      {/* "DIGITAL" — Figma 397:1983: Montserrat SemiBold 25/lh-25 white */}
      <p
        className="text-[18px] font-semibold whitespace-nowrap text-white sm:text-[22px] lg:text-[25px]"
        style={{
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          lineHeight: "25px",
        }}
      >
        DIGITAL
      </p>
    </div>
  );
}

/**
 * Wordmark Caracol Next — SVG real extraído del Figma 430:520.
 * Combina 3 paths: orbital eye + texto "CARACOL" + texto "NEXT".
 * Usa `currentColor` para heredar el color del padre (text-white en navy,
 * text-foreground en scrolled).
 */
export function CaracolNextWordmark({ className }: { className?: string }) {
  return (
    <svg
      width="205"
      height="32"
      viewBox="0 0 205 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_892_6206)">
        <path
          d="M20.1211 20.3717C21.8157 23.4419 25.1014 25.5258 28.8792 25.5258C34.3886 25.5258 38.862 21.0837 38.862 15.6069C38.862 14.7504 38.751 13.9198 38.5475 13.1263C43.3799 13.4452 48.0605 14.5242 46.8912 17.6241C45.0819 22.4222 28.6128 28.9112 14.73 29.8197C27.1549 33.4461 57.7288 27.4132 57.5586 17.3237C57.4661 11.7061 46.4805 11.4948 38.2293 12.1326C36.8122 8.37265 33.1602 5.69177 28.8792 5.69177C23.366 5.69177 18.8963 10.1302 18.8963 15.6107C18.8963 16.9085 19.1479 18.1469 19.6067 19.2816C14.5117 18.8552 9.23908 17.6501 10.5896 14.4167C12.5692 9.68528 29.2196 2.03939 43.1282 1.6241C25.0681 -1.10128 0.625262 7.75341 0.455058 15.4401C0.332955 20.9798 11.9291 21.028 20.1211 20.3717Z"
          fill="white"
        />
        <path
          d="M81.9423 8.30589L83.5667 21.4396H80.2847L81.946 8.30589H81.9423ZM79.3745 2.82918L75.6004 29.13H79.3412L79.8333 25.003H84.0218L84.5509 29.13H88.5544L84.7396 2.82918H79.3745Z"
          fill="white"
        />
        <path
          d="M94.2525 6.42965H96.2173C97.2385 6.42965 97.7306 6.9191 97.7306 7.92768V13.4823C97.7306 14.5724 97.1978 15.0952 96.0656 15.0952H94.2525V6.42965ZM94.2525 18.5882H96.0656C97.2385 18.5882 97.7639 19.1147 97.7639 20.2753V29.1337H101.808V20.2011C101.808 18.2137 101.124 17.2014 99.466 16.749C100.939 16.152 101.771 15.0248 101.771 12.6962V7.74598C101.771 4.48295 100.147 2.86997 96.8611 2.86997H90.212V29.1374H94.2562V18.5919L94.2525 18.5882Z"
          fill="white"
        />
        <path
          d="M109.737 8.30589L111.362 21.4396H108.076L109.737 8.30589ZM107.17 2.82918L103.395 29.13H107.136L107.628 25.003H111.821L112.35 29.13H116.353L112.538 2.82918H107.17Z"
          fill="white"
        />
        <path
          d="M125.492 24.2911C125.492 25.3404 125 25.8299 123.983 25.8299H123.228C122.166 25.8299 121.678 25.3404 121.678 24.2911V7.7052C121.678 6.65213 122.166 6.16638 123.228 6.16638H123.905C124.926 6.16638 125.415 6.65213 125.415 7.7052V12.8482H129.381V7.48272C129.381 4.21968 127.798 2.64008 124.508 2.64008H122.547C119.261 2.64008 117.637 4.25305 117.637 7.51609V24.4765C117.637 27.7395 119.261 29.3525 122.547 29.3525H124.549C127.831 29.3525 129.459 27.7395 129.459 24.4765V18.362H125.492V24.2911Z"
          fill="white"
        />
        <path
          d="M139.582 24.2948C139.582 25.3441 139.09 25.8299 138.073 25.8299H137.24C136.182 25.8299 135.694 25.3441 135.694 24.2948V7.70891C135.694 6.65954 136.182 6.17009 137.24 6.17009H138.073C139.09 6.17009 139.582 6.65954 139.582 7.70891V24.2948ZM138.713 2.64378H136.559C133.274 2.64378 131.649 4.25305 131.649 7.5198V24.4802C131.649 27.7432 133.274 29.3562 136.559 29.3562H138.713C141.999 29.3562 143.623 27.7432 143.623 24.4802V7.5198C143.623 4.25305 141.999 2.64378 138.713 2.64378Z"
          fill="white"
        />
        <path
          d="M145.813 2.86626V29.13H154.312V25.4887H149.854V2.86626H145.813Z"
          fill="white"
        />
        <path
          d="M74.3127 12.8482V7.48272C74.3127 4.21968 72.7291 2.64378 69.4397 2.64378H67.475C64.193 2.64378 62.5649 4.25305 62.5649 7.5198V24.4802C62.5649 27.7432 64.1893 29.3562 67.475 29.3562H69.4804C72.7661 29.3562 74.3904 27.7432 74.3904 24.4802V18.3657H70.4239V24.2948C70.4239 25.3441 69.9355 25.8336 68.9143 25.8336H68.1595C67.0976 25.8336 66.6091 25.3441 66.6091 24.2948V7.7052C66.6091 6.65213 67.0976 6.16638 68.1595 6.16638H68.8366C69.8578 6.16638 70.3462 6.65213 70.3462 7.7052V12.8482H74.3127Z"
          fill="white"
        />
        <path
          d="M167.118 2.86627V29.13H164.321L159.607 12.4069L159.37 10.794V29.13H156.499V2.86627H159.259L163.973 19.6079L164.21 21.3655V2.86627H167.118Z"
          fill="white"
        />
        <path
          d="M179.018 5.11703H173.353V14.8431H178.633V17.0976H173.353V26.8792H179.018V29.1337H170.482V2.86627H179.018V5.12073V5.11703Z"
          fill="white"
        />
        <path
          d="M191.424 2.86627L187.31 15.8888L191.387 29.13H188.427L185.815 18.781L183.092 29.13H180.169L184.246 16.1075L180.132 2.86627H183.129L185.852 13.067L188.594 2.86627H191.428H191.424Z"
          fill="white"
        />
        <path
          d="M204.548 2.86627V5.19118H199.909V29.13H196.985V5.19118H192.342V2.86627H204.552H204.548Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_892_6206">
          <rect width="205" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/**
 * Wordmark Ditu inline — SVG real del Figma 5:870 (logo-light variant).
 * Composite: "ditu" wordmark (top) + "por Caracol" byline (bottom).
 *
 * Proporciones exactas del Figma (parent 180x87):
 *  - Wordmark: top 0.63%, left 0.54%, right 1.25%, bottom 28.34%
 *  - Byline: top 80.55%, left 34.46%, right 0.54%, bottom 0.62%
 *
 * Renderiza a 66×32 en el header (escala proporcional al 180×87 original).
 *
 * Si `showByline` es false, devuelve sólo el wordmark "ditu" sin byline
 * (versión limpia para product cards: Figma 334:2080 — 92×32 single SVG).
 */
export function DituWordmark({
  className,
  showByline = true,
}: {
  className?: string;
  showByline?: boolean;
}) {
  // Variante simple sin byline — SVG inline para que herede currentColor.
  // Figma 334:2080 — viewBox 92x32, paths blancos. Usamos `fill="currentColor"`
  // para poder pintar el wordmark con `text-white` o cualquier color via CSS.
  if (!showByline) {
    return (
      <svg
        viewBox="0 0 92 32"
        className={cn("inline-block h-8 w-[92px] text-white", className)}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Ditu"
        preserveAspectRatio="xMidYMid meet"
      >
        <path d="M83.6204 27.1152H83.8279L84.4217 31.2972H92V6.11001H82.9085V19.3304C82.9085 22.3538 81.6157 23.9399 79.2534 23.9399C76.7571 23.9399 75.5983 22.3221 75.5983 19.3304V6.11001H66.5069V21.8251C66.5069 28.6759 69.9609 32 75.394 32C79.1513 32 82.5031 29.4325 83.6204 27.1152Z" />
        <path d="M19.0959 6.46458C19.0959 7.92402 19.2491 8.57934 19.2491 8.57934H19.147C17.8254 6.81599 15.1344 5.4072 11.6293 5.4072C5.3821 5.4072 0 10.1907 0 18.7036C0 27.2165 5.3821 32 11.8336 32C15.3897 32 18.6394 30.1353 19.7567 27.7198H19.9642L20.5579 31.2972H28.1363V0H19.0959V6.46458ZM13.6117 24.5445C10.7163 24.5445 8.48175 22.2271 8.48175 18.7036C8.48175 15.1801 10.7163 12.8627 13.6117 12.8627C16.3027 12.8627 18.7416 14.9268 18.7416 18.7036C18.7416 22.4804 16.3027 24.5445 13.6117 24.5445Z" />
        <path d="M40.8733 6.11001H31.7818V31.294H40.8733V6.11001Z" />
        <path d="M63.7616 23.2624C63.7616 23.2624 62.6507 23.943 61.112 23.943C59.4552 23.943 57.6804 23.237 57.6804 20.9703V14.4298H63.8701V6.11318H43.5037V14.4298H48.7421V22.4298C48.7421 23.3858 48.8443 24.2944 48.9464 25.0985C49.8083 30.1353 53.722 32 57.9868 32C61.6036 32 63.8733 31.1041 63.8733 31.1041V23.2416V23.2416Z" />
      </svg>
    );
  }

  return (
    <span
      className={cn("relative inline-block h-8 w-[66px] overflow-hidden", className)}
      aria-label="Ditu por Caracol"
    >
      {/* Wordmark "ditu" — top (Figma 5:868: inset[0.63% 1.25% 28.34% 0.54%]) */}
      <span
        className="absolute block"
        style={{
          top: "0.63%",
          left: "0.54%",
          right: "1.25%",
          bottom: "28.34%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ditu/logo-ditu-wordmark.svg"
          alt=""
          className="block h-full w-full"
          style={{ maxWidth: "none" }}
        />
      </span>
      {/* Byline "por Caracol" — bottom-right (Figma 5:869: inset[80.55% 0.54% 0.62% 34.46%]) */}
      <span
        className="absolute block"
        style={{
          top: "80.55%",
          left: "34.46%",
          right: "0.54%",
          bottom: "0.62%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ditu/logo-ditu-byline.svg"
          alt=""
          className="block h-full w-full"
          style={{ maxWidth: "none" }}
        />
      </span>
    </span>
  );
}
