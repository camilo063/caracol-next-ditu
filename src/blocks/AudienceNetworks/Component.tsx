"use client";

import { CountUp } from "@/components/animations";
import { Container } from "@/components/ui";
import { NetworkIcon } from "@/components/marketing";
import { formatCompact, formatNumber } from "@/lib/format";
import type { AudienceNetworksBlockProps } from "../types";

const NAVY = "#003380";
const ACCENT_LIGHT_BLUE = "#00ACFF";

export function AudienceNetworksBlockComponent({
  anchorId,
  heading,
  audience,
  networks,
}: AudienceNetworksBlockProps) {
  const totalFollowers = (networks ?? []).reduce((sum, n) => sum + (n.followers ?? 0), 0);

  return (
    <section id={anchorId ?? "audiencia"} className="py-6 sm:py-8 lg:py-10">
      <div className="w-full overflow-hidden rounded-[2rem] bg-white py-12 sm:rounded-[2.5rem] sm:py-16 lg:py-20">
        <Container size="xl">
          {/* TOP: Nuestro Alcance + 4 stat cards */}
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_2fr] lg:gap-12">
            <div>
              <h2
                className="font-display text-3xl leading-tight font-bold sm:text-4xl"
                style={{ color: NAVY }}
              >
                {heading || "Nuestro Alcance"}
              </h2>
              <p
                className="font-display mt-6 text-5xl leading-none font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
                style={{ color: NAVY }}
              >
                <CountUp
                  value={audience.reach}
                  format={(v) => formatNumber(Math.round(v))}
                />
                {audience.reachSuffix ?? ""}
              </p>
              <p className="mt-3 text-base font-semibold" style={{ color: NAVY }}>
                {audience.reachLabel ?? "Usuarios mensuales"}
              </p>
              <p className="text-muted-foreground mt-4 text-xs">
                <span style={{ color: "#16a34a" }}>●</span> Fuente: Comscore Feb 2026
              </p>
            </div>

            {audience.breakdown && audience.breakdown.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-3">
                {audience.breakdown.slice(0, 4).map((item, idx) => {
                  const isPercent = (item.suffix ?? "").trim() === "%";
                  const isOrdinal =
                    !item.suffix && item.value > 0 && item.value < 10 && idx === 0;
                  const [pillLabel, subLabel] = item.label
                    .split("|")
                    .map((s) => s.trim());
                  return (
                    <div
                      key={item.id ?? item.label}
                      className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-5"
                    >
                      {pillLabel ? (
                        <span
                          className="inline-block self-start rounded-md px-2 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap text-white uppercase"
                          style={{ backgroundColor: ACCENT_LIGHT_BLUE }}
                        >
                          {pillLabel}
                        </span>
                      ) : null}
                      <p
                        className="font-display mt-4 text-3xl leading-none font-extrabold tracking-tight sm:text-4xl"
                        style={{ color: NAVY }}
                      >
                        {isOrdinal ? (
                          <>
                            #
                            <CountUp
                              value={item.value}
                              format={(v) => Math.round(v).toString()}
                            />
                          </>
                        ) : isPercent ? (
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
                        <p className="text-muted-foreground mt-2 text-xs leading-snug">
                          {subLabel}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* BOTTOM: Líderes en redes — title + total + 6 networks row */}
          {networks && networks.length > 0 ? (
            <div className="mt-16 lg:mt-24">
              <h3
                className="font-display text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
                style={{ color: NAVY }}
              >
                Líderes en redes
              </h3>
              <p
                className="font-display mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl"
                style={{ color: NAVY }}
              >
                +
                <CountUp value={totalFollowers} format={(v) => formatCompact(v)} /> de
                seguidores
              </p>

              <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6">
                {networks.slice(0, 6).map((net) => (
                  <div key={net.id ?? net.network} className="flex items-center gap-3">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white sm:h-16 sm:w-16"
                      style={{ backgroundColor: NAVY }}
                    >
                      <NetworkIcon
                        network={net.network}
                        className="h-7 w-7 sm:h-8 sm:w-8"
                      />
                    </div>
                    <div className="leading-tight">
                      <p
                        className="font-display text-xl font-extrabold sm:text-2xl"
                        style={{ color: NAVY }}
                      >
                        <CountUp value={net.followers} format={(v) => formatCompact(v)} />
                      </p>
                      <p className="text-muted-foreground text-xs font-medium">
                        Seguidores
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-muted-foreground mt-6 text-right text-xs">
                <span style={{ color: "#16a34a" }}>●</span> Fuente: Abril 6 2026
              </p>
            </div>
          ) : null}
        </Container>
      </div>
    </section>
  );
}
