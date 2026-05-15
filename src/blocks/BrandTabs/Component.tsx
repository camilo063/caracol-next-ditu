"use client";

import * as React from "react";
import Link from "next/link";

import {
  Button,
  Container,
  Section,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { NetworkIcon } from "@/components/marketing";
import { brandMeta, brandStyle } from "@/lib/brand";
import { formatCompact, formatNumber } from "@/lib/format";
import type { BrandTabsBlockProps } from "../types";

/**
 * BrandTabsBlock — "El ecosistema Caracol: una marca para cada audiencia".
 * Matching Figma `caracol-next.png`: tabs horizontales arriba, contenido en grid 2-col
 * con info de marca a la izquierda y big brand card a la derecha.
 */
export function BrandTabsBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  tabs,
  defaultTab,
}: BrandTabsBlockProps) {
  if (!tabs || tabs.length === 0) return null;
  const defaultValue = (tabs[defaultTab ?? 0] ?? tabs[0])!.brand;

  return (
    <Section id={anchorId ?? "marcas"} tone="muted" padding="lg">
      <Container size="xl">
        <p className="text-primary text-xs font-bold tracking-[0.18em] uppercase">
          {eyebrow ?? "El ecosistema Caracol"}
        </p>
        <h2 className="font-display mt-3 text-3xl font-black sm:text-4xl">{heading}</h2>
        {description ? (
          <p className="text-muted-foreground mt-2 text-base">{description}</p>
        ) : null}

        <Tabs defaultValue={defaultValue} className="mt-8">
          <TabsList className="bg-card border-border h-auto flex-wrap rounded-xl border p-1">
            {tabs.map((tab) => {
              const meta = brandMeta(tab.brand);
              return (
                <TabsTrigger
                  key={tab.brand}
                  value={tab.brand}
                  className="data-[state=active]:bg-primary rounded-lg px-4 py-2 text-sm font-semibold data-[state=active]:text-white"
                >
                  {tab.displayName ?? meta.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.map((tab) => {
            const meta = brandMeta(tab.brand);
            const brandColor = tab.brandColor ?? meta.color;
            const brandDark = meta.colorDark ?? brandColor;
            const style = brandStyle(tab.brand);
            if (tab.brandColor) {
              (style as Record<string, string>)["--color-primary"] = tab.brandColor;
              (style as Record<string, string>)["--color-ring"] = tab.brandColor;
            }

            return (
              <TabsContent key={tab.brand} value={tab.brand} style={style}>
                <div className="border-border bg-card grid overflow-hidden rounded-2xl border md:grid-cols-[3fr_2fr]">
                  {/* Columna izquierda — info de marca */}
                  <div className="space-y-6 p-6 sm:p-8">
                    <div>
                      <h3
                        className="font-display text-3xl font-black sm:text-4xl"
                        style={{ color: brandColor }}
                      >
                        {tab.displayName ?? meta.label}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-sm">
                        Referente de entretenimiento y contenido original para todo el
                        país.
                      </p>
                    </div>

                    {/* Audiencia + stats */}
                    {tab.audience ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="border-border bg-background rounded-xl border p-4">
                          <p className="text-muted-foreground text-xs font-bold uppercase">
                            AVG
                          </p>
                          <p
                            className="font-display mt-1 text-2xl leading-tight font-extrabold"
                            style={{ color: brandColor }}
                          >
                            {formatNumber(tab.audience.reach)}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {tab.audience.reachLabel ?? "Usuarios/mes"}
                          </p>
                        </div>
                        {tab.audience.highlights?.[0] ? (
                          <div className="border-border bg-background rounded-xl border p-4">
                            <p className="text-muted-foreground text-xs font-bold uppercase">
                              {tab.audience.highlights[0].label}
                            </p>
                            <p
                              className="font-display mt-1 text-2xl leading-tight font-extrabold"
                              style={{ color: brandColor }}
                            >
                              {tab.audience.highlights[0].value}
                              {tab.audience.highlights[0].valueSuffix ?? ""}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {/* Redes */}
                    {tab.networks && tab.networks.length > 0 ? (
                      <div>
                        <p className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
                          Redes
                        </p>
                        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {tab.networks.map((net) => (
                            <li
                              key={net.id ?? net.network}
                              className="border-border bg-background flex items-center gap-2 rounded-lg border p-3"
                            >
                              <NetworkIcon
                                network={net.network}
                                className="h-4 w-4"
                                style={{ color: brandColor } as React.CSSProperties}
                              />
                              <div className="min-w-0">
                                <p className="font-display text-base leading-none font-bold">
                                  {formatCompact(net.followers)}
                                </p>
                                <p className="text-muted-foreground text-[10px] capitalize">
                                  Seguidores
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {/* Conoce más */}
                    {tab.ctaContact?.label && tab.ctaContact?.href ? (
                      <Button
                        size="default"
                        variant={tab.ctaContact.variant ?? "default"}
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
                    ) : null}
                  </div>

                  {/* Columna derecha — big brand card */}
                  <div
                    className="relative flex flex-col items-center justify-center gap-6 p-6 sm:p-10"
                    style={{
                      background: `linear-gradient(160deg, ${brandColor} 0%, ${brandDark} 100%)`,
                    }}
                  >
                    <div className="text-center text-white">
                      <p className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
                        Marca
                      </p>
                      <p className="font-display mt-2 text-3xl font-black sm:text-4xl">
                        {(tab.displayName ?? meta.label).toUpperCase()}
                      </p>
                      <p className="mt-3 text-sm text-white/80">
                        Identidad gráfica propia dentro del shell de Caracol Next.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </Container>
    </Section>
  );
}
