import Link from "next/link";
import { ArrowRight, Tv, Users, Zap, Clock } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * HubLanding — la landing principal en `/`.
 * Diseño tomado del Figma "Caracol Next.png":
 * - Header simple "CARACOLMEDIOS | DIGITAL"
 * - Split en pantalla completa: heading + CTA a la izquierda · 2 cards de marca a la derecha
 * - 4 stat boxes en la parte inferior derecha
 * - 2 botones CTA "Conoce X →"
 * - Footer copyright
 * - Background: gradiente azul oscuro (Caracol Digital deep)
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
    value: string;
    label: string;
    accent?: "caracolnext" | "ditu";
  }>;
  copyright: string;
}

const ICONS = {
  users: Users,
  tv: Tv,
  zap: Zap,
  clock: Clock,
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
      className="relative flex min-h-screen flex-col text-white"
      style={{
        background: "linear-gradient(135deg, #0D3AA0 0%, #003CCA 40%, #003380 100%)",
      }}
    >
      {/* Header */}
      <header className="px-6 pt-8 sm:px-10 lg:px-16">
        <div className="flex items-center gap-3">
          <CaracolMediosLogo className="h-7 w-auto" />
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-1 items-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — texto + CTA */}
          <div className="flex flex-col justify-center">
            <p
              className="text-xs font-bold tracking-[0.18em] uppercase"
              style={{ color: "#2862FF" }}
            >
              {eyebrow}
            </p>
            <h1 className="font-display mt-6 text-5xl leading-[1.05] font-black tracking-tight sm:text-6xl xl:text-7xl">
              {heading}
            </h1>
            <div className="mt-10">
              <Link
                href={contactHref}
                className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                style={{ backgroundColor: "#015BC4" }}
              >
                {contactLabel}
              </Link>
            </div>
          </div>

          {/* Right — brand cards + stats */}
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <BrandCard
                title={brands.caracolNext.title}
                description={brands.caracolNext.description}
                background="linear-gradient(160deg, #0D3AA0 0%, #003380 100%)"
                border="rgba(40, 98, 255, 0.4)"
              />
              <BrandCard
                title={brands.ditu.title}
                description={brands.ditu.description}
                background="linear-gradient(160deg, #8232F0 0%, #561BDB 100%)"
                border="rgba(130, 50, 240, 0.5)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => {
                const Icon = ICONS[s.icon];
                const dotColor = s.accent === "ditu" ? "#8232F0" : "#015BC4";
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl bg-white p-4 text-neutral-900 shadow-md sm:p-5"
                  >
                    <span
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: dotColor, color: "white" }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-xl leading-tight font-extrabold sm:text-2xl">
                        {s.value}
                      </p>
                      <p className="text-muted-foreground text-xs font-semibold">
                        {s.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link
                href={brands.caracolNext.href}
                className="inline-flex items-center justify-between rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                style={{
                  background: "linear-gradient(135deg, #0D3AA0 0%, #003380 100%)",
                }}
              >
                <span>{brands.caracolNext.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={brands.ditu.href}
                className="inline-flex items-center justify-between rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:outline-none"
                style={{
                  background: "linear-gradient(135deg, #8232F0 0%, #561BDB 100%)",
                }}
              >
                <span>{brands.ditu.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-8 sm:px-10 lg:px-16">
        <div className="rounded-full bg-black/30 px-6 py-4 text-center text-xs text-white/80">
          {copyright}
        </div>
      </footer>
    </div>
  );
}

function BrandCard({
  title,
  description,
  background,
  border,
}: {
  title: React.ReactNode;
  description: string;
  background: string;
  border: string;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border p-6"
      style={{ background, borderColor: border }}
    >
      <div className="flex h-14 items-center text-white">{title}</div>
      <p className="text-sm leading-relaxed text-white/90">{description}</p>
    </div>
  );
}

/** Logo CARACOLMEDIOS | DIGITAL inline (vectorial). */
function CaracolMediosLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-white", className)}>
      {/* Símbolo planeta */}
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
      <span className="font-display text-base font-extrabold tracking-wide">
        CARACOL<span className="font-light">MEDIOS</span>
      </span>
      <span className="text-white/30">|</span>
      <span className="text-base font-semibold tracking-wide text-white/90">DIGITAL</span>
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

/** Wordmark Ditu inline. */
export function DituWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-3xl font-black tracking-tight text-white",
        className,
      )}
      style={{ fontFamily: '"Montserrat", system-ui, sans-serif' }}
    >
      ditu
    </span>
  );
}
