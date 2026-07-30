import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * BrandTabs (Caracol Next) — visibilidad administrable de los recuadros WEB y
 * REDES por marca.
 *
 * Antes estaba hardcodeado en el componente: BumBox y Volk nunca rendeaban esos
 * bloques (venía del Figma original), así que las cifras que el cliente cargaba
 * para esas marcas no aparecían nunca. Ahora son dos checkboxes por tab.
 *
 * Backfill — producción tiene que quedar EXACTAMENTE igual después del deploy:
 *  - `DEFAULT true` rellena todas las filas existentes (Postgres 11+ no reescribe
 *    la tabla y las filas viejas quedan en true), que es el comportamiento actual
 *    de todas las marcas menos dos.
 *  - Después se apagan los dos toggles SOLO en los tabs de BumBox y Volk, que es
 *    como se ven hoy. El cliente los prende desde el admin cuando quiera.
 *
 * Aditiva y idempotente.
 */

const TABLES = ["pages_blocks_brand_tabs_tabs", "_pages_v_blocks_brand_tabs_tabs"];

/** Slugs que hoy (pre-migración) no muestran WEB ni REDES por el hardcode. */
const HIDDEN_SLUGS = ["bumbox", "volk"];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const slugList = HIDDEN_SLUGS.map((s) => `'${s}'`).join(", ");

  for (const table of TABLES) {
    // El backfill de BumBox/Volk corre UNA sola vez: solo cuando esta migración
    // crea la columna. Si se re-ejecuta (dump restaurado sin
    // `payload_migrations`, corrida manual), no debe volver a apagar toggles que
    // el cliente ya prendió desde el admin.
    await db.execute(
      sql.raw(`
        DO $$
        DECLARE
          columna_nueva boolean;
        BEGIN
          columna_nueva := NOT EXISTS (
            SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public'
               AND table_name = '${table}'
               AND column_name = 'show_web'
          );

          ALTER TABLE "${table}"
            ADD COLUMN IF NOT EXISTS "show_web" boolean DEFAULT true;
          ALTER TABLE "${table}"
            ADD COLUMN IF NOT EXISTS "show_networks" boolean DEFAULT true;

          -- Filas anteriores al DEFAULT (o de una corrida parcial): true
          -- explícito, nunca NULL.
          UPDATE "${table}"
             SET "show_web" = COALESCE("show_web", true),
                 "show_networks" = COALESCE("show_networks", true);

          IF columna_nueva THEN
            -- Congela el look actual de BumBox y Volk. Se resuelve por el slug
            -- de la marca relacionada, no por posición del array.
            UPDATE "${table}" AS t
               SET "show_web" = false,
                   "show_networks" = false
              FROM "brands" AS b
             WHERE t."brand_id" = b."id"
               AND b."slug" IN (${slugList});
          END IF;
        END $$;
      `),
    );
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of [...TABLES].reverse()) {
    await db.execute(
      sql.raw(`
        ALTER TABLE "${table}" DROP COLUMN IF EXISTS "show_networks";
        ALTER TABLE "${table}" DROP COLUMN IF EXISTS "show_web";
      `),
    );
  }
}
