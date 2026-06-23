import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * DituVideo — fuente de video seleccionable: YouTube, link externo o archivo.
 *
 * Agrega al bloque ditu-video:
 *  - `video_type` (enum youtube|external|upload, default 'youtube')
 *  - `video_external_url` (varchar) — link directo a un video.
 *  - `video_file_id` (FK a media, set null) — archivo subido.
 *
 * `youtube_url` ya existe. Aditiva. Aplica a la tabla del bloque y su versionada.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_ditu_video_video_type"
        AS ENUM('youtube', 'external', 'upload');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_ditu_video_video_type"
        AS ENUM('youtube', 'external', 'upload');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    ALTER TABLE "pages_blocks_ditu_video"
      ADD COLUMN IF NOT EXISTS "video_type"
        "public"."enum_pages_blocks_ditu_video_video_type" DEFAULT 'youtube';
    ALTER TABLE "pages_blocks_ditu_video"
      ADD COLUMN IF NOT EXISTS "video_external_url" varchar;
    ALTER TABLE "pages_blocks_ditu_video"
      ADD COLUMN IF NOT EXISTS "video_file_id" integer;

    ALTER TABLE "_pages_v_blocks_ditu_video"
      ADD COLUMN IF NOT EXISTS "video_type"
        "public"."enum__pages_v_blocks_ditu_video_video_type" DEFAULT 'youtube';
    ALTER TABLE "_pages_v_blocks_ditu_video"
      ADD COLUMN IF NOT EXISTS "video_external_url" varchar;
    ALTER TABLE "_pages_v_blocks_ditu_video"
      ADD COLUMN IF NOT EXISTS "video_file_id" integer;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_ditu_video"
        ADD CONSTRAINT "pages_blocks_ditu_video_video_file_id_media_id_fk"
        FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_ditu_video"
        ADD CONSTRAINT "_pages_v_blocks_ditu_video_video_file_id_media_id_fk"
        FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_video_video_file_idx"
      ON "pages_blocks_ditu_video" ("video_file_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_video_video_file_idx"
      ON "_pages_v_blocks_ditu_video" ("video_file_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_ditu_video"
      DROP CONSTRAINT IF EXISTS "pages_blocks_ditu_video_video_file_id_media_id_fk";
    ALTER TABLE "_pages_v_blocks_ditu_video"
      DROP CONSTRAINT IF EXISTS "_pages_v_blocks_ditu_video_video_file_id_media_id_fk";

    DROP INDEX IF EXISTS "pages_blocks_ditu_video_video_file_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_ditu_video_video_file_idx";

    ALTER TABLE "pages_blocks_ditu_video" DROP COLUMN IF EXISTS "video_file_id";
    ALTER TABLE "pages_blocks_ditu_video" DROP COLUMN IF EXISTS "video_external_url";
    ALTER TABLE "pages_blocks_ditu_video" DROP COLUMN IF EXISTS "video_type";
    ALTER TABLE "_pages_v_blocks_ditu_video" DROP COLUMN IF EXISTS "video_file_id";
    ALTER TABLE "_pages_v_blocks_ditu_video" DROP COLUMN IF EXISTS "video_external_url";
    ALTER TABLE "_pages_v_blocks_ditu_video" DROP COLUMN IF EXISTS "video_type";

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_ditu_video_video_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_ditu_video_video_type";
  `);
}
