import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  Container,
  Section,
  SectionHeading,
  Stat,
} from "@/components/ui";
import { NetworkIcon } from "@/components/marketing";
import { formatCompact, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AudienceNetworksBlockProps } from "../types";

export function AudienceNetworksBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  audience,
  networks,
  highlightedNetwork,
}: AudienceNetworksBlockProps) {
  return (
    <Section id={anchorId ?? undefined} tone="default" padding="lg">
      <Container size="xl">
        <SectionHeading
          eyebrow={eyebrow ?? undefined}
          title={heading}
          description={description ?? undefined}
          align="left"
          titleLevel="h2"
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-start lg:gap-12">
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 sm:p-10">
            <Stat
              value={formatCompact(audience.reach)}
              valueSuffix={audience.reachSuffix ?? undefined}
              label={audience.reachLabel ?? "Personas alcanzadas"}
              size="2xl"
              tone="inverse"
            />
            {audience.breakdown && audience.breakdown.length > 0 ? (
              <ul className="mt-8 space-y-3 border-t border-white/20 pt-6">
                {audience.breakdown.map((item) => (
                  <li
                    key={item.id ?? item.label}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-white/80">{item.label}</span>
                    <span className="font-bold text-white">
                      {formatCompact(item.value)}
                      {item.suffix ?? ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {networks && networks.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {networks.map((net) => {
                const isHighlighted = net.network === highlightedNetwork;
                return (
                  <Card
                    key={net.id ?? net.network}
                    className={cn(
                      "transition-shadow",
                      isHighlighted && "ring-primary ring-2 ring-offset-2",
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="bg-primary/10 text-primary inline-flex h-10 w-10 items-center justify-center rounded-lg">
                          <NetworkIcon network={net.network} />
                        </div>
                        {typeof net.growth === "number" ? (
                          <span className="text-success inline-flex items-center gap-1 text-xs font-bold">
                            <TrendingUp className="h-3 w-3" />
                            {formatPercent(net.growth)}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-3">
                        <p className="font-display text-2xl leading-none font-extrabold">
                          {formatCompact(net.followers)}
                        </p>
                        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                          seguidores
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-foreground/80 capitalize">
                          {net.network}
                        </span>
                        {net.handle ? (
                          <span className="text-muted-foreground text-xs">
                            {net.handle}
                          </span>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Helper data oculto a11y: para que el contenido sea descriptivo. */}
        <p className="sr-only">
          Alcance total: {formatNumber(audience.reach)}
          {audience.reachSuffix ?? ""}.
        </p>
      </Container>
    </Section>
  );
}
