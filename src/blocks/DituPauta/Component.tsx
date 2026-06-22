import type { Media } from "@/payload-types";
import {
  DituPautaBlock,
  type Category,
  type CategoryKey,
} from "@/components/marketing/ditu-pauta";
import { mediaUrl } from "@/lib/media";
import type { DituPautaBlockProps } from "../types";

export function DituPautaBlockComponent(block: DituPautaBlockProps) {
  const categories: Category[] | undefined =
    block.categories && block.categories.length > 0
      ? block.categories.map((cat) => ({
          key: cat.key as CategoryKey,
          label: cat.label,
          formats: (cat.formats ?? []).map((f, idx) => ({
            id: f.id ?? String(idx),
            tag: f.tag ?? "",
            title: f.title,
            description: f.description ?? "",
            image: mediaUrl(f.image as number | Media | null | undefined) ?? undefined,
          })),
        }))
      : undefined;

  return (
    <DituPautaBlock
      anchorId={block.anchorId ?? undefined}
      stickerLabel={block.stickerLabel ?? undefined}
      heading={block.heading ?? undefined}
      subtitle={block.subtitle ?? undefined}
      sidebarLabel={block.sidebarLabel ?? undefined}
      cta={block.cta ?? undefined}
      categories={categories}
    />
  );
}
