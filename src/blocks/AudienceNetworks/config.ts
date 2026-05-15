import type { Block } from "payload";

import { anchorIdField, networkOptions, sectionHeaderFields } from "../shared-fields";

/**
 * AudienceNetworksBlock — fusión de Audiencia + Redes globales.
 * "Una sola mirada para entender el poder del ecosistema."
 * Valores 100% editables manualmente desde Payload (MVP sin APIs).
 */
export const AudienceNetworksBlock: Block = {
  slug: "audience-networks",
  labels: { singular: "Audiencia + Redes", plural: "Audiencia + Redes" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "audience",
      type: "group",
      label: "Audiencia (alcance global)",
      fields: [
        {
          name: "reach",
          type: "number",
          label: "Alcance total",
          required: true,
          admin: {
            description: "Número crudo (ej. 3000000 = 3M). El front lo formatea.",
          },
        },
        {
          name: "reachLabel",
          type: "text",
          label: "Etiqueta del alcance",
          defaultValue: "Personas alcanzadas",
        },
        {
          name: "reachSuffix",
          type: "text",
          label: "Sufijo opcional (ej. 'M', 'K')",
        },
        {
          name: "breakdown",
          type: "array",
          label: "Desglose (opcional)",
          admin: {
            description: "Subsegmentos del alcance: por canal, por demografía, etc.",
            initCollapsed: true,
          },
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "number", required: true },
            { name: "suffix", type: "text" },
          ],
        },
      ],
    },
    {
      name: "networks",
      type: "array",
      label: "Redes sociales",
      labels: { singular: "Red", plural: "Redes" },
      admin: { initCollapsed: true },
      fields: [
        {
          name: "network",
          type: "select",
          required: true,
          options: networkOptions as unknown as { label: string; value: string }[],
        },
        { name: "handle", type: "text", admin: { placeholder: "@caracolnext" } },
        { name: "followers", type: "number", required: true },
        {
          name: "growth",
          type: "number",
          admin: { description: "% crecimiento mensual (opcional)" },
        },
        { name: "url", type: "text" },
      ],
    },
    {
      name: "highlightedNetwork",
      type: "text",
      label: "Red destacada (slug)",
      admin: {
        description:
          "Slug de la red que se renderiza ampliada. Ej. 'instagram'. Si vacío, se muestran todas iguales.",
      },
    },
  ],
};
