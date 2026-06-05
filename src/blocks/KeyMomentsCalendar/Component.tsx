"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Container } from "@/components/ui";
import { formatDateRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { KeyMomentsBlockProps } from "../types";

/**
 * KeyMomentsCalendarBlock — implementación 1:1 del frame Figma 401:913
 * "Calendario" del Mediakit Caracol Design System.
 *
 * Specs (extraídos vía Figma MCP):
 *  - Container: bg solid #003381 (navy), border-radius asimétrico
 *    `rounded-bl-[180px]` (curva inferior izquierda 180px).
 *  - Padding interno: 120px en desktop (gap-64 entre secciones).
 *  - Heading "Calendario": Montserrat Bold 64px line-height 72px white.
 *  - Description: Montserrat Regular 24px color rgba(207,206,204,0.81).
 *  - Grid 4-col gap-24 con cards de 282px ancho fijo.
 *  - Cards: glassmorphism (bg rgba(0,172,255,0.1) + backdrop-blur-10),
 *    border #95999A, rounded-12, padding px-16 py-20, gap-18.
 *  - Badge categoría: bg color/categoria (6 colores), text Bold 12px white uppercase.
 *  - Card title: Montserrat Bold 24px white.
 *  - Card desc: Montserrat Regular 16px line-height 24 color rgba(207,206,204,0.81).
 *  - Footer CTA: bg #00ACFF (azul claro, no azul medio), 306px wide, SemiBold 18px.
 *
 * Mobile: carrusel horizontal scroll-snap.
 */

/** Colores de categoría según el design system Figma (Categorias/01..06). */
const CATEGORY_COLORS: Record<string, string> = {
  // Mapping semántico → token Figma.
  sports: "#2862FF", // Categorias/01 azul medio
  news: "#0000C4", // Categorias/02 azul oscuro
  special: "#FFC200", // Categorias/03 amarillo
  entertainment: "#A139C6", // Categorias/04 morado
  promo: "#FF0013", // Categorias/05 rojo
  cyan: "#05E8FD", // Categorias/06 cyan
  other: "#2862FF",
};

const NAVY_DARK = "#003381";
const PILL_GREY_BORDER = "#95999A";
const TEXT_LIGHT = "rgba(207,206,204,0.81)";
const AZUL_CLARO = "#00ACFF";

type EventItem = NonNullable<KeyMomentsBlockProps["events"]>[number];

export function KeyMomentsCalendarComponent({
  anchorId,
  heading,
  description,
  events,
  displayMode,
  ctaText,
}: KeyMomentsBlockProps) {
  if (!events || events.length === 0) return null;
  const mode = displayMode ?? "grid";
  const cappedEvents = events.slice(0, 12);

  const ctaHeading =
    ctaText?.heading ??
    "¡Asegura la presencia de tu marca en los eventos más importantes del país!";
  const ctaDesc =
    ctaText?.description ?? "Contáctanos ahora y diseñemos juntos tu participación.";
  const ctaLabel = ctaText?.label ?? "Contáctenos";
  const ctaHref = ctaText?.href ?? "#contacto";

  return (
    <section id={anchorId ?? "momentos"}>
      <div
        className="relative w-full overflow-hidden px-6 py-12 pb-16 text-white sm:p-12 lg:p-30"
        style={{
          backgroundColor: NAVY_DARK,
          // Border radius asimétrico Figma — reducido de 180px a 100px
          // (spec usuario: "Reducir la redondez a aproximadamente 100px").
          borderBottomLeftRadius: "clamp(40px, 6.9vw, 100px)",
        }}
      >
        <Container size="xl" className="!p-0">
          {/* Heading + descripción — gap-16 entre ellos. */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-[40px] leading-[1.125] font-bold whitespace-nowrap text-white sm:text-[48px] lg:text-[64px] lg:leading-[72px]">
              {heading || "Calendario"}
            </h2>
            {description ? (
              <p
                className="font-display text-[16px] leading-normal font-normal sm:text-[20px] lg:text-[24px]"
                style={{ color: TEXT_LIGHT }}
              >
                {description}
              </p>
            ) : null}
          </div>

          {/* Cards container — carrusel mobile, grid 4-col lg.
              Spacing top: 64px en lg (matching Figma gap-64). */}
          {mode === "list" ? (
            <CalendarList events={cappedEvents} />
          ) : (
            // Mobile: el slider extiende -mx-8 contra el padding-8 del bloque
            // para que las cards lleguen al borde de la pantalla (spec mobile).
            // Desktop: grid 4 col sin anchos fijos en las cards.
            <div
              className={cn(
                "mt-10 flex [scrollbar-width:none] gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
                "-mx-8 snap-x snap-mandatory scroll-px-8 px-8 sm:-mx-12 sm:scroll-px-12 sm:px-12",
                "lg:mx-0 lg:mt-16 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0",
              )}
            >
              {cappedEvents.map((e: EventItem, index: number) => (
                <CalendarCard key={e.id ?? e.name} event={e} index={index} />
              ))}
            </div>
          )}

          {/* Footer CTA — gap-24 entre texto y botón (Figma 634:4283). */}
          <div className="mt-6 flex flex-col items-center gap-6 text-center sm:mt-16">
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="font-display text-[16px] leading-normal font-bold text-white sm:text-[20px] lg:text-[24px]">
                {ctaHeading}
              </p>
              <p className="font-display text-[16px] leading-normal font-normal text-white sm:text-[20px] lg:text-[24px]">
                {ctaDesc}
              </p>
            </div>
            <Link
              href={ctaHref}
              className={cn(
                "font-display inline-flex h-12 w-76.5 cursor-pointer items-center justify-center rounded-[4px] bg-[#00ACFF] text-[18px] leading-[24px] font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-[#2862FF] active:scale-[0.98]",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              )}
            >
              {ctaLabel}
            </Link>
          </div>
        </Container>
      </div>
    </section>
  );
}

function CalendarCard({ event, index }: { event: EventItem; index: number }) {
  const cat = event.category ?? "other";
  const badgeColor = event.badgeColor ?? CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.other;
  const dateLabel =
    event.dateLabelOverride ??
    formatDateRange(event.dateStart, event.dateEnd ?? undefined).toUpperCase();
  const categoryLabel = event.categoryLabel ?? "CATEGORÍA";

  return (
    <motion.article
      custom={index * 0.08}
      variants={{
        hidden: { opacity: 0, y: 28, scale: 0.97 },
        visible: (delay: number) => ({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay },
        }),
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -2, borderColor: `${badgeColor}80` }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        // Mobile carrusel: 1.5 → 2.5 → 3.5 cards visibles según breakpoint.
        "shrink-0 snap-start",
        "w-[67%]",
        "sm:w-[38%]",
        "md:w-[27%]",
        "lg:w-auto lg:shrink",
        // Visual de la card — glassmorphism Figma.
        "flex flex-col gap-[18px] rounded-[12px] border px-4 py-5",
        "backdrop-blur-[10px]",
      )}
      style={{
        backgroundColor: "rgba(0,172,255,0.1)",
        borderColor: PILL_GREY_BORDER,
      }}
    >
      <div className="flex flex-col items-start gap-2">
        <span
          className="font-display inline-flex items-center justify-center rounded-[4px] px-2 py-1 text-[12px] leading-[12px] font-bold text-white uppercase"
          style={{ backgroundColor: badgeColor }}
        >
          {categoryLabel}
        </span>
        {dateLabel ? (
          <p className="font-display text-[14px] leading-[20px] font-semibold text-white">
            {dateLabel}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col items-start gap-2">
        <h3 className="font-display text-[24px] leading-tight font-bold text-white">
          {event.name}
        </h3>
        {event.description ? (
          <p
            className="font-display text-[16px] leading-[24px] font-normal"
            style={{ color: TEXT_LIGHT }}
          >
            {event.description}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}

function CalendarList({ events }: { events: EventItem[] }) {
  return (
    <ul className="mt-10 divide-y divide-white/20 border-y border-white/20">
      {events.map((e) => (
        <li
          key={e.id ?? e.name}
          className="grid items-center gap-2 py-5 md:grid-cols-[200px_1fr_auto]"
        >
          <span className="font-display text-xl font-extrabold">{e.name}</span>
          <p className="text-sm text-white/80">{e.description}</p>
          {e.cta?.label && e.cta?.href ? (
            <Link href={e.cta.href} className="text-sm font-bold text-white underline">
              {e.cta.label} →
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
