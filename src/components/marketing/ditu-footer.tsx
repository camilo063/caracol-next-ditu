import Image from "next/image";
import Link from "next/link";

import { DituWordmark } from "./hub-landing";

/**
 * DituFooter — Figma 541:7935.
 *
 * Specs Figma exactas:
 *  - Container: bg #12082D, py-[40px] px-[117px], flex items-start
 *    justify-between
 *  - Logo Ditu: h-[40px] w-[82px] (variante pequeña del header logo)
 *  - Right block (541:7410): gap-[16px] items-center
 *    · "Encuéntranos" Ditu Display Medium 24/lh-1.5 white center
 *    · 5 social icons size-[40px] (FB, X, IG, TikTok, YouTube)
 */

const NAVY_DARK = "#12082D";

interface SocialLink {
  network: "facebook" | "instagram" | "x" | "tiktok" | "youtube" | "whatsapp";
  url: string;
  label: string;
}

const SOCIAL_ICONS: Record<SocialLink["network"], string> = {
  facebook: "/ditu/social-facebook.svg",
  x: "/ditu/social-x.svg",
  instagram: "/ditu/social-instagram.svg",
  tiktok: "/ditu/social-tiktok.svg",
  youtube: "/ditu/social-youtube.svg",
  whatsapp: "/ditu/social-whatsapp.svg",
};

const DEFAULT_SOCIALS: SocialLink[] = [
  { network: "facebook", url: "https://facebook.com/ditu", label: "Facebook" },
  { network: "x", url: "https://x.com/ditu", label: "X" },
  { network: "instagram", url: "https://instagram.com/ditu", label: "Instagram" },
  { network: "tiktok", url: "https://tiktok.com/@ditu", label: "TikTok" },
  { network: "youtube", url: "https://youtube.com/@ditu", label: "YouTube" },
];

export interface DituFooterProps {
  socialLinks?: SocialLink[];
  /** Label "Encuéntranos" — default literal. */
  encuentranosLabel?: string;
  /** Bottom line copyright opcional (Figma no lo tiene en este node). */
  bottomLine?: string;
}

export function DituFooter({
  socialLinks = DEFAULT_SOCIALS,
  encuentranosLabel = "Encuéntranos",
  bottomLine,
}: DituFooterProps) {
  return (
    <footer className="relative w-full" style={{ backgroundColor: NAVY_DARK }}>
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center sm:px-12 sm:py-10 lg:px-[117px] lg:py-[40px]">
        {/* Logo Ditu — Figma uses h-40 w-82 in footer (más pequeño que header h-32 w-66).
            DituWordmark renders 66×32 — scale up con className. */}
        <Link
          href="/ditu"
          className="flex shrink-0 items-center"
          aria-label="Ditu — por Caracol"
        >
          <DituWordmark className="!h-[40px] !w-[82px]" />
        </Link>

        {/* Right block — Figma 541:7410: gap-[16px] items-center */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-[16px]">
          <p
            className="font-display text-[16px] font-medium whitespace-nowrap text-white sm:text-[20px] lg:text-[24px]"
            style={{ lineHeight: 1.5 }}
          >
            {encuentranosLabel}
          </p>
          {socialLinks.map((social) => (
            <Link
              key={social.network}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden transition-opacity hover:opacity-80 sm:h-9 sm:w-9 lg:h-[40px] lg:w-[40px]"
            >
              <Image
                src={SOCIAL_ICONS[social.network]}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-contain"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom line opcional (not in Figma 541:7935 pero útil legal) */}
      {bottomLine ? (
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-[1440px] px-6 py-3 text-center text-xs text-white/70 sm:px-12 lg:px-[117px]">
            {bottomLine}
          </div>
        </div>
      ) : null}
    </footer>
  );
}
