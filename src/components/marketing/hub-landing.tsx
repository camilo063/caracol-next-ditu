"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CountUp } from "@/components/animations";
import { cn } from "@/lib/utils";

/**
 * HubLanding — landing principal en `/` (Home Caracol Medios).
 *
 * Specs Figma 892:5740 — Home Caracol Medios:
 *  - Bg: solid #003381 con 2 radial gradients decorativos (rojos blueish glow)
 *  - Header: "Logo Caracol MEDIOS" + divider line + "DIGITAL" (top-40 left-40)
 *  - Left side (hero):
 *    · Eyebrow Poppins Bold 20 uppercase color #00ACFF
 *    · Heading Montserrat 74/lh-80 tracking -2.96px, mix Extra/Semi-Bold
 *    · CTA "Contáctenos" bg #00ACFF Montserrat SemiBold 18 white w-306
 *  - Right side: 2 product cards (Caracol Next 328 + Ditu 284) + 4 metric
 *    cards + 2 "Conoce" CTAs
 *  - Metric cards: bg #f1f1f1 border (#003381 ó #561BDB), 60/lh-48 ExtraBold,
 *    label 20/lh-24 SemiBold #464553, icon 40px abs top-left
 *  - 2 "Conoce" CTAs: outline white (Caracol Next) + gradient violet (Ditu)
 *  - Footer copyright: pill bg-black/25 rounded-90 p-10 Montserrat SemiBold 16
 *
 * Spec usuario (Camilo):
 *  - Mobile: todo apilado verticalmente, metrics OCULTOS, cards una debajo
 *    de la otra
 *  - Números animan 0 → final al entrar viewport (CountUp, Framer Motion)
 */
export interface HubLandingProps {
  eyebrow: string;
  heading: React.ReactNode;
  contactLabel: string;
  contactHref: string;
  brands: {
    caracolNext: {
      title: React.ReactNode;
      description: string;
      ctaLabel: string;
      href: string;
    };
    ditu: {
      title: React.ReactNode;
      description: string;
      ctaLabel: string;
      href: string;
    };
  };
  stats: Array<{
    icon: "users" | "tv" | "zap" | "clock";
    /** Valor numérico para CountUp. */
    numericValue?: number;
    /** Sufijo después del número animado (e.g. "M", "K", "Min"). */
    suffix?: string;
    /** Prefijo opcional (e.g. "+"). */
    prefix?: string;
    /** Fallback como string si no se quiere CountUp. */
    value: string;
    label: string;
    /** "caracolnext" → border #003381, number #003381. "ditu" → border
        #561BDB, number #12082D. */
    accent?: "caracolnext" | "ditu";
  }>;
  copyright: string;
}

const ICON_PATHS = {
  users: "/home/icon-users.svg",
  tv: "/home/icon-screens.svg",
  zap: "/home/icon-followers.svg",
  clock: "/home/icon-watch.svg",
} as const;

