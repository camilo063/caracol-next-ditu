import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";

import { anyone, isAdmin, isAdminOrEditor } from "@/access";
import { revalidateAllPublic } from "@/lib/cms-revalidate";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const SVG_UNSAFE_PATTERN = /<script\b|on\w+\s*=|javascript:/i;

/**
 * Valida tamaño + sanitiza SVG anti-XSS antes de aceptar un upload.
 * Solo se ejecuta si `req.file` está presente (operaciones de upload reales).
 */
const validateUpload: CollectionBeforeChangeHook = ({ req, data }) => {
  const file = req.file;
  if (!file) return data;

  if (typeof file.size === "number" && file.size > MAX_UPLOAD_BYTES) {
    throw new Error("El archivo excede el tamaño máximo permitido (10 MB).");
  }

  if (file.mimetype === "image/svg+xml") {
    const content = file.data?.toString("utf-8") ?? "";
    if (SVG_UNSAFE_PATTERN.test(content)) {
      throw new Error("SVG rechazado: contiene scripts o handlers inline no permitidos.");
    }
  }

  return data;
};

/**
 * Media — uploads (logos, hero images, fotos de representantes, etc.).
 * Sharp procesa derivados automáticamente.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Media", plural: "Media" },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "filename", "mimeType", "filesize"],
    group: "Contenido",
  },
  access: {
    create: isAdminOrEditor,
    read: anyone,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [validateUpload],
    afterChange: [
      ({ req }) => {
        // Si el upload incluye un archivo (reemplazo de imagen), over-invalidate
        // todas las rutas públicas. Edits-only (e.g. cambiar `alt`) no requieren
        // invalidación amplia — Next sirve la misma URL/imagen.
        if (req.file) {
          revalidateAllPublic();
        }
      },
    ],
    afterDelete: [
      () => {
        revalidateAllPublic();
      },
    ],
  },
  upload: {
    staticDir: "public/media",
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "application/pdf",
    ],
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
    resizeOptions: { fit: "inside", withoutEnlargement: true },
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
      name: "caption",
      type: "text",
      admin: { description: "Caption opcional, visible en algunos contextos." },
    },
    {
      name: "credit",
      type: "text",
      admin: { description: "Crédito o atribución (opcional)." },
    },
  ],
};
