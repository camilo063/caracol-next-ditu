import type { GlobalConfig } from "payload";

import { authenticated, publishedOrAuth } from "@/access";
import { footerSharedFields } from "./shared-footer-fields";

export const FooterCaracolNext: GlobalConfig = {
  slug: "footer-caracol-next",
  label: "Footer — Caracol Next",
  access: {
    read: publishedOrAuth,
    update: authenticated,
  },
  fields: footerSharedFields,
};
