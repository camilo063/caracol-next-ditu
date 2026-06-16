import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Adds CMS-editable text fields to the AudienceNetworks block.
 * Previously these literals were hardcoded in the JSX:
 *   - audience.source            → "Fuente: Comscore Feb 2026"
 *   - networksSection.heading    → "Líderes en redes"
 *   - networksSection.totalSuffix → "de seguidores"
 *   - networksSection.itemLabel  → "Seguidores"
 *   - networksSection.source     → "Fuente: Abril 6 2026"
 * Applied to both live (pages_blocks_*) and version (_pages_v_blocks_*) tables.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_audience_networks"
      ADD COLUMN IF NOT EXISTS "audience_source"               varchar DEFAULT 'Fuente: Comscore Feb 2026',
      ADD COLUMN IF NOT EXISTS "networks_section_heading"      varchar DEFAULT 'Líderes en redes',
      ADD COLUMN IF NOT EXISTS "networks_section_total_suffix" varchar DEFAULT 'de seguidores',
      ADD COLUMN IF NOT EXISTS "networks_section_item_label"   varchar DEFAULT 'Seguidores',
      ADD COLUMN IF NOT EXISTS "networks_section_source"       varchar DEFAULT 'Fuente: Abril 6 2026';

    ALTER TABLE "_pages_v_blocks_audience_networks"
      ADD COLUMN IF NOT EXISTS "audience_source"               varchar DEFAULT 'Fuente: Comscore Feb 2026',
      ADD COLUMN IF NOT EXISTS "networks_section_heading"      varchar DEFAULT 'Líderes en redes',
      ADD COLUMN IF NOT EXISTS "networks_section_total_suffix" varchar DEFAULT 'de seguidores',
      ADD COLUMN IF NOT EXISTS "networks_section_item_label"   varchar DEFAULT 'Seguidores',
      ADD COLUMN IF NOT EXISTS "networks_section_source"       varchar DEFAULT 'Fuente: Abril 6 2026';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_audience_networks"
      DROP COLUMN IF EXISTS "networks_section_source",
      DROP COLUMN IF EXISTS "networks_section_item_label",
      DROP COLUMN IF EXISTS "networks_section_total_suffix",
      DROP COLUMN IF EXISTS "networks_section_heading",
      DROP COLUMN IF EXISTS "audience_source";

    ALTER TABLE "pages_blocks_audience_networks"
      DROP COLUMN IF EXISTS "networks_section_source",
      DROP COLUMN IF EXISTS "networks_section_item_label",
      DROP COLUMN IF EXISTS "networks_section_total_suffix",
      DROP COLUMN IF EXISTS "networks_section_heading",
      DROP COLUMN IF EXISTS "audience_source";
  `);
}
