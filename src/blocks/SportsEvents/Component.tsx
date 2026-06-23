import Image from "next/image";

import {
  Badge,
  Card,
  CardContent,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { formatCompact, formatDate } from "@/lib/format";
import { mediaAlt, mediaUrl } from "@/lib/media";
import type { SportsEventsBlockProps } from "../types";

export function SportsEventsBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  events,
  highlightExclusive,
}: SportsEventsBlockProps) {
  if (!events || events.length === 0) return null;

  return (
    <Section id={anchorId ?? undefined} tone="default" padding="lg">
      <Container size="xl">
        <SectionHeading
          eyebrow={eyebrow ?? undefined}
          title={heading}
          description={description ?? undefined}
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => {
            const url = mediaUrl(e.image);
            const showExclusive = highlightExclusive && e.exclusivity;
            return (
              <Card key={e.id ?? e.name} className="overflow-hidden">
                {url ? (
                  <div className="bg-muted relative aspect-[16/9] w-full">
                    <Image
                      src={url}
                      alt={mediaAlt(e.image, e.name)}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    {showExclusive ? (
                      <Badge className="absolute top-3 right-3" variant="ditu">
                        Exclusivo Ditu
                      </Badge>
                    ) : null}
                  </div>
                ) : null}
                <CardContent className="space-y-3 p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="outline">{e.sport}</Badge>
                    {e.league ? <Badge variant="secondary">{e.league}</Badge> : null}
                    <span className="text-muted-foreground font-semibold tracking-wide uppercase">
                      {formatDate(e.dateStart)}
                    </span>
                  </div>
                  <h3 className="text-xl leading-tight font-bold">{e.name}</h3>
                  {typeof e.viewershipEstimate === "number" ? (
                    <p className="text-muted-foreground text-sm">
                      <span className="text-foreground font-bold">
                        {formatCompact(e.viewershipEstimate)}
                      </span>{" "}
                      audiencia estimada
                    </p>
                  ) : null}
                  {e.ctaLabel && e.ctaHref ? (
                    <a
                      href={e.ctaHref}
                      target={e.ctaOpenInNewTab ? "_blank" : undefined}
                      rel={e.ctaOpenInNewTab ? "noopener noreferrer" : undefined}
                      className="text-primary inline-block text-sm font-bold"
                    >
                      {e.ctaLabel} →
                    </a>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
