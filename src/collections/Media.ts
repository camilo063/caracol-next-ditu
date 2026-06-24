import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "@/access";

/**
 * Media — uploads (logos, hero images, fotos de representantes, etc.).
 *
 * NO se aplican transformaciones server-side de sharp (`formatOptions` ni
 * `imageSizes`). Con `clientUploads: true` (Vercel Blob) el archivo se sube
 * DIRECTO del browser a Blob y la conversión/resize de sharp en la función
 * serverless es frágil: un PNG/JPG grande sin comprimir hacía fallar la
 * conversión a webp y el upload no persistía (la colección sólo tenía webp).
 * Ahora cualquier formato (PNG, JPG, webp, SVG) se guarda tal cual y la
 * optimización responsive la hace Next/Image en serve-time (webp/avif).
 * Nadie en el front consume `media.sizes`; todos usan `media.url`.
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
