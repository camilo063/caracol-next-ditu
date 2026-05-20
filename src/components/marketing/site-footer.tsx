import Image from "next/image";
import Link from "next/link";

import { Container, WaveDivider } from "@/components/ui";
import { NetworkIcon } from "./network-icon";
import { cn } from "@/lib/utils";

export interface SiteFooterProps {
  landing: "caracol-next" | "ditu";
  logoUrl?: string | null;
  fallbackWordmark?: React.ReactNode;
  tagline?: string | null;
  columns?: Array<{
    heading: string;
    links: Array<{ label: string; href: string; openInNewTab?: boolean | null }>;
  }>;
  socialLinks?: Array<{ network: string; url: string }>;
  bottomLine?: string;
  useWave?: boolean;
  tone?: "dark" | "caracolnext-deep" | "ditu-deep" | "default" | "minimal";
}

const TONE_BG: Record<NonNullable<SiteFooterProps["tone"]>, string> = {
  dark: "linear-gradient(180deg, #232323 0%, #121212 100%)",
  "caracolnext-deep": "linear-gradient(180deg, #003CCA 0%, #003380 100%)",
  "ditu-deep": "linear-gradient(180deg, #1F1647 0%, #0E0723 100%)",
  default: "var(--color-background)",
  minimal: "var(--color-background)",
};

const TONE_WAVE: Record<NonNullable<SiteFooterProps["tone"]>, string> = {
  dark: "#232323",
  "caracolnext-deep": "#003CCA",
  "ditu-deep": "#1F1647",
  default: "var(--color-background)",
  minimal: "var(--color-background)",
};

/**
 * SiteFooter — pie de página.
 * - Tones dark / caracolnext-deep / ditu-deep / default: footer "rico" con
 *   columnas + tagline + social + bottomLine.
 * - Tone minimal: solo un pill gris centrado con el bottomLine (matching
 *   Figma caracol-next.png — cierre simple debajo del CTA final).
 * - useWave: agrega un SVG decorativo de onda en el tope (Ditu).
 */
export function SiteFooter({
  landing,
  logoUrl,
  fallbackWordmark,
  tagline,
  columns,
  socialLinks,
  bottomLine,
  useWave,
  tone = landing === "ditu" ? "ditu-deep" : "caracolnext-deep",
}: SiteFooterProps) {
  // Tone minimal — Figma 347:1736: pill gris claro (rgba(0,0,0,0.1)) centrado
  // con copyright. py-40 wrapper, px-120 interno, rounded-90 p-10 pill.
  if (tone === "minimal") {
    return (
      <footer className="bg-background flex flex-col items-center justify-center py-8 sm:py-10">
        <div className="flex w-full max-w-[1377px] flex-col items-start overflow-hidden px-4 sm:px-8 lg:px-[120px]">
          <div
            className="flex w-full items-center justify-center rounded-[90px] p-[10px]"
            style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
          >
            <p
              className="font-display text-[16px] leading-[24px] font-semibold whitespace-nowrap"
              style={{ color: "#464553" }}
            >
              {bottomLine ?? "©2026 Caracol Comercial Digital"}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Tones rich — columnas + tagline + social + bottomLine.
  return (
    <footer className="text-white">
      {useWave ? (
        <WaveDivider position="top" fill={TONE_WAVE[tone]} className="-mb-px" />
      ) : null}
      <div style={{ background: TONE_BG[tone] }}>
        <Container size="xl" className="py-12">
          <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
            <div>
              <Link
                href={landing === "ditu" ? "/ditu" : "/caracol-next"}
                className="inline-flex items-center"
                aria-label={landing}
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={landing}
                    width={180}
                    height={32}
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  fallbackWordmark
                )}
              </Link>
              {tagline ? (
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
                  {tagline}
                </p>
              ) : null}
              {socialLinks && socialLinks.length > 0 ? (
                <ul className="mt-6 flex flex-wrap gap-3">
                  {socialLinks.map((s) => (
                    <li key={s.network + s.url}>
                      <Link
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.network}
                        className={cn(
                          "inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20",
                        )}
                      >
                        <NetworkIcon network={s.network} className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {columns && columns.length > 0 ? (
              <div
                className="grid gap-8"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(columns.length, 4)}, minmax(0, 1fr))`,
                }}
              >
                {columns.map((c) => (
                  <div key={c.heading}>
                    <p className="text-xs font-bold tracking-wide text-white/60 uppercase">
                      {c.heading}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {c.links.map((l) => (
                        <li key={l.label + l.href}>
                          <Link
                            href={l.href}
                            target={l.openInNewTab ? "_blank" : undefined}
                            rel={l.openInNewTab ? "noopener noreferrer" : undefined}
                            className="text-sm text-white/85 hover:text-white"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {bottomLine ? (
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-center text-xs text-white/60">{bottomLine}</p>
            </div>
          ) : null}
        </Container>
      </div>
    </footer>
  );
}
