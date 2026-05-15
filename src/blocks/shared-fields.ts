import type { Field, GroupField } from "payload";

/**
 * Campos reutilizables entre blocks. Mantienen consistencia en nombres y validación.
 */

/** Permite poner un ancla #id en cualquier sección para vincular desde el header. */
export const anchorIdField: Field = {
  name: "anchorId",
  type: "text",
  label: "Ancla (#id en la URL)",
  admin: {
    description:
      "Opcional. Slug sin # (ej. 'momentos'). Permite navegar desde el header con scroll suave.",
    placeholder: "audiencia",
  },
};

/** Eyebrow + heading + subheading: patrón común en headers de sección. */
export const sectionHeaderFields: Field[] = [
  {
    name: "eyebrow",
    type: "text",
    label: "Eyebrow (etiqueta superior)",
  },
  {
    name: "heading",
    type: "text",
    label: "Título",
    required: true,
  },
  {
    name: "description",
    type: "textarea",
    label: "Descripción",
  },
];

/** Selector landing — cuando un block puede vivir en ambas y necesita comportamiento distinto. */
export const landingField: Field = {
  name: "landing",
  type: "select",
  label: "Landing destino",
  defaultValue: "both",
  options: [
    { label: "Caracol Next (/)", value: "caracol-next" },
    { label: "Ditu (/ditu)", value: "ditu" },
    { label: "Ambas", value: "both" },
  ],
};

/**
 * Factory que produce un GroupField con label + href + variante para un CTA.
 * `name` se sobreescribe externamente — se da un default por si no se pasa.
 */
export const ctaField = (overrides?: { name?: string; label?: string }): GroupField => ({
  name: overrides?.name ?? "cta",
  type: "group",
  label: overrides?.label ?? "Botón CTA",
  fields: [
    { name: "label", type: "text", required: true },
    { name: "href", type: "text", required: true },
    {
      name: "variant",
      type: "select",
      defaultValue: "default",
      options: [
        { label: "Default (primary del theme)", value: "default" },
        { label: "Outline", value: "outline" },
        { label: "Ghost", value: "ghost" },
        { label: "Brand Caracol Next", value: "brand-caracolnext" },
        { label: "Brand Ditu", value: "brand-ditu" },
      ],
    },
    {
      name: "openInNewTab",
      type: "checkbox",
      defaultValue: false,
    },
  ],
});

/** Brand options usadas en BrandTabs y en cards que referencian una marca. */
export const brandOptions = [
  { label: "Ditu", value: "ditu" },
  { label: "Caracol TV", value: "caracoltv" },
  { label: "Gol Caracol", value: "golcaracol" },
  { label: "Caracol Sports", value: "caracolsports" },
  { label: "Blu Radio", value: "bluradio" },
  { label: "La Kalle", value: "lakalle" },
  { label: "Volk", value: "volk" },
  { label: "BumBox", value: "bumbox" },
  { label: "Caracol Digital", value: "caracoldigital" },
  { label: "Caracol Medios", value: "caracolmedios" },
] as const;

export const networkOptions = [
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "TikTok", value: "tiktok" },
  { label: "YouTube", value: "youtube" },
  { label: "X (Twitter)", value: "x" },
  { label: "Threads", value: "threads" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Web", value: "web" },
] as const;
