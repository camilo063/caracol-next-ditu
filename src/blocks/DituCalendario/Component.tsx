import { DituCalendarioBlock } from "@/components/marketing/ditu-calendario";
import type { DituCalendarioBlockProps } from "../types";

export function DituCalendarioBlockComponent(block: DituCalendarioBlockProps) {
  // Hoy en zona horaria de Colombia (en-CA → formato YYYY-MM-DD), para comparar
  // contra el ISO de los eventos sin cortar mal cerca de medianoche.
  const todayISO = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Bogota",
  });

  // Filtramos eventos vencidos: si `endDate` (ISO) es anterior a hoy, ya pasó y
  // no se muestra. Sin endDate válido → se conserva (no se oculta por las dudas).
  const upcoming = (block.events ?? []).filter(
    (e) => !e.endDate || e.endDate >= todayISO,
  );

  const events =
    upcoming.length > 0
      ? // Orden cronológico por `startDate` (ISO YYYY-MM-DD ordena lexicográfico
        // == cronológico), sin importar el orden del array en el CMS. Los que no
        // tengan fecha válida van al final.
        [...upcoming]
          .sort((a, b) => (a.startDate ?? "9999").localeCompare(b.startDate ?? "9999"))
          .map((e) => ({
            id: e.id ?? e.title,
            dateLabel: e.dateLabel,
            startDate: e.startDate,
            endDate: e.endDate,
            title: e.title,
            subtitle: e.subtitle ?? "",
            category: e.category ?? "Categoría",
            badgeColor: e.badgeColor ?? "#77EDED",
          }))
      : undefined;

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
