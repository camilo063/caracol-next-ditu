import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Adds CMS-editable fields to the DituHablamos block.
 * Previously the block only had anchorId; all content was hardcoded in JSX.
 * Fields: stickerLabel, heading, headingAccent, description, cta{label,href}.
 * Applied to both live (pages_blocks_*) and version (_pages_v_blocks_*) tables.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_ditu_hablamos"
      ADD COLUMN IF NOT EXISTS "sticker_label"   varchar DEFAULT '¿HABLAMOS?',
      ADD COLUMN IF NOT EXISTS "heading"          varchar DEFAULT 'Lleva tu marca',
      ADD COLUMN IF NOT EXISTS "heading_accent"   varchar DEFAULT 'siguiente nivel.',
      ADD COLUMN IF NOT EXISTS "description"      varchar DEFAULT 'Cuéntanos tus objetivos y armemos juntos la mejor estrategia.',
      ADD COLUMN IF NOT EXISTS "cta_label"        varchar DEFAULT 'Contáctanos',
      ADD COLUMN IF NOT EXISTS "cta_href"         varchar DEFAULT '#contacto';

    ALTER TABLE "_pages_v_blocks_ditu_hablamos"
      ADD COLUMN IF NOT EXISTS "sticker_label"   varchar DEFAULT '¿HABLAMOS?',
      ADD COLUMN IF NOT EXISTS "heading"          varchar DEFAULT 'Lleva tu marca',
      ADD COLUMN IF NOT EXISTS "heading_accent"   varchar DEFAULT 'siguiente nivel.',
      ADD COLUMN IF NOT EXISTS "description"      varchar DEFAULT 'Cuéntanos tus objetivos y armemos juntos la mejor estrategia.',
      ADD COLUMN IF NOT EXISTS "cta_label"        varchar DEFAULT 'Contáctanos',
      ADD COLUMN IF NOT EXISTS "cta_href"         varchar DEFAULT '#contacto';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_ditu_hablamos"
      DROP COLUMN IF EXISTS "cta_href",
      DROP COLUMN IF EXISTS "cta_label",
      DROP COLUMN IF EXISTS "description",
      DROP COLUMN IF EXISTS "heading_accent",
      DROP COLUMN IF EXISTS "heading",
      DROP COLUMN IF EXISTS "sticker_label";

    ALTER TABLE "pages_blocks_ditu_hablamos"
      DROP COLUMN IF EXISTS "cta_href",
      DROP COLUMN IF EXISTS "cta_label",
      DROP COLUMN IF EXISTS "description",
      DROP COLUMN IF EXISTS "heading_accent",
      DROP COLUMN IF EXISTS "heading",
      DROP COLUMN IF EXISTS "sticker_label";
  `);
}
