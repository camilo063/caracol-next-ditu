import Image from "next/image";
import { Globe, Linkedin, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * NetworkIcon — usa los SVG assets oficiales del Figma (Mediakit Caracol).
 *
 * Variantes:
 *  - "white" (default): silhouettes blancas para colocar dentro de círculo de
 *    color (ej. audience block "Líderes en redes").
 *  - "navy": silhouettes navy #003381 para colocar sobre fondo blanco (ej.
 *    BrandTabs REDES card).
 *
 * Las redes secundarias (linkedin, threads, web) usan Lucide outline icons.
 */

const WHITE_PATHS: Record<string, string> = {
  facebook: "/icons/networks/facebook.svg",
  tiktok: "/icons/networks/tiktok.svg",
  x: "/icons/networks/x.svg",
  youtube: "/icons/networks/youtube.svg",
  instagram: "/icons/networks/instagram.svg",
  whatsapp: "/icons/networks/whatsapp.svg",
};

const NAVY_PATHS: Record<string, string> = {
  facebook: "/icons/networks-navy/facebook.svg",
  tiktok: "/icons/networks-navy/tiktok.svg",
  x: "/icons/networks-navy/x.svg",
  youtube: "/icons/networks-navy/youtube.svg",
  instagram: "/icons/networks-navy/instagram.svg",
  whatsapp: "/icons/networks-navy/whatsapp.svg",
};

const LUCIDE_ICONS: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  threads: Globe,
  web: Globe,
};

export interface NetworkIconProps {
  network: string | null | undefined;
  className?: string;
  style?: React.CSSProperties;
  /** Color del icon: "white" para colocar en círculo de color, "navy" para
   *  colocar sobre fondo blanco. Default: "white". */
  variant?: "white" | "navy";
}

export function NetworkIcon({
  network,
  className,
  style,
  variant = "white",
}: NetworkIconProps) {
  const paths = variant === "navy" ? NAVY_PATHS : WHITE_PATHS;
  const svgPath = network && paths[network];
  if (svgPath) {
    return (
      <Image
        src={svgPath}
        alt={network ?? ""}
        width={48}
        height={48}
        className={cn("h-5 w-5", className)}
        style={style}
      />
    );
  }
  const Comp = (network && LUCIDE_ICONS[network]) || Globe;
  return <Comp className={cn("h-5 w-5", className)} style={style} aria-hidden="true" />;
}
