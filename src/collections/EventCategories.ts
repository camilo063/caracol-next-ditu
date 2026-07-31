import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/access";
import { hexColorFieldProps } from "@/lib/color";
import { revalidateAllPages } from "@/lib/payload/revalidate-pages";

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
      unique: true,
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
      ...hexColorFieldProps,
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
      ...hexColorFieldProps,
      admin: {
        condition: (_, siblingData) => siblingData?.scope !== "next",
        description:
          "Hex del badge en el calendario de Ditu. Paleta Ditu: #77EDED cyan · #8232F0 violeta · #561BDB violeta medio · #12082D violeta oscuro · #FFFFFF blanco.",
        placeholder: "#77EDED",
      },
    },
    {
      name: "styleNext",
      type: "select",
      defaultValue: "solid",
      label: "Diseño en Caracol Next",
      options: [
        { label: "Relleno", value: "solid" },
        { label: "Contorno (fondo blanco)", value: "outline" },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.scope !== "ditu",
        description:
          "Relleno = el fondo del badge es el color y el texto se ajusta solo. Contorno = el fondo es blanco y el color va en el borde y en el texto. El design system de Caracol Next usa relleno en sus seis variantes.",
      },
    },
    {
      name: "styleDitu",
      type: "select",
      defaultValue: "solid",
      label: "Diseño en Ditu",
      options: [
        { label: "Relleno", value: "solid" },
        { label: "Contorno (fondo blanco)", value: "outline" },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.scope !== "next",
        description:
          "Relleno = variantes Categoría 01, 02, 03 y 05 del design system. Contorno = variantes 04 y 06: el fondo del badge es blanco y el color va en el borde y en el texto. Como ese fondo es blanco, el contorno pide un color oscuro — con un color muy claro el texto no se lee.",
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
