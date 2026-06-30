import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Conecta al CMS los textos del header y CTA del bloque DituCalendario:
 * sticker, titular, subtítulo, y el grupo CTA (boldText/text/buttonLabel/
 * buttonHref). Los eventos ya eran editables (array). Aditiva en live y version.
 */
const COLUMNS = `
  ADD COLUMN IF NOT EXISTS "sticker_label"     varchar DEFAULT 'ESTO SE VIENE',
  ADD COLUMN IF NOT EXISTS "heading"           varchar DEFAULT 'Calendario',
  ADD COLUMN IF NOT EXISTS "subtitle"          varchar DEFAULT 'Los momentos que no te puedes perder.',
  ADD COLUMN IF NOT EXISTS "cta_bold_text"     varchar DEFAULT '¡Asegura la presencia de tu marca en los eventos más importantes del país!',
  ADD COLUMN IF NOT EXISTS "cta_text"          varchar DEFAULT 'Contáctanos ahora y diseñemos juntos tu participación.',
  ADD COLUMN IF NOT EXISTS "cta_button_label"  varchar DEFAULT 'Contáctanos',
  ADD COLUMN IF NOT EXISTS "cta_button_href"   varchar DEFAULT '#contacto'
`;

const DROP_COLUMNS = `
  DROP COLUMN IF EXISTS "cta_button_href",
  DROP COLUMN IF EXISTS "cta_button_label",
  DROP COLUMN IF EXISTS "cta_text",
  DROP COLUMN IF EXISTS "cta_bold_text",
  DROP COLUMN IF EXISTS "subtitle",
  DROP COLUMN IF EXISTS "heading",
  DROP COLUMN IF EXISTS "sticker_label"
`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "pages_blocks_ditu_calendario" ${COLUMNS};`));
  await db.execute(sql.raw(`ALTER TABLE "_pages_v_blocks_ditu_calendario" ${COLUMNS};`));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`ALTER TABLE "_pages_v_blocks_ditu_calendario" ${DROP_COLUMNS};`),
  );
  await db.execute(
    sql.raw(`ALTER TABLE "pages_blocks_ditu_calendario" ${DROP_COLUMNS};`),
  );
}
