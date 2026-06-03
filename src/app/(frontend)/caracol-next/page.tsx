import { RenderBlocks } from "@/blocks";
import {
  CaracolNextWordmark,
  FloatingContact,
  SiteFooter,
  SiteHeader,
} from "@/components/marketing";
import {
  caracolNextDemoLayout,
  caracolNextFooterDemo,
  caracolNextHeaderDemo,
  floatingContactDemo,
} from "@/lib/demo-data";

/**
 * Caracol Next — `/caracol-next`.
 * Header + RenderBlocks + Footer + FloatingContact.
 * En Fase 4 el demo data se reemplaza por fetch a Payload (Pages + Globals).
 */
export default function CaracolNextPage() {
  return (
    <div className="theme-caracol-next bg-background flex min-h-screen flex-col">
      <SiteHeader {...caracolNextHeaderDemo} fallbackWordmark={<CaracolNextWordmark />} />
      {/* pt-16 = h-16 del SiteHeader fixed para no quedar oculto. */}
      <main className="flex-1 pt-12 xl:pt-16">
        <RenderBlocks layout={caracolNextDemoLayout} />
      </main>
      <SiteFooter {...caracolNextFooterDemo} fallbackWordmark={<CaracolNextWordmark />} />
      <FloatingContact {...floatingContactDemo} />
    </div>
  );
}
