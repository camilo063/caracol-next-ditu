import type { Block } from "payload";
import { anchorIdField, eventCategoryField, openInNewTabField } from "../shared-fields";

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
        // Las fechas se eligen con calendario (antes eran texto libre en formato
        // ISO, que el editor tenía que tipear a mano). Son las que ordenan el
        // calendario y las que deciden cuándo el evento deja de mostrarse.
        {
          name: "startDate",
          type: "date",
          required: true,
          label: "Fecha de inicio",
          admin: {
            date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
            description: "Los eventos se ordenan del más cercano al más lejano.",
          },
        },
        {
          name: "endDate",
          type: "date",
          required: true,
          label: "Fecha de fin",
          admin: {
            date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
            description:
              "El evento se muestra hasta este día inclusive; al día siguiente desaparece solo del calendario. Si dura un solo día, poné la misma fecha de inicio.",
          },
          // Sin esto, invertir las fechas por error produce textos absurdos en
          // la web ("DEL 04 DE MAYO AL 06 DE MARZO") y un orden equivocado.
          validate: (value: unknown, { siblingData }: { siblingData?: unknown }) => {
            const start = (siblingData as { startDate?: unknown } | undefined)?.startDate;
            if (!value || !start) return true;
            const end = new Date(value as string).getTime();
            const ini = new Date(start as string).getTime();
            if (Number.isNaN(end) || Number.isNaN(ini)) return true;
            return end >= ini || "La fecha de fin no puede ser anterior a la de inicio.";
          },
        },
        { name: "title", type: "text", required: true },
        { name: "subtitle", type: "text" },
        {
          name: "dateLabel",
          type: "text",
          label: "Texto de la fecha (opcional)",
          admin: {
            placeholder: "Se arma solo desde las fechas de arriba",
            description:
              "Si lo dejás vacío se escribe solo (ej. DEL 06 DE MARZO AL 04 DE MAYO). Llenalo únicamente si querés un texto distinto.",
          },
        },
        eventCategoryField("ditu"),
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
        openInNewTabField,
      ],
    },
  ],
};
