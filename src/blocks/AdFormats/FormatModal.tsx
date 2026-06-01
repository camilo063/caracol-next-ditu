"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

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

const NAVY_DARK = "#003381";
const AZUL_MEDIO = "#015BC4";
const AZUL_CLARO = "#00ACFF";
const GRIS_MEDIO = "#95999A";

/**
 * FormatModal — implementación 1:1 del Figma 521:7072 (3 variantes).
 *
 * Specs:
 *  - Container: bg white, rounded-8, w-840 px-48 py-64, gap-24, items-end.
 *  - Title: Montserrat Bold 40px tracking -1px color #003381 (full-width).
 *  - Content row (gap-16, items-center):
 *    - Left (flex-1): aspect 657/370, border #95999A rounded-8.
 *    - Right (305px): description Regular 14px color #121212.
 *  - Optional child tabs row (flex-wrap gap-16):
 *    - Active: bg #015BC4 + Bold 12px white.
 *    - Outline: border #015BC4 + #015BC4 text Bold 12px.
 *    - Padding px-16 py-4 (Small size).
 *  - CTA "Contáctanos": bg #00ACFF Bold 12px white px-16 py-4.
 *  - Close button: absolute top-8 right-8 size-48.
 *
 * Mobile: fullscreen con safe area.
 */
export function FormatModal({ open, format, onClose }: FormatModalProps) {
  const [activeTab, setActiveTab] = React.useState(0);

  React.useEffect(() => {
    if (open) setActiveTab(0);
  }, [open, format?.id]);

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

          {/* Modal — Figma 840×auto, items-end, gap-24, px-48 py-64 */}
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
              "fixed inset-0 z-[110] flex flex-col overflow-y-auto bg-white p-6",
              // Desktop (md+): centered card 840px wide, max-height with internal scroll.
              "md:inset-auto md:top-1/2 md:left-1/2 md:max-h-[90vh] md:w-[min(840px,92vw)]",
              "md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[8px] md:px-[48px] md:py-[64px]",
              "md:items-end md:gap-[24px]",
            )}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* Close button — Figma 521:7072: top-right 24x24 con stroke-2,
                color #003381 (sin background circular). */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className={cn(
                "absolute top-4 right-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200",
                "hover:scale-110 hover:bg-[#003381]/10 focus-visible:ring-2 focus-visible:ring-[#003381] focus-visible:ring-offset-2 focus-visible:outline-none",
              )}
              style={{ color: NAVY_DARK }}
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            {/* Title — Bold 40px tracking -1px #003381 */}
            <h2
              id="ad-format-modal-title"
              className="font-display w-full pr-12 text-[28px] leading-tight font-bold sm:text-[32px] md:pr-0 lg:text-[40px]"
              style={{ color: NAVY_DARK, letterSpacing: "-1px" }}
            >
              {title}
            </h2>

            {/* Content row (gap-16, items-center): image + description */}
            <div className="flex w-full flex-col items-center gap-4 md:flex-row md:items-center">
              {/* Image — flex-1, aspect 657/370, border #95999A rounded-8 */}
              <div className="w-full flex-1">
                <div
                  className="relative aspect-[657/370] w-full overflow-hidden rounded-[8px]"
                  style={{ border: `1px solid ${GRIS_MEDIO}` }}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={mediaAlt(imageRef, title)}
                      fill
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: "#F3F4F6" }}
                    >
                      <span
                        className="text-sm font-bold opacity-50"
                        style={{ color: NAVY_DARK }}
                      >
                        {title}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description — Regular 14px #121212, 305px wide */}
              <div className="flex w-full flex-col items-start justify-center md:w-[305px]">
                {description ? (
                  <p
                    className="font-display text-[14px] leading-normal font-normal whitespace-pre-line"
                    style={{ color: "#121212" }}
                  >
                    {description}
                  </p>
                ) : (
                  <p
                    className="font-display text-[14px] leading-normal font-normal"
                    style={{ color: "#95999A" }}
                  >
                    Detalles del formato disponibles próximamente.
                  </p>
                )}
              </div>
            </div>

            {/* Child tabs row — Mobile: wrap a múltiples líneas (sin scroll
                horizontal — spec usuario "pestañas internas deben desplazarse
                hacia abajo, no mediante scroll horizontal"). Desktop: row. */}
            {hasTabs ? (
              <div
                className={cn("flex w-full flex-wrap items-start gap-3", "pb-2 md:pb-0")}
              >
                {childTabs.map((tab, i) => {
                  const isActive = i === activeTab;
                  return (
                    <button
                      key={tab.id ?? tab.label ?? i}
                      type="button"
                      onClick={() => setActiveTab(i)}
                      className={cn(
                        "font-display inline-flex min-h-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] px-4 py-1 text-[12px] leading-[16px] font-bold whitespace-nowrap transition-all duration-200 hover:opacity-90",
                        "focus-visible:ring-2 focus-visible:ring-[#003381] focus-visible:ring-offset-2 focus-visible:outline-none",
                      )}
                      style={
                        isActive
                          ? {
                              backgroundColor: AZUL_MEDIO,
                              border: `1px solid ${AZUL_MEDIO}`,
                              color: "white",
                            }
                          : {
                              backgroundColor: "transparent",
                              border: `1px solid ${AZUL_MEDIO}`,
                              color: AZUL_MEDIO,
                            }
                      }
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {/* CTA "Contáctanos" — bg #00ACFF Small Bold 12px white px-16 py-4 */}
            <div className="flex w-full justify-end">
              <Link
                href={ctaHref}
                className="font-display inline-flex min-h-[32px] cursor-pointer items-center justify-center rounded-[4px] px-4 py-1 text-[12px] leading-[16px] font-bold whitespace-nowrap text-white transition-all duration-200 hover:bg-[#0099E5] hover:shadow-md hover:shadow-[#00ACFF]/30 active:scale-[0.98]"
                style={{
                  backgroundColor: AZUL_CLARO,
                  border: `1px solid ${AZUL_CLARO}`,
                }}
              >
                {ctaLabel}
              </Link>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
