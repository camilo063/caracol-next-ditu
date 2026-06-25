import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * DituPauta — CTA del pie: opción de descargar un archivo (igual que el footer
 * CTA de AdFormats en Caracol Next).
 *
 * Agrega al group `cta` del bloque ditu-pauta:
 *  - `cta_link_type` (enum link|file, default 'link') — define si el botón va a
 *    una URL (cta_button_href) o descarga un archivo subido.
 *  - `cta_file_id` (FK a media, set null) — el archivo a descargar.
 *
 * Aditiva. Aplica a la tabla del bloque y a su tabla versionada.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_ditu_pauta_cta_link_type"
        AS ENUM('link', 'file');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_ditu_pauta_cta_link_type"
        AS ENUM('link', 'file');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    ALTER TABLE "pages_blocks_ditu_pauta"
      ADD COLUMN IF NOT EXISTS "cta_link_type"
        "public"."enum_pages_blocks_ditu_pauta_cta_link_type" DEFAULT 'link';
    ALTER TABLE "pages_blocks_ditu_pauta"
      ADD COLUMN IF NOT EXISTS "cta_file_id" integer;

    ALTER TABLE "_pages_v_blocks_ditu_pauta"
      ADD COLUMN IF NOT EXISTS "cta_link_type"
        "public"."enum__pages_v_blocks_ditu_pauta_cta_link_type" DEFAULT 'link';
    ALTER TABLE "_pages_v_blocks_ditu_pauta"
      ADD COLUMN IF NOT EXISTS "cta_file_id" integer;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_ditu_pauta"
        ADD CONSTRAINT "pages_blocks_ditu_pauta_cta_file_id_media_id_fk"
        FOREIGN KEY ("cta_file_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_ditu_pauta"
        ADD CONSTRAINT "_pages_v_blocks_ditu_pauta_cta_file_id_media_id_fk"
        FOREIGN KEY ("cta_file_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_pauta_cta_cta_file_idx"
      ON "pages_blocks_ditu_pauta" ("cta_file_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_pauta_cta_cta_file_idx"
      ON "_pages_v_blocks_ditu_pauta" ("cta_file_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_ditu_pauta"
      DROP CONSTRAINT IF EXISTS "pages_blocks_ditu_pauta_cta_file_id_media_id_fk";
    ALTER TABLE "_pages_v_blocks_ditu_pauta"
      DROP CONSTRAINT IF EXISTS "_pages_v_blocks_ditu_pauta_cta_file_id_media_id_fk";

    DROP INDEX IF EXISTS "pages_blocks_ditu_pauta_cta_cta_file_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_ditu_pauta_cta_cta_file_idx";

    ALTER TABLE "pages_blocks_ditu_pauta" DROP COLUMN IF EXISTS "cta_file_id";
    ALTER TABLE "pages_blocks_ditu_pauta" DROP COLUMN IF EXISTS "cta_link_type";
    ALTER TABLE "_pages_v_blocks_ditu_pauta" DROP COLUMN IF EXISTS "cta_file_id";
    ALTER TABLE "_pages_v_blocks_ditu_pauta" DROP COLUMN IF EXISTS "cta_link_type";

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_ditu_pauta_cta_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_ditu_pauta_cta_link_type";
  `);
}
