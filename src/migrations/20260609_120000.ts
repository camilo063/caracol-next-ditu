import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "footer_ditu_columns_links" CASCADE;
    DROP TABLE IF EXISTS "footer_ditu_columns" CASCADE;
    ALTER TABLE "footer_ditu" DROP CONSTRAINT IF EXISTS "footer_ditu_logo_id_media_id_fk";
    DROP INDEX IF EXISTS "footer_ditu_logo_idx";
    ALTER TABLE "footer_ditu" DROP COLUMN IF EXISTS "logo_id";
    ALTER TABLE "footer_ditu" DROP COLUMN IF EXISTS "tagline";
    ALTER TABLE "footer_ditu" DROP COLUMN IF EXISTS "use_wave";
    ALTER TABLE "footer_ditu" DROP COLUMN IF EXISTS "tone";
    DROP TYPE IF EXISTS "public"."enum_footer_ditu_tone";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_footer_ditu_tone" AS ENUM('minimal', 'dark', 'caracolnext-deep', 'ditu-deep', 'default');
    ALTER TABLE "footer_ditu" ADD COLUMN IF NOT EXISTS "logo_id" integer;
    ALTER TABLE "footer_ditu" ADD COLUMN IF NOT EXISTS "tagline" varchar;
    ALTER TABLE "footer_ditu" ADD COLUMN IF NOT EXISTS "use_wave" boolean DEFAULT false;
    ALTER TABLE "footer_ditu" ADD COLUMN IF NOT EXISTS "tone" "enum_footer_ditu_tone" DEFAULT 'dark';
    CREATE TABLE IF NOT EXISTS "footer_ditu_columns" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "footer_ditu_columns_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL,
      "open_in_new_tab" boolean DEFAULT false
    );
    ALTER TABLE "footer_ditu" ADD CONSTRAINT "footer_ditu_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "footer_ditu_logo_idx" ON "footer_ditu" USING btree ("logo_id");
  `);
}
