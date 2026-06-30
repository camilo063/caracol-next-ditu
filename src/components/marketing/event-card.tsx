import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateRange } from "@/lib/format";
import { mediaAlt, mediaUrl, type MediaLike } from "@/lib/media";
import { cn } from "@/lib/utils";

export interface EventCardProps {
  name: string;
  dateStart: string | Date;
  dateEnd?: string | Date | null;
  description?: string | null;
  image?: MediaLike | number | string | null;
  importance?: "critical" | "high" | "medium" | null;
  category?: string | null;
  badge?: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  className?: string;
}

const importanceVariants = {
  critical: "destructive",
  high: "warning",
  medium: "secondary",
} as const;

export function EventCard({
  name,
  dateStart,
  dateEnd,
  description,
  image,
  importance,
  category,
  badge,
  ctaLabel,
  ctaHref,
  className,
}: EventCardProps) {
  const url = mediaUrl(image);
  const date = formatDateRange(dateStart, dateEnd);
  return (
    <Card className={cn("overflow-hidden", className)}>
      {url ? (
        <div className="bg-muted relative aspect-[16/9] w-full">
          <Image
            src={url}
            alt={mediaAlt(image, name)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
          {badge ? (
            <Badge className="absolute top-3 right-3" variant="ditu">
              {badge}
            </Badge>
          ) : null}
        </div>
      ) : null}
      <CardContent className="space-y-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {importance ? (
            <Badge variant={importanceVariants[importance]}>
              {importance === "critical"
                ? "Crítico"
                : importance === "high"
                  ? "Alto"
                  : "Medio"}
            </Badge>
          ) : null}
          {category ? <Badge variant="outline">{category}</Badge> : null}
          <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {date}
          </span>
        </div>
        <h3 className="text-xl leading-tight font-bold">{name}</h3>
        {description ? (
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        ) : null}
        {ctaLabel && ctaHref ? (
          <Button variant="link" size="sm" asChild className="px-0">
            <a href={ctaHref}>{ctaLabel} →</a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
