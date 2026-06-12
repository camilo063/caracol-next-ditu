import type { Block } from "payload";
import { anchorIdField } from "../shared-fields";

export const DituPautaBlock: Block = {
  slug: "ditu-pauta",
  labels: { singular: "Ditu Pauta", plural: "Ditu Pautas" },
  fields: [
    anchorIdField,
    {
      name: "categories",
      type: "array",
      label: "Categorías de pauta",
      maxRows: 6,
      fields: [
        {
          name: "key",
          type: "select",
          required: true,
          label: "Clave de categoría",
          options: [
            { label: "Ad's", value: "ads" },
            { label: "Patrocinio", value: "patrocinio" },
            { label: "Branded", value: "branded" },
            { label: "Eventos especiales", value: "eventos" },
          ],
        },
        {
          name: "label",
          type: "text",
          required: true,
          label: "Nombre visible en sidebar",
        },
        {
          name: "formats",
          type: "array",
          label: "Formatos de esta categoría",
          maxRows: 8,
          fields: [
            { name: "tag", type: "text", label: "Mini tag (e.g. Ad-s, Patrocinio)" },
            { name: "title", type: "text", required: true, label: "Título del formato" },
            { name: "description", type: "textarea", label: "Descripción" },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Imagen preview",
            },
          ],
        },
      ],
    },
  ],
};
