"use client";

import { CountUp } from "@/components/animations";
import { NetworkIcon } from "@/components/marketing";
import { formatCompact, formatNumber } from "@/lib/format";
import type { AudienceNetworksBlockProps } from "../types";

/**
 * AudienceNetworksBlock — implementación 1:1 del frame Figma 347:1600
 * "Our Commitments" del Mediakit Caracol Design System.
 *
 * Tokens y dimensiones extraídos vía Figma MCP (get_design_context 347:1600).
 *
 * Características clave:
 *  - Border radius asimétrico: tl/tr 50px, br 180px (curva grande inferior derecha).
 *  - Shadow superior navy (`0px -34px 20px rgba(0,51,129,0.55)`) que crea halo
 *    en la unión con el hero.
 *  - 4 stat cards en 2 columnas (no grid 2x2) con stagger: col izquierda pt-32.
 *  - Tipografías Montserrat: heading/numbers 64px, "Líderes en redes" 40px.
 *  - Botón Contáctanos posicionado absoluto con sticky top — sticky en su
 *    región vertical (642px desde y=300).
 */

// Tokens Figma (Mediakit Caracol — Design System)
const NAVY_DARK = "#003381"; // CaracolTV/Primario/Azul Oscuro
const NEUTRO_NEGRO = "#121212"; // CaracolTV/Neutro/Negro
const NEUTRO_GRIS_OSCURO = "#464553"; // CaracolTV/Neutro/Gris Oscuro
const NEUTRO_GRIS_MEDIO = "#95999A"; // CaracolTV/Neutro/Gris Medio
const AZUL_CLARO = "#00ACFF"; // CaracolTV/Primario/Azul Claro
// DIGITAL_AZUL_CLARO removido — el botón Contáctanos sticky que lo usaba
// fue migrado al FloatingContact global (spec usuario mayo 2026).
const SCREAMIN_GREEN = "#66FF74"; // LaKalle/Secundario/Screamin Green

type BreakdownItem = {
  label: string;
  value: number;
  suffix?: string | null;
  id?: string | null;
};

/** Formatea cantidades grandes con palabra completa en español. */
function formatMillionsLong(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) {
    return `${(v / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} Mil Millones`;
  }
  if (abs >= 1_000_000) {
    return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")} Millones`;
  }
  if (abs >= 1_000) {
    return `${(v / 1_000).toFixed(1).replace(/\.0$/, "")} Mil`;
  }
  return Math.round(v).toString();
}

