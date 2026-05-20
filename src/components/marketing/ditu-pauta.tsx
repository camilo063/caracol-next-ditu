"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * DituPautaBlock — Figma 760:9793.
 *
 * Estructura:
 *  - Sticker "IMPULSA TU MARCA" + heading "CON FORMATOS DE ALTO IMPACTO."
 *  - Sidebar de formatos (tabs): Pre-roll, Mid-roll, OAS, etc.
 *  - Card grande del formato activo (preview + descripción)
 *  - CTA final "Contáctanos"
 */

const CYAN = "#77EDED";
const NAVY_DARK = "#12082D";

interface AdFormat {
  id: string;
  label: string;
  title: string;
  description: string;
  duration: string;
}

const FORMATS: AdFormat[] = [
  {
    id: "pre-roll",
    label: "Pre-roll",
    title: "Pre-roll",
    description:
      "Anuncio de alto impacto antes del contenido. Captura la atención del usuario en el momento más alto: justo cuando va a empezar a ver lo que ama.",
    duration: "15-30s",
  },
  {
    id: "mid-roll",
    label: "Mid-roll",
    title: "Mid-roll",
    description:
      "Inserción publicitaria durante el contenido. Genera recordación porque interrumpe la experiencia con un mensaje relevante y memorable.",
    duration: "15-30s",
  },
  {
    id: "oas",
    label: "OAS",
    title: "Overlay / OAS",
    description:
      "Overlay no intrusivo sobre el reproductor. Visibilidad permanente sin interrumpir el contenido — ideal para awareness y branding sostenido.",
    duration: "Persistente",
  },
  {
    id: "skin",
    label: "Skin",
    title: "Skin / Custom UI",
    description:
      "Personalización visual del player y/o secciones específicas con la identidad de tu marca. Ownership total del espacio.",
    duration: "Campaña completa",
  },
  {
    id: "branded",
    label: "Branded content",
    title: "Branded content",
    description:
      "Contenido original co-creado entre Ditu y tu marca. Integración nativa al ecosistema editorial de Caracol con narrativas a tu medida.",
    duration: "Variable",
  },
];

export interface DituPautaProps {
  anchorId?: string;
}

export function DituPautaBlock({ anchorId = "pauta" }: DituPautaProps) {
  const [activeId, setActiveId] = useState(FORMATS[0]!.id);
  const active = FORMATS.find((f) => f.id === activeId) ?? FORMATS[0]!;

  return (
    <section
      id={anchorId}
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #1E1446 0%, #12082D 50%, #1E1446 100%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-6 py-24 sm:px-12 sm:py-32 lg:gap-[64px] lg:px-[120px] lg:py-[180px]">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div
            className="inline-flex w-fit items-center rounded-[8px] px-2 py-1.5"
            style={{
              backgroundColor: CYAN,
              color: NAVY_DARK,
              transform: "rotate(-1.97deg)",
            }}
          >
            <p className="font-display text-[24px] leading-[1] font-bold whitespace-nowrap uppercase sm:text-[36px] lg:text-[48px]">
              IMPULSA TU MARCA
            </p>
          </div>
          <h2 className="font-display text-[36px] leading-[1] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]">
            CON FORMATOS
            <br />
            DE ALTO IMPACTO.
          </h2>
          <p
            className="max-w-[640px] text-[16px] leading-snug text-white sm:text-[18px] lg:text-[22px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
            }}
          >
            Diseñados para ajustarse al ADN de nuestra audiencia digital — de display a
            video, audio y patrocinios.
          </p>
        </div>

        {/* Format selector + active card */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
          {/* Sidebar tabs */}
          <aside className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-3">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveId(f.id)}
                className="font-display flex-1 rounded-[8px] px-4 py-3 text-left text-[14px] leading-[1] font-bold uppercase transition-colors sm:text-[16px] lg:flex-none lg:text-[18px]"
                style={{
                  backgroundColor: activeId === f.id ? CYAN : "rgba(255,255,255,0.04)",
                  color: activeId === f.id ? NAVY_DARK : "#FFFFFF",
                  border: `1.5px solid ${activeId === f.id ? CYAN : "rgba(119,237,237,0.3)"}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </aside>

          {/* Active card */}
          <article
            className="flex flex-col gap-5 rounded-[16px] border p-6 lg:gap-8 lg:p-10"
            style={{
              borderColor: CYAN,
              backgroundColor: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              className="aspect-[16/9] w-full rounded-[12px]"
              style={{
                background:
                  "linear-gradient(135deg, #561BDB 0%, #8232F0 50%, #3B1A93 100%)",
              }}
            />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-[24px] leading-[1.1] font-bold text-white uppercase sm:text-[28px] lg:text-[32px]">
                  {active.title}
                </h3>
                <span
                  className="font-display inline-flex items-center rounded-[4px] px-3 py-1 text-[12px] leading-[1] font-bold whitespace-nowrap uppercase sm:text-[14px]"
                  style={{ backgroundColor: CYAN, color: NAVY_DARK }}
                >
                  {active.duration}
                </span>
              </div>
              <p
                className="text-[15px] leading-relaxed text-white/85 sm:text-[16px] lg:text-[18px]"
                style={{
                  fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                }}
              >
                {active.description}
              </p>
            </div>
          </article>
        </div>

        {/* CTA bottom */}
        <div className="flex flex-col items-center gap-4 text-center">
          <p
            className="max-w-[640px] text-[16px] leading-snug text-white sm:text-[18px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
            }}
          >
            Diseñemos juntos la estrategia publicitaria que tu marca necesita.
          </p>
          <Link
            href="#contacto"
            className="font-display inline-flex items-center justify-center rounded-[8px] px-8 py-3 text-[14px] leading-[1] font-bold uppercase transition-opacity hover:opacity-90 sm:text-[16px]"
            style={{ backgroundColor: CYAN, color: NAVY_DARK }}
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </section>
  );
}
