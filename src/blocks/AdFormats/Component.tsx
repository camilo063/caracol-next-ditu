"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";

import { Button, Container, Section } from "@/components/ui";
import { brandMeta } from "@/lib/brand";
import { cn } from "@/lib/utils";
import type { AdFormatsBlockProps } from "../types";

const CATEGORY_GROUP: Record<string, "display" | "video"> = {
  display: "display",
  branded: "display",
  sponsorship: "display",
  multigallery: "display",
  video: "video",
  audio: "video",
};

/**
 * AdFormatsBlock — soporta 4 displayModes:
 * - grid       → cards 3-col
 * - table      → tabla
 * - accordion  → acordeón
 * - vertical-tabs → lista vertical izquierda + preview grande derecha (Ditu).
 *
 * El default `grid` se renderiza en fondo azul Caracol Next.
 * El `vertical-tabs` se renderiza en fondo violeta Ditu.
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
  eyebrow,
  heading,
  description,
  formats,
}: AdFormatsBlockProps) {
  if (!formats || formats.length === 0) return null;
  const displayFormats = formats.filter(
    (f) => CATEGORY_GROUP[f.category ?? "display"] === "display",
  );
  const videoAudioFormats = formats.filter(
    (f) => CATEGORY_GROUP[f.category ?? "display"] === "video",
  );

  return (
    <Section
      id={anchorId ?? "pauta"}
      padding="lg"
      className="text-white"
      style={{
        background: "linear-gradient(180deg, #015BC4 0%, #003CCA 60%, #003380 100%)",
      }}
    >
      <Container size="xl">
        <p className="text-xs font-bold tracking-[0.18em] text-white/80 uppercase">
          {eyebrow ?? "Pauta Digital"}
        </p>
        <h2 className="font-display mt-3 text-3xl font-black sm:text-4xl">{heading}</h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-base text-white/80">{description}</p>
        ) : null}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <FormatColumn title="Display" items={displayFormats} />
          <FormatColumn title="Video & Audio" items={videoAudioFormats} />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-sm">
            ¡Asegura la presencia de tu marca en los eventos más importantes del país!
          </p>
          <p className="text-xs text-white/80">
            Contáctanos ahora y diseñemos juntos tu participación.
          </p>
          <Button
            variant="default"
            asChild
            className="bg-white text-[#003380] hover:bg-white/90"
          >
            <Link href="#contacto">Descargar Especificaciones</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

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
          {/* Vertical tabs */}
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

          {/* Preview */}
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

type FormatItem = NonNullable<AdFormatsBlockProps["formats"]>[number];

function FormatColumn({ title, items }: { title: string; items: FormatItem[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="font-display text-2xl font-extrabold">{title}</h3>
      <ul className="mt-4 space-y-2">
        {items.map((f) => (
          <li key={f.id ?? f.name}>
            <FormatPill format={f} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FormatPill({ format }: { format: FormatItem }) {
  const brandLabel = format.brand ? brandMeta(format.brand).label : null;
  return (
    <button
      type="button"
      className={cn(
        "border-border bg-card text-card-foreground hover:bg-background flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 rounded-full bg-[#015BC4]"
        />
        <div>
          <p className="text-sm font-bold">{format.name}</p>
          {brandLabel ? (
            <p className="text-muted-foreground text-[10px] font-semibold uppercase">
              {brandLabel}
            </p>
          ) : null}
        </div>
      </div>
      <ChevronRight className="text-muted-foreground h-4 w-4" />
    </button>
  );
}
