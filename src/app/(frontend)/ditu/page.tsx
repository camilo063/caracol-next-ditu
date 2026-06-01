import { RevealSection } from "@/components/animations";
import {
  DituAdnBlock,
  DituAudienciaBlock,
  DituCalendarioBlock,
  DituCanalesBlock,
  DituFooter,
  DituHablamosBlock,
  DituHero,
  DituPautaBlock,
  DituTipoContenidoBlock,
  DituVideoBlock,
  DituWordmark,
  FloatingContact,
  SiteHeader,
} from "@/components/marketing";
import { dituHeaderDemo, floatingContactDemo } from "@/lib/demo-data";

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
        {/* Video 2 — Figma 857:3974: mismo componente que 512:2244, sin props adicionales. */}
        <RevealSection>
          <DituVideoBlock />
        </RevealSection>
        <RevealSection>
          <DituPautaBlock />
        </RevealSection>
        <RevealSection>
          <DituHablamosBlock />
        </RevealSection>
      </main>
      <DituFooter />
      <FloatingContact {...floatingContactDemo} />
    </div>
  );
}
