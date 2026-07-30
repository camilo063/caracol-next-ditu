import type { BasePayload } from "payload";

import { pageTag, revalidateTag } from "./cache-tags";

/**
 * Invalida el cache de todas las páginas.
 *
 * Lo usan las colecciones que se embeben en las páginas vía relationship
 * (marcas, categorías de evento). La query de páginas está cacheada con
 * `unstable_cache`, y editar uno de esos documentos NO toca el documento de la
 * página, así que Next no se entera solo: hay que invalidar a mano el cache de
 * cada página que pueda referenciarlo.
 *
 * Se revalidan todos los slugs en vez de rastrear cuáles usan el documento:
 * son pocas páginas, cambian poco y la query es barata.
 */
export async function revalidateAllPages(payload: BasePayload): Promise<void> {
  try {
    const pages = await payload.find({
      collection: "pages",
      limit: 100,
      depth: 0,
      pagination: false,
    });
    for (const p of pages.docs) {
      if (p.slug) revalidateTag(pageTag(p.slug));
    }
  } catch {
    // Fuera del contexto de Next (seed/scripts) o error de query — no-op.
  }
}
