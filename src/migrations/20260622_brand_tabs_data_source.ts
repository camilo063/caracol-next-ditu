import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Agrega el campo `data_source` a cada tab del bloque BrandTabs (Caracol Next).
 * Es la "Fuente de información de las cifras" que se muestra encima del botón
 * "Conoce más" en cada tab. Aditiva (nullable).
 */
const COL = `ADD COLUMN IF NOT EXISTS "data_source" varchar`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "pages_blocks_brand_tabs_tabs" ${COL};`));
  await db.execute(sql.raw(`ALTER TABLE "_pages_v_blocks_brand_tabs_tabs" ${COL};`));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(
      `ALTER TABLE "_pages_v_blocks_brand_tabs_tabs" DROP COLUMN IF EXISTS "data_source";`,
    ),
  );
  await db.execute(
    sql.raw(
      `ALTER TABLE "pages_blocks_brand_tabs_tabs" DROP COLUMN IF EXISTS "data_source";`,
    ),
  );
}
