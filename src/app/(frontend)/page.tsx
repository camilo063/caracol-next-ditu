import Link from "next/link";

import { Button, Container, Section, SectionHeading, Stat } from "@/components/ui";

/**
 * Home — Caracol Next (placeholder Fase 1, demo de atoms).
 * El contenido real se construye en Fase 3/4 del Prompt 3 con Payload Blocks.
 */
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Section tone="default" padding="xl">
        <Container size="xl">
          <SectionHeading
            eyebrow="Caracol Next"
            title="Mediakit en construcción"
            description="Estás viendo el shell inicial del proyecto. La auditoría Figma, el setup técnico y los atoms del design system están listos. Los bloques de contenido reales se construyen en las siguientes fases con Payload CMS."
            align="center"
            titleLevel="display"
            titleAs="h1"
          />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/admin">Abrir admin Payload</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/ditu">Ver landing Ditu</Link>
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="muted" padding="lg">
        <Container size="xl">
          <SectionHeading
            eyebrow="Fase 1 — Atoms"
            title="Design system base"
            description="Tokens del Figma volcados a Tailwind v4 via @theme inline. Atoms listos para componer los blocks de Payload."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Stat value="12" valueSuffix="+" label="Payload Blocks definidos" size="lg" />
            <Stat value="2" label="Landings (/ y /ditu)" size="lg" />
            <Stat value="5" label="Fases del Prompt 3" size="lg" />
          </div>
        </Container>
      </Section>
    </main>
  );
}
