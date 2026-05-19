"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/hooks/use-media-query";
import type { BrandedContentBlockProps } from "../types";
import { MediaPreview } from "./MediaPreview";

type Category = NonNullable<BrandedContentBlockProps["categories"]>[number];

/**
 * BrandedContentBlock — matching Figma "Branded Content" (Caracol Next).
 *
 * Desktop (md+):
 *  - 2-col. Izquierda: título + descripción + tabs principales.
 *  - Derecha: MediaPreview con overlays + secondary tabs debajo (cambian solo
 *    el multimedia).
 *  - Main tab change → Fade 300ms (Framer Motion). Cambia ambas columnas.
 *  - Secondary tab change → Fade 200ms (Framer Motion). Cambia solo el preview.
 *
 * Mobile (<md):
 *  - Tabs principales = slider Embla con focus center + flechas prev/next.
 *  - Cada slide tiene "Ver más" → abre modal fullscreen con fade+scale 300ms.
 *  - Modal: heading + description + MediaPreview + secondary tabs scroll horizontal.
 */
export function BrandedContentBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  categories,
  defaultIndex,
}: BrandedContentBlockProps) {
  const isMobile = useIsMobile();
  if (!categories || categories.length === 0) return null;

  const safeDefault = Math.min(Math.max(defaultIndex ?? 0, 0), categories.length - 1);
  return (
    <section id={anchorId ?? "branded"} className="py-6 sm:py-8 lg:py-10">
      <div className="w-full overflow-hidden rounded-[2rem] bg-[#FAFAFA] py-14 sm:rounded-[2.5rem] sm:py-16 lg:py-20">
        <Container size="xl">
          {eyebrow ? (
            <p className="text-fluid-tag text-primary font-bold tracking-[0.18em] uppercase">
              {eyebrow}
            </p>
          ) : null}
          {heading ? (
            <h2 className="text-muted-foreground text-fluid-tag mt-1 font-semibold">
              {heading}
            </h2>
          ) : null}
          {description ? (
            <p className="text-muted-foreground text-fluid-body mt-2 max-w-prose">
              {description}
            </p>
          ) : null}

          {isMobile ? (
            <MobileSlider categories={categories} defaultIndex={safeDefault} />
          ) : (
            <DesktopLayout categories={categories} defaultIndex={safeDefault} />
          )}
        </Container>
      </div>
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

  // Cuando cambia el main, reset secondary al 0.
  React.useEffect(() => {
    setActiveSecondary(0);
  }, [activeMain]);

  const current = categories[activeMain]!;
  const secondaryTabs = current.secondaryTabs ?? [];
  const activeMedia =
    secondaryTabs.length > 0
      ? secondaryTabs[Math.min(activeSecondary, secondaryTabs.length - 1)]!.multimedia
      : current.multimedia;

  return (
    <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* LEFT — fade 300ms cuando cambia main */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`main-${activeMain}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h3 className="font-display text-fluid-h1 text-primary leading-[1.05] font-black">
              {current.heading}
            </h3>
            {current.description ? (
              <p className="text-muted-foreground text-fluid-body mt-4 leading-relaxed">
                {current.description}
              </p>
            ) : null}

            {/* Main tabs (pills) */}
            <div className="mt-8 flex flex-wrap gap-3">
              {categories.map((cat, i) => {
                const isActive = i === activeMain;
                return (
                  <button
                    key={cat.key ?? cat.label}
                    type="button"
                    onClick={() => setActiveMain(i)}
                    className={cn(
                      "rounded-md border-2 px-5 py-2.5 text-sm font-bold transition-colors",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                      isActive
                        ? "bg-primary border-primary text-white"
                        : "border-primary text-primary hover:bg-primary/5 bg-white",
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RIGHT — multimedia. Fade 200ms cuando cambia main O secondary. */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`media-${activeMain}-${activeSecondary}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <MediaPreview data={activeMedia ?? {}} />
            {secondaryTabs.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {secondaryTabs.map((st, i) => {
                  const isActive = i === activeSecondary;
                  return (
                    <button
                      key={st.label ?? i}
                      type="button"
                      onClick={() => setActiveSecondary(i)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-xs font-bold transition-colors",
                        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                        isActive
                          ? "border-primary bg-primary text-white"
                          : "border-primary/40 text-primary hover:bg-primary/5 bg-white",
                      )}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
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
    loop: false,
    startIndex: defaultIndex,
    containScroll: "trimSnaps",
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
                className={cn(
                  "min-w-0 shrink-0 grow-0 basis-[80%] px-2 transition-all duration-300",
                  isActive ? "scale-100 opacity-100" : "scale-90 opacity-60",
                )}
              >
                <div className="border-border bg-card flex h-full flex-col items-center gap-5 rounded-2xl border p-6 text-center">
                  <span className="bg-primary text-primary-foreground rounded-md px-3 py-1 text-[10px] font-bold tracking-wide uppercase">
                    {cat.label.toUpperCase()}
                  </span>
                  <h3 className="font-display text-fluid-h2 text-primary font-black">
                    {cat.heading}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setModalIndex(i)}
                    className="bg-primary mt-2 rounded-md px-6 py-2.5 text-sm font-bold text-white"
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
            "border-primary text-primary inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition-opacity",
            !canPrev && "cursor-not-allowed opacity-30",
          )}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canNext}
          aria-label="Siguiente"
          className={cn(
            "border-primary text-primary inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition-opacity",
            !canNext && "cursor-not-allowed opacity-30",
          )}
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

  // Reset secondary tab cuando se abre el modal con otra categoría.
  React.useEffect(() => {
    if (open) setActiveSecondary(0);
  }, [open, category?.key]);

  // ESC close.
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    // body scroll lock.
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
          <div className="mx-auto max-w-2xl px-5 py-8">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="border-border text-foreground hover:bg-muted inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <span className="bg-primary text-primary-foreground mt-2 inline-block rounded-md px-3 py-1 text-[10px] font-bold tracking-wide uppercase">
              {category.label.toUpperCase()}
            </span>
            <h2
              id="modal-heading"
              className="font-display text-fluid-h1 text-primary mt-3 font-black"
            >
              {category.heading}
            </h2>
            {category.description ? (
              <p className="text-muted-foreground text-fluid-body mt-4 leading-relaxed">
                {category.description}
              </p>
            ) : null}

            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`modal-media-${activeSecondary}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <MediaPreview data={activeMedia ?? {}} />
                </motion.div>
              </AnimatePresence>
            </div>

            {secondaryTabs.length > 0 ? (
              <div className="-mx-5 mt-5 [scrollbar-width:none] overflow-x-auto px-5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex w-max gap-2">
                  {secondaryTabs.map((st, i) => {
                    const isActive = i === activeSecondary;
                    return (
                      <button
                        key={st.label ?? i}
                        type="button"
                        onClick={() => setActiveSecondary(i)}
                        className={cn(
                          "rounded-md border px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors",
                          isActive
                            ? "border-primary bg-primary text-white"
                            : "border-primary/40 text-primary hover:bg-primary/5 bg-white",
                        )}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
