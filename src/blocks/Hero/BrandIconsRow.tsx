"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { BrandIconSvg } from "@/components/marketing/brand-icon-svg";
import { brandMeta } from "@/lib/brand";
import { useIsMobile } from "@/lib/hooks/use-media-query";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export interface BrandIconItem {
  brand: string;
  icon?: number | string | { url?: string | null; alt?: string | null } | null;
  id?: string | null;
}

export interface BrandIconsRowProps {
  items: BrandIconItem[];
  className?: string;
}

/**
 * BrandIconsRow — fila de íconos del ecosistema en el Hero.
 *
 * Desktop:  fade-in escalonado (delay 0.1–0.15s por ícono).
 * Mobile:   marquee infinito en loop, velocidad continua.
 *
 * Respeta `prefers-reduced-motion` → render estático.
 */
export function BrandIconsRow({ items, className }: BrandIconsRowProps) {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  if (items.length === 0) return null;

  if (reduced) {
    return (
      <ul className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
        {items.map((b, i) => (
          <li key={b.id ?? i}>
            <BrandIconCell item={b} />
          </li>
        ))}
      </ul>
    );
  }

  if (isMobile) {
    return <MarqueeIcons items={items} className={className} />;
  }

  return <StaggeredIcons items={items} className={className} />;
}

/* ----------------------------- Desktop: stagger ---------------------------- */

function StaggeredIcons({ items, className }: BrandIconsRowProps) {
  return (
    <motion.ul
      className={cn("flex flex-wrap items-center justify-center gap-4", className)}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {items.map((b, i) => (
        <motion.li
          key={b.id ?? i}
          variants={{
            hidden: { opacity: 0, y: 10, scale: 0.95 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.35, ease: "easeOut" },
            },
          }}
        >
          <BrandIconCell item={b} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

/* ------------------------------ Mobile: marquee ---------------------------- */

function MarqueeIcons({ items, className }: BrandIconsRowProps) {
  // gap-4 = 1rem = 16px. El "step" es el ancho exacto de un set completo
  // (cada ítem + su gap siguiente), lo que garantiza un loop pixel-perfect.
  const ICON_SIZE = 76;
  const GAP = 16;
  const step = items.length * (ICON_SIZE + GAP);
  // 4 copias aseguran que el track siempre supere el viewport (hasta ~480px)
  // + el step de scroll, eliminando el hueco blanco al final del loop.
  const looped = [...items, ...items, ...items, ...items];
  const duration = Math.max(18, items.length * 3);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        "[mask-image:linear-gradient(90deg,transparent_0,black_8%,black_92%,transparent_100%)]",
        className,
      )}
    >
      <motion.ul
        className="flex w-max items-center gap-4"
        animate={{ x: [0, -step] }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {looped.map((b, i) => (
          <li key={`${b.id ?? b.brand}-${i}`} className="shrink-0">
            <BrandIconCell item={b} />
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

/* ----------------------------- shared icon cell --------------------------- */

function BrandIconCell({ item }: { item: BrandIconItem }) {
  const meta = brandMeta(item.brand);
  const iconUrl = mediaUrl(item.icon);
  // Figma 347:2038-2053: size 76x76, border-2 #015BC4, bg #003381, rounded-[16px].
  // Logo brand interno fills 72x72 (76 - border 2px each side).
  return (
    <span
      className="relative block h-[76px] w-[76px] overflow-hidden rounded-[16px] border-2"
      style={{ backgroundColor: "#003381", borderColor: "#015BC4" }}
      title={meta.label}
    >
      {iconUrl ? (
        <span className="flex h-full w-full items-center justify-center">
          <Image
            src={iconUrl}
            alt={meta.label}
            width={72}
            height={72}
            className="h-[72px] w-[72px] object-cover"
          />
        </span>
      ) : (
        // Cuando no hay logo subido al admin, usamos el SVG inline por brand.
        <BrandIconSvg brand={item.brand} />
      )}
    </span>
  );
}
