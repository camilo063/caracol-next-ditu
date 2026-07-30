import type { BasePayload, CollectionConfig } from "payload";

import { anyone, authenticated } from "@/access";
import { pageTag, revalidateTag } from "@/lib/payload/cache-tags";

/**
 * Igual que con las marcas: una categoría se embebe en las páginas vía
 * relationship y la query de páginas está cacheada con `unstable_cache`.
 * Renombrar una categoría o cambiarle el color NO toca el documento de la
 * página, así que hay que invalidar a mano el cache de cada página que pueda
 * referenciarla.
 */
async function revalidateAllPages(payload: BasePayload): Promise<void> {
  try {
    const pages = await payload.find({
      collection: "pages",
      limit: 100,
      depth: 0,
      pagination: false,
    });
    for (const p of pages.docs) {
      if (p.slug) revalidateTag(pageTag(p.slug));
    }
  } catch {
    // Fuera del contexto de Next (seed/scripts) o error de query — no-op.
  }
}

/**
 * EventCategories — las categorías de los badges de los calendarios,
 * editables desde el admin.
 *
 * Antes eran una lista hardcodeada en el código, así que agregar una categoría,
 * renombrarla o cambiarle el color requería un deploy. Ahora se administran
 * como cualquier otro contenido, igual que la colección de marcas.
 *
 * El color vive acá y no en cada evento: elegir la categoría de un evento
 * define el texto Y el color de su badge. Cada evento conserva un campo de
 * color propio como excepción puntual, pero lo normal es no tocarlo.
 *
 * Las paletas de las dos landings son distintas (Caracol Next usa los seis
 * "Categorias/01..06" del design system; Ditu su propia gama de violetas), por
 * eso cada categoría guarda un color por landing. Y con `scope` una categoría
 * puede existir en las dos, o ser exclusiva de una.
 */
export const EventCategories: CollectionConfig = {
  slug: "event-categories",
  labels: { singular: "Categoría de evento", plural: "Categorías de evento" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "scope", "colorNext", "colorDitu"],
    group: "Catálogos",
    description:
      "Las categorías que aparecen en el desplegable de los calendarios. El color de cada una es el color de su badge.",
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: "order",
  hooks: {
    afterChange: [
      async ({ req }) => {
        await revalidateAllPages(req.payload);
      },
    ],
    afterDelete: [
      async ({ req }) => {
        await revalidateAllPages(req.payload);
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nombre",
      admin: {
        description: "El texto que se ve en el badge. Se muestra siempre en mayúsculas.",
        placeholder: "FÚTBOL",
      },
    },
    {
      name: "scope",
      type: "select",
      required: true,
      defaultValue: "both",
      label: "¿Dónde se puede usar?",
      options: [
        { label: "En los dos calendarios", value: "both" },
        { label: "Solo en Caracol Next", value: "next" },
        { label: "Solo en Ditu", value: "ditu" },
      ],
      admin: {
        description:
          "Define en qué calendarios aparece esta categoría dentro del desplegable.",
      },
    },
    {
      name: "colorNext",
      type: "text",
      label: "Color en Caracol Next",
      defaultValue: "#2862FF",
      admin: {
        condition: (_, siblingData) => siblingData?.scope !== "ditu",
        description:
          "Hex del badge en el calendario de Caracol Next. Paleta del design system: #2862FF azul · #0000C4 azul oscuro · #FFC200 amarillo · #A139C6 morado · #FF0013 rojo · #05E8FD cyan.",
        placeholder: "#2862FF",
      },
    },
    {
      name: "colorDitu",
      type: "text",
      label: "Color en Ditu",
      defaultValue: "#77EDED",
      admin: {
        condition: (_, siblingData) => siblingData?.scope !== "next",
        description:
          "Hex del badge en el calendario de Ditu. Paleta Ditu: #77EDED cyan · #8232F0 violeta · #561BDB violeta medio · #12082D violeta oscuro · #FFFFFF blanco.",
        placeholder: "#77EDED",
      },
    },
    {
      name: "style",
      type: "select",
      defaultValue: "solid",
      label: "Estilo del badge",
      options: [
        { label: "Relleno", value: "solid" },
        { label: "Contorno (fondo transparente)", value: "outline" },
      ],
      admin: {
        description:
          "“Contorno” pinta solo el borde y el texto con el color, dejando el fondo transparente.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      label: "Orden en la lista",
      admin: {
        description: "Menor primero. Define cómo se ordenan en el desplegable.",
      },
    },
  ],
};
