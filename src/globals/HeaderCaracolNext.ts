import type { GlobalConfig } from "payload";

import { anyone, isAdminOrEditor } from "@/access";
import { headerSharedFields } from "./shared-header-fields";

/**
 * Header de la landing `/` (Caracol Next).
 * Anclas estándar: #marcas · #audiencia · #momentos · #pauta · #contacto.
 */
export const HeaderCaracolNext: GlobalConfig = {
  slug: "header-caracol-next",
  label: "Header — Caracol Next",
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: headerSharedFields,
};
