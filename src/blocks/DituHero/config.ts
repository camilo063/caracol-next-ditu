import type { Block } from "payload";

import { anchorIdField } from "../shared-fields";

/**
 * DituHeroBlock — hero fullscreen de la landing Ditu.
 * Figma 512:2246. Gradient #12082D → #3B1A93.
 */
export const DituHeroBlock: Block = {
  slug: "ditu-hero",
  labels: { singular: "Ditu Hero", plural: "Ditu Heroes" },
  fields: [
    anchorIdField,
    {
      name: "stickerText",
      type: "text",
      label: "Texto del sticker",
      defaultValue: "TU MARCA",
      admin: {
        description: 'Texto del sticker rotado sobre el heading. Default: "TU MARCA".',
        placeholder: "TU MARCA",
      },
    },
    {
      name: "headingLine1",
      type: "text",
      label: "Heading — línea 1",
      defaultValue: "en todas las",
      admin: {
        description:
          'Primera línea del heading bajo el sticker. Default: "en todas las".',
        placeholder: "en todas las",
      },
    },
    {
      name: "headingLine2",
      type: "text",
      label: "Heading — línea 2",
      defaultValue: "pantallas,",
      admin: {
        description: 'Segunda línea del heading. Default: "pantallas,".',
        placeholder: "pantallas,",
      },
    },
    {
      name: "headingAccent",
      type: "text",
      label: "Heading — línea accent (cyan)",
      defaultValue: "en todo momento",
      admin: {
        description:
          'Última línea del heading en color cyan #77EDED. Default: "en todo momento".',
        placeholder: "en todo momento",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Descripción",
      defaultValue:
        "Somos ditu la plataforma OTT que integra lo mejor de Caracol Televisión en un ecosistema multiplataforma, desde la pantalla grande hasta el smartphone. Ofrecemos una experiencia gratuita de fácil acceso que se convierte en la vitrina estratégica ideal para que tu marca conecte con una audiencia masiva, fiel y comprometida.",
      admin: {
        description: "Párrafo descriptivo bajo el heading.",
        rows: 4,
      },
    },
    {
      name: "buttons",
      type: "array",
      label: "Botones de acción",
      maxRows: 5,
      labels: { singular: "Botón", plural: "Botones" },
      admin: {
        description:
          "Botones outline del hero (Google Play, App Store, Portal web, etc.).",
        initCollapsed: true,
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Etiqueta",
          required: true,
          admin: { placeholder: "Google Play" },
        },
        {
          name: "href",
          type: "text",
          label: "URL",
          defaultValue: "#",
          admin: { placeholder: "https://play.google.com/…" },
        },
        {
          name: "iconKey",
          type: "select",
          label: "Ícono (key estático)",
          defaultValue: "tv",
          options: [
            { label: "Google Play", value: "googleplay" },
            { label: "App Store", value: "appstore" },
            { label: "TV / Web", value: "tv" },
          ],
          admin: {
            description: "Fallback si iconMedia no tiene valor.",
          },
        },
        {
          name: "iconMedia",
          type: "upload",
          relationTo: "media",
          label: "Ícono (Media — override)",
          admin: {
            description: "Si se sube un ícono aquí, se usa en lugar del key estático.",
          },
        },
      ],
    },
  ],
};
