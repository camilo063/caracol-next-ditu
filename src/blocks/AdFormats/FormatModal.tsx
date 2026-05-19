"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui";
import { mediaAlt, mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { AdFormatsBlockProps } from "../types";

type Format = NonNullable<AdFormatsBlockProps["formats"]>[number];
type ChildTab = NonNullable<NonNullable<Format["modal"]>["childTabs"]>[number];

export interface FormatModalProps {
  open: boolean;
  format: Format | null;
  onClose: () => void;
}

/**
 * FormatModal — modal de detalle de formato.
 *
 * Desktop:
 *  - max-width 840px, centered, max-height 80vh, scroll vertical interno.
 *  - Layout 2-col: imagen/mockup izquierda + descripción derecha.
 *  - Tabs hijos debajo. CTA "Contáctanos" fijo al fondo.
 *
 * Mobile:
 *  - Fullscreen.
 *  - Vertical: imagen arriba, descripción abajo.
 *  - Tabs hijos con scroll horizontal.
 *  - CTA fijo abajo.
 *
 * Animación: fade + scale 0.96→1, 300ms easeOut (apertura) / easeIn (cierre).
 * ESC + click overlay cierran.
 */
export function FormatModal({ open, format, onClose }: FormatModalProps) {
  const [activeTab, setActiveTab] = React.useState(0);

  // Reset tab cuando se abre el modal.
  React.useEffect(() => {
    if (open) setActiveTab(0);
  }, [open, format?.id]);

  // ESC + scroll lock.
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!format) return null;

  const modal = format.modal;
  const childTabs = (modal?.childTabs ?? []) as ChildTab[];
  const hasTabs = childTabs.length > 0;
  const currentTab = hasTabs
    ? childTabs[Math.min(activeTab, childTabs.length - 1)]
    : null;

  const title = modal?.title || format.name;
  const description = currentTab?.description ?? modal?.description ?? "";
  const imageRef = currentTab?.image ?? format.image;
  const imageUrl = mediaUrl(imageRef);
  const ctaLabel = modal?.ctaLabel || "Contáctanos";
  const ctaHref = modal?.ctaHref || "#contacto";

  return (
    <AnimatePresence>
      {open ? (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ad-format-modal-title"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              // Mobile: fullscreen.
              "fixed inset-0 z-[110] flex flex-col bg-white",
              // Desktop (md+): centered card 840×80vh.
              "md:inset-auto md:top-1/2 md:left-1/2 md:h-[80vh] md:w-[min(840px,92vw)]",
              "md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:shadow-2xl",
              "overflow-hidden",
            )}
          >
            {/* Header con close */}
            <header className="relative flex shrink-0 items-start justify-between gap-4 px-6 pt-6 pb-2 md:px-8 md:pt-8">
              <h2
                id="ad-format-modal-title"
                className="font-display text-fluid-h2 pr-12 font-black text-[#003380]"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar modal"
                className={cn(
                  "absolute top-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#003380]/30 text-[#003380]",
                  "transition-colors hover:bg-[#003380]/5 focus-visible:ring-2 focus-visible:ring-[#003380] focus-visible:ring-offset-2 focus-visible:outline-none",
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Body scroll area */}
            <div className="flex-1 overflow-y-auto px-6 pb-4 md:px-8">
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                {/* Imagen / mockup */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#003380]/15 bg-neutral-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={mediaAlt(imageRef, title)}
                      fill
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0D3AA0] via-[#003CCA] to-[#003380]">
                      <span className="text-sm font-bold text-white opacity-80">
                        {title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  {description ? (
                    <p className="text-fluid-body leading-relaxed whitespace-pre-line text-neutral-700">
                      {description}
                    </p>
                  ) : (
                    <p className="text-fluid-body text-neutral-500">
                      Detalles del formato disponibles próximamente.
                    </p>
                  )}
                </div>
              </div>

              {/* Child tabs */}
              {hasTabs ? (
                <div
                  className={cn(
                    "mt-6 flex gap-2",
                    "[scrollbar-width:none] overflow-x-auto pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
                    "md:flex-wrap md:overflow-visible md:pb-0",
                  )}
                >
                  {childTabs.map((tab, i) => {
                    const isActive = i === activeTab;
                    return (
                      <button
                        key={tab.id ?? tab.label ?? i}
                        type="button"
                        onClick={() => setActiveTab(i)}
                        className={cn(
                          "shrink-0 rounded-md border px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors",
                          "focus-visible:ring-2 focus-visible:ring-[#003380] focus-visible:ring-offset-2 focus-visible:outline-none",
                          isActive
                            ? "border-[#003380] bg-[#003380] text-white"
                            : "border-[#003380]/40 bg-white text-[#003380] hover:bg-[#003380]/5",
                        )}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* CTA footer fijo al fondo */}
            <footer className="shrink-0 border-t border-neutral-200 bg-white px-6 py-4 md:px-8">
              <div className="flex justify-end">
                <Button asChild className="bg-[#2862FF] text-white hover:bg-[#003CCA]">
                  <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
              </div>
            </footer>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
