import type { Block } from "payload";
import { anchorIdField } from "../shared-fields";

export const DituAdnBlock: Block = {
  slug: "ditu-adn",
  labels: { singular: "Ditu ADN", plural: "Ditu ADN" },
  fields: [
    anchorIdField,
    {
      name: "stickerLabel",
      type: "text",
      label: "Sticker (etiqueta rotada)",
      defaultValue: "ADN DITU",
    },
    {
      name: "heading",
      type: "group",
      label: "Titular principal",
      admin: { description: 'Se renderiza como "{accent en cyan} {resto}".' },
      fields: [
        { name: "accent", type: "text", label: "Acento (cyan)", defaultValue: "Sabemos" },
        {
          name: "rest",
          type: "text",
          label: "Resto (blanco)",
          defaultValue: "a quién le hablas.",
        },
      ],
    },
    {
      name: "gender",
      type: "group",
      label: "Card Género (textos)",
      fields: [
        { name: "label", type: "text", label: "Etiqueta (pill)", defaultValue: "Género" },
        {
          name: "subtitle",
          type: "text",
          label: "Subtítulo (tras el %)",
          defaultValue: "nos prefieren",
          admin: { description: 'Se muestra como "{% hombres}% {este texto}".' },
        },
        {
          name: "maleLabel",
          type: "text",
          label: "Etiqueta Hombres",
          defaultValue: "Hombres",
        },
        {
          name: "femaleLabel",
          type: "text",
          label: "Etiqueta Mujeres",
          defaultValue: "Mujeres",
        },
      ],
    },
    {
      name: "genderMalePercent",
      type: "number",
      label: "% Hombres (el % Mujeres se calcula como 100 - este valor)",
      defaultValue: 52,
      min: 0,
      max: 100,
    },
    {
      name: "agePeak",
      type: "group",
      label: "Card Edad pico (textos)",
      fields: [
        {
          name: "label",
          type: "text",
          label: "Etiqueta (pill)",
          defaultValue: "EDAD PICO",
        },
        {
          name: "text",
          type: "text",
          label: "Texto del pico",
          defaultValue: "Pico: 55-64 años",
        },
      ],
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
          label: "Porcentaje (e.g. 18.5)",
          admin: {
            description:
              "Porcentaje de la audiencia en este rango. La altura de la barra se calcula automáticamente: la barra con mayor % llena el alto y el resto queda proporcional.",
            placeholder: "18.5",
          },
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
      name: "secondHeading",
      type: "group",
      label: "Segundo titular (NSE)",
      admin: { description: 'Se renderiza en 2 líneas: "{pre}" / "{accent en cyan}".' },
      fields: [
        { name: "pre", type: "text", label: "Línea 1 (blanco)", defaultValue: "y dónde" },
        {
          name: "accent",
          type: "text",
          label: "Línea 2 (cyan)",
          defaultValue: "encontrarlo",
        },
      ],
    },
    {
      name: "nseDescription",
      type: "textarea",
      label: "Descripción NSE",
      defaultValue:
        "El nivel socioeconómico de nuestra audiencia refleja la Colombia real. Diversa, masiva y lista para conectar con tu marca.",
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
    {
      name: "source",
      type: "text",
      label: "Fuente (pie del bloque)",
      defaultValue: "Fuente: TGI CO 2025",
    },
  ],
};
