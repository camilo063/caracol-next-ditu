/**
 * event-categories — vocabulario de categorías de los calendarios de eventos.
 *
 * El badge de cada evento mostraba texto libre: el editor lo tipeaba a mano en
 * cada tarjeta, con la variación de mayúsculas y nombres que eso implica. Acá
 * queda la lista cerrada que alimenta el dropdown del admin, más el escape
 * `custom` para cuando de verdad hace falta una etiqueta propia.
 *
 * Las etiquetas van en mayúsculas porque así se rendea el badge.
 */

/** Valor reservado: la etiqueta la escribe el editor a mano. */
export const CUSTOM_CATEGORY = "custom";

export const EVENT_CATEGORIES = [
  { value: "deportes", label: "DEPORTES" },
  { value: "futbol", label: "FÚTBOL" },
  { value: "ciclismo", label: "CICLISMO" },
  { value: "cultural", label: "CULTURAL" },
  { value: "entretenimiento", label: "ENTRETENIMIENTO" },
  { value: "musica", label: "MÚSICA" },
  { value: "noticias", label: "NOTICIAS" },
  { value: "especial", label: "ESPECIAL" },
  { value: "comercial", label: "COMERCIAL" },
  { value: "otro", label: "CATEGORÍA" },
  { value: CUSTOM_CATEGORY, label: "Personalizada (escribo la etiqueta)" },
] as const;

export type EventCategoryValue = (typeof EVENT_CATEGORIES)[number]["value"];

/** Opciones para un campo `select` de Payload. */
export const eventCategoryOptions = EVENT_CATEGORIES.map(({ value, label }) => ({
  value,
  label,
}));

const LABEL_BY_VALUE = new Map<string, string>(
  EVENT_CATEGORIES.map(({ value, label }) => [value, label]),
);

/**
 * Etiqueta que va en el badge.
 *
 * `customLabel` (el texto libre del evento) manda siempre que exista: cubre los
 * eventos cargados antes de que existiera el dropdown, que la migración dejó en
 * `custom` justamente para no cambiarles lo que hoy muestran en producción.
 */
export function resolveCategoryLabel(
  categoryKey: string | null | undefined,
  customLabel: string | null | undefined,
  fallback = "CATEGORÍA",
): string {
  const custom = customLabel?.trim();
  if (categoryKey === CUSTOM_CATEGORY) return custom || fallback;
  if (categoryKey) return LABEL_BY_VALUE.get(categoryKey) ?? (custom || fallback);
  return custom || fallback;
}
