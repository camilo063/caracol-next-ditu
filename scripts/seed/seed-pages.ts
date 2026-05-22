import type { Payload } from "payload";

import { caracolNextDemoLayout, dituDemoLayout } from "./source-data";

import { rewriteMediaRefs } from "./rewrite-media";

interface PageSpec {
  title: string;
  landing: "caracol-next" | "ditu";
  slug: string;
  layout: unknown[];
}

/**
 * Seedea las 2 pages base (caracol-next/home + ditu/home).
 * Idempotente: lookup por (landing, slug); update si existe, create si no.
 *
 * El layout viene de demo-data.ts y pasa por rewriteMediaRefs para que cada
 * objeto hardcoded `{ url, alt }` se reemplace por el mediaId real.
 */
export async function seedPages(
  payload: Payload,
  assetMap: Map<string, number>,
): Promise<void> {
  console.log("📄 Seedeando pages...");

  const pages: PageSpec[] = [
    {
      title: "Caracol Next",
      landing: "caracol-next",
      slug: "home",
      layout: rewriteMediaRefs(caracolNextDemoLayout as unknown[], assetMap),
    },
    {
      title: "Ditu",
      landing: "ditu",
      slug: "home",
      layout: rewriteMediaRefs(dituDemoLayout as unknown[], assetMap),
    },
  ];

  for (const spec of pages) {
    const existing = await payload.find({
      collection: "pages",
      where: {
        and: [{ landing: { equals: spec.landing } }, { slug: { equals: spec.slug } }],
      },
      limit: 1,
      // El draft mode hace que Payload retorne también borradores.
      draft: true,
    });

    const baseData = {
      title: spec.title,
      landing: spec.landing,
      slug: spec.slug,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      layout: spec.layout as any,
      _status: "published" as const,
      revalidate: 3600,
    };

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]!;
      await payload.update({
        collection: "pages",
        id: doc.id,
        data: baseData,
      });
      console.log(`  ↻ ${spec.landing}/${spec.slug} (id=${doc.id})`);
    } else {
      const created = await payload.create({
        collection: "pages",
        data: baseData,
      });
      console.log(`  + ${spec.landing}/${spec.slug} (id=${created.id})`);
    }
  }

  console.log(`✓ Pages: ${pages.length} listas.`);
}
