"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Badge,
  Card,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { brandMeta } from "@/lib/brand";
import { mediaAlt, mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { BrandedContentBlockProps } from "../types";

export function BrandedContentBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  items,
  layout,
}: BrandedContentBlockProps) {
  if (!items || items.length === 0) return null;

  if (layout === "carousel") {
    return (
      <Section id={anchorId ?? undefined} tone="default" padding="lg">
        <Container size="xl">
          <SectionHeading
            eyebrow={eyebrow ?? undefined}
            title={heading}
            description={description ?? undefined}
          />
          <Carousel opts={{ align: "start" }} className="mt-10">
            <CarouselContent>
              {items.map((item) => (
                <CarouselItem
                  key={item.id ?? item.headline}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <BrandedItemCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex justify-end gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </Container>
      </Section>
    );
  }

  return (
    <Section id={anchorId ?? undefined} tone="default" padding="lg">
      <Container size="xl">
        <SectionHeading
          eyebrow={eyebrow ?? undefined}
          title={heading}
          description={description ?? undefined}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <BrandedItemCard key={item.id ?? item.headline} item={item} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

type Item = NonNullable<BrandedContentBlockProps["items"]>[number];

function BrandedItemCard({ item }: { item: Item }) {
  const url = mediaUrl(item.image);
  const href = item.href ?? undefined;
  const brand = item.brand ? brandMeta(item.brand) : null;

  const inner = (
    <Card className={cn("group h-full overflow-hidden")}>
      {url ? (
        <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={url}
            alt={mediaAlt(item.image, item.headline)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="space-y-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {item.eyebrow ? <Badge variant="outline">{item.eyebrow}</Badge> : null}
          {brand ? (
            <span
              className="text-xs font-bold tracking-wide uppercase"
              style={{ color: brand.color }}
            >
              {brand.label}
            </span>
          ) : null}
        </div>
        <h3 className="text-lg leading-tight font-bold">{item.headline}</h3>
        {item.description ? (
          <p className="text-muted-foreground text-sm">{item.description}</p>
        ) : null}
        {href ? (
          <span className="text-primary inline-block text-sm font-bold">Ver caso →</span>
        ) : null}
      </div>
    </Card>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="block focus-visible:outline-none">
      {inner}
    </Link>
  );
}
