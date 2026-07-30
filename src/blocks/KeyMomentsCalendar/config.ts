import type { Block } from "payload";

import {
  anchorIdField,
  ctaField,
  eventCategoryField,
  openInNewTabField,
  sectionHeaderFields,
} from "../shared-fields";

/**
 * KeyMomentsCalendarBlock — calendario de momentos clave del año.
 * "Eventos y temporadas de alto impacto. Crear urgencia — 'pauta ahora antes del Mundial'".
 * Administrable 100% desde Payload.
 */
export const KeyMomentsCalendarBlock: Block = {
  slug: "key-moments",
  labels: { singular: "Momentos clave", plural: "Momentos clave" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "events",
      type: "array",
      label: "Eventos",
      labels: { singular: "Evento", plural: "Eventos" },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "dateStart", type: "date", required: true },
        {
          name: "dateEnd",
          type: "date",
          admin: { description: "Opcional, para temporadas." },
        },
        {
          name: "dateLabelOverride",
          type: "text",
          admin: {
            description:
              "Override del texto de fecha en la tarjeta. Si vacío, se calcula desde dateStart/dateEnd.",
            placeholder: "DEL 13 AL 17 DE MARZO",
          },
        },
        { name: "description", type: "textarea" },
        eventCategoryField("next"),
        {
          name: "badgeColor",
          type: "text",
          admin: {
            description:
              "Override manual del color. Si lo dejás vacío, el badge toma el color de la categoría elegida arriba. Ej. #FFC200.",
            placeholder: "#015BC4",
          },
        },
        {
          name: "categoryLabel",
          type: "text",
          label: "Texto del badge (excepción)",
          admin: {
            placeholder: "Se usa el nombre de la categoría",
            description:
              "Solo para un caso puntual en el que el badge deba decir algo distinto al nombre de la categoría. Normalmente va vacío.",
          },
        },
        ctaField({ name: "cta", label: "CTA (opcional)" }),
      ],
    },
    {
      name: "hidePastEvents",
      type: "checkbox",
      defaultValue: true,
      label: "Ocultar eventos pasados automáticamente",
      admin: {
        description:
          "Si está activo, los eventos cuya fecha ya pasó dejan de mostrarse solos. Desactívalo para mostrar todos los eventos siempre.",
      },
    },
    {
      name: "displayMode",
      type: "select",
      defaultValue: "grid",
      options: [
        { label: "Grid 4-col (responsive carrusel en mobile)", value: "grid" },
        { label: "Timeline horizontal", value: "timeline" },
        { label: "Lista", value: "list" },
      ],
    },
    {
      name: "ctaText",
      type: "group",
      label: "CTA del bloque",
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue:
            "¡Asegura la presencia de tu marca en los eventos más importantes del país!",
        },
        {
          name: "description",
          type: "text",
          defaultValue: "Contáctanos ahora y diseñemos juntos tu participación.",
        },
        { name: "label", type: "text", defaultValue: "Contáctenos" },
        { name: "href", type: "text", defaultValue: "#contacto" },
        openInNewTabField,
      ],
    },
  ],
};
