"use client";

import { TrendingUp } from "lucide-react";

import { CountUp } from "@/components/animations";
import { Container } from "@/components/ui";
import { NetworkIcon } from "@/components/marketing";
import { formatCompact, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AudienceNetworksBlockProps } from "../types";

/**
 * AudienceNetworksBlock — "Nuestro Alcance" + stats horizontales + Líderes en redes.
 * Matching Figma `home caracol next.pdf`:
 *  - Sección con rounded corners + side margins (card-like).
 *  - Big number izquierda + 4 stat cards en una fila horizontal a la derecha.
 *  - Redes en una fila horizontal (6 networks).
 *  - Mobile = todo apilado vertical.
 *
 * Animaciones: CountUp en cada número (arranca al entrar al viewport).
 *
 * Convención de breakdown.label "TÍTULO | Subtítulo".
 */
export function AudienceNetworksBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  audience,
  networks,
}: AudienceNetworksBlockProps) {
  return (
    <section id={anchorId ?? "audiencia"} className="py-6 sm:py-8 lg:py-10">
      <div className="bg-card w-full overflow-hidden rounded-[2rem] py-14 sm:rounded-[2.5rem] sm:py-16 lg:py-20">
        <Container size="xl">
          {(eyebrow || description) && (
            <div className="mb-8">
              {eyebrow ? (
                <p className="text-primary text-fluid-tag font-bold tracking-[0.18em] uppercase">
                  {eyebrow}
                </p>
              ) : null}
              {description ? (
                <p className="text-muted-foreground text-fluid-body mt-2 max-w-3xl">
                  {description}
                </p>
              ) : null}
            </div>
          )}

          {/* Nuestro Alcance: big number + 4 stat cards en grid 4-col (lg). */}
          <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-10">
            <div>
              <p className="text-foreground text-2xl leading-tight font-bold">
                {heading || "Nuestro Alcance"}
              </p>
              <p className="font-display text-primary mt-3 text-5xl font-black tracking-tight sm:text-6xl">
                <CountUp
                  value={audience.reach}
                  format={(v) => formatNumber(Math.round(v))}
                />
                {audience.reachSuffix ?? ""}
              </p>
              <p className="text-muted-foreground mt-1 text-sm font-semibold">
                {audience.reachLabel ?? "Usuarios mensuales"}
              </p>
              <p className="text-muted-foreground mt-3 text-xs">
                ● Fuente: Comscore Feb 2026
              </p>
            </div>

            {audience.breakdown && audience.breakdown.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {audience.breakdown.slice(0, 4).map((item) => {
                  const isPercent = (item.suffix ?? "").trim() === "%";
                  const [mainLabel, subLabel] = item.label
                    .split("|")
                    .map((s) => s.trim());
                  return (
                    <div
                      key={item.id ?? item.label}
                      className="border-border bg-background rounded-2xl border p-5"
                    >
                      <p className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
                        {mainLabel ?? item.label}
                      </p>
                      <p className="font-display text-primary mt-2 text-2xl leading-tight font-extrabold sm:text-3xl">
                        {isPercent ? (
                          <>
                            <CountUp value={item.value} format={(v) => v.toFixed(1)} />%
                          </>
                        ) : (
                          <>
                            <CountUp
                              value={item.value}
                              format={(v) => formatCompact(v)}
                            />
                            {item.suffix ?? ""}
                          </>
                        )}
                      </p>
                      {subLabel ? (
                        <p className="text-muted-foreground mt-1 text-xs">{subLabel}</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Líderes en redes — 6 networks en una fila horizontal (lg). */}
          {networks && networks.length > 0 ? (
            <div className="mt-10 lg:mt-14">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="text-foreground text-xl font-bold sm:text-2xl">
                  Líderes en redes
                </p>
                <p className="text-muted-foreground text-sm font-semibold">
                  +
                  <CountUp
                    value={networks.reduce((sum, n) => sum + (n.followers ?? 0), 0)}
                    format={(v) => formatCompact(v)}
                  />{" "}
                  de seguidores
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {networks.slice(0, 6).map((net) => (
                  <div
                    key={net.id ?? net.network}
                    className="border-border bg-background flex flex-col items-center gap-2 rounded-xl border p-4 text-center"
                  >
                    <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                      <NetworkIcon network={net.network} className="h-4 w-4" />
                    </div>
                    <p className="font-display text-base leading-none font-extrabold">
                      <CountUp value={net.followers} format={(v) => formatCompact(v)} />
                    </p>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase">
                      Seguidores
                    </p>
                    {typeof net.growth === "number" && net.growth !== 0 ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-bold",
                          net.growth >= 0 ? "text-success" : "text-destructive",
                        )}
                      >
                        <TrendingUp className="h-3 w-3" />
                        {formatPercent(net.growth)}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mt-3 text-right text-xs">
                ● Fuente: Abril 8 2026
              </p>
            </div>
          ) : null}
        </Container>
      </div>
    </section>
  );
}
