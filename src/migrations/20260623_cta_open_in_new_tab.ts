import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Checkbox "abrir en pestaña nueva" en todos los CTA custom que faltaban:
 *  - DituHablamos / DituCalendario / DituPauta: group `cta`
 *  - KeyMomentsCalendar: group `ctaText` (CTA del bloque)
 *  - AdFormats: `modal.ctaOpenInNewTab`
 *  - SportsEvents: `events[].ctaOpenInNewTab`
 *  - Header (globals): `ctaButton.openInNewTab`
 *
 * Aditiva (boolean DEFAULT false). Las tablas de bloques tienen versionada;
 * los globals (header_*) no.
 */
const COLUMNS: Array<[table: string, column: string]> = [
  ["pages_blocks_ditu_hablamos", "cta_open_in_new_tab"],
  ["_pages_v_blocks_ditu_hablamos", "cta_open_in_new_tab"],
  ["pages_blocks_ditu_calendario", "cta_open_in_new_tab"],
  ["_pages_v_blocks_ditu_calendario", "cta_open_in_new_tab"],
  ["pages_blocks_ditu_pauta", "cta_open_in_new_tab"],
  ["_pages_v_blocks_ditu_pauta", "cta_open_in_new_tab"],
  ["pages_blocks_key_moments", "cta_text_open_in_new_tab"],
  ["_pages_v_blocks_key_moments", "cta_text_open_in_new_tab"],
  ["pages_blocks_ad_formats_formats", "modal_cta_open_in_new_tab"],
  ["_pages_v_blocks_ad_formats_formats", "modal_cta_open_in_new_tab"],
  ["pages_blocks_sports_events_events", "cta_open_in_new_tab"],
  ["_pages_v_blocks_sports_events_events", "cta_open_in_new_tab"],
  ["header_ditu", "cta_button_open_in_new_tab"],
  ["header_caracol_next", "cta_button_open_in_new_tab"],
];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [table, column] of COLUMNS) {
    await db.execute(
      sql.raw(
        `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${column}" boolean DEFAULT false;`,
      ),
    );
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const [table, column] of COLUMNS) {
    await db.execute(
      sql.raw(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "${column}";`),
    );
  }
}
