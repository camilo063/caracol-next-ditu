import { unstable_cache } from "next/cache";
import config from "@payload-config";
import { getPayload } from "payload";

import { globalTag, pageTag } from "./cache-tags";

/**
 * Cache strategy: unstable_cache + revalidateTag (on-demand via Payload hooks).
 *
 * Why NOT `use cache` / dynamicIO:
 *   - Next 15.5.18 is pinned for Payload 3.34 compatibility.
 *   - `use cache` / `cacheComponents` are experimental flags that rewrite the
 *     rendering model of the whole app. Not safe to enable now.
 *   - Migrate to `use cache` when Next 16+ is validated with Payload.
 *
 * Cache key anatomy: [functionName, DEPLOY_ID]
 *   DEPLOY_ID = VERCEL_GIT_COMMIT_SHA (changes on each deploy → auto-bust)
 *             = 'dev' locally (persists across hot-reloads; bust with revalidateTag)
 *
 * revalidate: 3600 is only a safety-net TTL. Real invalidation is on-demand
 * via Payload afterChange/afterDelete hooks calling revalidateTag(tag).
 *
 * ADMIN: these functions are ONLY used by the public frontend routes.
 * /admin reads Payload directly (live, never cached).
 */

const DEPLOY_ID = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev";

export const getCaracolNextPage = unstable_cache(
  async () => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "pages",
      where: { slug: { equals: "caracol-next" } },
      limit: 1,
      depth: 3,
    });
    return result.docs[0] ?? null;
  },
  ["getCaracolNextPage", DEPLOY_ID],
  { tags: [pageTag("caracol-next")], revalidate: 3600 },
);

export const getDituPage = unstable_cache(
  async () => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "pages",
      where: { slug: { equals: "ditu" } },
      limit: 1,
      depth: 3,
    });
    return result.docs[0] ?? null;
  },
  ["getDituPage", DEPLOY_ID],
  { tags: [pageTag("ditu")], revalidate: 3600 },
);

export const getSiteSettings = unstable_cache(
  async () => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "site-settings", depth: 2 });
  },
  ["getSiteSettings", DEPLOY_ID],
  { tags: [globalTag("site-settings")], revalidate: 3600 },
);

export const getHeaderCaracolNext = unstable_cache(
  async () => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "header-caracol-next", depth: 2 });
  },
  ["getHeaderCaracolNext", DEPLOY_ID],
  { tags: [globalTag("header-caracol-next")], revalidate: 3600 },
);

export const getHeaderDitu = unstable_cache(
  async () => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "header-ditu", depth: 2 });
  },
  ["getHeaderDitu", DEPLOY_ID],
  { tags: [globalTag("header-ditu")], revalidate: 3600 },
);

export const getFooterCaracolNext = unstable_cache(
  async () => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "footer-caracol-next", depth: 2 });
  },
  ["getFooterCaracolNext", DEPLOY_ID],
  { tags: [globalTag("footer-caracol-next")], revalidate: 3600 },
);

export const getFooterDitu = unstable_cache(
  async () => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "footer-ditu", depth: 2 });
  },
  ["getFooterDitu", DEPLOY_ID],
  { tags: [globalTag("footer-ditu")], revalidate: 3600 },
);

export const getFloatingContact = unstable_cache(
  async () => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "floating-contact", depth: 2 });
  },
  ["getFloatingContact", DEPLOY_ID],
  { tags: [globalTag("floating-contact")], revalidate: 3600 },
);
