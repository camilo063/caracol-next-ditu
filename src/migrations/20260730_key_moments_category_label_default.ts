import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Calendario de Caracol Next — saca el DEFAULT `'CATEGORÍA'` de la columna
 * `category_label` de los eventos.
 *
 * Por qué hace falta una migración: quitar el `defaultValue` del campo en el
 * config de Payload NO toca el schema. El default seguía viviendo en Postgres,
 * y como Payload omite la columna en el INSERT cuando el valor viene vacío, la
 * base lo rellenaba igual. Resultado: un evento nuevo mostraba el badge
 * "CATEGORÍA" aunque el editor eligiera DEPORTES en el dropdown — justo el
 * síntoma que reportó el cliente.
 *
 * Sin el default, `category_label` queda en NULL y el componente cae al nombre
 * de la categoría elegida (ver `CATEGORY_LABELS` en el bloque).
 *
 * NO se tocan los valores ya guardados: los eventos que hoy tienen el texto
 * "CATEGORÍA" escrito en la fila lo siguen mostrando. Solo cambia el
 * comportamiento de los eventos nuevos.
 */

const TABLES = ["pages_blocks_key_moments_events", "_pages_v_blocks_key_moments_events"];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    await db.execute(
      sql.raw(`ALTER TABLE "${table}" ALTER COLUMN "category_label" DROP DEFAULT;`),
    );
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of [...TABLES].reverse()) {
    await db.execute(
      sql.raw(
        `ALTER TABLE "${table}" ALTER COLUMN "category_label" SET DEFAULT 'CATEGORÍA';`,
      ),
    );
  }
}
