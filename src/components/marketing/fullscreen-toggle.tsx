"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minimize2 } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

/** Icon "expand corners" — Figma 430:529. 4 flechas en esquinas hacia afuera.
 *  SVG extraído directamente del design system. */
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
                  key="min"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="inline-flex"
                >
                  <Minimize2 className="h-4 w-4" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="max"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
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
