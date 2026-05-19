import type { Block } from "payload";

import { anchorIdField, brandOptions, ctaField } from "../shared-fields";

/**
 * HeroBlock — sección hero principal de cada landing.
 * Caracol Next: "Por qué elegir Caracol Next" — mensaje comercial fuerte.
 * Ditu: "Por qué elegir Ditu" — mix de datos estrella (3M pantallas + 42 min watch time).
 */
export const HeroBlock: Block = {
  slug: "hero",
  labels: { singular: "Hero", plural: "Heroes" },
  fields: [
    anchorIdField,
    {
      name: "eyebrow",
      type: "text",
      label: "Eyebrow (etiqueta superior, ej. 'Caracol Next' o 'Ditu')",
    },
    {
      name: "heading",
      type: "text",
      label: "Título principal (línea 1, Regular)",
      required: true,
    },
    {
      name: "headingBold",
      type: "text",
      label: "Título principal — línea 2 (Bold)",
      admin: {
        description:
          "Segunda línea del título en bold. Para el patrón Figma: línea 1 Regular + línea 2 Bold, mismo tamaño.",
        placeholder: "servicio de tu marca.",
      },
    },
    {
      name: "subheading",
      type: "textarea",
      label: "Subtítulo / Tagline",
    },
    {
      name: "keyStats",
      type: "array",
      label: "Métricas destacadas",
      labels: { singular: "Métrica", plural: "Métricas" },
      admin: {
        description:
          "Hasta 4 métricas grandes en el hero. Ej: '3M pantallas activas', '42 min watch time'.",
        initCollapsed: true,
      },
      maxRows: 4,
      fields: [
        { name: "value", type: "text", required: true, admin: { placeholder: "3" } },
        {
          name: "valuePrefix",
          type: "text",
          admin: { placeholder: "$" },
        },
        {
          name: "valueSuffix",
          type: "text",
          admin: { placeholder: "M" },
        },
        {
          name: "label",
          type: "text",
          required: true,
          admin: { placeholder: "Pantallas activas" },
        },
        {
          name: "hint",
          type: "text",
          admin: { description: "Texto pequeño opcional bajo el label" },
        },
      ],
    },
    {
      name: "backgroundImage",
      type: "upload",
      relationTo: "media",
      label: "Imagen de fondo (opcional)",
    },
    {
      name: "backgroundVideo",
      type: "upload",
      relationTo: "media",
      label: "Video de fondo (opcional, mp4 ≤ 8MB)",
      admin: {
        description:
          "Si está presente, sustituye la imagen de fondo. Se reproduce muteado en loop.",
      },
    },
    {
      name: "brandIcons",
      type: "array",
      label: "Fila de íconos de marca (opcional)",
      labels: { singular: "Marca", plural: "Marcas" },
      admin: {
        description:
          "Fila de íconos del ecosistema bajo el subtítulo (Caracol Next). 6–10 marcas máximo.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "brand",
          type: "select",
          options: brandOptions as unknown as { label: string; value: string }[],
          required: true,
        },
        { name: "icon", type: "upload", relationTo: "media" },
      ],
    },
    ctaField({ name: "primaryCta", label: "CTA primario" }),
    ctaField({ name: "secondaryCta", label: "CTA secundario (opcional)" }),
    {
      name: "tone",
      type: "select",
      label: "Tono visual",
      defaultValue: "default",
      options: [
        { label: "Default (background del theme)", value: "default" },
        { label: "Caracol Next deep (azul oscuro)", value: "caracolnext-deep" },
        { label: "Ditu deep (violeta oscuro)", value: "ditu-deep" },
        { label: "Imagen full-bleed con overlay", value: "image-overlay" },
      ],
    },
  ],
};
