"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { CountUp } from "@/components/animations";
import { Button, Container } from "@/components/ui";
import { NetworkIcon } from "@/components/marketing";
import { brandMeta } from "@/lib/brand";
import { formatNumber } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { BrandTabsBlockProps } from "../types";
import { AgePeakBarChart } from "./AgePeakBarChart";
import { GenderPieChart } from "./GenderPieChart";

type Tab = NonNullable<BrandTabsBlockProps["tabs"]>[number];

/**
 * BrandTabsBlock — "Una marca para cada audiencia" (Figma caracol-next.png).
 *
 * Spec:
 *  - Tabs pill horizontales arriba. Mobile = scroll horizontal sin scrollbar.
 *  - Card grande 2-col: izquierda contenido (WEB + REDES + AUDIENCIA + CTA),
 *    derecha card brand color con logo grande. Mobile = card derecha oculta,
 *    pero el logo aparece como ícono pequeño en esquina superior derecha
 *    de la card izquierda.
 *  - Tab change: AnimatePresence fade 300ms ease. Re-monta contenido,
 *    re-anima charts (grow-from-0 con Recharts) y CountUps.
 */
export function BrandTabsBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  tabs,
  defaultTab,
}: BrandTabsBlockProps) {
  const [active, setActive] = React.useState(defaultTab ?? 0);
  if (!tabs || tabs.length === 0) return null;
  const safeIndex = Math.min(Math.max(active, 0), tabs.length - 1);
  const current = tabs[safeIndex]!;

  return (
    <section id={anchorId ?? "marcas"} className="py-6 sm:py-8 lg:py-10">
      <div className="bg-muted w-full overflow-hidden rounded-[2rem] py-14 sm:rounded-[2.5rem] sm:py-16 lg:py-20">
        <Container size="xl">
          <p className="text-primary text-fluid-tag font-bold tracking-[0.18em] uppercase">
            {eyebrow ?? "El ecosistema Caracol"}
          </p>
          <h2 className="font-display text-fluid-h2 text-foreground mt-3 font-black">
            {heading}
          </h2>
          {description ? (
            <p className="text-muted-foreground text-fluid-body mt-2">{description}</p>
          ) : null}

          {/* Tabs pill row — horizontal scroll on mobile */}
          <div
            className="-mx-4 mt-8 [scrollbar-width:none] overflow-x-auto px-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Marcas del ecosistema"
          >
            <div className="flex w-max gap-2">
              {tabs.map((tab, i) => {
                const meta = brandMeta(tab.brand);
                const isActive = i === safeIndex;
                const color = tab.brandColor ?? meta.color;
                return (
                  <button
                    key={tab.brand}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    className={cn(
                      "rounded-lg border-2 px-5 py-2.5 text-sm font-bold whitespace-nowrap transition-colors",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                    )}
                    style={
                      isActive
                        ? {
                            backgroundColor: color,
                            borderColor: color,
                            color: "white",
                          }
                        : {
                            backgroundColor: "white",
                            borderColor: color,
                            color: color,
                          }
                    }
                  >
                    {tab.displayName ?? meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content — fade 300ms ease entre tabs */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.brand}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TabPanel tab={current} />
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </div>
    </section>
  );
}

function TabPanel({ tab }: { tab: Tab }) {
  const meta = brandMeta(tab.brand);
  const brandColor = tab.brandColor ?? meta.color;
  const brandDark = meta.colorDark ?? brandColor;
  const displayName = tab.displayName ?? meta.label;
  const logoUrl = mediaUrl(tab.brandLogo);

  return (
    <div className="border-border bg-card grid overflow-hidden rounded-2xl border md:grid-cols-[3fr_2fr]">
      {/* Columna izquierda — content */}
      <div className="relative space-y-6 p-6 sm:p-8 md:p-10">
        {/* Brand icon top-right corner — visible solo en mobile */}
        {logoUrl ? (
          <div
            className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-lg md:hidden"
            style={{ backgroundColor: brandColor }}
          >
            <Image
              src={logoUrl}
              alt={displayName}
              width={40}
              height={40}
              className="h-7 w-auto object-contain"
            />
          </div>
        ) : null}

        {/* Brand name + tagline */}
        <div>
          <h3
            className="font-display text-fluid-h2 font-black"
            style={{ color: brandColor }}
          >
            {displayName}
          </h3>
          {tab.tagline ? (
            <p className="text-fluid-body text-muted-foreground mt-2 max-w-prose">
              {tab.tagline}
            </p>
          ) : null}
        </div>

        {/* WEB + REDES */}
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
          {/* WEB box */}
          {tab.webMetrics &&
          (tab.webMetrics.usersPerMonth || tab.webMetrics.viewsPerMonth) ? (
            <div className="border-border bg-muted/30 rounded-xl border p-5">
              <span
                className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase"
                style={{ backgroundColor: brandColor }}
              >
                WEB
              </span>
              {tab.webMetrics.usersPerMonth ? (
                <div className="mt-4">
                  <p
                    className="font-display text-2xl leading-tight font-extrabold sm:text-3xl"
                    style={{ color: brandColor }}
                  >
                    <CountUp
                      value={tab.webMetrics.usersPerMonth}
                      format={(v) => formatNumber(Math.round(v))}
                    />
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {tab.webMetrics.usersLabel ?? "Usuarios/mes"}
                  </p>
                </div>
              ) : null}
              {tab.webMetrics.viewsPerMonth ? (
                <div className="border-border mt-4 border-t pt-3">
                  <p
                    className="font-display text-2xl leading-tight font-extrabold sm:text-3xl"
                    style={{ color: brandColor }}
                  >
                    <CountUp
                      value={tab.webMetrics.viewsPerMonth}
                      format={(v) => formatNumber(Math.round(v))}
                    />
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {tab.webMetrics.viewsLabel ?? "Vistas/mes"}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* REDES box */}
          {tab.networks && tab.networks.length > 0 ? (
            <div className="border-border bg-muted/30 rounded-xl border p-5">
              <span
                className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase"
                style={{ backgroundColor: brandColor }}
              >
                REDES
              </span>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                {tab.networks.map((net) => (
                  <li key={net.id ?? net.network} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: brandColor }}
                    >
                      <NetworkIcon network={net.network} className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p
                        className="font-display text-base leading-tight font-extrabold"
                        style={{ color: brandColor }}
                      >
                        <CountUp
                          value={net.followers}
                          format={(v) => formatNumber(Math.round(v))}
                        />
                      </p>
                      <p className="text-muted-foreground text-[10px]">Seguidores</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* AUDIENCIA — pie + bar charts */}
        {tab.audience?.genderSplit?.femalePercent !== undefined &&
        tab.audience?.genderSplit?.femalePercent !== null ? (
          <div className="border-border bg-muted/30 rounded-xl border p-5">
            <span
              className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase"
              style={{ backgroundColor: brandColor }}
            >
              AUDIENCIA
            </span>

            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {/* Género */}
              <div className="flex items-center gap-4">
                <GenderPieChart
                  femalePercent={tab.audience.genderSplit.femalePercent}
                  femaleLabel={tab.audience.genderSplit.femaleLabel ?? "Mujeres"}
                  maleLabel={tab.audience.genderSplit.maleLabel ?? "Hombres"}
                  primaryColor={brandColor}
                  secondaryColor={brandColor === "#015BC4" ? "#66B3FF" : brandDark}
                />
                <div className="min-w-0">
                  <p className="font-display text-xl font-bold">Género</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Del total de la audiencia
                  </p>
                  <p className="text-foreground mt-1 text-xs font-bold">
                    {tab.audience.genderSplit.femalePercent}% son{" "}
                    {(tab.audience.genderSplit.femaleLabel ?? "mujeres").toLowerCase()}.
                  </p>
                </div>
              </div>

              {/* Edad Pico */}
              {tab.audience?.agePicks && tab.audience.agePicks.length > 0 ? (
                <div>
                  <p className="font-display text-xl font-bold">Edad Pico</p>
                  {tab.audience.peakAgeRange ? (
                    <p className="text-muted-foreground mt-1 text-xs">
                      {tab.audience.peakAgeRange}
                    </p>
                  ) : null}
                  <AgePeakBarChart
                    data={tab.audience.agePicks.map((a) => ({
                      range: a.range,
                      value: a.value,
                      isPeak: a.isPeak,
                    }))}
                    peakColor={brandColor}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* CTA Conoce más bottom-right */}
        {tab.ctaContact?.label && tab.ctaContact?.href ? (
          <div className="flex justify-end pt-2">
            <Button
              size="default"
              asChild
              style={{ backgroundColor: brandColor, color: "white" }}
            >
              <Link
                href={tab.ctaContact.href}
                target={tab.ctaContact.openInNewTab ? "_blank" : undefined}
              >
                {tab.ctaContact.label}
              </Link>
            </Button>
          </div>
        ) : null}
      </div>

      {/* Columna derecha — big brand card. Oculta en mobile. */}
      <div
        className="relative hidden items-center justify-center md:flex"
        style={{
          background: `linear-gradient(160deg, ${brandColor} 0%, ${brandDark} 100%)`,
        }}
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={displayName}
            width={320}
            height={180}
            className="h-auto max-h-[60%] w-auto max-w-[70%] object-contain"
          />
        ) : (
          <span className="font-display text-3xl font-black text-white sm:text-4xl">
            {displayName.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}
