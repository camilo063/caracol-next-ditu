import type { GlobalConfig } from "payload";

import { adminsOnly, publishedOrAuth } from "@/access";
import { globalTag, revalidateTag } from "@/lib/payload/cache-tags";
import { richHeadingField } from "@/fields/richHeading";

/**
 * SiteSettings — configuración global de SEO, OG, contacto fallback.
 * Solo admins lo editan.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  access: {
    read: publishedOrAuth,
    update: adminsOnly,
  },
  hooks: {
    afterChange: [async () => revalidateTag(globalTag("site-settings"), { expire: 0 })],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "SEO & Metadata",
          fields: [
            {
              name: "siteName",
              type: "text",
              defaultValue: "Caracol Next + Ditu",
            },
            {
              name: "defaultMetaTitle",
              type: "text",
              defaultValue: "Caracol Next + Ditu — Mediakit",
            },
            {
              name: "defaultMetaDescription",
              type: "textarea",
              defaultValue:
                "Mediakit oficial Caracol Next + Ditu. Audiencia, formatos de pauta y momentos clave del ecosistema Caracol.",
            },
            {
              name: "defaultOgImage",
              type: "upload",
              relationTo: "media",
              label: "Imagen OG por defecto",
            },
            {
              name: "twitterHandle",
              type: "text",
              admin: { placeholder: "@caracolnext" },
            },
          ],
        },
        {
          label: "Contacto fallback",
          fields: [
            {
              name: "fallbackEmail",
              type: "email",
              label: "Email de contacto por defecto",
              admin: {
                description: "Se usa cuando un block no tiene email propio definido.",
              },
            },
            {
              name: "fallbackWhatsapp",
              type: "text",
              label: "WhatsApp por defecto",
              admin: { placeholder: "573001234567" },
            },
          ],
        },
        {
          label: "Theme defaults",
          fields: [
            {
              name: "primaryBrand",
              type: "select",
              defaultValue: "caracol-next",
              options: [
                { label: "Caracol Next (azul)", value: "caracol-next" },
                { label: "Ditu (violeta)", value: "ditu" },
              ],
              admin: {
                description:
                  "Marca primaria del sitio. Usada como fallback cuando un layout no especifica theme.",
              },
            },
          ],
        },
        // ── Home Content ────────────────────────────────────────────────
        // Tab nombrado → crea namespace settings.homeContent.*
        {
          name: "homeContent",
          label: "Home Content",
          fields: [
            {
              name: "logoCaracolMedios",
              type: "upload",
              relationTo: "media",
              label: "Logo Caracol Medios",
              admin: {
                description:
                  "Logotipo del header del Home. Si está vacío, se usa el SVG inline.",
              },
            },
            {
              name: "digitalLabel",
              type: "text",
              label: 'Texto "DIGITAL"',
              defaultValue: "DIGITAL",
              admin: { placeholder: "DIGITAL" },
            },
            {
              name: "eyebrow",
              type: "text",
              label: "Eyebrow (tagline superior)",
              defaultValue: "Unidad digital #1 en Colombia",
            },
            richHeadingField("heading", "Título principal (partes)"),
            {
              name: "contactLabel",
              type: "text",
              label: "Texto botón Contáctenos",
              defaultValue: "Contáctenos",
            },
            {
              name: "brands",
              type: "group",
              label: "Marcas (cards de producto)",
              fields: [
                {
                  name: "caracolNext",
                  type: "group",
                  label: "Caracol Next",
                  fields: [
                    {
                      name: "logo",
                      type: "upload",
                      relationTo: "media",
                      label: "Logo (card)",
                      admin: {
                        description:
                          "Si está vacío, usa el wordmark SVG inline de Caracol Next.",
                      },
                    },
                    {
                      name: "description",
                      type: "array",
                      label: "Descripción (párrafos)",
                      labels: { singular: "Párrafo", plural: "Párrafos" },
                      fields: [{ name: "text", type: "text", required: true }],
                    },
                    {
                      name: "ctaLabel",
                      type: "text",
                      label: "Texto CTA",
                      defaultValue: "Conoce Caracol Next",
                    },
                    {
                      name: "href",
                      type: "text",
                      label: "URL destino",
                      defaultValue: "/caracol-next",
                    },
                  ],
                },
                {
                  name: "ditu",
                  type: "group",
                  label: "Ditu",
                  fields: [
                    {
                      name: "logo",
                      type: "upload",
                      relationTo: "media",
                      label: "Logo (card)",
                      admin: {
                        description: "Si está vacío, usa el wordmark SVG inline de Ditu.",
                      },
                    },
                    {
                      name: "description",
                      type: "array",
                      label: "Descripción (párrafos)",
                      labels: { singular: "Párrafo", plural: "Párrafos" },
                      fields: [{ name: "text", type: "text", required: true }],
                    },
                    {
                      name: "ctaLabel",
                      type: "text",
                      label: "Texto CTA",
                      defaultValue: "Conoce ditu",
                    },
                    {
                      name: "href",
                      type: "text",
                      label: "URL destino",
                      defaultValue: "/ditu",
                    },
                  ],
                },
              ],
            },
            {
              name: "stats",
              type: "array",
              label: "Métricas (4 cards)",
              labels: { singular: "Métrica", plural: "Métricas" },
              maxRows: 8,
              admin: {
                description:
                  "Se muestran en 2 filas de 2. Solo las primeras 4 se renderizan.",
                initCollapsed: true,
              },
              fields: [
                {
                  name: "icon",
                  type: "upload",
                  relationTo: "media",
                  label: "Ícono (40×40 SVG/PNG)",
                },
                {
                  name: "numericValue",
                  type: "number",
                  label: "Valor numérico (CountUp)",
                },
                { name: "prefix", type: "text", label: "Prefijo (ej. '+')" },
                { name: "suffix", type: "text", label: "Sufijo (ej. 'M', 'Min')" },
                {
                  name: "label",
                  type: "text",
                  label: "Label",
                  required: true,
                  admin: { placeholder: "usuarios" },
                },
                {
                  name: "accent",
                  type: "select",
                  label: "Color acento",
                  defaultValue: "caracolnext",
                  options: [
                    { label: "Caracol Next (azul)", value: "caracolnext" },
                    { label: "Ditu (violeta)", value: "ditu" },
                  ],
                },
                {
                  name: "lgWidth",
                  type: "number",
                  label: "Ancho desktop px (Figma)",
                  admin: { description: "272 / 340 / 328 / 288" },
                },
              ],
            },
            {
              name: "copyright",
              type: "text",
              label: "Copyright (pie de página)",
              defaultValue: "©2026 Caracol Comercial Digital",
            },
          ],
        },
      ],
    },
  ],
};
