"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import { Button, Container } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps {
  landing: "caracol-next" | "ditu";
  logoUrl?: string | null;
  /** Wordmark inline cuando no hay logo subido. */
  fallbackWordmark?: React.ReactNode;
  navAnchors: Array<{ label: string; anchorId: string }>;
  ctaButton?: {
    enabled: boolean;
    label: string;
    href: string;
    variant?: "default" | "outline" | "brand-caracolnext" | "brand-ditu" | "ghost" | null;
  } | null;
  sticky?: boolean;
}

/**
 * SiteHeader — header sticky con logo + nav anchors + CTA.
 * Estilizado distinto por landing:
 *  - caracol-next: fondo blanco con sombra al scrollear
 *  - ditu: fondo violeta oscuro con texto blanco
 */
export function SiteHeader({
  landing,
  logoUrl,
  fallbackWordmark,
  navAnchors,
  ctaButton,
  sticky = true,
}: SiteHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDitu = landing === "ditu";

  return (
    <header
      className={cn(
        "z-40 w-full transition-colors",
        sticky && "sticky top-0",
        isDitu ? "text-white" : "text-foreground",
        scrolled
          ? isDitu
            ? "border-b border-white/10 bg-[#1F1647]/95 backdrop-blur"
            : "bg-background/95 border-border border-b shadow-sm backdrop-blur"
          : isDitu
            ? "bg-[#1F1647]"
            : "bg-background",
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
            isDitu ? "text-white/90" : "text-foreground/80",
          )}
        >
          {navAnchors.map((a) => (
            <Link
              key={a.anchorId}
              href={`#${a.anchorId}`}
              className="text-sm font-semibold tracking-wide uppercase transition-colors hover:opacity-80"
            >
              {a.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
            {navAnchors.map((a) => (
              <Link
                key={a.anchorId}
                href={`#${a.anchorId}`}
                className="rounded-md px-2 py-2 text-sm font-semibold tracking-wide uppercase hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {a.label}
              </Link>
            ))}
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
    </header>
  );
}
