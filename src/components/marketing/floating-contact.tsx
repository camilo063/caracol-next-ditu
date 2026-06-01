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
}

/**
 * FloatingContact — Botón flotante de contacto (Spec Camilo + Figma 405:4865).
 *
 * Spec usuario (mayo 2026):
 *  - Botón siempre visible bottom-right (fixed) — sigue scroll
 *  - Click abre PANEL con representantes (mailto: + https://wa.me/)
 *  - Cerrar: X esquina top-right del panel | click overlay | ESC
 *  - Fade-in 300ms ease (Framer Motion)
 *  - Representantes desde CMS (repetibles)
 *  - Estilo del BOTÓN igual al "Contáctanos" del AudienceNetworks block:
 *    bg #00ACFF, w-188 h-48, Montserrat SemiBold 16 white, rounded
 *
 * El PANEL es idéntico al modal Home (Figma 405:4864/4865), por lo que
 * reutilizamos HomeContactModal directamente.
 */
export function FloatingContact({
  enabled = true,
  buttonLabel = "Contáctanos",
  representatives,
  position = "bottom-right",
}: FloatingContactProps) {
  const [open, setOpen] = React.useState(false);

  const positionClasses =
    position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6";

  if (!enabled || representatives.length === 0) return null;

  // Normalize al shape de HomeContactModal.
  const reps: ContactRepresentative[] = representatives.map((r) => ({
    name: r.name,
    email: r.email,
    whatsapp: r.whatsapp,
  }));

  return (
    <>
      {/* Botón flotante fixed — Figma 484:2246 (btn_contancto).
          Color CaracolTV/Digital/Azul Claro #2862FF (no #00ACFF) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={buttonLabel}
        aria-expanded={open}
        className={`fixed z-40 inline-flex cursor-pointer items-center justify-center overflow-clip rounded-[4px] border border-solid text-white shadow-md transition-all duration-200 hover:bg-[#1a4ee5] hover:shadow-lg hover:shadow-[#2862FF]/40 active:scale-95 ${positionClasses}`}
        style={{
          backgroundColor: "#2862FF",
          borderColor: "#2862FF",
          padding: "12px 48px",
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: "24px",
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        }}
      >
        {buttonLabel}
      </button>

      {/* Panel contacto — reusa HomeContactModal (Figma 405:4865 = 405:4864) */}
      <HomeContactModal
        open={open}
        onClose={() => setOpen(false)}
        representatives={reps}
      />
    </>
  );
}
