"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button, Container } from "@/components/ui";
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
  const [activeId, setActiveId] = React.useState<string | null>(null);

  // --- Hide on scroll down, show on scroll up ---
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 8);
    if (latest <= 80) {
      // En el top, siempre visible.
      setHidden(false);
      return;
    }
    if (latest > previous + 4)
      setHidden(true); // scroll down
    else if (latest < previous - 4) setHidden(false); // scroll up
  });

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
  const isCaracolNextNavy = !isDitu && !scrolled;
  // Ditu: bg semi-transparente con blur (Figma 722:2582)
  const dituBg = "rgba(18, 8, 45, 0.55)";
  // Ditu active accent
  const activeColor = isDitu ? "#77EDED" : "#00ACFF";

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        sticky ? "fixed top-0 right-0 left-0 z-40" : "relative w-full",
        isDitu || isCaracolNextNavy ? "text-white" : "text-foreground",
        // Caracol Next: bg color directo (sin blur). Ditu: bg con blur (siempre).
        isDitu
          ? "backdrop-blur-[7px]"
          : scrolled
            ? "bg-background/95 border-border border-b shadow-sm backdrop-blur"
            : "bg-[#003381]",
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
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white md:hidden"
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      ) : (
        // --- Caracol Next header (sin cambios) ---
        <Container size="xl" className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/caracol-next"
            className="flex shrink-0 items-center gap-2"
            aria-label="Caracol Next"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Caracol Next"
                width={160}
                height={28}
                className="h-7 w-auto object-contain"
                priority
              />
            ) : (
              fallbackWordmark
            )}
          </Link>

          <nav
            className={cn(
              "hidden items-center gap-6 md:flex",
              isCaracolNextNavy ? "text-white/90" : "text-foreground/75",
            )}
          >
            {navAnchors.map((a) => {
              const isActive = activeId === a.anchorId;
              return (
                <Link
                  key={a.anchorId}
                  href={`#${a.anchorId}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative text-sm font-semibold tracking-wide uppercase transition-colors",
                    !isActive && "hover:opacity-80",
                  )}
                  style={isActive ? { color: activeColor } : undefined}
                >
                  {a.label}
                  <span
                    className={cn(
                      "pointer-events-none absolute right-0 -bottom-1 left-0 mx-auto h-0.5 origin-center rounded-full transition-transform duration-300",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                    style={{ backgroundColor: activeColor }}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            {ctaButton?.enabled !== false && ctaButton?.label ? (
              <Button
                size="sm"
                variant={ctaButton.variant ?? "default"}
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href={ctaButton.href}>{ctaButton.label}</Link>
              </Button>
            ) : null}
            {showFullscreenToggle ? (
              <span className="hidden md:inline-flex">
                <FullscreenToggle tone="light" />
              </span>
            ) : null}
            <button
              type="button"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden",
                "text-foreground",
              )}
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>
      )}

      {/* Mobile menu (común para ambas landings) */}
      {open ? (
        <div
          className={cn(
            "md:hidden",
            isDitu ? "text-white" : "bg-background text-foreground",
            isDitu ? "border-t border-white/10" : "border-border border-t",
          )}
          style={isDitu ? { backgroundColor: "rgba(18, 8, 45, 0.95)" } : undefined}
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-4 sm:px-6 lg:px-[40px]">
            {navAnchors.map((a) => {
              const isActive = activeId === a.anchorId;
              return (
                <Link
                  key={a.anchorId}
                  href={`#${a.anchorId}`}
                  aria-current={isActive ? "true" : undefined}
                  className="rounded-md px-2 py-2 text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? activeColor : isDitu ? "#FFFFFF" : "currentColor",
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
            {ctaButton?.enabled !== false && ctaButton?.label ? (
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
      ) : null}
    </motion.header>
  );
}
