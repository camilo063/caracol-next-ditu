import type { Block } from "payload";

import {
  anchorIdField,
  brandOptions,
  ctaField,
  networkOptions,
  sectionHeaderFields,
} from "../shared-fields";

/**
 * BrandTabsBlock — bloque estrella de Caracol Next.
 * "Fusionar nuestras marcas + Audiencia + Redes" — tabs por marca con identidad propia.
 * Cada tab incluye: Por qué elegir X · Audiencia + Redes específicas · Formatos de pauta con specs.
 */
export const BrandTabsBlock: Block = {
  slug: "brand-tabs",
  labels: { singular: "Marcas (tabs)", plural: "Marcas (tabs)" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "tabs",
      type: "array",
      label: "Tabs por marca",
      labels: { singular: "Marca", plural: "Marcas" },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: "brand",
          type: "select",
          required: true,
          options: brandOptions as unknown as { label: string; value: string }[],
        },
        {
          name: "displayName",
          type: "text",
          label: "Nombre a mostrar (override)",
          admin: { description: "Si vacío, se usa el label del brand." },
        },
        {
          name: "brandLogo",
          type: "upload",
          relationTo: "media",
          label: "Logo de la marca",
        },
        {
          name: "brandColor",
          type: "text",
          label: "Color brand (hex)",
          admin: {
            description:
              "Ej. #00ACFF. Se aplica como --color-primary dentro del tab activo.",
            placeholder: "#015BC4",
          },
        },
        {
          name: "whyChoose",
          type: "richText",
          label: "Por qué elegir esta marca",
        },
        {
          name: "audience",
          type: "group",
          label: "Audiencia",
          fields: [
            { name: "reach", type: "number", required: true },
            { name: "reachLabel", type: "text", defaultValue: "Personas alcanzadas" },
            { name: "reachSuffix", type: "text" },
            {
              name: "highlights",
              type: "array",
              label: "Puntos destacados",
              admin: { initCollapsed: true },
              fields: [
                { name: "value", type: "text", required: true },
                { name: "label", type: "text", required: true },
                { name: "valueSuffix", type: "text" },
              ],
            },
          ],
        },
        {
          name: "networks",
          type: "array",
          label: "Redes específicas",
          admin: { initCollapsed: true },
          fields: [
            {
              name: "network",
              type: "select",
              required: true,
              options: networkOptions as unknown as { label: string; value: string }[],
            },
            { name: "handle", type: "text" },
            { name: "followers", type: "number", required: true },
            { name: "url", type: "text" },
          ],
        },
        {
          name: "adFormats",
          type: "array",
          label: "Formatos de pauta",
          labels: { singular: "Formato", plural: "Formatos" },
          admin: { initCollapsed: true },
          fields: [
            { name: "name", type: "text", required: true },
            { name: "image", type: "upload", relationTo: "media" },
            { name: "specs", type: "richText", label: "Specs técnicas" },
            {
              name: "downloadUrl",
              type: "text",
              label: "URL del briefing/PDF (opcional)",
            },
          ],
        },
        ctaField({
          name: "ctaContact",
          label: "CTA de contacto para esta marca (opcional)",
        }),
      ],
    },
    {
      name: "defaultTab",
      type: "number",
      label: "Tab activo por defecto (índice 0-based)",
      defaultValue: 0,
      min: 0,
    },
  ],
};
