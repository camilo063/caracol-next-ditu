"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { ParallaxBackground } from "@/components/animations";
import { Button, Container, Section, Stat } from "@/components/ui";
import { isMediaVideo, mediaAlt, mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import { BrandIconsRow } from "./BrandIconsRow";
import type { HeroBlockProps } from "../types";

const itemVariants = {
  hidden: { opacity: 0, y: 56, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

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
  headingBold,
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

  // Background Figma 347:2015: solid navy #003381 con halo radial.
  // El gradient SVG del Figma tiene su centro en (50%, ~107%) — justo debajo
  // del bottom del hero — con elipse rx≈83% ry≈107%. El glow brillante visible
  // está concentrado en la parte inferior-central del hero, fade hacia el top.
  const heroBg =
    tone === "caracolnext-deep"
      ? "radial-gradient(ellipse 83% 107% at 50% 107%, rgba(0,172,255,1) 0%, rgba(0,112,192,0.5) 50%, rgba(0,51,129,0) 100%), #003381"
      : tone === "ditu-deep"
        ? "linear-gradient(180deg, #1F1647 0%, #2A1F5E 60%, #1F1647 100%)"
        : undefined;

  return (
    <Section
      id={anchorId ?? undefined}
      tone={sectionTone}
      padding="none"
      className="relative overflow-hidden py-[40px] sm:py-[60px] md:py-[94px]"
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
        {/* Layout Figma 347:2015: gap-40 entre tagline/heading-group/icons.
            Heading-group interno: gap-24 entre h1 y subheading. */}
        {/* gap-6 reducido (era gap-10): bug "label muy separado del título". */}
        <motion.div
          className="mx-auto flex flex-col items-center gap-[10px] text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2, delayChildren: 0.15 } },
          }}
        >
          {eyebrow ? (
            <motion.p
              variants={itemVariants}
              className="font-poppins text-[13px] leading-normal font-bold uppercase sm:text-[16px] lg:text-[20px]"
              style={{ color: "#00ACFF" }}
            >
              {eyebrow}
            </motion.p>
          ) : null}

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-6 text-center"
          >
            <h1
              className="font-display text-[40px] leading-[1.125] font-normal sm:text-[48px] lg:text-[64px] lg:leading-[72px]"
              style={{ color: isDarkTone ? "#FFFFFF" : undefined }}
            >
              <span>{heading}</span>
              {headingBold ? (
                <>
                  <br />
                  <span className="font-bold">{headingBold}</span>
                </>
              ) : null}
            </h1>
            {subheading ? (
              <p
                className="font-display text-[20px] leading-[1] font-medium sm:text-[24px] lg:text-[32px]"
                style={{ color: isDarkTone ? "rgba(207,206,204,0.81)" : undefined }}
              >
                {subheading}
              </p>
            ) : null}
          </motion.div>

          {brandIcons && brandIcons.length > 0 ? (
            <motion.div variants={itemVariants}>
              <BrandIconsRow items={brandIcons} className="p-4" />
            </motion.div>
          ) : null}

          {primaryCta?.label || secondaryCta?.label ? (
            <motion.div
              variants={itemVariants}
              className="mt-2 flex flex-wrap items-center justify-center gap-3"
            >
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
            </motion.div>
          ) : null}
        </motion.div>

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
