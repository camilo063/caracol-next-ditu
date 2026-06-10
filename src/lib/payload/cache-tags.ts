/**
 * Centralized cache tag generators for Next.js revalidateTag / unstable_cache.
 * Single source of truth — imported by queries (for cache options) AND hooks (for invalidation).
 *
 * Tag format:
 *   page:<slug>   → one tag per Page document (invalidated when that page changes)
 *   global:<slug> → one tag per Payload global (invalidated when that global changes)
 */

export const pageTag = (slug: string): string => `page:${slug}`;
export const globalTag = (slug: string): string => `global:${slug}`;
