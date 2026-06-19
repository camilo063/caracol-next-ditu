"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  stickerLabel?: string;
  heading?: string;
  subtitle?: string;
  cta?: {
    boldText?: string | null;
    text?: string | null;
    buttonLabel?: string | null;
    buttonHref?: string | null;
  };
  /** Override de eventos (Payload). Si no, usa demo. */
  events?: CalendarEvent[];
  /** "Now" para filtrar (default: Date.now). Útil para tests. */
  referenceDate?: Date;
}

const SLIDE_UP = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -5% 0px" } as const,
};
const ease = [0.25, 0.46, 0.45, 0.94] as const;

export function DituCalendarioBlock({
  anchorId = "momentos",
  stickerLabel = "ESTO SE VIENE",
  heading = "Calendario",
  subtitle = "Los momentos que no te puedes perder.",
  cta,
  events = DEMO_EVENTS,
  referenceDate,
}: DituCalendarioProps) {
  const ctaBoldText =
    cta?.boldText ??
    "¡Asegura la presencia de tu marca en los eventos más importantes del país!";
  const ctaText = cta?.text ?? "Contáctanos ahora y diseñemos juntos tu participación.";
  const ctaButtonLabel = cta?.buttonLabel ?? "Contáctanos";
  const ctaButtonHref = cta?.buttonHref ?? "#contacto";
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

  const motionProps = reduceMotion ? {} : SLIDE_UP;

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
        <motion.div
          {...motionProps}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-start gap-[11px]"
        >
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
                {stickerLabel}
              </p>
            </div>

            {/* Heading "Calendario" — 84/lh-84 */}
            {/* Patito — mismo que floating contact (/ditu/mascot/pato-ditu.svg) */}
            {}

            <h2
              className="font-display relative text-[46px] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]"
              style={{ lineHeight: 1 }}
            >
              <span className="absolute -top-[62px] -right-2 sm:-top-[68px] sm:-right-4 lg:-top-[94px]">
                <img
                  src="/ditu/mascot/pato-ditu.svg"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none h-[64px] sm:-right-4 sm:h-[72px] lg:h-[100px]"
                />
              </span>
              {heading}
            </h2>
          </div>

          {/* Subtitle */}
          <p
            className="text-[16px] text-white sm:text-[20px] lg:text-[22px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              lineHeight: "normal",
            }}
          >
            {subtitle}
          </p>
        </motion.div>

        {/* Slider — Figma 829:6573: gap-[32px] w-[1200px] */}
        <motion.div
          {...motionProps}
          transition={{ duration: 0.6, ease, delay: 0.12 }}
          className="w-full"
        >
          <CalendarSlider
            events={visibleEvents}
            activeIndex={activeIndex}
            onGoTo={goTo}
            reduceMotion={!!reduceMotion}
          />
        </motion.div>

        {/* CTA — Figma 829:4787: w-1200 gap-24 items-center */}
        <motion.div
          {...motionProps}
          transition={{ duration: 0.6, ease, delay: 0.22 }}
          className="flex w-full flex-col items-center gap-[24px] lg:w-[1200px]"
        >
          <p
            className="text-center text-[18px] text-white sm:text-[20px] lg:text-[24px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              lineHeight: "normal",
            }}
          >
            <span className="font-bold">{ctaBoldText}</span> {ctaText}
          </p>
          <Link
            href={ctaButtonHref}
            className="inline-flex cursor-pointer items-center justify-center rounded-[10px] border bg-white px-[50px] py-[12px] text-[16px] font-bold transition-all duration-200 hover:bg-[#F3F3F3] hover:shadow-lg hover:shadow-white/30 active:scale-[0.98]"
            style={{
              borderColor: "#FFFFFF",
              color: VIOLET_MED,
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              lineHeight: 1.5,
            }}
          >
            {ctaButtonLabel}
          </Link>
        </motion.div>
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

