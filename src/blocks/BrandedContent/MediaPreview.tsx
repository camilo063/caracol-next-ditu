"use client";

import * as React from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import { mediaAlt, mediaUrl, type MediaLike } from "@/lib/media";
import { cn } from "@/lib/utils";
import { getYouTubeEmbedUrl, getYouTubeThumb } from "@/lib/youtube";

type MediaRef = number | string | MediaLike | null | undefined;

export interface MediaPreviewData {
  type?: ("youtube" | "image" | "video") | null;
  youtubeUrl?: string | null;
  image?: MediaRef;
  video?: MediaRef;
  captionTag?: string | null;
  titleOverlay?: string | null;
  logoTopLeft?: MediaRef;
  logoTopRight?: MediaRef;
}

export interface MediaPreviewProps {
  data: MediaPreviewData;
  className?: string;
}

/**
 * MediaPreview — renderiza el bloque multimedia (YouTube embed o imagen/video
 * propio) con overlays opcionales: logo top-left, logo top-right, tag inferior,
 * y título grande sobre el video.
 *
 * Para YouTube: muestra thumbnail con play button hasta el click; al click
 * carga el iframe real (patrón YouTube "lite" — más liviano).
 */
export function MediaPreview({ data, className }: MediaPreviewProps) {
  const [playing, setPlaying] = React.useState(false);
  const embedUrl = data.type === "youtube" ? getYouTubeEmbedUrl(data.youtubeUrl) : null;
  const ytThumb =
    data.type === "youtube" ? getYouTubeThumb(data.youtubeUrl, "maxres") : null;
  const imageUrl = mediaUrl(data.image);
  const videoUrl = mediaUrl(data.video);
  const logoLeftUrl = mediaUrl(data.logoTopLeft);
  const logoRightUrl = mediaUrl(data.logoTopRight);

  const altText = data.titleOverlay ?? mediaAlt(data.image, "Multimedia");

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-xl",
        className,
      )}
    >
      {/* Capa de fondo (thumb / image / video tag) */}
      {data.type === "youtube" ? (
        playing && embedUrl ? (
          <iframe
            src={`${embedUrl}&autoplay=1`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={altText}
          />
        ) : (
          <>
            {ytThumb ? (
              <Image
                src={ytThumb}
                alt={altText}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#8232F0] via-[#A139C6] to-[#FF6F00]" />
            )}
          </>
        )
      ) : data.type === "video" && videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="absolute inset-0 h-full w-full object-cover"
          poster={imageUrl}
        />
      ) : imageUrl ? (
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D3AA0] via-[#003CCA] to-[#1F1647]" />
      )}

      {/* Overlay logos */}
      {logoLeftUrl ? (
        <div className="absolute top-3 left-3 z-10 rounded-md bg-white/85 px-2 py-1 backdrop-blur-sm">
          <Image
            src={logoLeftUrl}
            alt="Logo"
            width={80}
            height={24}
            className="h-5 w-auto object-contain"
          />
        </div>
      ) : null}
      {logoRightUrl ? (
        <div className="absolute top-3 right-3 z-10 rounded-md bg-white/85 px-2 py-1 backdrop-blur-sm">
          <Image
            src={logoRightUrl}
            alt="Logo"
            width={60}
            height={24}
            className="h-5 w-auto object-contain"
          />
        </div>
      ) : null}

      {/* Caption tag inferior */}
      {/* {data.captionTag ? (
        <span
          className="absolute bottom-3 left-3 z-10 rounded-md px-2 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow"
          style={{ backgroundColor: "#2862FF" }}
        >
          {data.captionTag}
        </span>
      ) : null} */}

      {/* Título overlay (centrado) */}
      {data.titleOverlay && !playing ? (
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <p className="font-display max-w-[80%] text-center text-2xl font-black text-white drop-shadow-lg sm:text-3xl">
            {data.titleOverlay}
          </p>
        </div>
      ) : null}

      {/* Play button (solo si es YouTube y no está reproduciéndose) */}
      {data.type === "youtube" && !playing && embedUrl ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Reproducir ${altText}`}
          className="absolute inset-0 z-20 flex items-center justify-center transition-colors hover:bg-black/10"
        >
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-2xl transition-transform hover:scale-105">
            <Play className="ml-1 h-7 w-7 fill-white text-white" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
