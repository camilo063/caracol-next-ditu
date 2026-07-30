import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Categorías de evento — de lista hardcodeada a colección administrable.
 *
 * Hasta ahora las categorías de los badges vivían en un `select` escrito en el
 * código y el color se cargaba a mano en cada evento. Eso trajo dos problemas
 * que reportó el cliente: el desplegable mostraba opciones que nadie había
 * pedido (las escribí yo en un archivo) y elegir la categoría no cambiaba el
 * color del badge, porque el color por evento siempre ganaba.
 *
 * Ahora son una colección, igual que las marcas: el cliente crea, renombra,
 * recolorea o borra categorías desde el admin, sin deploy. El color vive en la
 * categoría, con un color por landing —las paletas de Caracol Next y Ditu son
 * distintas— y un `scope` para que una categoría pueda ser de las dos landings
 * o exclusiva de una.
 *
 * Migración de datos, sin perder nada:
 *  - Se siembran las 5 categorías acordadas con el cliente, con los hex del
 *    design system (Categorias/01..06 para Next, la gama de violetas de Ditu).
 *  - Cada evento se enlaza a la categoría que se llama igual que el badge que
 *    ese evento muestra HOY, comparando primero exacto y después sin tildes.
 *  - Si esa categoría no existe, se crea con el nombre Y EL COLOR que el badge
 *    tiene hoy. Ningún badge cambia de texto ni de color.
 *  - Las categorías viejas no se colapsan dentro de las cinco nuevas: traducir
 *    'NOTICIAS' a 'OTROS EVENTOS' sería una decisión de contenido, no de una
 *    migración. El cliente fusiona o borra desde el admin.
 *  - Las columnas viejas NO se tocan: ni se dropean ni se vacían. Son la red
 *    que permite revertir, y como ya nadie las lee, el `down` alcanza con
 *    quitar la relación.
 *
 * El nombre arranca con 20260731 a propósito: las migraciones se leen del
 * directorio ordenadas por nombre de archivo, y esta necesita correr DESPUÉS de
 * `20260730_key_moments_category_key` y `20260730_ditu_calendario_category_select`,
 * que son las que crean las columnas `category_key` que acá se leen. Con fecha
 * 20260730 quedaba alfabéticamente antes y fallaba en una base desde cero.
 *
 * Aditiva e idempotente.
 */

/** Las 5 categorías acordadas, con el color de cada landing. */
const SEED = [
  { name: "FÚTBOL", next: "#FF0013", ditu: "#8232F0", orden: 1 },
  { name: "CICLISMO", next: "#05E8FD", ditu: "#77EDED", orden: 2 },
  { name: "CULTURAL", next: "#A139C6", ditu: "#561BDB", orden: 3 },
  { name: "PRODUCCIONES PROPIAS", next: "#FFC200", ditu: "#12082D", orden: 4 },
  { name: "OTROS EVENTOS", next: "#2862FF", ditu: "#FFFFFF", orden: 5 },
];

/**
 * El texto que el badge muestra hoy para cada valor del `select` viejo, cuando
 * el evento no tiene texto libre. Copiado de las etiquetas que devolvía
 * `resolveCategoryLabel` antes de este cambio.
 */
const ETIQUETA_VIEJA = `
  CASE e."category_key"::text
    WHEN 'deportes'        THEN 'DEPORTES'
    WHEN 'futbol'          THEN 'FÚTBOL'
    WHEN 'ciclismo'        THEN 'CICLISMO'
    WHEN 'cultural'        THEN 'CULTURAL'
    WHEN 'entretenimiento' THEN 'ENTRETENIMIENTO'
    WHEN 'musica'          THEN 'MÚSICA'
    WHEN 'noticias'        THEN 'NOTICIAS'
    WHEN 'especial'        THEN 'ESPECIAL'
    WHEN 'comercial'       THEN 'COMERCIAL'
    ELSE 'CATEGORÍA'
  END
`;

/**
 * El color que el calendario de Caracol Next le daba a cada categoría vieja
 * cuando el evento no tenía color propio. Copiado del `CATEGORY_COLORS` que
 * vivía en el componente antes de este cambio.
 */
