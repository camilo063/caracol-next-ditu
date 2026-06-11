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

// Wraps revalidateTag so it's safe outside Next.js request context (scripts, seed).
import { revalidateTag as _revalidateTag } from "next/cache";
export function revalidateTag(tag: string, opts?: { expire?: number }): void {
  try {
    _revalidateTag(tag, opts as Parameters<typeof _revalidateTag>[1]);
  } catch {
    // Outside Next.js server context — no-op
  }
}
