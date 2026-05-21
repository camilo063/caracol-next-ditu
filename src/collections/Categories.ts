import type { CollectionConfig } from "payload";

import { anyone, isAdmin, isAdminOrEditor } from "@/access";

/**
 * Categories — tags transversales (branded content, eventos, formatos).
 */
export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Categoría", plural: "Categorías" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
    group: "Contenido",
  },
  access: {
    create: isAdminOrEditor,
    read: anyone,
    update: isAdminOrEditor,
    delete: isAdmin,
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
