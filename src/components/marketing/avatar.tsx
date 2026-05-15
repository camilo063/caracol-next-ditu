import Image from "next/image";

import { cn } from "@/lib/utils";
import type { MediaLike } from "@/lib/media";
import { mediaAlt, mediaUrl } from "@/lib/media";

export interface AvatarProps {
  media?: MediaLike | number | string | null;
  name: string;
  size?: number;
  className?: string;
}

/**
 * Avatar simple. Si el media no está disponible, muestra iniciales del name.
 */
export function Avatar({ media, name, size = 48, className }: AvatarProps) {
  const url = mediaUrl(media);
  const alt = mediaAlt(media, name);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {url ? (
        <Image
          src={url}
          alt={alt}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        initials || "?"
      )}
    </div>
  );
}
