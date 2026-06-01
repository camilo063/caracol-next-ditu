"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/**
 * DituCalendarioBlock — Figma 760:9836.
 *
 * Specs Figma:
 *  - Container: bg-gradient 116.12deg #7129D4 11.561% → #5F20DF 63.291% →
 *    #1E1446 101.84%, px-[120px] py-[180px], gap-[48px], items-start
 *  - Header: sticker "ESTO SE VIENE" (48/lh-48) + "CALENDARIO" 84/lh-84 +
 *    subtitle 22px + decoración image-14 absolute top-[-10] left-[317] w-103 h-92
 *  - Slider: gap-[32px] items-start w-[1200px]. Cards row gap-[16px] h-[232px]
 *  - Cards (829:6512+): flex-1 border-white rounded-[12px] p-[16px] h-full
 *    · Inner: h-[208px] px-[8px] py-[16px] flex-col justify-between
 *    · Top: date Spline Sans SemiBold 16/lh-16 white + badge category
 *    · Badge: rounded-[4px] px-[8px] py-[4px] Spline Sans SemiBold 12/normal
 *      uppercase. 4 variants: cyan / violet / navy+white-border / white+navy
 *    · Bottom: title Ditu Display Bold 32/lh-38 white (NO uppercase) +
 *      subtitle Spline Sans Regular 16/normal white
 *  - Dots: h-16 w-full center, gap-[16px], dots size-[16px]
 *  - CTA: w-1200 gap-24 items-center
 *    · Text Spline Sans Bold 24 white center
 *    · Button bg white px-[50px] py-[12px] rounded-[10px], texto Spline Sans
 *      Bold 16 #561BDB
 *
 * Spec usuario (Camilo):
 *  - Autoplay DESACTIVADO — navegación manual via dots
 *  - Framer Motion para transiciones
 *  - Indicadores de posición visibles (dots)
 *  - Solo 12 eventos más próximos a vencer — ordenados ascendente por start
 *  - Si endDate < now, el evento desaparece automáticamente del slider
 *  - Mobile: swipe drag para navegar
 *  - Mobile: efecto profundidad — card activa scale 1, siguiente 0.667 (1/1.5),
 *    siguiente 0.4 (1/2.5)
 */

const CYAN = "#77EDED";
const NAVY_DARK = "#12082D";
const VIOLET = "#8232F0";
const VIOLET_MED = "#561BDB";

/** Variantes de badge según Figma (4 colores). */
type BadgeVariant = "cyan" | "violet" | "navy" | "white";

const BADGE_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  cyan: { backgroundColor: CYAN, color: NAVY_DARK, borderColor: CYAN },
  violet: { backgroundColor: VIOLET, color: "#FFFFFF", borderColor: VIOLET },
  navy: { backgroundColor: NAVY_DARK, color: "#FFFFFF", borderColor: "#FFFFFF" },
  white: { backgroundColor: "#FFFFFF", color: NAVY_DARK, borderColor: NAVY_DARK },
};

interface CalendarEvent {
  id: string;
  /** Fecha texto a mostrar (e.g. "DEL 06 DE MARZO AL 04 DE MAYO"). */
  dateLabel: string;
  /** ISO date inicio — usado para sort. */
  startDate: string; // YYYY-MM-DD
  /** ISO date fin — usado para filtrar eventos expirados. */
  endDate: string; // YYYY-MM-DD
  title: string;
  subtitle: string;
  category: string;
  badgeVariant: BadgeVariant;
}

/** Mock data — 14 eventos representativos del año 2026.
 *  TODO: cuando Payload tenga datos reales, reemplazar por fetch. */