export function HubLanding({
  eyebrow,
  heading,
  contactLabel,
  contactHref,
  brands,
  stats,
  copyright,
}: HubLandingProps) {
  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden text-white"
      style={{ backgroundColor: "#003381" }}
    >
      {/* Radial gradient decorativos — Figma 892:5741 + 892:5742 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden lg:block"
        style={{
          left: "calc(50% - 12px)",
          top: "-354px",
          width: "1210px",
          height: "1210px",
          background:
            "radial-gradient(circle at center, rgba(1,91,196,1) 0%, rgba(0,51,129,0) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden lg:block"
        style={{
          left: "-565px",
          top: "0",
          width: "1210px",
          height: "1210px",
          background:
            "radial-gradient(circle at center, rgba(1,91,196,1) 0%, rgba(0,51,129,0) 100%)",
        }}
      />

      {/* Header — Figma 892:6210 */}
      <header className="relative z-10 px-6 pt-8 sm:px-10 lg:px-[40px] lg:pt-[40px]">
        <CaracolMediosLogo />
      </header>

      {/* Body — desktop 2-col, mobile stacked */}
      <main className="relative z-10 flex flex-1 flex-col gap-12 px-6 py-12 sm:px-10 lg:flex-row lg:items-start lg:gap-[64px] lg:px-[84px] lg:pt-[150px] lg:pb-[80px]">
        {/* Left — hero content */}
        <div className="flex flex-col items-start lg:max-w-[611px] lg:pt-[68px]">
          <p
            className="text-[14px] font-bold uppercase sm:text-[18px] lg:text-[20px]"
            style={{
              color: "#00ACFF",
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              lineHeight: "normal",
            }}
          >
            {eyebrow}
          </p>
          {/* Heading 74/lh-80 Montserrat tracking-[-2.96px] mixed weights */}
          <h1
            className="mt-[24px] text-[44px] font-bold sm:text-[56px] lg:text-[74px]"
            style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              color: "#FFFFFF",
              lineHeight: "80px",
              letterSpacing: "-2.96px",
            }}
          >
            {heading}
          </h1>
          {/* CTA Contáctenos — bg #00ACFF, Montserrat SemiBold 18, w-306 */}
          <Link
            href={contactHref}
            className="mt-[40px] inline-flex w-full max-w-[306px] items-center justify-center rounded-[4px] border px-[48px] py-[12px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90 sm:text-[18px]"
            style={{
              backgroundColor: "#00ACFF",
              borderColor: "#00ACFF",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              lineHeight: "24px",
              minHeight: "32px",
            }}
          >
            {contactLabel}
          </Link>
        </div>

        {/* Right — product cards + metrics + bottom CTAs */}
        <div className="flex flex-1 flex-col gap-6 lg:max-w-[636px]">
          {/* Product cards — Caracol Next (w-328) + Ditu (w-284). Mobile stacked. */}
          <div className="flex flex-col gap-4 sm:flex-row lg:gap-[24px]">
            {/* Caracol Next card */}
            <ProductCard
              variant="caracolnext"
              title={brands.caracolNext.title}
              description={brands.caracolNext.description}
            />
            {/* Ditu card */}
            <ProductCard
              variant="ditu"
              title={brands.ditu.title}
              description={brands.ditu.description}
            />
          </div>

          {/* Metric cards — Spec usuario: en MOBILE se ocultan. Desktop: grid 2×2 */}
          <div className="hidden grid-cols-2 gap-x-[20px] gap-y-[24px] sm:grid">
            {stats.map((s, i) => (
              <MetricCard
                key={i}
                icon={ICON_PATHS[s.icon]}
                numericValue={s.numericValue}
                prefix={s.prefix}
                suffix={s.suffix}
                fallbackValue={s.value}
                label={s.label}
                accent={s.accent ?? "caracolnext"}
              />
            ))}
          </div>

          {/* Bottom CTAs — Conoce Caracol Next + Conoce ditu. Mobile stacked.
              whitespace-nowrap para evitar wrap a 2 líneas. Padding reducido
              (px-24) en lg para que el label quepa en una línea. */}
          <div className="flex flex-col gap-4 sm:flex-row lg:gap-[24px]">
            <Link
              href={brands.caracolNext.href}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-[4px] border px-6 py-[12px] text-[14px] font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 lg:px-[24px] lg:text-[16px]"
              style={{
                borderColor: "#FFFFFF",
                backgroundColor: "transparent",
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                lineHeight: "24px",
                minHeight: "32px",
              }}
            >
              {brands.caracolNext.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={brands.ditu.href}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-[10px] px-6 py-[12px] text-[14px] font-semibold whitespace-nowrap text-[#FDFDFD] transition-opacity hover:opacity-90 lg:px-[24px] lg:text-[16px]"
              style={{
                background:
                  "linear-gradient(115.47deg, #8232F0 14.111%, #561BDB 81.738%)",
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                lineHeight: 1.5,
              }}
            >
              {brands.ditu.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer copyright pill — Figma 892:6164 */}
      <footer className="relative z-10 px-6 pb-8 sm:px-10 lg:px-[120px] lg:pb-[40px]">
        <div
          className="flex items-start justify-center overflow-clip rounded-[90px] p-[10px]"
          style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
        >
          <p
            className="text-[14px] font-semibold whitespace-nowrap text-white sm:text-[16px]"
            style={{
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              lineHeight: "24px",
            }}
          >
            {copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * ProductCard — tarjetas de producto (Caracol Next / Ditu).
 *  - Caracol Next: bg #003381 border #00ACFF w-328
 *  - Ditu: bg gradient #8232F0 → #561BDB border #8232F0 w-284
 *  - Logo h-32 + descripción 14/lh-20 Medium center
 *  - pt-40 pb-30 px-20 gap-24
 */
function ProductCard({
  variant,
  title,
  description,
}: {
  variant: "caracolnext" | "ditu";
  title: React.ReactNode;
  description: string;
}) {
  const isDitu = variant === "ditu";
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-[24px] rounded-[8px] border px-[20px] pt-[40px] pb-[30px]",
        isDitu ? "lg:max-w-[284px]" : "lg:max-w-[328px] lg:flex-[1.15]",
      )}
      style={
        isDitu
          ? {
              background: "linear-gradient(180deg, #8232F0 0%, #561BDB 100%)",
              borderColor: "#8232F0",
            }
          : {
              backgroundColor: "#003381",
              borderColor: "#00ACFF",
            }
      }
    >
      <div className="flex h-[32px] items-center justify-center text-white">{title}</div>
      <p
        className="w-full text-center text-[14px] font-medium text-white"
        style={{
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          lineHeight: "20px",
        }}
      >
        {description}
      </p>
    </div>
  );
}

