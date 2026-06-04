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
        {/* Mini PatoDitu — Figma 775:4636: composite c+g+i+j, canvas 52×47px.
            Posición: absolute left-[130px] top-[-6px].
            Transform: scaleY(-1) rotate(-177.48deg). Solo tone="ditu". */}
        {isDitu && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: "130px",
              top: "-6px",
              width: "54px",
              height: "49px",
              transform: "scaleY(-1) rotate(-177.48deg)",
              transformOrigin: "center center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ditu/mascot/body.svg"
              alt=""
              className="absolute inset-0 h-full w-full"
              style={{ maxWidth: "none" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ditu/mascot/g.svg"
              alt=""
              className="absolute inset-0 h-full w-full"
              style={{ maxWidth: "none" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ditu/mascot/i.svg"
              alt=""
              className="absolute inset-0 h-full w-full"
              style={{ maxWidth: "none" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ditu/mascot/j.svg"
              alt=""
              className="absolute inset-0 h-full w-full"
              style={{ maxWidth: "none" }}
            />
          </div>
        )}

        {/* Botón flotante fixed.
            Ditu (Figma 775:4636): bg #77EDED text #12082D rounded-[12px] Ditu Display Bold 16px.
            Default Caracol (Figma 484:2246): bg #2862FF text white rounded-[4px] Montserrat SemiBold. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label={buttonLabel}
          aria-expanded={open}
          className={`inline-flex cursor-pointer items-center justify-center overflow-clip border border-solid shadow-md transition-all duration-200 active:scale-95 ${
            isDitu ? "rounded-[12px] hover:opacity-90" : "rounded-[4px] text-white"
          }`}
          style={
            isDitu
              ? {
                  backgroundColor: "#77EDED",
                  borderColor: "#77EDED",
                  color: "#12082D",
                  padding: "12px 48px",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: "24px",
                  fontFamily: "var(--font-ditu-display), system-ui, sans-serif",
                }
              : {
                  backgroundColor: open || hovered ? "#003CCA" : "#2862FF",
                  borderColor: open || hovered ? "#003CCA" : "#2862FF",
                  padding: "12px 48px",
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "24px",
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
      />
    </>
  );
}
