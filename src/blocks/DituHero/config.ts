import type { Block } from "payload";

import { anchorIdField } from "../shared-fields";

/**
 * DituHeroBlock — hero fullscreen de la landing Ditu.
 * Figma 512:2246. Gradient #12082D → #3B1A93.
 *
 * Campos editables en C1: stickerText, buttons (label/href/icon).
 * Heading y descripción usan el fallback JSX del componente (C2+).
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
