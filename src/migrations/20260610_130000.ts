import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Migration: site_settings homeContent scalar columns
 *
 * 11 columns in site_settings that were dev-pushed after the initial migration.
 * All belong to the homeContent tab of SiteSettings.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "home_content_logo_caracol_medios_id"          integer,
      ADD COLUMN IF NOT EXISTS "home_content_digital_label"                    varchar DEFAULT 'DIGITAL',
      ADD COLUMN IF NOT EXISTS "home_content_eyebrow"                         varchar DEFAULT 'Unidad digital #1 en Colombia',
      ADD COLUMN IF NOT EXISTS "home_content_contact_label"                   varchar DEFAULT 'Contáctenos',
      ADD COLUMN IF NOT EXISTS "home_content_brands_caracol_next_logo_id"     integer,
      ADD COLUMN IF NOT EXISTS "home_content_brands_caracol_next_cta_label"   varchar DEFAULT 'Conoce Caracol Next',
      ADD COLUMN IF NOT EXISTS "home_content_brands_caracol_next_href"        varchar DEFAULT '/caracol-next',
      ADD COLUMN IF NOT EXISTS "home_content_brands_ditu_logo_id"             integer,
      ADD COLUMN IF NOT EXISTS "home_content_brands_ditu_cta_label"           varchar DEFAULT 'Conoce ditu',
      ADD COLUMN IF NOT EXISTS "home_content_brands_ditu_href"                varchar DEFAULT '/ditu',
      ADD COLUMN IF NOT EXISTS "home_content_copyright"                       varchar DEFAULT '©2026 Caracol Comercial Digital';

    ALTER TABLE "site_settings"
      ADD CONSTRAINT "site_settings_home_content_logo_caracol_medios_fk"
        FOREIGN KEY ("home_content_logo_caracol_medios_id") REFERENCES "public"."media"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION,
      ADD CONSTRAINT "site_settings_home_content_brands_cn_logo_fk"
        FOREIGN KEY ("home_content_brands_caracol_next_logo_id") REFERENCES "public"."media"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION,
      ADD CONSTRAINT "site_settings_home_content_brands_ditu_logo_fk"
        FOREIGN KEY ("home_content_brands_ditu_logo_id") REFERENCES "public"."media"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION;

    CREATE INDEX IF NOT EXISTS "site_settings_home_content_logo_caracol_medios_idx"
      ON "site_settings" ("home_content_logo_caracol_medios_id");
    CREATE INDEX IF NOT EXISTS "site_settings_home_content_brands_cn_logo_idx"
      ON "site_settings" ("home_content_brands_caracol_next_logo_id");
    CREATE INDEX IF NOT EXISTS "site_settings_home_content_brands_ditu_logo_idx"
      ON "site_settings" ("home_content_brands_ditu_logo_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "site_settings_home_content_brands_ditu_logo_idx";
    DROP INDEX IF EXISTS "site_settings_home_content_brands_cn_logo_idx";
    DROP INDEX IF EXISTS "site_settings_home_content_logo_caracol_medios_idx";

    ALTER TABLE "site_settings"
      DROP CONSTRAINT IF EXISTS "site_settings_home_content_brands_ditu_logo_fk",
      DROP CONSTRAINT IF EXISTS "site_settings_home_content_brands_cn_logo_fk",
      DROP CONSTRAINT IF EXISTS "site_settings_home_content_logo_caracol_medios_fk",
      DROP COLUMN IF EXISTS "home_content_copyright",
      DROP COLUMN IF EXISTS "home_content_brands_ditu_href",
      DROP COLUMN IF EXISTS "home_content_brands_ditu_cta_label",
      DROP COLUMN IF EXISTS "home_content_brands_ditu_logo_id",
      DROP COLUMN IF EXISTS "home_content_brands_caracol_next_href",
      DROP COLUMN IF EXISTS "home_content_brands_caracol_next_cta_label",
      DROP COLUMN IF EXISTS "home_content_brands_caracol_next_logo_id",
      DROP COLUMN IF EXISTS "home_content_contact_label",
      DROP COLUMN IF EXISTS "home_content_eyebrow",
      DROP COLUMN IF EXISTS "home_content_digital_label",
      DROP COLUMN IF EXISTS "home_content_logo_caracol_medios_id";
  `);
}
