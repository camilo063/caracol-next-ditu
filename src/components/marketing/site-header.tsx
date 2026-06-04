"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { FullscreenToggle } from "./fullscreen-toggle";

export interface SiteHeaderProps {
  landing: "caracol-next" | "ditu";
  logoUrl?: string | null;
  fallbackWordmark?: React.ReactNode;
  navAnchors: Array<{ label: string; anchorId: string }>;
  ctaButton?: {
    enabled: boolean;
    label: string;
    href: string;
    variant?: "default" | "outline" | "brand-caracolnext" | "brand-ditu" | "ghost" | null;
  } | null;
  sticky?: boolean;
  /** Si `false`, el botón fullscreen no se muestra. */
  showFullscreenToggle?: boolean;
}

/**
 * SiteHeader — sticky con behaviors avanzados (spec Camilo, mayo 2026):
 *
 * - Sticky siempre (`fixed top-0`).
 * - Hide on scroll down / show on scroll up — transición 300ms ease.
 * - Siempre visible en top de página (`scrollY < 80`).
 * - Active state automático en anclas via IntersectionObserver.
 *   El item del menú correspondiente a la sección en viewport cambia a estado activo.
 * - Mobile: hamburguesa + fullscreen toggle oculto (no aplica en mobile).
 *
 * Ditu — Figma 722:2582:
 *  - Bg `rgba(18, 8, 45, 0.55)` + backdrop-blur-[7px].
 *  - Padding `px-[40px] py-[4px]`.
 *  - Logo Ditu wordmark 32px alto.
 *  - Nav items: Spline Sans Medium 14px, blanco; activo = `#77EDED` cyan + underline.
 *  - CTA "Ir a Caracol Next": `bg-[#00ACFF]` rounded-[4px] px-8 py-2 Montserrat SemiBold 14px.
 *  - Fullscreen icon 24x24 (expand → compress).
 */
