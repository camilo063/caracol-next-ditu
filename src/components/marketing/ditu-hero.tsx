import Image from "next/image";
import Link from "next/link";

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

  return (
    <section
      id="inicio"
      className="relative flex flex-col items-center justify-center gap-6 overflow-hidden px-6 pt-32 pb-24 text-center sm:px-12 sm:pt-40 sm:pb-28 lg:gap-6 lg:px-[120px] lg:pt-[180px] lg:pb-[120px]"
    >
      {/* Background: imagen + gradient overlay 129deg #12082D → #3B1A93 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
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

      <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center gap-8">
        {/* Heading hero + sticker overlay */}
        <div className="relative w-full text-center">
          <h1
            className="font-display text-[44px] leading-[1] font-bold tracking-tight text-white uppercase sm:text-[64px] md:text-[80px] lg:text-[96px]"
            style={{ wordBreak: "break-word" }}
          >
            {headingRest ?? headingFallback}
          </h1>
          {/* Sticker "TU MARCA" — absolute, rotado -2.42deg, posicionado sobre
              el "Tu marca " transparente de la línea 1. */}
          <div
            className="pointer-events-none absolute top-[-4%] left-[10%] sm:top-[-7%] sm:left-[12%] lg:top-[-25px] lg:left-[140px]"
            style={{ transform: "rotate(-2.42deg)" }}
          >
            <span
              className="font-display inline-block rounded-[8px] px-2 pt-1.5 text-[44px] leading-none font-bold uppercase sm:text-[64px] md:text-[80px] lg:text-[96px]"
              style={{ backgroundColor: "#77EDED", color: "#12082D" }}
            >
              {stickerText}
            </span>
          </div>
        </div>

        {/* Description con accent cyan */}
        <p
          className={cn(
            "max-w-[960px] text-center text-[15px] leading-relaxed text-white sm:text-[18px] lg:px-[120px] lg:text-[20px]",
          )}
          style={{ fontFamily: "var(--font-spline-sans), system-ui, sans-serif" }}
        >
          {description ?? descriptionFallback}
        </p>

        {/* 3 botones outline cyan */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 lg:gap-6 lg:pt-8">
          {finalButtons.map((btn) => (
            <Link
              key={btn.icon}
              href={btn.href}
              className="font-display inline-flex items-center justify-center gap-[10px] rounded-[8px] border-[#77EDED] p-4 text-[14px] leading-[20px] font-bold whitespace-nowrap uppercase transition-opacity hover:opacity-80 sm:text-[16px] lg:text-[20px]"
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
        </div>
      </div>
    </section>
  );
}
