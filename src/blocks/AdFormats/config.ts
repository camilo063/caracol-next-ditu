import type { Block } from "payload";

import { anchorIdField, sectionHeaderFields, videoUrlFields } from "../shared-fields";

/**
 * AdFormatsBlock — Formatos de pauta globales.
 * "Vista global de todos los formatos del ecosistema. Ver toda la oferta sin entrar marca por marca."
 */
export const AdFormatsBlock: Block = {
  slug: "ad-formats",
  labels: { singular: "Formatos de pauta", plural: "Formatos de pauta" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "formats",
      type: "array",
      label: "Formatos",
      labels: { singular: "Formato", plural: "Formatos" },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "brand",
          type: "relationship",
          relationTo: "brands",
          required: false,
          label: "Marca",
          admin: { description: "Opcional. Marca asociada al formato." },
        },
        {
          name: "category",
          type: "select",
          options: [
            { label: "Display", value: "display" },
            { label: "Video", value: "video" },
            { label: "Audio", value: "audio" },
            { label: "Branded Content", value: "branded" },
            { label: "Patrocinio", value: "sponsorship" },
            { label: "Multigaleria", value: "multigallery" },
            { label: "Otro", value: "other" },
          ],
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Imagen o video (subir archivo)",
          admin: {
            description:
              "Subí una imagen o un video (mp4). Si es video se reproduce en el modal. " +
              "También podés usar una URL de YouTube/externa abajo.",
          },
        },
        ...videoUrlFields,
        {
          name: "specs",
          type: "richText",
          label: "Specs técnicas (formato, peso, duración…)",
        },
        { name: "downloadUrl", type: "text", label: "URL del briefing/PDF (opcional)" },
        {
          name: "modal",
          type: "group",
          label: "Modal — Detalle del formato",
          fields: [
            {
              name: "title",
              type: "text",
              label: "Título del modal (override del name)",
              admin: {
                description:
                  "Permite agrupar varios formatos bajo un nombre conceptual. Ej. 'Banners de Alto Impacto' para Banner Slider, Banner Multigalería, etc.",
                placeholder: "Banners de Alto Impacto",
              },
            },
            {
              name: "description",
              type: "textarea",
              label: "Descripción larga (lado derecho del modal)",
              admin: {
                placeholder:
                  "Formatos interactivos diseñados para integrar múltiples piezas o imágenes en un único espacio creativo…",
              },
            },
            {
              name: "ctaLabel",
              type: "text",
              defaultValue: "Contáctanos",
              label: "Texto del CTA inferior del modal",
            },
            {
              name: "ctaHref",
              type: "text",
              defaultValue: "#contacto",
              label: "URL del CTA",
            },
            {
              name: "ctaOpenInNewTab",
              type: "checkbox",
              defaultValue: false,
              label: "Abrir el CTA en una pestaña nueva",
            },
            {
              name: "childTabs",
              type: "array",
              label: "Sub-tabs (variantes del formato)",
              labels: { singular: "Variante", plural: "Variantes" },
              admin: {
                description:
                  "Cada tab cambia la imagen y la descripción dentro del modal. Ej. Banner Slider / Banner Multigalería / Expandible Roll Over / Banner Hover Reveal.",
                initCollapsed: true,
              },
              fields: [
                { name: "label", type: "text", required: true },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  label: "Imagen o video (subir archivo)",
                  admin: {
                    description:
                      "Imagen o video (mp4). También podés usar una URL de YouTube/externa abajo.",
                  },
                },
                ...videoUrlFields,
                {
                  name: "description",
                  type: "textarea",
                  label: "Descripción (override de la general del modal)",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "displayMode",
      type: "select",
      defaultValue: "grid",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Tabla", value: "table" },
        { label: "Acordeón", value: "accordion" },
        { label: "Tabs verticales (Ditu)", value: "vertical-tabs" },
      ],
    },
    {
      name: "filtersEnabled",
      type: "checkbox",
      label: "Habilitar filtros por marca/categoría",
      defaultValue: true,
    },
    {
      name: "footerCta",
      type: "group",
      label: "CTA inferior del bloque (descargar especificaciones)",
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
        { name: "label", type: "text", defaultValue: "Descargar Especificaciones" },
        {
          name: "linkType",
          type: "radio",
          defaultValue: "link",
          label: "¿Qué hace el botón?",
          options: [
            { label: "Ir a un enlace (URL)", value: "link" },
            { label: "Descargar un archivo", value: "file" },
          ],
          admin: {
            description:
              "Elegí si el botón lleva a una URL o descarga un archivo subido.",
          },
        },
        {
          name: "href",
          type: "text",
          defaultValue: "#contacto",
          label: "Enlace (URL)",
          admin: {
            condition: (_, siblingData) => siblingData?.linkType !== "file",
          },
        },
        {
          name: "openInNewTab",
          type: "checkbox",
          defaultValue: false,
          label: "Abrir el enlace en una pestaña nueva",
          admin: {
            condition: (_, siblingData) => siblingData?.linkType !== "file",
            description:
              "Solo para enlaces. Los archivos siempre se abren en pestaña nueva.",
          },
        },
        {
          name: "file",
          type: "upload",
          relationTo: "media",
          label: "Archivo a descargar",
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === "file",
            description: "PDF, imagen u otro archivo que el usuario descargará.",
          },
        },
      ],
    },
  ],
};
