import type { GlobalConfig } from "payload";

import { anyone, isAdminOrEditor } from "@/access";
import { footerSharedFields } from "./shared-footer-fields";

export const FooterCaracolNext: GlobalConfig = {
  slug: "footer-caracol-next",
  label: "Footer — Caracol Next",
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: footerSharedFields,
};
