import { RenderBlocks } from "@/blocks";
import { FloatingContact } from "@/components/marketing";
import { caracolNextDemoLayout, floatingContactDemo } from "@/lib/demo-data";

/**
 * Caracol Next — `/caracol-next` (DEMO Fase 3 con mock data).
 * Matching del Figma "caracol-next.png": ecosistema digital con tabs por marca.
 * Fase 4 reemplaza el mock por fetch a Payload (`landing=caracol-next, slug=home`).
 */
export default function CaracolNextPage() {
  return (
    <div className="theme-caracol-next bg-background">
      <RenderBlocks layout={caracolNextDemoLayout} />
      <FloatingContact {...floatingContactDemo} />
    </div>
  );
}
