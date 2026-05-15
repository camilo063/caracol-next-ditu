import { RenderBlocks } from "@/blocks";
import { FloatingContact } from "@/components/marketing";
import { dituDemoLayout, floatingContactDemo } from "@/lib/demo-data";

/**
 * Ditu — `/ditu` (DEMO Fase 3 con mock data, `theme-ditu` activo).
 * Fase 4 reemplaza el mock por un fetch a Payload (`landing=ditu, slug=home`).
 */
export default function DituPage() {
  return (
    <div className="theme-ditu">
      <RenderBlocks layout={dituDemoLayout} />
      <FloatingContact {...floatingContactDemo} />
    </div>
  );
}