/**
 * MetricCard — tarjeta métrica con CountUp animation.
 *  - bg #f1f1f1, border #003381 ó #561BDB, rounded-8 p-20 h-149
 *  - Icon 40px absolute top-left
 *  - Number 60/lh-48 ExtraBold text-right (color por accent)
 *  - Label 20/lh-24 SemiBold #464553 text-right
 */
function MetricCard({
  icon,
  numericValue,
  prefix,
  suffix,
  fallbackValue,
  label,
  accent,
}: {
  icon: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  fallbackValue: string;
  label: string;
  accent: "caracolnext" | "ditu";
}) {
  const borderColor = accent === "ditu" ? "#561BDB" : "#003381";
  const numberColor = accent === "ditu" ? "#12082D" : "#003381";

  return (
    <div
      className="relative h-[149px] rounded-[8px] border p-[20px]"
      style={{
        backgroundColor: "#F1F1F1",
        borderColor,
      }}
    >
      {/* Icon top-left 40px */}
      <div className="absolute top-[20px] left-[20px] h-[40px] w-[40px]">
        <Image
          src={icon}
          alt=""
          width={40}
          height={40}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Content right-aligned justified end */}
      <div className="flex h-full flex-col items-end justify-end gap-[4px]">
        <p
          className="text-right text-[40px] font-extrabold whitespace-nowrap sm:text-[48px] lg:text-[60px]"
          style={{
            color: numberColor,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            lineHeight: "48px",
          }}
        >
          {numericValue != null ? (
            <>
              {prefix ?? ""}
              <CountUp
                value={numericValue}
                format={(v) => {
                  // Format helper para mostrar números como +16M, +127M, etc.
                  if (suffix === "M") return Math.round(v).toString();
                  if (suffix === "Min") return Math.round(v).toString();
                  return Math.round(v).toLocaleString("es-CO");
                }}
              />
              {suffix ?? ""}
            </>
          ) : (
            fallbackValue
          )}
        </p>
        <p
          className="text-right text-[16px] font-semibold sm:text-[18px] lg:text-[20px]"
          style={{
            color: "#464553",
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            lineHeight: "24px",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

/**
 * Logo CARACOLMEDIOS | DIGITAL — Figma 892:6210.
 * Layout: logo w-241 h-32 + divider line flex-1 + "DIGITAL" 25/lh-25 SemiBold
 */
function CaracolMediosLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 sm:w-[395px] lg:gap-[24px]",
        className,
      )}
    >
      {/* Logo Caracol MEDIOS — Figma 892:6211: w-241 h-32 */}
      <div className="flex h-[32px] flex-shrink-0 items-center text-white">
        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none">
          <ellipse
            cx="16"
            cy="16"
            rx="14"
            ry="6"
            stroke="currentColor"
            strokeWidth="2.5"
            transform="rotate(-20 16 16)"
          />
          <circle cx="16" cy="16" r="3.5" fill="currentColor" />
        </svg>
        <span
          className="ml-2 text-[14px] font-extrabold sm:text-[18px]"
          style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          CARACOL<span className="font-light">MEDIOS</span>
        </span>
      </div>
      {/* Divider line — Figma 892:6212: bg #D9D9D9 flex-1 h-full 1px */}
      <div
        className="hidden h-[1px] flex-1 self-center sm:block"
        style={{ backgroundColor: "#D9D9D9" }}
        aria-hidden="true"
      />
      {/* "DIGITAL" — Figma 892:6213: Montserrat SemiBold 25/lh-25 */}
      <p
        className="text-[18px] font-semibold whitespace-nowrap text-white sm:text-[22px] lg:text-[25px]"
        style={{
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          lineHeight: "25px",
        }}
      >
        DIGITAL
      </p>
    </div>
  );
}

