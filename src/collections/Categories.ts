import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/access";

/**
 * Categories — tags transversales (branded content, eventos, formatos).
 */
export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "kebab-case. ej. 'mundial-2026'" },
    },
    { name: "color", type: "text", admin: { description: "Hex opcional para badges." } },
  ],
};
