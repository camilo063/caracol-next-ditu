import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Agrega `hide_past_events` al bloque KeyMomentsCalendar (Caracol Next).
 * Toggle para ocultar automáticamente los eventos cuya fecha ya pasó.
 * DEFAULT true para que las páginas existentes recuperen el comportamiento
 * previo (ocultar pasados). Aditiva.
 */
const COL = `ADD COLUMN IF NOT EXISTS "hide_past_events" boolean DEFAULT true`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "pages_blocks_key_moments" ${COL};`));
  await db.execute(sql.raw(`ALTER TABLE "_pages_v_blocks_key_moments" ${COL};`));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(
      `ALTER TABLE "_pages_v_blocks_key_moments" DROP COLUMN IF EXISTS "hide_past_events";`,
    ),
  );
  await db.execute(
    sql.raw(
      `ALTER TABLE "pages_blocks_key_moments" DROP COLUMN IF EXISTS "hide_past_events";`,
    ),
  );
}
