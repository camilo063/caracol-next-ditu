import Image from "next/image";
import Link from "next/link";

import {
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
import { formatCompact } from "@/lib/format";
import { mediaAlt, mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { OurChannelsBlockProps } from "../types";

export function OurChannelsBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  channels,
  layout,
}: OurChannelsBlockProps) {
  if (!channels || channels.length === 0) return null;

  const cards = channels.map((c) => <ChannelCard key={c.id ?? c.name} channel={c} />);

  return (
    <Section id={anchorId ?? undefined} tone="default" padding="lg">
      <Container size="xl">
        <SectionHeading
          eyebrow={eyebrow ?? undefined}
          title={heading}
          description={description ?? undefined}
        />

        {layout === "carousel" ? (
          <Carousel opts={{ align: "start" }} className="mt-10">
            <CarouselContent>
              {channels.map((c) => (
                <CarouselItem key={c.id ?? c.name} className="sm:basis-1/2 lg:basis-1/4">
                  <ChannelCard channel={c} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex justify-end gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{cards}</div>
        )}
      </Container>
    </Section>
  );
}

type Channel = NonNullable<OurChannelsBlockProps["channels"]>[number];

function ChannelCard({ channel }: { channel: Channel }) {
  const url = mediaUrl(channel.logo);
  const Wrapper = channel.href ? Link : "div";

  return (
    <Wrapper
      href={channel.href ?? "#"}
      className={cn("group block", channel.href && "focus-visible:outline-none")}
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-transform",
          channel.href && "hover:-translate-y-1",
        )}
      >
        <div
          className="flex aspect-square items-center justify-center"
          style={{
            backgroundColor: channel.color ?? "var(--color-muted)",
          }}
        >
          {url ? (
            <Image
              src={url}
              alt={mediaAlt(channel.logo, channel.name)}
              width={120}
              height={120}
              className="h-16 w-auto object-contain"
            />
          ) : (
            <span className="font-display text-3xl font-black text-white">
              {channel.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="space-y-2 p-5">
          <h3 className="text-base font-bold">{channel.name}</h3>
          {channel.description ? (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {channel.description}
            </p>
          ) : null}
          {typeof channel.audienceSize === "number" ? (
            <p className="text-primary text-xs font-bold tracking-wide uppercase">
              {formatCompact(channel.audienceSize)} audiencia
            </p>
          ) : null}
        </div>
      </Card>
    </Wrapper>
  );
}
