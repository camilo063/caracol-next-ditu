"use client";

import * as React from "react";

import { HomeContactModal, type ContactRepresentative } from "./home-contact-modal";

export interface FloatingContactRep {
  name: string;
  role?: string | null;
  email: string;
  whatsapp: string;
  photo?: { url?: string | null; alt?: string | null } | number | string | null;
}

export interface FloatingContactProps {
  enabled?: boolean;
  buttonLabel?: string;
  buttonIcon?: string;
  panelHeading?: string;
  panelDescription?: string;
  representatives: FloatingContactRep[];
  position?: "bottom-right" | "bottom-left";
  /** "ditu" aplica estilo Ditu (#77EDED bg, #12082D texto, rounded-[12px], fuente Ditu Display Bold + mini PatoDitu encima).
   *  Default undefined = estilo Caracol (#2862FF). */
  tone?: "ditu";
}

/**
 * FloatingContact — Botón flotante de contacto (Spec Camilo + Figma 405:4865 / 775:4636).
 *
 * Spec usuario (mayo 2026):
 *  - Botón siempre visible bottom-right (fixed) — sigue scroll
 *  - Click abre PANEL con representantes (mailto: + https://wa.me/)
 *  - Cerrar: X esquina top-right del panel | click overlay | ESC
 *  - Fade-in 300ms ease (Framer Motion)
 *  - Representantes desde CMS (repetibles)
 *  - tone="ditu": bg #77EDED, texto #12082D, rounded-[12px], Ditu Display Bold 16px,
 *    mini PatoDitu (c+g+i+j) encima: absolute left-[130px] top-[-6px] w-[54px] h-[49px],
 *    transform scaleY(-1) rotate(-177.48deg). Figma 775:4636.
 *
 * El PANEL es idéntico al modal Home (Figma 405:4864/4865), por lo que
 * reutilizamos HomeContactModal directamente.
 */
export function FloatingContact({
  enabled = true,
  buttonLabel = "Contáctanos",
  representatives,
  position = "bottom-right",
  tone,
}: FloatingContactProps) {
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const positionClasses =
    position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6";

  if (!enabled || representatives.length === 0) return null;

  const getModalPosition = () => {
    if (!wrapperRef.current) return undefined;
    const rect = wrapperRef.current.getBoundingClientRect();
    const modalWidth = Math.max(rect.width, 280);
    return {
      bottom: window.innerHeight - rect.top + 8,
      left: rect.right - modalWidth,
      width: modalWidth,
    };
  };

  // Normalize al shape de HomeContactModal.
  const reps: ContactRepresentative[] = representatives.map((r) => ({
    name: r.name,
    email: r.email,
    whatsapp: r.whatsapp,
  }));

  const isDitu = tone === "ditu";

  return (
    <>
      {/* Wrapper relative para el mini PatoDitu absoluto (solo Ditu tone) */}
      <div
        ref={wrapperRef}
        className={`fixed z-40 ${positionClasses}`}
        style={{ position: "fixed" }}
      >
        {/* PatoDitu — z-10 para que las patas queden sobre el botón. Solo cuando modal cerrado. */}
        {isDitu && !open && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/ditu/mascot/pato-ditu.svg"
            alt=""
            className="pointer-events-none absolute -top-11.5 right-0 z-10"
            width={52}
            height={47}
          />
        )}

        {/* Botón flotante fixed.
            Ditu: bg #77EDED text #12082D rounded-[12px], hover/active #8232F0 text white.
            Default Caracol: bg #2862FF text white rounded-[4px], hover #003CCA. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label={buttonLabel}
          aria-expanded={open}
          className={`inline-flex cursor-pointer items-center justify-center overflow-clip border border-solid px-5 py-2 text-[13px] leading-5 shadow-md transition-all duration-200 active:scale-95 sm:px-12 sm:py-3 sm:text-[16px] sm:leading-6 ${isDitu ? "rounded-[12px]" : "rounded-[4px] text-white"}`}
          style={
            isDitu
              ? {
                  backgroundColor: open || hovered ? "#8232F0" : "#77EDED",
                  borderColor: open || hovered ? "#8232F0" : "#77EDED",
                  color: open || hovered ? "white" : "#12082D",
                  fontWeight: 700,
                  fontFamily: "var(--font-ditu-display), system-ui, sans-serif",
                  transition:
                    "background-color 0.25s ease-in-out, border-color 0.25s ease-in-out, color 0.25s ease-in-out",
                }
              : {
                  backgroundColor: open || hovered ? "#003CCA" : "#2862FF",
                  borderColor: open || hovered ? "#003CCA" : "#2862FF",
                  fontWeight: 600,
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                }
          }
        >
          {buttonLabel}
        </button>
      </div>

      {/* Panel contacto — reusa HomeContactModal (Figma 405:4865 = 405:4864) */}
      <HomeContactModal
        open={open}
        onClose={() => setOpen(false)}
        representatives={reps}
        position={open ? getModalPosition() : undefined}
        tone={tone}
        topRightDecoration={
          isDitu ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/ditu/mascot/pato-ditu.svg" alt="" width={52} height={47} />
          ) : undefined
        }
      />
    </>
  );
}
