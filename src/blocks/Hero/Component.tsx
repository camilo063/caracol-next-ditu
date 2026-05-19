import Image from "next/image";
import Link from "next/link";

import { ParallaxBackground } from "@/components/animations";
import { Button, Container, Section, Stat } from "@/components/ui";
import { isMediaVideo, mediaAlt, mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import { BrandIconsRow } from "./BrandIconsRow";
import type { HeroBlockProps } from "../types";

const TONE_TO_SECTION = {
  default: "default",
  "caracolnext-deep": "primary",
  "ditu-deep": "ditu-deep",
  "image-overlay": "dark",
} as const;

export function HeroBlockComponent({
  anchorId,
  eyebrow,
  heading,
  subheading,
  keyStats,
  brandIcons,
  backgroundImage,
  backgroundVideo,
  primaryCta,
  secondaryCta,
  tone,
}: HeroBlockProps) {
  const sectionTone = TONE_TO_SECTION[tone ?? "default"];
  const bgImageUrl = mediaUrl(backgroundImage);
  const bgVideoUrl = mediaUrl(backgroundVideo);
  const hasBackground = Boolean(bgImageUrl || bgVideoUrl);
  const isDarkTone = hasBackground || sectionTone !== "default";

  const heroBg =
    tone === "caracolnext-deep"
      ? "linear-gradient(180deg, #003380 0%, #003CCA 50%, #0D3AA0 100%)"
      : tone === "ditu-deep"
        ? "linear-gradient(180deg, #1F1647 0%, #2A1F5E 60%, #1F1647 100%)"
        : undefined;

  return (
    <Section
      id={anchorId ?? undefined}
      tone={sectionTone}
      padding="xl"
      className="relative overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.5rem]"
      style={heroBg ? { background: heroBg } : undefined}
    >
      {hasBackground ? (
        <ParallaxBackground
          speed={0.4}
          className="absolute inset-0 -z-10 will-change-transform"
        >
          {bgVideoUrl && isMediaVideo(backgroundVideo) ? (
            <video
              src={bgVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : bgImageUrl ? (
            <Image
              src={bgImageUrl}
              alt={mediaAlt(backgroundImage, heading)}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
        </ParallaxBackground>
      ) : null}

      <Container size="xl" className="relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          {eyebrow ? (
            <p
              className={cn(
                "text-fluid-tag font-bold tracking-[0.18em] uppercase",
                isDarkTone ? "text-white/80" : "text-primary",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              "text-fluid-display font-display font-black tracking-tight",
              isDarkTone ? "text-white" : "text-foreground",
            )}
          >
            {heading}
          </h1>
          {subheading ? (
            <p
              className={cn(
                "text-fluid-subtitle max-w-2xl leading-relaxed",
                isDarkTone ? "text-white/85" : "text-muted-foreground",
              )}
            >
              {subheading}
            </p>
          ) : null}

          {brandIcons && brandIcons.length > 0 ? (
            <BrandIconsRow items={brandIcons} className="mt-4" />
          ) : null}

          {primaryCta?.label || secondaryCta?.label ? (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              {primaryCta?.label && primaryCta?.href ? (
                <Button size="lg" variant={primaryCta.variant ?? "default"} asChild>
                  <Link
                    href={primaryCta.href}
                    target={primaryCta.openInNewTab ? "_blank" : undefined}
                  >
                    {primaryCta.label}
                  </Link>
                </Button>
              ) : null}
              {secondaryCta?.label && secondaryCta?.href ? (
                <Button size="lg" variant={secondaryCta.variant ?? "outline"} asChild>
                  <Link
                    href={secondaryCta.href}
                    target={secondaryCta.openInNewTab ? "_blank" : undefined}
                  >
                    {secondaryCta.label}
                  </Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        {keyStats && keyStats.length > 0 ? (
          <div
            className={cn(
              "mt-14 grid gap-8 sm:gap-12",
              keyStats.length === 1 && "mx-auto max-w-md grid-cols-1",
              keyStats.length === 2 && "mx-auto max-w-3xl grid-cols-1 sm:grid-cols-2",
              keyStats.length === 3 && "grid-cols-1 sm:grid-cols-3",
              keyStats.length === 4 && "grid-cols-2 sm:grid-cols-4",
            )}
          >
            {keyStats.map((stat, i) => (
              <Stat
                key={stat.id ?? i}
                value={stat.value}
                valuePrefix={stat.valuePrefix ?? undefined}
                valueSuffix={stat.valueSuffix ?? undefined}
                label={stat.label}
                hint={stat.hint ?? undefined}
                size="2xl"
                tone={isDarkTone ? "inverse" : "default"}
                align="center"
              />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
