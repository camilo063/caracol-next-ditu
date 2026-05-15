import Link from "next/link";

import { Button, Container, Section } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { KeyMomentsBlockProps } from "../types";

const CATEGORY_COLORS: Record<string, string> = {
  sports: "#015BC4",
  entertainment: "#A139C6",
  news: "#FF6F00",
  special: "#FFC200",
  other: "#5C6BC0",
};

const CATEGORY_LABELS: Record<string, string> = {
  sports: "DEPORTES",
  entertainment: "ENTRETENIMIENTO",
  news: "NOTICIAS",
  special: "ESPECIAL",
  other: "OTRO",
};

/**
 * KeyMomentsCalendarBlock — grid 4-col de tarjetas con badge de categoría color.
 * Matching Figma `caracol-next.png`: bloque azul con cards blancas.
 */
export function KeyMomentsCalendarComponent({
  anchorId,
  heading,
  description,
  events,
  displayMode,
}: KeyMomentsBlockProps) {
  if (!events || events.length === 0) return null;
  const mode = displayMode ?? "grid";

  return (
    <Section
      id={anchorId ?? "momentos"}
      padding="lg"
      className="text-white"
      style={{
        background: "linear-gradient(180deg, #015BC4 0%, #003CCA 50%, #003380 100%)",
      }}
    >
      <Container size="xl">
        <h2 className="font-display text-3xl font-black sm:text-4xl">
          {heading || "Calendario"}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-base text-white/80">{description}</p>
        ) : null}

        {mode === "list" ? (
          <ul className="mt-10 divide-y divide-white/20 border-y border-white/20">
            {events.map((e) => (
              <li
                key={e.id ?? e.name}
                className="grid items-center gap-2 py-5 md:grid-cols-[200px_1fr_auto]"
              >
                <span className="font-display text-xl font-extrabold">{e.name}</span>
                <p className="text-sm text-white/80">{e.description}</p>
                {e.cta?.label && e.cta?.href ? (
                  <Link
                    href={e.cta.href}
                    className="text-sm font-bold text-white underline"
                  >
                    {e.cta.label} →
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        ) : mode === "timeline" ? (
          <div className="-mx-4 mt-10 overflow-x-auto px-4">
            <div className="flex min-w-max gap-4 pb-4">
              {events.map((e) => (
                <EventGridCard key={e.id ?? e.name} event={e} className="w-[280px]" />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((e) => (
              <EventGridCard key={e.id ?? e.name} event={e} />
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-base font-semibold">
            ¡Asegura la presencia de tu marca en los eventos más importantes del país!
          </p>
          <p className="text-sm text-white/80">
            Contáctanos ahora y diseñemos juntos tu participación.
          </p>
          <Button
            variant="default"
            size="lg"
            asChild
            className="bg-white text-[#003380] hover:bg-white/90"
          >
            <Link href="#contacto">Contáctanos</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

type EventItem = NonNullable<KeyMomentsBlockProps["events"]>[number];

function EventGridCard({ event, className }: { event: EventItem; className?: string }) {
  const cat = event.category ?? "other";
  const color = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.other;
  return (
    <div
      className={cn(
        "bg-card text-card-foreground border-border rounded-xl border p-5 shadow-sm",
        className,
      )}
    >
      <span
        className="inline-block rounded-md px-2 py-1 text-[10px] font-bold tracking-wide text-white uppercase"
        style={{ backgroundColor: color }}
      >
        {CATEGORY_LABELS[cat] ?? "OTRO"}
      </span>
      <h3 className="font-display mt-3 text-lg leading-tight font-extrabold">
        {event.name}
      </h3>
      {event.description ? (
        <p className="text-muted-foreground mt-2 line-clamp-3 text-xs leading-relaxed">
          {event.description}
        </p>
      ) : null}
    </div>
  );
}
