import type { Block } from "payload";

import { anchorIdField, sectionHeaderFields } from "../shared-fields";

/**
 * SportsEventsBlock (solo Ditu).
 * "Audiencia que solo está en Ditu — argumento de venta único".
 */
export const SportsEventsBlock: Block = {
  slug: "sports-events",
  labels: { singular: "Eventos deportivos", plural: "Eventos deportivos" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "events",
      type: "array",
      label: "Eventos deportivos",
      labels: { singular: "Evento", plural: "Eventos" },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "dateStart", type: "date", required: true },
        { name: "sport", type: "text", required: true, admin: { placeholder: "Fútbol" } },
        { name: "league", type: "text", admin: { placeholder: "Liga BetPlay" } },
        { name: "image", type: "upload", relationTo: "media" },
        {
          name: "viewershipEstimate",
          type: "number",
          label: "Audiencia estimada",
        },
        {
          name: "exclusivity",
          type: "checkbox",
          label: "Exclusivo en Ditu",
          defaultValue: false,
        },
        {
          name: "ctaLabel",
          type: "text",
          admin: { placeholder: "Quiero pautar este evento" },
        },
        { name: "ctaHref", type: "text" },
      ],
    },
    {
      name: "highlightExclusive",
      type: "checkbox",
      label: "Resaltar eventos exclusivos",
      defaultValue: true,
    },
  ],
};
