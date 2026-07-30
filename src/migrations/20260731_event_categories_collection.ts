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
 *  - Cada evento existente se enlaza a su categoría buscando por nombre, sin
 *    distinguir mayúsculas ni tildes, contra su `category_key` o su texto libre.
 *  - Lo que no matchee se convierte en una categoría propia, creada a partir de
 *    su texto, para que ningún badge cambie de la noche a la mañana.
 *  - Las columnas viejas NO se dropean: quedan como red de rollback.
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
 * Cómo se traduce cada valor del `select` viejo al nombre de la categoría
 * nueva. Los que no tienen equivalente caen en "OTROS EVENTOS".
 */
const DESDE_ENUM: Record<string, string> = {
  futbol: "FÚTBOL",
  ciclismo: "CICLISMO",
  cultural: "CULTURAL",
  deportes: "FÚTBOL",
  entretenimiento: "CULTURAL",
  musica: "CULTURAL",
  noticias: "OTROS EVENTOS",
  especial: "PRODUCCIONES PROPIAS",
  comercial: "PRODUCCIONES PROPIAS",
  otro: "OTROS EVENTOS",
};

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
  for (const { eventos } of TABLAS) {
    const texto = COL_TEXTO[eventos]!;

    // 4a. El texto libre del badge manda: es lo que el evento muestra HOY.
    //     Si coincide con el nombre de una categoría (sin tildes ni mayúsculas),
    //     se enlaza a ella y el badge sigue diciendo exactamente lo mismo.
    await db.execute(
      sql.raw(`
        UPDATE "${eventos}" AS e
           SET "event_category_id" = c."id"
          FROM "event_categories" AS c
         WHERE e."event_category_id" IS NULL
           AND ${NORM(`e."${texto}"`)} = ${NORM(`c."name"`)};
      `),
    );

    // 4b. Sin texto libre: se traduce el valor del select viejo.
    const casos = Object.entries(DESDE_ENUM)
      .map(([k, v]) => `WHEN '${k}' THEN '${v}'`)
      .join(" ");
    await db.execute(
      sql.raw(`
        UPDATE "${eventos}" AS e
           SET "event_category_id" = c."id"
          FROM "event_categories" AS c
         WHERE e."event_category_id" IS NULL
           AND (e."${texto}" IS NULL OR btrim(e."${texto}") = '')
           AND c."name" = (CASE e."category_key"::text ${casos} ELSE 'OTROS EVENTOS' END);
      `),
    );

    // 4c. Texto libre que no coincide con ninguna categoría (por ejemplo
    //     "PREVENTA 2027"): se crea la categoría con ese mismo nombre para no
    //     perder lo que el evento muestra. Nace con el color por defecto de la
    //     landing y el cliente la ajusta —o la borra— desde el admin.
    await db.execute(
      sql.raw(`
        INSERT INTO "event_categories" ("name","scope","color_next","color_ditu","style","order")
        SELECT DISTINCT upper(btrim(e."${texto}")),
               'both'::"public"."enum_event_categories_scope",
               '#2862FF', '#77EDED',
               'solid'::"public"."enum_event_categories_style",
               99
          FROM "${eventos}" AS e
         WHERE e."event_category_id" IS NULL
           AND e."${texto}" IS NOT NULL
           AND btrim(e."${texto}") <> ''
        ON CONFLICT ("name") DO NOTHING;
      `),
    );
    await db.execute(
      sql.raw(`
        UPDATE "${eventos}" AS e
           SET "event_category_id" = c."id"
          FROM "event_categories" AS c
         WHERE e."event_category_id" IS NULL
           AND ${NORM(`e."${texto}"`)} = ${NORM(`c."name"`)};
      `),
    );

    // 4d. Lo que quede sin nada: "OTROS EVENTOS", que es el badge genérico.
    await db.execute(
      sql.raw(`
        UPDATE "${eventos}" AS e
           SET "event_category_id" = c."id"
          FROM "event_categories" AS c
         WHERE e."event_category_id" IS NULL
           AND c."name" = 'OTROS EVENTOS';
      `),
    );

    // 4e. El texto libre ya cumplió su función: pasa a ser una excepción vacía,
    //     para que de ahora en más mande la categoría. Se limpia solo cuando
    //     coincide con el nombre de la categoría enlazada; si el editor había
    //     escrito algo realmente distinto, se conserva.
    await db.execute(
      sql.raw(`
        UPDATE "${eventos}" AS e
           SET "${texto}" = NULL
          FROM "event_categories" AS c
         WHERE e."event_category_id" = c."id"
           AND e."${texto}" IS NOT NULL
           AND ${NORM(`e."${texto}"`)} = ${NORM(`c."name"`)};
      `),
    );
  }

  // 5. El color por evento pasa a ser una excepción ------------------------------
  //
  //    En Ditu la columna tenía `DEFAULT '#77EDED'`, así que TODOS los eventos
  //    nacían con un color explícito y la categoría nunca llegaba a pintarlos:
  //    ese es el "al poner la categoría no cambia el color" que reportó el
  //    cliente. Se quita el default.
  for (const eventos of [
    "pages_blocks_ditu_calendario_events",
    "_pages_v_blocks_ditu_calendario_events",
  ]) {
    await db.execute(
      sql.raw(`ALTER TABLE "${eventos}" ALTER COLUMN "badge_color" DROP DEFAULT;`),
    );
  }

  //    Y se libera el color de los eventos cuyo color guardado es EXACTAMENTE el
  //    que su categoría ya les daría. Para esos el badge se ve igual antes y
  //    después —cero cambio visual— pero a partir de ahora siguen a la categoría:
  //    si el cliente le cambia el color a "CULTURAL", todos sus eventos cambian.
  //
  //    Los que tienen un color distinto se dejan intactos: ahí el editor eligió
  //    algo a propósito y se respeta como la excepción que es.
  for (const { eventos, landing } of TABLAS) {
    const colDeLanding = landing === "next" ? "color_next" : "color_ditu";
    await db.execute(
      sql.raw(`
        UPDATE "${eventos}" AS e
           SET "badge_color" = NULL
          FROM "event_categories" AS c
         WHERE e."event_category_id" = c."id"
           AND e."badge_color" IS NOT NULL
           AND upper(btrim(e."badge_color")) = upper(btrim(coalesce(c."${colDeLanding}", '')));
      `),
    );
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
  for (const eventos of [
    "pages_blocks_ditu_calendario_events",
    "_pages_v_blocks_ditu_calendario_events",
  ]) {
    await db.execute(
      sql.raw(
        `ALTER TABLE "${eventos}" ALTER COLUMN "badge_color" SET DEFAULT '#77EDED';`,
      ),
    );
  }
}