const CARD_W_MOBILE = 260;
const CARD_W_DESKTOP = 288;
const CARD_GAP = 16;

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
  const N = events.length;
  // Triple array for infinite loop: [copy0, copy1(main), copy2]
  const tripled = useMemo(() => [...events, ...events, ...events], [events]);

  // Internal position in tripled coords. Start in middle copy (offset N).
  const [pos, setPos] = useState(N + activeIndex);
  const [skipTransition, setSkipTransition] = useState(false);

  // Real index for dots (always 0..N-1)
  const realIdx = ((pos % N) + N) % N;

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const cardW = isDesktop ? CARD_W_DESKTOP : CARD_W_MOBILE;
  const step = cardW + CARD_GAP;

  // After animation settles, if we drifted into buffer zone, silently jump
  // back to the equivalent position in the middle copy.
  useEffect(() => {
    if (pos < N || pos >= 2 * N) {
      const real = ((pos % N) + N) % N;
      const timer = setTimeout(() => {
        setSkipTransition(true);
        setPos(N + real);
        // Re-enable transitions next frame
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setSkipTransition(false)),
        );
      }, 380);
      return () => clearTimeout(timer);
    }
  }, [pos, N]);

  const navigate = useCallback(
    (delta: number) => {
      setSkipTransition(false);
      setPos((prev) => {
        const next = prev + delta;
        onGoTo(((next % N) + N) % N);
        return next;
      });
    },
    [N, onGoTo],
  );

  const goToReal = useCallback(
    (idx: number) => {
      setSkipTransition(false);
      const currentCopy = Math.floor(pos / N);
      setPos(currentCopy * N + idx);
      onGoTo(idx);
    },
    [pos, N, onGoTo],
  );

  // Desktop: clamp al último índice que muestra 4 cards completas
  const maxDesktopIdx = Math.max(0, N - 4);
  const desktopX = -(Math.min(activeIndex, maxDesktopIdx) * (CARD_W_DESKTOP + CARD_GAP));
  const mobileX = -(pos * step);

  return (
    <div className="flex w-full flex-col items-start gap-[32px] lg:w-[1200px]">
      {/* Cards container — mobile bleed right rompiendo el padding del padre */}
      <div className="relative -mr-6 w-[calc(100%+24px)] overflow-hidden sm:-mr-12 sm:w-[calc(100%+48px)] lg:mr-0 lg:w-full">
        {/* Mobile: loop infinito con triple array */}
        <motion.div
          drag={reduceMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) navigate(1);
            else if (info.offset.x > 50) navigate(-1);
          }}
          className="flex h-[232px] cursor-grab gap-[16px] active:cursor-grabbing lg:hidden"
          animate={{ x: mobileX }}
          transition={
            skipTransition
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: 200,
                  damping: 30,
                  duration: reduceMotion ? 0 : undefined,
                }
          }
          style={{ width: `${tripled.length * (CARD_W_MOBILE + CARD_GAP)}px` }}
        >
          {tripled.map((event, i) => (
            <div
              key={`${event.id}-${Math.floor(i / N)}`}
              className="h-full shrink-0"
              style={{ width: `${CARD_W_MOBILE}px` }}
            >
              <CalendarCard event={event} />
            </div>
          ))}
        </motion.div>

        {/* Desktop: track normal sin loop, paginado de a 4 */}
        <motion.div
          className="hidden h-[232px] gap-[16px] lg:flex"
          animate={{ x: desktopX }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
            duration: reduceMotion ? 0 : undefined,
          }}
          style={{ width: `${N * (CARD_W_DESKTOP + CARD_GAP)}px` }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="h-full shrink-0"
              style={{ width: `${CARD_W_DESKTOP}px` }}
            >
              <CalendarCard event={event} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots mobile — 1 por card */}
      <div className="flex h-[16px] w-full items-center justify-center lg:hidden">
        <div className="flex items-center gap-[8px] sm:gap-[12px]">
          {events.map((_, idx) => (
            <button
              key={`m-${idx}`}
              type="button"
              onClick={() => goToReal(idx)}
              aria-label={`Ir al evento ${idx + 1}`}
              aria-current={idx === realIdx ? "true" : undefined}
              className="h-3 w-3 cursor-pointer rounded-full transition-all"
              style={{
                backgroundColor: idx === realIdx ? "#FFFFFF" : `${CYAN}99`,
                border: "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Dots desktop — 1 por página de 4.
          El último dot navega a maxDesktopIdx (N-4) para siempre mostrar 4 cards. */}
      <div className="hidden h-[16px] w-full items-center justify-center lg:flex">
        <div className="flex items-center gap-[16px]">
          {Array.from({ length: Math.ceil(N / 4) }).map((_, pageIdx) => {
            const totalPages = Math.ceil(N / 4);
            const isLastPage = pageIdx === totalPages - 1;
            const pageStart = isLastPage ? maxDesktopIdx : pageIdx * 4;
            const nextPageStart = isLastPage ? N : (pageIdx + 1) * 4;
            const isActive = activeIndex >= pageStart && activeIndex < nextPageStart;
            return (
              <button
                key={`d-${pageIdx}`}
                type="button"
                onClick={() => onGoTo(pageStart)}
                aria-label={`Ir a la página ${pageIdx + 1} de ${totalPages}`}
                aria-current={isActive ? "true" : undefined}
                className="h-[16px] w-[16px] cursor-pointer rounded-full transition-all"
                style={{
                  backgroundColor: isActive ? "#FFFFFF" : `${CYAN}99`,
                  border: "none",
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
