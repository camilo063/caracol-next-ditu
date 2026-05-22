import type { GlobalConfig } from "payload";

import { anyone, isAdmin } from "@/access";
import { revalidateGlobal } from "@/lib/cms-revalidate";

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
  hooks: {
    afterChange: [
      () => {
        revalidateGlobal("site-settings");
      },
    ],
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
            {
              name: "copyright",
              type: "text",
              defaultValue: "©2026 Caracol Comercial Digital",
              admin: {
                description:
                  "Copyright que aparece en el footer del Hub y en otros layouts.",
              },
            },
          ],
        },
        {
          label: "Mantenimiento",
          description:
            "Kill-switch para emergencias. Si está activo, todas las rutas públicas redirigen a la página de mantenimiento.",
          fields: [
            {
              name: "maintenanceMode",
              type: "group",
              label: false,
              fields: [
                {
                  name: "enabled",
                  type: "checkbox",
                  defaultValue: false,
                  admin: {
                    description: "Activar para sacar el sitio público de servicio.",
                  },
                },
                {
                  name: "message",
                  type: "textarea",
                  defaultValue: "Estamos trabajando en mejoras. Vuelve pronto.",
                  admin: {
                    description:
                      "Mensaje visible mientras el sitio está en mantenimiento.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
