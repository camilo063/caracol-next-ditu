import type { Media } from "@/payload-types";
import {
  DituPautaBlock,
  type Category,
  type CategoryKey,
} from "@/components/marketing/ditu-pauta";
import { isMediaVideo, mediaUrl } from "@/lib/media";
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
            imageIsVideo: isMediaVideo(f.image as number | Media | null | undefined),
            youtubeUrl: f.youtubeUrl ?? undefined,
            videoExternalUrl: f.videoExternalUrl ?? undefined,
          })),
        }))
      : undefined;

  // El botón del CTA puede llevar a una URL o descargar un archivo subido,
  // según `linkType`. Resolvemos acá la URL del archivo para el front.
  const cta = block.cta
    ? {
        boldText: block.cta.boldText,
        text: block.cta.text,
        buttonLabel: block.cta.buttonLabel,
        buttonHref: block.cta.buttonHref,
        openInNewTab: block.cta.openInNewTab,
        linkType: block.cta.linkType,
        fileUrl:
          block.cta.linkType === "file"
            ? (mediaUrl(block.cta.file as number | Media | null | undefined) ?? null)
            : null,
      }
    : undefined;

  return (
    <DituPautaBlock
      anchorId={block.anchorId ?? undefined}
      stickerLabel={block.stickerLabel ?? undefined}
      heading={block.heading ?? undefined}
      subtitle={block.subtitle ?? undefined}
      sidebarLabel={block.sidebarLabel ?? undefined}
      cta={cta}
      categories={categories}
    />
  );
}
