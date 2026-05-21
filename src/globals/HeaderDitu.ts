import type { GlobalConfig } from "payload";

import { anyone, isAdminOrEditor } from "@/access";
import { headerSharedFields } from "./shared-header-fields";

/**
 * Header de la landing `/ditu`.
 * Anclas estándar: #canales · #contenido · #momentos · #pauta · #contacto.
 */
export const HeaderDitu: GlobalConfig = {
  slug: "header-ditu",
  label: "Header — Ditu",
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: headerSharedFields,
};
