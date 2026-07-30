/**
 * event-dates — semántica única de fechas para los calendarios de eventos
 * (Caracol Next `key-moments` y Ditu `ditu-calendario`).
 *
 * Regla del negocio (cliente, jul 2026): en el calendario solo se muestran
 * eventos VIGENTES —los que ya terminaron desaparecen solos— y se listan del
 * más cercano al más lejano.
 *
 * Por qué un helper y no `new Date()` suelto en cada bloque:
 *
 *  1. "Hoy" es el día calendario en Colombia. Los servidores de Vercel corren
 *     en UTC, así que a las 7pm de Bogotá ya es "mañana" en UTC: comparar con
 *     `new Date()` del server adelantaría el corte y borraría un evento que
 *     todavía está vigente en el país.
 *
 *  2. La fecha del evento es un día calendario, no un instante. Payload guarda
 *     los campos `date` como timestamptz y el DatePicker normaliza la fecha
 *     elegida al MEDIODÍA UTC (`T12:00:00Z`) sin importar la zona del editor
 *     —lo hace a propósito, justo para que ningún huso corra el día—. La data
 *     importada por seed/ISO plano, en cambio, queda en `T00:00:00Z`. Leer el
 *     día en UTC devuelve el día correcto en los dos casos; leerlo en horario
 *     de Bogotá corre los `T00:00:00Z` un día hacia atrás. Por eso el día del
 *     evento se lee en UTC.
 *
 * Todo se compara como texto `YYYY-MM-DD`, que ordena lexicográfico ==
 * cronológico, y da el mismo resultado en el server y en el cliente (sin
 * hydration mismatch en los bloques que son "use client").
 */

/** Valor de fecha tal como puede llegar desde Payload. */
export type EventDateInput = string | Date | null | undefined;

/**
 * Día calendario (`YYYY-MM-DD`) que representa la fecha del evento, leído en
 * UTC. Devuelve `null` si el valor está vacío o no es una fecha válida.
 */
export function eventDay(value: EventDateInput): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

/** Día calendario de hoy (`YYYY-MM-DD`) en Colombia. */
export function todayInColombia(): string {
  // `en-CA` formatea como YYYY-MM-DD, que es justo el formato comparable.
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

/**
 * ¿El evento sigue vigente hoy?
 *
 * Vence al terminar su día de fin (o su día de inicio si no tiene fin), así que
 * un evento que ocurre hoy se sigue mostrando durante todo el día. Un evento sin
 * ninguna fecha legible se conserva: es mejor mostrarlo de más que hacerlo
 * desaparecer sin que el editor entienda por qué.
 */
export function isEventActive(
  start: EventDateInput,
  end: EventDateInput,
  today: string = todayInColombia(),
): boolean {
  const endDay = eventDay(end) ?? eventDay(start);
  if (!endDay) return true;
  return endDay >= today;
}

/**
 * Clave de orden cronológico: el día de inicio (o el de fin si no hay inicio).
 * Los eventos sin fecha legible caen al final con `"9999-12-31"`.
 */
export function eventSortKey(start: EventDateInput, end: EventDateInput): string {
  return eventDay(start) ?? eventDay(end) ?? "9999-12-31";
}

const MESES = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
] as const;

/**
 * Partes UTC de una fecha ya validada. El día va con cero a la izquierda para
 * seguir el formato que el cliente venía escribiendo a mano ("DEL 06 DE MARZO
 * AL 04 DE MAYO"): si no, en el mismo slider convivirían "DEL 06…" y "DEL 6…".
 */
function partesUTC(day: string) {
  const [year, month, date] = day.split("-").map(Number) as [number, number, number];
  return {
    year,
    month,
    date: String(date).padStart(2, "0"),
    mes: MESES[month - 1]!,
  };
}

/**
 * Etiqueta del badge de fecha a partir de las fechas reales del evento.
 *
 * Formatos, siguiendo cómo las venía escribiendo el cliente a mano:
 *   un solo día              → "20 DE JULIO"
 *   rango en el mismo mes    → "DEL 13 AL 17 DE MARZO"
 *   rango en el mismo año    → "DEL 06 DE MARZO AL 04 DE MAYO"
 *   rango entre dos años     → "DEL 20 DE DICIEMBRE DE 2026 AL 05 DE ENERO DE 2027"
 *
 * El año se incluye solo cuando el rango lo cruza. Deliberadamente NO depende de
 * "hoy": el texto tiene que ser el mismo en el server y en el navegador.
 */
export function formatEventDateLabel(start: EventDateInput, end: EventDateInput): string {
  const startDay = eventDay(start);
  if (!startDay) return "";
  const endDay = eventDay(end);

  const s = partesUTC(startDay);
  if (!endDay || endDay === startDay) return `${s.date} DE ${s.mes}`;

  const e = partesUTC(endDay);
  if (s.year !== e.year) {
    return `DEL ${s.date} DE ${s.mes} DE ${s.year} AL ${e.date} DE ${e.mes} DE ${e.year}`;
  }
  if (s.month === e.month) return `DEL ${s.date} AL ${e.date} DE ${s.mes}`;
  return `DEL ${s.date} DE ${s.mes} AL ${e.date} DE ${e.mes}`;
}

/**
 * Filtra los eventos vencidos y ordena del más cercano al más lejano.
 *
 * `getDates` extrae `{ start, end }` de cada item para que sirva con las dos
 * formas de los bloques (`dateStart/dateEnd` en Next, `startDate/endDate` en
 * Ditu). `includeExpired` deja pasar los vencidos manteniendo el orden, para el
 * toggle "mostrar eventos pasados" del bloque de Next.
 */
export function activeEventsSorted<T>(
  events: readonly T[],
  getDates: (event: T) => { start: EventDateInput; end: EventDateInput },
  options: { includeExpired?: boolean } = {},
): T[] {
  const today = todayInColombia();
  const visible = options.includeExpired
    ? [...events]
    : events.filter((event) => {
        const { start, end } = getDates(event);
        return isEventActive(start, end, today);
      });

  return visible.sort((a, b) => {
    const aDates = getDates(a);
    const bDates = getDates(b);
    return eventSortKey(aDates.start, aDates.end).localeCompare(
      eventSortKey(bDates.start, bDates.end),
    );
  });
}
