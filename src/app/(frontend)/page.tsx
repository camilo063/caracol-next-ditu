import { RenderBlocks } from "@/blocks";
import { FloatingContact } from "@/components/marketing";
import { caracolNextDemoLayout, floatingContactDemo } from "@/lib/demo-data";

/**
 * Home — Caracol Next (DEMO Fase 3 con mock data).
 * Fase 4 reemplaza el mock por un fetch a Payload (`landing=caracol-next, slug=home`).
 */
export default function HomePage() {
  return (
    <>
      <RenderBlocks layout={caracolNextDemoLayout} />
      <FloatingContact {...floatingContactDemo} />
    </>
  );
}
