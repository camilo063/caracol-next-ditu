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
        ctaField({ name: "cta", label: "CTA (opcional)" }),
      ],
    },
    {
      name: "displayMode",
      type: "select",
      defaultValue: "timeline",
      options: [
        { label: "Timeline horizontal", value: "timeline" },
        { label: "Grid", value: "grid" },
        { label: "Lista", value: "list" },
      ],
    },
  ],
};
