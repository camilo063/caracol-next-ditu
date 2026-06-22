import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Cambia el color del badge de los eventos del calendario Ditu: de un select
 * enum (cyan/violet/navy/white) a un color hex libre.
 *
 * Aditiva y segura: agrega `badge_color` y lo puebla mapeando el enum viejo →
 * hex, SIN dropear `badge_variant` (el código viejo aún lo lee hasta el deploy).
 * La columna enum queda huérfana; se puede dropear en una migración posterior
 * una vez desplegado el código nuevo.
 */
const VARIANT_TO_HEX = `
  CASE "badge_variant"::text
    WHEN 'cyan'   THEN '#77EDED'
    WHEN 'violet' THEN '#8232F0'
    WHEN 'navy'   THEN '#12082D'
    WHEN 'white'  THEN '#FFFFFF'
    ELSE '#77EDED'
  END
`;

async function addAndBackfill(db: MigrateUpArgs["db"], table: string): Promise<void> {
  await db.execute(
    sql.raw(
      `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "badge_color" varchar DEFAULT '#77EDED';`,
    ),
  );
  await db.execute(
    sql.raw(
      `UPDATE "${table}" SET "badge_color" = ${VARIANT_TO_HEX} WHERE "badge_variant" IS NOT NULL;`,
    ),
  );
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await addAndBackfill(db, "pages_blocks_ditu_calendario_events");
  await addAndBackfill(db, "_pages_v_blocks_ditu_calendario_events");
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(
      `ALTER TABLE "_pages_v_blocks_ditu_calendario_events" DROP COLUMN IF EXISTS "badge_color";`,
    ),
  );
  await db.execute(
    sql.raw(
      `ALTER TABLE "pages_blocks_ditu_calendario_events" DROP COLUMN IF EXISTS "badge_color";`,
    ),
  );
}