const COLOR_VIEJO_NEXT = `
  CASE e."category_key"::text
    WHEN 'ciclismo'        THEN '#05E8FD'
    WHEN 'noticias'        THEN '#0000C4'
    WHEN 'especial'        THEN '#FFC200'
    WHEN 'cultural'        THEN '#A139C6'
    WHEN 'entretenimiento' THEN '#A139C6'
    WHEN 'musica'          THEN '#A139C6'
    WHEN 'comercial'       THEN '#FF0013'
    ELSE '#2862FF'
  END
`;

/** Normaliza para comparar nombres sin tildes ni mayúsculas. */
const NORM = (col: string) => `translate(upper(btrim(${col})), 'ÁÉÍÓÚÑÜ', 'AEIOUNU')`;

const TABLAS = [
  { eventos: "pages_blocks_key_moments_events", landing: "next" },
  { eventos: "_pages_v_blocks_key_moments_events", landing: "next" },
  { eventos: "pages_blocks_ditu_calendario_events", landing: "ditu" },
  { eventos: "_pages_v_blocks_ditu_calendario_events", landing: "ditu" },
];

/** En Next el texto libre del badge es `category_label`; en Ditu, `category`. */
const COL_TEXTO: Record<string, string> = {
  pages_blocks_key_moments_events: "category_label",
  _pages_v_blocks_key_moments_events: "category_label",
  pages_blocks_ditu_calendario_events: "category",
  _pages_v_blocks_ditu_calendario_events: "category",
};

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Colección ---------------------------------------------------------------
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_event_categories_scope" AS ENUM('both','next','ditu');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_event_categories_style" AS ENUM('solid','outline');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "event_categories" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "scope" "public"."enum_event_categories_scope" DEFAULT 'both' NOT NULL,
      "color_next" varchar DEFAULT '#2862FF',
      "color_ditu" varchar DEFAULT '#77EDED',
      "style" "public"."enum_event_categories_style" DEFAULT 'solid',
      "order" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "event_categories_name_idx"
      ON "event_categories" USING btree ("name");
    CREATE INDEX IF NOT EXISTS "event_categories_updated_at_idx"
      ON "event_categories" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "event_categories_created_at_idx"
      ON "event_categories" USING btree ("created_at");
  `);

  // 2. Siembra de las 5 categorías acordadas ------------------------------------
  const valores = SEED.map(
    (c) => `('${c.name}','both','${c.next}','${c.ditu}','solid',${c.orden})`,
  ).join(",\n      ");
  await db.execute(
    sql.raw(`
      INSERT INTO "event_categories" ("name","scope","color_next","color_ditu","style","order")
      VALUES
      ${valores}
      ON CONFLICT ("name") DO NOTHING;
    `),
  );

  // 2b. Tablas internas de Payload ----------------------------------------------
  //     Toda colección nueva necesita su columna en las rels que usa el admin
  //     para el bloqueo de documentos y las preferencias. Sin esto, el admin
  //     revienta al listar cualquier colección.
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "event_categories_id" integer;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_event_categories_id_idx"
      ON "payload_locked_documents_rels" USING btree ("event_categories_id");
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_event_categories_fk"
        FOREIGN KEY ("event_categories_id") REFERENCES "public"."event_categories"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    ALTER TABLE "payload_preferences_rels"
      ADD COLUMN IF NOT EXISTS "event_categories_id" integer;
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_event_categories_id_idx"
      ON "payload_preferences_rels" USING btree ("event_categories_id");
    DO $$ BEGIN
      ALTER TABLE "payload_preferences_rels"
        ADD CONSTRAINT "payload_preferences_rels_event_categories_fk"
        FOREIGN KEY ("event_categories_id") REFERENCES "public"."event_categories"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);

  // 3. Columna de relación en los cuatro tablones de eventos --------------------
  for (const { eventos } of TABLAS) {
    await db.execute(
      sql.raw(`
        ALTER TABLE "${eventos}"
          ADD COLUMN IF NOT EXISTS "event_category_id" integer;

        DO $$ BEGIN
          ALTER TABLE "${eventos}"
            ADD CONSTRAINT "${eventos}_event_category_id_fk"
            FOREIGN KEY ("event_category_id")
            REFERENCES "public"."event_categories"("id")
            ON DELETE set null ON UPDATE no action;
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;

        CREATE INDEX IF NOT EXISTS "${eventos}_event_category_idx"
          ON "${eventos}" ("event_category_id");
      `),
    );
  }

  // 4. Mapeo de los eventos existentes ------------------------------------------
  //
  //    La regla es una sola: cada evento se enlaza a la categoría que se llama
  //    igual que el badge que ese evento muestra HOY. Si esa categoría no
  //    existe, se crea con el nombre y el color que el badge tiene hoy.
  //
  //    Deliberadamente NO se colapsan las categorías viejas dentro de las cinco
  //    nuevas. Traducir 'NOTICIAS' a 'OTROS EVENTOS' le cambiaría el texto al
  //    badge de eventos que hoy dicen otra cosa, y esa es una decisión de
  //    contenido, no de una migración. Quedan todas listadas en el admin y el
  //    cliente fusiona o borra las que no quiera: para eso son administrables.
  for (const { eventos, landing } of TABLAS) {
    const texto = COL_TEXTO[eventos]!;

    /** El texto que el badge muestra hoy: el libre, y si no el de su categoría vieja. */
    const ETIQUETA = `COALESCE(NULLIF(btrim(e."${texto}"), ''), ${ETIQUETA_VIEJA})`;

    /** El color que el badge muestra hoy: el propio, y si no el de su categoría vieja. */
    const COLOR =
      landing === "next"
        ? `COALESCE(NULLIF(btrim(e."badge_color"), ''), ${COLOR_VIEJO_NEXT})`
        : `COALESCE(NULLIF(btrim(e."badge_color"), ''), '#77EDED')`;

    /** Enlaza contra las categorías existentes con el criterio que se le pase. */
    const enlazar = (comparacion: string) =>
      db.execute(
        sql.raw(`
          UPDATE "${eventos}" AS e
             SET "event_category_id" = c."id"
            FROM "event_categories" AS c
           WHERE e."event_category_id" IS NULL
             AND ${comparacion};
        `),
      );

    // 4a. Coincidencia exacta de nombre.
    await enlazar(`upper(btrim(${ETIQUETA})) = upper(btrim(c."name"))`);

    // 4b. Recién ahora, sin tildes: así un 'Futbol' sin acento cae en 'FÚTBOL'.
    //     El orden importa — comparando sin tildes primero, 'PREVENTA' y
    //     'PRÉVENTA' matchearían entre sí y Postgres elegiría cualquiera.
    await enlazar(`${NORM(ETIQUETA)} = ${NORM(`c."name"`)}`);

    // 4c. Lo que no matcheó nada se convierte en su propia categoría, con el
    //     nombre y el color que ese badge tiene hoy. `DISTINCT ON` hace la
    //     elección determinista cuando varios eventos comparten texto.
    await db.execute(
      sql.raw(`
        INSERT INTO "event_categories" ("name","scope","color_next","color_ditu","style","order")
        SELECT DISTINCT ON (upper(btrim(${ETIQUETA})))
               upper(btrim(${ETIQUETA})),
               'both'::"public"."enum_event_categories_scope",
               ${landing === "next" ? COLOR : `'#2862FF'`},
               ${landing === "ditu" ? COLOR : `'#77EDED'`},
               'solid'::"public"."enum_event_categories_style",
               99
          FROM "${eventos}" AS e
         WHERE e."event_category_id" IS NULL
           AND NULLIF(btrim(${ETIQUETA}), '') IS NOT NULL
         ORDER BY upper(btrim(${ETIQUETA})), e."id"
        ON CONFLICT ("name") DO NOTHING;
      `),
    );
    await enlazar(`upper(btrim(${ETIQUETA})) = upper(btrim(c."name"))`);

    // 4d. Un evento sin texto ni categoría vieja: al genérico.
    await enlazar(`c."name" = 'OTROS EVENTOS'`);
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const { eventos } of [...TABLAS].reverse()) {
    await db.execute(
      sql.raw(`
        DROP INDEX IF EXISTS "${eventos}_event_category_idx";
        ALTER TABLE "${eventos}" DROP CONSTRAINT IF EXISTS "${eventos}_event_category_id_fk";
        ALTER TABLE "${eventos}" DROP COLUMN IF EXISTS "event_category_id";
      `),
    );
  }
  await db.execute(sql`
    ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "event_categories_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "event_categories_id";
    DROP TABLE IF EXISTS "event_categories";
    DROP TYPE IF EXISTS "public"."enum_event_categories_scope";
    DROP TYPE IF EXISTS "public"."enum_event_categories_style";
  `);
}
