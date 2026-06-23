import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Brands — colores editables del pie de género (segmento mayor / menor).
 *
 * Antes los dos colores del pie se derivaban en el front (accent/primario vs
 * oscuro), y en marcas sin accent y con color≈colorDark ambos segmentos
 * quedaban del mismo tono (no se notaba la diferencia). Ahora son editables.
 *
 * Backfill: precarga cada marca con su valor EFECTIVO actual, así el admin
 * arranca con los colores que ya se ven hoy:
 *  - La Kalle (invertido): mayor = colorDark, menor = colorAccent||color.
 *  - Resto: mayor = colorAccent||color, menor = colorDark||color.
 * Las marcas nuevas quedan en NULL → el front vuelve a derivar. Aditiva.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "pie_color_major" varchar;
    ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "pie_color_minor" varchar;

    UPDATE "brands" SET
      "pie_color_major" = COALESCE("color_dark", "color"),
      "pie_color_minor" = COALESCE("color_accent", "color")
    WHERE "slug" = 'lakalle' AND "pie_color_major" IS NULL;

    UPDATE "brands" SET
      "pie_color_major" = COALESCE("color_accent", "color"),
      "pie_color_minor" = COALESCE("color_dark", "color")
    WHERE "slug" <> 'lakalle' AND "pie_color_major" IS NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "brands" DROP COLUMN IF EXISTS "pie_color_major";
    ALTER TABLE "brands" DROP COLUMN IF EXISTS "pie_color_minor";
  `);
}