const DEMO_EVENTS: CalendarEvent[] = [
  {
    id: "filbo",
    dateLabel: "DEL 06 DE MARZO AL 04 DE MAYO",
    startDate: "2026-03-06",
    endDate: "2026-05-04",
    title: "FilBo 2026",
    subtitle: "Libros e historias",
    category: "Categoría",
    badgeVariant: "cyan",
  },
  {
    id: "carnaval",
    dateLabel: "DEL 13 AL 17 DE MARZO",
    startDate: "2026-03-13",
    endDate: "2026-03-17",
    title: "Carnaval de Barranquilla",
    subtitle: "Celebraciones",
    category: "Categoría",
    badgeVariant: "violet",
  },
  {
    id: "mundial",
    dateLabel: "JUN",
    startDate: "2026-06-11",
    endDate: "2026-07-19",
    title: "Mundial / Eurocopa",
    subtitle: "Picos deportivos",
    category: "Categoría",
    badgeVariant: "navy",
  },
  {
    id: "independencia",
    dateLabel: "20 - JUL",
    startDate: "2026-07-20",
    endDate: "2026-07-20",
    title: "Día de la independencia",
    subtitle: "Conversaciones",
    category: "Categoría",
    badgeVariant: "white",
  },
  {
    id: "amorista",
    dateLabel: "14 DE FEBRERO",
    startDate: "2026-02-14",
    endDate: "2026-02-14",
    title: "San Valentín",
    subtitle: "Conexiones",
    category: "Categoría",
    badgeVariant: "cyan",
  },
  {
    id: "padre",
    dateLabel: "21 DE JUNIO",
    startDate: "2026-06-21",
    endDate: "2026-06-21",
    title: "Día del Padre",
    subtitle: "Familias",
    category: "Categoría",
    badgeVariant: "violet",
  },
  {
    id: "madre",
    dateLabel: "10 DE MAYO",
    startDate: "2026-05-10",
    endDate: "2026-05-10",
    title: "Día de la Madre",
    subtitle: "Tributos",
    category: "Categoría",
    badgeVariant: "navy",
  },
  {
    id: "amistad",
    dateLabel: "19 DE SEPTIEMBRE",
    startDate: "2026-09-19",
    endDate: "2026-09-19",
    title: "Día del Amor y la Amistad",
    subtitle: "Conexiones",
    category: "Categoría",
    badgeVariant: "white",
  },
  {
    id: "halloween",
    dateLabel: "31 DE OCTUBRE",
    startDate: "2026-10-31",
    endDate: "2026-10-31",
    title: "Halloween",
    subtitle: "Espectáculos",
    category: "Categoría",
    badgeVariant: "cyan",
  },
  {
    id: "navidad",
    dateLabel: "DEL 20 AL 31 DE DICIEMBRE",
    startDate: "2026-12-20",
    endDate: "2026-12-31",
    title: "Navidad",
    subtitle: "Tradiciones",
    category: "Categoría",
    badgeVariant: "violet",
  },
  {
    id: "fin-anio",
    dateLabel: "31 DE DICIEMBRE",
    startDate: "2026-12-31",
    endDate: "2026-12-31",
    title: "Fin de Año",
    subtitle: "Celebraciones",
    category: "Categoría",
    badgeVariant: "navy",
  },
  {
    id: "festival-cine",
    dateLabel: "DEL 05 AL 12 DE OCTUBRE",
    startDate: "2026-10-05",
    endDate: "2026-10-12",
    title: "Festival de Cine Cartagena",
    subtitle: "Cultura audiovisual",
    category: "Categoría",
    badgeVariant: "white",
  },
  {
    id: "rock-park",
    dateLabel: "DEL 04 AL 06 DE JULIO",
    startDate: "2026-07-04",
    endDate: "2026-07-06",
    title: "Rock al Parque",
    subtitle: "Música en vivo",
    category: "Categoría",
    badgeVariant: "cyan",
  },
  {
    id: "feria-flores",
    dateLabel: "DEL 31 DE JULIO AL 09 DE AGOSTO",
    startDate: "2026-07-31",
    endDate: "2026-08-09",
    title: "Feria de las Flores",
    subtitle: "Tradiciones",
    category: "Categoría",
    badgeVariant: "violet",
  },
];

export interface DituCalendarioProps {
  anchorId?: string;
  /** Override de eventos (Payload). Si no, usa demo. */
  events?: CalendarEvent[];
  /** "Now" para filtrar (default: Date.now). Útil para tests. */
  referenceDate?: Date;
}

