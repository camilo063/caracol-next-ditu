"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * DituPautaBlock — Figma 892:6463.
 *
 * Specs Figma:
 *  - Container: gradient 204.26deg #12082D 37.947% → #3B1A93 106.75%,
 *    p-[120px], flex-col gap-[48px], items-start
 *  - Header: sticker "Impulsa tu marca" 48/lh-48 + heading
 *    "con formatos / de alto impacto." 84/lh-84 white + subtitle 22px
 *  - Content layout (gap-[48px] items-start py-[48px] w-1154):
 *    · Sidebar sticky top-0 w-[282.39px]:
 *      - bg-rgba(255,255,255,0.1) backdrop-blur-[12.5px] rounded-[16px] p-[20px]
 *      - Sticker "Formatos de pauta" 24/lh-32
 *      - Tab activa: bg #12082d p-16 rounded-8, dot cyan size-6 + Spline Sans
 *        SemiBold 16 white + arrow right size-24
 *      - Tab inactiva: transparent p-16 h-51 rounded-8, Spline Sans SemiBold
 *        16 white
 *    · Content flex-1 gap-[64px] items-center:
 *      - 3 format cards: border-b rgba(255,255,255,0.4) pb-40 justify-between
 *        ◦ Image left: w-[176px] h-[320px] rounded-[20px], cropped
 *        ◦ Right w-[565px] gap-16:
 *          + Mini sticker w-[49.933px] h-[29.666px], font 16/lh-16
 *          + Title Ditu Display Bold 40/lh-40 uppercase white
 *          + Description Spline Sans Regular 18px white
 *  - CTA: w-1200 gap-24 items-center, text Spline Sans 24, button white
 *    text #561BDB Bold 16 "Descargar Especificaciones"
 *
 * Spec usuario (Camilo):
 *  - Desktop: sidebar sticky a la izquierda. Click categoría cambia contenido
 *    derecha (sin modal, sin scroll)
 *  - Mobile: sidebar → tabs horizontales con scroll
 *  - Transición fade-in suave 300ms ease (Framer Motion AnimatePresence)
 *  - Categoría activa con indicador visual destacado
 */

const CYAN = "#77EDED";
const NAVY_DARK = "#12082D";
const VIOLET_MED = "#561BDB";

type CategoryKey = "ads" | "patrocinio" | "branded" | "eventos";

interface AdFormat {
  /** ID único para key. */
  id: string;
  /** Tag pequeño arriba (e.g. "Ad-s", "Patrocinio"). */
  tag: string;
  /** Título del formato (e.g. "pre-roll", "MID-ROLL"). */
  title: string;
  /** Descripción larga. */
  description: string;
  /** Imagen preview (placeholder por ahora). */
  image?: string;
}

interface Category {
  key: CategoryKey;
  label: string;
  formats: AdFormat[];
}

