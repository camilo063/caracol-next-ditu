/**
 * Helpers para resolver Media refs de Payload.
 * En Payload, un campo `upload` puede venir como ID (number) o como objeto Media populado.
 */

export interface MediaLike {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  filename?: string | null;
}

/** Devuelve la URL de un media field, sea ID o objeto. ID → undefined. */
export function mediaUrl(
  media: MediaLike | number | string | null | undefined,
): string | undefined {
  if (!media) return undefined;
  if (typeof media === "number" || typeof media === "string") return undefined;
  return media.url ?? undefined;
}

/** Devuelve el alt text si el media está populado, o un fallback. */
export function mediaAlt(
  media: MediaLike | number | string | null | undefined,
  fallback = "",
): string {
  if (!media || typeof media === "number" || typeof media === "string") return fallback;
  return media.alt ?? fallback;
}

/** Detecta si el media es un video. */
export function isMediaVideo(
  media: MediaLike | number | string | null | undefined,
): boolean {
  if (!media || typeof media === "number" || typeof media === "string") return false;
  return media.mimeType?.startsWith("video/") ?? false;
}

/** Width/height del media (para Next/Image). */
export function mediaDimensions(
  media: MediaLike | number | string | null | undefined,
): { width: number; height: number } | undefined {
  if (!media || typeof media === "number" || typeof media === "string") return undefined;
  if (!media.width || !media.height) return undefined;
  return { width: media.width, height: media.height };
}
