import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Agrega los textos que estaban hardcodeados en el bloque DituAudiencia:
 * sticker, titular (pre/accent/post), watch time (label/value/description),
 * fuentes (top/bottom), textos de seguidores y la etiqueta de cada red.
 * Columnas aditivas en live (pages_blocks_*) y version (_pages_v_blocks_*).
 */
const COLUMNS = `
  ADD COLUMN IF NOT EXISTS "sticker_label"           varchar DEFAULT 'Las cifras que mueven a Ditu',
  ADD COLUMN IF NOT EXISTS "heading_pre"             varchar DEFAULT 'Cada mes,',
  ADD COLUMN IF NOT EXISTS "heading_accent"          varchar DEFAULT 'millones de pantallas',
  ADD COLUMN IF NOT EXISTS "heading_post"            varchar DEFAULT 'prendidas.',
  ADD COLUMN IF NOT EXISTS "watch_time_label"        varchar DEFAULT 'Watch time promedio',
  ADD COLUMN IF NOT EXISTS "watch_time_value"        varchar DEFAULT '60 MIN',
  ADD COLUMN IF NOT EXISTS "watch_time_description"  varchar DEFAULT 'Por sesión, sin interrupciones',
  ADD COLUMN IF NOT EXISTS "top_source"              varchar DEFAULT 'Fuente: Ditu AVS Accenture · Abril 2026',
  ADD COLUMN IF NOT EXISTS "followers_suffix"        varchar DEFAULT 'DE SEGUIDORES',
  ADD COLUMN IF NOT EXISTS "followers_subtext"       varchar DEFAULT 'QUE ESPERAN VER TU MARCA',
  ADD COLUMN IF NOT EXISTS "network_item_label"      varchar DEFAULT 'Seguidores',
  ADD COLUMN IF NOT EXISTS "bottom_source"           varchar DEFAULT 'Fuente: TGI CO 2025'
`;

const DROP_COLUMNS = `
  DROP COLUMN IF EXISTS "bottom_source",
  DROP COLUMN IF EXISTS "network_item_label",
  DROP COLUMN IF EXISTS "followers_subtext",
  DROP COLUMN IF EXISTS "followers_suffix",
  DROP COLUMN IF EXISTS "top_source",
  DROP COLUMN IF EXISTS "watch_time_description",
  DROP COLUMN IF EXISTS "watch_time_value",
  DROP COLUMN IF EXISTS "watch_time_label",
  DROP COLUMN IF EXISTS "heading_post",
  DROP COLUMN IF EXISTS "heading_accent",
  DROP COLUMN IF EXISTS "heading_pre",
  DROP COLUMN IF EXISTS "sticker_label"
`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "pages_blocks_ditu_audiencia" ${COLUMNS};`));
  await db.execute(sql.raw(`ALTER TABLE "_pages_v_blocks_ditu_audiencia" ${COLUMNS};`));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`ALTER TABLE "_pages_v_blocks_ditu_audiencia" ${DROP_COLUMNS};`),
  );
  await db.execute(sql.raw(`ALTER TABLE "pages_blocks_ditu_audiencia" ${DROP_COLUMNS};`));
}
