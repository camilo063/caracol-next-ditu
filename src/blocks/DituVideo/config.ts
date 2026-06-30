import type { Block } from "payload";

import { anchorIdField, videoSourceFields } from "../shared-fields";

/**
 * DituVideoBlock — bloque fullwidth de imagen/video con scroll-scale animation.
 * Figma 512:2244. Aparece en /ditu dos veces con distintos backgrounds.
 *
 * El background CSS (gradient o color sólido) es editable para diferenciar
 * la 1ª instancia (#1E0E4C→#3A1A92) de la 2ª (#6C27D8→#251557).
 */
export const DituVideoBlock: Block = {
  slug: "ditu-video",
  labels: { singular: "Ditu Video", plural: "Ditu Videos" },
  fields: [
    anchorIdField,
    // Fuente del video: YouTube, link externo o archivo subido.
    ...videoSourceFields(),
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Imagen (poster / fallback)",
      admin: {
        description:
          "Si hay URL de YouTube, se usa como portada antes de reproducir. " +
          "Si no, se muestra sola con el efecto scroll-scale. Proporciones 507×285 recomendadas.",
      },
    },
    {
      name: "alt",
      type: "text",
      label: "Alt text de la imagen",
      admin: { placeholder: "Pantalla de la aplicación Ditu" },
    },
    {
      name: "background",
      type: "text",
      label: "Background CSS (gradient o color)",
      defaultValue: "linear-gradient(90deg, #1E0E4C 0%, #3A1A92 100%)",
      admin: {
        description:
          "Valor CSS completo. Ej: 'linear-gradient(90deg, #1E0E4C 0%, #3A1A92 100%)'. " +
          "2ª instancia usa: 'linear-gradient(90deg, #6C27D8 0%, #6020DF 47%, #471BA7 68%, #371881 82%, #251557 99%)'",
        placeholder: "linear-gradient(90deg, #1E0E4C 0%, #3A1A92 100%)",
      },
    },
  ],
};
