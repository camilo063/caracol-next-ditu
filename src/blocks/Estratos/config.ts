import type { Block } from "payload";

import { anchorIdField, sectionHeaderFields } from "../shared-fields";

/**
 * EstratosBlock — "Y dónde encontrarlo" (Ditu).
 * Lista de 4 stats con porcentajes — distribución socioeconómica.
 */
export const EstratosBlock: Block = {
  slug: "estratos",
  labels: { singular: "Estratos / Segmentos", plural: "Estratos / Segmentos" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "items",
      type: "array",
      label: "Items",
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          admin: { placeholder: "Estrato 1 a 2" },
        },
        { name: "value", type: "number", required: true, admin: { placeholder: "22.7" } },
        { name: "suffix", type: "text", defaultValue: "%" },
        {
          name: "hint",
          type: "text",
          admin: { description: "Texto pequeño opcional bajo el % (ej. ciudad)." },
        },
      ],
    },
    {
      name: "footnote",
      type: "text",
      label: "Pie de bloque (fuente / nota)",
      admin: { placeholder: "● Fuente: DANE 2024" },
    },
  ],
};