/**
 * Wordmark Caracol Next — SVG real extraído del Figma 430:520.
 * Combina 3 paths: orbital eye + texto "CARACOL" + texto "NEXT".
 * Usa `currentColor` para heredar el color del padre (text-white en navy,
 * text-foreground en scrolled).
 */
export function CaracolNextWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 205 32"
      className={cn("h-8 w-[205px]", className)}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Caracol Next"
    >
      {/* Orbital eye logo (Figma 9:1710) — viewBox 50.14x26.04. */}
      <g transform="translate(0.45, 2.95) scale(1.117)">
        <path d="M17.2685 16.8453C18.7565 19.5318 21.6415 21.3552 24.9586 21.3552C29.7962 21.3552 33.724 17.4683 33.724 12.6761C33.724 11.9267 33.6266 11.1999 33.4479 10.5056C37.6909 10.7846 41.8007 11.7287 40.7741 14.4411C39.1854 18.6395 24.7247 24.3174 12.535 25.1123C23.4446 28.2854 50.29 23.0066 50.1405 14.1783C50.0593 9.26293 40.4134 9.07799 33.1685 9.63605C31.9242 6.34613 28.7175 4.00036 24.9586 4.00036C20.1178 4.00036 16.1932 7.88402 16.1932 12.6794C16.1932 13.815 16.4141 14.8986 16.817 15.8914C12.3433 15.5183 7.71364 14.4639 8.89948 11.6347C10.6376 7.49468 25.2575 0.804528 37.47 0.441144C21.6123 -1.94356 0.150287 5.80429 0.000839749 12.5301C-0.106373 17.3774 10.0756 17.4196 17.2685 16.8453Z" />
      </g>
      {/* "CARACOL" wordmark (Figma 9:1711) — viewBox 80.56x23.38. */}
      <g transform="translate(62.5, 2.64) scale(1.038, 1.117)">
        <path d="M17.0143 4.95759L18.4406 16.4496H15.5588L17.0175 4.95759H17.0143ZM14.7596 0.165469L11.4457 23.1787H14.7303L15.1624 19.5676H18.8402L19.3047 23.1787H22.82L19.4704 0.165469H14.7596Z" />
        <path d="M27.8233 3.31587H29.5484C30.4451 3.31587 30.8772 3.74415 30.8772 4.62665V9.48691C30.8772 10.4408 30.4094 10.8983 29.4152 10.8983H27.8233V3.31587ZM27.8233 13.9546H29.4152C30.4451 13.9546 30.9064 14.4153 30.9064 15.4308V23.1819H34.4574V15.3659C34.4574 13.6269 33.8564 12.7411 32.4009 12.3453C33.694 11.8229 34.425 10.8366 34.425 8.79907V4.46767C34.425 1.61251 32.9987 0.201159 30.1137 0.201159H24.2755V23.1852H27.8265V13.9578L27.8233 13.9546Z" />
        <path d="M41.4198 4.95759L42.846 16.4496H39.961L41.4198 4.95759ZM39.1651 0.165469L35.8512 23.1787H39.1358L39.5679 19.5676H43.2489L43.7135 23.1787H47.2287L43.8791 0.165469H39.1651Z" />
        <path d="M55.2534 18.9446C55.2534 19.8628 54.8213 20.2911 53.9279 20.2911H53.2651C52.3327 20.2911 51.9038 19.8628 51.9038 18.9446V4.43198C51.9038 3.51054 52.3327 3.08552 53.2651 3.08552H53.8597C54.7563 3.08552 55.1852 3.51054 55.1852 4.43198V8.9321H58.668V4.23731C58.668 1.38216 57.2775 0 54.3892 0H52.6673C49.7823 0 48.3561 1.41136 48.3561 4.26651V19.1068C48.3561 21.962 49.7823 23.3733 52.6673 23.3733H54.425C57.3067 23.3733 58.7362 21.962 58.7362 19.1068V13.7567H55.2534V18.9446Z" />
        <path d="M67.6251 18.9479C67.6251 19.866 67.193 20.2911 66.2996 20.2911H65.5686C64.6394 20.2911 64.2105 19.866 64.2105 18.9479V4.43523C64.2105 3.51703 64.6394 3.08876 65.5686 3.08876H66.2996C67.193 3.08876 67.6251 3.51703 67.6251 4.43523V18.9479ZM66.8616 0.00324457H64.9708C62.0858 0.00324457 60.6595 1.41136 60.6595 4.26976V19.1101C60.6595 21.9652 62.0858 23.3766 64.9708 23.3766H66.8616C69.7466 23.3766 71.1728 21.9652 71.1728 19.1101V4.26976C71.1728 1.41136 69.7466 0.00324457 66.8616 0.00324457Z" />
        <path d="M73.0962 0.197914V23.1787H80.5588V19.9926H76.6439V0.197914H73.0962Z" />
        <path d="M10.3151 8.9321V4.23731C10.3151 1.38216 8.92463 0.00324457 6.03639 0.00324457H4.31124C1.4295 0.00324457 0 1.41136 0 4.26976V19.1101C0 21.9652 1.42625 23.3766 4.31124 23.3766H6.07213C8.95712 23.3766 10.3834 21.9652 10.3834 19.1101V13.7599H6.90059V18.9479C6.90059 19.866 6.47174 20.2943 5.57505 20.2943H4.91228C3.97986 20.2943 3.55101 19.866 3.55101 18.9479V4.43198C3.55101 3.51054 3.97986 3.08552 4.91228 3.08552H5.50682C6.40351 3.08552 6.83236 3.51054 6.83236 4.43198V8.9321H10.3151Z" />
      </g>
      {/* "NEXT" wordmark (Figma 9:1712) — viewBox 42.19x22.98. */}
      <g transform="translate(156.5, 2.86) scale(1.119, 1.137)">
        <path d="M9.32424 0V22.9808H6.8681L2.72904 8.34809L2.52112 6.93673V22.9808H0V0H2.42366L6.56271 14.6489L6.77063 16.1868V0H9.32424Z" />
        <path d="M19.7726 1.96941H14.7986V10.4797H19.4347V12.4524H14.7986V21.0114H19.7726V22.984H12.2775V0H19.7726V1.97265V1.96941Z" />
        <path d="M30.666 0L27.0533 11.3947L30.6335 22.9808H28.0344L25.7407 13.9254L23.3496 22.9808H20.783L24.3632 11.5861L20.7505 0H23.3821L25.7732 8.92561L28.1806 0H30.6693H30.666Z" />
        <path d="M42.1897 0V2.0343H38.1157V22.9808H35.5491V2.0343H31.4717V0H42.193H42.1897Z" />
      </g>
    </svg>
  );
}

