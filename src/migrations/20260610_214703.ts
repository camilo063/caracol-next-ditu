import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Step 1: create new tables (security CVE fix: users_sessions for JWT invalidation)
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );

  DO $$ BEGIN ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");`);

  // Step 2: rename long indexes to shorter names (Drizzle 63-char identifier normalization).
  // Use IF EXISTS so this is safe regardless of prior schema state (e.g. cms branch migrations).
  await db.execute(sql`
  DROP INDEX IF EXISTS "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_image_idx";
  DROP INDEX IF EXISTS "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_video_idx";
  DROP INDEX IF EXISTS "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_left_idx";
  DROP INDEX IF EXISTS "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_right_idx";
  DROP INDEX IF EXISTS "pages_blocks_branded_content_categories_multimedia_multimedia_image_idx";
  DROP INDEX IF EXISTS "pages_blocks_branded_content_categories_multimedia_multimedia_video_idx";
  DROP INDEX IF EXISTS "pages_blocks_branded_content_categories_multimedia_multimedia_logo_top_left_idx";
  DROP INDEX IF EXISTS "pages_blocks_branded_content_categories_multimedia_multimedia_logo_top_right_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_ad_formats_formats_modal_child_tabs_image_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_image_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_video_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_left_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_right_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_branded_content_categories_multimedia_multimedia_image_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_branded_content_categories_multimedia_multimedia_video_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_branded_content_categories_multimedia_multimedia_logo_top_left_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_branded_content_categories_multimedia_multimedia_logo_top_right_idx";`);

  // Step 3: create the new short-name indexes and apply default change
  await db.execute(sql`
  ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET DEFAULT 'You''ve received a new message.';
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_secondary_tabs_m_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_secondary_tabs_1_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_video_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_secondary_tabs_2_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_secondary_tabs_3_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_right_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_multimedia_multi_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_multimedia_mul_1_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_video_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_multimedia_mul_2_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_multimedia_mul_3_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_logo_top_right_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ad_formats_formats_modal_child_tabs_imag_idx" ON "_pages_v_blocks_ad_formats_formats_modal_child_tabs" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_secondary_tab_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_secondary_t_1_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_video_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_secondary_t_2_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_secondary_t_3_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_right_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_multimedia_mu_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_multimedia__1_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_video_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_multimedia__2_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_multimedia__3_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_logo_top_right_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP INDEX "pages_blocks_branded_content_categories_secondary_tabs_m_idx";
  DROP INDEX "pages_blocks_branded_content_categories_secondary_tabs_1_idx";
  DROP INDEX "pages_blocks_branded_content_categories_secondary_tabs_2_idx";
  DROP INDEX "pages_blocks_branded_content_categories_secondary_tabs_3_idx";
  DROP INDEX "pages_blocks_branded_content_categories_multimedia_multi_idx";
  DROP INDEX "pages_blocks_branded_content_categories_multimedia_mul_1_idx";
  DROP INDEX "pages_blocks_branded_content_categories_multimedia_mul_2_idx";
  DROP INDEX "pages_blocks_branded_content_categories_multimedia_mul_3_idx";
  DROP INDEX "_pages_v_blocks_ad_formats_formats_modal_child_tabs_imag_idx";
  DROP INDEX "_pages_v_blocks_branded_content_categories_secondary_tab_idx";
  DROP INDEX "_pages_v_blocks_branded_content_categories_secondary_t_1_idx";
  DROP INDEX "_pages_v_blocks_branded_content_categories_secondary_t_2_idx";
  DROP INDEX "_pages_v_blocks_branded_content_categories_secondary_t_3_idx";
  DROP INDEX "_pages_v_blocks_branded_content_categories_multimedia_mu_idx";
  DROP INDEX "_pages_v_blocks_branded_content_categories_multimedia__1_idx";
  DROP INDEX "_pages_v_blocks_branded_content_categories_multimedia__2_idx";
  DROP INDEX "_pages_v_blocks_branded_content_categories_multimedia__3_idx";
  ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET DEFAULT 'You''''ve received a new message.';
  CREATE INDEX "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_image_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_image_id");
  CREATE INDEX "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_video_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_video_id");
  CREATE INDEX "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_left_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_right_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_right_id");
  CREATE INDEX "pages_blocks_branded_content_categories_multimedia_multimedia_image_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_image_id");
  CREATE INDEX "pages_blocks_branded_content_categories_multimedia_multimedia_video_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_video_id");
  CREATE INDEX "pages_blocks_branded_content_categories_multimedia_multimedia_logo_top_left_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX "pages_blocks_branded_content_categories_multimedia_multimedia_logo_top_right_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_logo_top_right_id");
  CREATE INDEX "_pages_v_blocks_ad_formats_formats_modal_child_tabs_image_idx" ON "_pages_v_blocks_ad_formats_formats_modal_child_tabs" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_image_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_image_id");
  CREATE INDEX "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_video_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_video_id");
  CREATE INDEX "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_left_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_right_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_right_id");
  CREATE INDEX "_pages_v_blocks_branded_content_categories_multimedia_multimedia_image_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_image_id");
  CREATE INDEX "_pages_v_blocks_branded_content_categories_multimedia_multimedia_video_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_video_id");
  CREATE INDEX "_pages_v_blocks_branded_content_categories_multimedia_multimedia_logo_top_left_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX "_pages_v_blocks_branded_content_categories_multimedia_multimedia_logo_top_right_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_logo_top_right_id");`);
}
