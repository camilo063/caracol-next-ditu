"use client";

import * as React from "react";
import {
  Mail,
  MessageCircle,
  PhoneCall,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { RepresentativeCard } from "./representative-card";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  MessageCircle,
  PhoneCall,
  Sparkles,
  Mail,
};

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
 * Implementa la NOTA TÉCNICA Figma 899:4832.
 * - Botón flotante esquina inferior derecha (default).
 * - Click abre panel con representantes (mailto + wa.me).
 * - Fade-in con tw-animate-css (animate-in fade-in slide-in-from-bottom).
 */
export function FloatingContact({
  enabled = true,
  buttonLabel = "Quiero pautar",
  buttonIcon = "MessageCircle",
  panelHeading = "Habla con nuestro equipo",
  panelDescription = "Escríbenos por correo o WhatsApp. Te respondemos en menos de 24 h.",
  representatives,
  position = "bottom-right",
}: FloatingContactProps) {
  const [open, setOpen] = React.useState(false);
  const Icon = ICONS[buttonIcon] ?? MessageCircle;
  const positionClasses =
    position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6";

  if (!enabled || representatives.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="floating-contact-panel"
        className={cn(
          "fixed z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-lg",
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
          "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "transition-transform",
          positionClasses,
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{buttonLabel}</span>
      </button>

      {open ? (
        <div
          className="animate-in fade-in fixed inset-0 z-50 bg-black/40 backdrop-blur-sm duration-200"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <div
        id="floating-contact-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="floating-contact-heading"
        className={cn(
          "bg-card text-card-foreground border-border fixed z-50 w-[min(420px,92vw)] rounded-2xl border shadow-2xl",
          "animate-in fade-in slide-in-from-bottom-4 duration-300",
          positionClasses,
          open ? "block" : "hidden",
        )}
      >
        <div className="flex items-start justify-between gap-2 p-5 pb-3">
          <div>
            <h3 id="floating-contact-heading" className="font-display text-xl font-bold">
              {panelHeading}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">{panelDescription}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Cerrar panel de contacto"
            className="shrink-0"
          >
            <X />
          </Button>
        </div>
        <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto px-5 pb-5">
          {representatives.map((rep, i) => (
            <RepresentativeCard
              key={i}
              {...rep}
              layout="row"
              subject={`Contacto desde la web — ${rep.name}`}
              whatsappMessage="Hola, me interesa pautar en Caracol Next / Ditu."
            />
          ))}
        </div>
      </div>
    </>
  );
}
