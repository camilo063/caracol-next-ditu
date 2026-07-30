import type { EventCategory } from "@/payload-types";

/**
 * event-categories — cómo se resuelve el badge de un evento de calendario.
 *
 * La categoría es un documento de la colección `event-categories`, editable
 * desde el admin: ahí viven el nombre, el color por landing y el estilo. El
 * evento solo la referencia, y la categoría manda sobre texto Y color.
 *
 * Que mande la categoría y punto —sin campos de excepción por evento— es
 * deliberado. La versión anterior tenía un texto y un color propios en cada
 * evento que le ganaban a la categoría, y eso produjo exactamente los dos bugs
 * que reportó el cliente: elegía una categoría y el badge no cambiaba de texto
 * (le ganaba el texto guardado) ni de color (le ganaba el color guardado). Si
 * hace falta un badge distinto, se crea una categoría: para eso son
 * administrables.
 *
 * Las columnas viejas de esos campos siguen en la base sin que nadie las lea,
 * a propósito: son la red que permite revertir la migración.
 */

/** La relación puede llegar poblada o como id, según el `depth` de la query. */
export type EventCategoryRef = number | EventCategory | null | undefined;

/** Qué se muestra mientras un evento no tenga categoría asignada. */
const FALLBACK = {
  label: "CATEGORÍA",
  next: "#2862FF",
  ditu: "#77EDED",
} as const;

export interface ResolvedBadge {
  /** Texto del badge. */
  label: string;
  /** Color del badge para esta landing. */
  color: string;
  /** `outline` pinta borde y texto con el color, sin fondo. */
  style: "solid" | "outline";
}

/** Resuelve texto, color y estilo del badge de un evento. */
export function resolveEventBadge(
  category: EventCategoryRef,
  landing: "next" | "ditu",
): ResolvedBadge {
  // Con `depth` bajo la relación llega como id: sin el documento no hay nada
  // que leer, así que se cae al genérico.
  const doc = category && typeof category === "object" ? category : null;
  const color = landing === "next" ? doc?.colorNext : doc?.colorDitu;

  return {
    // `?.trim() ||` y no `??`: Payload guarda cadena vacía, no NULL, cuando se
    // limpia un campo de texto, y con `??` un campo vaciado seguiría ganando.
    label: doc?.name?.trim() || FALLBACK.label,
    color: color?.trim() || FALLBACK[landing],
    style: doc?.style === "outline" ? "outline" : "solid",
  };
}
