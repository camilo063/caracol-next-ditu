import type { Media } from "@/payload-types";
import { DituVideoBlock } from "@/components/marketing/ditu-video-block";
import { mediaUrl } from "@/lib/media";
import type { DituVideoBlockProps } from "../types";

export function DituVideoBlockComponent(block: DituVideoBlockProps) {
  // videoType define la fuente. Default 'youtube' cubre registros viejos.
  const videoType = block.videoType ?? "youtube";
  const youtubeUrl =
    videoType === "youtube" ? (block.youtubeUrl ?? undefined) : undefined;
  const videoSrc =
    videoType === "external"
      ? (block.videoExternalUrl ?? undefined)
      : videoType === "upload"
        ? mediaUrl(block.videoFile as number | Media | null | undefined)
        : undefined;

  return (
    <DituVideoBlock
      anchorId={block.anchorId ?? undefined}
      src={mediaUrl(block.image as number | Media | null | undefined)}
      alt={block.alt ?? ""}
      background={block.background ?? undefined}
      youtubeUrl={youtubeUrl}
      videoSrc={videoSrc}
    />
  );
}
