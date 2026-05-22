/**
 * Wrappers de `revalidateTag` + `revalidatePath` para los hooks `afterChange`
 * y `afterDelete` de cada collection / global.
 *
 * Cada export sabe qué tag invalidar (data cache) Y qué paths revalidar
 * (HTML/SSR cache) cuando el editor guarda algo. Mantener el mapeo aquí evita
 * que cada hook duplique la lógica.
 */

import { revalidatePath, revalidateTag } from "next/cache";

import {
  ALL_PUBLIC_ROUTES,
  GLOBAL_TO_ROUTES,
  cacheTags,
  pageRoute,
  type Landing,
} from "./cms-tags";

/** Invalida el cache de un global + las rutas frontend que lo consumen. */
export function revalidateGlobal(slug: string): void {
  revalidateTag(cacheTags.global(slug));
  const routes = GLOBAL_TO_ROUTES[slug] ?? [];
  for (const r of routes) revalidatePath(r);
}

/** Invalida el cache + ruta de una page (caracol-next/foo, ditu/bar). */
export function revalidatePageRecord(
  landing: Landing,
  slug: string,
  previousSlug?: string | null,
): void {
  revalidateTag(cacheTags.page(landing, slug));
  revalidatePath(pageRoute(landing, slug));
  // Si el slug cambió, invalidar también la URL anterior.
  if (previousSlug && previousSlug !== slug) {
    revalidateTag(cacheTags.page(landing, previousSlug));
    revalidatePath(pageRoute(landing, previousSlug));
  }
}

/**
 * Over-invalidate: cuando un media cambia (reemplazo de archivo), cualquier
 * página puede estar referenciándolo. Es más barato refrescar todo que
 * resolver las refs.
 */
export function revalidateAllPublic(): void {
  revalidateTag(cacheTags.media());
  for (const r of ALL_PUBLIC_ROUTES) revalidatePath(r);
}
