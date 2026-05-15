import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Logo — wrapper consistente para el logo de marca.
 * Recibe `src` (de Payload Media) + `alt` y aplica tamaño/sizing estándar.
 * Si `href` está presente, envuelve en Link.
 */
export interface LogoProps {
  src: string;
  alt: string;
  href?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  unoptimized?: boolean;
}

export function Logo({
  src,
  alt,
  href = "/",
  width = 160,
  height = 32,
  className,
  priority = false,
  unoptimized = false,
}: LogoProps) {
  const img = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized={unoptimized}
      className={cn("h-8 w-auto object-contain", className)}
    />
  );

  if (!href) return img;

  return (
    <Link
      href={href}
      className="focus-visible:ring-ring inline-flex shrink-0 items-center rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label={alt}
    >
      {img}
    </Link>
  );
}
