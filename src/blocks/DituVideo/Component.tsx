import type { Media } from "@/payload-types";
import { DituVideoBlock } from "@/components/marketing/ditu-video-block";
import { mediaUrl } from "@/lib/media";
import type { DituVideoBlockProps } from "../types";

export function DituVideoBlockComponent(block: DituVideoBlockProps) {
  return (
    <DituVideoBlock
      anchorId={block.anchorId ?? undefined}
      src={mediaUrl(block.image as number | Media | null | undefined)}
      alt={block.alt ?? ""}
      background={block.background ?? undefined}
    />
  );
}
