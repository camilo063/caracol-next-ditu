/**
 * Helpers para parsear URLs de YouTube y producir embeds.
 */

const PATTERNS: RegExp[] = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
];

export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  for (const p of PATTERNS) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

export function getYouTubeEmbedUrl(
  url: string | null | undefined,
  opts: { autoplay?: boolean; muted?: boolean } = {},
): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  const params = new URLSearchParams();
  params.set("rel", "0");
  params.set("modestbranding", "1");
  if (opts.autoplay) params.set("autoplay", "1");
  if (opts.muted) params.set("mute", "1");
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function getYouTubeThumb(
  url: string | null | undefined,
  quality: "default" | "mq" | "hq" | "sd" | "maxres" = "hq",
): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  const sizeMap = {
    default: "default",
    mq: "mqdefault",
    hq: "hqdefault",
    sd: "sddefault",
    maxres: "maxresdefault",
  };
  return `https://i.ytimg.com/vi/${id}/${sizeMap[quality]}.jpg`;
}
