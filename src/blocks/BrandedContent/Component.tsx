"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

import { Container, Section } from "@/components/ui";
import { mediaAlt, mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { BrandedContentBlockProps } from "../types";

/**
 * BrandedContentBlock — vista "feature" (matching Figma `caracol-next.png`).
 * Heading + lista de pills (categorías) + thumbnail/preview grande del item activo.
 * Si layout=carousel, mantenemos el carrusel legacy.
 */
export function BrandedContentBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  items,
}: BrandedContentBlockProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  if (!items || items.length === 0) return null;
  const active = items[Math.min(activeIndex, items.length - 1)]!;
  const url = mediaUrl(active.image);

  return (
    <Section id={anchorId ?? undefined} tone="default" padding="lg">
      <Container size="xl">
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:items-center">
          {/* Columna izquierda */}
          <div>
            <p className="text-primary text-xs font-bold tracking-[0.18em] uppercase">
              {eyebrow ?? "Branded Content"}
            </p>
            <h2 className="font-display mt-3 text-4xl leading-[1.1] font-black sm:text-5xl">
              {heading}
            </h2>
            {description ? (
              <p className="text-muted-foreground mt-4 max-w-prose text-base leading-relaxed">
                {description}
              </p>
            ) : null}

            {/* Tabs/buttons categorías */}
            <ul className="mt-8 flex flex-wrap gap-2">
              {items.map((item, i) => (
                <li key={item.id ?? i}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      "border-border rounded-full border px-4 py-2 text-xs font-bold transition-colors",
                      activeIndex === i
                        ? "bg-primary border-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {item.headline.split(":")[0]?.trim() ?? `Item ${i + 1}`}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna derecha — preview */}
          <div className="border-border bg-muted relative overflow-hidden rounded-2xl border">
            <div className="bg-foreground/5 relative aspect-[16/10] w-full">
              {url ? (
                <Image
                  src={url}
                  alt={mediaAlt(active.image, active.headline)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFC200 0%, #FF6F00 50%, #B23E00 100%)",
                  }}
                >
                  <span className="font-display text-2xl font-black text-white opacity-90">
                    {active.headline}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg">
                  <Play className="text-foreground ml-1 h-6 w-6 fill-current" />
                </span>
              </div>
              {active.eyebrow ? (
                <span className="bg-primary text-primary-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase">
                  {active.eyebrow}
                </span>
              ) : null}
            </div>
            {active.description ? (
              <div className="border-border bg-background border-t p-5">
                <p className="font-display text-lg leading-tight font-extrabold">
                  {active.headline}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">{active.description}</p>
                {active.href ? (
                  <Link
                    href={active.href}
                    className="text-primary mt-3 inline-block text-sm font-bold"
                  >
                    Ver más →
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
