"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/hooks/use-media-query";
import type { BrandedContentBlockProps } from "../types";
import { MediaPreview } from "./MediaPreview";

type Category = NonNullable<BrandedContentBlockProps["categories"]>[number];

/**
 * BrandedContentBlock — implementación 1:1 del Figma 401:4267 + variantes 401:3385/3699/3794.
 *
 * Specs (Figma MCP):
 *  - Container: bg transparente, px-[120px] py-[220px] (sin card wrapper).
 *  - Layout: 2 columnas gap-64, ambas 568px wide.
 *
 *  Izquierda (568px):
 *   - Pill badge "BRANDED CONTENT" — visible solo cuando active tab NO es la
 *     primera ("Branded Content"). bg #00ACFF Bold 14px white uppercase.
 *   - Heading: Montserrat Bold 64px line-height 72px color #003381.
 *     Soporta split en 2 líneas con separador "|" (ej. "Video|Podcast").
 *   - Description: Montserrat Medium 18px line-height 24 color #464553.
 *   - 4 main tabs (flex-wrap gap-20): bg #015BC4 (active) o border #015BC4 (outline).
 *     Texto SemiBold 14px, padding px-32 py-8.
 *
 *  Derecha (568px):
 *   - Si la categoría tiene secondaryTabs: muestra row de secondary tabs encima.
 *     Active: bg #00ACFF, Inactive (Pressed): bg #003381. Padding px-32 py-8.
 *   - Media preview con aspect 480/270 rounded-12.
 *
 * Mobile: carrusel Embla + modal fullscreen.
 */

const PILL_BG = "#00ACFF";
const HEADING_NAVY = "#003381";
const TEXT_GRIS_OSCURO = "#464553";
const AZUL_MEDIO = "#015BC4";
const NAVY_DARK = "#003381";

export function BrandedContentBlockComponent({
  anchorId,
  categories,
  defaultIndex,
}: BrandedContentBlockProps) {
  const isMobile = useIsMobile();
  if (!categories || categories.length === 0) return null;

  const safeDefault = Math.min(Math.max(defaultIndex ?? 0, 0), categories.length - 1);
  return (
    <section
      id={anchorId ?? "branded"}
      className="px-4 py-12 sm:px-6 sm:py-20 xl:px-30 xl:py-55"
    >
      {isMobile ? (
        <MobileSlider categories={categories} defaultIndex={safeDefault} />
      ) : (
        <DesktopLayout categories={categories} defaultIndex={safeDefault} />
      )}
    </section>
  );
}

/* ============================================================================
   DESKTOP
   ============================================================================ */

