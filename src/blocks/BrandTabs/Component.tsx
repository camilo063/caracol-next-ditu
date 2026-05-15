"use client";

import * as React from "react";
import Link from "next/link";

import {
  Button,
  Card,
  CardContent,
  Container,
  Section,
  SectionHeading,
  Stat,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { BrandLogoBadge, NetworkIcon } from "@/components/marketing";
import { brandMeta, brandStyle } from "@/lib/brand";
import { formatCompact } from "@/lib/format";
import type { BrandTabsBlockProps } from "../types";

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
    <Section id={anchorId ?? undefined} tone="muted" padding="lg">
      <Container size="xl">
        <SectionHeading
          eyebrow={eyebrow ?? undefined}
          title={heading}
          description={description ?? undefined}
          align="center"
        />

        <Tabs defaultValue={defaultValue} className="mt-10">
          <div className="overflow-x-auto">
            <TabsList className="mx-auto flex h-auto flex-wrap justify-center gap-1 bg-transparent p-0">
              {tabs.map((tab) => {
                const meta = brandMeta(tab.brand);
                return (
                  <TabsTrigger
                    key={tab.brand}
                    value={tab.brand}
                    className="bg-background border-border data-[state=active]:bg-foreground data-[state=active]:text-background rounded-full border px-4 py-2 text-sm transition-all"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: tab.brandColor ?? meta.color }}
                    />
                    {tab.displayName ?? meta.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {tabs.map((tab) => {
            const meta = brandMeta(tab.brand);
            const style = brandStyle(
              tab.brandColor ? `__custom__` : tab.brand,
            ) as React.CSSProperties;
            // Si el admin define un brandColor custom, lo inyectamos directo.
            if (tab.brandColor) {
              (style as Record<string, string>)["--color-primary"] = tab.brandColor;
              (style as Record<string, string>)["--color-ring"] = tab.brandColor;
            }
            return (
              <TabsContent key={tab.brand} value={tab.brand} style={style}>
                <Card className="overflow-hidden">
                  <CardContent className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
                    <div>
                      <BrandLogoBadge
                        brand={tab.brand}
                        displayName={tab.displayName ?? null}
                        logo={tab.brandLogo}
                        size="lg"
                      />
                      <h3
                        className="font-display mt-4 text-3xl font-extrabold sm:text-4xl"
                        style={{ color: tab.brandColor ?? meta.color }}
                      >
                        Por qué elegir {tab.displayName ?? meta.label}
                      </h3>
                      {/* whyChoose es lexical richText — render simple en MVP */}
                      {tab.whyChoose ? (
                        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                          {/* Para MVP mostramos un placeholder textual; en Fase 3.5
                              wireamos @payloadcms/richtext-lexical/react */}
                          Contenido editorial de {tab.displayName ?? meta.label}.
                        </p>
                      ) : null}

                      {tab.audience ? (
                        <div className="mt-6">
                          <Stat
                            value={formatCompact(tab.audience.reach)}
                            valueSuffix={tab.audience.reachSuffix ?? undefined}
                            label={tab.audience.reachLabel ?? "Personas alcanzadas"}
                            size="xl"
                          />
                          {tab.audience.highlights &&
                          tab.audience.highlights.length > 0 ? (
                            <ul className="mt-4 grid grid-cols-2 gap-3">
                              {tab.audience.highlights.map((h) => (
                                <li
                                  key={h.id ?? h.label}
                                  className="border-border bg-muted/40 rounded-lg border p-3"
                                >
                                  <p className="font-display text-xl font-extrabold">
                                    {h.value}
                                    {h.valueSuffix ?? ""}
                                  </p>
                                  <p className="text-muted-foreground text-xs">
                                    {h.label}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-6">
                      {tab.networks && tab.networks.length > 0 ? (
                        <div>
                          <h4 className="text-sm font-bold tracking-wide uppercase">
                            Redes
                          </h4>
                          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {tab.networks.map((net) => (
                              <li
                                key={net.id ?? net.network}
                                className="border-border bg-background flex items-center gap-2 rounded-lg border p-2 text-sm"
                              >
                                <NetworkIcon
                                  network={net.network}
                                  className="text-primary h-4 w-4"
                                />
                                <span className="font-semibold">
                                  {formatCompact(net.followers)}
                                </span>
                                <span className="text-muted-foreground capitalize">
                                  {net.network}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {tab.adFormats && tab.adFormats.length > 0 ? (
                        <div>
                          <h4 className="text-sm font-bold tracking-wide uppercase">
                            Formatos de pauta
                          </h4>
                          <ul className="mt-3 space-y-2">
                            {tab.adFormats.map((f) => (
                              <li
                                key={f.id ?? f.name}
                                className="border-border bg-background flex items-center justify-between gap-3 rounded-lg border p-3"
                              >
                                <span className="text-sm font-semibold">{f.name}</span>
                                {f.downloadUrl ? (
                                  <Link
                                    href={f.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary text-xs font-bold underline"
                                  >
                                    Briefing →
                                  </Link>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {tab.ctaContact?.label && tab.ctaContact?.href ? (
                        <Button
                          size="lg"
                          variant={tab.ctaContact.variant ?? "default"}
                          asChild
                          className="w-full"
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
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </Container>
    </Section>
  );
}