export function DituCalendarioBlock({
  anchorId = "momentos",
  events = DEMO_EVENTS,
  referenceDate,
}: DituCalendarioProps) {
  const now = referenceDate ?? new Date();
  const todayTs = new Date(now.toISOString().slice(0, 10)).getTime();

  // Filtro: eventos no expirados (endDate >= today), sort ascendente, top 12.
  const visibleEvents = useMemo(() => {
    return events
      .filter((e) => new Date(e.endDate).getTime() >= todayTs)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 12);
  }, [events, todayTs]);

  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const goTo = (idx: number) => {
    setActiveIndex(Math.max(0, Math.min(visibleEvents.length - 1, idx)));
  };

  return (
    <section
      id={anchorId}
      className="relative w-full overflow-hidden"
      style={{
        // Figma 760:9836: gradient 116.12deg
        background:
          "linear-gradient(116.12deg, #7129D4 11.561%, #5F20DF 63.291%, #1E1446 101.84%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-12 px-6 py-24 sm:px-12 sm:py-32 lg:gap-[48px] lg:px-[120px] lg:py-[180px]">
        {/* Header — Figma 760:9890 */}
        <div className="flex flex-col items-start gap-[11px]">
          <div className="relative flex w-full max-w-[449px] flex-col items-start gap-[4px]">
            {/* Sticker "ESTO SE VIENE" */}
            <div
              className="inline-flex items-center rounded-[8px] px-[8px] py-[6px]"
              style={{
                backgroundColor: CYAN,
                color: NAVY_DARK,
                transform: "rotate(-1.97deg)",
              }}
            >
              <p
                className="font-display text-[24px] font-bold whitespace-nowrap uppercase sm:text-[36px] lg:text-[48px]"
                style={{ lineHeight: 1 }}
              >
                {" "}
                ESTO SE VIENE
              </p>
            </div>

            {/* Heading "Calendario" — 84/lh-84 */}
            <h2
              className="font-display text-[36px] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]"
              style={{ lineHeight: 1 }}
            >
              Calendario
            </h2>

            {/* Decoración (pato) — reubicada para NO sobreponerse al título
                "Calendario" (bug usuario). Antes en top-[-10] left-[317] hacía
                overlap visible en mobile/tablet. Ahora top sobre el sticker y
                desplazada hacia la derecha del container del título. */}
            <div className="pointer-events-none absolute top-[-50px] right-[-20px] hidden h-[60px] w-[68px] sm:top-[-60px] sm:right-[-30px] sm:block sm:h-[80px] sm:w-[88px] lg:top-[-70px] lg:right-[-60px] lg:h-[92px] lg:w-[103px]">
              <Image
                src="/ditu/calendar-decoration.png"
                alt=""
                width={103}
                height={92}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Subtitle */}
          <p
            className="text-[16px] text-white sm:text-[20px] lg:text-[22px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              lineHeight: "normal",
            }}
          >
            Los momentos que no te puedes perder.
          </p>
        </div>

        {/* Slider — Figma 829:6573: gap-[32px] w-[1200px] */}
        <CalendarSlider
          events={visibleEvents}
          activeIndex={activeIndex}
          onGoTo={goTo}
          reduceMotion={!!reduceMotion}
        />

        {/* CTA — Figma 829:4787: w-1200 gap-24 items-center */}
        <div className="flex w-full flex-col items-center gap-[24px]">
          <p
            className="text-center text-[18px] text-white sm:text-[20px] lg:text-[24px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              lineHeight: "normal",
            }}
          >
            <span className="font-bold">
              ¡Asegura la presencia de tu marca en los eventos más importantes del país!
            </span>{" "}
            Contáctanos ahora y diseñemos juntos tu participación.
          </p>
          <Link
            href="#contacto"
            className="inline-flex cursor-pointer items-center justify-center rounded-[10px] border bg-white px-[50px] py-[12px] text-[16px] font-bold transition-all duration-200 hover:bg-[#F3F3F3] hover:shadow-lg hover:shadow-white/30 active:scale-[0.98]"
            style={{
              borderColor: "#FFFFFF",
              color: VIOLET_MED,
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              lineHeight: 1.5,
            }}
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * CalendarSlider
 *
 * Desktop: muestra 4 cards visibles a la vez en row con gap-16; dots
 *   indican posición (paginación 1-by-1 con 12 dots).
 * Mobile: muestra 1 card activa al 100% + adyacentes escaladas al 0.667 y 0.4
 *   (efecto profundidad). Swipe drag para navegar.
 * Autoplay: DESACTIVADO. Navegación manual via dots o swipe.
 * ============================================================================ */

