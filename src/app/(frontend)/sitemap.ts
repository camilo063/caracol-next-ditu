import type { MetadataRoute } from "next";

import { getPayload } from "payload";

import config from "@payload-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Genera /sitemap.xml.
 *
 * Incluye:
 *  - Las 3 landings raíz (`/`, `/caracol-next`, `/ditu`) con priority alta.
 *  - Todas las pages `_status: published` no-home de la collection `pages`.
 *  - Filtra las que tienen `meta.noIndex === true` (no las indexan buscadores).
 *
 * La home (`/`) y los `landing/home` son hard-coded — son entradas estáticas que
 * no vienen de la collection (la home es un Global, no una Page).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    {
      url: `${SITE_URL}/caracol-next`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ditu`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Pages adicionales (sub-pages cuando el cliente las cree).
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "pages",
      where: { _status: { equals: "published" } },
      limit: 500,
      depth: 0,
    });

    for (const page of result.docs) {
      const slug = (page.slug as string) ?? "";
      const landing = (page.landing as "caracol-next" | "ditu") ?? "caracol-next";
      // Las páginas slug=home ya están como raíz de la landing arriba.
      if (slug === "home") continue;
      // Respetar noIndex.
      const noIndex = (page as { meta?: { noIndex?: boolean } }).meta?.noIndex;
      if (noIndex) continue;

      const lastModified = page.updatedAt ? new Date(page.updatedAt as string) : now;
      entries.push({
        url: `${SITE_URL}/${landing}/${slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // Si Payload no responde (DB caída, build sin DATABASE_URI), devolvemos
    // las 3 raíces. Mejor un sitemap incompleto que un sitemap roto.
  }

  return entries;
}
