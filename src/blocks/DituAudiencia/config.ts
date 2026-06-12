import type { Block } from "payload";
import { anchorIdField } from "../shared-fields";

export const DituAudienciaBlock: Block = {
  slug: "ditu-audiencia",
  labels: { singular: "Ditu Audiencia", plural: "Ditu Audiencia" },
  fields: [
    anchorIdField,
    {
      name: "totalFollowersHeadline",
      type: "text",
      label: "Titular seguidores (e.g. +1.7M)",
      defaultValue: "+1.7M",
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
  ],
};
