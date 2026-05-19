import Link from "next/link";

import { RenderBlocks } from "@/blocks";
import {
  DituMascot,
  DituWordmark,
  FloatingContact,
  SiteFooter,
  SiteHeader,
} from "@/components/marketing";
import { Button, Container, Section } from "@/components/ui";
import {
  dituDemoLayout,
  dituFooterDemo,
  dituHeaderDemo,
  floatingContactDemo,
} from "@/lib/demo-data";

/**
 * Ditu — `/ditu`.
 * Header + RenderBlocks + sección "¿Hablamos?" con mascot + Footer + FloatingContact.
 * Fase 4 reemplaza el mock por fetch a Payload.
 */
export default function DituPage() {
  return (
    <div className="theme-ditu bg-background flex min-h-screen flex-col">
      <SiteHeader {...dituHeaderDemo} fallbackWordmark={<DituWordmark />} />
      {/* pt-16 = h-16 del SiteHeader fixed para no quedar oculto. */}
      <main className="flex-1 pt-16">
        <RenderBlocks layout={dituDemoLayout} />
        <DituHablamosSection />
      </main>
      <SiteFooter {...dituFooterDemo} fallbackWordmark={<DituWordmark />} />
      <FloatingContact {...floatingContactDemo} />
    </div>
  );
}

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
            <p
              className="text-xs font-bold tracking-[0.18em] uppercase"
              style={{ color: "#77EDED" }}
            >
              ¿Hablamos?
            </p>
            <h2 className="font-display mt-3 text-4xl leading-[1.05] font-bold sm:text-5xl md:text-6xl">
              Lleva tu marca al siguiente nivel.
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/85">
              Cuéntanos tu objetivo y construimos juntos la estrategia de pauta más
              poderosa del entretenimiento conectado.
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
            <DituMascot className="h-56 w-auto sm:h-64 md:h-72" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