export function SiteHeader({
  landing,
  logoUrl,
  fallbackWordmark,
  navAnchors,
  ctaButton,
  sticky = true,
  showFullscreenToggle = true,
}: SiteHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  // Default active = primer item del nav (spec Camilo: en Caracol Next debe
  // ser "marcas" por defecto). Se actualiza vía IntersectionObserver al scroll.
  const [activeId, setActiveId] = React.useState<string | null>(
    navAnchors[0]?.anchorId ?? null,
  );
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);
  const mobileToggleRef = React.useRef<HTMLButtonElement>(null);

  // --- Hide on scroll down, show on scroll up ---
  // Transición más suave: thresholds más altos para evitar flicker en scroll
  // up corto. Bug: "El estilo del header cambia drásticamente al hacer scroll
  // hacia arriba". 8→12px de delta + 80→120 threshold de top.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (latest <= 120) {
      setHidden(false);
      return;
    }
    if (latest > previous + 12)
      setHidden(true); // esconde: 12px down
    else if (latest < previous - 4) setHidden(false); // muestra: 4px up — reacciona inmediato
  });

  // --- Click outside / ESC: cierra menú mobile (spec usuario) ---
  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (mobileMenuRef.current?.contains(t)) return;
      if (mobileToggleRef.current?.contains(t)) return;
      setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  // --- Active anchor tracking (IntersectionObserver) ---
  React.useEffect(() => {
    if (navAnchors.length === 0) return;
    const observers: IntersectionObserver[] = [];
    const visibility = new Map<string, boolean>();
    navAnchors.forEach((anchor) => {
      const el = document.getElementById(anchor.anchorId);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibility.set(anchor.anchorId, entry.isIntersecting);
          });
          // El primer ancla visible (en orden del nav) gana el active.
          const firstVisible = navAnchors.find((a) => visibility.get(a.anchorId));
          if (firstVisible) setActiveId(firstVisible.anchorId);
        },
        {
          rootMargin: "-40% 0px -55% 0px",
          threshold: 0,
        },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [navAnchors]);

  const isDitu = landing === "ditu";
  // Figma 430:519: Caracol Next header inicia con bg navy + texto blanco; al scroll bg blanco + texto dark.
  const isCaracolNextNavy = !isDitu; // siempre navy en Caracol Next
  // Ditu: bg semi-transparente con blur (Figma 722:2582)
  const dituBg = "rgba(18, 8, 45, 0.55)";
  // Ditu active accent
  const activeColor = isDitu ? "#77EDED" : "#00ACFF";

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        sticky ? "fixed top-0 right-0 left-0 z-40" : "relative w-full",
        isDitu || isCaracolNextNavy ? "text-white" : "text-foreground",
        // Caracol Next: bg color directo (sin blur). Ditu: bg con blur (siempre).
        isDitu ? "backdrop-blur-[7px]" : "bg-[#003381]",
        "transition-colors duration-300 ease-in-out",
      )}
      style={isDitu ? { backgroundColor: dituBg } : undefined}
    >
      {/* Ditu usa padding exacto del Figma; Caracol Next usa Container. */}
      {isDitu ? (
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[64px] lg:px-[40px] lg:py-[4px]">
          {/* Logo */}
          <Link
            href="/ditu"
            className="flex shrink-0 items-center"
            aria-label="Ditu — por Caracol"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Ditu"
                width={66}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
            ) : (
              fallbackWordmark
            )}
          </Link>

          {/* Nav */}
          <nav className="hidden flex-1 items-center justify-center gap-2 md:flex lg:gap-4">
            {navAnchors.map((a) => {
              const isActive = activeId === a.anchorId;
              return (
                <Link
                  key={a.anchorId}
                  href={`#${a.anchorId}`}
                  aria-current={isActive ? "true" : undefined}
                  className="relative inline-flex h-full items-center justify-center overflow-hidden rounded-[8px] px-2 py-3 text-center text-[13px] leading-[14px] font-medium whitespace-nowrap transition-colors lg:text-[14px]"
                  style={{
                    color: isActive ? activeColor : "#FFFFFF",
                    fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                  }}
                >
                  {a.label}
                  {/* Underline activa (Figma: línea cyan debajo) */}
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 bottom-0 left-0 mx-auto h-[1.5px] origin-center"
                    initial={false}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{ backgroundColor: activeColor }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA + Fullscreen + Mobile menu */}
          <div className="flex shrink-0 items-center gap-2 lg:gap-[10px]">
            {ctaButton?.enabled !== false && ctaButton?.label ? (
              <Link
                href={ctaButton.href}
                className="font-display hidden h-8 items-center justify-center rounded-[4px] px-6 py-2 text-[14px] leading-[20px] font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:inline-flex lg:px-[32px]"
                style={{
                  backgroundColor: "#00ACFF",
                  border: "1px solid #00ACFF",
                  fontFamily: "var(--font-montserrat), system-ui",
                }}
              >
                {ctaButton.label}
              </Link>
            ) : null}
            {showFullscreenToggle ? (
              <span className="hidden md:inline-flex">
                <FullscreenToggle tone="dark" />
              </span>
            ) : null}
            <button
              ref={mobileToggleRef}
              type="button"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 md:hidden"
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      ) : (
        // --- Caracol Next header ---
        <div className="mx-auto flex h-12 w-full max-w-[1920px] items-center justify-between gap-4 px-[12px] sm:px-10 lg:px-[40px] xl:h-16">
          <Link
            href="/caracol-next"
            className="lg:max-w-[250px]: flex w-full max-w-[160px] shrink-0 items-center gap-2"
            aria-label="Caracol Next"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Caracol Next"
                width={160}
                height={28}
                className="h-5 w-auto object-contain xl:h-7"
                priority
              />
            ) : (
              fallbackWordmark
            )}
          </Link>

          {/* Nav — px-[32px] py-[8px] por enlace, hover bg #00ACFF */}
          <nav className="hidden items-center gap-1 xl:flex">
            {navAnchors.map((a) => {
              const isActive = activeId === a.anchorId;
              return (
                <Link
                  key={a.anchorId}
                  href={`#${a.anchorId}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative rounded px-[32px] py-[8px] text-sm font-semibold tracking-wide uppercase [transition:background-color_0.3s_ease-in-out,color_0.3s_ease-in-out]",
                    isActive
                      ? "text-[#00ACFF]"
                      : isCaracolNextNavy
                        ? "text-white/90 hover:bg-[#00ACFF]/30"
                        : "text-foreground/75 hover:bg-[#00ACFF]/30",
                  )}
                >
                  {a.label}
                  <span
                    className={cn(
                      "pointer-events-none absolute right-0 -bottom-0.5 left-0 mx-auto h-0.5 origin-center rounded-full transition-transform duration-300",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                    style={{ backgroundColor: activeColor }}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* CTA — gradiente Ditu (mismo estilo que home) */}
            {ctaButton?.enabled !== false && ctaButton?.label ? (
              <Link
                href={ctaButton.href}
                className="group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[8px] px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap text-[#FDFDFD] [transition:box-shadow_0.35s_ease-in-out,transform_0.12s_ease] hover:shadow-lg hover:shadow-[#8232F0]/40 active:scale-[0.98] xl:rounded-[10px] xl:px-5 xl:py-[8px] xl:text-[14px]"
                style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  lineHeight: 1.5,
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to left, #8232F0 0%, #561BDB 100%)",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 transition-opacity duration-[350ms] ease-in-out group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(to left, #561BDB 0%, #8232F0 100%)",
                  }}
                />
                <span className="relative z-10">{ctaButton.label}</span>
              </Link>
            ) : null}
            {showFullscreenToggle ? (
              <span className="hidden xl:inline-flex">
                <FullscreenToggle tone={isCaracolNextNavy ? "dark" : "light"} />
              </span>
            ) : null}
            <button
              ref={mobileToggleRef}
              type="button"
              className={cn(
                "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors xl:hidden",
                isCaracolNextNavy
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-foreground/5",
              )}
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu (común para ambas landings).
          ref para click-outside detection: cierra menú al click fuera. */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "overflow-hidden transition-[max-height] duration-300 ease-in-out xl:hidden",
          open ? "max-h-150" : "max-h-0",
          open ? "border-t border-white/10" : "",
          "text-white",
        )}
        style={{ backgroundColor: isDitu ? "rgba(18, 8, 45, 0.95)" : "#003381" }}
      >
        <div className="mx-auto flex max-w-360 flex-col gap-1 px-5 py-3 sm:px-10">
          {navAnchors.map((a) => {
            const isActive = activeId === a.anchorId;
            return (
              <Link
                key={a.anchorId}
                href={`#${a.anchorId}`}
                aria-current={isActive ? "true" : undefined}
                className="rounded px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                style={{
                  color: isActive ? activeColor : "#FFFFFF",
                  fontFamily: isDitu
                    ? "var(--font-spline-sans), system-ui, sans-serif"
                    : undefined,
                }}
                onClick={() => setOpen(false)}
              >
                {a.label}
              </Link>
            );
          })}
          {/* CTA solo en Ditu — Caracol Next lo mueve al header junto al hamburger */}
          {isDitu && ctaButton?.enabled !== false && ctaButton?.label ? (
            isDitu ? (
              <Link
                href={ctaButton.href}
                className="font-display mt-2 inline-flex h-10 w-full items-center justify-center rounded-[4px] px-6 py-2 text-[14px] font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#00ACFF",
                  fontFamily: "var(--font-montserrat), system-ui",
                }}
                onClick={() => setOpen(false)}
              >
                {ctaButton.label}
              </Link>
            ) : (
              <Button
                size="sm"
                variant={ctaButton.variant ?? "default"}
                asChild
                className="mt-2 w-full"
              >
                <Link href={ctaButton.href} onClick={() => setOpen(false)}>
                  {ctaButton.label}
                </Link>
              </Button>
            )
          ) : null}
        </div>
      </div>
    </motion.header>
  );
}
