import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Ditu Audiencia — toggles de visibilidad del watch time.
 *
 * `show_watch_time`  → card grande del watch time promedio.
 * `show_devices`     → fila de cards por dispositivo.
 *
 * Los dos entran en `true`, que es exactamente como se ve hoy producción: la
 * migración no cambia nada visualmente, solo habilita que el cliente pueda
 * ocultar cada mitad desde el admin sin borrar la data.
 *
 * Aditiva e idempotente.
 */

const TABLES = ["pages_blocks_ditu_audiencia", "_pages_v_blocks_ditu_audiencia"];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    await db.execute(
      sql.raw(`
        ALTER TABLE "${table}"
          ADD COLUMN IF NOT EXISTS "show_watch_time" boolean DEFAULT true;
        ALTER TABLE "${table}"
          ADD COLUMN IF NOT EXISTS "show_devices" boolean DEFAULT true;
        UPDATE "${table}"
           SET "show_watch_time" = COALESCE("show_watch_time", true),
               "show_devices" = COALESCE("show_devices", true);
      `),
    );
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of [...TABLES].reverse()) {
    await db.execute(
      sql.raw(`
        ALTER TABLE "${table}" DROP COLUMN IF EXISTS "show_devices";
        ALTER TABLE "${table}" DROP COLUMN IF EXISTS "show_watch_time";
      `),
    );
  }
}
