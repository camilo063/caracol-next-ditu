import type { Block } from "payload";
import { anchorIdField, openInNewTabField, videoUrlFields } from "../shared-fields";

export const DituPautaBlock: Block = {
  slug: "ditu-pauta",
  labels: { singular: "Ditu Pauta", plural: "Ditu Pautas" },
  fields: [
    anchorIdField,
    {
      name: "stickerLabel",
      type: "text",
      label: "Sticker (etiqueta rotada)",
      defaultValue: "Impulsa tu marca",
    },
    {
      name: "heading",
      type: "group",
      label: "Titular principal (2 líneas)",
      fields: [
        { name: "line1", type: "text", label: "Línea 1", defaultValue: "con formatos" },
        {
          name: "line2",
          type: "text",
          label: "Línea 2",
          defaultValue: "de alto impacto.",
        },
      ],
    },
    {
      name: "subtitle",
      type: "textarea",
      label: "Subtítulo",
      defaultValue:
        "Diseñados para capturar atención en nuestro ecosistema digital — de display a video, audio y patrocinios.",
    },
    {
      name: "sidebarLabel",
      type: "text",
      label: "Sticker del sidebar",
      defaultValue: "Formatos de pauta",
    },
    {
      name: "categories",
      type: "array",
      label: "Categorías de pauta",
      maxRows: 6,
      fields: [
        {
          name: "key",
          type: "select",
          required: true,
          label: "Clave de categoría",
          options: [
            { label: "Ad's", value: "ads" },
            { label: "Patrocinio", value: "patrocinio" },
            { label: "Branded", value: "branded" },
            { label: "Eventos especiales", value: "eventos" },
          ],
        },
        {
          name: "label",
          type: "text",
          required: true,
          label: "Nombre visible en sidebar",
        },
        {
          name: "formats",
          type: "array",
          label: "Formatos de esta categoría",
          maxRows: 8,
          fields: [
            { name: "tag", type: "text", label: "Mini tag (e.g. Ad-s, Patrocinio)" },
            { name: "title", type: "text", required: true, label: "Título del formato" },
            { name: "description", type: "textarea", label: "Descripción" },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Imagen o video (subir archivo)",
              admin: {
                description:
                  "Subí una imagen o un video (mp4). Si es video, se reproduce en el preview. " +
                  "También podés usar una URL de YouTube/externa abajo.",
              },
            },
            ...videoUrlFields,
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
          defaultValue: "Descargar Especificaciones",
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
