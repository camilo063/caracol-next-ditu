import type { Block } from "payload";
import { anchorIdField } from "../shared-fields";

export const DituAdnBlock: Block = {
  slug: "ditu-adn",
  labels: { singular: "Ditu ADN", plural: "Ditu ADN" },
  fields: [
    anchorIdField,
    {
      name: "genderMalePercent",
      type: "number",
      label: "% Hombres (el % Mujeres se calcula como 100 - este valor)",
      defaultValue: 52,
      min: 0,
      max: 100,
    },
    {
      name: "ageBars",
      type: "array",
      label: "Barras de edad",
      maxRows: 10,
      fields: [
        { name: "label", type: "text", required: true, label: "Rango (e.g. 18-24)" },
        {
          name: "value",
          type: "number",
          required: true,
          label: "Altura relativa (px Figma)",
        },
        {
          name: "peak",
          type: "checkbox",
          defaultValue: false,
          label: "¿Es el pico? (destaca en violeta)",
        },
      ],
    },
    {
      name: "nseCards",
      type: "array",
      label: "Tarjetas NSE (estratos)",
      maxRows: 8,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Etiqueta (e.g. ESTRATO 3)",
        },
        {
          name: "value",
          type: "number",
          required: true,
          label: "Porcentaje (e.g. 37.8)",
        },
      ],
    },
  ],
};
