import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Brands collection — convierte las marcas hardcodeadas (brandOptions / BRAND_META)
 * en una colección editable de Payload.
 *
 * - Crea la tabla `brands` y la seedea con las 10 marcas del ecosistema.
 * - Las relaciones hasOne (BrandTabs, Hero, AdFormats) pasan a columnas
 *   `brand_id` en las tablas de cada array/bloque.
 * - El select hasMany `allowedBrands` (AIRecommendation) se elimina; el front
 *   trata "vacío = todas", así que no requiere migración de datos.
 * - Crea `pages_rels` / `_pages_v_rels` (primera relación en Pages) y agrega
 *   `brands_id` a las rels internas de Payload (locked_documents, preferences).
 *
 * Orden seguro para prod: crear tablas → seedear marcas → agregar brand_id →
 * MAPEAR enum viejo → brand_id (UPDATE) → recién entonces dropear columnas enum.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Tabla brands -------------------------------------------------------------
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "brands" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "color" varchar NOT NULL,
      "color_dark" varchar,
      "color_accent" varchar,
      "chart_peak" varchar,
      "logo_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "brands_slug_idx" ON "brands" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "brands_logo_idx" ON "brands" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "brands_created_at_idx" ON "brands" USING btree ("created_at");
    DO $$ BEGIN
      ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);

  // 2. Seed de las 10 marcas (idempotente por slug) -----------------------------
  await db.execute(sql`
    INSERT INTO "brands" ("name","slug","color","color_dark","color_accent","chart_peak") VALUES
      ('Ditu','ditu','#8232F0','#1F1647','#77EDED','#8232F0'),
      ('Caracol TV','caracoltv','#003381','#003381','#00ACFF','#003381'),
      ('Caracol Digital','caracoldigital','#003CCA','#0D3AA0','#2862FF','#003CCA'),
      ('Gol Caracol','golcaracol','#006AEF','#071D49',NULL,'#006AEF'),
      ('Caracol Sports','caracolsports','#005294','#005294','#00B3FB','#005294'),
      ('Blu Radio','bluradio','#00AEEF','#005BAA',NULL,'#005BAA'),
      ('La Kalle','lakalle','#353535','#353535','#FEFF00','#FEFF00'),
      ('Volk','volk','#0E3DFF','#0E3DFF','#FF0080','#0E3DFF'),
      ('BumBox','bumbox','#1EB1FB','#042D66',NULL,'#042D66'),
      ('Caracol Medios','caracolmedios','#212121','#000000',NULL,'#212121')
    ON CONFLICT ("slug") DO NOTHING;
  `);

  // 3. Tablas de relaciones de Pages (primera relación) -------------------------
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "brands_id" integer
    );
    CREATE INDEX IF NOT EXISTS "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "pages_rels_brands_id_idx" ON "pages_rels" USING btree ("brands_id");
    DO $$ BEGIN
      ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_brands_fk"
        FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "_pages_v_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "brands_id" integer
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "_pages_v_rels_brands_id_idx" ON "_pages_v_rels" USING btree ("brands_id");
    DO $$ BEGIN
      ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_brands_fk"
        FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);

  // 4. brands_id en las rels internas de Payload (admin lock / preferences) ------
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "brands_id" integer;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_brands_id_idx"
      ON "payload_locked_documents_rels" USING btree ("brands_id");
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk"
        FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "brands_id" integer;
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_brands_id_idx"
      ON "payload_preferences_rels" USING btree ("brands_id");
    DO $$ BEGIN
      ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_brands_fk"
        FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);

  // 5. Columnas brand_id (hasOne) en los 3 bloques + versiones ------------------
  for (const tbl of [
    "pages_blocks_brand_tabs_tabs",
    "pages_blocks_hero_brand_icons",
    "pages_blocks_ad_formats_formats",
    "_pages_v_blocks_brand_tabs_tabs",
    "_pages_v_blocks_hero_brand_icons",
    "_pages_v_blocks_ad_formats_formats",
  ]) {
    await db.execute(sql`
      ALTER TABLE ${sql.raw(`"${tbl}"`)} ADD COLUMN IF NOT EXISTS "brand_id" integer;
      CREATE INDEX IF NOT EXISTS ${sql.raw(`"${tbl}_brand_idx"`)}
        ON ${sql.raw(`"${tbl}"`)} USING btree ("brand_id");
      DO $$ BEGIN
        ALTER TABLE ${sql.raw(`"${tbl}"`)} ADD CONSTRAINT ${sql.raw(`"${tbl}_brand_id_brands_id_fk"`)}
          FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
  }

  // 6. DATA: mapear el enum viejo → brand_id (ANTES de dropear la columna) -------
  // Las tablas son constantes controladas → sql.raw (sin bind params).
  for (const tbl of [
    "pages_blocks_brand_tabs_tabs",
    "pages_blocks_hero_brand_icons",
    "pages_blocks_ad_formats_formats",
    "_pages_v_blocks_brand_tabs_tabs",
    "_pages_v_blocks_hero_brand_icons",
    "_pages_v_blocks_ad_formats_formats",
  ]) {
    await db.execute(
      sql.raw(`
        UPDATE "${tbl}" t
        SET "brand_id" = b.id
        FROM "brands" b
        WHERE b.slug = t."brand"::text AND t."brand_id" IS NULL;
      `),
    );
  }

  // 7. Dropear columnas enum viejas --------------------------------------------
  await db.execute(sql`
    ALTER TABLE "pages_blocks_brand_tabs_tabs" DROP COLUMN IF EXISTS "brand";
    ALTER TABLE "pages_blocks_hero_brand_icons" DROP COLUMN IF EXISTS "brand";
    ALTER TABLE "pages_blocks_ad_formats_formats" DROP COLUMN IF EXISTS "brand";
    ALTER TABLE "_pages_v_blocks_brand_tabs_tabs" DROP COLUMN IF EXISTS "brand";
    ALTER TABLE "_pages_v_blocks_hero_brand_icons" DROP COLUMN IF EXISTS "brand";
    ALTER TABLE "_pages_v_blocks_ad_formats_formats" DROP COLUMN IF EXISTS "brand";
  `);

  // 8. Dropear tablas del select hasMany allowedBrands -------------------------
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_ai_recommendation_allowed_brands" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ai_recommendation_allowed_brands" CASCADE;
  `);

  // 9. Dropear enum types huérfanos --------------------------------------------
  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_pages_blocks_brand_tabs_tabs_brand";
    DROP TYPE IF EXISTS "enum_pages_blocks_hero_brand_icons_brand";
    DROP TYPE IF EXISTS "enum_pages_blocks_ad_formats_formats_brand";
    DROP TYPE IF EXISTS "enum__pages_v_blocks_brand_tabs_tabs_brand";
    DROP TYPE IF EXISTS "enum__pages_v_blocks_hero_brand_icons_brand";
    DROP TYPE IF EXISTS "enum__pages_v_blocks_ad_formats_formats_brand";
    DROP TYPE IF EXISTS "enum_pages_blocks_ai_recommendation_allowed_brands";
    DROP TYPE IF EXISTS "enum__pages_v_blocks_ai_recommendation_allowed_brands";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Best-effort: elimina el nuevo schema. No recrea los enums viejos
  // (las columnas brand quedarían vacías; restaurar contenido no es posible).
  for (const tbl of [
    "pages_blocks_brand_tabs_tabs",
    "pages_blocks_hero_brand_icons",
    "pages_blocks_ad_formats_formats",
    "_pages_v_blocks_brand_tabs_tabs",
    "_pages_v_blocks_hero_brand_icons",
    "_pages_v_blocks_ad_formats_formats",
  ]) {
    await db.execute(
      sql`ALTER TABLE ${sql.raw(`"${tbl}"`)} DROP COLUMN IF EXISTS "brand_id";`,
    );
  }

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "brands_id";
    ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "brands_id";
    DROP TABLE IF EXISTS "pages_rels" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_rels" CASCADE;
    DROP TABLE IF EXISTS "brands" CASCADE;
  `);
}
