import type { EventCategory } from "@/payload-types";

/**
 * event-categories — cómo se resuelve el badge de un evento de calendario.
 *
 * La categoría es un documento de la colección `event-categories`, editable
 * desde el admin: ahí viven el nombre, el color por landing y el estilo. El
 * evento solo la referencia.
 *
 * Cada evento conserva además dos campos de excepción —un texto y un color
 * propios— para el caso puntual en que un badge deba salirse de su categoría.
 * Cuando están vacíos, que es lo normal, manda la categoría.
 */

/** La relación puede llegar poblada o como id, según el `depth` de la query. */
export type EventCategoryRef = number | EventCategory | null | undefined;

/** Paleta por defecto cuando el evento no tiene categoría asignada. */
const FALLBACK = {
  label: "CATEGORÍA",
  next: "#2862FF",
  ditu: "#77EDED",
} as const;

function asDoc(ref: EventCategoryRef): EventCategory | null {
  return ref && typeof ref === "object" ? ref : null;
}

export interface ResolvedBadge {
  /** Texto del badge. */
  label: string;
  /** Color del badge para esta landing. */
  color: string;
  /** `outline` pinta borde y texto con el color, sin fondo. */
  style: "solid" | "outline";
}

/**
 * Resuelve texto, color y estilo del badge de un evento.
 *
 * `overrideLabel` y `overrideColor` son los campos de excepción del evento.
 * Se comparan con `?.trim() ||` y no con `??` a propósito: Payload guarda
 * cadena vacía —no NULL— cuando el editor limpia un campo de texto, así que
 * `??` haría que un campo vaciado le siguiera ganando a la categoría.
 */
export function resolveEventBadge(
  category: EventCategoryRef,
  landing: "next" | "ditu",
  overrideLabel?: string | null,
  overrideColor?: string | null,
): ResolvedBadge {
  const doc = asDoc(category);
  const colorDeCategoria =
    landing === "next" ? doc?.colorNext?.trim() : doc?.colorDitu?.trim();

  return {
    label: overrideLabel?.trim() || doc?.name?.trim() || FALLBACK.label,
    color: overrideColor?.trim() || colorDeCategoria || FALLBACK[landing],
    style: doc?.style === "outline" ? "outline" : "solid",
  };
}
