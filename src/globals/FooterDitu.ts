import type { GlobalConfig } from "payload";

import { anyone, isAdminOrEditor } from "@/access";
import { revalidateGlobal } from "@/lib/cms-revalidate";
import { footerSharedFields } from "./shared-footer-fields";

export const FooterDitu: GlobalConfig = {
  slug: "footer-ditu",
  label: "Footer — Ditu",
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateGlobal("footer-ditu");
      },
    ],
  },
  fields: footerSharedFields,
};
