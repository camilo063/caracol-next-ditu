"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { ParallaxBackground } from "@/components/animations";
import { cn } from "@/lib/utils";

/**
 * DituHero — implementación 1:1 del frame Figma 512:2246.
 *
 * Specs (Figma MCP):
 *  - Container: bg gradient 129deg #12082D → #3B1A93 sobre imagen de fondo
 *    (con overlay translúcido).
 *  - Padding pt-180 pb-120 px-120 en desktop.
 *  - Heading hero gigante 96px Ditu Display Bold uppercase con:
 *    * "TU MARCA" sticker rotado -2.42deg (bg #77EDED, text #12082D).
 *    * Espacio reservado en la línea 1 (Tu marca transparente).
 *    * Resto: "EN TODAS LAS PANTALLAS," en blanco + "EN TODO MOMENTO"
 *      en #77EDED (cyan accent).
 *  - Description: Spline Sans Regular 20px white con accents bold cyan.
 *  - 3 botones outline: GOOGLE PLAY + APP STORE + PORTAL WEB.
 *    border + text #77EDED, gap-10, p-16, rounded-8.
 */
export interface DituHeroProps {
  /** Texto del sticker (default "TU MARCA"). */
  stickerText?: string;
  /** Resto del heading sin el sticker (default split en líneas con cyan). */
  headingRest?: React.ReactNode;
  /** Descripción con marcado rich (puede incluir spans bold cyan). */
  description?: React.ReactNode;
  /** Botones de acción inferiores. */
  buttons?: Array<{
    label: string;
    href: string;
    icon: "googleplay" | "appstore" | "tv";
  }>;
}

const ICON_PATHS: Record<string, string> = {
  googleplay: "/ditu/googleplay.svg",
  appstore: "/ditu/appstore.svg",
  tv: "/ditu/tv.svg",
};

