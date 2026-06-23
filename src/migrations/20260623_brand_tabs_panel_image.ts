import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * BrandTabs (Caracol Next) — imagen de fondo del panel derecho de cada tab.
 *
 * Agrega `panel_image_id` (FK a media, set null) a cada tab del bloque
 * BrandTabs. Es la imagen vertical que ocupa todo el banner derecho, con el
 * logo pequeño encima. Aditiva (nullable). Sigue el mismo naming de
 * `brand_logo_id` (FK + índice) en la tabla del bloque y su tabla versionada.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_brand_tabs_tabs"
      ADD COLUMN IF NOT EXISTS "panel_image_id" integer;
    ALTER TABLE "_pages_v_blocks_brand_tabs_tabs"
      ADD COLUMN IF NOT EXISTS "panel_image_id" integer;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_brand_tabs_tabs"
        ADD CONSTRAINT "pages_blocks_brand_tabs_tabs_panel_image_id_media_id_fk"
        FOREIGN KEY ("panel_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_brand_tabs_tabs"
        ADD CONSTRAINT "_pages_v_blocks_brand_tabs_tabs_panel_image_id_media_id_fk"
        FOREIGN KEY ("panel_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_panel_image_idx"
      ON "pages_blocks_brand_tabs_tabs" ("panel_image_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_panel_image_idx"
      ON "_pages_v_blocks_brand_tabs_tabs" ("panel_image_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_brand_tabs_tabs"
      DROP CONSTRAINT IF EXISTS "pages_blocks_brand_tabs_tabs_panel_image_id_media_id_fk";
    ALTER TABLE "_pages_v_blocks_brand_tabs_tabs"
      DROP CONSTRAINT IF EXISTS "_pages_v_blocks_brand_tabs_tabs_panel_image_id_media_id_fk";

    DROP INDEX IF EXISTS "pages_blocks_brand_tabs_tabs_panel_image_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_brand_tabs_tabs_panel_image_idx";

    ALTER TABLE "pages_blocks_brand_tabs_tabs" DROP COLUMN IF EXISTS "panel_image_id";
    ALTER TABLE "_pages_v_blocks_brand_tabs_tabs" DROP COLUMN IF EXISTS "panel_image_id";
  `);
}
