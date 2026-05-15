import { TrendingUp } from "lucide-react";

import { Container, Section, SectionHeading } from "@/components/ui";
import { NetworkIcon } from "@/components/marketing";
import { formatCompact, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AudienceNetworksBlockProps } from "../types";

/**
 * AudienceNetworksBlock — "Nuestro Alcance" + 4 stat cards + Líderes en redes.
 * Matching Figma `caracol-next.png`.
 *
 * Convención de breakdown.label para mostrar título + sublabel:
 *   "#1 | Unidad digital Colombia"  → "#1" grande, "Unidad digital Colombia" pequeño.
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
    <Section id={anchorId ?? "audiencia"} tone="default" padding="lg">
      <Container size="xl">
        <SectionHeading
          eyebrow={eyebrow ?? undefined}
          title={heading}
          description={description ?? undefined}
          titleLevel="h2"
        />

        {/* Nuestro Alcance: big number + 4 stat cards */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-end">
          <div>
            <p className="text-foreground text-2xl leading-tight font-bold">
              Nuestro Alcance
            </p>
            <p className="font-display text-primary mt-3 text-5xl font-black tracking-tight sm:text-6xl">
              {formatNumber(audience.reach)}
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
            <div className="grid gap-3 sm:grid-cols-2">
              {audience.breakdown.slice(0, 4).map((item) => {
                const isPercent = (item.suffix ?? "").trim() === "%";
                const valueDisplay = isPercent
                  ? `${item.value}%`
                  : `${formatCompact(item.value)}${item.suffix ?? ""}`;
                const [mainLabel, subLabel] = item.label.split("|").map((s) => s.trim());
                return (
                  <div
                    key={item.id ?? item.label}
                    className="border-border bg-card rounded-2xl border p-5"
                  >
                    <p className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
                      {mainLabel ?? item.label}
                    </p>
                    <p className="font-display text-primary mt-2 text-3xl leading-tight font-extrabold">
                      {valueDisplay}
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

        {/* Líderes en redes */}
        {networks && networks.length > 0 ? (
          <div className="mt-12">
            <p className="text-foreground text-2xl font-bold">Líderes en redes</p>
            <p className="text-muted-foreground mt-1 text-sm">
              +{formatCompact(networks.reduce((sum, n) => sum + (n.followers ?? 0), 0))}{" "}
              de seguidores
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {networks.map((net) => (
                <div
                  key={net.id ?? net.network}
                  className="border-border bg-card flex items-center gap-3 rounded-xl border p-4"
                >
                  <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <NetworkIcon network={net.network} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl leading-none font-extrabold">
                      {formatCompact(net.followers)}
                    </p>
                    <p className="text-muted-foreground text-xs font-semibold">
                      Seguidores · <span className="capitalize">{net.network}</span>
                    </p>
                  </div>
                  {typeof net.growth === "number" ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-bold whitespace-nowrap",
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
    </Section>
  );
}
