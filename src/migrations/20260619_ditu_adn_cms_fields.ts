import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Conecta al CMS los textos hardcodeados del bloque DituAdn:
 * sticker, titular (accent/rest), card género (label/subtitle/male/female),
 * card edad pico (label/text), segundo titular (pre/accent), descripción NSE
 * y fuente. Aditiva en live (pages_blocks_*) y version (_pages_v_blocks_*).
 */
const COLUMNS = `
  ADD COLUMN IF NOT EXISTS "sticker_label"          varchar DEFAULT 'ADN DITU',
  ADD COLUMN IF NOT EXISTS "heading_accent"         varchar DEFAULT 'Sabemos',
  ADD COLUMN IF NOT EXISTS "heading_rest"           varchar DEFAULT 'a quién le hablas.',
  ADD COLUMN IF NOT EXISTS "gender_label"           varchar DEFAULT 'Género',
  ADD COLUMN IF NOT EXISTS "gender_subtitle"        varchar DEFAULT 'nos prefieren',
  ADD COLUMN IF NOT EXISTS "gender_male_label"      varchar DEFAULT 'Hombres',
  ADD COLUMN IF NOT EXISTS "gender_female_label"    varchar DEFAULT 'Mujeres',
  ADD COLUMN IF NOT EXISTS "age_peak_label"         varchar DEFAULT 'EDAD PICO',
  ADD COLUMN IF NOT EXISTS "age_peak_text"          varchar DEFAULT 'Pico: 55-64 años',
  ADD COLUMN IF NOT EXISTS "second_heading_pre"     varchar DEFAULT 'y dónde',
  ADD COLUMN IF NOT EXISTS "second_heading_accent"  varchar DEFAULT 'encontrarlo',
  ADD COLUMN IF NOT EXISTS "nse_description"        varchar DEFAULT 'El nivel socioeconómico de nuestra audiencia refleja la Colombia real. Diversa, masiva y lista para conectar con tu marca.',
  ADD COLUMN IF NOT EXISTS "source"                 varchar DEFAULT 'Fuente: TGI CO 2025'
`;

const DROP_COLUMNS = `
  DROP COLUMN IF EXISTS "source",
  DROP COLUMN IF EXISTS "nse_description",
  DROP COLUMN IF EXISTS "second_heading_accent",
  DROP COLUMN IF EXISTS "second_heading_pre",
  DROP COLUMN IF EXISTS "age_peak_text",
  DROP COLUMN IF EXISTS "age_peak_label",
  DROP COLUMN IF EXISTS "gender_female_label",
  DROP COLUMN IF EXISTS "gender_male_label",
  DROP COLUMN IF EXISTS "gender_subtitle",
  DROP COLUMN IF EXISTS "gender_label",
  DROP COLUMN IF EXISTS "heading_rest",
  DROP COLUMN IF EXISTS "heading_accent",
  DROP COLUMN IF EXISTS "sticker_label"
`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "pages_blocks_ditu_adn" ${COLUMNS};`));
  await db.execute(sql.raw(`ALTER TABLE "_pages_v_blocks_ditu_adn" ${COLUMNS};`));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "_pages_v_blocks_ditu_adn" ${DROP_COLUMNS};`));
  await db.execute(sql.raw(`ALTER TABLE "pages_blocks_ditu_adn" ${DROP_COLUMNS};`));
}
