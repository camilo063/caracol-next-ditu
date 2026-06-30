import type { Field } from "payload";

import { networkOptions } from "@/blocks/shared-fields";

/**
 * Campos compartidos entre FooterCaracolNext y FooterDitu.
 * `useWave` permite habilitar el SVG decorativo de onda (referencia tono Wix de Ditu).
 */
export const footerSharedFields: Field[] = [
  {
    name: "logo",
    type: "upload",
    relationTo: "media",
    required: false,
  },
  {
    name: "tagline",
    type: "textarea",
    label: "Tagline corto bajo el logo",
  },
  {
    name: "columns",
    type: "array",
    label: "Columnas de links",
    labels: { singular: "Columna", plural: "Columnas" },
    maxRows: 5,
    fields: [
      { name: "heading", type: "text", required: true },
      {
        name: "links",
        type: "array",
        labels: { singular: "Link", plural: "Links" },
        fields: [
          { name: "label", type: "text", required: true },
          { name: "href", type: "text", required: true },
          { name: "openInNewTab", type: "checkbox", defaultValue: false },
        ],
      },
    ],
  },
  {
    name: "socialLinks",
    type: "array",
    label: "Redes sociales",
    labels: { singular: "Red", plural: "Redes" },
    fields: [
      {
        name: "network",
        type: "select",
        required: true,
        options: networkOptions as unknown as { label: string; value: string }[],
      },
      { name: "url", type: "text", required: true },
    ],
  },
  {
    name: "bottomLine",
    type: "text",
    label: "Línea inferior (legales / copyright)",
    defaultValue: "© Caracol Medios. Todos los derechos reservados.",
  },
  {
    name: "useWave",
    type: "checkbox",
    label: "Onda decorativa SVG en el tope del footer",
    defaultValue: false,
    admin: {
      description:
        "Habilítalo en Ditu para mantener el tono del Wix actual. En Caracol Next se recomienda dejar OFF para un look más serio.",
    },
  },
  {
    name: "tone",
    type: "select",
    label: "Tono visual",
    defaultValue: "dark",
    options: [
      { label: "Minimal (solo copyright pill)", value: "minimal" },
      { label: "Oscuro (negro)", value: "dark" },
      { label: "Caracol Next deep", value: "caracolnext-deep" },
      { label: "Ditu deep", value: "ditu-deep" },
      { label: "Default (theme)", value: "default" },
    ],
  },
];
