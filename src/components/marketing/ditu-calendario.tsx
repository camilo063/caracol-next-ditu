import Link from "next/link";

/**
 * DituCalendarioBlock — Figma 760:9836.
 *
 * Estructura:
 *  - Sticker "ESTO SE VIENE" + heading "CALENDARIO"
 *  - Subtítulo "Los momentos que no te puedes perder."
 *  - Slider de 4 event cards (Filbo, Carnaval, Mundial, Día Independencia)
 *  - CTA "Contáctanos"
 */

const CYAN = "#77EDED";
const NAVY_DARK = "#12082D";
const VIOLET = "#8232F0";

interface EventCard {
  category: string;
  title: string;
  description: string;
  month: string;
  highlight?: boolean;
}

const EVENTS: EventCard[] = [
  {
    category: "Literatura/Cultura",
    title: "Filbo 2026",
    description: "Feria del Libro de Bogotá — abril/mayo.",
    month: "ABR",
  },
  {
    category: "Cultura",
    title: "Carnaval de Barranquilla",
    description: "Patrimonio cultural de la humanidad.",
    month: "FEB",
    highlight: true,
  },
  {
    category: "Deporte",
    title: "Mundial / Eurocopa",
    description: "Cobertura completa de eventos deportivos globales.",
    month: "JUN",
  },
  {
    category: "Fiesta nacional",
    title: "Día de la Independencia",
    description: "Especiales 20 de Julio.",
    month: "JUL",
  },
];

export interface DituCalendarioProps {
  anchorId?: string;
}

export function DituCalendarioBlock({ anchorId = "momentos" }: DituCalendarioProps) {
  return (
    <section
      id={anchorId}
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #1E1446 0%, #2E1A77 50%, #1E1446 100%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 py-24 sm:gap-12 sm:px-12 sm:py-32 lg:px-[120px] lg:py-[180px]">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div
            className="inline-flex w-fit items-center rounded-[8px] px-2 py-1.5"
            style={{
              backgroundColor: CYAN,
              color: NAVY_DARK,
              transform: "rotate(-1.97deg)",
            }}
          >
            <p className="font-display text-[24px] leading-[1] font-bold whitespace-nowrap uppercase sm:text-[36px] lg:text-[48px]">
              ESTO SE VIENE
            </p>
          </div>
          <h2 className="font-display text-[36px] leading-[1] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]">
            CALENDARIO
          </h2>
          <p
            className="text-[16px] text-white sm:text-[20px] lg:text-[22px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
            }}
          >
            Los momentos que no te puedes perder.
          </p>
        </div>

        {/* Event cards row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {EVENTS.map((ev) => (
            <article
              key={ev.title}
              className="relative flex flex-col gap-3 overflow-hidden rounded-[16px] p-5 lg:p-6"
              style={
                ev.highlight
                  ? {
                      background: "linear-gradient(180deg, #8232F0 0%, #561BDB 100%)",
                      border: "2px solid #FFFFFF",
                    }
                  : {
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(119,237,237,0.3)",
                      backdropFilter: "blur(10px)",
                    }
              }
            >
              <span
                className="font-display inline-flex w-fit items-center rounded-[4px] px-2 py-0.5 text-[12px] leading-[1] font-bold whitespace-nowrap uppercase"
                style={{ backgroundColor: CYAN, color: NAVY_DARK }}
              >
                {ev.month}
              </span>
              <h3 className="font-display text-[20px] leading-[1.1] font-bold text-white uppercase lg:text-[24px]">
                {ev.title}
              </h3>
              <p
                className="text-[14px] leading-snug text-white/85 sm:text-[15px]"
                style={{
                  fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                }}
              >
                {ev.description}
              </p>
              <p
                className="mt-auto text-[12px] tracking-[0.05em] text-white/70 uppercase"
                style={{
                  fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                }}
              >
                {ev.category}
              </p>
            </article>
          ))}
        </div>

        {/* CTA bottom */}
        <div className="mt-4 flex flex-col items-center gap-6 text-center">
          <p
            className="max-w-[640px] text-[16px] leading-snug text-white sm:text-[18px]"
            style={{
              fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
            }}
          >
            ¡Asegura la presencia de tu marca en los eventos más importantes del país!
            Contáctanos ahora y diseñemos juntos tu participación.
          </p>
          <Link
            href="#contacto"
            className="font-display inline-flex items-center justify-center rounded-[8px] px-8 py-3 text-[14px] leading-[1] font-bold uppercase transition-opacity hover:opacity-90 sm:text-[16px]"
            style={{ backgroundColor: CYAN, color: NAVY_DARK }}
          >
            Contáctanos
          </Link>
        </div>
      </div>

      {/* Decorative orbit accent (optional, subtle) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 right-0 hidden h-[400px] w-[400px] rounded-full opacity-30 blur-3xl lg:block"
        style={{ backgroundColor: VIOLET }}
      />
    </section>
  );
}
