import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Custom brand-specific SVG icons para plataformas que Lucide no provee
 * con el logo oficial (TikTok, X/Twitter, WhatsApp, Threads).
 * Diseñados con currentColor stroke/fill para heredar el color del padre.
 */

type IconComponent = React.FC<{ className?: string; style?: React.CSSProperties }>;

const TiktokIcon: IconComponent = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.94a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
  </svg>
);

const XIcon: IconComponent = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsappIcon: IconComponent = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const ThreadsIcon: IconComponent = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509-1.646-2.05-2.495-4.9-2.522-8.473v-.024c.027-3.574.876-6.424 2.522-8.473C5.846 1.218 8.6.038 12.18.014h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.151 1.43 1.781 3.63 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.74-1.757-.503-.586-1.28-.883-2.31-.89h-.029c-.825 0-1.945.227-2.66 1.288l-1.687-1.135c.96-1.425 2.52-2.208 4.348-2.208h.043c3.057.019 4.876 1.901 5.058 5.19.103.044.205.087.305.135 1.439.658 2.51 1.655 3.058 2.84 1.024 2.21.69 5.018-.81 6.812-.949 1.135-2.16 2.025-3.7 2.643-1.541.62-3.276.94-5.227.94zm.04-12.142c-.398 0-.798.012-1.197.038-1.046.067-1.92.42-2.524.946-.62.539-.95 1.275-.913 2.022.038.71.443 1.342 1.16 1.804.665.43 1.518.626 2.404.566 1.116-.06 1.96-.487 2.566-1.291.55-.733.89-1.829.99-3.252a14.077 14.077 0 0 0-2.486-.833z" />
  </svg>
);

const ICONS: Record<string, LucideIcon | IconComponent> = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: TiktokIcon,
  youtube: Youtube,
  x: XIcon,
  threads: ThreadsIcon,
  whatsapp: WhatsappIcon,
  linkedin: Linkedin,
  web: Globe,
};

export interface NetworkIconProps {
  network: string | null | undefined;
  className?: string;
  style?: React.CSSProperties;
}

export function NetworkIcon({ network, className, style }: NetworkIconProps) {
  const Comp = (network && ICONS[network]) || Globe;
  return <Comp className={cn("h-5 w-5", className)} style={style} aria-hidden="true" />;
}
