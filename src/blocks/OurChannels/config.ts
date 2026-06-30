import type { Block } from "payload";

import { anchorIdField, sectionHeaderFields } from "../shared-fields";

/**
 * OurChannelsBlock (solo Ditu).
 * "Mostrar la variedad de contenido disponible".
 */
export const OurChannelsBlock: Block = {
  slug: "our-channels",
  labels: { singular: "Nuestros canales", plural: "Nuestros canales" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "channels",
      type: "array",
      label: "Canales",
      labels: { singular: "Canal", plural: "Canales" },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "logo", type: "upload", relationTo: "media" },
        { name: "description", type: "textarea" },
        { name: "color", type: "text", label: "Color brand (hex, opcional)" },
        { name: "href", type: "text", label: "Link al canal (opcional)" },
        {
          name: "category",
          type: "select",
          options: [
            { label: "Cine", value: "cine" },
            { label: "Series", value: "series" },
            { label: "Deportes", value: "deportes" },
            { label: "Noticias", value: "noticias" },
            { label: "Entretenimiento", value: "entretenimiento" },
            { label: "Infantil", value: "infantil" },
            { label: "Otro", value: "otro" },
          ],
        },
        {
          name: "audienceSize",
          type: "number",
          label: "Tamaño audiencia (opcional)",
        },
      ],
    },
    {
      name: "layout",
      type: "select",
      defaultValue: "grid",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Carrusel", value: "carousel" },
      ],
    },
  ],
};
