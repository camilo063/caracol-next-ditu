"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

/**
 * resolveVideoEmbed — decide qué video mostrar en un slot de preview.
 * Prioridad: YouTube → URL externa → archivo subido (solo si es video).
 * Devuelve null cuando no hay video → el caller debe mostrar la imagen.
 */
export function resolveVideoEmbed(opts: {
  youtubeUrl?: string | null;
  videoExternalUrl?: string | null;
  fileUrl?: string | null;
  fileIsVideo?: boolean;
}): { kind: "youtube" | "video"; url: string } | null {
  const embed = getYouTubeEmbedUrl(opts.youtubeUrl ?? undefined);
  if (embed) return { kind: "youtube", url: embed };
  const directVideo =
    opts.videoExternalUrl || (opts.fileIsVideo ? opts.fileUrl : undefined);
  if (directVideo) return { kind: "video", url: directVideo };
  return null;
}

export interface MediaFillProps {
  youtubeUrl?: string | null;
  videoExternalUrl?: string | null;
  fileUrl?: string | null;
  fileIsVideo?: boolean;
  alt?: string;
  className?: string;
  /** Qué renderizar cuando el preview es imagen (no video). */
  imageNode: React.ReactNode;
}

/**
 * MediaFill — rellena un contenedor `relative` con el preview correcto:
 * iframe de YouTube, <video> (URL externa o archivo mp4), o el `imageNode`
 * provisto por el caller (que mantiene su crop/estilo propio).
 */
export function MediaFill({
  youtubeUrl,
  videoExternalUrl,
  fileUrl,
  fileIsVideo,
  alt,
  className,
  imageNode,
}: MediaFillProps) {
  const video = resolveVideoEmbed({ youtubeUrl, videoExternalUrl, fileUrl, fileIsVideo });

  if (!video) return <>{imageNode}</>;

  if (video.kind === "youtube") {
    return (
      <iframe
        src={video.url}
        title={alt || "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={cn("absolute inset-0 h-full w-full", className)}
      />
    );
  }

  return (
    <video
      src={video.url}
      controls
      playsInline
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
