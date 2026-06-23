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
    { name: "label", type: "text" },
    { name: "href", type: "text" },
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

/**
 * Campos de "fuente de video" reutilizables: el admin elige entre YouTube,
 * un link externo (URL directa a un archivo de video) o subir el archivo.
 * Los campos se muestran condicionalmente según `videoType`. Pensado para
 * spread a nivel raíz de un block o dentro de un group.
 *
 * Nombres de campo: videoType, youtubeUrl, videoExternalUrl, videoFile.
 */
export const videoSourceFields = (): Field[] => [
  {
    name: "videoType",
    type: "radio",
    defaultValue: "youtube",
    label: "Fuente del video",
    options: [
      { label: "YouTube", value: "youtube" },
      { label: "Link externo (URL de video)", value: "external" },
      { label: "Subir archivo desde el computador", value: "upload" },
    ],
    admin: {
      description:
        "Elegí de dónde viene el video. Según la opción, aparece el campo correspondiente.",
    },
  },
  {
    name: "youtubeUrl",
    type: "text",
    label: "URL de YouTube",
    admin: {
      // Default 'youtube' también cubre registros viejos sin videoType.
      condition: (_data, siblingData) =>
        (siblingData?.videoType ?? "youtube") === "youtube",
      placeholder: "https://www.youtube.com/watch?v=...",
      description:
        "Pegá el link de YouTube (watch, youtu.be, shorts o embed). El embed se genera solo.",
    },
  },
  {
    name: "videoExternalUrl",
    type: "text",
    label: "URL de video externo",
    admin: {
      condition: (_data, siblingData) => siblingData?.videoType === "external",
      placeholder: "https://cdn.ejemplo.com/video.mp4",
      description: "Link directo a un archivo de video reproducible (.mp4, .webm, etc.).",
    },
  },
  {
    name: "videoFile",
    type: "upload",
    relationTo: "media",
    label: "Archivo de video",
    admin: {
      condition: (_data, siblingData) => siblingData?.videoType === "upload",
      description: "Subí el video desde tu computador (MP4 recomendado).",
    },
  },
];

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
