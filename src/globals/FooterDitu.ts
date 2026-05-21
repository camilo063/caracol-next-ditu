import type { GlobalConfig } from "payload";

import { anyone, isAdminOrEditor } from "@/access";
import { footerSharedFields } from "./shared-footer-fields";

export const FooterDitu: GlobalConfig = {
  slug: "footer-ditu",
  label: "Footer — Ditu",
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: footerSharedFields,
};
