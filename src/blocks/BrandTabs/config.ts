import type { Block } from "payload";

import {
  anchorIdField,
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
          type: "relationship",
          relationTo: "brands",
          required: true,
          label: "Marca",
          admin: {
            description:
              "Elegí una marca del catálogo. Para agregar nuevas: colección Marcas.",
          },
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
          name: "tagline",
          type: "textarea",
          label: "Tagline / descripción corta",
          admin: {
            placeholder:
              "Referente de entretenimiento y contenido original para todo el país.",
          },
        },
        {
          name: "whyChoose",
          type: "richText",
          label: "Por qué elegir esta marca (opcional, richText)",
        },
        {
          name: "webMetrics",
          type: "group",
          label: "WEB — métricas de la marca",
          fields: [
            {
              name: "usersPerMonth",
              type: "number",
              admin: { placeholder: "3076977" },
            },
            {
              name: "usersLabel",
              type: "text",
              defaultValue: "Usuarios/mes",
            },
            {
              name: "viewsPerMonth",
              type: "number",
              admin: { placeholder: "11803973" },
            },
            { name: "viewsLabel", type: "text", defaultValue: "Vistas/mes" },
          ],
        },
        {
          name: "audience",
          type: "group",
          label: "Audiencia (legacy reach + nuevos charts)",
          fields: [
            { name: "reach", type: "number", required: true },
            {
              name: "reachLabel",
              type: "text",
              defaultValue: "Personas alcanzadas",
            },
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
            {
              name: "genderSplit",
              type: "group",
              label: "Pie chart — Género",
              fields: [
                {
                  name: "femalePercent",
                  type: "number",
                  min: 0,
                  max: 100,
                  admin: {
                    description: "% mujeres (0–100). 77 → 77% mujeres / 23% hombres.",
                  },
                },
                { name: "femaleLabel", type: "text", defaultValue: "Mujeres" },
                { name: "maleLabel", type: "text", defaultValue: "Hombres" },
              ],
            },
            {
              name: "agePicks",
              type: "array",
              label: "Bar chart — Edad Pico",
              admin: {
                description:
                  "Barras del bar chart. Marca `isPeak` en la franja con pico.",
                initCollapsed: true,
              },
              fields: [
                {
                  name: "range",
                  type: "text",
                  required: true,
                  admin: { placeholder: "55-64" },
                },
                {
                  name: "value",
                  type: "number",
                  required: true,
                  admin: { placeholder: "100" },
                },
                {
                  name: "isPeak",
                  type: "checkbox",
                  defaultValue: false,
                  admin: {
                    description: "Si está activo, esta barra se pinta en color brand.",
                  },
                },
              ],
            },
            {
              name: "peakAgeRange",
              type: "text",
              label: "Texto de pico (sub-título del bar chart)",
              admin: { placeholder: "Pico: 55-64 años" },
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
        {
          name: "dataSource",
          type: "text",
          label: "Fuente de información de las cifras",
          admin: {
            description:
              "Se muestra encima del botón “Conoce más”. Ej: Fuente: Comscore, mayo 2026.",
            placeholder: "Fuente: Comscore, mayo 2026",
          },
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
