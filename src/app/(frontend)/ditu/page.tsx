import Link from "next/link";

import {
  Button,
  Container,
  Section,
  SectionHeading,
  Stat,
  WaveDivider,
} from "@/components/ui";

/**
 * Ditu — `/ditu` landing (placeholder Fase 1, demo de atoms).
 * Aplica clase `theme-ditu` en `<main>` para sobreescribir primary al violeta Ditu.
 * El contenido real se construye en Fase 3/4 del Prompt 3.
 */
export default function DituPage() {
  return (
    <main className="theme-ditu flex flex-1 flex-col">
      <Section tone="ditu-deep" padding="xl">
        <Container size="xl">
          <SectionHeading
            eyebrow="Ditu"
            title="Por qué elegir Ditu"
            description="3 millones de pantallas activas, 42 minutos de watch time promedio. No solo escala — atención real."
            align="center"
            titleLevel="display"
            titleAs="h1"
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 md:gap-16">
            <Stat
              value="3"
              valueSuffix="M"
              label="Pantallas activas"
              size="2xl"
              tone="inverse"
              align="center"
            />
            <Stat
              value="42"
              valueSuffix=" min"
              label="Watch time promedio"
              size="2xl"
              tone="inverse"
              align="center"
            />
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" variant="brand-ditu">
              Quiero pautar en Ditu
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">Volver a Caracol Next</Link>
            </Button>
          </div>
        </Container>
      </Section>

      <WaveDivider position="top" className="text-background -mt-px" />

      <Section tone="default" padding="lg">
        <Container size="xl">
          <SectionHeading
            eyebrow="Nuestros canales"
            title="Variedad que se siente"
            description="Cada canal con su propia personalidad — y todo bajo el shell de Ditu. Contenido real, audiencia real, atención real."
          />
        </Container>
      </Section>
    </main>
  );
}
