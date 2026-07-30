import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Calendario Ditu — la categoría del evento pasa de texto libre a dropdown.
 *
 * El cliente reportó que en el admin de Ditu no podía "escoger la categoría",
 * había que escribirla. Se agrega `category_key` (enum) y la columna `category`
 * que ya existía queda como etiqueta personalizada.
 *
 * Por qué NO se toca la columna vieja: `category` tiene el texto que hoy se ve
 * en producción y no hay forma de mapearlo a la lista nueva sin adivinar. Las
 * filas existentes quedan en `custom`, que hace que el badge siga leyendo ese
 * texto → cero cambio visual. Desde el admin, el editor pasa cada evento al
 * dropdown cuando quiera.
 *
 * Sobre las FECHAS: no hace falta migrarlas. `start_date` y `end_date` ya son
 * `timestamp with time zone` desde la migración 20260610_000000 — el config de
 * Payload las declaraba como `text` por error y Postgres venía casteando los
 * strings ISO en cada guardado. Pasar el config a `type: "date"` solo alinea la
 * declaración con la columna real; los valores guardados ya son timestamps
 * válidos. (Verificado leyendo el schema y los datos vía la API local.)
 *
 * Aditiva e idempotente.
 */

const TABLES = [
  {
    table: "pages_blocks_ditu_calendario_events",
    enumName: "enum_pages_blocks_ditu_calendario_events_category_key",
  },
  {
    table: "_pages_v_blocks_ditu_calendario_events",
    enumName: "enum__pages_v_blocks_ditu_calendario_events_category_key",
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

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const valueList = VALUES.map((v) => `'${v}'`).join(", ");

  for (const { table, enumName } of TABLES) {
    await db.execute(
      sql.raw(`
        DO $$ BEGIN
          CREATE TYPE "public"."${enumName}" AS ENUM(${valueList});
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      `),
    );

    // OJO con el orden: la columna se crea SIN default a propósito.
    //
    // Desde Postgres 11, `ADD COLUMN ... DEFAULT x` rellena las filas
    // existentes con `x` en el acto. Si la columna naciera con DEFAULT 'otro',
    // el backfill de abajo (que busca las filas en NULL para marcarlas como
    // `custom`) no encontraría ninguna, y TODOS los eventos ya cargados
    // perderían el texto de su badge: "CULTURAL" pasaría a mostrarse como
    // "CATEGORÍA". El default se agrega después, para los eventos nuevos.
    await db.execute(
      sql.raw(`
        ALTER TABLE "${table}"
          ADD COLUMN IF NOT EXISTS "category_key" "public"."${enumName}";
      `),
    );

    // Los eventos que ya existen conservan lo que muestran hoy: su texto libre
    // manda, y para eso tienen que quedar marcados como `custom`. Los que no
    // tienen texto se quedan en 'otro' (badge "CATEGORÍA", igual que ahora).
    await db.execute(
      sql.raw(`
        UPDATE "${table}"
           SET "category_key" = 'custom'
         WHERE "category_key" IS NULL
           AND "category" IS NOT NULL
           AND btrim("category") <> '';
      `),
    );

    await db.execute(
      sql.raw(`
        UPDATE "${table}"
           SET "category_key" = 'otro'
         WHERE "category_key" IS NULL;
      `),
    );

    // Recién ahora: los eventos nuevos arrancan en 'otro'.
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
