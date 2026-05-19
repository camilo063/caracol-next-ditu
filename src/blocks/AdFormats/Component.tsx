"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ChevronRight, Play } from "lucide-react";

import { Container, Section } from "@/components/ui";
import { brandMeta } from "@/lib/brand";
import { cn } from "@/lib/utils";
import type { AdFormatsBlockProps } from "../types";
import { FormatModal } from "./FormatModal";

const CATEGORY_GROUP: Record<string, "display" | "video"> = {
  display: "display",
  branded: "display",
  sponsorship: "display",
  multigallery: "display",
  video: "video",
  audio: "video",
};

type FormatItem = NonNullable<AdFormatsBlockProps["formats"]>[number];

/**
 * AdFormatsBlock — 4 displayModes:
 * - grid          → default Caracol Next (2-col split + checkmarks + modal).
 * - table         → tabla
 * - accordion     → acordeón
 * - vertical-tabs → lista vertical + preview (Ditu).
 */
export function AdFormatsBlockComponent(props: AdFormatsBlockProps) {
  const mode = props.displayMode ?? "grid";
  if (mode === "vertical-tabs") {
    return <AdFormatsVerticalTabs {...props} />;
  }
  return <AdFormatsDefault {...props} />;
}

/* =============================================================================
   DEFAULT — "Pauta Digital" (Caracol Next)
   Layout: rounded section azul deep, 2-col (Display | Video & Audio).
   Cada item es un pill outline con checkmark + chevron, hover Framer Motion
   200ms, click → FormatModal.
   ============================================================================= */

function AdFormatsDefault({
  anchorId,
  eyebrow,
  heading,
  description,
  formats,
  footerCta,
}: AdFormatsBlockProps) {
  const [selectedFormat, setSelectedFormat] = React.useState<FormatItem | null>(null);

  if (!formats || formats.length === 0) return null;

  const displayFormats = formats.filter(
    (f) => CATEGORY_GROUP[f.category ?? "display"] === "display",
  );
  const videoAudioFormats = formats.filter(
    (f) => CATEGORY_GROUP[f.category ?? "display"] === "video",
  );

  const ctaHeading =
    footerCta?.heading ??
    "¡Asegura la presencia de tu marca en los eventos más importantes del país!";
  const ctaDesc =
    footerCta?.description ?? "Contáctanos ahora y diseñemos juntos tu participación.";
  const ctaLabel = footerCta?.label ?? "Descargar Especificaciones";
  const ctaHref = footerCta?.href ?? "#contacto";

  return (
    <>
      <section id={anchorId ?? "pauta"} className="px-2 py-6 sm:px-4 sm:py-10 lg:px-8">
        <div
          className="relative mx-auto overflow-hidden rounded-[2rem] py-14 text-white sm:rounded-[2.5rem] sm:py-20"
          style={{
            background: "linear-gradient(180deg, #003380 0%, #003CCA 50%, #003380 100%)",
          }}
        >
          <Container size="xl">
            {eyebrow ? (
              <p className="text-fluid-tag font-bold tracking-[0.18em] text-white/80 uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="font-display text-fluid-display mt-2 font-black text-white">
              {heading || "Pauta Digital"}
            </h2>
            {description ? (
              <p className="text-fluid-body mt-3 max-w-2xl text-white/80">
                {description}
              </p>
            ) : null}

            {/* 2-col grid — mobile (<md) stacks vertical */}
            <div className="mx-auto mt-12 grid max-w-3xl gap-8 md:grid-cols-2 md:gap-10">
              <FormatColumn
                title="Display"
                items={displayFormats}
                onSelect={setSelectedFormat}
              />
              <FormatColumn
                title="Video & Audio"
                items={videoAudioFormats}
                onSelect={setSelectedFormat}
              />
            </div>

            {/* CTA inferior */}
            <div className="mt-12 flex flex-col items-center gap-3 text-center">
              <p className="text-fluid-subtitle max-w-3xl font-bold">{ctaHeading}</p>
              <p className="text-fluid-body text-white/85">{ctaDesc}</p>
              <Link
                href={ctaHref}
                className={cn(
                  "mt-2 inline-flex items-center justify-center rounded-md px-8 py-3 text-sm font-bold text-white transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:outline-none",
                )}
                style={{ backgroundColor: "#2862FF" }}
              >
                {ctaLabel}
              </Link>
            </div>
          </Container>
        </div>
      </section>

      {/* Modal global del bloque */}
      <FormatModal
        open={selectedFormat !== null}
        format={selectedFormat}
        onClose={() => setSelectedFormat(null)}
      />
    </>
  );
}

function FormatColumn({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: FormatItem[];
  onSelect: (f: FormatItem) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="font-display border-b border-white/30 pb-2 text-2xl font-bold text-white">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {items.map((f) => (
          <li key={f.id ?? f.name}>
            <FormatPill format={f} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FormatPill({
  format,
  onSelect,
}: {
  format: FormatItem;
  onSelect: (f: FormatItem) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(format)}
      initial={false}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border border-white/30 bg-white/[0.02] px-4 py-3 text-left",
        "focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#003380] focus-visible:outline-none",
      )}
    >
      {/* Checkmark circle azul */}
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: "#2862FF" }}
      >
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </span>
      <span className="flex-1 text-sm font-semibold text-white">{format.name}</span>
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/40 text-white"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </span>
    </motion.button>
  );
}

/* =============================================================================
   VERTICAL-TABS — Ditu (sin cambios)
   ============================================================================= */

function AdFormatsVerticalTabs({
  anchorId,
  eyebrow,
  heading,
  description,
  formats,
}: AdFormatsBlockProps) {
  const [active, setActive] = React.useState(0);
  if (!formats || formats.length === 0) return null;
  const current = formats[Math.min(active, formats.length - 1)]!;

  return (
    <Section
      id={anchorId ?? "pauta"}
      padding="lg"
      className="text-white"
      style={{
        background: "linear-gradient(180deg, #2A1F5E 0%, #1F1647 100%)",
      }}
    >
      <Container size="xl">
        <p
          className="text-xs font-bold tracking-[0.18em] uppercase"
          style={{ color: "#77EDED" }}
        >
          {eyebrow ?? "Impulsa tu marca"}
        </p>
        <h2 className="font-display mt-3 text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
          {heading}
        </h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-base text-white/80">{description}</p>
        ) : null}

        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          <ul className="space-y-2">
            {formats.map((f, i) => (
              <li key={f.id ?? f.name}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold tracking-wide uppercase transition-colors",
                    active === i
                      ? "border-[#77EDED] bg-[#77EDED]/15 text-[#77EDED]"
                      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
                  )}
                >
                  <span>{f.name}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div
              className="relative aspect-[16/9] w-full"
              style={{
                background:
                  "linear-gradient(135deg, #8232F0 0%, #561BDB 60%, #1F1647 100%)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg">
                  <Play className="ml-1 h-6 w-6 fill-current text-[#1F1647]" />
                </span>
              </div>
              <span
                className="absolute top-5 left-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase"
                style={{ backgroundColor: "#77EDED", color: "#1F1647" }}
              >
                {current.category ?? "Video"}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-bold">{current.name}</h3>
              <p className="mt-2 text-sm text-white/80">
                {current.brand ? brandMeta(current.brand).label + " · " : ""}
                Asegura la presencia de tu marca en los contenidos más importantes del
                país.
              </p>
              {current.downloadUrl ? (
                <Link
                  href={current.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-bold underline"
                  style={{ color: "#77EDED" }}
                >
                  Descargar especificaciones →
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// Mantengo el export para no romper imports
export { FormatModal };
