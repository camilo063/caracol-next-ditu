import { hexColorOr } from "@/lib/color";
import type { EventCategory } from "@/payload-types";

/**
 * event-categories — cómo se resuelve el badge de un evento de calendario.
 *
 * La categoría es un documento de la colección `event-categories`, editable
 * desde el admin: ahí viven el nombre, y el color y el diseño de cada landing.
 * El evento solo la referencia, y la categoría manda sobre texto, color y forma.
 *
 * Las seis variantes del design system salen de combinar color y forma: cuatro
 * de relleno y dos de contorno en Ditu, seis de relleno en Caracol Next. Las dos
 * formas tienen relleno opaco —el contorno es blanco, no transparente— y el
 * color del texto no es un campo: en relleno se deduce del fondo (blanco u
 * oscuro) y en contorno es el mismo color del borde. Esa regla reproduce las
 * seis variantes exactamente con un solo color por landing.
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
  /**
   * `solid` pinta el fondo con el color; `outline` deja el fondo blanco y pone
   * el color en el borde y el texto. Las dos formas tienen relleno opaco: en el
   * design system no hay ninguna variante de badge con fondo transparente.
   */
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
  // El diseño del badge es por landing: el design system de Ditu tiene dos
  // variantes de contorno (Categoría 04 y 06) y el de Caracol Next ninguna.
  const style = landing === "next" ? doc?.styleNext : doc?.styleDitu;

  return {
    // `?.trim() ||` y no `??`: Payload guarda cadena vacía, no NULL, cuando se
    // limpia un campo de texto, y con `??` un campo vaciado seguiría ganando.
    label: doc?.name?.trim() || FALLBACK.label,
    // El color se normaliza acá y no solo al guardarlo: los que ya están en la
    // base sin `#` tienen que verse bien apenas salga el deploy, sin que nadie
    // vuelva a abrir la categoría. Y un hex inválido cae al color por defecto en
    // vez de llegar al `style` y dejar el badge sin fondo.
    color: hexColorOr(color, FALLBACK[landing]),
    style: style === "outline" ? "outline" : "solid",
  };
}
