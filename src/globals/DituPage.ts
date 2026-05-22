import type { GlobalConfig } from "payload";

import { anyone, isAdminOrEditor } from "@/access";

/**
 * DituPage — global que pobla `/ditu` (landing standalone de Ditu).
 *
 * Igual que `hub-page`, NO usa el sistema de Pages porque /ditu tiene 9
 * secciones específicas con componentes custom (DituHero, DituAudiencia,
 * DituAdn, etc.) cuyos shapes son muy distintos a los blocks genéricos.
 *
 * Cada grupo de fields aquí corresponde 1:1 a las props que cada componente
 * Ditu acepta. El wrapper en /ditu/page.tsx hace el mapeo final.
 *
 * IMPORTANTE: los íconos (icon paths) están guardados como text fields que
 * apuntan a rutas dentro de /public. Son parte del design system del frontend
 * y normalmente NO se editan desde admin. Si el cliente quiere reemplazar un
 * ícono, debe subir el SVG a public/ via PR + apuntar el field a la nueva ruta.
 */
export const DituPage: GlobalConfig = {
  slug: "ditu-page",
  label: "Página Ditu (/ditu)",
  admin: { group: "Contenido" },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    // ===================================================================
    // HERO
    // ===================================================================
    {
      name: "hero",
      type: "group",
      label: "Hero",
      fields: [
        {
          name: "stickerText",
          type: "text",
          required: true,
          defaultValue: "TU MARCA",
        },
        {
          name: "headingPlaceholderText",
          type: "text",
          required: true,
          defaultValue: "Tu marca ",
          admin: {
            description:
              "Espacio transparente reservado en la línea 1 (mismo texto que el sticker + espacio). Permite que el sticker rotado se posicione encima sin colapsar el layout.",
          },
        },
        {
          name: "headingMainText",
          type: "text",
          required: true,
          defaultValue: "en todas las pantallas, ",
          admin: { description: "Texto en blanco que sigue al placeholder." },
        },
        {
          name: "headingEmphasisText",
          type: "text",
          required: true,
          defaultValue: "en todo momento",
          admin: { description: "Texto destacado en cyan (#77EDED)." },
        },
        {
          name: "descriptionSegments",
          type: "array",
          label: "Descripción (segmentos)",
          labels: { singular: "Segmento", plural: "Segmentos" },
          minRows: 1,
          admin: {
            description:
              "Texto de la descripción dividido en segmentos para poder marcar partes en bold cyan.",
          },
          fields: [
            { name: "text", type: "text", required: true },
            {
              name: "boldCyan",
              type: "checkbox",
              defaultValue: false,
              admin: {
                description: "Si activo, este segmento sale en bold + color cyan.",
              },
            },
          ],
        },
        {
          name: "buttons",
          type: "array",
          label: "Botones",
          labels: { singular: "Botón", plural: "Botones" },
          maxRows: 4,
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href", type: "text", required: true, defaultValue: "#" },
            {
              name: "icon",
              type: "select",
              required: true,
              defaultValue: "googleplay",
              options: [
                { label: "Google Play", value: "googleplay" },
                { label: "App Store", value: "appstore" },
                { label: "TV / Portal Web", value: "tv" },
              ],
            },
          ],
        },
      ],
    },

    // ===================================================================
    // VIDEO BLOCK
    // ===================================================================
    {
      name: "video",
      type: "group",
      label: "Video Block",
      fields: [
        {
          name: "media",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Imagen o video del bloque. Si vacío, usa /ditu/video-block.png.",
          },
        },
        { name: "alt", type: "text", defaultValue: "" },
      ],
    },

    // ===================================================================
    // AUDIENCIA
    // ===================================================================
    {
      name: "audiencia",
      type: "group",
      label: "Audiencia (cifras)",
      fields: [
        {
          name: "totalFollowersHeadline",
          type: "text",
          required: true,
          defaultValue: "+1.7M",
          admin: { description: "Cifra grande de total seguidores (ej. '+1.7M')." },
        },
        {
          name: "stats",
          type: "array",
          label: "Stat cards (top)",
          labels: { singular: "Stat", plural: "Stats" },
          minRows: 1,
          maxRows: 6,
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "number", required: true },
            { name: "description", type: "text", required: true },
            {
              name: "icon",
              type: "text",
              required: true,
              admin: { description: "Ruta a /public (ej. /ditu/icon-download.svg)." },
            },
            { name: "large", type: "checkbox", defaultValue: false },
          ],
        },
        {
          name: "devices",
          type: "array",
          label: "Device cards (minutos por device)",
          labels: { singular: "Device", plural: "Devices" },
          minRows: 1,
          maxRows: 6,
          fields: [
            { name: "label", type: "text", required: true },
            { name: "minutes", type: "number", required: true },
            {
              name: "icon",
              type: "text",
              required: true,
              admin: { description: "Ruta a /public (ej. /ditu/icon-smarttv.svg)." },
            },
          ],
        },
        {
          name: "networks",
          type: "array",
          label: "Network counts",
          labels: { singular: "Red", plural: "Redes" },
          minRows: 1,
          maxRows: 8,
          fields: [
            {
              name: "network",
              type: "select",
              required: true,
              options: [
                { label: "Facebook", value: "facebook" },
                { label: "TikTok", value: "tiktok" },
                { label: "X (Twitter)", value: "x" },
                { label: "YouTube", value: "youtube" },
                { label: "Instagram", value: "instagram" },
                { label: "WhatsApp", value: "whatsapp" },
              ],
            },
            { name: "followers", type: "number", required: true },
          ],
        },
      ],
    },

    // ===================================================================
    // ADN (audience profile)
    // ===================================================================
    {
      name: "adn",
      type: "group",
      label: "ADN (perfil de audiencia)",
      fields: [
        {
          name: "ageBars",
          type: "array",
          label: "Edad — barras de edad",
          labels: { singular: "Rango de edad", plural: "Rangos de edad" },
          minRows: 1,
          maxRows: 12,
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "number", required: true },
            {
              name: "peak",
              type: "checkbox",
              defaultValue: false,
              admin: { description: "Marcar como pico (color resaltado)." },
            },
          ],
        },
        {
          name: "genderData",
          type: "array",
          label: "Género (pie chart)",
          labels: { singular: "Género", plural: "Géneros" },
          minRows: 1,
          maxRows: 6,
          fields: [
            { name: "name", type: "text", required: true },
            { name: "value", type: "number", required: true },
            {
              name: "color",
              type: "text",
              required: true,
              admin: { description: "Hex color para esta slice." },
            },
          ],
        },
        {
          name: "nseCards",
          type: "array",
          label: "NSE (estratos socioeconómicos)",
          labels: { singular: "Estrato", plural: "Estratos" },
          minRows: 1,
          maxRows: 8,
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "number", required: true },
          ],
        },
      ],
    },

    // ===================================================================
    // TIPO CONTENIDO
    // ===================================================================
    {
      name: "tipoContenido",
      type: "group",
      label: "Tipo de Contenido",
      fields: [
        {
          name: "autoplayInterval",
          type: "number",
          defaultValue: 5000,
          admin: {
            description: "Intervalo de autoplay del slider (ms). Default 5000 = 5s.",
          },
        },
        {
          name: "tabs",
          type: "array",
          label: "Tabs",
          labels: { singular: "Tab", plural: "Tabs" },
          minRows: 1,
          maxRows: 6,
          fields: [
            { name: "label", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
          ],
        },
      ],
    },

    // ===================================================================
    // CANALES
    // ===================================================================
    {
      name: "canales",
      type: "group",
      label: "Canales",
      fields: [
        {
          name: "tabs",
          type: "array",
          label: "Tabs (categorías)",
          labels: { singular: "Tab", plural: "Tabs" },
          minRows: 1,
          maxRows: 6,
          fields: [
            {
              name: "key",
              type: "select",
              required: true,
              options: [
                { label: "En vivo", value: "envivo" },
                { label: "FAST", value: "fast" },
                { label: "Aliados", value: "aliados" },
              ],
            },
            { name: "label", type: "text", required: true },
          ],
        },
        {
          name: "channels",
          type: "array",
          label: "Canales (flat)",
          labels: { singular: "Canal", plural: "Canales" },
          minRows: 1,
          admin: {
            description:
              "Lista flat de canales. Cada canal pertenece a un tab vía `tabKey`. Se agrupan automáticamente en el frontend.",
          },
          fields: [
            {
              name: "tabKey",
              type: "select",
              required: true,
              options: [
                { label: "En vivo", value: "envivo" },
                { label: "FAST", value: "fast" },
                { label: "Aliados", value: "aliados" },
              ],
            },
            { name: "name", type: "text", required: true },
            {
              name: "brand",
              type: "text",
              admin: { description: "Slug del brand (ej. 'caracoltv'). Opcional." },
            },
          ],
        },
      ],
    },

    // ===================================================================
    // CALENDARIO
    // ===================================================================
    {
      name: "calendario",
      type: "group",
      label: "Calendario (key moments)",
      fields: [
        {
          name: "events",
          type: "array",
          label: "Eventos",
          labels: { singular: "Evento", plural: "Eventos" },
          minRows: 0,
          admin: {
            description:
              "Eventos del calendario. Se filtran automáticamente los expirados (endDate < hoy) y se muestran los 12 más próximos.",
          },
          fields: [
            { name: "title", type: "text", required: true },
            { name: "subtitle", type: "text", required: true },
            {
              name: "dateLabel",
              type: "text",
              required: true,
              admin: {
                description: "Etiqueta visible (ej. 'DEL 06 DE MARZO AL 04 DE MAYO').",
              },
            },
            {
              name: "startDate",
              type: "date",
              required: true,
              admin: { date: { pickerAppearance: "dayOnly" } },
            },
            {
              name: "endDate",
              type: "date",
              required: true,
              admin: { date: { pickerAppearance: "dayOnly" } },
            },
            { name: "category", type: "text", required: true, defaultValue: "Categoría" },
            {
              name: "badgeVariant",
              type: "select",
              required: true,
              defaultValue: "cyan",
              options: [
                { label: "Cyan", value: "cyan" },
                { label: "Violet", value: "violet" },
                { label: "Navy", value: "navy" },
                { label: "White", value: "white" },
              ],
            },
          ],
        },
      ],
    },

    // ===================================================================
    // PAUTA (ad formats)
    // ===================================================================
    {
      name: "pauta",
      type: "group",
      label: "Pauta (formatos publicitarios)",
      fields: [
        {
          name: "categories",
          type: "array",
          label: "Categorías",
          labels: { singular: "Categoría", plural: "Categorías" },
          minRows: 1,
          dbName: "pauta_cats",
          fields: [
            {
              name: "key",
              type: "select",
              required: true,
              options: [
                { label: "Ads", value: "ads" },
                { label: "Patrocinio", value: "patrocinio" },
                { label: "Branded", value: "branded" },
                { label: "Eventos especiales", value: "eventos" },
              ],
            },
            { name: "label", type: "text", required: true },
            {
              name: "formats",
              type: "array",
              label: "Formatos",
              labels: { singular: "Formato", plural: "Formatos" },
              minRows: 1,
              dbName: "fmts",
              fields: [
                { name: "tag", type: "text", required: true },
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  admin: { description: "Imagen preview opcional." },
                },
              ],
            },
          ],
        },
      ],
    },

    // ===================================================================
    // HABLAMOS (cta final)
    // ===================================================================
    {
      name: "hablamos",
      type: "group",
      label: "¿Hablamos? (CTA final)",
      fields: [
        { name: "stickerText", type: "text", required: true, defaultValue: "¿HABLAMOS?" },
        {
          name: "headingLine1",
          type: "text",
          required: true,
          defaultValue: "Lleva tu marca",
        },
        {
          name: "headingLine2",
          type: "text",
          required: true,
          defaultValue: "al siguiente nivel.",
        },
        {
          name: "headingLine2Emphasis",
          type: "text",
          required: true,
          defaultValue: "siguiente nivel.",
          admin: {
            description:
              "Substring de headingLine2 que sale en cyan. Si no se encuentra en la línea 2, sale plain.",
          },
        },
        {
          name: "subtitle",
          type: "textarea",
          required: true,
          defaultValue: "Cuéntanos tus objetivos y armemos juntos la mejor estrategia.",
        },
        { name: "ctaLabel", type: "text", required: true, defaultValue: "Contáctanos" },
        { name: "ctaHref", type: "text", required: true, defaultValue: "#contacto" },
      ],
    },
  ],
};
