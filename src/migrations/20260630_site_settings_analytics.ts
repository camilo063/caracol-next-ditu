import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Agrega el group `analytics` al global SiteSettings:
 *   - analytics_enabled (boolean, default false) → activa GA
 *   - analytics_script  (varchar)                → snippet completo de GA
 *
 * El script se inyecta solo si está activo Y el deploy corre en producción.
 * Aditiva (nullable / default false). Sin esta migración el admin de
 * site-settings falla en prod porque el config declara columnas que la base
 * no tiene.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ALTER TABLE "site_settings"
        ADD COLUMN IF NOT EXISTS "analytics_enabled" boolean DEFAULT false,
        ADD COLUMN IF NOT EXISTS "analytics_script"  varchar;
    `),
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      ALTER TABLE "site_settings"
        DROP COLUMN IF EXISTS "analytics_script",
        DROP COLUMN IF EXISTS "analytics_enabled";
    `),
  );
}
