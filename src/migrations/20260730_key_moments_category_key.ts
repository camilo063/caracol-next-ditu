import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Calendario de Caracol Next — la categoría pasa a manejar de verdad el badge.
 *
 * El problema que reportó el cliente: cambiaba el campo "Categoría" y el badge
 * no cambiaba. La causa es que el texto del badge salía de `category_label`, y
 * TODOS los eventos tienen ese campo lleno (el default viejo de la columna
 * escribía 'CATEGORÍA' en cada fila). Ese texto le ganaba al dropdown, así que
 * el dropdown parecía muerto.
 *
 * Se adopta el mismo modelo que ya funciona en el calendario de Ditu: un solo
 * dropdown `category_key` manda sobre el badge, y el texto libre queda como
 * "Personalizada", visible solo cuando se elige esa opción.
 *
 * El backfill traduce lo que el editor ya había escrito a mano en vez de
 * borrarlo:
 *   'CICLISMO'  → categoría ciclismo   (y se limpia el texto)
 *   'FÚTBOL'    → categoría futbol
 *   'CATEGORÍA' → categoría otro       (cuya etiqueta es justamente CATEGORÍA)
 *   texto que no matchea ninguna categoría → 'custom', conservando el texto
 *   sin texto   → se traduce el select viejo (sports → deportes, etc.)
 *
 * Resultado: el badge muestra exactamente lo mismo que hoy, pero ahora el
 * dropdown lo controla.
 *
 * Los colores se congelan primero: `badge_color` es un override explícito y
 * quien lo tenga vacío recibe el color que hoy le corresponde por su categoría
 * vieja, así remapear la categoría no le cambia el color a nadie.
 *
 * Aditiva (no dropea la columna `category` vieja) e idempotente.
 */

const TABLES = [
  {
    table: "pages_blocks_key_moments_events",
    enumName: "enum_pages_blocks_key_moments_events_category_key",
  },
  {
    table: "_pages_v_blocks_key_moments_events",
    enumName: "enum__pages_v_blocks_key_moments_events_category_key",
  },
];

/** Debe coincidir con `EVENT_CATEGORIES` en `src/lib/event-categories.ts`. */
const VALUES = [
  "deportes",
  "futbol",
  "ciclismo",
  "cultural",
  "entretenimiento",
  "musica",
  "noticias",
  "especial",
  "comercial",
  "otro",
  "custom",
];

/** Color que hoy aplica cada categoría vieja cuando `badge_color` está vacío. */
const COLOR_POR_CATEGORIA_VIEJA = `
  CASE "category"::text
    WHEN 'sports'        THEN '#2862FF'
    WHEN 'news'          THEN '#0000C4'
    WHEN 'special'       THEN '#FFC200'
    WHEN 'entertainment' THEN '#A139C6'
    ELSE '#2862FF'
  END
`;

/**
 * Texto libre → categoría. Se compara en mayúsculas y sin tildes para que
 * 'Fútbol', 'FUTBOL' y 'FÚTBOL' caigan todos en la misma.
 */
const CATEGORIA_POR_ETIQUETA = `
  CASE translate(upper(btrim("category_label")), 'ÁÉÍÓÚÑÜ', 'AEIOUNU')
    WHEN 'DEPORTES'        THEN 'deportes'
    WHEN 'FUTBOL'          THEN 'futbol'
    WHEN 'CICLISMO'        THEN 'ciclismo'
    WHEN 'CULTURAL'        THEN 'cultural'
    WHEN 'ENTRETENIMIENTO' THEN 'entretenimiento'
    WHEN 'MUSICA'          THEN 'musica'
    WHEN 'NOTICIAS'        THEN 'noticias'
    WHEN 'ESPECIAL'        THEN 'especial'
    WHEN 'COMERCIAL'       THEN 'comercial'
    WHEN 'CATEGORIA'       THEN 'otro'
    ELSE NULL
  END
`;

/** Select viejo → categoría nueva, para los eventos sin texto libre. */
const CATEGORIA_POR_SELECT_VIEJO = `
  CASE "category"::text
    WHEN 'sports'        THEN 'deportes'
    WHEN 'news'          THEN 'noticias'
    WHEN 'special'       THEN 'especial'
    WHEN 'entertainment' THEN 'entretenimiento'
    ELSE 'otro'
  END
`;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const valueList = VALUES.map((v) => `'${v}'`).join(", ");

  for (const { table, enumName } of TABLES) {
    // 1. Congelar el color actual de cada evento antes de tocar la categoría.
    await db.execute(
      sql.raw(`
        UPDATE "${table}"
           SET "badge_color" = ${COLOR_POR_CATEGORIA_VIEJA}
         WHERE "badge_color" IS NULL OR btrim("badge_color") = '';
      `),
    );

    // 2. Columna nueva SIN default: si naciera con uno, Postgres 11+ rellena
    //    todas las filas al instante y el backfill de abajo no encontraría nada
    //    que hacer. El default se agrega al final, para los eventos nuevos.
    await db.execute(
      sql.raw(`
        DO $$ BEGIN
          CREATE TYPE "public"."${enumName}" AS ENUM(${valueList});
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;

        ALTER TABLE "${table}"
          ADD COLUMN IF NOT EXISTS "category_key" "public"."${enumName}";
      `),
    );

    // 3a. Etiqueta escrita a mano que corresponde a una categoría de la lista:
    //     se adopta esa categoría y se limpia el texto, para que el dropdown
    //     quede al mando sin cambiar lo que se ve.
    await db.execute(
      sql.raw(`
        UPDATE "${table}"
           SET "category_key" = (${CATEGORIA_POR_ETIQUETA})::"public"."${enumName}",
               "category_label" = NULL
         WHERE "category_key" IS NULL
           AND "category_label" IS NOT NULL
           AND btrim("category_label") <> ''
           AND (${CATEGORIA_POR_ETIQUETA}) IS NOT NULL;
      `),
    );

    // 3b. Etiqueta propia que no está en la lista: se conserva tal cual bajo
    //     la categoría "Personalizada".
    await db.execute(
      sql.raw(`
        UPDATE "${table}"
           SET "category_key" = 'custom'
         WHERE "category_key" IS NULL
           AND "category_label" IS NOT NULL
           AND btrim("category_label") <> '';
      `),
    );

    // 3c. Sin texto libre: se traduce el select viejo.
    await db.execute(
      sql.raw(`
        UPDATE "${table}"
           SET "category_key" = (${CATEGORIA_POR_SELECT_VIEJO})::"public"."${enumName}"
         WHERE "category_key" IS NULL;
      `),
    );

    // 4. Recién ahora: los eventos nuevos arrancan en 'otro'.
    await db.execute(
      sql.raw(`
        ALTER TABLE "${table}"
          ALTER COLUMN "category_key" SET DEFAULT 'otro';
      `),
    );
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const { table, enumName } of [...TABLES].reverse()) {
    await db.execute(
      sql.raw(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "category_key";`),
    );
    await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."${enumName}";`));
  }
}