export function AudienceNetworksBlockComponent({
  anchorId,
  heading,
  audience,
  networks,
}: AudienceNetworksBlockProps) {
  const totalFollowers = (networks ?? []).reduce((sum, n) => sum + (n.followers ?? 0), 0);
  const items = (audience.breakdown ?? []).slice(0, 4);
  // Stagger Figma: col izquierda = items 0+2, col derecha = items 1+3.
  const leftColItems = [items[0], items[2]].filter(Boolean) as BreakdownItem[];
  const rightColItems = [items[1], items[3]].filter(Boolean) as BreakdownItem[];

  return (
    <section id={anchorId ?? "audiencia"} className="relative -mt-12 sm:-mt-16">
      {/* Bloque blanco con border radius asimétrico + shadow superior navy.
          Especificación Figma 347:1600. */}
      <div
        className="relative bg-white py-12 sm:py-16 lg:py-[64px] lg:pb-[84px]"
        style={{
          borderTopLeftRadius: "50px",
          borderTopRightRadius: "50px",
          borderBottomRightRadius: "180px",
          boxShadow: "0px -34px 20px 0px rgba(0,51,129,0.55)",
        }}
      >
        {/* TOP: Nuestro Alcance (izq) + 4 stat cards (der) */}
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {/* Left: heading + número + label + source */}
          <div className="flex flex-col items-start gap-3">
            <h2
              className="font-display text-[40px] leading-[1.125] font-bold tracking-[-1px] break-words capitalize sm:text-[48px] lg:text-[64px] lg:leading-[72px]"
              style={{ color: NAVY_DARK }}
            >
              {heading || "Nuestro Alcance"}
            </h2>
            <p
              className="font-display text-[40px] leading-[1.125] font-extrabold whitespace-nowrap capitalize sm:text-[48px] lg:text-[64px] lg:leading-[72px]"
              style={{ color: NEUTRO_NEGRO }}
            >
              <CountUp
                value={audience.reach}
                format={(v) => formatNumber(Math.round(v))}
              />
              {audience.reachSuffix ?? ""}
            </p>
            <p
              className="font-display text-[20px] leading-[1.25] font-normal sm:text-[24px] lg:text-[32px] lg:leading-[40px]"
              style={{ color: NEUTRO_GRIS_OSCURO }}
            >
              {audience.reachLabel ?? "Usuarios mensuales"}
            </p>
            <div className="mt-2 flex items-center gap-1 px-2 py-1">
              <span
                className="inline-block h-[13px] w-[13px] shrink-0 rounded-full"
                style={{ backgroundColor: SCREAMIN_GREEN }}
              />
              <p
                className="font-display font-normal whitespace-nowrap text-black"
                style={{ fontSize: "16px", lineHeight: "24px" }}
              >
                Fuente: Comscore Feb 2026
              </p>
            </div>
          </div>

          {/* Right: 2 columns of stat cards con stagger */}
          {items.length > 0 ? (
            <div className="flex gap-6 py-8">
              {/* Col izquierda con pt-32 (stagger Figma) */}
              <div className="flex w-full max-w-[235.5px] flex-col gap-6 pt-8 sm:w-[235.5px]">
                {leftColItems.map((item) => (
                  <StatCard key={item.id ?? item.label} item={item} />
                ))}
              </div>
              {/* Col derecha */}
              <div className="flex w-full max-w-[235.5px] flex-col gap-6 sm:w-[235.5px]">
                {rightColItems.map((item) => (
                  <StatCard key={item.id ?? item.label} item={item} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* MIDDLE: Líderes en redes + total */}
        {networks && networks.length > 0 ? (
          <div className="mx-auto mt-12 max-w-[1200px] px-4 sm:px-6 lg:mt-16">
            <h3
              className="font-display text-[28px] leading-[1.1] font-bold tracking-[-1px] sm:text-[32px] lg:text-[40px]"
              style={{ color: NEUTRO_NEGRO }}
            >
              Líderes en redes
            </h3>
            <p
              className="font-display mt-2 text-[24px] leading-[1.1] font-semibold tracking-[-1px] sm:text-[32px] lg:text-[40px]"
              style={{ color: NEUTRO_GRIS_OSCURO }}
            >
              +
              <CountUp value={totalFollowers} format={(v) => formatMillionsLong(v)} /> de
              seguidores
            </p>

            {/* Network row — Figma 347:1636 "Logo Bar":
                · Layout: justify-between, gap-y-68 (rows si wrap)
                · Cada card w-134, flex-col gap-12 items-center
                · Icon 48x47, número SemiBold 20/lh-28 #2D2D2D
                · Progress bar w-134 h-12, fondo translucent, fill cyan
                  rgba(0,172,255,0.8) proporcional al máximo
                · El cyan se encoge para números grandes (shrink-fit) */}
            <NetworksLogoBar networks={networks.slice(0, 6)} />
          </div>
        ) : null}

        {/* Source bottom right */}
        <div className="mx-auto mt-8 flex max-w-[1200px] items-center justify-end gap-1 px-4 py-2 sm:px-6">
          <span
            className="inline-block h-[13px] w-[13px] shrink-0 rounded-full"
            style={{ backgroundColor: SCREAMIN_GREEN }}
          />
          <p
            className="font-display font-normal whitespace-nowrap text-black"
            style={{ fontSize: "16px", lineHeight: "24px" }}
          >
            Fuente: Abril 6 2026
          </p>
        </div>

        {/* Spec usuario (mayo 2026): el "Contáctanos" sticky de este bloque
            fue removido. Su estilo y comportamiento (fixed, abre panel con
            representantes) ahora vive en el FloatingContact global, que es
            el único botón Contáctanos de la página. */}
      </div>
    </section>
  );
}

function StatCard({ item }: { item: BreakdownItem }) {
  const isPercent = (item.suffix ?? "").trim() === "%";
  const isOrdinal = !item.suffix && item.value > 0 && item.value < 10;
  const [pillLabel, subLabel] = item.label.split("|").map((s) => s.trim());

  return (
    <div
      className="flex w-full flex-col items-start gap-2 rounded-lg p-5"
      style={{
        border: `1px solid ${NEUTRO_GRIS_MEDIO}`,
        backgroundColor: "#FFFFFF",
      }}
    >
      {pillLabel ? (
        <div
          className="inline-flex items-center justify-center rounded"
          style={{
            backgroundColor: AZUL_CLARO,
            padding: "4px 8px",
          }}
        >
          <p
            className="font-display font-bold whitespace-nowrap text-white uppercase"
            style={{ fontSize: "14px", lineHeight: "16px" }}
          >
            {pillLabel}
          </p>
        </div>
      ) : null}
      <p
        className="font-display text-[40px] leading-[1.125] font-bold whitespace-nowrap capitalize sm:text-[48px] lg:text-[64px] lg:leading-[72px]"
        style={{ color: NEUTRO_NEGRO }}
      >
        {isOrdinal ? (
          <>
            #
            <CountUp value={item.value} format={(v) => Math.round(v).toString()} />
          </>
        ) : isPercent ? (
          <>
            <CountUp value={item.value} format={(v) => v.toFixed(1)} />%
          </>
        ) : (
          <>
            <CountUp value={item.value} format={(v) => formatCompact(v)} />
            {item.suffix ?? ""}
          </>
        )}
      </p>
      {subLabel ? (
        <p
          className="font-display font-medium"
          style={{
            color: NEUTRO_GRIS_OSCURO,
            fontSize: "18px",
            lineHeight: "22px",
          }}
        >
          {subLabel}
        </p>
      ) : null}
    </div>
  );
}

/**
 * NetworksLogoBar — Figma 347:1636 "Logo Bar".
 *
 * Layout: flex flex-wrap justify-between, py-42 px-68, gap-y-68 entre rows.
 * Cada card: w-134 flex-col gap-12 items-center.
 *  - Icon 48×47 (NetworkIcon SVG self-contained)
 *  - Número Montserrat SemiBold 20/lh-28 #2D2D2D centered
 *  - Progress bar w-134 h-12 con fill cyan rgba(0,172,255,0.8) proporcional
 *    al máximo seguidores
 *
 * Si los números son grandes el formato (formatNumber) los formatea con
 * separador de miles. Si exceden el width de 134px, el progress bar mantiene
 * w-134 (texto se desborda visualmente arriba — pero al usar leading-28
 * sobre w-134 suele estar OK).
 */
function NetworksLogoBar({
  networks,
}: {
  networks: Array<{ id?: string | null; network: string; followers: number }>;
}) {
  // Máximo para calcular % proporcional del progress bar.
  const maxFollowers = Math.max(...networks.map((n) => n.followers ?? 0));

  return (
    <div className="mt-10 flex w-full flex-wrap items-start justify-between gap-y-10 sm:gap-y-12 lg:gap-y-[68px]">
      {networks.map((net) => {
        const ratio = maxFollowers > 0 ? (net.followers ?? 0) / maxFollowers : 0;
        return (
          <div
            key={net.id ?? net.network}
            className="flex w-full max-w-[134px] flex-col items-center gap-2 lg:gap-[12px]"
          >
            {/* Icon — Figma 347:1638;208:4718: w-48 h-47 SVG self-contained */}
            <div className="flex h-[47px] w-[48px] items-start overflow-clip">
              <NetworkIcon network={net.network} className="h-full w-full shrink-0" />
            </div>
            {/* Número — Montserrat SemiBold 20/lh-28 #2D2D2D center */}
            <p
              className="font-display w-full text-center font-semibold"
              style={{
                color: "#2D2D2D",
                fontSize: "20px",
                lineHeight: "28px",
              }}
            >
              <CountUp
                value={net.followers}
                format={(v) => formatNumber(Math.round(v))}
              />
            </p>
            {/* Progress bar — w-134 h-12, fondo gris claro, fill cyan
                rgba(0,172,255,0.8) proporcional al max */}
            <div
              className="relative h-[12px] w-full max-w-[134px] overflow-hidden"
              style={{ backgroundColor: "rgba(0, 51, 129, 0.1)" }}
            >
              <div
                className="absolute top-0 left-0 h-full transition-[width] duration-1000 ease-out"
                style={{
                  width: `${ratio * 100}%`,
                  backgroundColor: "rgba(0, 172, 255, 0.8)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
