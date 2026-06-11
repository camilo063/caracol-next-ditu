import type { GlobalConfig } from "payload";

import { authenticated, publishedOrAuth } from "@/access";
import { globalTag, revalidateTag } from "@/lib/payload/cache-tags";
import { footerSharedFields } from "./shared-footer-fields";

export const FooterCaracolNext: GlobalConfig = {
  slug: "footer-caracol-next",
  label: "Footer — Caracol Next",
  access: {
    read: publishedOrAuth,
    update: authenticated,
  },
  hooks: {
    afterChange: [
      async () => revalidateTag(globalTag("footer-caracol-next"), { expire: 0 }),
    ],
  },
  fields: footerSharedFields,
};