function DesktopLayout({
  categories,
  defaultIndex,
}: {
  categories: Category[];
  defaultIndex: number;
}) {
  const [activeMain, setActiveMain] = React.useState(defaultIndex);
  const [activeSecondary, setActiveSecondary] = React.useState(0);

  React.useEffect(() => {
    setActiveSecondary(0);
  }, [activeMain]);

  const current = categories[activeMain]!;
  const secondaryTabs = current.secondaryTabs ?? [];
  const activeMedia =
    secondaryTabs.length > 0
      ? secondaryTabs[Math.min(activeSecondary, secondaryTabs.length - 1)]!.multimedia
      : current.multimedia;

  // Pill "BRANDED CONTENT" visible solo en tabs distintas a la primera (idx 0).
  const showPill = activeMain > 0;

  // Botones de tabs — reutilizados arriba (md) y en columna izquierda (lg)
  const tabButtons = categories.map((cat, i) => {
    const isActive = i === activeMain;
    return (
      <button
        key={cat.key ?? cat.label}
        type="button"
        onClick={() => setActiveMain(i)}
        className={cn(
          "font-display inline-flex min-h-[32px] items-center justify-center rounded-[4px] px-[32px] py-[8px] text-[14px] leading-[20px] font-semibold whitespace-nowrap transition-colors",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
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
        {cat.label}
      </button>
    );
  });

  return (
    <div>
      {/* TABS TOP — visible hasta xl, oculto en xl+ */}
      <div className="mb-8 flex flex-wrap justify-center gap-3 xl:hidden">
        {tabButtons}
      </div>

      <div className="mx-auto grid w-full max-w-300 items-center gap-16 xl:grid-cols-2">
        {/* LEFT — fade 300ms cuando cambia main */}
        <div className="mx-auto flex w-full max-w-142 flex-col items-center gap-8 xl:mx-0 xl:items-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={`main-${activeMain}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-center gap-4 text-center xl:items-start xl:text-left"
            >
              {/* Pill badge */}
              <span
                className={cn(
                  "font-display inline-flex w-fit items-center justify-center rounded-[4px] px-2 py-1 text-[14px] leading-[16px] font-bold text-white uppercase transition-opacity",
                  showPill ? "opacity-100" : "opacity-0",
                )}
                style={{ backgroundColor: PILL_BG }}
              >
                Branded Content
              </span>

              <HeadingSplit
                text={current.heading ?? current.label}
                color={HEADING_NAVY}
              />

              {current.description ? (
                <p
                  className="font-display text-[16px] leading-[24px] font-medium sm:text-[18px]"
                  style={{ color: TEXT_GRIS_OSCURO }}
                >
                  {current.description}
                </p>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {/* Main tabs — solo visible en xl+ (en md/lg van arriba) */}
          <div className="hidden flex-wrap items-center gap-5 xl:flex">{tabButtons}</div>
        </div>

        {/* RIGHT — secondary tabs + multimedia */}
        <div className="m-auto flex w-full max-w-[568px] flex-col gap-8 xl:m-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`media-${activeMain}-${activeSecondary}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex flex-col gap-8"
            >
              {/* Secondary tabs row (solo si la categoría las tiene) */}
              {secondaryTabs.length > 0 ? (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {secondaryTabs.map(
                    (st: NonNullable<Category["secondaryTabs"]>[number], i: number) => {
                      const isActive = i === activeSecondary;
                      return (
                        <button
                          key={st.label ?? i}
                          type="button"
                          onClick={() => setActiveSecondary(i)}
                          className={cn(
                            "font-display inline-flex min-h-[32px] items-center justify-center rounded-[4px] px-[32px] py-[8px] text-[14px] leading-[20px] font-semibold whitespace-nowrap text-white transition-colors",
                            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                          )}
                          style={
                            isActive
                              ? {
                                  backgroundColor: PILL_BG,
                                  border: `1px solid ${PILL_BG}`,
                                }
                              : {
                                  backgroundColor: NAVY_DARK,
                                  border: `1px solid ${NAVY_DARK}`,
                                }
                          }
                        >
                          {st.label}
                        </button>
                      );
                    },
                  )}
                </div>
              ) : null}

              {/* Media preview con aspect ratio Figma 480/270 ≈ 16/9 */}
              <div className="aspect-480/270 w-full overflow-hidden rounded-[12px]">
                <MediaPreview data={activeMedia ?? {}} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** Heading con soporte de split "Linea 1|Linea 2" para 2 líneas. */
function HeadingSplit({ text, color }: { text: string; color: string }) {
  const [line1, line2] = text.split("|").map((s) => s.trim());
  return (
    <h2
      className="font-display text-[40px] leading-[1.125] font-bold sm:text-[48px] lg:text-[64px] lg:leading-[72px]"
      style={{ color, wordBreak: "break-word" }}
    >
      <span className="block">{line1}</span>
      {line2 ? <span className="block">{line2}</span> : null}
    </h2>
  );
}

/* ============================================================================
   MOBILE — Slider + Modal Fullscreen
   ============================================================================ */

function MobileSlider({
  categories,
  defaultIndex,
}: {
  categories: Category[];
  defaultIndex: number;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    startIndex: defaultIndex,
  });
  const [selectedIndex, setSelectedIndex] = React.useState(defaultIndex);
  const [modalIndex, setModalIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const canPrev = selectedIndex > 0;
  const canNext = selectedIndex < categories.length - 1;

  return (
    <div className="mt-8">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {categories.map((cat, i) => {
            const isActive = i === selectedIndex;
            return (
              <div
                key={cat.key ?? cat.label}
                className="min-w-0 shrink-0 grow-0 basis-[80%] px-2"
              >
                <div
                  className={cn(
                    "relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-[12px] rounded-t-none border p-6 pt-8 text-center transition-all duration-300",
                    isActive ? "scale-100 opacity-100" : "scale-90 opacity-60",
                  )}
                  style={{
                    background: "linear-gradient(160deg, #ffffff 0%, #f0f8ff 100%)",
                    borderColor: "rgba(207,206,204,0.6)",
                  }}
                >
                  <div className="flex h-full flex-col items-center gap-4">
                    <span
                      className="w-fit rounded-[4px] px-3 py-1 text-[12px] font-bold tracking-wide text-white uppercase"
                      style={{ backgroundColor: PILL_BG }}
                    >
                      {cat.label.toUpperCase()}
                    </span>
                    <h3
                      className="font-display text-[28px] font-bold"
                      style={{ color: HEADING_NAVY, lineHeight: 1.2 }}
                    >
                      {(cat.heading ?? cat.label).replace("|", " ")}
                    </h3>
                    {cat.description ? (
                      <p
                        className="font-display text-[14px] leading-[1.3] font-medium"
                        style={{ color: TEXT_GRIS_OSCURO }}
                      >
                        {cat.description}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalIndex(i)}
                    className="mt-2 rounded-[4px] bg-[#00ACFF] px-8 py-2 text-sm font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-[#2862FF]"
                  >
                    Ver más
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flechas prev/next */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canPrev}
          aria-label="Anterior"
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition-opacity",
            !canPrev && "cursor-not-allowed opacity-30",
          )}
          style={{ borderColor: AZUL_MEDIO, color: AZUL_MEDIO }}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canNext}
          aria-label="Siguiente"
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition-opacity",
            !canNext && "cursor-not-allowed opacity-30",
          )}
          style={{ borderColor: AZUL_MEDIO, color: AZUL_MEDIO }}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <FullscreenModal
        open={modalIndex !== null}
        onClose={() => setModalIndex(null)}
        category={modalIndex !== null ? categories[modalIndex]! : null}
      />
    </div>
  );
}

function FullscreenModal({
  open,
  onClose,
  category,
}: {
  open: boolean;
  onClose: () => void;
  category: Category | null;
}) {
  const [activeSecondary, setActiveSecondary] = React.useState(0);

  React.useEffect(() => {
    if (open) setActiveSecondary(0);
  }, [open, category?.key]);

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

  if (!category) return null;

  const secondaryTabs = category.secondaryTabs ?? [];
  const activeMedia =
    secondaryTabs.length > 0
      ? secondaryTabs[Math.min(activeSecondary, secondaryTabs.length - 1)]!.multimedia
      : category.multimedia;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="fullscreen-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-heading"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-background fixed inset-0 z-[100] overflow-y-auto"
        >
          <div className="mx-auto max-w-2xl px-5 py-8 pt-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="inline-flex h-[34px] w-[34px] items-center justify-center transition-opacity hover:opacity-70"
              >
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.8 12.2L12.2 21.8M12.2 12.2L21.8 21.8M33 17C33 25.8366 25.8366 33 17 33C8.16344 33 1 25.8366 1 17C1 8.16344 8.16344 1 17 1C25.8366 1 33 8.16344 33 17Z"
                    stroke="#015BC4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <span
              className="mt-2 inline-block rounded-[4px] px-3 py-1 text-[12px] font-bold tracking-wide text-white uppercase"
              style={{ backgroundColor: PILL_BG }}
            >
              {category.label.toUpperCase()}
            </span>
            <h2
              id="modal-heading"
              className="font-display mt-3 text-[40px] font-bold"
              style={{ color: HEADING_NAVY, lineHeight: "1.2" }}
            >
              {(category.heading ?? category.label).replace("|", " ")}
            </h2>
            {category.description ? (
              <p
                className="font-display mt-4 text-[16px] leading-[24px] font-medium"
                style={{ color: TEXT_GRIS_OSCURO }}
              >
                {category.description}
              </p>
            ) : null}

            <div className="mt-6 aspect-[480/270] w-full overflow-hidden rounded-[12px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`modal-media-${activeSecondary}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="h-full w-full"
                >
                  <MediaPreview data={activeMedia ?? {}} />
                </motion.div>
              </AnimatePresence>
            </div>

            {secondaryTabs.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {secondaryTabs.map(
                  (st: NonNullable<Category["secondaryTabs"]>[number], i: number) => {
                    const isActive = i === activeSecondary;
                    return (
                      <button
                        key={st.label ?? i}
                        type="button"
                        onClick={() => setActiveSecondary(i)}
                        className="font-display rounded-[4px] px-8 py-2 text-[14px] font-semibold text-white transition-colors duration-200"
                        style={{
                          backgroundColor: isActive ? PILL_BG : NAVY_DARK,
                          border: `1px solid ${isActive ? PILL_BG : NAVY_DARK}`,
                        }}
                      >
                        {st.label}
                      </button>
                    );
                  },
                )}
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
