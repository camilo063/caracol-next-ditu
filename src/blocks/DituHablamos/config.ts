import type { Block } from "payload";
import { anchorIdField, openInNewTabField } from "../shared-fields";

export const DituHablamosBlock: Block = {
  slug: "ditu-hablamos",
  labels: { singular: "Ditu Hablamos", plural: "Ditu Hablamos" },
  fields: [
    anchorIdField,
    {
      name: "stickerLabel",
      type: "text",
      label: "Texto del sticker rotado",
      defaultValue: "¿HABLAMOS?",
      admin: { placeholder: "¿HABLAMOS?" },
    },
    {
      name: "heading",
      type: "text",
      label: "Heading — línea 1 (blanco)",
      defaultValue: "Lleva tu marca",
      admin: { placeholder: "Lleva tu marca" },
    },
    {
      name: "headingAccent",
      type: "text",
      label: "Heading — línea 2 acento (cyan, va después de «al»)",
      defaultValue: "siguiente nivel.",
      admin: {
        description:
          'El componente antepone "al " a este texto. Solo editar la parte cyan.',
        placeholder: "siguiente nivel.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Descripción",
      defaultValue: "Cuéntanos tus objetivos y armemos juntos la mejor estrategia.",
    },
    {
      name: "cta",
      type: "group",
      label: "CTA",
      fields: [
        {
          name: "label",
          type: "text",
          label: "Texto del botón",
          defaultValue: "Contáctanos",
          admin: { placeholder: "Contáctanos" },
        },
        {
          name: "href",
          type: "text",
          label: "Destino (anchor o URL)",
          defaultValue: "#contacto",
          admin: { placeholder: "#contacto" },
        },
        openInNewTabField,
      ],
    },
    // Mascota: /ditu/mascot/pato-ditu.svg — asset estático en /public.
    // No se expone como campo Media: el SVG está optimizado para la posición
    // absoluta del layout y no hay alternativa prevista en el diseño aprobado.
  ],
};