/**
 * Wordmark Ditu inline — SVG real del Figma 5:870 (logo-light variant).
 * Composite: "ditu" wordmark (top) + "por Caracol" byline (bottom).
 *
 * Proporciones exactas del Figma (parent 180x87):
 *  - Wordmark: top 0.63%, left 0.54%, right 1.25%, bottom 28.34%
 *  - Byline: top 80.55%, left 34.46%, right 0.54%, bottom 0.62%
 *
 * Renderiza a 66×32 en el header (escala proporcional al 180×87 original).
 */
export function DituWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn("relative inline-block h-8 w-[66px] overflow-hidden", className)}
      aria-label="Ditu por Caracol"
    >
      {/* Wordmark "ditu" — top (Figma 5:868: inset[0.63% 1.25% 28.34% 0.54%]) */}
      <span
        className="absolute block"
        style={{
          top: "0.63%",
          left: "0.54%",
          right: "1.25%",
          bottom: "28.34%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ditu/logo-ditu-wordmark.svg"
          alt=""
          className="block h-full w-full"
          style={{ maxWidth: "none" }}
        />
      </span>
      {/* Byline "por Caracol" — bottom-right (Figma 5:869: inset[80.55% 0.54% 0.62% 34.46%]) */}
      <span
        className="absolute block"
        style={{
          top: "80.55%",
          left: "34.46%",
          right: "0.54%",
          bottom: "0.62%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ditu/logo-ditu-byline.svg"
          alt=""
          className="block h-full w-full"
          style={{ maxWidth: "none" }}
        />
      </span>
    </span>
  );
}
