import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { brandMeta } from "@/lib/brand";
import { mediaAlt, mediaUrl, type MediaLike } from "@/lib/media";
import { cn } from "@/lib/utils";

export interface FormatCardProps {
  name: string;
  brand?: string | null;
  category?: string | null;
  image?: MediaLike | number | string | null;
  /** Specs rendered as HTML/lexical — el block las pasa ya como ReactNode. */
  specs?: React.ReactNode;
  downloadUrl?: string | null;
  className?: string;
}

export function FormatCard({
  name,
  brand,
  category,
  image,
  specs,
  downloadUrl,
  className,
}: FormatCardProps) {
  const url = mediaUrl(image);
  const brandLabel = brand ? brandMeta(brand).label : null;

  return (
    <Card className={cn("flex flex-col overflow-hidden", className)}>
      {url ? (
        <div className="bg-muted relative aspect-[4/3] w-full">
          <Image
            src={url}
            alt={mediaAlt(image, name)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {brandLabel ? <Badge variant="secondary">{brandLabel}</Badge> : null}
          {category ? <Badge variant="outline">{category}</Badge> : null}
        </div>
        <h3 className="text-lg leading-tight font-bold">{name}</h3>
        {specs ? (
          <div className="text-muted-foreground text-sm leading-relaxed">{specs}</div>
        ) : null}
        {downloadUrl ? (
          <div className="mt-auto pt-2">
            <Button variant="outline" size="sm" asChild>
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                Descargar briefing
              </a>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