const CATEGORIES: Category[] = [
  {
    key: "ads",
    label: "Ad's",
    formats: [
      {
        id: "pre-roll",
        tag: "Ad-s",
        title: "pre-roll",
        description:
          "El pre-roll es un anuncio de video que se reproduce antes de que inicie el contenido principal que el usuario ha seleccionado.",
      },
      {
        id: "mid-roll",
        tag: "Ad-s",
        title: "MID-ROLL",
        description:
          "Mid-roll es un anuncio que aparece en una pausa o corte programado durante la reproducción de un contenido.",
      },
      {
        id: "dai",
        tag: "Ad-s",
        title: "DAI",
        description:
          "La pauta DAI se refiere a la inserción de anuncios en los cortes comerciales de canales que transmiten en simultáneo (simulcast) la señal de televisión lineal.",
      },
    ],
  },
  {
    key: "patrocinio",
    label: "Patrocinio",
    formats: [
      {
        id: "patrocinio-canal",
        tag: "Patrocinio",
        title: "patrocinio de canal",
        description:
          "Vincula tu marca a un canal FAST completo con presencia constante en bumpers, billboards y placement editorial.",
      },
      {
        id: "patrocinio-programa",
        tag: "Patrocinio",
        title: "PATROCINIO DE PROGRAMA",
        description:
          "Asocia tu marca con un programa específico de Caracol Televisión vía bumper de entrada, salida y menciones del presentador.",
      },
      {
        id: "patrocinio-evento",
        tag: "Patrocinio",
        title: "PATROCINIO DE EVENTO",
        description:
          "Tu marca presente en los eventos en vivo más importantes — Mundial, Eurocopa, Festival de Cine, conciertos y más.",
      },
    ],
  },
  {
    key: "branded",
    label: "Branded",
    formats: [
      {
        id: "branded-content",
        tag: "Branded",
        title: "branded content",
        description:
          "Contenido original creado en alianza con tu marca — narrativas integradas a la línea editorial de ditu y Caracol Next.",
      },
      {
        id: "branded-series",
        tag: "Branded",
        title: "SERIES PROPIAS",
        description:
          "Co-producimos series y miniseries con tu marca como eje narrativo, distribuidas en ditu y redes sociales.",
      },
      {
        id: "branded-podcast",
        tag: "Branded",
        title: "PODCASTS",
        description:
          "Branded podcasts conducidos por talento Caracol con tu marca presente desde guion hasta distribución.",
      },
    ],
  },
  {
    key: "eventos",
    label: "Eventos especiales",
    formats: [
      {
        id: "eventos-mundial",
        tag: "Eventos",
        title: "MUNDIAL / EUROCOPA",
        description:
          "Activaciones publicitarias premium durante coberturas deportivas masivas — pre/mid-rolls + branding integrado.",
      },
      {
        id: "eventos-festivales",
        tag: "Eventos",
        title: "FESTIVALES",
        description:
          "Patrocinio integral de festivales de música, cine y cultura con cobertura en vivo en Caracol Next.",
      },
      {
        id: "eventos-fechas",
        tag: "Eventos",
        title: "FECHAS ESPECIALES",
        description:
          "20 de Julio, Día del Padre, Día de la Madre — fechas de alto consumo con paquetes publicitarios curados.",
      },
    ],
  },
];

export interface DituPautaProps {
  anchorId?: string;
  stickerLabel?: string;
  heading?: { line1?: string | null; line2?: string | null };
  subtitle?: string;
  sidebarLabel?: string;
  cta?: {
    boldText?: string | null;
    text?: string | null;
    buttonLabel?: string | null;
    buttonHref?: string | null;
  };
  categories?: Category[];
}

const SLIDE_UP = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -5% 0px" } as const,
};
const ease = [0.25, 0.46, 0.45, 0.94] as const;

