import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * AdFormats — CTA inferior: checkbox "abrir el enlace en pestaña nueva".
 * Solo aplica al modo enlace; los archivos siempre abren en pestaña nueva.
 * Aditiva (boolean DEFAULT false) en la tabla del bloque y su versionada.
 */
const COL = `ADD COLUMN IF NOT EXISTS "footer_cta_open_in_new_tab" boolean DEFAULT false`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "pages_blocks_ad_formats" ${COL};`));
  await db.execute(sql.raw(`ALTER TABLE "_pages_v_blocks_ad_formats" ${COL};`));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(
      `ALTER TABLE "_pages_v_blocks_ad_formats" DROP COLUMN IF EXISTS "footer_cta_open_in_new_tab";`,
    ),
  );
  await db.execute(
    sql.raw(
      `ALTER TABLE "pages_blocks_ad_formats" DROP COLUMN IF EXISTS "footer_cta_open_in_new_tab";`,
    ),
  );
}
