import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Preview de formatos (pauta) puede ser imagen o video.
 *
 * Agrega `youtube_url` y `video_external_url` a los slots de preview de:
 *  - AdFormats: formats[] y formats[].modal.childTabs[]
 *  - DituPauta: categories[].formats[]
 *
 * El archivo subido sigue en la columna `image_id` existente (Media ya acepta
 * mp4); el front decide imagen vs video por el mimeType. Aditiva, en tablas
 * normales y versionadas.
 */
const TABLES = [
  "pages_blocks_ad_formats_formats",
  "_pages_v_blocks_ad_formats_formats",
  "pages_blocks_ad_formats_formats_modal_child_tabs",
  "_pages_v_blocks_ad_formats_formats_modal_child_tabs",
  "pages_blocks_ditu_pauta_categories_formats",
  "_pages_v_blocks_ditu_pauta_categories_formats",
];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const t of TABLES) {
    await db.execute(
      sql.raw(
        `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "youtube_url" varchar;` +
          `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "video_external_url" varchar;`,
      ),
    );
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const t of TABLES) {
    await db.execute(
      sql.raw(
        `ALTER TABLE "${t}" DROP COLUMN IF EXISTS "youtube_url";` +
          `ALTER TABLE "${t}" DROP COLUMN IF EXISTS "video_external_url";`,
      ),
    );
  }
}
