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
      <div className="relative flex w-full flex-col items-center gap-[24px] pt-12 sm:pt-20 lg:pt-[120px]">
        <div className="relative flex w-full flex-col items-start gap-[16px] overflow-clip pt-12 sm:pt-20 lg:pt-[120px]">
          {/* Mascot PatoDitu — Figma 833:3850: absolute left-[915] top-[38.31]
              w-[530] h-[493], rotate(171.39deg) -scale-y-100 (flipped + rotated).
              Mobile: oculto. Desktop: posicionado a la derecha. */}
          <div className="pointer-events-none absolute top-[38px] right-[-100px] hidden h-[400px] w-[420px] lg:right-auto lg:left-[915px] lg:block lg:h-[493.161px] lg:w-[530.251px]">
            <div
              className="h-full w-full"
              style={{
                transform: "scaleY(-1) rotate(171.39deg)",
                transformOrigin: "center center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ditu/pato-ditu.png"
                alt=""
                className="block h-full w-full object-contain"
                style={{ maxWidth: "none" }}
              />
            </div>
          </div>

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
          <div className="h-12 w-full sm:h-[120px] lg:h-[275px]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
