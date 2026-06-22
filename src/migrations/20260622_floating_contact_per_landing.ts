import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Permite que cada representante del botón flotante se muestre por landing.
 * 3 flags por representante (Home / Caracol Next / Ditu), default true → los
 * representantes existentes siguen siendo transversales (aparecen en las 3).
 * Aditiva; el global FloatingContact no versiona, así que es una sola tabla.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "floating_contact_representatives"
      ADD COLUMN IF NOT EXISTS "show_on_home"         boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "show_on_caracol_next" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "show_on_ditu"         boolean DEFAULT true;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "floating_contact_representatives"
      DROP COLUMN IF EXISTS "show_on_ditu",
      DROP COLUMN IF EXISTS "show_on_caracol_next",
      DROP COLUMN IF EXISTS "show_on_home";
  `);
}
