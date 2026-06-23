"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { CountUp } from "@/components/animations";
import { NetworkIcon } from "@/components/marketing";
import { formatCompact, formatNumber } from "@/lib/format";
import type { AudienceNetworksBlockProps } from "../types";

const NAVY_DARK = "#003381";
const NEUTRO_NEGRO = "#121212";
const NEUTRO_GRIS_OSCURO = "#464553";
const NEUTRO_GRIS_MEDIO = "#95999A";
const AZUL_CLARO = "#00ACFF";
const SCREAMIN_GREEN = "#66FF74";

type BreakdownItem = {
  label: string;
  value: number;
  suffix?: string | null;
  id?: string | null;
};

function formatMillionsLong(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000)
    return `${(v / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} Mil Millones`;
  if (abs >= 1_000_000)
    return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")} Millones`;
  if (abs >= 1_000) return `${(v / 1_000).toFixed(1).replace(/\.0$/, "")} Mil`;
  return Math.round(v).toString();
}

/** Valor estático formateado para stat cards (sin CountUp). */
function formatStatValue(item: BreakdownItem): string {
  const isPercent = (item.suffix ?? "").trim() === "%";
  const isOrdinal = !item.suffix && item.value > 0 && item.value < 10;
  if (isOrdinal) return `#${item.value}`;
  if (isPercent) return `${item.value.toFixed(1)}%`;
  return `${formatCompact(item.value, "en-US")}${item.suffix ?? ""}`;
}

/** Variants reutilizables fade-up para tarjetas. */
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

