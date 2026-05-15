import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Music,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music,
  youtube: Youtube,
  x: Twitter,
  threads: MessageCircle,
  whatsapp: MessageCircle,
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
