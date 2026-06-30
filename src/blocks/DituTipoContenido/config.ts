import type { Block } from "payload";
import { anchorIdField } from "../shared-fields";

export const DituTipoContenidoBlock: Block = {
  slug: "ditu-tipo-contenido",
  labels: { singular: "Ditu Tipo de Contenido", plural: "Ditu Tipo de Contenido" },
  fields: [
    anchorIdField,
    {
      name: "tabs",
      type: "array",
      label: "Tabs de contenido",
      maxRows: 5,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Nombre del tab (e.g. FAST)",
        },
        {
          name: "description",
          type: "textarea",
          label: "Descripción del tipo de contenido",
        },
      ],
    },
  ],
};
