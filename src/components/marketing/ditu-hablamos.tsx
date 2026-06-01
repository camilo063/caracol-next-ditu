import Link from "next/link";

/**
 * DituHablamosBlock — Figma 541:7925.
 *
 * Specs Figma exactas:
 *  - Container: bg-gradient-to-b from #8232F0 to #561BDB, gap-[24px]
 *    items-center pt-[120px]
 *  - Inner wrapper: gap-[16px] items-start overflow-clip pt-[120px] w-full
 *  - Content (756:6637): gap-[16px] items-start justify-center pl-[120px]
 *    · Sticker container w-[267.904px] h-[69.101px]:
 *      - "¿HABLAMOS?" 48/lh-48 Ditu Display Bold uppercase, bg #77EDED,
 *        text #12082D, px-8 py-6, rounded-8, rotate -1.97deg
 *    · Heading content (756:6640) items-start:
 *      - "Lleva tu marca" Ditu Display Bold 84/lh-84 white uppercase w-1012
 *      - "al " + "siguiente nivel." Ditu Display Bold 96/lh-96
 *        ("al " white, "siguiente nivel." cyan #77EDED)
 *    · Mascot PatoDitu (833:3850): absolute left-[915] top-[38.31]
 *      w-[530.251] h-[493.161], rotate(171.39deg) -scale-y-100
 *  - Subtitle (756:6609): 24/lh-32 Spline Sans Regular white w-1012
 *  - Button: bg white px-[50px] py-[12px] rounded-[10px], text #561BDB
 *    Spline Sans Bold 16
 */

const CYAN = "#77EDED";
const NAVY_DARK = "#12082D";
const VIOLET_MED = "#561BDB";

export interface DituHablamosProps {
  anchorId?: string;
}

export function DituHablamosBlock({ anchorId = "hablamos" }: DituHablamosProps) {
  return (
    <section
      id={anchorId}
      className="relative w-full overflow-hidden"
      style={{
        // Figma 541:7925: gradient-to-b
        background: "linear-gradient(180deg, #8232F0 0%, #561BDB 100%)",
      }}
    >
      {/* PatoDitu — Figma 833:3850: composite de 6 SVGs transparentes.
          Posición corregida: top:240px (= outer pt-120 + inner pt-120 desde section top)
          → alineado con la zona media-derecha del heading, como en el Figma.
          left: 915px → posición Figma dentro del frame de 1440px. */}
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{
          top: "240px",
          left: "915px",
          height: "493.161px",
          width: "530.251px",
        }}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            transform: "scaleY(-1) rotate(171.39deg)",
            transformOrigin: "center center",
          }}
        >
          <div
            className="relative overflow-clip"
            style={{ width: "471.567px", height: "427.358px" }}
          >
            <div className="absolute" style={{ inset: "64.79% 20.24% 0 62.61%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ditu/pato-a.svg"
                alt=""
                className="block h-full w-full"
                style={{ maxWidth: "none" }}
              />
            </div>
            <div className="absolute" style={{ inset: "64.79% 57.75% 0 25.1%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ditu/pato-b.svg"
                alt=""
                className="block h-full w-full"
                style={{ maxWidth: "none" }}
              />
            </div>
            <div className="absolute" style={{ inset: "0 3.84% 0.22% 0" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ditu/pato-c.svg"
                alt=""
                className="block h-full w-full"
                style={{ maxWidth: "none" }}
              />
            </div>
            <div className="absolute" style={{ inset: "53.49% 50.37% 12.54% 9.93%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ditu/pato-g.svg"
                alt=""
                className="block h-full w-full"
                style={{ maxWidth: "none" }}
              />
            </div>
            <div className="absolute" style={{ inset: "26.71% 0 57.37% 69.84%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ditu/pato-i.svg"
                alt=""
                className="block h-full w-full"
                style={{ maxWidth: "none" }}
              />
            </div>
            <div className="absolute" style={{ inset: "14.29% 35.29% 64.49% 45.52%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ditu/pato-j.svg"
                alt=""
                className="block h-full w-full"
                style={{ maxWidth: "none" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center gap-[24px] pt-12 sm:pt-20 lg:pt-[120px]">
        <div className="relative flex w-full flex-col items-start gap-[16px] overflow-clip pt-12 sm:pt-20 lg:pt-[120px]">
          {/* Content — Figma 756:6637: gap-16 items-start pl-120 */}
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[16px] px-6 sm:px-12 lg:pl-[120px]">
            <div className="relative flex flex-col items-start gap-[4px]">
              {/* Sticker "¿HABLAMOS?" — Figma 756:6606 */}
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
                  ¿HABLAMOS?
                </p>
              </div>

              {/* Heading — Figma 756:6640. Línea 1: 84/lh-84 white.
                  Línea 2: 96/lh-96 mixed white + cyan. */}
              <div className="flex flex-col items-start lg:w-[1012px]">
                <p
                  className="font-display text-[36px] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]"
                  style={{ lineHeight: 1 }}
                >
                  Lleva tu marca
                </p>
                <p
                  className="font-display text-[42px] font-bold text-white uppercase sm:text-[64px] lg:text-[96px]"
                  style={{ lineHeight: 1 }}
                >
                  al <span style={{ color: CYAN }}>siguiente nivel.</span>
                </p>
              </div>
            </div>

            {/* Subtitle — Figma 756:6609: 24/lh-32 Spline Sans white w-1012 */}
            <p
              className="text-[16px] text-white sm:text-[20px] lg:w-[1012px] lg:text-[24px]"
              style={{
                fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                lineHeight: "32px",
              }}
            >
              Cuéntanos tus objetivos y armemos juntos la mejor estrategia.
            </p>

            {/* Button "Contáctanos" — Figma 756:7961: bg white text #561BDB */}
            <Link
              href="#contacto"
              className="inline-flex items-center justify-center rounded-[10px] border bg-white px-[50px] py-[12px] text-[16px] font-bold whitespace-nowrap transition-opacity hover:opacity-90"
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

          {/* Spacer bottom — Figma 756:6624: h-[275.356px] w-[1012px] */}
          <div className="h-12 w-full sm:h-[120px] lg:h-[279px]" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom wave — Figma 808:5736: cityscape 1440×131px que hace la
          transición visual al footer oscuro.
          La wave PNG tiene fondo blanco + silueta oscura (#1E1E1E).
          - multiply: blend para eliminar el fondo blanco; hace que la silueta
            quede más oscura que #12082D → leve seam con el footer.
          - Fix: strip de 4px bg-[#12082D] en la base que une el wave con el
            footer sin brecha de color visible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-full overflow-hidden"
        style={{ height: "135px" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ditu/wave-hablamos-bottom.png"
          alt=""
          className="block w-full"
          style={{ objectFit: "fill", mixBlendMode: "multiply", height: "131px" }}
        />
        {/* Relleno de unión — 20px en color exacto del footer para eliminar seam visual */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "20px",
            backgroundColor: "#12082D",
          }}
        />
      </div>
    </section>
  );
}
