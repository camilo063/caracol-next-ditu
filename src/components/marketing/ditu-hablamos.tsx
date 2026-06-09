import Link from "next/link";

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
      className="w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #8232F0 0%, #561BDB 100%)",
      }}
    >
      <div className="relative m-auto w-full max-w-[1440px]">
        <div className="relative flex w-full flex-col items-center gap-6 pt-12 pb-12 sm:pt-20 lg:pt-[120px]">
          <div className="relative z-10 flex w-full flex-col items-start gap-[16px] overflow-clip py-14 sm:py-16 sm:pb-24 lg:py-30">
            <div className="mx-auto flex w-full max-w-360 flex-col items-start gap-[16px] px-6 sm:px-12 lg:pl-30">
              <div className="relative flex flex-col items-start gap-[4px]">
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
                <div className="flex flex-col items-start lg:w-[1012px]">
                  <p
                    className="font-display text-[46px] font-bold text-white uppercase sm:text-[60px] lg:text-[84px]"
                    style={{ lineHeight: 1 }}
                  >
                    Lleva tu marca
                  </p>
                  <p
                    className="font-display text-[46px] font-bold text-white uppercase sm:text-[64px] lg:text-[96px]"
                    style={{ lineHeight: 1 }}
                  >
                    al <span style={{ color: CYAN }}>siguiente nivel.</span>
                  </p>
                </div>
              </div>
              <p
                className="text-[20px] text-white sm:text-[20px] lg:w-[1012px] lg:text-[24px]"
                style={{
                  fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                  lineHeight: 1.2,
                }}
              >
                Cuéntanos tus objetivos y armemos juntos la mejor estrategia.
              </p>
              <Link
                href="#contacto"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-[10px] border border-white bg-white px-12.5 py-3 text-[16px] font-bold whitespace-nowrap text-[#561BDB] transition-opacity duration-300 hover:text-white"
                style={{
                  fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                  lineHeight: 1.5,
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(90deg, #8232F0 0%, #561BDB 100%)",
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10">Contáctanos</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -right-[60px] -bottom-[22px] z-1 w-[180px] rotate-[-15deg] sm:-bottom-[22px] sm:w-[270px] md:-bottom-[42px] md:w-[350px] lg:-right-[160px] lg:-bottom-[80px] lg:w-[450px] xl:-right-[60px] xl:-bottom-[105px] xl:w-[477px]">
          <img
            src="/ditu/mascot/pato-ditu.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none w-full object-contain"
          />
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none w-full lg:h-37.5">
        {/* eslint-disable-next-line @next/next/no-img-element  */}
        <img src="/bg/bg-up.svg" alt="" className="relative z-2 block w-full" />
      </div>
    </section>
  );
}
