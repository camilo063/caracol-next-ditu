import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/access";

/**
 * Media — uploads (logos, hero images, fotos de representantes, etc.).
 * Sharp procesa derivados automáticamente.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "filename", "mimeType", "filesize"],
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: "public/media",
    mimeTypes: ["image/*", "video/mp4", "application/pdf"],
    imageSizes: [
      { name: "thumbnail", width: 300, height: 300, position: "centre" },
      { name: "card", width: 768, height: 432, position: "centre" },
      { name: "tablet", width: 1024 },
      { name: "desktop", width: 1440 },
    ],
    formatOptions: {
      format: "webp",
      options: { quality: 82 },
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Texto alternativo accesible. Describir la imagen en una frase.",
      },
    },
    {
      name: "credit",
      type: "text",
      admin: { description: "Crédito o atribución (opcional)." },
    },
  ],
};
