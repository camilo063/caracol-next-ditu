import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Conecta al CMS los textos del header, sidebar y CTA del bloque DituPauta:
 * sticker, titular (2 líneas), subtítulo, label del sidebar y el grupo CTA.
 * Las categorías y formatos ya eran editables. Aditiva en live y version.
 */
const COLUMNS = `
  ADD COLUMN IF NOT EXISTS "sticker_label"     varchar DEFAULT 'Impulsa tu marca',
  ADD COLUMN IF NOT EXISTS "heading_line1"     varchar DEFAULT 'con formatos',
  ADD COLUMN IF NOT EXISTS "heading_line2"     varchar DEFAULT 'de alto impacto.',
  ADD COLUMN IF NOT EXISTS "subtitle"          varchar DEFAULT 'Diseñados para capturar atención en nuestro ecosistema digital — de display a video, audio y patrocinios.',
  ADD COLUMN IF NOT EXISTS "sidebar_label"     varchar DEFAULT 'Formatos de pauta',
  ADD COLUMN IF NOT EXISTS "cta_bold_text"     varchar DEFAULT '¡Asegura la presencia de tu marca en los eventos más importantes del país!',
  ADD COLUMN IF NOT EXISTS "cta_text"          varchar DEFAULT 'Contáctanos ahora y diseñemos juntos tu participación.',
  ADD COLUMN IF NOT EXISTS "cta_button_label"  varchar DEFAULT 'Descargar Especificaciones',
  ADD COLUMN IF NOT EXISTS "cta_button_href"   varchar DEFAULT '#contacto'
`;

const DROP_COLUMNS = `
  DROP COLUMN IF EXISTS "cta_button_href",
  DROP COLUMN IF EXISTS "cta_button_label",
  DROP COLUMN IF EXISTS "cta_text",
  DROP COLUMN IF EXISTS "cta_bold_text",
  DROP COLUMN IF EXISTS "sidebar_label",
  DROP COLUMN IF EXISTS "subtitle",
  DROP COLUMN IF EXISTS "heading_line2",
  DROP COLUMN IF EXISTS "heading_line1",
  DROP COLUMN IF EXISTS "sticker_label"
`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "pages_blocks_ditu_pauta" ${COLUMNS};`));
  await db.execute(sql.raw(`ALTER TABLE "_pages_v_blocks_ditu_pauta" ${COLUMNS};`));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "_pages_v_blocks_ditu_pauta" ${DROP_COLUMNS};`));
  await db.execute(sql.raw(`ALTER TABLE "pages_blocks_ditu_pauta" ${DROP_COLUMNS};`));
}
