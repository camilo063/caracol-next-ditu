import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * BrandTabs (Caracol Next) — visibilidad administrable del recuadro AUDIENCIA
 * por marca, igual que WEB y REDES.
 *
 * `20260730_brand_tabs_show_web_networks` dejó administrables dos de los tres
 * recuadros del tab. El cliente pidió el que faltaba: quiere poder ocultar
 * AUDIENCIA sin tener que borrar el género y las barras de edad que ya cargó.
 *
 * Backfill — producción queda EXACTAMENTE igual el día del deploy: `DEFAULT
 * true` rellena las filas existentes (Postgres 11+ no reescribe la tabla), que
 * es el comportamiento actual de todas las marcas. Ninguna arranca apagada,
 * porque hasta hoy el recuadro nunca se ocultó a propósito: se ocultaba solo
 * cuando no había género cargado.
 *
 * Aditiva e idempotente.
 */

const TABLES = ["pages_blocks_brand_tabs_tabs", "_pages_v_blocks_brand_tabs_tabs"];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    await db.execute(
      sql.raw(`
        ALTER TABLE "${table}"
          ADD COLUMN IF NOT EXISTS "show_audience" boolean DEFAULT true;

        -- Filas anteriores al DEFAULT (o de una corrida parcial): true
        -- explícito, nunca NULL.
        UPDATE "${table}"
           SET "show_audience" = COALESCE("show_audience", true);
      `),
    );
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of [...TABLES].reverse()) {
    await db.execute(
      sql.raw(`
        ALTER TABLE "${table}" DROP COLUMN IF EXISTS "show_audience";
      `),
    );
  }
}
