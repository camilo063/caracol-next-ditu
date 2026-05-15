import { Mail, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar } from "./avatar";
import type { MediaLike } from "@/lib/media";

export interface RepresentativeCardProps {
  name: string;
  role?: string | null;
  email: string;
  whatsapp: string;
  photo?: MediaLike | number | string | null;
  layout?: "stacked" | "row";
  subject?: string;
  whatsappMessage?: string;
}

/**
 * Card de representante comercial — botones mailto + wa.me.
 * Layout "stacked" (vertical) por defecto, "row" para sidebar densa.
 */
export function RepresentativeCard({
  name,
  role,
  email,
  whatsapp,
  photo,
  layout = "stacked",
  subject = "Quiero pautar en Caracol Next/Ditu",
  whatsappMessage = "Hola, me interesa pautar en su ecosistema.",
}: RepresentativeCardProps) {
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  const wa = `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  if (layout === "row") {
    return (
      <div className="border-border bg-card flex items-center gap-3 rounded-lg border p-3">
        <Avatar media={photo} name={name} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{name}</p>
          {role ? <p className="text-muted-foreground truncate text-xs">{role}</p> : null}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button size="icon" variant="ghost" asChild aria-label={`Email a ${name}`}>
            <a href={mailto}>
              <Mail />
            </a>
          </Button>
          <Button size="icon" variant="ghost" asChild aria-label={`WhatsApp a ${name}`}>
            <a href={wa} target="_blank" rel="noopener noreferrer">
              <MessageCircle />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-border bg-card flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
      <Avatar media={photo} name={name} size={80} />
      <div>
        <p className="text-base font-bold">{name}</p>
        {role ? <p className="text-muted-foreground text-sm">{role}</p> : null}
      </div>
      <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Button variant="outline" size="sm" asChild>
          <a href={mailto}>
            <Mail />
            <span>Correo</span>
          </a>
        </Button>
        <Button variant="default" size="sm" asChild>
          <a href={wa} target="_blank" rel="noopener noreferrer">
            <MessageCircle />
            <span>WhatsApp</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
