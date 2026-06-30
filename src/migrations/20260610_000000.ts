import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/**
 * Migration: C2 Ditu blocks + footer_ditu.encuentranos_label
 *
 * Creates all pages_blocks_ditu_* tables and _pages_v_blocks_ditu_* tables
 * that were dev-pushed locally but never formally migrated.
 * Also adds the encuentranos_label column to footer_ditu (same story).
 *
 * Safe to run on a fresh DB (IF NOT EXISTS everywhere).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

    -- ── Enums (pages_blocks_ditu_*) ─────────────────────────────────────────

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_ditu_hero_buttons_icon_key"
        AS ENUM('googleplay', 'appstore', 'tv');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_ditu_audiencia_devices_icon"
        AS ENUM('smarttv', 'mobile', 'tablet', 'web');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_ditu_audiencia_networks_network"
        AS ENUM('facebook', 'tiktok', 'x', 'youtube', 'instagram', 'whatsapp');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_ditu_calendario_events_badge_variant"
        AS ENUM('cyan', 'violet', 'navy', 'white');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_ditu_pauta_categories_key"
        AS ENUM('ads', 'patrocinio', 'branded', 'eventos');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- ── Enums (_pages_v_blocks_ditu_*) ──────────────────────────────────────

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_ditu_hero_buttons_icon_key"
        AS ENUM('googleplay', 'appstore', 'tv');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_ditu_audiencia_devices_icon"
        AS ENUM('smarttv', 'mobile', 'tablet', 'web');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_ditu_audiencia_networks_network"
        AS ENUM('facebook', 'tiktok', 'x', 'youtube', 'instagram', 'whatsapp');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_ditu_calendario_events_badge_variant"
        AS ENUM('cyan', 'violet', 'navy', 'white');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_ditu_pauta_categories_key"
        AS ENUM('ads', 'patrocinio', 'branded', 'eventos');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- ── pages_blocks_ditu_hero ───────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_hero" (
      "_order"     integer       NOT NULL,
      "_parent_id" integer       NOT NULL,
      "_path"      text          NOT NULL,
      "id"         varchar       PRIMARY KEY,
      "anchor_id"  varchar,
      "sticker_text" varchar,
      "block_name" varchar
    );
    ALTER TABLE "pages_blocks_ditu_hero"
      ADD CONSTRAINT "pages_blocks_ditu_hero_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_hero_order_idx"     ON "pages_blocks_ditu_hero" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_hero_parent_id_idx" ON "pages_blocks_ditu_hero" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_hero_path_idx"      ON "pages_blocks_ditu_hero" ("_path");

    -- ── pages_blocks_ditu_hero_buttons ───────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_hero_buttons" (
      "_order"       integer NOT NULL,
      "_parent_id"   varchar NOT NULL,
      "id"           varchar PRIMARY KEY,
      "label"        varchar,
      "href"         varchar,
      "icon_key"     "public"."enum_pages_blocks_ditu_hero_buttons_icon_key",
      "icon_media_id" integer
    );
    ALTER TABLE "pages_blocks_ditu_hero_buttons"
      ADD CONSTRAINT "pages_blocks_ditu_hero_buttons_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_hero"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "pages_blocks_ditu_hero_buttons"
      ADD CONSTRAINT "pages_blocks_ditu_hero_buttons_icon_media_id_fk"
      FOREIGN KEY ("icon_media_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_hero_buttons_order_idx"      ON "pages_blocks_ditu_hero_buttons" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_hero_buttons_parent_id_idx"  ON "pages_blocks_ditu_hero_buttons" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_hero_buttons_icon_media_idx" ON "pages_blocks_ditu_hero_buttons" ("icon_media_id");

    -- ── pages_blocks_ditu_video ──────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_video" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         varchar PRIMARY KEY,
      "anchor_id"  varchar,
      "image_id"   integer,
      "alt"        varchar,
      "background" varchar,
      "block_name" varchar
    );
    ALTER TABLE "pages_blocks_ditu_video"
      ADD CONSTRAINT "pages_blocks_ditu_video_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "pages_blocks_ditu_video"
      ADD CONSTRAINT "pages_blocks_ditu_video_image_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_video_order_idx"     ON "pages_blocks_ditu_video" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_video_parent_id_idx" ON "pages_blocks_ditu_video" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_video_path_idx"      ON "pages_blocks_ditu_video" ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_video_image_idx"     ON "pages_blocks_ditu_video" ("image_id");

    -- ── pages_blocks_ditu_audiencia ──────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_audiencia" (
      "_order"                  integer NOT NULL,
      "_parent_id"              integer NOT NULL,
      "_path"                   text    NOT NULL,
      "id"                      varchar PRIMARY KEY,
      "anchor_id"               varchar,
      "total_followers_headline" varchar,
      "block_name"              varchar
    );
    ALTER TABLE "pages_blocks_ditu_audiencia"
      ADD CONSTRAINT "pages_blocks_ditu_audiencia_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_audiencia_order_idx"     ON "pages_blocks_ditu_audiencia" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_audiencia_parent_id_idx" ON "pages_blocks_ditu_audiencia" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_audiencia_path_idx"      ON "pages_blocks_ditu_audiencia" ("_path");

    -- ── pages_blocks_ditu_audiencia_stats ────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_audiencia_stats" (
      "_order"      integer NOT NULL,
      "_parent_id"  varchar NOT NULL,
      "id"          varchar PRIMARY KEY,
      "label"       varchar,
      "value"       varchar,
      "description" varchar,
      "icon_id"     integer,
      "large"       boolean
    );
    ALTER TABLE "pages_blocks_ditu_audiencia_stats"
      ADD CONSTRAINT "pages_blocks_ditu_audiencia_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_audiencia"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "pages_blocks_ditu_audiencia_stats"
      ADD CONSTRAINT "pages_blocks_ditu_audiencia_stats_icon_id_fk"
      FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_audiencia_stats_order_idx"     ON "pages_blocks_ditu_audiencia_stats" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_audiencia_stats_parent_id_idx" ON "pages_blocks_ditu_audiencia_stats" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_audiencia_stats_icon_idx"      ON "pages_blocks_ditu_audiencia_stats" ("icon_id");

    -- ── pages_blocks_ditu_audiencia_devices ──────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_audiencia_devices" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY,
      "label"      varchar,
      "minutes"    varchar,
      "icon"       "public"."enum_pages_blocks_ditu_audiencia_devices_icon"
    );
    ALTER TABLE "pages_blocks_ditu_audiencia_devices"
      ADD CONSTRAINT "pages_blocks_ditu_audiencia_devices_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_audiencia"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_audiencia_devices_order_idx"     ON "pages_blocks_ditu_audiencia_devices" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_audiencia_devices_parent_id_idx" ON "pages_blocks_ditu_audiencia_devices" ("_parent_id");

    -- ── pages_blocks_ditu_audiencia_networks ─────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_audiencia_networks" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY,
      "network"    "public"."enum_pages_blocks_ditu_audiencia_networks_network",
      "followers"  varchar,
      "href"       varchar
    );
    ALTER TABLE "pages_blocks_ditu_audiencia_networks"
      ADD CONSTRAINT "pages_blocks_ditu_audiencia_networks_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_audiencia"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_audiencia_networks_order_idx"     ON "pages_blocks_ditu_audiencia_networks" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_audiencia_networks_parent_id_idx" ON "pages_blocks_ditu_audiencia_networks" ("_parent_id");

    -- ── pages_blocks_ditu_adn ────────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_adn" (
      "_order"             integer NOT NULL,
      "_parent_id"         integer NOT NULL,
      "_path"              text    NOT NULL,
      "id"                 varchar PRIMARY KEY,
      "anchor_id"          varchar,
      "gender_male_percent" numeric DEFAULT 52,
      "block_name"         varchar
    );
    ALTER TABLE "pages_blocks_ditu_adn"
      ADD CONSTRAINT "pages_blocks_ditu_adn_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_adn_order_idx"     ON "pages_blocks_ditu_adn" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_adn_parent_id_idx" ON "pages_blocks_ditu_adn" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_adn_path_idx"      ON "pages_blocks_ditu_adn" ("_path");

    -- ── pages_blocks_ditu_adn_age_bars ───────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_adn_age_bars" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY,
      "label"      varchar,
      "value"      varchar,
      "peak"       boolean DEFAULT false
    );
    ALTER TABLE "pages_blocks_ditu_adn_age_bars"
      ADD CONSTRAINT "pages_blocks_ditu_adn_age_bars_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_adn"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_adn_age_bars_order_idx"     ON "pages_blocks_ditu_adn_age_bars" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_adn_age_bars_parent_id_idx" ON "pages_blocks_ditu_adn_age_bars" ("_parent_id");

    -- ── pages_blocks_ditu_adn_nse_cards ──────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_adn_nse_cards" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY,
      "label"      varchar,
      "value"      varchar
    );
    ALTER TABLE "pages_blocks_ditu_adn_nse_cards"
      ADD CONSTRAINT "pages_blocks_ditu_adn_nse_cards_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_adn"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_adn_nse_cards_order_idx"     ON "pages_blocks_ditu_adn_nse_cards" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_adn_nse_cards_parent_id_idx" ON "pages_blocks_ditu_adn_nse_cards" ("_parent_id");

    -- ── pages_blocks_ditu_tipo_contenido ─────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_tipo_contenido" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         varchar PRIMARY KEY,
      "anchor_id"  varchar,
      "block_name" varchar
    );
    ALTER TABLE "pages_blocks_ditu_tipo_contenido"
      ADD CONSTRAINT "pages_blocks_ditu_tipo_contenido_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_tipo_contenido_order_idx"     ON "pages_blocks_ditu_tipo_contenido" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_tipo_contenido_parent_id_idx" ON "pages_blocks_ditu_tipo_contenido" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_tipo_contenido_path_idx"      ON "pages_blocks_ditu_tipo_contenido" ("_path");

    -- ── pages_blocks_ditu_tipo_contenido_tabs ────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_tipo_contenido_tabs" (
      "_order"      integer NOT NULL,
      "_parent_id"  varchar NOT NULL,
      "id"          varchar PRIMARY KEY,
      "label"       varchar,
      "description" varchar
    );
    ALTER TABLE "pages_blocks_ditu_tipo_contenido_tabs"
      ADD CONSTRAINT "pages_blocks_ditu_tipo_contenido_tabs_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_tipo_contenido"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_tipo_contenido_tabs_order_idx"     ON "pages_blocks_ditu_tipo_contenido_tabs" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_tipo_contenido_tabs_parent_id_idx" ON "pages_blocks_ditu_tipo_contenido_tabs" ("_parent_id");

    -- ── pages_blocks_ditu_canales ────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_canales" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         varchar PRIMARY KEY,
      "anchor_id"  varchar,
      "block_name" varchar
    );
    ALTER TABLE "pages_blocks_ditu_canales"
      ADD CONSTRAINT "pages_blocks_ditu_canales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_order_idx"     ON "pages_blocks_ditu_canales" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_parent_id_idx" ON "pages_blocks_ditu_canales" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_path_idx"      ON "pages_blocks_ditu_canales" ("_path");

    -- ── pages_blocks_ditu_canales_channels_en_vivo ───────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_canales_channels_en_vivo" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY,
      "name"       varchar,
      "logo_id"    integer
    );
    ALTER TABLE "pages_blocks_ditu_canales_channels_en_vivo"
      ADD CONSTRAINT "pages_blocks_ditu_canales_channels_en_vivo_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_canales"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "pages_blocks_ditu_canales_channels_en_vivo"
      ADD CONSTRAINT "pages_blocks_ditu_canales_channels_en_vivo_logo_fk"
      FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_channels_en_vivo_order_idx"     ON "pages_blocks_ditu_canales_channels_en_vivo" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_channels_en_vivo_parent_id_idx" ON "pages_blocks_ditu_canales_channels_en_vivo" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_channels_en_vivo_logo_idx"      ON "pages_blocks_ditu_canales_channels_en_vivo" ("logo_id");

    -- ── pages_blocks_ditu_canales_channels_fast ──────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_canales_channels_fast" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY,
      "name"       varchar,
      "logo_id"    integer
    );
    ALTER TABLE "pages_blocks_ditu_canales_channels_fast"
      ADD CONSTRAINT "pages_blocks_ditu_canales_channels_fast_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_canales"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "pages_blocks_ditu_canales_channels_fast"
      ADD CONSTRAINT "pages_blocks_ditu_canales_channels_fast_logo_fk"
      FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_channels_fast_order_idx"     ON "pages_blocks_ditu_canales_channels_fast" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_channels_fast_parent_id_idx" ON "pages_blocks_ditu_canales_channels_fast" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_channels_fast_logo_idx"      ON "pages_blocks_ditu_canales_channels_fast" ("logo_id");

    -- ── pages_blocks_ditu_canales_channels_aliados ───────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_canales_channels_aliados" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY,
      "name"       varchar,
      "logo_id"    integer
    );
    ALTER TABLE "pages_blocks_ditu_canales_channels_aliados"
      ADD CONSTRAINT "pages_blocks_ditu_canales_channels_aliados_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_canales"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "pages_blocks_ditu_canales_channels_aliados"
      ADD CONSTRAINT "pages_blocks_ditu_canales_channels_aliados_logo_fk"
      FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_channels_aliados_order_idx"     ON "pages_blocks_ditu_canales_channels_aliados" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_channels_aliados_parent_id_idx" ON "pages_blocks_ditu_canales_channels_aliados" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_canales_channels_aliados_logo_idx"      ON "pages_blocks_ditu_canales_channels_aliados" ("logo_id");

    -- ── pages_blocks_ditu_calendario ─────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_calendario" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         varchar PRIMARY KEY,
      "anchor_id"  varchar,
      "block_name" varchar
    );
    ALTER TABLE "pages_blocks_ditu_calendario"
      ADD CONSTRAINT "pages_blocks_ditu_calendario_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_calendario_order_idx"     ON "pages_blocks_ditu_calendario" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_calendario_parent_id_idx" ON "pages_blocks_ditu_calendario" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_calendario_path_idx"      ON "pages_blocks_ditu_calendario" ("_path");

    -- ── pages_blocks_ditu_calendario_events ──────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_calendario_events" (
      "_order"         integer NOT NULL,
      "_parent_id"     varchar NOT NULL,
      "id"             varchar PRIMARY KEY,
      "date_label"     varchar,
      "start_date"     timestamp with time zone,
      "end_date"       timestamp with time zone,
      "title"          varchar,
      "subtitle"       varchar,
      "category"       varchar,
      "badge_variant"  "public"."enum_pages_blocks_ditu_calendario_events_badge_variant" DEFAULT 'cyan'
    );
    ALTER TABLE "pages_blocks_ditu_calendario_events"
      ADD CONSTRAINT "pages_blocks_ditu_calendario_events_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_calendario"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_calendario_events_order_idx"     ON "pages_blocks_ditu_calendario_events" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_calendario_events_parent_id_idx" ON "pages_blocks_ditu_calendario_events" ("_parent_id");

    -- ── pages_blocks_ditu_pauta ──────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_pauta" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         varchar PRIMARY KEY,
      "anchor_id"  varchar,
      "block_name" varchar
    );
    ALTER TABLE "pages_blocks_ditu_pauta"
      ADD CONSTRAINT "pages_blocks_ditu_pauta_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_pauta_order_idx"     ON "pages_blocks_ditu_pauta" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_pauta_parent_id_idx" ON "pages_blocks_ditu_pauta" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_pauta_path_idx"      ON "pages_blocks_ditu_pauta" ("_path");

    -- ── pages_blocks_ditu_pauta_categories ───────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_pauta_categories" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY,
      "key"        "public"."enum_pages_blocks_ditu_pauta_categories_key",
      "label"      varchar
    );
    ALTER TABLE "pages_blocks_ditu_pauta_categories"
      ADD CONSTRAINT "pages_blocks_ditu_pauta_categories_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_pauta"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_pauta_categories_order_idx"     ON "pages_blocks_ditu_pauta_categories" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_pauta_categories_parent_id_idx" ON "pages_blocks_ditu_pauta_categories" ("_parent_id");

    -- ── pages_blocks_ditu_pauta_categories_formats ───────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_pauta_categories_formats" (
      "_order"      integer NOT NULL,
      "_parent_id"  varchar NOT NULL,
      "id"          varchar PRIMARY KEY,
      "tag"         varchar,
      "title"       varchar,
      "description" varchar,
      "image_id"    integer
    );
    ALTER TABLE "pages_blocks_ditu_pauta_categories_formats"
      ADD CONSTRAINT "pages_blocks_ditu_pauta_categories_formats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ditu_pauta_categories"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "pages_blocks_ditu_pauta_categories_formats"
      ADD CONSTRAINT "pages_blocks_ditu_pauta_categories_formats_image_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_pauta_categories_formats_order_idx"     ON "pages_blocks_ditu_pauta_categories_formats" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_pauta_categories_formats_parent_id_idx" ON "pages_blocks_ditu_pauta_categories_formats" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_pauta_categories_formats_image_idx"     ON "pages_blocks_ditu_pauta_categories_formats" ("image_id");

    -- ── pages_blocks_ditu_hablamos ───────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "pages_blocks_ditu_hablamos" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         varchar PRIMARY KEY,
      "anchor_id"  varchar,
      "block_name" varchar
    );
    ALTER TABLE "pages_blocks_ditu_hablamos"
      ADD CONSTRAINT "pages_blocks_ditu_hablamos_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_hablamos_order_idx"     ON "pages_blocks_ditu_hablamos" ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_hablamos_parent_id_idx" ON "pages_blocks_ditu_hablamos" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_ditu_hablamos_path_idx"      ON "pages_blocks_ditu_hablamos" ("_path");

    -- ════════════════════════════════════════════════════════════════════════
    -- _pages_v (versioned) counterparts
    -- ════════════════════════════════════════════════════════════════════════

    -- ── _pages_v_blocks_ditu_hero ────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_hero" (
      "_order"       integer NOT NULL,
      "_parent_id"   integer NOT NULL,
      "_path"        text    NOT NULL,
      "id"           integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"        varchar,
      "anchor_id"    varchar,
      "sticker_text" varchar,
      "block_name"   varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_hero"
      ADD CONSTRAINT "_pages_v_blocks_ditu_hero_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_hero_order_idx"     ON "_pages_v_blocks_ditu_hero" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_hero_parent_id_idx" ON "_pages_v_blocks_ditu_hero" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_hero_path_idx"      ON "_pages_v_blocks_ditu_hero" ("_path");

    -- ── _pages_v_blocks_ditu_hero_buttons ────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_hero_buttons" (
      "_order"       integer NOT NULL,
      "_parent_id"   integer NOT NULL,
      "id"           integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"        varchar,
      "label"        varchar,
      "href"         varchar,
      "icon_key"     "public"."enum__pages_v_blocks_ditu_hero_buttons_icon_key",
      "icon_media_id" integer
    );
    ALTER TABLE "_pages_v_blocks_ditu_hero_buttons"
      ADD CONSTRAINT "_pages_v_blocks_ditu_hero_buttons_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_hero"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "_pages_v_blocks_ditu_hero_buttons"
      ADD CONSTRAINT "_pages_v_blocks_ditu_hero_buttons_icon_media_fk"
      FOREIGN KEY ("icon_media_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_hero_buttons_order_idx"      ON "_pages_v_blocks_ditu_hero_buttons" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_hero_buttons_parent_id_idx"  ON "_pages_v_blocks_ditu_hero_buttons" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_hero_buttons_icon_media_idx" ON "_pages_v_blocks_ditu_hero_buttons" ("icon_media_id");

    -- ── _pages_v_blocks_ditu_video ───────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_video" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "anchor_id"  varchar,
      "image_id"   integer,
      "alt"        varchar,
      "background" varchar,
      "block_name" varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_video"
      ADD CONSTRAINT "_pages_v_blocks_ditu_video_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "_pages_v_blocks_ditu_video"
      ADD CONSTRAINT "_pages_v_blocks_ditu_video_image_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_video_order_idx"     ON "_pages_v_blocks_ditu_video" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_video_parent_id_idx" ON "_pages_v_blocks_ditu_video" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_video_path_idx"      ON "_pages_v_blocks_ditu_video" ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_video_image_idx"     ON "_pages_v_blocks_ditu_video" ("image_id");

    -- ── _pages_v_blocks_ditu_audiencia ───────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_audiencia" (
      "_order"                   integer NOT NULL,
      "_parent_id"               integer NOT NULL,
      "_path"                    text    NOT NULL,
      "id"                       integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"                    varchar,
      "anchor_id"                varchar,
      "total_followers_headline" varchar,
      "block_name"               varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_audiencia"
      ADD CONSTRAINT "_pages_v_blocks_ditu_audiencia_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_order_idx"     ON "_pages_v_blocks_ditu_audiencia" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_parent_id_idx" ON "_pages_v_blocks_ditu_audiencia" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_path_idx"      ON "_pages_v_blocks_ditu_audiencia" ("_path");

    -- ── _pages_v_blocks_ditu_audiencia_stats ─────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_stats" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "id"          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"       varchar,
      "label"       varchar,
      "value"       varchar,
      "description" varchar,
      "icon_id"     integer,
      "large"       boolean
    );
    ALTER TABLE "_pages_v_blocks_ditu_audiencia_stats"
      ADD CONSTRAINT "_pages_v_blocks_ditu_audiencia_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_audiencia"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "_pages_v_blocks_ditu_audiencia_stats"
      ADD CONSTRAINT "_pages_v_blocks_ditu_audiencia_stats_icon_fk"
      FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_stats_order_idx"     ON "_pages_v_blocks_ditu_audiencia_stats" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_stats_parent_id_idx" ON "_pages_v_blocks_ditu_audiencia_stats" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_stats_icon_idx"      ON "_pages_v_blocks_ditu_audiencia_stats" ("icon_id");

    -- ── _pages_v_blocks_ditu_audiencia_devices ───────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_devices" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "label"      varchar,
      "minutes"    varchar,
      "icon"       "public"."enum__pages_v_blocks_ditu_audiencia_devices_icon"
    );
    ALTER TABLE "_pages_v_blocks_ditu_audiencia_devices"
      ADD CONSTRAINT "_pages_v_blocks_ditu_audiencia_devices_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_audiencia"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_devices_order_idx"     ON "_pages_v_blocks_ditu_audiencia_devices" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_devices_parent_id_idx" ON "_pages_v_blocks_ditu_audiencia_devices" ("_parent_id");

    -- ── _pages_v_blocks_ditu_audiencia_networks ──────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_networks" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "network"    "public"."enum__pages_v_blocks_ditu_audiencia_networks_network",
      "followers"  varchar,
      "href"       varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_audiencia_networks"
      ADD CONSTRAINT "_pages_v_blocks_ditu_audiencia_networks_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_audiencia"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_networks_order_idx"     ON "_pages_v_blocks_ditu_audiencia_networks" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_audiencia_networks_parent_id_idx" ON "_pages_v_blocks_ditu_audiencia_networks" ("_parent_id");

    -- ── _pages_v_blocks_ditu_adn ─────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_adn" (
      "_order"              integer NOT NULL,
      "_parent_id"          integer NOT NULL,
      "_path"               text    NOT NULL,
      "id"                  integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"               varchar,
      "anchor_id"           varchar,
      "gender_male_percent" numeric DEFAULT 52,
      "block_name"          varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_adn"
      ADD CONSTRAINT "_pages_v_blocks_ditu_adn_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_adn_order_idx"     ON "_pages_v_blocks_ditu_adn" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_adn_parent_id_idx" ON "_pages_v_blocks_ditu_adn" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_adn_path_idx"      ON "_pages_v_blocks_ditu_adn" ("_path");

    -- ── _pages_v_blocks_ditu_adn_age_bars ────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_adn_age_bars" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "label"      varchar,
      "value"      varchar,
      "peak"       boolean DEFAULT false
    );
    ALTER TABLE "_pages_v_blocks_ditu_adn_age_bars"
      ADD CONSTRAINT "_pages_v_blocks_ditu_adn_age_bars_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_adn"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_adn_age_bars_order_idx"     ON "_pages_v_blocks_ditu_adn_age_bars" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_adn_age_bars_parent_id_idx" ON "_pages_v_blocks_ditu_adn_age_bars" ("_parent_id");

    -- ── _pages_v_blocks_ditu_adn_nse_cards ───────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_adn_nse_cards" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "label"      varchar,
      "value"      varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_adn_nse_cards"
      ADD CONSTRAINT "_pages_v_blocks_ditu_adn_nse_cards_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_adn"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_adn_nse_cards_order_idx"     ON "_pages_v_blocks_ditu_adn_nse_cards" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_adn_nse_cards_parent_id_idx" ON "_pages_v_blocks_ditu_adn_nse_cards" ("_parent_id");

    -- ── _pages_v_blocks_ditu_tipo_contenido ──────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_tipo_contenido" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "anchor_id"  varchar,
      "block_name" varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_tipo_contenido"
      ADD CONSTRAINT "_pages_v_blocks_ditu_tipo_contenido_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_tipo_contenido_order_idx"     ON "_pages_v_blocks_ditu_tipo_contenido" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_tipo_contenido_parent_id_idx" ON "_pages_v_blocks_ditu_tipo_contenido" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_tipo_contenido_path_idx"      ON "_pages_v_blocks_ditu_tipo_contenido" ("_path");

    -- ── _pages_v_blocks_ditu_tipo_contenido_tabs ─────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_tipo_contenido_tabs" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "id"          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"       varchar,
      "label"       varchar,
      "description" varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_tipo_contenido_tabs"
      ADD CONSTRAINT "_pages_v_blocks_ditu_tipo_contenido_tabs_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_tipo_contenido"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_tipo_contenido_tabs_order_idx"     ON "_pages_v_blocks_ditu_tipo_contenido_tabs" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_tipo_contenido_tabs_parent_id_idx" ON "_pages_v_blocks_ditu_tipo_contenido_tabs" ("_parent_id");

    -- ── _pages_v_blocks_ditu_canales ─────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_canales" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "anchor_id"  varchar,
      "block_name" varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_canales"
      ADD CONSTRAINT "_pages_v_blocks_ditu_canales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_order_idx"     ON "_pages_v_blocks_ditu_canales" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_parent_id_idx" ON "_pages_v_blocks_ditu_canales" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_path_idx"      ON "_pages_v_blocks_ditu_canales" ("_path");

    -- ── _pages_v_blocks_ditu_canales_channels_en_vivo ────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_en_vivo" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "name"       varchar,
      "logo_id"    integer
    );
    ALTER TABLE "_pages_v_blocks_ditu_canales_channels_en_vivo"
      ADD CONSTRAINT "_pages_v_blocks_ditu_canales_channels_en_vivo_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_canales"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "_pages_v_blocks_ditu_canales_channels_en_vivo"
      ADD CONSTRAINT "_pages_v_blocks_ditu_canales_channels_en_vivo_logo_fk"
      FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_en_vivo_order_idx"     ON "_pages_v_blocks_ditu_canales_channels_en_vivo" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_en_vivo_parent_id_idx" ON "_pages_v_blocks_ditu_canales_channels_en_vivo" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_en_vivo_logo_idx"      ON "_pages_v_blocks_ditu_canales_channels_en_vivo" ("logo_id");

    -- ── _pages_v_blocks_ditu_canales_channels_fast ───────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_fast" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "name"       varchar,
      "logo_id"    integer
    );
    ALTER TABLE "_pages_v_blocks_ditu_canales_channels_fast"
      ADD CONSTRAINT "_pages_v_blocks_ditu_canales_channels_fast_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_canales"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "_pages_v_blocks_ditu_canales_channels_fast"
      ADD CONSTRAINT "_pages_v_blocks_ditu_canales_channels_fast_logo_fk"
      FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_fast_order_idx"     ON "_pages_v_blocks_ditu_canales_channels_fast" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_fast_parent_id_idx" ON "_pages_v_blocks_ditu_canales_channels_fast" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_fast_logo_idx"      ON "_pages_v_blocks_ditu_canales_channels_fast" ("logo_id");

    -- ── _pages_v_blocks_ditu_canales_channels_aliados ────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_aliados" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "name"       varchar,
      "logo_id"    integer
    );
    ALTER TABLE "_pages_v_blocks_ditu_canales_channels_aliados"
      ADD CONSTRAINT "_pages_v_blocks_ditu_canales_channels_aliados_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_canales"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "_pages_v_blocks_ditu_canales_channels_aliados"
      ADD CONSTRAINT "_pages_v_blocks_ditu_canales_channels_aliados_logo_fk"
      FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_aliados_order_idx"     ON "_pages_v_blocks_ditu_canales_channels_aliados" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_aliados_parent_id_idx" ON "_pages_v_blocks_ditu_canales_channels_aliados" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_canales_channels_aliados_logo_idx"      ON "_pages_v_blocks_ditu_canales_channels_aliados" ("logo_id");

    -- ── _pages_v_blocks_ditu_calendario ──────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_calendario" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "anchor_id"  varchar,
      "block_name" varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_calendario"
      ADD CONSTRAINT "_pages_v_blocks_ditu_calendario_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_calendario_order_idx"     ON "_pages_v_blocks_ditu_calendario" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_calendario_parent_id_idx" ON "_pages_v_blocks_ditu_calendario" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_calendario_path_idx"      ON "_pages_v_blocks_ditu_calendario" ("_path");

    -- ── _pages_v_blocks_ditu_calendario_events ───────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_calendario_events" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"         varchar,
      "date_label"    varchar,
      "start_date"    timestamp with time zone,
      "end_date"      timestamp with time zone,
      "title"         varchar,
      "subtitle"      varchar,
      "category"      varchar,
      "badge_variant" "public"."enum__pages_v_blocks_ditu_calendario_events_badge_variant" DEFAULT 'cyan'
    );
    ALTER TABLE "_pages_v_blocks_ditu_calendario_events"
      ADD CONSTRAINT "_pages_v_blocks_ditu_calendario_events_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_calendario"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_calendario_events_order_idx"     ON "_pages_v_blocks_ditu_calendario_events" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_calendario_events_parent_id_idx" ON "_pages_v_blocks_ditu_calendario_events" ("_parent_id");

    -- ── _pages_v_blocks_ditu_pauta ───────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_pauta" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "anchor_id"  varchar,
      "block_name" varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_pauta"
      ADD CONSTRAINT "_pages_v_blocks_ditu_pauta_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_pauta_order_idx"     ON "_pages_v_blocks_ditu_pauta" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_pauta_parent_id_idx" ON "_pages_v_blocks_ditu_pauta" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_pauta_path_idx"      ON "_pages_v_blocks_ditu_pauta" ("_path");

    -- ── _pages_v_blocks_ditu_pauta_categories ────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_pauta_categories" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "key"        "public"."enum__pages_v_blocks_ditu_pauta_categories_key",
      "label"      varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_pauta_categories"
      ADD CONSTRAINT "_pages_v_blocks_ditu_pauta_categories_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_pauta"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_pauta_categories_order_idx"     ON "_pages_v_blocks_ditu_pauta_categories" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_pauta_categories_parent_id_idx" ON "_pages_v_blocks_ditu_pauta_categories" ("_parent_id");

    -- ── _pages_v_blocks_ditu_pauta_categories_formats ────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_pauta_categories_formats" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "id"          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"       varchar,
      "tag"         varchar,
      "title"       varchar,
      "description" varchar,
      "image_id"    integer
    );
    ALTER TABLE "_pages_v_blocks_ditu_pauta_categories_formats"
      ADD CONSTRAINT "_pages_v_blocks_ditu_pauta_categories_formats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ditu_pauta_categories"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "_pages_v_blocks_ditu_pauta_categories_formats"
      ADD CONSTRAINT "_pages_v_blocks_ditu_pauta_categories_formats_image_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_pauta_categories_formats_order_idx"     ON "_pages_v_blocks_ditu_pauta_categories_formats" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_pauta_categories_formats_parent_id_idx" ON "_pages_v_blocks_ditu_pauta_categories_formats" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_pauta_categories_formats_image_idx"     ON "_pages_v_blocks_ditu_pauta_categories_formats" ("image_id");

    -- ── _pages_v_blocks_ditu_hablamos ────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ditu_hablamos" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      "_uuid"      varchar,
      "anchor_id"  varchar,
      "block_name" varchar
    );
    ALTER TABLE "_pages_v_blocks_ditu_hablamos"
      ADD CONSTRAINT "_pages_v_blocks_ditu_hablamos_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_hablamos_order_idx"     ON "_pages_v_blocks_ditu_hablamos" ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_hablamos_parent_id_idx" ON "_pages_v_blocks_ditu_hablamos" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ditu_hablamos_path_idx"      ON "_pages_v_blocks_ditu_hablamos" ("_path");

    -- ── footer_ditu: add encuentranos_label if not present ───────────────────

    ALTER TABLE "footer_ditu"
      ADD COLUMN IF NOT EXISTS "encuentranos_label" varchar;

  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`

    ALTER TABLE "footer_ditu" DROP COLUMN IF EXISTS "encuentranos_label";

    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_hablamos" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_pauta_categories_formats" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_pauta_categories" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_pauta" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_calendario_events" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_calendario" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_canales_channels_aliados" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_canales_channels_fast" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_canales_channels_en_vivo" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_canales" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_tipo_contenido_tabs" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_tipo_contenido" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_adn_nse_cards" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_adn_age_bars" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_adn" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_audiencia_networks" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_audiencia_devices" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_audiencia_stats" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_audiencia" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_video" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_hero_buttons" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_ditu_hero" CASCADE;

    DROP TABLE IF EXISTS "pages_blocks_ditu_hablamos" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_pauta_categories_formats" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_pauta_categories" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_pauta" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_calendario_events" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_calendario" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_canales_channels_aliados" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_canales_channels_fast" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_canales_channels_en_vivo" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_canales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_tipo_contenido_tabs" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_tipo_contenido" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_adn_nse_cards" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_adn_age_bars" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_adn" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_audiencia_networks" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_audiencia_devices" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_audiencia_stats" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_audiencia" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_video" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_hero_buttons" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_ditu_hero" CASCADE;

    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_ditu_pauta_categories_key";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_ditu_calendario_events_badge_variant";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_ditu_audiencia_networks_network";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_ditu_audiencia_devices_icon";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_ditu_hero_buttons_icon_key";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_ditu_pauta_categories_key";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_ditu_calendario_events_badge_variant";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_ditu_audiencia_networks_network";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_ditu_audiencia_devices_icon";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_ditu_hero_buttons_icon_key";

  `);
}
