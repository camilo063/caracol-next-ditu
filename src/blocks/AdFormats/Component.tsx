"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
 * AdFormatsBlock — "Pauta Digital": 2-column split selector list.
 * Matching Figma `caracol-next.png`: izquierda Display, derecha Video & Audio.
 */
export function AdFormatsBlockComponent({
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
