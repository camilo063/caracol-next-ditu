import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Categorías de evento — el diseño del badge pasa a ser por landing.
 *
 * El design system tiene seis variantes de badge por landing, y resultan de
 * combinar dos formas con el color: en Ditu cuatro son de relleno (Categoría
 * 01, 02, 03 y 05) y dos de contorno (04 y 06); en Caracol Next las seis son
 * de relleno. Con un único campo `style` compartido, marcar una categoría como
 * "contorno" la dejaba con contorno también en Next, donde esa forma no existe.
 *
 * Se parte en `style_next` y `style_ditu`, simétrico a lo que ya se hizo con
 * `color_next` / `color_ditu`.
 *
 * La columna `style` vieja no se dropea: queda como red de rollback, igual que
 * el resto de las columnas que dejaron de leerse.
 *
 * Aditiva e idempotente.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Las columnas nacen SIN default para poder distinguir las filas que todavía
  // no se rellenaron: con un DEFAULT, Postgres 11+ las completa al instante y
  // el backfill de abajo no encontraría nada que copiar. El default se agrega
  // al final, para las categorías nuevas.
  await db.execute(sql`
    ALTER TABLE "event_categories"
      ADD COLUMN IF NOT EXISTS "style_next" "public"."enum_event_categories_style";
    ALTER TABLE "event_categories"
      ADD COLUMN IF NOT EXISTS "style_ditu" "public"."enum_event_categories_style";

    UPDATE "event_categories"
       SET "style_next" = COALESCE("style_next", "style", 'solid'),
           "style_ditu" = COALESCE("style_ditu", "style", 'solid');

    ALTER TABLE "event_categories" ALTER COLUMN "style_next" SET DEFAULT 'solid';
    ALTER TABLE "event_categories" ALTER COLUMN "style_ditu" SET DEFAULT 'solid';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "event_categories" DROP COLUMN IF EXISTS "style_ditu";
    ALTER TABLE "event_categories" DROP COLUMN IF EXISTS "style_next";
  `);
}
