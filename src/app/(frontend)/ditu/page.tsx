import Link from "next/link";

import { RevealSection } from "@/components/animations";
import {
  DituAdnBlock,
  DituAudienciaBlock,
  DituCalendarioBlock,
  DituCanalesBlock,
  DituHero,
  DituMascot,
  DituPautaBlock,
  DituTipoContenidoBlock,
  DituVideoBlock,
  DituWordmark,
  FloatingContact,
  SiteFooter,
  SiteHeader,
} from "@/components/marketing";
import { Button, Container, Section } from "@/components/ui";
import { dituFooterDemo, dituHeaderDemo, floatingContactDemo } from "@/lib/demo-data";

/**
 * Ditu — `/ditu`.
 * Landing 1:1 con Figma 512:2245.
 * Custom blocks (no RenderBlocks) — el sistema Caracol Next se mantiene en `/`.
 */
export default function DituPage() {
  return (
    <div className="theme-ditu bg-background flex min-h-screen flex-col">
      <SiteHeader {...dituHeaderDemo} fallbackWordmark={<DituWordmark />} />
      {/* pt-16 = h-16 del SiteHeader fixed para no quedar oculto. */}
      <main className="flex-1 pt-16">
        {/* Hero — sin RevealSection: parallax + visible al cargar. */}
        <DituHero />
        {/* Spec animaciones (Camilo): fade-in slide-up 400ms en todas las
            secciones excepto Hero. RevealSection respeta reduced-motion. */}
        <RevealSection>
          <DituVideoBlock />
        </RevealSection>
        <RevealSection>
          <DituAudienciaBlock />
        </RevealSection>
        <RevealSection>
          <DituAdnBlock />
        </RevealSection>
        <RevealSection>
          <DituTipoContenidoBlock />
        </RevealSection>
        <RevealSection>
          <DituCanalesBlock />
        </RevealSection>
        <RevealSection>
          <DituCalendarioBlock />
        </RevealSection>
        <RevealSection>
          <DituPautaBlock />
        </RevealSection>
        <RevealSection>
          <DituHablamosSection />
        </RevealSection>
      </main>
      <SiteFooter {...dituFooterDemo} fallbackWordmark={<DituWordmark />} />
      <FloatingContact {...floatingContactDemo} />
    </div>
  );
}

/**
 * Hablamos closing section — Figma 541:7925.
 * Sticker "¿HABLAMOS?" + heading "Lleva tu marca al siguiente nivel." + CTA + mascot.
 */
function DituHablamosSection() {
  return (
    <Section
      id="hablamos"
      padding="lg"
      className="text-white"
      style={{
        background: "linear-gradient(180deg, #8232F0 0%, #561BDB 100%)",
      }}
    >
      <Container size="xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <div
              className="inline-flex items-center rounded-[8px] px-2 py-1.5"
              style={{
                backgroundColor: "#77EDED",
                color: "#12082D",
                transform: "rotate(-1.97deg)",
              }}
            >
              <p className="font-display text-[24px] leading-[1] font-bold whitespace-nowrap uppercase sm:text-[36px] lg:text-[48px]">
                ¿Hablamos?
              </p>
            </div>
            <h2 className="font-display mt-4 text-[36px] leading-[1.05] font-bold text-white uppercase sm:text-[56px] lg:text-[84px]">
              Lleva tu marca
              <br />
              al siguiente nivel.
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/85">
              Cuéntanos tus objetivos y armemos juntos la mejor estrategia.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                asChild
                className="bg-white text-[#1F1647] hover:bg-white/90"
              >
                <Link href="#contacto">Contáctanos</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <DituMascot className="h-56 w-auto sm:h-64 md:h-72 lg:h-80" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
