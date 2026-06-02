"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * HomeContactModal — popover anclado al botón trigger.
 * Posición: bottom = borde inferior del botón (crece hacia arriba).
 */

const BLUE_MEDIUM = "#015BC4";
const GREY_DARK = "#464553";
const WHATSAPP_GREEN = "#25D366";

export interface ContactRepresentative {
  name: string;
  email: string;
  whatsapp: string;
}

export interface HomeContactModalProps {
  open: boolean;
  onClose: () => void;
  representatives: ContactRepresentative[];
  headline?: string;
  position: { top?: number; bottom?: number; left: number; width: number };
}

export function HomeContactModal({
  open,
  onClose,
  representatives,
  headline = "Haz clic en alguno de nuestros representantes para contactarlos.",
  position,
}: HomeContactModalProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={popoverRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-popover-headline"
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-50"
          style={{
            top: position.top ?? "auto",
            bottom: position.bottom ?? "auto",
            left: position.left,
            width: position.width,
          }}
        >
          <div
            className="relative flex flex-col items-center overflow-clip rounded-[4px] bg-white px-4 py-6 pt-8"
            style={{
              boxShadow: "0px 8px 24px 0px rgba(0,0,0,0.18)",
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            }}
          >
            {/* Botón cerrar — icono circular con X */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-2 right-2 flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:bg-[#015BC4]/8"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M11.15 6.35L6.35 11.15M6.35 6.35L11.15 11.15M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z"
                  stroke="#015BC4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex w-full flex-col items-center justify-center gap-[16px]">
              <p
                id="contact-popover-headline"
                className="w-full text-center text-[13px] font-light"
                style={{ color: GREY_DARK, lineHeight: "16px" }}
              >
                {headline}
              </p>

              {representatives.map((rep) => (
                <div
                  key={rep.email}
                  className="flex w-full flex-col items-start gap-[8px]"
                >
                  <p
                    className="h-[24px] w-full text-[16px] font-bold"
                    style={{ color: GREY_DARK, lineHeight: "24px" }}
                  >
                    {rep.name}
                  </p>
                  <div className="flex w-full items-center gap-[8px]">
                    {/* Correo */}
                    <a
                      href={`mailto:${rep.email}`}
                      className="inline-flex flex-1 items-center justify-center rounded-[4px] border border-[#015BC4] bg-[#015BC4] px-[16px] py-[4px] text-[12px] font-bold whitespace-nowrap text-white [transition:background-color_0.25s_ease-in-out,color_0.25s_ease-in-out,box-shadow_0.25s_ease-in-out] hover:bg-white hover:text-[#015BC4] hover:shadow-sm hover:shadow-[#015BC4]/20 active:scale-[0.97]"
                      style={{ minHeight: "32px", lineHeight: "16px" }}
                    >
                      Correo
                    </a>
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${rep.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex flex-1 items-center justify-center gap-[6px] rounded-[4px] border border-[#25D366] bg-[#25D366] px-[16px] py-[4px] text-[12px] font-bold whitespace-nowrap text-white [transition:background-color_0.25s_ease-in-out,color_0.25s_ease-in-out,box-shadow_0.25s_ease-in-out] hover:bg-white hover:text-[#25D366] hover:shadow-sm hover:shadow-[#25D366]/20 active:scale-[0.97]"
                      style={{ minHeight: "32px", lineHeight: "16px" }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 shrink-0"
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
      ) : null}
    </AnimatePresence>
  );
}
