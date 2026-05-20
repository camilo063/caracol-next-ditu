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
 * SiteHeader — sticky con behaviors avanzados:
 *
 * - Hide on scroll down, show on scroll up (300ms ease, Framer Motion).
 * - Siempre visible en top de la página (`scrollY < 80`).
 * - Active state automático en anclas (IntersectionObserver con rootMargin -40/-55%).
 * - Botón FullscreenToggle junto al CTA — modo presentación.
 * - CTA configurable (en Caracol Next apunta a /ditu por spec).
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

  // --- Active anchor tracking ---
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
  // Figma 430:519: Caracol Next header inicia con bg navy #003381 + texto blanco.
  // Al scroll se vuelve blanco con texto dark (transición suave).
  const isCaracolNextNavy = !isDitu && !scrolled;

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        // `fixed` + top-0 + left-0 + right-0 da el comportamiento "sticky siempre"
        // sin sufrir el bug de `position: sticky` cuando coexiste con `transform`.
        // El offset (h-16) se compensa con `pt-16` en el contenido.
        sticky ? "fixed top-0 right-0 left-0 z-40" : "relative w-full",
        // Color de texto: blanco en Ditu (siempre) o Caracol Next sin scroll;
        // foreground (dark) cuando Caracol Next está scrolled.
        isDitu || isCaracolNextNavy ? "text-white" : "text-foreground",
        scrolled
          ? isDitu
            ? "border-b border-white/10 bg-[#1F1647]/95 backdrop-blur"
            : "bg-background/95 border-border border-b shadow-sm backdrop-blur"
          : isDitu
            ? "bg-[#1F1647]"
            : "bg-[#003381]", // Caracol Next inicial = navy (Figma 430:519)
        "transition-colors duration-300 ease-in-out",
      )}
    >
      <Container size="xl" className="flex h-16 items-center justify-between gap-4">
        <Link
          href={`/${landing === "caracol-next" ? "caracol-next" : "ditu"}`}
          className="flex shrink-0 items-center gap-2"
          aria-label={landing === "caracol-next" ? "Caracol Next" : "Ditu"}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={landing === "caracol-next" ? "Caracol Next" : "Ditu"}
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
            // Figma 430:519: nav text blanco cuando bg navy (Ditu o Caracol Next inicial).
            // text-foreground/75 cuando Caracol Next scrolled (bg blanco).
            isDitu || isCaracolNextNavy ? "text-white/90" : "text-foreground/75",
          )}
        >
          {navAnchors.map((a) => {
            const isActive = activeId === a.anchorId;
            // Figma: active link Caracol Next = #00ACFF (azul claro), Ditu = #77EDED.
            const activeColor = isDitu ? "#77EDED" : "#00ACFF";
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
            <FullscreenToggle tone={isDitu ? "dark" : "light"} />
          ) : null}
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden",
              isDitu ? "text-white" : "text-foreground",
            )}
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open ? (
        <div
          className={cn(
            "md:hidden",
            isDitu ? "bg-[#1F1647] text-white" : "bg-background text-foreground",
            "border-t",
            isDitu ? "border-white/10" : "border-border",
          )}
        >
          <Container size="xl" className="flex flex-col gap-2 py-4">
            {navAnchors.map((a) => {
              const isActive = activeId === a.anchorId;
              return (
                <Link
                  key={a.anchorId}
                  href={`#${a.anchorId}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "rounded-md px-2 py-2 text-sm font-semibold tracking-wide uppercase transition-colors",
                    isActive
                      ? isDitu
                        ? "bg-white/10 text-white"
                        : "bg-primary/10 text-primary"
                      : "hover:bg-white/10",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {a.label}
                </Link>
              );
            })}
            {ctaButton?.enabled !== false && ctaButton?.label ? (
              <Button
                size="sm"
                variant={ctaButton.variant ?? "default"}
                asChild
                className="mt-2 w-full"
              >
                <Link href={ctaButton.href}>{ctaButton.label}</Link>
              </Button>
            ) : null}
          </Container>
        </div>
      ) : null}
    </motion.header>
  );
}
