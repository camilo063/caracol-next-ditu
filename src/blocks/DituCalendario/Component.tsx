import { DituCalendarioBlock } from "@/components/marketing/ditu-calendario";
import type { DituCalendarioBlockProps } from "../types";

export function DituCalendarioBlockComponent(block: DituCalendarioBlockProps) {
  const events =
    block.events && block.events.length > 0
      ? block.events.map((e) => ({
          id: e.id ?? e.title,
          dateLabel: e.dateLabel,
          startDate: e.startDate,
          endDate: e.endDate,
          title: e.title,
          subtitle: e.subtitle ?? "",
          category: e.category ?? "Categoría",
          badgeVariant: (e.badgeVariant ?? "cyan") as
            | "cyan"
            | "violet"
            | "navy"
            | "white",
        }))
      : undefined;

  return <DituCalendarioBlock anchorId={block.anchorId ?? undefined} events={events} />;
}
