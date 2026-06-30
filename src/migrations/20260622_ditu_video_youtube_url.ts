import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Agrega el campo `youtube_url` al bloque DituVideo (los 2 bloques de video de
 * la landing Ditu). El front extrae el ID del video y genera el embed iframe
 * automáticamente; si está vacío, se muestra solo la imagen. Aditiva (nullable).
 */
const COL = `ADD COLUMN IF NOT EXISTS "youtube_url" varchar`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "pages_blocks_ditu_video" ${COL};`));
  await db.execute(sql.raw(`ALTER TABLE "_pages_v_blocks_ditu_video" ${COL};`));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(
      `ALTER TABLE "_pages_v_blocks_ditu_video" DROP COLUMN IF EXISTS "youtube_url";`,
    ),
  );
  await db.execute(
    sql.raw(`ALTER TABLE "pages_blocks_ditu_video" DROP COLUMN IF EXISTS "youtube_url";`),
  );
}
