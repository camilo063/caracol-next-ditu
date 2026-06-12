import type { Block } from "payload";
import { anchorIdField } from "../shared-fields";

export const DituCalendarioBlock: Block = {
  slug: "ditu-calendario",
  labels: { singular: "Ditu Calendario", plural: "Ditu Calendarios" },
  fields: [
    anchorIdField,
    {
      name: "events",
      type: "array",
      label: "Eventos del calendario",
      maxRows: 30,
      fields: [
        {
          name: "dateLabel",
          type: "text",
          required: true,
          label: "Fecha texto (e.g. DEL 06 DE MARZO AL 04 DE MAYO)",
        },
        {
          name: "startDate",
          type: "text",
          required: true,
          label: "Fecha inicio ISO (YYYY-MM-DD)",
          admin: { placeholder: "2026-03-06" },
        },
        {
          name: "endDate",
          type: "text",
          required: true,
          label: "Fecha fin ISO (YYYY-MM-DD)",
          admin: { placeholder: "2026-05-04" },
        },
        { name: "title", type: "text", required: true },
        { name: "subtitle", type: "text" },
        { name: "category", type: "text", defaultValue: "Categoría" },
        {
          name: "badgeVariant",
          type: "select",
          defaultValue: "cyan",
          options: [
            { label: "Cyan", value: "cyan" },
            { label: "Violet", value: "violet" },
            { label: "Navy", value: "navy" },
            { label: "White", value: "white" },
          ],
        },
      ],
    },
  ],
};
