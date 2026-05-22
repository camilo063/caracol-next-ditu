/**
 * Wrappers de `revalidateTag` + `revalidatePath` para los hooks `afterChange`
 * y `afterDelete` de cada collection / global.
 *
 * Cada export sabe qué tag invalidar (data cache) Y qué paths revalidar
 * (HTML/SSR cache) cuando el editor guarda algo. Mantener el mapeo aquí evita
 * que cada hook duplique la lógica.
 *
 * IMPORTANTE: Estos helpers se ejecutan desde 2 contextos:
 *  1. Runtime Next (admin save) → `revalidateTag`/`revalidatePath` funcionan.
 *  2. Seed script standalone (tsx) → `revalidateTag` lanza "Invariant: static
 *     generation store missing" porque no hay Next runtime alrededor.
 *
 * Para que el seed pueda guardar globals/pages sin crashear, envolvemos cada
 * call en try/catch + log silencioso. En runtime Next el revalidate funciona;
 * en seed el catch silencia el error y el seed continúa.
 */

import { revalidatePath, revalidateTag } from "next/cache";

import {
  ALL_PUBLIC_ROUTES,
  GLOBAL_TO_ROUTES,
  cacheTags,
  pageRoute,
  type Landing,
} from "./cms-tags";

function safeRevalidateTag(tag: string): void {
  try {
    revalidateTag(tag);
  } catch {
    // Fuera de Next runtime (seed script). Ignorar.
  }
}

function safeRevalidatePath(path: string): void {
  try {
    revalidatePath(path);
  } catch {
    // Fuera de Next runtime. Ignorar.
  }
}

/** Invalida el cache de un global + las rutas frontend que lo consumen. */
export function revalidateGlobal(slug: string): void {
  safeRevalidateTag(cacheTags.global(slug));
  const routes = GLOBAL_TO_ROUTES[slug] ?? [];
  for (const r of routes) safeRevalidatePath(r);
}

/** Invalida el cache + ruta de una page (caracol-next/foo, ditu/bar). */
export function revalidatePageRecord(
  landing: Landing,
  slug: string,
  previousSlug?: string | null,
): void {
  safeRevalidateTag(cacheTags.page(landing, slug));
  safeRevalidatePath(pageRoute(landing, slug));
  // Si el slug cambió, invalidar también la URL anterior.
  if (previousSlug && previousSlug !== slug) {
    safeRevalidateTag(cacheTags.page(landing, previousSlug));
    safeRevalidatePath(pageRoute(landing, previousSlug));
  }
}

/**
 * Over-invalidate: cuando un media cambia (reemplazo de archivo), cualquier
 * página puede estar referenciándolo. Es más barato refrescar todo que
 * resolver las refs.
 */
export function revalidateAllPublic(): void {
  safeRevalidateTag(cacheTags.media());
  for (const r of ALL_PUBLIC_ROUTES) safeRevalidatePath(r);
}