function CalendarSlider({
  events,
  activeIndex,
  onGoTo,
  reduceMotion,
}: {
  events: CalendarEvent[];
  activeIndex: number;
  onGoTo: (idx: number) => void;
  reduceMotion: boolean;
}) {
  // Distancia activa para usar en mobile scale (1, 0.667, 0.4)
  const getMobileScale = (idx: number) => {
    const d = Math.abs(idx - activeIndex);
    if (d === 0) return 1;
    if (d === 1) return 1 / 1.5; // ≈ 0.667
    return 1 / 2.5; // 0.4
  };

  return (
    <div className="flex w-full flex-col items-start gap-[32px]">
      {/* Cards container */}
      <div className="relative w-full overflow-hidden">
        {/* Desktop: row de cards visible 4 a la vez con páginas de 1.
            Mobile: drag horizontal con scale effect. */}
        <motion.div
          drag={reduceMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) onGoTo(activeIndex + 1);
            else if (info.offset.x > 50) onGoTo(activeIndex - 1);
          }}
          className="flex h-[232px] cursor-grab gap-[16px] active:cursor-grabbing lg:cursor-default"
          animate={{
            // Trasladamos el track según activeIndex.
            // Mobile: cada card ~75vw, gap 16. Desktop: 4 cards visibles, paginación 1.
            x:
              typeof window !== "undefined" && window.innerWidth < 1024
                ? -(activeIndex * 75) // vw scrolls
                : -(activeIndex * (288 + 16)), // 288px card + 16 gap
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
            duration: reduceMotion ? 0 : undefined,
          }}
          style={{
            // Track ancho calculado: cards × (width + gap)
            width: `${events.length * (288 + 16)}px`,
          }}
        >
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              className="h-full shrink-0 lg:w-[288px]"
              animate={{
                // Mobile scale effect — solo aplica si viewport < lg.
                scale:
                  typeof window !== "undefined" && window.innerWidth < 1024
                    ? getMobileScale(idx)
                    : 1,
              }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
              style={{
                width: "min(75vw, 288px)",
                transformOrigin: "center center",
              }}
            >
              <CalendarCard event={event} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dots — paginación de a 4 elementos (spec usuario: "dots pasen de
          4 en 4 elementos"). En desktop visiblees 4 cards a la vez, así que
          tener un dot por página tiene sentido visual.
          Número de páginas = ceil(events.length / 4). */}
      <div className="flex h-[16px] w-full items-center justify-center">
        <div className="flex items-center gap-[8px] sm:gap-[12px] lg:gap-[16px]">
          {Array.from({ length: Math.ceil(events.length / 4) }).map((_, pageIdx) => {
            // Cada página corresponde a un grupo de 4 elementos.
            const pageStart = pageIdx * 4;
            // Página activa si activeIndex está en el rango [pageStart, pageStart+4).
            const isActive = activeIndex >= pageStart && activeIndex < pageStart + 4;
            return (
              <button
                key={`page-${pageIdx}`}
                type="button"
                onClick={() => onGoTo(pageStart)}
                aria-label={`Ir a la página ${pageIdx + 1} de ${Math.ceil(events.length / 4)}`}
                aria-current={isActive ? "true" : undefined}
                className="h-[10px] w-[10px] cursor-pointer rounded-full transition-all hover:opacity-100 lg:h-[16px] lg:w-[16px]"
                style={{
                  backgroundColor: isActive ? "#FFFFFF" : "transparent",
                  border: `1.5px solid #FFFFFF`,
                  opacity: isActive ? 1 : 0.6,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * CalendarCard — Figma 829:6512 (Card ads/calendar card Ditu)
 * ============================================================================ */

function CalendarCard({ event }: { event: CalendarEvent }) {
  return (
    <article className="flex h-full flex-col items-start justify-center overflow-clip rounded-[12px] border border-white p-[16px]">
      <div className="flex h-[208px] w-full flex-col items-start justify-between px-[8px] py-[16px]">
        {/* Top: date + badge */}
        <div className="flex w-full items-start gap-[8px]">
          <div className="flex flex-1 flex-col items-start overflow-clip">
            <p
              className="w-full text-[14px] font-semibold text-white sm:text-[16px]"
              style={{
                fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                lineHeight: "16px",
              }}
            >
              {event.dateLabel}
            </p>
          </div>
          <div
            className="inline-flex items-center justify-center rounded-[4px] border px-[8px] py-[4px]"
            style={BADGE_STYLES[event.badgeVariant]}
          >
            <p
              className="text-[12px] font-semibold uppercase"
              style={{
                fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                lineHeight: "normal",
              }}
            >
              {event.category}
            </p>
          </div>
        </div>

        {/* Bottom: title + subtitle */}
        <div className="flex w-full flex-col items-start gap-[8px] text-white">
          <p
            className="font-display w-full text-[24px] font-bold sm:text-[28px] lg:text-[32px]"
            style={{ lineHeight: "38px" }}
          >
            {event.title}
          </p>
          <p
            className="w-full text-[14px] sm:text-[16px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              lineHeight: "normal",
            }}
          >
            {event.subtitle}
          </p>
        </div>
      </div>
    </article>
  );
}
