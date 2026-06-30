import type { Block } from "payload";

import { anchorIdField, sectionHeaderFields } from "../shared-fields";

/**
 * AudienceProfileBlock — "ADN Ditu: sabemos a quién le hablas".
 * Pie chart de género (% mujeres / % hombres) + bar chart de duración por canal.
 * Editable 100% desde admin.
 */
export const AudienceProfileBlock: Block = {
  slug: "audience-profile",
  labels: { singular: "Perfil de audiencia (ADN)", plural: "Perfiles de audiencia" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "genderSplit",
      type: "group",
      label: "Pie chart — distribución por género",
      fields: [
        {
          name: "femalePercent",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          defaultValue: 52,
          admin: { description: "% mujeres" },
        },
        {
          name: "femaleLabel",
          type: "text",
          defaultValue: "Mujeres",
        },
        {
          name: "maleLabel",
          type: "text",
          defaultValue: "Hombres",
        },
      ],
    },
    {
      name: "ageBars",
      type: "array",
      label: "Bar chart — duración por canal/segmento",
      labels: { singular: "Barra", plural: "Barras" },
      minRows: 1,
      maxRows: 8,
      fields: [
        { name: "label", type: "text", required: true, admin: { placeholder: "TV" } },
        { name: "value", type: "number", required: true, admin: { placeholder: "52" } },
        {
          name: "suffix",
          type: "text",
          defaultValue: "min",
          admin: { placeholder: "min" },
        },
      ],
    },
    {
      name: "footnote",
      type: "text",
      label: "Pie de bloque (fuente / nota)",
      admin: { placeholder: "● Fuente: Internas Ditu, abril 2026" },
    },
  ],
};
