import type { Block } from "payload";
import { anchorIdField } from "../shared-fields";

export const DituCalendarioBlock: Block = {
  slug: "ditu-calendario",
  labels: { singular: "Ditu Calendario", plural: "Ditu Calendarios" },
  fields: [
    anchorIdField,
    {
      name: "stickerLabel",
      type: "text",
      label: "Sticker (etiqueta rotada)",
      defaultValue: "ESTO SE VIENE",
    },
    {
      name: "heading",
      type: "text",
      label: "Titular",
      defaultValue: "Calendario",
    },
    {
      name: "subtitle",
      type: "text",
      label: "Subtítulo",
      defaultValue: "Los momentos que no te puedes perder.",
    },
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
    {
      name: "cta",
      type: "group",
      label: "CTA (pie del bloque)",
      fields: [
        {
          name: "boldText",
          type: "text",
          label: "Texto en negrita",
          defaultValue:
            "¡Asegura la presencia de tu marca en los eventos más importantes del país!",
        },
        {
          name: "text",
          type: "text",
          label: "Texto normal (tras la negrita)",
          defaultValue: "Contáctanos ahora y diseñemos juntos tu participación.",
        },
        {
          name: "buttonLabel",
          type: "text",
          label: "Etiqueta del botón",
          defaultValue: "Contáctanos",
        },
        {
          name: "buttonHref",
          type: "text",
          label: "Link del botón",
          defaultValue: "#contacto",
        },
      ],
    },
  ],
};
