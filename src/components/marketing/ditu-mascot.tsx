import React from "react";
import { cn } from "@/lib/utils";

/**
 * DituMascot — placeholder SVG del pato/duende del Figma `ditu.png`.
 * Se reemplaza por el SVG real cuando el cliente lo suba a Payload Media
 * y enlace por slug en el FloatingContact / sección "¿Hablamos?".
 */
export function DituMascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      className={cn("h-40 w-auto", className)}
      role="img"
      aria-label="Mascota Ditu — placeholder"
    >
      <defs>
        <linearGradient id="ditu-mascot-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8232F0" />
          <stop offset="100%" stopColor="#561BDB" />
        </linearGradient>
        <linearGradient id="ditu-mascot-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#77EDED" />
          <stop offset="100%" stopColor="#3FBDB9" />
        </linearGradient>
      </defs>
      {/* Cuerpo principal */}
      <ellipse cx="100" cy="140" rx="68" ry="78" fill="url(#ditu-mascot-body)" />
      {/* Panza */}
      <ellipse cx="100" cy="160" rx="40" ry="50" fill="url(#ditu-mascot-belly)" />
      {/* Cabeza */}
      <circle cx="100" cy="70" r="48" fill="url(#ditu-mascot-body)" />
      {/* Ojos */}
      <circle cx="82" cy="64" r="9" fill="white" />
      <circle cx="118" cy="64" r="9" fill="white" />
      <circle cx="82" cy="66" r="4" fill="#1F1647" />
      <circle cx="118" cy="66" r="4" fill="#1F1647" />
      {/* Pico */}
      <path d="M88 84 Q100 96 112 84 Q112 92 100 96 Q88 92 88 84 Z" fill="#FFC200" />
      {/* Patas */}
      <ellipse cx="78" cy="218" rx="14" ry="6" fill="#FFC200" />
      <ellipse cx="122" cy="218" rx="14" ry="6" fill="#FFC200" />
      {/* Pluma destacada */}
      <path d="M68 36 Q60 18 84 22 Q70 30 70 40 Z" fill="#77EDED" opacity="0.8" />
    </svg>
  );
}
