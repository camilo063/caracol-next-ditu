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

export function NetworkIcon({
  network,
  className,
}: {
  network: string | null | undefined;
  className?: string;
}) {
  const Comp = (network && ICONS[network]) || Globe;
  return <Comp className={cn("h-5 w-5", className)} aria-hidden="true" />;
}
