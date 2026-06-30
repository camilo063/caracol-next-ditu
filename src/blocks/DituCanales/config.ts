import type { Block } from "payload";
import { anchorIdField } from "../shared-fields";

const channelFields = [
  { name: "name", type: "text" as const, required: true, label: "Nombre del canal" },
  {
    name: "logo",
    type: "upload" as const,
    relationTo: "media" as const,
    label: "Logo del canal",
  },
];

export const DituCanalesBlock: Block = {
  slug: "ditu-canales",
  labels: { singular: "Ditu Canales", plural: "Ditu Canales" },
  fields: [
    anchorIdField,
    {
      name: "channelsEnVivo",
      type: "array",
      label: "Canales — EN VIVO",
      maxRows: 15,
      fields: channelFields,
    },
    {
      name: "channelsFast",
      type: "array",
      label: "Canales — FAST",
      maxRows: 15,
      fields: channelFields,
    },
    {
      name: "channelsAliados",
      type: "array",
      label: "Canales — Aliados",
      maxRows: 15,
      fields: channelFields,
    },
  ],
};
