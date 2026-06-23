import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Brands } from "./collections/Brands";
import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Users } from "./collections/Users";
import { FloatingContact } from "./globals/FloatingContact";
import { FooterCaracolNext } from "./globals/FooterCaracolNext";
import { FooterDitu } from "./globals/FooterDitu";
import { HeaderCaracolNext } from "./globals/HeaderCaracolNext";
import { HeaderDitu } from "./globals/HeaderDitu";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Payload v3 config — Fase 2.
 * Collections, Globals, Blocks declarados.
 * Render de blocks llega en Fase 3.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " · Caracol Next + Ditu CMS",
    },
  },
  collections: [Pages, Media, Categories, Brands, Users],
  globals: [
    HeaderCaracolNext,
    HeaderDitu,
    FooterCaracolNext,
    FooterDitu,
    FloatingContact,
    SiteSettings,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    // push: false → disables Drizzle auto-schema-push in dev.
    // Required because two FK constraint names on branded_content tables
    // both truncate to the same 63-char PostgreSQL identifier, causing
    // a duplicate_object error on every server start.
    // All schema changes are applied via payload_migrations instead.
    push: false,
  }),
  sharp,
  cors: process.env.PAYLOAD_PUBLIC_SERVER_URL
    ? [process.env.PAYLOAD_PUBLIC_SERVER_URL]
    : "*",
  plugins: [
    /**
     * Form Builder — formularios editables desde admin.
     * Usado por `ContactBlock` para el form de contacto.
     */
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        checkbox: true,
        message: true,
        // payment / number / state / country desactivados para MVP
      },
      formOverrides: {
        admin: {
          group: "Configuración",
        },
      },
      formSubmissionOverrides: {
        admin: {
          group: "Configuración",
        },
      },
    }),

    /**
     * SEO — añade meta title / description / OG image en Pages.
     */
    seoPlugin({
      collections: ["pages"],
      uploadsCollection: "media",
      generateTitle: ({ doc }) =>
        doc?.title ? `${doc.title} · Caracol Next + Ditu` : "Caracol Next + Ditu",
      generateDescription: ({ doc }) =>
        typeof doc?.title === "string"
          ? `${doc.title} — Mediakit oficial Caracol Next + Ditu.`
          : "Mediakit oficial Caracol Next + Ditu.",
    }),

    /**
     * Nested Docs — preparado para sub-páginas con jerarquía.
     * No se usa activamente en MVP pero queda configurado por si el cliente
     * crea sub-páginas en el futuro (ej. /pauta/specs, /pauta/casos).
     */
    nestedDocsPlugin({
      collections: ["pages"],
      generateLabel: (_, doc) => (typeof doc.title === "string" ? doc.title : "Untitled"),
      generateURL: (docs) =>
        docs.reduce((url, doc) => {
          const slug =
            typeof doc.slug === "string" && doc.slug !== "home" ? `/${doc.slug}` : "";
          return `${url}${slug}`;
        }, ""),
    }),

    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
      // El navegador sube el archivo DIRECTO a Vercel Blob (no pasa por la
      // función serverless), evitando el límite de body (~4.5MB en Vercel)
      // que producía "Your request was too large" al subir videos grandes.
      clientUploads: true,
    }),
  ],
});
