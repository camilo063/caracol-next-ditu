import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Adds 6 _parent_id CASCADE FK constraints that were missing from the initial schema.
 *
 * Root cause: migration 20260601_000530 generated constraint names up to 72 chars.
 * PostgreSQL's 63-char NAMEDATALEN limit caused silent truncation → duplicate name
 * collision → the ALTER TABLE statements for these 6 FKs failed silently during the
 * initial `payload migrate` run. The missing CASCADEs broke Payload's upsertRow
 * delete/re-insert cycle at publish time (23505 unique violation on secondary_tabs.id).
 *
 * All 6 constraints were applied directly via SQL on 2026-06-10 with shortened names.
 * This migration makes the fix idempotent and reproducible for production.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_branded_content_categories_secondary_tabs"
        ADD CONSTRAINT "bc_cats_stabs_parent_id_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "public"."pages_blocks_branded_content_categories"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_branded_content_categories_secondary_tabs"
        ADD CONSTRAINT "pv_bc_cats_stabs_parent_id_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "public"."_pages_v_blocks_branded_content_categories"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_home_content_heading"
        ADD CONSTRAINT "site_settings_home_content_heading_parent_id_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "public"."site_settings"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_home_content_stats"
        ADD CONSTRAINT "site_settings_home_content_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "public"."site_settings"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_home_content_brands_caracol_next_description"
        ADD CONSTRAINT "ss_home_brands_cn_desc_parent_id_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "public"."site_settings"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_settings_home_content_brands_ditu_description"
        ADD CONSTRAINT "site_settings_home_content_brands_ditu_description_parent_id_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "public"."site_settings"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings_home_content_brands_ditu_description"
      DROP CONSTRAINT IF EXISTS "site_settings_home_content_brands_ditu_description_parent_id_fk";
    ALTER TABLE "site_settings_home_content_brands_caracol_next_description"
      DROP CONSTRAINT IF EXISTS "ss_home_brands_cn_desc_parent_id_fk";
    ALTER TABLE "site_settings_home_content_stats"
      DROP CONSTRAINT IF EXISTS "site_settings_home_content_stats_parent_id_fk";
    ALTER TABLE "site_settings_home_content_heading"
      DROP CONSTRAINT IF EXISTS "site_settings_home_content_heading_parent_id_fk";
    ALTER TABLE "_pages_v_blocks_branded_content_categories_secondary_tabs"
      DROP CONSTRAINT IF EXISTS "pv_bc_cats_stabs_parent_id_fk";
    ALTER TABLE "pages_blocks_branded_content_categories_secondary_tabs"
      DROP CONSTRAINT IF EXISTS "bc_cats_stabs_parent_id_fk";
  `);
}
