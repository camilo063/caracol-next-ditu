import type { Block } from "payload";

import { anchorIdField, brandOptions, sectionHeaderFields } from "../shared-fields";

/**
 * AdFormatsBlock — Formatos de pauta globales.
 * "Vista global de todos los formatos del ecosistema. Ver toda la oferta sin entrar marca por marca."
 */
export const AdFormatsBlock: Block = {
  slug: "ad-formats",
  labels: { singular: "Formatos de pauta", plural: "Formatos de pauta" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "formats",
      type: "array",
      label: "Formatos",
      labels: { singular: "Formato", plural: "Formatos" },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "brand",
          type: "select",
          required: false,
          admin: { description: "Opcional. Marca asociada al formato." },
          options: brandOptions as unknown as { label: string; value: string }[],
        },
        {
          name: "category",
          type: "select",
          options: [
            { label: "Display", value: "display" },
            { label: "Video", value: "video" },
            { label: "Audio", value: "audio" },
            { label: "Branded Content", value: "branded" },
            { label: "Patrocinio", value: "sponsorship" },
            { label: "Multigaleria", value: "multigallery" },
            { label: "Otro", value: "other" },
          ],
        },
        { name: "image", type: "upload", relationTo: "media" },
        {
          name: "specs",
          type: "richText",
          label: "Specs técnicas (formato, peso, duración…)",
        },
        { name: "downloadUrl", type: "text", label: "URL del briefing/PDF (opcional)" },
      ],
    },
    {
      name: "displayMode",
      type: "select",
      defaultValue: "grid",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Tabla", value: "table" },
        { label: "Acordeón", value: "accordion" },
      ],
    },
    {
      name: "filtersEnabled",
      type: "checkbox",
      label: "Habilitar filtros por marca/categoría",
      defaultValue: true,
    },
  ],
};
