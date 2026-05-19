"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

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
      <ul className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
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
      className={cn("flex flex-wrap items-center justify-center gap-3", className)}
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
  // Duplicamos el set para crear un loop sin saltos.
  const looped = [...items, ...items];
  // Velocidad: ~22s para recorrer toda la fila duplicada. Cuanto más íconos, más lento.
  const duration = Math.max(18, items.length * 3);
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        // Fade lateral para que los íconos no aparezcan/desaparezcan abruptos.
        "[mask-image:linear-gradient(90deg,transparent_0,black_8%,black_92%,transparent_100%)]",
        className,
      )}
    >
      <motion.ul
        className="flex w-max items-center gap-3"
        animate={{ x: ["0%", "-50%"] }}
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
  return (
    <span
      className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm"
      title={meta.label}
    >
      {iconUrl ? (
        <Image
          src={iconUrl}
          alt={meta.label}
          width={36}
          height={36}
          className="h-7 w-auto object-contain"
        />
      ) : (
        <span
          className="inline-block h-6 w-6 rounded-md"
          style={{ backgroundColor: meta.color }}
          aria-label={meta.label}
        />
      )}
    </span>
  );
}
