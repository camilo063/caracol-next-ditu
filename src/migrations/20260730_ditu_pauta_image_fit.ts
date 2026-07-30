import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Ditu Pauta — cómo encaja la imagen de cada formato en el marco vertical.
 *
 * `cover`   (default) recorta desde el centro y llena el marco.
 * `contain` muestra la pieza completa, sin recortarla.
 *
 * Nace de un reporte del cliente: subió una imagen y "se corta super raro". La
 * causa era un crop calcado de un asset del Figma que se aplicaba a cualquier
 * imagen; el arreglo vive en el componente. Esta columna es la perilla para las
 * piezas que no se pueden recortar.
 *
 * Entra en `cover`, el comportamiento por defecto. Aditiva e idempotente.
 */

const TABLES = [
  "pages_blocks_ditu_pauta_categories_formats",
  "_pages_v_blocks_ditu_pauta_categories_formats",
];

const ENUMS: Record<string, string> = {
  pages_blocks_ditu_pauta_categories_formats:
    "enum_pages_blocks_ditu_pauta_categories_formats_image_fit",
  _pages_v_blocks_ditu_pauta_categories_formats:
    "enum__pages_v_blocks_ditu_pauta_categories_formats_image_fit",
};

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    const enumName = ENUMS[table]!;
    await db.execute(
      sql.raw(`
        DO $$ BEGIN
          CREATE TYPE "public"."${enumName}" AS ENUM('cover', 'contain');
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;

        ALTER TABLE "${table}"
          ADD COLUMN IF NOT EXISTS "image_fit"
          "public"."${enumName}" DEFAULT 'cover';

        UPDATE "${table}" SET "image_fit" = 'cover' WHERE "image_fit" IS NULL;
      `),
    );
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of [...TABLES].reverse()) {
    await db.execute(
      sql.raw(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "image_fit";`),
    );
    await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."${ENUMS[table]!}";`));
  }
}
