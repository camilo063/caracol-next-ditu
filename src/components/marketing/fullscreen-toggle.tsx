"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

/** Icon "expand corners" — Figma 722:2582 (142:1460). 4 flechas en esquinas hacia afuera. */
function ExpandCornersIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 19 19"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.5 12.5L18.5 18.5M13.5 18.5H18.5V13.5M12.5 6.5L18.5 0.5M13.5 0.5H18.5V5.5M5.5 18.5H0.5V13.5M0.5 18.5L6.5 12.5M5.5 0.5H0.5V5.5M0.5 0.5L6.5 6.5" />
    </svg>
  );
}

/** Icon "compress corners" — inverso del expand. 4 flechas apuntando hacia adentro. */
function CompressCornersIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 19 19"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bottom-right: flechas hacia adentro (h-line + v-line en esquina interior + diagonal) */}
      <path d="M18.5 18.5L12.5 12.5M12.5 13.5V18.5M12.5 13.5H18.5" />
      {/* Top-right */}
      <path d="M18.5 0.5L12.5 6.5M12.5 5.5V0.5M12.5 5.5H18.5" />
      {/* Bottom-left */}
      <path d="M0.5 18.5L6.5 12.5M6.5 13.5V18.5M6.5 13.5H0.5" />
      {/* Top-left */}
      <path d="M0.5 0.5L6.5 6.5M6.5 5.5V0.5M6.5 5.5H0.5" />
    </svg>
  );
}

export interface FullscreenToggleProps {
  className?: string;
  /** "tone" del header — controla colores foreground/hover. */
  tone?: "light" | "dark";
}

/**
 * FullscreenToggle — modo presentación.
 *
 * - Click → entra/sale del fullscreen API.
 * - Tecla `Escape` la maneja el navegador (Fullscreen API nativo).
 * - Cambio de ícono con transición 200ms ease (AnimatePresence + motion.span).
 * - Tooltip: "Modo presentación" (off) / "Salir de presentación" (on).
 *
 * No bloquea si el navegador no soporta Fullscreen API (graceful fallback:
 * el botón queda visible pero el click no hace nada).
 */
export function FullscreenToggle({ className, tone = "light" }: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [supported, setSupported] = React.useState(true);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    setSupported(typeof document.documentElement.requestFullscreen === "function");
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggle = React.useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("[FullscreenToggle] no se pudo cambiar el modo", err);
    }
  }, []);

  if (!supported) return null;

  const label = isFullscreen ? "Salir de presentación" : "Modo presentación";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggle}
            aria-label={label}
            aria-pressed={isFullscreen}
            className={cn(
              "focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              tone === "dark"
                ? "text-white/85 hover:bg-white/10 hover:text-white"
                : "text-foreground/70 hover:bg-muted hover:text-foreground",
              className,
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isFullscreen ? (
                <motion.span
                  key="compress"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="inline-flex"
                >
                  <CompressCornersIcon className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="expand"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="inline-flex"
                >
                  <ExpandCornersIcon className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
