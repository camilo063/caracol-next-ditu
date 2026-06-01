"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * HomeContactModal — modal de contacto del Home (Figma 405:4864).
 *
 * Specs Figma exactas:
 *  - bg white, rounded-[4px], w-[256px], px-[16px] py-[24px],
 *    shadow [0px_4px_4px_0px_rgba(0,0,0,0.25)]
 *  - Top text: "Haz clic en alguno de nuestros representantes para contactarlos."
 *    Montserrat Light 13/lh-16 #464553 center
 *  - Por representante (gap-16):
 *    · Nombre: Montserrat Bold 16/lh-24 #464553
 *    · 2 botones row gap-8 flex-1:
 *      - Correo: bg #015BC4 border #015BC4 rounded-4 px-16 py-4 min-h-32
 *        Montserrat Bold 12/lh-16 white
 *      - WhatsApp: bg #25D366, icon 16px + texto Montserrat Bold 12 white
 *  - Close button: absolute top-0 right-0 size-32 (X icon)
 *
 * Backdrop + panel ambos con fade-in 300ms Framer Motion.
 */

const NAVY_DARK = "#003381";
const BLUE_MEDIUM = "#015BC4";
const GREY_DARK = "#464553";
const WHATSAPP_GREEN = "#25D366";

export interface ContactRepresentative {
  /** Nombre completo del representante. */
  name: string;
  /** Email para mailto:. */
  email: string;
  /** Número WhatsApp con código país (e.g. 573001234567). */
  whatsapp: string;
}

export interface HomeContactModalProps {
  open: boolean;
  onClose: () => void;
  representatives: ContactRepresentative[];
  /** Mensaje sobre el listado. */
  headline?: string;
}

export function HomeContactModal({
  open,
  onClose,
  representatives,
  headline = "Haz clic en alguno de nuestros representantes para contactarlos.",
}: HomeContactModalProps) {
  // Cerrar con tecla ESC
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          {/* Backdrop — fade-in 300ms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          {/* Modal panel — fade-in + slight scale */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-contact-modal-headline"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 z-50 w-[256px] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="relative flex flex-col items-center overflow-clip rounded-[4px] bg-white px-[16px] py-[24px]"
              style={{
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              }}
            >
              {/* Close button — Figma 405:4864: top-right 32x32 con color
                  #003381, hover bg sutil + leve scale (no opacity-70). */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute top-1 right-1 flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:bg-[#003381]/10"
                style={{ color: NAVY_DARK }}
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>

              {/* Content */}
              <div className="flex w-full flex-col items-center justify-center gap-[16px]">
                {/* Headline */}
                <p
                  id="home-contact-modal-headline"
                  className="w-full text-center text-[13px] font-light"
                  style={{
                    color: GREY_DARK,
                    lineHeight: "16px",
                  }}
                >
                  {headline}
                </p>

                {/* Representantes */}
                {representatives.map((rep) => (
                  <div
                    key={rep.email}
                    className="flex w-full flex-col items-start gap-[8px]"
                  >
                    {/* Nombre */}
                    <p
                      className="h-[24px] w-full text-[16px] font-bold"
                      style={{
                        color: GREY_DARK,
                        lineHeight: "24px",
                      }}
                    >
                      {rep.name}
                    </p>
                    {/* Botones Correo + WhatsApp */}
                    <div className="flex w-full items-center gap-[8px]">
                      <a
                        href={`mailto:${rep.email}`}
                        className="inline-flex flex-1 items-center justify-center overflow-clip rounded-[4px] border px-[16px] py-[4px] text-[12px] font-bold whitespace-nowrap text-white transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: BLUE_MEDIUM,
                          borderColor: BLUE_MEDIUM,
                          minHeight: "32px",
                          lineHeight: "16px",
                        }}
                      >
                        Correo
                      </a>
                      <a
                        href={`https://wa.me/${rep.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-[6px] overflow-clip rounded-[4px] border px-[16px] py-[4px] text-[12px] font-bold whitespace-nowrap text-white transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: WHATSAPP_GREEN,
                          borderColor: WHATSAPP_GREEN,
                          minHeight: "32px",
                          lineHeight: "16px",
                        }}
                      >
                        {/* WhatsApp icon inline SVG */}
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
