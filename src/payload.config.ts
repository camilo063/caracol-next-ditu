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

import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Users } from "./collections/Users";
import { DituPage } from "./globals/DituPage";
import { FloatingContact } from "./globals/FloatingContact";
import { FooterCaracolNext } from "./globals/FooterCaracolNext";
import { FooterDitu } from "./globals/FooterDitu";
import { HeaderCaracolNext } from "./globals/HeaderCaracolNext";
import { HeaderDitu } from "./globals/HeaderDitu";
import { HubPage } from "./globals/HubPage";
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
  collections: [Pages, Media, Categories, Users],
  globals: [
    HubPage,
    DituPage,
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
  }),
  sharp,
  // CORS y CSRF — restringido a los dominios del proyecto.
  // - PAYLOAD_PUBLIC_SERVER_URL: el servidor de Payload (mismo dominio en monolito Next).
  // - NEXT_PUBLIC_SITE_URL: el frontend público.
  // - Cuando se configure dominio custom (https://caracol.com.co) se agrega aquí.
  cors: [process.env.NEXT_PUBLIC_SITE_URL, process.env.PAYLOAD_PUBLIC_SERVER_URL].filter(
    (v): v is string => Boolean(v),
  ),
  csrf: [process.env.NEXT_PUBLIC_SITE_URL, process.env.PAYLOAD_PUBLIC_SERVER_URL].filter(
    (v): v is string => Boolean(v),
  ),
  plugins: [
    /**
     * Vercel Blob storage para uploads en producción.
     * En local (sin BLOB_READ_WRITE_TOKEN) Payload usa filesystem en public/media.
     * Si el proyecto migra a AWS, este plugin se reemplaza por @payloadcms/storage-s3
     * con la misma API.
     */
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),

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
        // Solo admins ven la lista de submissions (contiene PII: email + phone).
        access: {
          read: ({ req: { user } }) =>
            Boolean(user) && (user as { role?: string }).role === "admin",
          delete: ({ req: { user } }) =>
            Boolean(user) && (user as { role?: string }).role === "admin",
        },
        hooks: {
          beforeChange: [
            ({ data, operation }) => {
              if (operation !== "create") return data;
              const submissionData = (
                data as {
                  submissionData?: Array<{ field?: string; value?: unknown }>;
                }
              ).submissionData;
              // Honeypot: si "_hp" llega lleno, es un bot. Rechazar.
              const honeypot = submissionData?.find((f) => f.field === "_hp");
              if (honeypot && honeypot.value) {
                throw new Error("Submission inválida.");
              }
              // Limpiar el honeypot del payload guardado (no es data real).
              if (submissionData) {
                (
                  data as {
                    submissionData?: Array<{ field?: string; value?: unknown }>;
                  }
                ).submissionData = submissionData.filter((f) => f.field !== "_hp");
              }
              return data;
            },
          ],
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
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: "noIndex",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description:
              "Marca como 'noindex,nofollow' para evitar indexación en buscadores.",
          },
        },
      ],
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
  ],
});