export function AudienceNetworksBlockComponent({
  anchorId,
  heading,
  audience,
  networksSection,
  networks,
}: AudienceNetworksBlockProps) {
  const totalFollowers =
    networks?.reduce<number>(
      (sum: number, n: { followers?: number | null }) => sum + (n.followers ?? 0),
      0,
    ) ?? 0;
  const items = (audience.breakdown ?? []).slice(0, 4);
  const networksHeading = networksSection?.heading ?? "Líderes en redes";
  const networksTotalSuffix = networksSection?.totalSuffix ?? "de seguidores";
  const networksItemLabel = networksSection?.itemLabel ?? "Seguidores";
  const audienceSource = audience.source ?? "Fuente: Comscore Feb 2026";
  const networksSource = networksSection?.source ?? "Fuente: Abril 6 2026";
  const leftColItems = [items[0], items[2]].filter(Boolean) as BreakdownItem[];
  const rightColItems = [items[1], items[3]].filter(Boolean) as BreakdownItem[];

  return (
    <section id={anchorId ?? "audiencia"} className="relative -mt-10 sm:-mt-16">
      <div
        className="relative bg-white pt-16 pb-12 sm:pt-24 sm:pb-16 lg:py-[64px] lg:pb-[84px]"
        style={{
          borderTopLeftRadius: "50px",
          borderTopRightRadius: "50px",
          borderBottomRightRadius: "clamp(80px, 12.5vw, 180px)",
          boxShadow: "0px -34px 20px 0px rgba(0,51,129,0.55)",
        }}
      >
        {/* TOP: Nuestro Alcance (izq) + 4 stat cards (der) */}
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {/* Left: heading + número grande con CountUp sutil + label + source */}
          <div className="flex flex-col items-start gap-3">
            <h2
              className="font-display text-[40px] leading-[1.125] font-bold tracking-[-1px] break-words capitalize sm:text-[48px] lg:text-[64px] lg:leading-[72px]"
              style={{ color: NAVY_DARK }}
            >
              {heading || "Nuestro Alcance"}
            </h2>
            <div className="flex flex-col items-start gap-[6px]">
              {/* Número grande — CountUp sutil con reserveWidth para no saltar */}
              <p
                className="font-display text-[40px] leading-[1.125] font-extrabold whitespace-nowrap capitalize sm:text-[48px] lg:text-[64px] lg:leading-[72px]"
                style={{ color: NEUTRO_NEGRO }}
              >
                <CountUp
                  value={audience.reach}
                  format={(v) => formatNumber(Math.round(v))}
                  duration={3.5}
                  reserveWidth
                />
                {audience.reachSuffix ?? ""}
              </p>
              <p
                className="font-display text-[20px] leading-[1.25] font-normal sm:text-[24px] lg:text-[32px] lg:leading-[40px]"
                style={{ color: NEUTRO_GRIS_OSCURO }}
              >
                {audience.reachLabel ?? "Usuarios mensuales"}
              </p>
            </div>
            <div className="flex items-start gap-1 px-2 py-1">
              <span
                className="mt-[5px] inline-block h-[13px] w-[13px] shrink-0 rounded-full"
                style={{ backgroundColor: SCREAMIN_GREEN }}
              />
              <p
                className="font-display min-w-0 font-normal text-black"
                style={{ fontSize: "16px", lineHeight: "24px" }}
              >
                {audienceSource}
              </p>
            </div>
          </div>

          {/* Right: stat cards con stagger — NO CountUp, solo valor estático */}
          {items.length > 0 ? (
            <div className="m-auto grid grid-cols-2 gap-3 sm:flex sm:gap-6 lg:py-8">
              {/* Col izquierda con pt-8 (stagger Figma) */}
              <div className="flex w-full flex-col gap-4 sm:w-[235.5px] sm:max-w-[235.5px] sm:gap-6 sm:pt-8">
                {leftColItems.map((item, i) => (
                  <motion.div
                    key={item.id ?? item.label}
                    custom={i * 0.2}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <StatCard item={item} />
                  </motion.div>
                ))}
              </div>
              {/* Col derecha */}
              <div className="flex w-full flex-col gap-4 sm:w-[235.5px] sm:max-w-[235.5px] sm:gap-6">
                {rightColItems.map((item, i) => (
                  <motion.div
                    key={item.id ?? item.label}
                    custom={0.1 + i * 0.2}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <StatCard item={item} />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* MIDDLE: Líderes en redes */}
        {networks && networks.length > 0 ? (
          <div className="mx-auto mt-12 max-w-[1200px] px-4 sm:px-6 lg:mt-16">
            <h3
              className="font-display text-[28px] font-bold tracking-[-1px] sm:text-[32px] lg:text-[40px]"
              style={{ color: NEUTRO_NEGRO, lineHeight: "normal" }}
            >
              {networksHeading}
            </h3>
            {/* Total seguidores — estático, sin CountUp, fade-up al entrar */}
            <motion.p
              className="font-display mt-1 text-[24px] font-semibold tracking-[-1px] sm:text-[32px] lg:text-[40px]"
              style={{ color: NEUTRO_GRIS_OSCURO, lineHeight: "normal" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              +{formatMillionsLong(totalFollowers)} {networksTotalSuffix}
            </motion.p>

            {/* Network bar — CountUp con stagger por índice + reserveWidth */}
            <NetworksLogoBar
              networks={networks.slice(0, 6)}
              itemLabel={networksItemLabel}
            />
          </div>
        ) : null}

        {/* Source bottom right */}
        <div className="mx-auto mt-8 flex max-w-[1200px] items-start justify-end gap-1 px-4 py-2 sm:px-6">
          <span
            className="mt-[5px] inline-block h-[13px] w-[13px] shrink-0 rounded-full"
            style={{ backgroundColor: SCREAMIN_GREEN }}
          />
          <p
            className="font-display min-w-0 font-normal text-black sm:text-right"
            style={{ fontSize: "16px", lineHeight: "24px" }}
          >
            {networksSource}
          </p>
        </div>
      </div>
    </section>
  );
}

function StatCard({ item }: { item: BreakdownItem }) {
  const [pillLabel, subLabel] = item.label.split("|").map((s) => s.trim());

  return (
    <div
      className="flex w-full flex-col items-start gap-2 rounded-lg p-5"
      style={{ border: `1px solid ${NEUTRO_GRIS_MEDIO}`, backgroundColor: "#FFFFFF" }}
    >
      {pillLabel ? (
        <div
          className="inline-flex items-center justify-center rounded"
          style={{ backgroundColor: AZUL_CLARO, padding: "4px 8px" }}
        >
          <p
            className="font-display font-bold text-white uppercase"
            style={{ fontSize: "14px", lineHeight: "16px" }}
          >
            {pillLabel}
          </p>
        </div>
      ) : null}
      {/* Valor estático — sin CountUp (números cortos se verían feos animando) */}
      <p
        className="font-display text-[40px] leading-[1.125] font-bold whitespace-nowrap capitalize sm:text-[48px] lg:text-[64px] lg:leading-[72px]"
        style={{ color: NEUTRO_NEGRO }}
      >
        {formatStatValue(item)}
      </p>
      {subLabel ? (
        <p
          className="font-display font-medium"
          style={{ color: NEUTRO_GRIS_OSCURO, fontSize: "18px", lineHeight: "22px" }}
        >
          {subLabel}
        </p>
      ) : null}
    </div>
  );
}

function NetworksLogoBar({
  networks,
  itemLabel,
}: {
  networks: Array<{ id?: string | null; network: string; followers: number }>;
  itemLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerInView = useInView(containerRef, {
    once: true,
    margin: "0px 0px -10% 0px",
  });

  return (
    <div
      ref={containerRef}
      className="mt-10 flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-10 sm:gap-y-12 lg:justify-between lg:gap-x-4 xl:gap-x-0"
    >
      {networks.map((net, idx) => (
        <motion.div
          key={net.id ?? net.network}
          className="flex shrink-0 items-center gap-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: idx * 0.1 }}
        >
          <div className="h-11.75 w-12 shrink-0">
            <NetworkIcon network={net.network} className="h-full w-full" />
          </div>
          <div className="flex flex-col items-start">
            <p
              className="font-display text-[20px] leading-7 font-semibold whitespace-nowrap"
              style={{ color: "#121212" }}
            >
              <CountUp
                value={net.followers}
                format={(v) => formatNumber(Math.round(v))}
                duration={2.2}
                reserveWidth
                shouldStart={containerInView}
              />
            </p>
            <p
              className="font-display text-[16px] leading-5 font-normal whitespace-nowrap"
              style={{ color: "#2D2D2D" }}
            >
              {itemLabel}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
