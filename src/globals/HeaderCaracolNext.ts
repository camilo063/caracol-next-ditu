import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

import { authenticated, publishedOrAuth } from "@/access";
import { globalTag } from "@/lib/payload/cache-tags";
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
    afterChange: [
      async () => revalidateTag(globalTag("header-caracol-next"), { expire: 0 }),
    ],
  },
  fields: headerSharedFields,
};
