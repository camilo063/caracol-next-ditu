/**
 * Tags y paths centralizados para el sistema de caché on-demand.
 *
 * Flujo:
 *  1. Las funciones `get*` de lib/cms y lib/cms-ditu se envuelven con
 *     `unstable_cache` usando estos tags.
 *  2. Los `afterChange` hooks de cada collection/global llaman
 *     `revalidateTag(tag)` para invalidar el data cache + `revalidatePath()`
 *     para invalidar el render de la ruta.
 *  3. Próximo request a la ruta → Next.js regenera la página con data fresca.
 *
 * Mantener este archivo single-source-of-truth para evitar drift entre
 * el cache write y el invalidate.
 */

export type Landing = "caracol-next" | "ditu";

/** Tags usados como keys de `unstable_cache`. */
export const cacheTags = {
  global: (slug: string) => `global:${slug}`,
  page: (landing: Landing, slug: string) => `page:${landing}:${slug}`,
  media: () => "media:all",
} as const;

/** Mapa de globals → paths de frontend que dependen de ellos. */
export const GLOBAL_TO_ROUTES: Record<string, string[]> = {
  "hub-page": ["/"],
  "ditu-page": ["/ditu"],
  "header-caracol-next": ["/caracol-next"],
  "header-ditu": ["/ditu"],
  "footer-caracol-next": ["/caracol-next"],
  "footer-ditu": ["/ditu"],
  // Floating contact aparece en las 3 landings.
  "floating-contact": ["/", "/caracol-next", "/ditu"],
  // Site settings (copyright, maintenance mode) afecta todo.
  "site-settings": ["/", "/caracol-next", "/ditu"],
};

/** Las 3 rutas públicas — útil para over-invalidate (e.g. media changes). */
export const ALL_PUBLIC_ROUTES = ["/", "/caracol-next", "/ditu"] as const;

/** Resolver la URL pública de una page record. */
export function pageRoute(landing: Landing, slug: string): string {
  const segment = slug === "home" ? "" : `/${slug}`;
  return `/${landing}${segment}`;
}
