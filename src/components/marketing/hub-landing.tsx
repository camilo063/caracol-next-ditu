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

/** Wordmark Caracol Next inline (para usar dentro de la card). */
export function CaracolNextWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-white", className)}>
      <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
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
      <span className="font-display text-xl font-black tracking-tight">
        CARACOL<span className="font-light">NEXT</span>
      </span>
    </div>
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
