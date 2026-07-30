import { DituCalendarioBlock } from "@/components/marketing/ditu-calendario";
import { resolveCategoryLabel } from "@/lib/event-categories";
import { activeEventsSorted, eventDay, formatEventDateLabel } from "@/lib/event-dates";
import type { DituCalendarioBlockProps } from "../types";

export function DituCalendarioBlockComponent(block: DituCalendarioBlockProps) {
  // Misma regla que el calendario de Caracol Next (`@/lib/event-dates`): se
  // muestran solo los eventos vigentes —vencen al terminar su día de fin, en
  // hora de Colombia— y se listan del más cercano al más lejano, sin importar el
  // orden del array en el CMS.
  const upcoming = activeEventsSorted(block.events ?? [], (e) => ({
    start: e.startDate,
    end: e.endDate,
  }));

  // Sin eventos vigentes no se rendea el bloque. Antes se pasaba `undefined` y
  // el slider caía a su data de demostración: el día que venzan todos los
  // eventos cargados, producción mostraría FilBo/Carnaval/etc. como si fueran
  // reales. Mismo criterio que el calendario de Caracol Next.
  if (upcoming.length === 0) return null;

  const events = upcoming.map((e) => ({
    id: e.id ?? e.title,
    // El texto del badge de fecha se arma solo desde las fechas reales;
    // `dateLabel` queda como override para redacciones puntuales.
    dateLabel: e.dateLabel?.trim() || formatEventDateLabel(e.startDate, e.endDate),
    // El slider tipa estos campos como `YYYY-MM-DD`; Payload devuelve el
    // timestamp completo, así que lo recortamos al día (en UTC, que es el
    // día que eligió el editor).
    startDate: eventDay(e.startDate) ?? "",
    endDate: eventDay(e.endDate) ?? "",
    title: e.title,
    subtitle: e.subtitle ?? "",
    category: resolveCategoryLabel(e.categoryKey, e.category),
    badgeColor: e.badgeColor ?? "#77EDED",
  }));

  return (
    <DituCalendarioBlock
      anchorId={block.anchorId ?? undefined}
      stickerLabel={block.stickerLabel ?? undefined}
      heading={block.heading ?? undefined}
      subtitle={block.subtitle ?? undefined}
      cta={block.cta ?? undefined}
      events={events}
    />
  );
}
