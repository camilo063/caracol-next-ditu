import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * BrandedContent — agrega la opción "Link externo (URL de video)" al multimedia.
 *
 * El enum `bc_multimedia_type` (compartido por categorías y secondary tabs,
 * tablas normales y versionadas) suma el valor 'external', y cada tabla recibe
 * `multimedia_external_url` (varchar) para la URL directa del video.
 *
 * Aditiva. Nota: los valores de enum no se pueden quitar en `down`, así que la
 * bajada solo elimina las columnas (el valor 'external' queda sin uso).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."bc_multimedia_type" ADD VALUE IF NOT EXISTS 'external';

    ALTER TABLE "pages_blocks_branded_content_categories"
      ADD COLUMN IF NOT EXISTS "multimedia_external_url" varchar;
    ALTER TABLE "pages_blocks_branded_content_categories_secondary_tabs"
      ADD COLUMN IF NOT EXISTS "multimedia_external_url" varchar;
    ALTER TABLE "_pages_v_blocks_branded_content_categories"
      ADD COLUMN IF NOT EXISTS "multimedia_external_url" varchar;
    ALTER TABLE "_pages_v_blocks_branded_content_categories_secondary_tabs"
      ADD COLUMN IF NOT EXISTS "multimedia_external_url" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_branded_content_categories"
      DROP COLUMN IF EXISTS "multimedia_external_url";
    ALTER TABLE "pages_blocks_branded_content_categories_secondary_tabs"
      DROP COLUMN IF EXISTS "multimedia_external_url";
    ALTER TABLE "_pages_v_blocks_branded_content_categories"
      DROP COLUMN IF EXISTS "multimedia_external_url";
    ALTER TABLE "_pages_v_blocks_branded_content_categories_secondary_tabs"
      DROP COLUMN IF EXISTS "multimedia_external_url";
  `);
}
