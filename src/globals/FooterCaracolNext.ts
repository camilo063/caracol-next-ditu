import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

import { authenticated, publishedOrAuth } from "@/access";
import { globalTag } from "@/lib/payload/cache-tags";
import { footerSharedFields } from "./shared-footer-fields";

export const FooterCaracolNext: GlobalConfig = {
  slug: "footer-caracol-next",
  label: "Footer — Caracol Next",
  access: {
    read: publishedOrAuth,
    update: authenticated,
  },
  hooks: {
    afterChange: [async () => revalidateTag(globalTag("footer-caracol-next"))],
  },
  fields: footerSharedFields,
};
