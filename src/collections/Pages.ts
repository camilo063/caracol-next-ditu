import type { CollectionConfig } from "payload";

import { isAdmin, isAdminOrEditor, publishedOrAuth } from "@/access";
import { allBlocks } from "@/blocks";
import { revalidatePageRecord } from "@/lib/cms-revalidate";

/**
 * Pages — colección base del frontend.
 * Cada landing (Caracol Next, Ditu) es un documento de esta colección.
 * El layout se compone con `layout: blocks[]` — un array de Payload Blocks.
 *
 * Slug routing:
 * - landing="caracol-next" + slug="home" → renderiza en `/caracol-next`
 * - landing="ditu"        + slug="home"  → renderiza en `/ditu`
 * - sub-pages: `/caracol-next/[slug]` o `/ditu/[slug]` según landing.
 *
 * Nota: la URL raíz `/` NO es una Page — vive en el global `hub-page`.
 *
 * Fase 4 implementará el resolver dinámico que consume estas reglas.
 */
export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Página", plural: "Páginas" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "landing", "slug", "_status", "updatedAt"],
    group: "Contenido",
    livePreview: {
      url: ({ data }) => {
        const landing = (data?.landing as string) ?? "caracol-next";
        const slug = (data?.slug as string) ?? "home";
        const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
        const segment = slug === "home" ? "" : `/${slug}`;
        return `${base}/${landing}${segment}`;
      },
    },
  },
  versions: { drafts: true, maxPerDoc: 20 },
  indexes: [
    // Una page es única por (landing, slug) — permite "home" en caracol-next y en ditu.
    { fields: ["landing", "slug"], unique: true },
  ],
  access: {
    create: isAdminOrEditor,
    read: publishedOrAuth,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        const landing = (doc.landing as "caracol-next" | "ditu") ?? "caracol-next";
        const slug = (doc.slug as string) ?? "home";
        const prevSlug = (previousDoc?.slug as string | undefined) ?? null;
        revalidatePageRecord(landing, slug, prevSlug);
      },
    ],
    afterDelete: [
      ({ doc }) => {
        const landing = (doc.landing as "caracol-next" | "ditu") ?? "caracol-next";
        const slug = (doc.slug as string) ?? "home";
        revalidatePageRecord(landing, slug);
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
                { label: "Caracol Next (/caracol-next)", value: "caracol-next" },
                { label: "Ditu (/ditu)", value: "ditu" },
              ],
            },
            {
              name: "slug",
              type: "text",
              required: true,
              admin: {
                description:
                  "Slug único dentro de su landing (compound index landing+slug). Usa 'home' para la página raíz. Sub-páginas: kebab-case (ej. 'casos', 'pauta').",
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
    {
      name: "revalidate",
      type: "number",
      defaultValue: 3600,
      min: 0,
      admin: {
        position: "sidebar",
        description:
          "Segundos de ISR (default 3600 = 1h). Cambios manuales disparan revalidate inmediato vía afterChange hook (Fase 5).",
      },
    },
  ],
};
