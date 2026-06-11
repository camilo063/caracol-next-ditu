import type { CollectionConfig } from "payload";

import { authenticated, publishedOrAuth } from "@/access";
import { allBlocks } from "@/blocks";
import { pageTag, revalidateTag } from "@/lib/payload/cache-tags";

/**
 * Pages — colección base del frontend.
 * Cada landing (Caracol Next, Ditu) es un documento de esta colección.
 * El layout se compone con `layout: blocks[]` — un array de Payload Blocks.
 *
 * Slug routing:
 * - landing="caracol-next" + slug="home" → renderiza en `/`
 * - landing="ditu" + slug="home"          → renderiza en `/ditu`
 * - cualquier otra page se renderiza como `/[slug]` o `/ditu/[slug]` según landing.
 *
 * Fase 4 implementará el resolver dinámico que consume estas reglas.
 */
export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Página", plural: "Páginas" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "landing", "slug", "_status", "updatedAt"],
    livePreview: {
      url: ({ data }) => {
        const landing = (data?.landing as string) ?? "caracol-next";
        const slug = (data?.slug as string) ?? "";
        const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
        const path =
          landing === "ditu"
            ? `/ditu${slug === "home" ? "" : `/${slug}`}`
            : `/${slug === "home" ? "" : slug}`;
        return `${base}${path}`;
      },
    },
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    create: authenticated,
    read: publishedOrAuth,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, previousDoc }) => {
        revalidateTag(pageTag(doc.slug), { expire: 0 });
        if (operation === "update" && previousDoc.slug !== doc.slug) {
          revalidateTag(pageTag(previousDoc.slug), { expire: 0 });
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        revalidateTag(pageTag(doc.slug), { expire: 0 });
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Contenido",
          fields: [
            { name: "title", type: "text", required: true },
            {
              name: "landing",
              type: "select",
              required: true,
              defaultValue: "caracol-next",
              options: [
                { label: "Caracol Next (/)", value: "caracol-next" },
                { label: "Ditu (/ditu)", value: "ditu" },
              ],
            },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              admin: {
                description:
                  "Slug único. Usa 'home' para la página raíz de la landing. Para sub-páginas: kebab-case (ej. 'casos', 'pauta').",
              },
            },
            {
              name: "layout",
              type: "blocks",
              required: true,
              blocks: [...allBlocks],
              admin: {
                description:
                  "Componer la página agregando blocks en el orden deseado. Cada block puede tener su propia ancla #id.",
              },
            },
          ],
        },
        {
          label: "Hero alternativo",
          description:
            "Si necesitas un hero distinto al primer block del layout, defínelo aquí. Si vacío, se usa el primer Hero block del layout.",
          fields: [
            {
              name: "heroOverride",
              type: "blocks",
              blocks: [allBlocks[0]], // Hero
              maxRows: 1,
            },
          ],
        },
      ],
    },
  ],
};
