import type { Block, Field } from "payload";

import { anchorIdField, sectionHeaderFields } from "../shared-fields";

/**
 * Multimedia compartida — usada por la categoría principal y por cada secondary tab.
 */
const multimediaFields: Field[] = [
  {
    name: "type",
    type: "select",
    required: true,
    defaultValue: "youtube",
    options: [
      { label: "YouTube embed", value: "youtube" },
      { label: "Imagen", value: "image" },
      { label: "Video MP4 propio", value: "video" },
    ],
  },
  {
    name: "youtubeUrl",
    type: "text",
    label: "URL del video YouTube",
    admin: {
      condition: (_data, siblingData) => siblingData?.type === "youtube",
      placeholder: "https://www.youtube.com/watch?v=...",
    },
  },
  {
    name: "image",
    type: "upload",
    relationTo: "media",
    admin: {
      condition: (_data, siblingData) =>
        siblingData?.type === "image" || siblingData?.type === "video",
    },
  },
  {
    name: "video",
    type: "upload",
    relationTo: "media",
    admin: { condition: (_data, siblingData) => siblingData?.type === "video" },
  },
  {
    name: "captionTag",
    type: "text",
    label: "Tag inferior (ej. 'Video Podcast')",
    admin: { placeholder: "Video Podcast" },
  },
  {
    name: "titleOverlay",
    type: "text",
    label: "Título sobre el video (ej. 'Reel 2025 Caracol Next')",
  },
  {
    name: "logoTopLeft",
    type: "upload",
    relationTo: "media",
    label: "Logo overlay top-left (ej. CARACOLNEXT)",
  },
  {
    name: "logoTopRight",
    type: "upload",
    relationTo: "media",
    label: "Logo overlay top-right (ej. BumBox)",
  },
];

/**
 * BrandedContentBlock — matching Figma "Branded Content" Caracol Next.
 *
 * Layout:
 * - Desktop: 2-col. Izquierda = título + descripción + tabs principales.
 *   Derecha = multimedia con overlays.
 * - Mobile: slider de cards con focus + modal fullscreen al "Ver más".
 *
 * Estructura:
 * - `categories[]` — pestañas principales (Branded Content, Video Podcast,
 *   Producción Comercial, Contenido Editorial). Cada una con su heading,
 *   descripción y multimedia.
 * - Cada categoría puede tener `secondaryTabs[]` que solo cambian el multimedia
 *   (ej. Realities / Series Web / Talk Shows / Lives / Documental).
 */
export const BrandedContentBlock: Block = {
  slug: "branded-content",
  labels: { singular: "Branded Content", plural: "Branded Content" },
  dbName: "branded",
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "categories",
      type: "array",
      label: "Categorías principales (tabs)",
      labels: { singular: "Categoría", plural: "Categorías" },
      minRows: 1,
      maxRows: 6,
      admin: {
        description:
          "Cada tab cambia el contenido completo de la sección (título, descripción, multimedia).",
        initCollapsed: true,
      },
      fields: [
        {
          name: "key",
          type: "text",
          required: true,
          admin: {
            description: "Slug interno único (ej. 'branded-content').",
            placeholder: "branded-content",
          },
        },
        {
          name: "label",
          type: "text",
          required: true,
          admin: { placeholder: "Branded Content" },
        },
        {
          name: "heading",
          type: "text",
          required: true,
          admin: { placeholder: "Branded Content" },
        },
        {
          name: "description",
          type: "textarea",
          admin: {
            placeholder: "Domina el formato con mayor retención del entorno digital…",
          },
        },
        {
          name: "multimedia",
          type: "group",
          label: "Multimedia principal",
          fields: multimediaFields,
        },
        {
          name: "secondaryTabs",
          type: "array",
          label: "Secondary tabs (cambian solo el multimedia)",
          labels: { singular: "Sub-tab", plural: "Sub-tabs" },
          dbName: "subtab",
          admin: {
            description:
              "Opcional. Ej. Realities / Series Web / Talk Shows / Lives / Documental.",
            initCollapsed: true,
          },
          fields: [
            { name: "label", type: "text", required: true },
            {
              name: "multimedia",
              type: "group",
              fields: multimediaFields,
            },
          ],
        },
      ],
    },
    {
      name: "defaultIndex",
      type: "number",
      defaultValue: 0,
      min: 0,
      admin: { description: "Tab activa por defecto (0-based)." },
    },
  ],
};