export function DituHero({
  stickerText = "TU MARCA",
  headingRest,
  description,
  buttons,
}: DituHeroProps) {
  const headingFallback = (
    <>
      {/* Espacio reservado (transparente) para que el sticker se posicione encima
          en la línea 1, alineado con donde diría "TU MARCA". */}
      <span className="leading-[1] text-transparent">Tu marca </span>
      <span className="leading-[1]">en todas las pantallas, </span>
      <span className="leading-[1]" style={{ color: "#77EDED" }}>
        en todo momento
      </span>
    </>
  );

  const descriptionFallback = (
    <>
      Somos ditu la plataforma OTT que integra lo mejor de Caracol Televisión en un{" "}
      <span className="font-bold" style={{ color: "#77EDED" }}>
        ecosistema multiplataforma
      </span>
      , desde la pantalla grande hasta el smartphone. Ofrecemos una experiencia gratuita
      de fácil acceso que se convierte en la{" "}
      <span className="font-bold" style={{ color: "#77EDED" }}>
        vitrina estratégica ideal para que tu marca
      </span>{" "}
      conecte con una audiencia masiva, fiel y comprometida.
    </>
  );

  const buttonsFallback: NonNullable<DituHeroProps["buttons"]> = [
    { label: "Google Play", href: "#", icon: "googleplay" },
    { label: "App Store", href: "#", icon: "appstore" },
    { label: "Portal web", href: "#", icon: "tv" },
  ];

  const finalButtons = buttons ?? buttonsFallback;
  const reduceMotion = useReducedMotion();

  // Stagger Framer Motion (spec Camilo): cada elemento entra con delay 0.1-0.2s.
  // En reduced-motion: render directo sin animación.
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.15,
        delayChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id="inicio"
      className="relative flex flex-col items-center justify-center gap-6 overflow-hidden px-6 pt-32 pb-24 text-center sm:px-12 sm:pt-40 sm:pb-28 lg:gap-[24px] lg:px-[120px] lg:pt-[180px] lg:pb-[120px]"
    >
      {/* Background con parallax — Framer Motion, speed 0.4 (spec).
          Mobile y reduced-motion: desactivado automáticamente. */}
      <ParallaxBackground speed={0.4} className="pointer-events-none absolute inset-0">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/ditu/hero-bg.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(129.43deg, rgb(18, 8, 45) 6.03%, rgb(59, 26, 147) 97.81%)",
              opacity: 0.92,
            }}
          />
        </div>
      </ParallaxBackground>

      {/* Content wrapper — Figma 512:3281 + Framer Motion stagger (spec Camilo).
          Cada hijo entra con delay 0.15s en cascada. No max-w: padding-x del
          section (px-120 en lg) ya limita a 1200px. */}
      <motion.div
        className="relative z-10 flex w-full flex-col items-center gap-6 sm:gap-7 lg:gap-[32px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Heading hero + sticker overlay — Figma 649:4298 */}
        <motion.div className="relative w-full" variants={itemVariants}>
          <h1
            className="font-display text-center font-bold tracking-tight text-white uppercase"
            style={{
              wordBreak: "break-word",
              // Fluid: 44px (mobile) → 96px (1440+). lineHeight 1 = font-size (Figma usa 96/96).
              fontSize: "clamp(2.75rem, 1.5rem + 5vw, 6rem)",
              lineHeight: 1,
            }}
          >
            {headingRest ?? headingFallback}
          </h1>
          {/* Sticker "TU MARCA" — Figma 725:2507:
              absolute left-[140px] top-[-25px] w-[384.962px] h-[117.973px], rotated -2.42deg.
              Inner: bg #77EDED, rounded-8, pt-6 px-8 (Figma: pt-[6px] px-[8px]). */}
          <div
            className="pointer-events-none absolute top-[-4%] left-[10%] sm:top-[-7%] sm:left-[12%] lg:top-[-25px] lg:left-[140px]"
            style={{ transform: "rotate(-2.42deg)" }}
          >
            <span
              className="font-display inline-block rounded-[8px] px-[8px] pt-[6px] font-bold uppercase"
              style={{
                backgroundColor: "#77EDED",
                color: "#12082D",
                fontSize: "clamp(2.75rem, 1.5rem + 5vw, 6rem)",
                lineHeight: 1,
              }}
            >
              {stickerText}
            </span>
          </div>
        </motion.div>

        {/* Description wrapper — Figma 797:3403: w-full px-[120px] flex items-center.
            El <p> hereda 20px Spline Sans Regular center white. */}
        <motion.div
          className="flex w-full flex-col items-center justify-center lg:px-[120px]"
          variants={itemVariants}
        >
          <p
            className={cn(
              "w-full text-center text-[15px] text-white sm:text-[18px] lg:text-[20px]",
            )}
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              lineHeight: "normal",
            }}
          >
            {description ?? descriptionFallback}
          </p>
        </motion.div>

        {/* Buttons wrapper — Figma 722:2615: gap-[24px] items-center pt-[32px].
            Mobile (spec usuario): flex-wrap centrado (NO columna rígida) —
            que los botones se apilen en columnas según ancho disponible.
            Desktop: flex-row con gap-24. */}
        <motion.div
          className="flex flex-row flex-wrap items-center justify-center gap-3 pt-4 sm:gap-6 lg:gap-[24px] lg:pt-[32px]"
          variants={itemVariants}
        >
          {finalButtons.map((btn) => (
            <Link
              key={btn.icon}
              href={btn.href}
              className="font-display inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-[8px] p-[16px] text-[14px] leading-[20px] font-bold whitespace-nowrap uppercase transition-all duration-200 hover:bg-[#77EDED]/10 hover:shadow-md hover:shadow-[#77EDED]/20 active:scale-[0.98] sm:text-[16px] lg:text-[20px]"
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "#77EDED",
                color: "#77EDED",
              }}
            >
              <Image
                src={ICON_PATHS[btn.icon] ?? ICON_PATHS.tv!}
                alt=""
                width={24}
                height={24}
                className="h-5 w-5 sm:h-6 sm:w-6"
              />
              {btn.label}
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
