import type { Block } from "payload";

import { anchorIdField, ctaField, sectionHeaderFields } from "../shared-fields";

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
        { name: "image", type: "upload", relationTo: "media" },
        {
          name: "importance",
          type: "select",
          defaultValue: "high",
          options: [
            { label: "Crítico", value: "critical" },
            { label: "Alto", value: "high" },
            { label: "Medio", value: "medium" },
          ],
        },
        {
          name: "category",
          type: "select",
          admin: { description: "Permite agrupar por tipo." },
          options: [
            { label: "Deportes", value: "sports" },
            { label: "Entretenimiento", value: "entertainment" },
            { label: "Noticias", value: "news" },
            { label: "Especial", value: "special" },
            { label: "Otro", value: "other" },
          ],
        },
        {
          name: "badgeColor",
          type: "text",
          admin: {
            description:
              "Color hex del badge CATEGORÍA (override del color por categoría). Ej. #FFC200.",
            placeholder: "#015BC4",
          },
        },
        {
          name: "categoryLabel",
          type: "text",
          defaultValue: "CATEGORÍA",
          admin: {
            description: "Texto del pill superior. Default 'CATEGORÍA'.",
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
      ],
    },
  ],
};
