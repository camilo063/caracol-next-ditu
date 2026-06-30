import type { GlobalConfig } from "payload";

import { authenticated, publishedOrAuth } from "@/access";
import { globalTag, revalidateTag } from "@/lib/payload/cache-tags";
import { headerSharedFields } from "./shared-header-fields";

/**
 * Header de la landing `/` (Caracol Next).
 * Anclas estándar: #marcas · #audiencia · #momentos · #pauta · #contacto.
 */
export const HeaderCaracolNext: GlobalConfig = {
  slug: "header-caracol-next",
  label: "Header — Caracol Next",
  access: {
    read: publishedOrAuth,
    update: authenticated,
  },
  hooks: {
    afterChange: [async () => revalidateTag(globalTag("header-caracol-next"))],
  },
  fields: headerSharedFields,
};
