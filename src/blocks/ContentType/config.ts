import type { Block } from "payload";

import { anchorIdField, sectionHeaderFields } from "../shared-fields";

/**
 * ContentTypeBlock — "Tipo de contenido: 3 formas de habitar la pantalla" (Ditu).
 * Pills/tabs horizontales — cada tipo tiene un label, descripción y opcionalmente un asset.
 */
export const ContentTypeBlock: Block = {
  slug: "content-type",
  labels: { singular: "Tipo de contenido", plural: "Tipo de contenido" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "types",
      type: "array",
      label: "Tipos de contenido",
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: "label", type: "text", required: true, admin: { placeholder: "FAST" } },
        {
          name: "description",
          type: "textarea",
          admin: {
            placeholder: "Canales lineales gratuitos con publicidad — programación 24/7.",
          },
        },
      ],
    },
    {
      name: "defaultIndex",
      type: "number",
      defaultValue: 0,
      min: 0,
      admin: { description: "Índice del tab activo por defecto (0-based)." },
    },
  ],
};