export function DituPautaBlock({
  anchorId = "pauta",
  stickerLabel = "Impulsa tu marca",
  heading,
  subtitle = "Diseñados para capturar atención en nuestro ecosistema digital — de display a video, audio y patrocinios.",
  sidebarLabel = "Formatos de pauta",
  cta,
  categories: categoriesProp,
}: DituPautaProps) {
  const headingLine1 = heading?.line1 ?? "con formatos";
  const headingLine2 = heading?.line2 ?? "de alto impacto.";
  const ctaBoldText =
    cta?.boldText ??
    "¡Asegura la presencia de tu marca en los eventos más importantes del país!";
  const ctaText = cta?.text ?? "Contáctanos ahora y diseñemos juntos tu participación.";
  const ctaButtonLabel = cta?.buttonLabel ?? "Descargar Especificaciones";
  const ctaButtonHref = cta?.buttonHref ?? "#contacto";
  const finalCategories =
    categoriesProp && categoriesProp.length > 0 ? categoriesProp : CATEGORIES;
  const [activeKey, setActiveKey] = useState<CategoryKey>("ads");
  const active = finalCategories.find((c) => c.key === activeKey) ?? finalCategories[0]!;
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion ? {} : SLIDE_UP;

  return (
    <section
      id={anchorId}
      className="relative w-full overflow-x-clip"
      style={{
        // Figma 892:6463: gradient 204.26deg
        background: "linear-gradient(204.26deg, #12082D 37.947%, #3B1A93 106.75%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-12 px-6 py-24 sm:px-[48px] sm:py-[120px] lg:gap-[48px] lg:py-[120px]">
        {/* Header — Figma 760:9671 */}
        <motion.div
          {...motionProps}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-start gap-[16px]"
        >
          {/* Sticker "Impulsa tu marca" */}
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
              {stickerLabel}
            </p>
          </div>

          {/* Heading 84/lh-84 — 2 lines */}
          <h2
            className="font-display text-[42px] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]"
            style={{ lineHeight: 1 }}
          >
            <span className="block">{headingLine1}</span>
            <span className="block">{headingLine2}</span>
          </h2>

          {/* Subtitle */}
          <p
            className="max-w-[1200px] text-[16px] text-white sm:text-[20px] lg:text-[22px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              lineHeight: "normal",
            }}
          >
            {subtitle}
          </p>
        </motion.div>

        {/* Content layout: sidebar + content area */}
        <motion.div
          {...motionProps}
          transition={{ duration: 0.6, ease, delay: 0.12 }}
          className="flex w-full flex-col items-start gap-8 py-6 lg:flex-row lg:gap-[48px] lg:py-[48px]"
        >
          {/* Sidebar — desktop sticky / mobile horizontal scroll */}
          <PautaSidebar
            categories={finalCategories}
            activeKey={activeKey}
            onSelect={setActiveKey}
            sidebarLabel={sidebarLabel}
          />

          {/* Content — formats list with fade-in transition between categories */}
          <div className="flex flex-1 flex-col items-center gap-12 lg:gap-[64px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex w-full flex-col gap-12 lg:gap-[64px]"
              >
                {active.formats.map((format, idx) => (
                  <FormatRow
                    key={format.id}
                    format={format}
                    isLast={idx === active.formats.length - 1}
                    index={idx}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTA bottom */}
        <motion.div
          {...motionProps}
          transition={{ duration: 0.6, ease, delay: 0.22 }}
          className="flex w-full flex-col items-center gap-[24px]"
        >
          <p
            className="max-w-[1200px] text-center text-[18px] text-white sm:text-[20px] lg:text-[24px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              lineHeight: "normal",
            }}
          >
            <span className="font-bold">{ctaBoldText}</span> {ctaText}
          </p>
          <Link
            href={ctaButtonHref}
            className="inline-flex items-center justify-center rounded-[10px] border bg-white px-[50px] py-[12px] text-[16px] font-bold whitespace-nowrap transition-opacity hover:opacity-90"
            style={{
              borderColor: "#FFFFFF",
              color: VIOLET_MED,
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              lineHeight: 1.5,
            }}
          >
            {ctaButtonLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================================
 * PautaSidebar
 *
 * Desktop: sticky top-0, bg-white/10 backdrop-blur, rounded-16, vertical tabs.
 *   Tab activa = bg-navy + dot cyan + arrow right.
 * Mobile: scroll horizontal con tabs como pills.
 * ============================================================================ */

function PautaSidebar({
  categories,
  activeKey,
  onSelect,
  sidebarLabel,
}: {
  categories: Category[];
  activeKey: CategoryKey;
  onSelect: (k: CategoryKey) => void;
  sidebarLabel: string;
}) {
  return (
    <>
      {/* Desktop sidebar — sticky */}
      <aside
        className="hidden flex-col gap-[16px] rounded-[16px] p-[20px] lg:sticky lg:top-20 lg:flex lg:w-[282.39px] lg:shrink-0 lg:self-start"
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12.5px)",
        }}
      >
        {/* Sticker "Formatos de pauta" — variante small (Figma 760:8780) */}
        <div
          className="inline-flex w-fit items-center rounded-[8px] px-[8px] py-[6px]"
          style={{
            backgroundColor: CYAN,
            color: NAVY_DARK,
            transform: "rotate(-1.97deg)",
          }}
        >
          <p
            className="font-display text-[20px] font-bold whitespace-nowrap uppercase lg:text-[24px]"
            style={{ lineHeight: "32px" }}
          >
            {sidebarLabel}
          </p>
        </div>

        {/* Tabs verticales */}
        {categories.map((cat) => {
          const isActive = activeKey === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onSelect(cat.key)}
              className="flex items-center gap-[8px] rounded-[8px] p-[16px] text-left transition-colors"
              style={{
                backgroundColor: isActive ? NAVY_DARK : "transparent",
                minHeight: "51px",
              }}
            >
              {isActive ? (
                <span
                  className="inline-block size-[6px] shrink-0 rounded-full"
                  style={{ backgroundColor: CYAN }}
                  aria-hidden="true"
                />
              ) : null}
              <p
                className="flex-1 text-[16px] font-semibold text-white"
                style={{
                  fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                  lineHeight: "normal",
                }}
              >
                {cat.label}
              </p>
              {isActive ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-[24px] shrink-0 text-white"
                  aria-hidden="true"
                >
                  <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z" />
                </svg>
              ) : null}
            </button>
          );
        })}
      </aside>

      {/* Mobile: horizontal scroll tabs con tab activa centrada */}
      <MobileTabsScroll
        categories={categories}
        activeKey={activeKey}
        onSelect={onSelect}
      />
    </>
  );
}

