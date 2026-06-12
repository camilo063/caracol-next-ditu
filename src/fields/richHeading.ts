import type { ArrayField } from "payload";

/**
 * Campo reutilizable "richHeading" — array de partes de texto con peso tipográfico.
 * Permite modelar headings mixtos como:
 *   [{ text: "Conecta", weight: "extrabold" },
 *    { text: " tu marca con la audiencia ", weight: "semibold" },
 *    { text: "más relevante del país.", weight: "extrabold" }]
 *
 * Usado en: Home (SiteSettings.homeContent.heading), Hero Caracol Next, headings Ditu.
 */
export function richHeadingField(
  name = "heading",
  label = "Título (partes)",
): ArrayField {
  return {
    name,
    type: "array",
    label,
    admin: {
      description:
        "Cada parte tiene su propio peso tipográfico. Ej: 'Conecta' extrabold + ' tu marca' semibold.",
      initCollapsed: false,
    },
    fields: [
      {
        name: "text",
        type: "text",
        required: true,
        admin: { placeholder: "Conecta" },
      },
      {
        name: "weight",
        type: "select",
        label: "Peso tipográfico",
        defaultValue: "extrabold",
        options: [
          { label: "Regular", value: "regular" },
          { label: "Semibold", value: "semibold" },
          { label: "Extrabold", value: "extrabold" },
        ],
      },
    ],
  };
}
