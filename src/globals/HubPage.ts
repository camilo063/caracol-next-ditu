import type { GlobalConfig } from "payload";

import { anyone, isAdminOrEditor } from "@/access";
import { revalidateGlobal } from "@/lib/cms-revalidate";

/**
 * HubPage — global que pobla la home `/` (Hub Caracol Medios).
 *
 * No usa el sistema de Pages porque la home tiene estructura única (hero +
 * 2 product cards + 4 metric cards + 2 CTAs) sin el block system de las
 * landings de marca.
 *
 * El componente HubLanding (src/components/marketing/hub-landing.tsx) recibe
 * `heading` como ReactNode con spans de diferentes font-weights. Para que el
 * editor pueda controlar el énfasis word-by-word sin lexical, se usa el array
 * `headingSegments[]` — el wrapper en page.tsx (Fase 4) lo convierte a JSX.
 */
export const HubPage: GlobalConfig = {
  slug: "hub-page",
  label: "Página Hub (/)",
  admin: {
    group: "Contenido",
  },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateGlobal("hub-page");
      },
    ],
  },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      required: true,
      defaultValue: "Unidad digital #1 en Colombia",
      admin: { description: "Etiqueta superior cyan sobre el heading." },
    },
    {
      name: "headingSegments",
      type: "array",
      label: "Heading principal (segmentos)",
      labels: { singular: "Segmento", plural: "Segmentos" },
      required: true,
      minRows: 1,
      maxRows: 8,
      admin: {
        description:
          "Cada segmento es un trozo de texto con peso tipográfico. Permite enfatizar palabras dentro del heading (ej. 'Conecta' bold + ' tu marca con ' semibold + 'la audiencia' bold).",
      },
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
        },
        {
          name: "weight",
          type: "select",
          required: true,
          defaultValue: "semibold",
          options: [
            { label: "Semibold (regular)", value: "semibold" },
            { label: "Bold", value: "bold" },
            { label: "Extrabold (enfatizado)", value: "extrabold" },
          ],
        },
      ],
    },
    {
      name: "contactLabel",
      type: "text",
      required: true,
      defaultValue: "Contáctenos",
      admin: { description: "Label del CTA principal que abre el modal de contacto." },
    },
    {
      name: "brands",
      type: "group",
      label: "Tarjetas de marca",
      fields: [
        {
          name: "caracolNext",
          type: "group",
          label: "Card Caracol Next",
          fields: [
            {
              name: "descriptionParagraphs",
              type: "array",
              label: "Párrafos de descripción",
              labels: { singular: "Párrafo", plural: "Párrafos" },
              minRows: 1,
              maxRows: 4,
              fields: [{ name: "text", type: "textarea", required: true }],
            },
            {
              name: "ctaLabel",
              type: "text",
              required: true,
              defaultValue: "Conoce Caracol Next",
            },
            {
              name: "href",
              type: "text",
              required: true,
              defaultValue: "/caracol-next",
            },
          ],
        },
        {
          name: "ditu",
          type: "group",
          label: "Card Ditu",
          fields: [
            {
              name: "descriptionParagraphs",
              type: "array",
              label: "Párrafos de descripción",
              labels: { singular: "Párrafo", plural: "Párrafos" },
              minRows: 1,
              maxRows: 4,
              fields: [{ name: "text", type: "textarea", required: true }],
            },
            {
              name: "ctaLabel",
              type: "text",
              required: true,
              defaultValue: "Conoce ditu",
            },
            {
              name: "href",
              type: "text",
              required: true,
              defaultValue: "/ditu",
            },
          ],
        },
      ],
    },
    {
      name: "stats",
      type: "array",
      label: "Métricas (4 cards animadas)",
      labels: { singular: "Métrica", plural: "Métricas" },
      maxRows: 4,
      admin: {
        description:
          "Exactamente 4 cards en desktop (2x2). En mobile se ocultan. Mantén el orden: las 2 primeras van en la fila 1, las 2 últimas en la fila 2.",
      },
      fields: [
        {
          name: "icon",
          type: "select",
          required: true,
          defaultValue: "users",
          options: [
            { label: "Users", value: "users" },
            { label: "TV / pantallas", value: "tv" },
            { label: "Zap / seguidores", value: "zap" },
            { label: "Clock / watch time", value: "clock" },
          ],
        },
        {
          name: "numericValue",
          type: "number",
          admin: {
            description:
              "Valor numérico para la animación CountUp. Si vacío, se usa el field 'value' como texto estático.",
          },
        },
        {
          name: "prefix",
          type: "text",
          defaultValue: "+",
          admin: { description: "Carácter delante del número (ej. '+')." },
        },
        {
          name: "suffix",
          type: "text",
          defaultValue: "M",
          admin: { description: "Carácter después del número (ej. 'M', 'Min')." },
        },
        {
          name: "value",
          type: "text",
          required: true,
          admin: {
            description:
              "Display text completo (ej. '+16M', '42Min'). Se muestra como fallback si numericValue está vacío.",
          },
        },
        {
          name: "label",
          type: "text",
          required: true,
          admin: { description: "Descripción debajo del número (ej. 'usuarios')." },
        },
        {
          name: "accent",
          type: "select",
          required: true,
          defaultValue: "caracolnext",
          options: [
            { label: "Caracol Next (azul)", value: "caracolnext" },
            { label: "Ditu (violeta)", value: "ditu" },
          ],
        },
        {
          name: "lgWidth",
          type: "number",
          admin: {
            description:
              "Ancho fijo desktop en px (272/340/328/288 per Figma). Vacío = flex-1.",
          },
        },
      ],
    },
  ],
};
