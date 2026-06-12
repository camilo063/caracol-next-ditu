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
//
// Next.js 16 cache-invalidation modes (revalidation-utils.js):
//   profile=undefined  → durations=undefined → IMMEDIATE hard purge (read-your-writes)
//   profile="max"      → SWR (serve stale while revalidating in background)
//   profile={expire:0} → SWR with TTL=0 (still serves stale on first reload!)
//
// We need undefined profile for immediate purge. TypeScript declares the argument
// as required (string | CacheLifeConfig), but the runtime accepts undefined.
// Using a type cast to preserve correct runtime behavior.
import { revalidateTag as _revalidateTag } from "next/cache";
const _rt = _revalidateTag as (tag: string) => void;
export function revalidateTag(tag: string): void {
  try {
    _rt(tag);
  } catch {
    // Outside Next.js server context (seed, scripts) — no-op
  }
}
