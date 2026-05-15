import type { Block } from "payload";

import { anchorIdField, brandOptions, sectionHeaderFields } from "../shared-fields";

/**
 * BrandedContentBlock (solo Caracol Next).
 * "Destacar contenido personalizado".
 */
export const BrandedContentBlock: Block = {
  slug: "branded-content",
  labels: { singular: "Branded Content", plural: "Branded Content" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "items",
      type: "array",
      label: "Casos de Branded Content",
      labels: { singular: "Caso", plural: "Casos" },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "eyebrow", type: "text", label: "Eyebrow (marca / categoría)" },
        { name: "headline", type: "text", required: true },
        { name: "description", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "href", type: "text", label: "Link al caso (opcional)" },
        {
          name: "brand",
          type: "select",
          options: brandOptions as unknown as { label: string; value: string }[],
        },
      ],
    },
    {
      name: "layout",
      type: "select",
      defaultValue: "grid",
      options: [
        { label: "Carrusel", value: "carousel" },
        { label: "Grid", value: "grid" },
      ],
    },
  ],
};
