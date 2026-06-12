import type { Media } from "@/payload-types";
import { DituHero } from "@/components/marketing/ditu-hero";
import { mediaUrl } from "@/lib/media";
import type { DituHeroBlockProps } from "../types";

export function DituHeroBlockComponent(block: DituHeroBlockProps) {
  const buttons =
    block.buttons && block.buttons.length > 0
      ? block.buttons.map((btn) => ({
          label: btn.label,
          href: btn.href ?? "#",
          icon: (btn.iconKey ?? "tv") as "googleplay" | "appstore" | "tv",
          iconUrl: mediaUrl(btn.iconMedia as number | Media | null | undefined),
        }))
      : undefined;

  return (
    <DituHero
      anchorId={block.anchorId ?? undefined}
      stickerText={block.stickerText ?? undefined}
      headingLine1={block.headingLine1 ?? undefined}
      headingLine2={block.headingLine2 ?? undefined}
      headingAccent={block.headingAccent ?? undefined}
      description={block.description ?? undefined}
      buttons={buttons}
    />
  );
}
