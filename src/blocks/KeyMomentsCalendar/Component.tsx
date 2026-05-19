"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Container } from "@/components/ui";
import { formatDateRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { KeyMomentsBlockProps } from "../types";

/**
 * KeyMomentsCalendarBlock — "Calendario" (matching Figma adjunto).
 *
 * Layout:
 *  - Sección con bg gradiente azul deep + rounded-3xl.
 *  - Título "Calendario" display + descripción + grid/carrusel de cards.
 *  - Mobile: carrusel horizontal scroll-snap.
 *      smallest → 1.5 cards visibles
 *      sm       → 2.5
 *      md       → 3.5
 *      lg+      → grid 4-col estático (3 filas = 12 cards máx).
 *
 * Cards:
 *  - Pill "CATEGORÍA" (color badge) + date label small caps + título + descripción.
 *  - Hover: translateY -2px + border del badgeColor @ 0.5 opacity, 200ms ease.
 *
 * CTA inferior: link directo, sin animación especial.
 */

const CATEGORY_FALLBACK_COLORS: Record<string, string> = {
  sports: "#015BC4",
  entertainment: "#A139C6",
  news: "#FF6F00",
  special: "#FFC200",
  other: "#5C6BC0",
};

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
    <section id={anchorId ?? "momentos"} className="py-6 sm:py-10">
      <div
        className="relative w-full overflow-hidden rounded-[2rem] py-14 text-white sm:rounded-[2.5rem] sm:py-20"
        style={{
          background: "linear-gradient(180deg, #003380 0%, #003CCA 50%, #003380 100%)",
        }}
      >
        <Container size="xl">
          <h2 className="font-display text-fluid-display font-black text-white">
            {heading || "Calendario"}
          </h2>
          {description ? (
            <p className="text-fluid-body mt-3 max-w-2xl text-white/80">{description}</p>
          ) : null}

          {/* Cards container — carrusel mobile, grid lg */}
          {mode === "list" ? (
            <CalendarList events={cappedEvents} />
          ) : (
            <div
              className={cn(
                "mt-10 flex [scrollbar-width:none] gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
                "-mx-1 snap-x snap-mandatory scroll-px-4 px-1 sm:scroll-px-6",
                "lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:pb-0",
              )}
            >
              {cappedEvents.map((e) => (
                <CalendarCard key={e.id ?? e.name} event={e} />
              ))}
            </div>
          )}

          {/* CTA inferior — link directo */}
          <div className="mt-12 flex flex-col items-center gap-3 text-center sm:mt-16">
            <p className="text-fluid-subtitle max-w-3xl font-bold">{ctaHeading}</p>
            <p className="text-fluid-body text-white/85">{ctaDesc}</p>
            <Link
              href={ctaHref}
              className={cn(
                "mt-2 inline-flex items-center justify-center rounded-md px-8 py-3 text-sm font-bold text-white transition-colors",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              )}
              style={{ backgroundColor: "#2862FF" }}
            >
              {ctaLabel}
            </Link>
          </div>
        </Container>
      </div>
    </section>
  );
}

function CalendarCard({ event }: { event: EventItem }) {
  const cat = event.category ?? "other";
  const badgeColor =
    event.badgeColor ?? CATEGORY_FALLBACK_COLORS[cat] ?? CATEGORY_FALLBACK_COLORS.other;
  const dateLabel =
    event.dateLabelOverride ??
    formatDateRange(event.dateStart, event.dateEnd ?? undefined).toUpperCase();
  const categoryLabel = event.categoryLabel ?? "CATEGORÍA";

  return (
    <motion.article
      initial={false}
      whileHover={{
        y: -2,
        borderColor: `${badgeColor}80`, // alpha 0.5 ≈ hex "80"
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        // Mobile carrusel widths: 1.5 → 2.5 → 3.5 progresivo.
        "shrink-0 snap-start",
        "w-[66%]",
        "sm:w-[40%]",
        "md:w-[28%]",
        "lg:w-auto lg:shrink",
        // Visual de la card.
        "flex flex-col gap-3 rounded-2xl border-2 border-white/10 bg-[#0D3AA0] p-5",
      )}
    >
      <span
        className="inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase"
        style={{ backgroundColor: badgeColor }}
      >
        {categoryLabel}
      </span>
      {dateLabel ? (
        <p className="text-fluid-tag font-bold tracking-wider text-white uppercase">
          {dateLabel}
        </p>
      ) : null}
      <h3 className="font-display text-lg leading-tight font-extrabold text-white sm:text-xl">
        {event.name}
      </h3>
      {event.description ? (
        <p className="text-fluid-body-sm leading-relaxed text-white/75">
          {event.description}
        </p>
      ) : null}
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