function MobileTabsScroll({
  categories,
  activeKey,
  onSelect,
}: {
  categories: Category[];
  activeKey: CategoryKey;
  onSelect: (k: CategoryKey) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const activeIdx = categories.findIndex((c) => c.key === activeKey);
    const btn = btnRefs.current[activeIdx];
    if (!container || !btn) return;
    const containerCenter = container.offsetWidth / 2;
    const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
    container.scrollTo({ left: btnCenter - containerCenter, behavior: "smooth" });
  }, [activeKey, categories]);

  return (
    <div
      ref={containerRef}
      className="-mx-6 w-screen scrollbar-none overflow-x-auto px-6 lg:hidden"
    >
      <div className="flex gap-2 pb-2">
        {categories.map((cat, idx) => {
          const isActive = activeKey === cat.key;
          return (
            <button
              key={cat.key}
              ref={(el) => {
                btnRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => onSelect(cat.key)}
              className="font-display inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[14px] font-semibold whitespace-nowrap transition-colors"
              style={{
                backgroundColor: isActive ? CYAN : "transparent",
                borderColor: CYAN,
                color: isActive ? NAVY_DARK : "#FFFFFF",
                fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              }}
            >
              {isActive ? (
                <span
                  className="inline-block size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: NAVY_DARK }}
                  aria-hidden="true"
                />
              ) : null}
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
 * FormatRow — Figma 760:9402+ (cada card del format list)
 *
 * Layout: flex justify-between, border-b excepto la última.
 *  - Image left: w-176 h-320 rounded-20 (cropped)
 *  - Content right: w-565 gap-16
 *    · Mini sticker tag w-50 h-30 (cyan, font 16/lh-16)
 *    · Title 40/lh-40 uppercase white
 *    · Description 18px Spline Sans white
 * ============================================================================ */

function FormatRow({
  format,
  isLast,
  index,
}: {
  format: AdFormat;
  isLast: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.08 }}
      className={`flex w-full items-start justify-between gap-6 pb-10 lg:gap-12 ${
        isLast ? "" : "border-b"
      }`}
      style={isLast ? undefined : { borderColor: "rgba(255,255,255,0.4)" }}
    >
      {/* Image preview — w-176 h-320 rounded-20 (cropped, top-aligned) */}
      <div className="relative h-[200px] w-[100px] shrink-0 overflow-hidden rounded-[20px] sm:h-[280px] sm:w-[140px] lg:h-[320px] lg:w-[176px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={format.image ?? "/ditu/pauta-card.png"}
          alt=""
          className="absolute block"
          style={{
            // Figma crop exacto: h-125.96% w-106.89% top-(-4.98%) left-(-5.96%)
            width: "106.89%",
            height: "125.96%",
            top: "-4.98%",
            left: "-5.96%",
            maxWidth: "none",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Content right */}
      <div className="flex flex-1 flex-col items-start gap-[16px]">
        {/* Mini sticker tag */}
        <div
          className="inline-flex w-fit items-center rounded-[8px] px-[8px] py-[6px]"
          style={{
            backgroundColor: CYAN,
            color: NAVY_DARK,
            transform: "rotate(-1.97deg)",
          }}
        >
          <p
            className="font-display text-[14px] font-bold whitespace-nowrap uppercase lg:text-[16px]"
            style={{ lineHeight: "16px" }}
          >
            {format.tag}
          </p>
        </div>

        {/* Title 40/lh-40 */}
        <h3
          className="font-display text-[28px] font-bold text-white uppercase sm:text-[34px] lg:text-[40px]"
          style={{ lineHeight: "40px" }}
        >
          {format.title}
        </h3>

        {/* Description */}
        <p
          className="w-full text-[14px] text-white sm:text-[16px] lg:text-[18px]"
          style={{
            fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
            lineHeight: "normal",
          }}
        >
          {format.description}
        </p>
      </div>
    </motion.div>
  );
}

export type { Category, AdFormat, CategoryKey };
