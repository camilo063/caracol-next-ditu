import { notFound } from "next/navigation";

import { RenderBlocks } from "@/blocks";
import {
  CaracolNextWordmark,
  FloatingContact,
  SiteFooter,
  SiteHeader,
} from "@/components/marketing";
import { getFloatingContact, getFooter, getHeader, getPage } from "@/lib/cms";

/**
 * Caracol Next — `/caracol-next`.
 * Page leída desde Payload (`pages` collection con landing=caracol-next, slug=home).
 * Header / Footer / FloatingContact desde sus respectivos globals.
 */
export default async function CaracolNextPage() {
  const [page, header, footer, floating] = await Promise.all([
    getPage("caracol-next", "home"),
    getHeader("caracol-next"),
    getFooter("caracol-next"),
    getFloatingContact(),
  ]);

  if (!page) notFound();

  return (
    <div className="theme-caracol-next bg-background flex min-h-screen flex-col">
      <SiteHeader {...header} fallbackWordmark={<CaracolNextWordmark />} />
      {/* pt-16 = h-16 del SiteHeader fixed para no quedar oculto. */}
      <main className="flex-1 pt-16">
        <RenderBlocks layout={page.layout} />
      </main>
      <SiteFooter {...footer} fallbackWordmark={<CaracolNextWordmark />} />
      <FloatingContact {...floating} />
    </div>
  );
}
