import type { Block } from "payload";
import { anchorIdField } from "../shared-fields";

export const DituAudienciaBlock: Block = {
  slug: "ditu-audiencia",
  labels: { singular: "Ditu Audiencia", plural: "Ditu Audiencia" },
  fields: [
    anchorIdField,
    {
      name: "stickerLabel",
      type: "text",
      label: "Sticker (etiqueta rotada)",
      defaultValue: "Las cifras que mueven a Ditu",
    },
    {
      name: "heading",
      type: "group",
      label: "Titular principal",
      admin: {
        description: 'Se renderiza como "{pre} {accent en cyan} {post}".',
      },
      fields: [
        { name: "pre", type: "text", label: "Antes (blanco)", defaultValue: "Cada mes," },
        {
          name: "accent",
          type: "text",
          label: "Acento (cyan)",
          defaultValue: "millones de pantallas",
        },
        {
          name: "post",
          type: "text",
          label: "Después (blanco)",
          defaultValue: "prendidas.",
        },
      ],
    },
    {
      name: "stats",
      type: "array",
      label: "Stat cards (Descargas / Dispositivos / Pico)",
      maxRows: 5,
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "number", required: true },
        { name: "description", type: "text" },
        { name: "icon", type: "upload", relationTo: "media" },
        { name: "large", type: "checkbox", defaultValue: false },
      ],
    },
    {
      name: "watchTime",
      type: "group",
      label: "Watch time (card grande)",
      fields: [
        {
          name: "label",
          type: "text",
          label: "Etiqueta",
          defaultValue: "Watch time promedio",
        },
        { name: "value", type: "text", label: "Valor", defaultValue: "60 MIN" },
        {
          name: "description",
          type: "text",
          label: "Descripción",
          defaultValue: "Por sesión, sin interrupciones",
        },
      ],
    },
    {
      name: "devices",
      type: "array",
      label: "Watch time por dispositivo",
      maxRows: 6,
      fields: [
        { name: "label", type: "text", required: true },
        { name: "minutes", type: "number", required: true },
        {
          name: "icon",
          type: "select",
          defaultValue: "smarttv",
          options: [
            { label: "Smart TV", value: "smarttv" },
            { label: "Mobile", value: "mobile" },
            { label: "Tablet", value: "tablet" },
            { label: "Web", value: "web" },
          ],
        },
      ],
    },
    {
      name: "topSource",
      type: "text",
      label: "Fuente (sección superior)",
      defaultValue: "Fuente: Ditu AVS Accenture · Abril 2026",
    },
    {
      name: "totalFollowersHeadline",
      type: "text",
      label: "Titular seguidores (e.g. +1.7M)",
      defaultValue: "+1.7M",
    },
    {
      name: "followersSuffix",
      type: "text",
      label: "Texto junto al titular (e.g. DE SEGUIDORES)",
      defaultValue: "DE SEGUIDORES",
    },
    {
      name: "followersSubtext",
      type: "text",
      label: "Subtítulo seguidores",
      defaultValue: "QUE ESPERAN VER TU MARCA",
    },
    {
      name: "networks",
      type: "array",
      label: "Redes sociales (seguidores)",
      maxRows: 10,
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
        { name: "href", type: "text" },
      ],
    },
    {
      name: "networkItemLabel",
      type: "text",
      label: "Etiqueta bajo cada red (e.g. Seguidores)",
      defaultValue: "Seguidores",
    },
    {
      name: "bottomSource",
      type: "text",
      label: "Fuente (sección inferior)",
      defaultValue: "Fuente: TGI CO 2025",
    },
  ],
};
