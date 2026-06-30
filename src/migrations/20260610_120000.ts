import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Migration: site_settings homeContent array tables
 *
 * These 4 tables were dev-pushed after the initial migration (20260601_000530)
 * and never formally migrated. Required by SiteSettings.homeContent fields:
 *   - heading        (richHeadingField array)
 *   - stats          (metrics array)
 *   - brands.caracolNext.description (paragraphs array)
 *   - brands.ditu.description        (paragraphs array)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

    -- ── Enums ────────────────────────────────────────────────────────────────

    DO $$ BEGIN
      CREATE TYPE "public"."enum_site_settings_home_content_heading_weight"
        AS ENUM('regular', 'semibold', 'extrabold');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_site_settings_home_content_stats_accent"
        AS ENUM('caracolnext', 'ditu');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- ── site_settings_home_content_heading ───────────────────────────────────

    CREATE TABLE IF NOT EXISTS "site_settings_home_content_heading" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY,
      "text"       varchar NOT NULL,
      "weight"     "public"."enum_site_settings_home_content_heading_weight" DEFAULT 'extrabold'
    );
    ALTER TABLE "site_settings_home_content_heading"
      ADD CONSTRAINT "site_settings_home_content_heading_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "site_settings_home_content_heading_order_idx"
      ON "site_settings_home_content_heading" ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_home_content_heading_parent_id_idx"
      ON "site_settings_home_content_heading" ("_parent_id");

    -- ── site_settings_home_content_stats ─────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "site_settings_home_content_stats" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            varchar PRIMARY KEY,
      "icon_id"       integer,
      "numeric_value" numeric,
      "prefix"        varchar,
      "suffix"        varchar,
      "label"         varchar NOT NULL,
      "accent"        "public"."enum_site_settings_home_content_stats_accent" DEFAULT 'caracolnext',
      "lg_width"      numeric
    );
    ALTER TABLE "site_settings_home_content_stats"
      ADD CONSTRAINT "site_settings_home_content_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "site_settings_home_content_stats"
      ADD CONSTRAINT "site_settings_home_content_stats_icon_id_fk"
      FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "site_settings_home_content_stats_order_idx"
      ON "site_settings_home_content_stats" ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_home_content_stats_parent_id_idx"
      ON "site_settings_home_content_stats" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_settings_home_content_stats_icon_idx"
      ON "site_settings_home_content_stats" ("icon_id");

    -- ── site_settings_home_content_brands_caracol_next_description ───────────

    CREATE TABLE IF NOT EXISTS "site_settings_home_content_brands_caracol_next_description" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY,
      "text"       varchar NOT NULL
    );
    ALTER TABLE "site_settings_home_content_brands_caracol_next_description"
      ADD CONSTRAINT "site_settings_home_content_brands_cn_desc_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "site_settings_home_content_brands_cn_desc_order_idx"
      ON "site_settings_home_content_brands_caracol_next_description" ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_home_content_brands_cn_desc_parent_id_idx"
      ON "site_settings_home_content_brands_caracol_next_description" ("_parent_id");

    -- ── site_settings_home_content_brands_ditu_description ───────────────────

    CREATE TABLE IF NOT EXISTS "site_settings_home_content_brands_ditu_description" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY,
      "text"       varchar NOT NULL
    );
    ALTER TABLE "site_settings_home_content_brands_ditu_description"
      ADD CONSTRAINT "site_settings_home_content_brands_ditu_desc_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "site_settings_home_content_brands_ditu_desc_order_idx"
      ON "site_settings_home_content_brands_ditu_description" ("_order");
    CREATE INDEX IF NOT EXISTS "site_settings_home_content_brands_ditu_desc_parent_id_idx"
      ON "site_settings_home_content_brands_ditu_description" ("_parent_id");

  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_settings_home_content_brands_ditu_description" CASCADE;
    DROP TABLE IF EXISTS "site_settings_home_content_brands_caracol_next_description" CASCADE;
    DROP TABLE IF EXISTS "site_settings_home_content_stats" CASCADE;
    DROP TABLE IF EXISTS "site_settings_home_content_heading" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_site_settings_home_content_stats_accent";
    DROP TYPE IF EXISTS "public"."enum_site_settings_home_content_heading_weight";
  `);
}
