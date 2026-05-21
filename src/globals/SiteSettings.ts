import type { GlobalConfig } from "payload";

import { anyone, isAdmin } from "@/access";

/**
 * SiteSettings — configuración global de SEO, OG, contacto fallback.
 * Solo admins lo editan. Lectura pública (los campos son no-secretos y los
 * layouts SSR los leen sin auth).
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  access: {
    read: anyone,
    update: isAdmin,
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
      ],
    },
  ],
};
