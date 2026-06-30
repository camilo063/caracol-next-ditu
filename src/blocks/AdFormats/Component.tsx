"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";

import { Container, Section } from "@/components/ui";
import { brandFromDoc } from "@/lib/brand";
import { mediaUrl } from "@/lib/media";
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

const NAVY_DARK = "#003381";
const TEXT_LIGHT = "rgba(207,206,204,0.81)";
const AZUL_CLARO = "#00ACFF";

/**
 * AdFormatsBlock — implementación 1:1 del frame Figma 347:1706 "Pauta Digital".
 *
 * Specs (Figma MCP):
 *  - Container: bg solid #003381 (navy), border radius asimétrico
 *    `rounded-tr-[180px]` (curva superior derecha 180px).
 *  - Padding p-[120px] en desktop.
 *  - Heading "Pauta Digital": Montserrat Bold 64px line-height 72 white.
 *  - Description: Regular 24px color rgba(207,206,204,0.81).
 *  - 2 columnas (Display | Video & Audio), centered en 760px:
 *    - Column header: Montserrat Medium 32px white tracking -1px + divider.
 *    - Cards: bg rgba(255,255,255,0.02), border rgba(207,206,204,0.81),
 *      rounded-8, min-h-68, gap-16 items-center.
 *      Left icon (check), middle text SemiBold 16px white, right chevron.
 *  - Footer: texto Bold 24px + Regular 24px white centered, CTA bg #00ACFF
 *    306px wide SemiBold 18px white.
 */
export function AdFormatsBlockComponent(props: AdFormatsBlockProps) {
  const mode = props.displayMode ?? "grid";
  if (mode === "vertical-tabs") {
    return <AdFormatsVerticalTabs {...props} />;
  }
  return <AdFormatsDefault {...props} />;
}

function AdFormatsDefault({
  anchorId,
  heading,
  description,
  formats,
  footerCta,
}: AdFormatsBlockProps) {
  const [selectedFormat, setSelectedFormat] = React.useState<FormatItem | null>(null);

  if (!formats || formats.length === 0) return null;

  const displayFormats = formats.filter(
    (f: FormatItem) => CATEGORY_GROUP[f.category ?? "display"] === "display",
  );
  const videoAudioFormats = formats.filter(
    (f: FormatItem) => CATEGORY_GROUP[f.category ?? "display"] === "video",
  );

  const ctaHeading =
    footerCta?.heading ??
    "¡Asegura la presencia de tu marca en los eventos más importantes del país!";
  const ctaDesc =
    footerCta?.description ?? "Contáctanos ahora y diseñemos juntos tu participación.";
  const ctaLabel = footerCta?.label ?? "Descargar Especificaciones";
  // El botón puede llevar a una URL o descargar un archivo subido, según
  // `linkType` en el admin. Si es archivo y está cargado, se usa su URL con
  // atributo download; si no, cae al href (link).
  const ctaFileUrl =
    footerCta?.linkType === "file" ? mediaUrl(footerCta?.file) : undefined;
  const ctaHref = ctaFileUrl ?? footerCta?.href ?? "#contacto";
  const ctaIsDownload = Boolean(ctaFileUrl);

  return (
    <>
      <section id={anchorId ?? "pauta"}>
        <div
          className="relative w-full overflow-hidden px-6 py-12 text-white sm:p-12 lg:p-30"
          style={{
            backgroundColor: NAVY_DARK,
            // Reducido a 100px para consistencia con Calendario (spec usuario).
            borderTopRightRadius: "clamp(40px, 6.9vw, 100px)",
          }}
        >
          <div className="mx-auto flex max-w-300 flex-col gap-12 lg:gap-16">
            {/* Heading + description */}
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-[40px] leading-[1.125] font-bold whitespace-nowrap text-white sm:text-[48px] lg:text-[64px] lg:leading-18">
                {heading || "Pauta Digital"}
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

            {/* 2-col layout: Display | Video & Audio, 343px each, gap 37 */}
            <div className="mx-auto flex w-full flex-col items-center gap-8 sm:flex-row sm:items-baseline sm:justify-center sm:gap-9.25">
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

            {/* Footer: texto + CTA centered */}
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-display text-[16px] leading-normal font-bold text-white sm:text-[20px] lg:text-[24px]">
                  {ctaHeading}
                </p>
                <p className="font-display text-[16px] leading-normal font-normal text-white sm:text-[20px] lg:text-[24px]">
                  {ctaDesc}
                </p>
              </div>
              {ctaIsDownload ? (
                <a
                  href={ctaHref}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "font-display inline-flex h-12 w-76.5 cursor-pointer items-center justify-center rounded-[4px] bg-[#00ACFF] text-[18px] leading-[24px] font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-[#2862FF] active:scale-[0.98]",
                    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  )}
                >
                  {ctaLabel}
                </a>
              ) : (
                <Link
                  href={ctaHref}
                  target={footerCta?.openInNewTab ? "_blank" : undefined}
                  rel={footerCta?.openInNewTab ? "noopener noreferrer" : undefined}
                  className={cn(
                    "font-display inline-flex h-12 w-76.5 cursor-pointer items-center justify-center rounded-[4px] bg-[#00ACFF] text-[18px] leading-[24px] font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-[#2862FF] active:scale-[0.98]",
                    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  )}
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

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
    <div className="flex w-full max-w-[343px] flex-col gap-4">
      <p className="font-display text-[28px] leading-normal font-medium tracking-[-1px] whitespace-nowrap text-white sm:text-[32px]">
        {title}
      </p>
      <div
        className="h-px w-full"
        style={{ backgroundColor: TEXT_LIGHT }}
        aria-hidden="true"
      />
      <ul className="flex flex-col gap-4">
        {items.map((f, index) => (
          <li key={f.id ?? f.name}>
            <FormatPill format={f} onSelect={onSelect} index={index} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Icon checkmark inside circle — Figma "Combined shape 16072". */
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="10" fill="#00ACFF" />
      <path
        d="M6 10.5L8.5 13L14 7.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FormatPill({
  format,
  onSelect,
  index,
}: {
  format: FormatItem;
  onSelect: (f: FormatItem) => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(format)}
      custom={index * 0.07}
      variants={{
        hidden: { opacity: 0, y: 16, scale: 0.98 },
        visible: (delay: number) => ({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay },
        }),
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{
        backgroundColor: "rgba(255,255,255,0.08)",
        borderColor: AZUL_CLARO,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        // rounded-[6px] (antes 8): visualmente menos pronunciado, más tag-like.
        "flex min-h-[68px] w-full cursor-pointer items-center gap-4 rounded-[6px] border px-4 py-2 text-left transition-colors",
        "focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#003381] focus-visible:outline-none",
      )}
      style={{
        backgroundColor: "rgba(255,255,255,0.02)",
        borderColor: TEXT_LIGHT,
      }}
    >
      <CheckCircleIcon className="h-5 w-5 shrink-0" />
      <span className="font-display flex-1 text-[16px] leading-[26px] font-semibold text-white">
        {format.name}
      </span>
      {/* Flecha Figma: chevron 16x16, thinner stroke 1.5. */}
      <ChevronRight className="h-4 w-4 shrink-0 text-white" strokeWidth={1.75} />
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
            {formats.map((f: FormatItem, i: number) => (
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
                {current.brand ? brandFromDoc(current.brand).label + " · " : ""}
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
