import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/access";

/**
 * Brands — marcas del ecosistema Caracol, editables desde el admin.
 *
 * Reemplaza la antigua lista hardcodeada `brandOptions` (shared-fields) y
 * `BRAND_META` (lib/brand). Los bloques BrandTabs, Hero, AdFormats y
 * AIRecommendation referencian estas marcas vía relationship.
 *
 * El `slug` es el identificador estable (ej. "caracoltv"): el front lo usa
 * para reglas de layout por marca y paths de assets. Los colores se editan
 * por marca y se aplican como CSS vars en el tab/sección.
 */
export const Brands: CollectionConfig = {
  slug: "brands",
  labels: { singular: "Marca", plural: "Marcas" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "color"],
    group: "Catálogos",
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nombre",
      admin: { description: "Nombre visible de la marca. Ej. 'Caracol TV'." },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Slug (identificador)",
      admin: {
        description:
          "kebab/lowercase sin espacios. Ej. 'caracoltv'. Identificador estable usado por el front — no cambiar una vez publicado.",
        placeholder: "caracoltv",
      },
    },
    {
      name: "color",
      type: "text",
      required: true,
      label: "Color primario (hex)",
      defaultValue: "#015BC4",
      admin: {
        description:
          "Color de marca. Se aplica al heading y como --color-primary del tab.",
        placeholder: "#003381",
      },
    },
    {
      name: "colorDark",
      type: "text",
      label: "Color oscuro (hex)",
      admin: {
        description:
          "Usado en el panel derecho del tab. Si vacío, usa el color primario.",
        placeholder: "#001A40",
      },
    },
    {
      name: "colorAccent",
      type: "text",
      label: "Color accent (hex)",
      admin: {
        description: "Accent secundario (slice menor del pie chart). Opcional.",
        placeholder: "#00ACFF",
      },
    },
    {
      name: "chartPeak",
      type: "text",
      label: "Color pico de gráfica (hex)",
      admin: {
        description:
          "Color de la barra pico en el bar chart de edad. Si vacío, usa el primario.",
        placeholder: "#003381",
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "Logo de la marca",
      admin: {
        description: "Logo opcional. Si vacío, el front usa el fallback SVG/texto.",
      },
    },
  ],
};
