import Image from "next/image";

import { brandMeta } from "@/lib/brand";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export interface BrandLogoBadgeProps {
  brand: string;
  displayName?: string | null;
  logo?: number | string | { url?: string | null; alt?: string | null } | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Pequeño badge con logo + nombre + color de la marca.
 * Si no hay logo, muestra un swatch de color del brand.
 */
export function BrandLogoBadge({
  brand,
  displayName,
  logo,
  className,
  size = "md",
}: BrandLogoBadgeProps) {
  const meta = brandMeta(brand);
  const label = displayName ?? meta.label;
  const url = mediaUrl(logo);

  const heights: Record<NonNullable<BrandLogoBadgeProps["size"]>, number> = {
    sm: 20,
    md: 28,
    lg: 40,
  };
  const h = heights[size];

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {url ? (
        <Image
          src={url}
          alt={label}
          width={h * 3}
          height={h}
          className="h-auto w-auto object-contain"
          style={{ maxHeight: h }}
        />
      ) : (
        <span
          aria-hidden="true"
          className="inline-block rounded-sm"
          style={{ backgroundColor: meta.color, width: h, height: h }}
        />
      )}
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
}
