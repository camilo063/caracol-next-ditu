import type { GlobalConfig } from "payload";

import { authenticated, publishedOrAuth } from "@/access";
import { footerSharedFields } from "./shared-footer-fields";

export const FooterDitu: GlobalConfig = {
  slug: "footer-ditu",
  label: "Footer — Ditu",
  access: {
    read: publishedOrAuth,
    update: authenticated,
  },
  fields: footerSharedFields,
};
