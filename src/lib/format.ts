/**
 * Format helpers — números, fechas, monedas.
 * Locale es-CO por defecto (puntos de millar y coma decimal).
 */

/**
 * Formatea un número grande como "3M", "1.2K", "500" según magnitud.
 * Para mostrar audiencias y followers en hero/cards.
 */
export function formatCompact(value: number, locale = "es-CO"): string {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Número con separador de miles. */
export function formatNumber(value: number, locale = "es-CO"): string {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat(locale).format(value);
}

/** Porcentaje. `12.4` → "12.4%". `null/NaN` → "—". */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Las fechas de eventos son días calendario, no instantes: se formatean en UTC
 * para que el día mostrado sea el que el editor eligió y para que el server
 * (Vercel corre en UTC) y el navegador rendeen exactamente lo mismo.
 *
 * Sin esto había hydration mismatch real en los bloques "use client": una fecha
 * guardada como `2026-08-01T00:00:00Z` (data de seed) la rendea el server como
 * "1 de ago" y el navegador colombiano la re-rendeaba como "31 de jul".
 *
 * Ver `@/lib/event-dates` — misma semántica que usan el filtro y el orden.
 */
const DAY_TIME_ZONE = "UTC";

/** Fecha en formato "15 mar 2026". */
export function formatDate(
  date: string | Date | null | undefined,
  locale = "es-CO",
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: DAY_TIME_ZONE,
  }).format(d);
}

/** Rango de fechas. Si end existe y difiere → "15 mar – 20 abr 2026". */
export function formatDateRange(
  start: string | Date | null | undefined,
  end?: string | Date | null,
  locale = "es-CO",
): string {
  if (!start) return "";
  const s = typeof start === "string" ? new Date(start) : start;
  if (Number.isNaN(s.getTime())) return "";
  if (!end) return formatDate(s, locale);
  const e = typeof end === "string" ? new Date(end) : end;
  if (Number.isNaN(e.getTime()) || e.getTime() === s.getTime())
    return formatDate(s, locale);

  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  const startFmt = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
    timeZone: DAY_TIME_ZONE,
  }).format(s);
  const endFmt = formatDate(e, locale);
  return `${startFmt} – ${endFmt}`;
}

/** Sanitiza un slug para usar como ancla #id en URL. */
export function toAnchorId(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
