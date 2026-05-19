"use client";

import * as React from "react";

import { Container, Section } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { BlockOf } from "../types";

type Props = BlockOf<"content-type">;

/**
 * ContentTypeBlock — pills horizontales con descripción del tab activo abajo.
 * Matching del Figma `ditu.png` (FAST | SIMULCASTS | EN VIVO | VOD / CATCHUP).
 */
export function ContentTypeBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  types,
  defaultIndex,
}: Props) {
  const [active, setActive] = React.useState(defaultIndex ?? 0);
  if (!types || types.length === 0) return null;
  const current = types[Math.min(active, types.length - 1)];

  return (
    <Section
      id={anchorId ?? "tipo-contenido"}
      padding="lg"
      className="text-white"
      style={{
        background: "linear-gradient(180deg, #1F1647 0%, #2A1F5E 100%)",
      }}
    >
      <Container size="lg" className="text-center">
        <p
          className="text-xs font-bold tracking-[0.18em] uppercase"
          style={{ color: "#77EDED" }}
        >
          {eyebrow ?? "Tipo de contenido"}
        </p>
        <h2 className="font-display mx-auto mt-3 max-w-3xl text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
          {heading}
        </h2>
        {description ? (
          <p className="mx-auto mt-3 max-w-2xl text-base text-white/80">{description}</p>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {types.map((t, i) => (
            <button
              key={t.id ?? i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-bold tracking-wide uppercase transition-colors",
                active === i
                  ? "border-[#77EDED] bg-[#77EDED]/15 text-[#77EDED]"
                  : "border-white/15 text-white/80 hover:bg-white/5",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {current?.description ? (
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/80">
            {current.description}
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
