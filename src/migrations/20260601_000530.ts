import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_brand_icons_brand" AS ENUM('ditu', 'caracoltv', 'golcaracol', 'caracolsports', 'bluradio', 'lakalle', 'volk', 'bumbox', 'caracoldigital', 'caracolmedios');
  CREATE TYPE "public"."enum_pages_blocks_hero_primary_cta_variant" AS ENUM('default', 'outline', 'ghost', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum_pages_blocks_hero_secondary_cta_variant" AS ENUM('default', 'outline', 'ghost', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum_pages_blocks_hero_tone" AS ENUM('default', 'caracolnext-deep', 'ditu-deep', 'image-overlay');
  CREATE TYPE "public"."enum_pages_blocks_audience_networks_networks_network" AS ENUM('instagram', 'facebook', 'tiktok', 'youtube', 'x', 'threads', 'whatsapp', 'linkedin', 'web');
  CREATE TYPE "public"."enum_pages_blocks_brand_tabs_tabs_networks_network" AS ENUM('instagram', 'facebook', 'tiktok', 'youtube', 'x', 'threads', 'whatsapp', 'linkedin', 'web');
  CREATE TYPE "public"."enum_pages_blocks_brand_tabs_tabs_brand" AS ENUM('ditu', 'caracoltv', 'golcaracol', 'caracolsports', 'bluradio', 'lakalle', 'volk', 'bumbox', 'caracoldigital', 'caracolmedios');
  CREATE TYPE "public"."enum_pages_blocks_brand_tabs_tabs_cta_contact_variant" AS ENUM('default', 'outline', 'ghost', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum_pages_blocks_key_moments_events_importance" AS ENUM('critical', 'high', 'medium');
  CREATE TYPE "public"."enum_pages_blocks_key_moments_events_category" AS ENUM('sports', 'entertainment', 'news', 'special', 'other');
  CREATE TYPE "public"."enum_pages_blocks_key_moments_events_cta_variant" AS ENUM('default', 'outline', 'ghost', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum_pages_blocks_key_moments_display_mode" AS ENUM('grid', 'timeline', 'list');
  CREATE TYPE "public"."enum_pages_blocks_ad_formats_formats_brand" AS ENUM('ditu', 'caracoltv', 'golcaracol', 'caracolsports', 'bluradio', 'lakalle', 'volk', 'bumbox', 'caracoldigital', 'caracolmedios');
  CREATE TYPE "public"."enum_pages_blocks_ad_formats_formats_category" AS ENUM('display', 'video', 'audio', 'branded', 'sponsorship', 'multigallery', 'other');
  CREATE TYPE "public"."enum_pages_blocks_ad_formats_display_mode" AS ENUM('grid', 'table', 'accordion', 'vertical-tabs');
  CREATE TYPE "public"."bc_multimedia_type" AS ENUM('youtube', 'image', 'video');
  CREATE TYPE "public"."enum_pages_blocks_our_channels_channels_category" AS ENUM('cine', 'series', 'deportes', 'noticias', 'entretenimiento', 'infantil', 'otro');
  CREATE TYPE "public"."enum_pages_blocks_our_channels_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_contact_cta_button_variant" AS ENUM('default', 'outline', 'ghost', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum_pages_blocks_contact_layout" AS ENUM('form-reps', 'stacked', 'reps-only', 'form-only', 'cta-simple');
  CREATE TYPE "public"."enum_pages_blocks_ai_recommendation_allowed_brands" AS ENUM('ditu', 'caracoltv', 'golcaracol', 'caracolsports', 'bluradio', 'lakalle', 'volk', 'bumbox', 'caracoldigital', 'caracolmedios');
  CREATE TYPE "public"."enum_pages_blocks_ai_recommendation_model" AS ENUM('anthropic/claude-haiku-4-5', 'anthropic/claude-sonnet-4-6', 'openai/gpt-4o-mini', 'openai/gpt-4.1');
  CREATE TYPE "public"."enum_pages_landing" AS ENUM('caracol-next', 'ditu');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_brand_icons_brand" AS ENUM('ditu', 'caracoltv', 'golcaracol', 'caracolsports', 'bluradio', 'lakalle', 'volk', 'bumbox', 'caracoldigital', 'caracolmedios');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_primary_cta_variant" AS ENUM('default', 'outline', 'ghost', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_secondary_cta_variant" AS ENUM('default', 'outline', 'ghost', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_tone" AS ENUM('default', 'caracolnext-deep', 'ditu-deep', 'image-overlay');
  CREATE TYPE "public"."enum__pages_v_blocks_audience_networks_networks_network" AS ENUM('instagram', 'facebook', 'tiktok', 'youtube', 'x', 'threads', 'whatsapp', 'linkedin', 'web');
  CREATE TYPE "public"."enum__pages_v_blocks_brand_tabs_tabs_networks_network" AS ENUM('instagram', 'facebook', 'tiktok', 'youtube', 'x', 'threads', 'whatsapp', 'linkedin', 'web');
  CREATE TYPE "public"."enum__pages_v_blocks_brand_tabs_tabs_brand" AS ENUM('ditu', 'caracoltv', 'golcaracol', 'caracolsports', 'bluradio', 'lakalle', 'volk', 'bumbox', 'caracoldigital', 'caracolmedios');
  CREATE TYPE "public"."enum__pages_v_blocks_brand_tabs_tabs_cta_contact_variant" AS ENUM('default', 'outline', 'ghost', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum__pages_v_blocks_key_moments_events_importance" AS ENUM('critical', 'high', 'medium');
  CREATE TYPE "public"."enum__pages_v_blocks_key_moments_events_category" AS ENUM('sports', 'entertainment', 'news', 'special', 'other');
  CREATE TYPE "public"."enum__pages_v_blocks_key_moments_events_cta_variant" AS ENUM('default', 'outline', 'ghost', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum__pages_v_blocks_key_moments_display_mode" AS ENUM('grid', 'timeline', 'list');
  CREATE TYPE "public"."enum__pages_v_blocks_ad_formats_formats_brand" AS ENUM('ditu', 'caracoltv', 'golcaracol', 'caracolsports', 'bluradio', 'lakalle', 'volk', 'bumbox', 'caracoldigital', 'caracolmedios');
  CREATE TYPE "public"."enum__pages_v_blocks_ad_formats_formats_category" AS ENUM('display', 'video', 'audio', 'branded', 'sponsorship', 'multigallery', 'other');
  CREATE TYPE "public"."enum__pages_v_blocks_ad_formats_display_mode" AS ENUM('grid', 'table', 'accordion', 'vertical-tabs');
  CREATE TYPE "public"."enum__pages_v_blocks_our_channels_channels_category" AS ENUM('cine', 'series', 'deportes', 'noticias', 'entretenimiento', 'infantil', 'otro');
  CREATE TYPE "public"."enum__pages_v_blocks_our_channels_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_cta_button_variant" AS ENUM('default', 'outline', 'ghost', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_layout" AS ENUM('form-reps', 'stacked', 'reps-only', 'form-only', 'cta-simple');
  CREATE TYPE "public"."enum__pages_v_blocks_ai_recommendation_allowed_brands" AS ENUM('ditu', 'caracoltv', 'golcaracol', 'caracolsports', 'bluradio', 'lakalle', 'volk', 'bumbox', 'caracoldigital', 'caracolmedios');
  CREATE TYPE "public"."enum__pages_v_blocks_ai_recommendation_model" AS ENUM('anthropic/claude-haiku-4-5', 'anthropic/claude-sonnet-4-6', 'openai/gpt-4o-mini', 'openai/gpt-4.1');
  CREATE TYPE "public"."enum__pages_v_version_landing" AS ENUM('caracol-next', 'ditu');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_header_caracol_next_cta_button_variant" AS ENUM('default', 'outline', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum_header_ditu_cta_button_variant" AS ENUM('default', 'outline', 'brand-caracolnext', 'brand-ditu');
  CREATE TYPE "public"."enum_footer_caracol_next_social_links_network" AS ENUM('instagram', 'facebook', 'tiktok', 'youtube', 'x', 'threads', 'whatsapp', 'linkedin', 'web');
  CREATE TYPE "public"."enum_footer_caracol_next_tone" AS ENUM('dark', 'caracolnext-deep', 'ditu-deep', 'default');
  CREATE TYPE "public"."enum_footer_ditu_social_links_network" AS ENUM('instagram', 'facebook', 'tiktok', 'youtube', 'x', 'threads', 'whatsapp', 'linkedin', 'web');
  CREATE TYPE "public"."enum_footer_ditu_tone" AS ENUM('dark', 'caracolnext-deep', 'ditu-deep', 'default');
  CREATE TYPE "public"."enum_floating_contact_button_icon" AS ENUM('MessageCircle', 'PhoneCall', 'Sparkles', 'Mail');
  CREATE TYPE "public"."enum_floating_contact_position" AS ENUM('bottom-right', 'bottom-left');
  CREATE TYPE "public"."enum_site_settings_primary_brand" AS ENUM('caracol-next', 'ditu');
  CREATE TABLE IF NOT EXISTS "pages_blocks_hero_key_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"value_prefix" varchar,
  	"value_suffix" varchar,
  	"label" varchar,
  	"hint" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_hero_brand_icons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"brand" "enum_pages_blocks_hero_brand_icons_brand",
  	"icon_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_bold" varchar,
  	"subheading" varchar,
  	"background_image_id" integer,
  	"background_video_id" integer,
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"primary_cta_variant" "enum_pages_blocks_hero_primary_cta_variant" DEFAULT 'default',
  	"primary_cta_open_in_new_tab" boolean DEFAULT false,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"secondary_cta_variant" "enum_pages_blocks_hero_secondary_cta_variant" DEFAULT 'default',
  	"secondary_cta_open_in_new_tab" boolean DEFAULT false,
  	"tone" "enum_pages_blocks_hero_tone" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_audience_networks_audience_breakdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"suffix" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_audience_networks_networks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"network" "enum_pages_blocks_audience_networks_networks_network",
  	"handle" varchar,
  	"followers" numeric,
  	"growth" numeric,
  	"url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_audience_networks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"audience_reach" numeric,
  	"audience_reach_label" varchar DEFAULT 'Personas alcanzadas',
  	"audience_reach_suffix" varchar,
  	"highlighted_network" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_audience_profile_age_bars" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"suffix" varchar DEFAULT 'min'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_audience_profile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"gender_split_female_percent" numeric DEFAULT 52,
  	"gender_split_female_label" varchar DEFAULT 'Mujeres',
  	"gender_split_male_label" varchar DEFAULT 'Hombres',
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_estratos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"suffix" varchar DEFAULT '%',
  	"hint" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_estratos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"footnote" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_content_type_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_content_type" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"default_index" numeric DEFAULT 0,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_brand_tabs_tabs_audience_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"value_suffix" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_brand_tabs_tabs_audience_age_picks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"range" varchar,
  	"value" numeric,
  	"is_peak" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_brand_tabs_tabs_networks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"network" "enum_pages_blocks_brand_tabs_tabs_networks_network",
  	"handle" varchar,
  	"followers" numeric,
  	"url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_brand_tabs_tabs_ad_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer,
  	"specs" jsonb,
  	"download_url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_brand_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"brand" "enum_pages_blocks_brand_tabs_tabs_brand",
  	"display_name" varchar,
  	"brand_logo_id" integer,
  	"brand_color" varchar,
  	"tagline" varchar,
  	"why_choose" jsonb,
  	"web_metrics_users_per_month" numeric,
  	"web_metrics_users_label" varchar DEFAULT 'Usuarios/mes',
  	"web_metrics_views_per_month" numeric,
  	"web_metrics_views_label" varchar DEFAULT 'Vistas/mes',
  	"audience_reach" numeric,
  	"audience_reach_label" varchar DEFAULT 'Personas alcanzadas',
  	"audience_reach_suffix" varchar,
  	"audience_gender_split_female_percent" numeric,
  	"audience_gender_split_female_label" varchar DEFAULT 'Mujeres',
  	"audience_gender_split_male_label" varchar DEFAULT 'Hombres',
  	"audience_peak_age_range" varchar,
  	"cta_contact_label" varchar,
  	"cta_contact_href" varchar,
  	"cta_contact_variant" "enum_pages_blocks_brand_tabs_tabs_cta_contact_variant" DEFAULT 'default',
  	"cta_contact_open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_brand_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"default_tab" numeric DEFAULT 0,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_key_moments_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"date_start" timestamp(3) with time zone,
  	"date_end" timestamp(3) with time zone,
  	"date_label_override" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"importance" "enum_pages_blocks_key_moments_events_importance" DEFAULT 'high',
  	"category" "enum_pages_blocks_key_moments_events_category",
  	"badge_color" varchar,
  	"category_label" varchar DEFAULT 'CATEGORÍA',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_variant" "enum_pages_blocks_key_moments_events_cta_variant" DEFAULT 'default',
  	"cta_open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_key_moments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"display_mode" "enum_pages_blocks_key_moments_display_mode" DEFAULT 'grid',
  	"cta_text_heading" varchar DEFAULT '¡Asegura la presencia de tu marca en los eventos más importantes del país!',
  	"cta_text_description" varchar DEFAULT 'Contáctanos ahora y diseñemos juntos tu participación.',
  	"cta_text_label" varchar DEFAULT 'Contáctenos',
  	"cta_text_href" varchar DEFAULT '#contacto',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_ad_formats_formats_modal_child_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"image_id" integer,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_ad_formats_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"brand" "enum_pages_blocks_ad_formats_formats_brand",
  	"category" "enum_pages_blocks_ad_formats_formats_category",
  	"image_id" integer,
  	"specs" jsonb,
  	"download_url" varchar,
  	"modal_title" varchar,
  	"modal_description" varchar,
  	"modal_cta_label" varchar DEFAULT 'Contáctanos',
  	"modal_cta_href" varchar DEFAULT '#contacto'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_ad_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"display_mode" "enum_pages_blocks_ad_formats_display_mode" DEFAULT 'grid',
  	"filters_enabled" boolean DEFAULT true,
  	"footer_cta_heading" varchar DEFAULT '¡Asegura la presencia de tu marca en los eventos más importantes del país!',
  	"footer_cta_description" varchar DEFAULT 'Contáctanos ahora y diseñemos juntos tu participación.',
  	"footer_cta_label" varchar DEFAULT 'Descargar Especificaciones',
  	"footer_cta_href" varchar DEFAULT '#contacto',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_branded_content_categories_secondary_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"multimedia_type" "bc_multimedia_type" DEFAULT 'youtube',
  	"multimedia_youtube_url" varchar,
  	"multimedia_image_id" integer,
  	"multimedia_video_id" integer,
  	"multimedia_caption_tag" varchar,
  	"multimedia_title_overlay" varchar,
  	"multimedia_logo_top_left_id" integer,
  	"multimedia_logo_top_right_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_branded_content_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"multimedia_type" "bc_multimedia_type" DEFAULT 'youtube',
  	"multimedia_youtube_url" varchar,
  	"multimedia_image_id" integer,
  	"multimedia_video_id" integer,
  	"multimedia_caption_tag" varchar,
  	"multimedia_title_overlay" varchar,
  	"multimedia_logo_top_left_id" integer,
  	"multimedia_logo_top_right_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_branded_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"default_index" numeric DEFAULT 0,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_our_channels_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"description" varchar,
  	"color" varchar,
  	"href" varchar,
  	"category" "enum_pages_blocks_our_channels_channels_category",
  	"audience_size" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_our_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum_pages_blocks_our_channels_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_sports_events_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"date_start" timestamp(3) with time zone,
  	"sport" varchar,
  	"league" varchar,
  	"image_id" integer,
  	"viewership_estimate" numeric,
  	"exclusivity" boolean DEFAULT false,
  	"cta_label" varchar,
  	"cta_href" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_sports_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"highlight_exclusive" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_contact_representatives" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"email" varchar,
  	"whatsapp" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"heading_emphasis" varchar,
  	"cta_button_label" varchar,
  	"cta_button_href" varchar,
  	"cta_button_variant" "enum_pages_blocks_contact_cta_button_variant" DEFAULT 'default',
  	"cta_button_open_in_new_tab" boolean DEFAULT false,
  	"form_id" integer,
  	"layout" "enum_pages_blocks_contact_layout" DEFAULT 'form-reps',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_ai_recommendation_allowed_brands" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_ai_recommendation_allowed_brands",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_ai_recommendation_examples" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"prompt" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_ai_recommendation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Quiero llegar a hombres 25-45 en Bogotá interesados en fútbol durante el Mundial…',
  	"submit_label" varchar DEFAULT 'Recomendar',
  	"model" "enum_pages_blocks_ai_recommendation_model" DEFAULT 'anthropic/claude-haiku-4-5',
  	"system_prompt" varchar DEFAULT 'Eres un asesor comercial del ecosistema Caracol Medios. Dada la descripción del objetivo de un anunciante, recomienda la marca y el formato óptimos, con justificación breve. Responde en español neutro y conciso.',
  	"disclaimer" varchar DEFAULT 'Las recomendaciones son sugerencias automatizadas. Para una propuesta a medida, contáctanos.',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"landing" "enum_pages_landing" DEFAULT 'caracol-next',
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero_key_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"value_prefix" varchar,
  	"value_suffix" varchar,
  	"label" varchar,
  	"hint" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero_brand_icons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand" "enum__pages_v_blocks_hero_brand_icons_brand",
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_bold" varchar,
  	"subheading" varchar,
  	"background_image_id" integer,
  	"background_video_id" integer,
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"primary_cta_variant" "enum__pages_v_blocks_hero_primary_cta_variant" DEFAULT 'default',
  	"primary_cta_open_in_new_tab" boolean DEFAULT false,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"secondary_cta_variant" "enum__pages_v_blocks_hero_secondary_cta_variant" DEFAULT 'default',
  	"secondary_cta_open_in_new_tab" boolean DEFAULT false,
  	"tone" "enum__pages_v_blocks_hero_tone" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_audience_networks_audience_breakdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"suffix" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_audience_networks_networks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"network" "enum__pages_v_blocks_audience_networks_networks_network",
  	"handle" varchar,
  	"followers" numeric,
  	"growth" numeric,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_audience_networks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"audience_reach" numeric,
  	"audience_reach_label" varchar DEFAULT 'Personas alcanzadas',
  	"audience_reach_suffix" varchar,
  	"highlighted_network" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_audience_profile_age_bars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"suffix" varchar DEFAULT 'min',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_audience_profile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"gender_split_female_percent" numeric DEFAULT 52,
  	"gender_split_female_label" varchar DEFAULT 'Mujeres',
  	"gender_split_male_label" varchar DEFAULT 'Hombres',
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_estratos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"suffix" varchar DEFAULT '%',
  	"hint" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_estratos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"footnote" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_content_type_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_content_type" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"default_index" numeric DEFAULT 0,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_audience_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"value_suffix" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_audience_age_picks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"range" varchar,
  	"value" numeric,
  	"is_peak" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_networks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"network" "enum__pages_v_blocks_brand_tabs_tabs_networks_network",
  	"handle" varchar,
  	"followers" numeric,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_ad_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image_id" integer,
  	"specs" jsonb,
  	"download_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand" "enum__pages_v_blocks_brand_tabs_tabs_brand",
  	"display_name" varchar,
  	"brand_logo_id" integer,
  	"brand_color" varchar,
  	"tagline" varchar,
  	"why_choose" jsonb,
  	"web_metrics_users_per_month" numeric,
  	"web_metrics_users_label" varchar DEFAULT 'Usuarios/mes',
  	"web_metrics_views_per_month" numeric,
  	"web_metrics_views_label" varchar DEFAULT 'Vistas/mes',
  	"audience_reach" numeric,
  	"audience_reach_label" varchar DEFAULT 'Personas alcanzadas',
  	"audience_reach_suffix" varchar,
  	"audience_gender_split_female_percent" numeric,
  	"audience_gender_split_female_label" varchar DEFAULT 'Mujeres',
  	"audience_gender_split_male_label" varchar DEFAULT 'Hombres',
  	"audience_peak_age_range" varchar,
  	"cta_contact_label" varchar,
  	"cta_contact_href" varchar,
  	"cta_contact_variant" "enum__pages_v_blocks_brand_tabs_tabs_cta_contact_variant" DEFAULT 'default',
  	"cta_contact_open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_brand_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"default_tab" numeric DEFAULT 0,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_key_moments_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"date_start" timestamp(3) with time zone,
  	"date_end" timestamp(3) with time zone,
  	"date_label_override" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"importance" "enum__pages_v_blocks_key_moments_events_importance" DEFAULT 'high',
  	"category" "enum__pages_v_blocks_key_moments_events_category",
  	"badge_color" varchar,
  	"category_label" varchar DEFAULT 'CATEGORÍA',
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_variant" "enum__pages_v_blocks_key_moments_events_cta_variant" DEFAULT 'default',
  	"cta_open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_key_moments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"display_mode" "enum__pages_v_blocks_key_moments_display_mode" DEFAULT 'grid',
  	"cta_text_heading" varchar DEFAULT '¡Asegura la presencia de tu marca en los eventos más importantes del país!',
  	"cta_text_description" varchar DEFAULT 'Contáctanos ahora y diseñemos juntos tu participación.',
  	"cta_text_label" varchar DEFAULT 'Contáctenos',
  	"cta_text_href" varchar DEFAULT '#contacto',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ad_formats_formats_modal_child_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"image_id" integer,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ad_formats_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"brand" "enum__pages_v_blocks_ad_formats_formats_brand",
  	"category" "enum__pages_v_blocks_ad_formats_formats_category",
  	"image_id" integer,
  	"specs" jsonb,
  	"download_url" varchar,
  	"modal_title" varchar,
  	"modal_description" varchar,
  	"modal_cta_label" varchar DEFAULT 'Contáctanos',
  	"modal_cta_href" varchar DEFAULT '#contacto',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ad_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"display_mode" "enum__pages_v_blocks_ad_formats_display_mode" DEFAULT 'grid',
  	"filters_enabled" boolean DEFAULT true,
  	"footer_cta_heading" varchar DEFAULT '¡Asegura la presencia de tu marca en los eventos más importantes del país!',
  	"footer_cta_description" varchar DEFAULT 'Contáctanos ahora y diseñemos juntos tu participación.',
  	"footer_cta_label" varchar DEFAULT 'Descargar Especificaciones',
  	"footer_cta_href" varchar DEFAULT '#contacto',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_branded_content_categories_secondary_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"multimedia_type" "bc_multimedia_type" DEFAULT 'youtube',
  	"multimedia_youtube_url" varchar,
  	"multimedia_image_id" integer,
  	"multimedia_video_id" integer,
  	"multimedia_caption_tag" varchar,
  	"multimedia_title_overlay" varchar,
  	"multimedia_logo_top_left_id" integer,
  	"multimedia_logo_top_right_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_branded_content_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"multimedia_type" "bc_multimedia_type" DEFAULT 'youtube',
  	"multimedia_youtube_url" varchar,
  	"multimedia_image_id" integer,
  	"multimedia_video_id" integer,
  	"multimedia_caption_tag" varchar,
  	"multimedia_title_overlay" varchar,
  	"multimedia_logo_top_left_id" integer,
  	"multimedia_logo_top_right_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_branded_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"default_index" numeric DEFAULT 0,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_our_channels_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"description" varchar,
  	"color" varchar,
  	"href" varchar,
  	"category" "enum__pages_v_blocks_our_channels_channels_category",
  	"audience_size" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_our_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum__pages_v_blocks_our_channels_layout" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_sports_events_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"date_start" timestamp(3) with time zone,
  	"sport" varchar,
  	"league" varchar,
  	"image_id" integer,
  	"viewership_estimate" numeric,
  	"exclusivity" boolean DEFAULT false,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_sports_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"highlight_exclusive" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_contact_representatives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"email" varchar,
  	"whatsapp" varchar,
  	"photo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"heading_emphasis" varchar,
  	"cta_button_label" varchar,
  	"cta_button_href" varchar,
  	"cta_button_variant" "enum__pages_v_blocks_contact_cta_button_variant" DEFAULT 'default',
  	"cta_button_open_in_new_tab" boolean DEFAULT false,
  	"form_id" integer,
  	"layout" "enum__pages_v_blocks_contact_layout" DEFAULT 'form-reps',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ai_recommendation_allowed_brands" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_ai_recommendation_allowed_brands",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ai_recommendation_examples" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"prompt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_ai_recommendation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Quiero llegar a hombres 25-45 en Bogotá interesados en fútbol durante el Mundial…',
  	"submit_label" varchar DEFAULT 'Recomendar',
  	"model" "enum__pages_v_blocks_ai_recommendation_model" DEFAULT 'anthropic/claude-haiku-4-5',
  	"system_prompt" varchar DEFAULT 'Eres un asesor comercial del ecosistema Caracol Medios. Dada la descripción del objetivo de un anunciante, recomienda la marca y el formato óptimos, con justificación breve. Responde en español neutro y conciso.',
  	"disclaimer" varchar DEFAULT 'Las recomendaciones son sugerencias automatizadas. Para una propuesta a medida, contáctanos.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_landing" "enum__pages_v_version_landing" DEFAULT 'caracol-next',
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar,
  	"sizes_desktop_url" varchar,
  	"sizes_desktop_width" numeric,
  	"sizes_desktop_height" numeric,
  	"sizes_desktop_mime_type" varchar,
  	"sizes_desktop_filesize" numeric,
  	"sizes_desktop_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"color" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"users_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "header_caracol_next_nav_anchors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"anchor_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "header_caracol_next" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"cta_button_enabled" boolean DEFAULT true,
  	"cta_button_label" varchar DEFAULT 'Quiero pautar',
  	"cta_button_href" varchar DEFAULT '#contacto',
  	"cta_button_variant" "enum_header_caracol_next_cta_button_variant" DEFAULT 'default',
  	"sticky" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "header_ditu_nav_anchors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"anchor_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "header_ditu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"cta_button_enabled" boolean DEFAULT true,
  	"cta_button_label" varchar DEFAULT 'Quiero pautar',
  	"cta_button_href" varchar DEFAULT '#contacto',
  	"cta_button_variant" "enum_header_ditu_cta_button_variant" DEFAULT 'default',
  	"sticky" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "footer_caracol_next_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "footer_caracol_next_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_caracol_next_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"network" "enum_footer_caracol_next_social_links_network" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_caracol_next" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"tagline" varchar,
  	"bottom_line" varchar DEFAULT '© Caracol Medios. Todos los derechos reservados.',
  	"use_wave" boolean DEFAULT false,
  	"tone" "enum_footer_caracol_next_tone" DEFAULT 'dark',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "footer_ditu_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "footer_ditu_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_ditu_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"network" "enum_footer_ditu_social_links_network" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_ditu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"tagline" varchar,
  	"bottom_line" varchar DEFAULT '© Caracol Medios. Todos los derechos reservados.',
  	"use_wave" boolean DEFAULT false,
  	"tone" "enum_footer_ditu_tone" DEFAULT 'dark',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "floating_contact_representatives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"email" varchar NOT NULL,
  	"whatsapp" varchar NOT NULL,
  	"photo_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "floating_contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"button_label" varchar DEFAULT 'Contáctanos',
  	"button_icon" "enum_floating_contact_button_icon" DEFAULT 'MessageCircle',
  	"panel_heading" varchar DEFAULT 'Habla con nuestro equipo',
  	"panel_description" varchar DEFAULT 'Escríbenos por correo o WhatsApp. Te respondemos en menos de 24 h.',
  	"position" "enum_floating_contact_position" DEFAULT 'bottom-right',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Caracol Next + Ditu',
  	"default_meta_title" varchar DEFAULT 'Caracol Next + Ditu — Mediakit',
  	"default_meta_description" varchar DEFAULT 'Mediakit oficial Caracol Next + Ditu. Audiencia, formatos de pauta y momentos clave del ecosistema Caracol.',
  	"default_og_image_id" integer,
  	"twitter_handle" varchar,
  	"fallback_email" varchar,
  	"fallback_whatsapp" varchar,
  	"primary_brand" "enum_site_settings_primary_brand" DEFAULT 'caracol-next',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_hero_key_stats" ADD CONSTRAINT "pages_blocks_hero_key_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_hero_brand_icons" ADD CONSTRAINT "pages_blocks_hero_brand_icons_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_hero_brand_icons" ADD CONSTRAINT "pages_blocks_hero_brand_icons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_audience_networks_audience_breakdown" ADD CONSTRAINT "pages_blocks_audience_networks_audience_breakdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_audience_networks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_audience_networks_networks" ADD CONSTRAINT "pages_blocks_audience_networks_networks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_audience_networks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_audience_networks" ADD CONSTRAINT "pages_blocks_audience_networks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_audience_profile_age_bars" ADD CONSTRAINT "pages_blocks_audience_profile_age_bars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_audience_profile"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_audience_profile" ADD CONSTRAINT "pages_blocks_audience_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_estratos_items" ADD CONSTRAINT "pages_blocks_estratos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_estratos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_estratos" ADD CONSTRAINT "pages_blocks_estratos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_content_type_types" ADD CONSTRAINT "pages_blocks_content_type_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_type"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_content_type" ADD CONSTRAINT "pages_blocks_content_type_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_brand_tabs_tabs_audience_highlights" ADD CONSTRAINT "pages_blocks_brand_tabs_tabs_audience_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_brand_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_brand_tabs_tabs_audience_age_picks" ADD CONSTRAINT "pages_blocks_brand_tabs_tabs_audience_age_picks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_brand_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_brand_tabs_tabs_networks" ADD CONSTRAINT "pages_blocks_brand_tabs_tabs_networks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_brand_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_brand_tabs_tabs_ad_formats" ADD CONSTRAINT "pages_blocks_brand_tabs_tabs_ad_formats_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_brand_tabs_tabs_ad_formats" ADD CONSTRAINT "pages_blocks_brand_tabs_tabs_ad_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_brand_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_brand_tabs_tabs" ADD CONSTRAINT "pages_blocks_brand_tabs_tabs_brand_logo_id_media_id_fk" FOREIGN KEY ("brand_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_brand_tabs_tabs" ADD CONSTRAINT "pages_blocks_brand_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_brand_tabs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_brand_tabs" ADD CONSTRAINT "pages_blocks_brand_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_key_moments_events" ADD CONSTRAINT "pages_blocks_key_moments_events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_key_moments_events" ADD CONSTRAINT "pages_blocks_key_moments_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_key_moments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_key_moments" ADD CONSTRAINT "pages_blocks_key_moments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_ad_formats_formats_modal_child_tabs" ADD CONSTRAINT "pages_blocks_ad_formats_formats_modal_child_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_ad_formats_formats_modal_child_tabs" ADD CONSTRAINT "pages_blocks_ad_formats_formats_modal_child_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ad_formats_formats"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_ad_formats_formats" ADD CONSTRAINT "pages_blocks_ad_formats_formats_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_ad_formats_formats" ADD CONSTRAINT "pages_blocks_ad_formats_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ad_formats"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_ad_formats" ADD CONSTRAINT "pages_blocks_ad_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_branded_content_categories_secondary_tabs" ADD CONSTRAINT "pages_blocks_branded_content_categories_secondary_tabs_multimedia_image_id_media_id_fk" FOREIGN KEY ("multimedia_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_branded_content_categories_secondary_tabs" ADD CONSTRAINT "pages_blocks_branded_content_categories_secondary_tabs_multimedia_video_id_media_id_fk" FOREIGN KEY ("multimedia_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_branded_content_categories_secondary_tabs" ADD CONSTRAINT "pages_blocks_branded_content_categories_secondary_tabs_multimedia_logo_top_left_id_media_id_fk" FOREIGN KEY ("multimedia_logo_top_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_branded_content_categories_secondary_tabs" ADD CONSTRAINT "pages_blocks_branded_content_categories_secondary_tabs_multimedia_logo_top_right_id_media_id_fk" FOREIGN KEY ("multimedia_logo_top_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_branded_content_categories_secondary_tabs" ADD CONSTRAINT "pages_blocks_branded_content_categories_secondary_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_branded_content_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_branded_content_categories" ADD CONSTRAINT "pages_blocks_branded_content_categories_multimedia_image_id_media_id_fk" FOREIGN KEY ("multimedia_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_branded_content_categories" ADD CONSTRAINT "pages_blocks_branded_content_categories_multimedia_video_id_media_id_fk" FOREIGN KEY ("multimedia_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_branded_content_categories" ADD CONSTRAINT "pages_blocks_branded_content_categories_multimedia_logo_top_left_id_media_id_fk" FOREIGN KEY ("multimedia_logo_top_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_branded_content_categories" ADD CONSTRAINT "pages_blocks_branded_content_categories_multimedia_logo_top_right_id_media_id_fk" FOREIGN KEY ("multimedia_logo_top_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_branded_content_categories" ADD CONSTRAINT "pages_blocks_branded_content_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_branded_content"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_branded_content" ADD CONSTRAINT "pages_blocks_branded_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_our_channels_channels" ADD CONSTRAINT "pages_blocks_our_channels_channels_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_our_channels_channels" ADD CONSTRAINT "pages_blocks_our_channels_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_our_channels"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_our_channels" ADD CONSTRAINT "pages_blocks_our_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_sports_events_events" ADD CONSTRAINT "pages_blocks_sports_events_events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_sports_events_events" ADD CONSTRAINT "pages_blocks_sports_events_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_sports_events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_sports_events" ADD CONSTRAINT "pages_blocks_sports_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_contact_representatives" ADD CONSTRAINT "pages_blocks_contact_representatives_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_contact_representatives" ADD CONSTRAINT "pages_blocks_contact_representatives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_ai_recommendation_allowed_brands" ADD CONSTRAINT "pages_blocks_ai_recommendation_allowed_brands_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_ai_recommendation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_ai_recommendation_examples" ADD CONSTRAINT "pages_blocks_ai_recommendation_examples_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ai_recommendation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_ai_recommendation" ADD CONSTRAINT "pages_blocks_ai_recommendation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_hero_key_stats" ADD CONSTRAINT "_pages_v_blocks_hero_key_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_hero_brand_icons" ADD CONSTRAINT "_pages_v_blocks_hero_brand_icons_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_hero_brand_icons" ADD CONSTRAINT "_pages_v_blocks_hero_brand_icons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_audience_networks_audience_breakdown" ADD CONSTRAINT "_pages_v_blocks_audience_networks_audience_breakdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_audience_networks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_audience_networks_networks" ADD CONSTRAINT "_pages_v_blocks_audience_networks_networks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_audience_networks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_audience_networks" ADD CONSTRAINT "_pages_v_blocks_audience_networks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_audience_profile_age_bars" ADD CONSTRAINT "_pages_v_blocks_audience_profile_age_bars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_audience_profile"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_audience_profile" ADD CONSTRAINT "_pages_v_blocks_audience_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_estratos_items" ADD CONSTRAINT "_pages_v_blocks_estratos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_estratos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_estratos" ADD CONSTRAINT "_pages_v_blocks_estratos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_content_type_types" ADD CONSTRAINT "_pages_v_blocks_content_type_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_type"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_content_type" ADD CONSTRAINT "_pages_v_blocks_content_type_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_brand_tabs_tabs_audience_highlights" ADD CONSTRAINT "_pages_v_blocks_brand_tabs_tabs_audience_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_brand_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_brand_tabs_tabs_audience_age_picks" ADD CONSTRAINT "_pages_v_blocks_brand_tabs_tabs_audience_age_picks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_brand_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_brand_tabs_tabs_networks" ADD CONSTRAINT "_pages_v_blocks_brand_tabs_tabs_networks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_brand_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_brand_tabs_tabs_ad_formats" ADD CONSTRAINT "_pages_v_blocks_brand_tabs_tabs_ad_formats_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_brand_tabs_tabs_ad_formats" ADD CONSTRAINT "_pages_v_blocks_brand_tabs_tabs_ad_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_brand_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_brand_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_brand_tabs_tabs_brand_logo_id_media_id_fk" FOREIGN KEY ("brand_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_brand_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_brand_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_brand_tabs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_brand_tabs" ADD CONSTRAINT "_pages_v_blocks_brand_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_key_moments_events" ADD CONSTRAINT "_pages_v_blocks_key_moments_events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_key_moments_events" ADD CONSTRAINT "_pages_v_blocks_key_moments_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_key_moments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_key_moments" ADD CONSTRAINT "_pages_v_blocks_key_moments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_ad_formats_formats_modal_child_tabs" ADD CONSTRAINT "_pages_v_blocks_ad_formats_formats_modal_child_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_ad_formats_formats_modal_child_tabs" ADD CONSTRAINT "_pages_v_blocks_ad_formats_formats_modal_child_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ad_formats_formats"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_ad_formats_formats" ADD CONSTRAINT "_pages_v_blocks_ad_formats_formats_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_ad_formats_formats" ADD CONSTRAINT "_pages_v_blocks_ad_formats_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ad_formats"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_ad_formats" ADD CONSTRAINT "_pages_v_blocks_ad_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_branded_content_categories_secondary_tabs" ADD CONSTRAINT "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_image_id_media_id_fk" FOREIGN KEY ("multimedia_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_branded_content_categories_secondary_tabs" ADD CONSTRAINT "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_video_id_media_id_fk" FOREIGN KEY ("multimedia_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_branded_content_categories_secondary_tabs" ADD CONSTRAINT "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_logo_top_left_id_media_id_fk" FOREIGN KEY ("multimedia_logo_top_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_branded_content_categories_secondary_tabs" ADD CONSTRAINT "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_logo_top_right_id_media_id_fk" FOREIGN KEY ("multimedia_logo_top_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_branded_content_categories_secondary_tabs" ADD CONSTRAINT "_pages_v_blocks_branded_content_categories_secondary_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_branded_content_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_branded_content_categories" ADD CONSTRAINT "_pages_v_blocks_branded_content_categories_multimedia_image_id_media_id_fk" FOREIGN KEY ("multimedia_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_branded_content_categories" ADD CONSTRAINT "_pages_v_blocks_branded_content_categories_multimedia_video_id_media_id_fk" FOREIGN KEY ("multimedia_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_branded_content_categories" ADD CONSTRAINT "_pages_v_blocks_branded_content_categories_multimedia_logo_top_left_id_media_id_fk" FOREIGN KEY ("multimedia_logo_top_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_branded_content_categories" ADD CONSTRAINT "_pages_v_blocks_branded_content_categories_multimedia_logo_top_right_id_media_id_fk" FOREIGN KEY ("multimedia_logo_top_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_branded_content_categories" ADD CONSTRAINT "_pages_v_blocks_branded_content_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_branded_content"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_branded_content" ADD CONSTRAINT "_pages_v_blocks_branded_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_our_channels_channels" ADD CONSTRAINT "_pages_v_blocks_our_channels_channels_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_our_channels_channels" ADD CONSTRAINT "_pages_v_blocks_our_channels_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_our_channels"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_our_channels" ADD CONSTRAINT "_pages_v_blocks_our_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_sports_events_events" ADD CONSTRAINT "_pages_v_blocks_sports_events_events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_sports_events_events" ADD CONSTRAINT "_pages_v_blocks_sports_events_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_sports_events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_sports_events" ADD CONSTRAINT "_pages_v_blocks_sports_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_contact_representatives" ADD CONSTRAINT "_pages_v_blocks_contact_representatives_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_contact_representatives" ADD CONSTRAINT "_pages_v_blocks_contact_representatives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_ai_recommendation_allowed_brands" ADD CONSTRAINT "_pages_v_blocks_ai_recommendation_allowed_brands_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_ai_recommendation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_ai_recommendation_examples" ADD CONSTRAINT "_pages_v_blocks_ai_recommendation_examples_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ai_recommendation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_ai_recommendation" ADD CONSTRAINT "_pages_v_blocks_ai_recommendation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_caracol_next_nav_anchors" ADD CONSTRAINT "header_caracol_next_nav_anchors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_caracol_next"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_caracol_next" ADD CONSTRAINT "header_caracol_next_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_caracol_next" ADD CONSTRAINT "header_caracol_next_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_ditu_nav_anchors" ADD CONSTRAINT "header_ditu_nav_anchors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_ditu"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_ditu" ADD CONSTRAINT "header_ditu_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_ditu" ADD CONSTRAINT "header_ditu_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_caracol_next_columns_links" ADD CONSTRAINT "footer_caracol_next_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_caracol_next_columns"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_caracol_next_columns" ADD CONSTRAINT "footer_caracol_next_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_caracol_next"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_caracol_next_social_links" ADD CONSTRAINT "footer_caracol_next_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_caracol_next"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_caracol_next" ADD CONSTRAINT "footer_caracol_next_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_ditu_columns_links" ADD CONSTRAINT "footer_ditu_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_ditu_columns"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_ditu_columns" ADD CONSTRAINT "footer_ditu_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_ditu"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_ditu_social_links" ADD CONSTRAINT "footer_ditu_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_ditu"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_ditu" ADD CONSTRAINT "footer_ditu_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "floating_contact_representatives" ADD CONSTRAINT "floating_contact_representatives_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "floating_contact_representatives" ADD CONSTRAINT "floating_contact_representatives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."floating_contact"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_key_stats_order_idx" ON "pages_blocks_hero_key_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_key_stats_parent_id_idx" ON "pages_blocks_hero_key_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_brand_icons_order_idx" ON "pages_blocks_hero_brand_icons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_brand_icons_parent_id_idx" ON "pages_blocks_hero_brand_icons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_brand_icons_icon_idx" ON "pages_blocks_hero_brand_icons" USING btree ("icon_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_background_image_idx" ON "pages_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_background_video_idx" ON "pages_blocks_hero" USING btree ("background_video_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_networks_audience_breakdown_order_idx" ON "pages_blocks_audience_networks_audience_breakdown" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_networks_audience_breakdown_parent_id_idx" ON "pages_blocks_audience_networks_audience_breakdown" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_networks_networks_order_idx" ON "pages_blocks_audience_networks_networks" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_networks_networks_parent_id_idx" ON "pages_blocks_audience_networks_networks" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_networks_order_idx" ON "pages_blocks_audience_networks" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_networks_parent_id_idx" ON "pages_blocks_audience_networks" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_networks_path_idx" ON "pages_blocks_audience_networks" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_profile_age_bars_order_idx" ON "pages_blocks_audience_profile_age_bars" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_profile_age_bars_parent_id_idx" ON "pages_blocks_audience_profile_age_bars" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_profile_order_idx" ON "pages_blocks_audience_profile" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_profile_parent_id_idx" ON "pages_blocks_audience_profile" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_audience_profile_path_idx" ON "pages_blocks_audience_profile" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_estratos_items_order_idx" ON "pages_blocks_estratos_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_estratos_items_parent_id_idx" ON "pages_blocks_estratos_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_estratos_order_idx" ON "pages_blocks_estratos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_estratos_parent_id_idx" ON "pages_blocks_estratos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_estratos_path_idx" ON "pages_blocks_estratos" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_type_types_order_idx" ON "pages_blocks_content_type_types" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_type_types_parent_id_idx" ON "pages_blocks_content_type_types" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_type_order_idx" ON "pages_blocks_content_type" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_type_parent_id_idx" ON "pages_blocks_content_type" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_type_path_idx" ON "pages_blocks_content_type" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_audience_highlights_order_idx" ON "pages_blocks_brand_tabs_tabs_audience_highlights" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_audience_highlights_parent_id_idx" ON "pages_blocks_brand_tabs_tabs_audience_highlights" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_audience_age_picks_order_idx" ON "pages_blocks_brand_tabs_tabs_audience_age_picks" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_audience_age_picks_parent_id_idx" ON "pages_blocks_brand_tabs_tabs_audience_age_picks" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_networks_order_idx" ON "pages_blocks_brand_tabs_tabs_networks" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_networks_parent_id_idx" ON "pages_blocks_brand_tabs_tabs_networks" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_ad_formats_order_idx" ON "pages_blocks_brand_tabs_tabs_ad_formats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_ad_formats_parent_id_idx" ON "pages_blocks_brand_tabs_tabs_ad_formats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_ad_formats_image_idx" ON "pages_blocks_brand_tabs_tabs_ad_formats" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_order_idx" ON "pages_blocks_brand_tabs_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_parent_id_idx" ON "pages_blocks_brand_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_tabs_brand_logo_idx" ON "pages_blocks_brand_tabs_tabs" USING btree ("brand_logo_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_order_idx" ON "pages_blocks_brand_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_parent_id_idx" ON "pages_blocks_brand_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_brand_tabs_path_idx" ON "pages_blocks_brand_tabs" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_key_moments_events_order_idx" ON "pages_blocks_key_moments_events" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_key_moments_events_parent_id_idx" ON "pages_blocks_key_moments_events" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_key_moments_events_image_idx" ON "pages_blocks_key_moments_events" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_key_moments_order_idx" ON "pages_blocks_key_moments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_key_moments_parent_id_idx" ON "pages_blocks_key_moments" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_key_moments_path_idx" ON "pages_blocks_key_moments" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ad_formats_formats_modal_child_tabs_order_idx" ON "pages_blocks_ad_formats_formats_modal_child_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ad_formats_formats_modal_child_tabs_parent_id_idx" ON "pages_blocks_ad_formats_formats_modal_child_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ad_formats_formats_modal_child_tabs_image_idx" ON "pages_blocks_ad_formats_formats_modal_child_tabs" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ad_formats_formats_order_idx" ON "pages_blocks_ad_formats_formats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ad_formats_formats_parent_id_idx" ON "pages_blocks_ad_formats_formats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ad_formats_formats_image_idx" ON "pages_blocks_ad_formats_formats" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ad_formats_order_idx" ON "pages_blocks_ad_formats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ad_formats_parent_id_idx" ON "pages_blocks_ad_formats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ad_formats_path_idx" ON "pages_blocks_ad_formats" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_secondary_tabs_order_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_secondary_tabs_parent_id_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_image_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_video_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_video_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_left_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_right_idx" ON "pages_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_right_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_order_idx" ON "pages_blocks_branded_content_categories" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_parent_id_idx" ON "pages_blocks_branded_content_categories" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_multimedia_multimedia_image_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_multimedia_multimedia_video_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_video_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_multimedia_multimedia_logo_top_left_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_categories_multimedia_multimedia_logo_top_right_idx" ON "pages_blocks_branded_content_categories" USING btree ("multimedia_logo_top_right_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_order_idx" ON "pages_blocks_branded_content" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_parent_id_idx" ON "pages_blocks_branded_content" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_branded_content_path_idx" ON "pages_blocks_branded_content" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_our_channels_channels_order_idx" ON "pages_blocks_our_channels_channels" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_our_channels_channels_parent_id_idx" ON "pages_blocks_our_channels_channels" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_our_channels_channels_logo_idx" ON "pages_blocks_our_channels_channels" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_our_channels_order_idx" ON "pages_blocks_our_channels" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_our_channels_parent_id_idx" ON "pages_blocks_our_channels" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_our_channels_path_idx" ON "pages_blocks_our_channels" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_sports_events_events_order_idx" ON "pages_blocks_sports_events_events" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_sports_events_events_parent_id_idx" ON "pages_blocks_sports_events_events" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_sports_events_events_image_idx" ON "pages_blocks_sports_events_events" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_sports_events_order_idx" ON "pages_blocks_sports_events" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_sports_events_parent_id_idx" ON "pages_blocks_sports_events" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_sports_events_path_idx" ON "pages_blocks_sports_events" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_representatives_order_idx" ON "pages_blocks_contact_representatives" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_representatives_parent_id_idx" ON "pages_blocks_contact_representatives" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_representatives_photo_idx" ON "pages_blocks_contact_representatives" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_order_idx" ON "pages_blocks_contact" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_parent_id_idx" ON "pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_path_idx" ON "pages_blocks_contact" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_contact_form_idx" ON "pages_blocks_contact" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ai_recommendation_allowed_brands_order_idx" ON "pages_blocks_ai_recommendation_allowed_brands" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ai_recommendation_allowed_brands_parent_idx" ON "pages_blocks_ai_recommendation_allowed_brands" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ai_recommendation_examples_order_idx" ON "pages_blocks_ai_recommendation_examples" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ai_recommendation_examples_parent_id_idx" ON "pages_blocks_ai_recommendation_examples" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ai_recommendation_order_idx" ON "pages_blocks_ai_recommendation" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ai_recommendation_parent_id_idx" ON "pages_blocks_ai_recommendation" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_ai_recommendation_path_idx" ON "pages_blocks_ai_recommendation" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_breadcrumbs_doc_idx" ON "pages_breadcrumbs" USING btree ("doc_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_key_stats_order_idx" ON "_pages_v_blocks_hero_key_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_key_stats_parent_id_idx" ON "_pages_v_blocks_hero_key_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_brand_icons_order_idx" ON "_pages_v_blocks_hero_brand_icons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_brand_icons_parent_id_idx" ON "_pages_v_blocks_hero_brand_icons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_brand_icons_icon_idx" ON "_pages_v_blocks_hero_brand_icons" USING btree ("icon_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_background_image_idx" ON "_pages_v_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_background_video_idx" ON "_pages_v_blocks_hero" USING btree ("background_video_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_networks_audience_breakdown_order_idx" ON "_pages_v_blocks_audience_networks_audience_breakdown" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_networks_audience_breakdown_parent_id_idx" ON "_pages_v_blocks_audience_networks_audience_breakdown" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_networks_networks_order_idx" ON "_pages_v_blocks_audience_networks_networks" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_networks_networks_parent_id_idx" ON "_pages_v_blocks_audience_networks_networks" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_networks_order_idx" ON "_pages_v_blocks_audience_networks" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_networks_parent_id_idx" ON "_pages_v_blocks_audience_networks" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_networks_path_idx" ON "_pages_v_blocks_audience_networks" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_profile_age_bars_order_idx" ON "_pages_v_blocks_audience_profile_age_bars" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_profile_age_bars_parent_id_idx" ON "_pages_v_blocks_audience_profile_age_bars" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_profile_order_idx" ON "_pages_v_blocks_audience_profile" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_profile_parent_id_idx" ON "_pages_v_blocks_audience_profile" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_audience_profile_path_idx" ON "_pages_v_blocks_audience_profile" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_estratos_items_order_idx" ON "_pages_v_blocks_estratos_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_estratos_items_parent_id_idx" ON "_pages_v_blocks_estratos_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_estratos_order_idx" ON "_pages_v_blocks_estratos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_estratos_parent_id_idx" ON "_pages_v_blocks_estratos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_estratos_path_idx" ON "_pages_v_blocks_estratos" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_type_types_order_idx" ON "_pages_v_blocks_content_type_types" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_type_types_parent_id_idx" ON "_pages_v_blocks_content_type_types" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_type_order_idx" ON "_pages_v_blocks_content_type" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_type_parent_id_idx" ON "_pages_v_blocks_content_type" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_type_path_idx" ON "_pages_v_blocks_content_type" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_audience_highlights_order_idx" ON "_pages_v_blocks_brand_tabs_tabs_audience_highlights" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_audience_highlights_parent_id_idx" ON "_pages_v_blocks_brand_tabs_tabs_audience_highlights" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_audience_age_picks_order_idx" ON "_pages_v_blocks_brand_tabs_tabs_audience_age_picks" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_audience_age_picks_parent_id_idx" ON "_pages_v_blocks_brand_tabs_tabs_audience_age_picks" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_networks_order_idx" ON "_pages_v_blocks_brand_tabs_tabs_networks" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_networks_parent_id_idx" ON "_pages_v_blocks_brand_tabs_tabs_networks" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_ad_formats_order_idx" ON "_pages_v_blocks_brand_tabs_tabs_ad_formats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_ad_formats_parent_id_idx" ON "_pages_v_blocks_brand_tabs_tabs_ad_formats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_ad_formats_image_idx" ON "_pages_v_blocks_brand_tabs_tabs_ad_formats" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_order_idx" ON "_pages_v_blocks_brand_tabs_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_parent_id_idx" ON "_pages_v_blocks_brand_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_tabs_brand_logo_idx" ON "_pages_v_blocks_brand_tabs_tabs" USING btree ("brand_logo_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_order_idx" ON "_pages_v_blocks_brand_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_parent_id_idx" ON "_pages_v_blocks_brand_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_brand_tabs_path_idx" ON "_pages_v_blocks_brand_tabs" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_key_moments_events_order_idx" ON "_pages_v_blocks_key_moments_events" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_key_moments_events_parent_id_idx" ON "_pages_v_blocks_key_moments_events" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_key_moments_events_image_idx" ON "_pages_v_blocks_key_moments_events" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_key_moments_order_idx" ON "_pages_v_blocks_key_moments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_key_moments_parent_id_idx" ON "_pages_v_blocks_key_moments" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_key_moments_path_idx" ON "_pages_v_blocks_key_moments" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ad_formats_formats_modal_child_tabs_order_idx" ON "_pages_v_blocks_ad_formats_formats_modal_child_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ad_formats_formats_modal_child_tabs_parent_id_idx" ON "_pages_v_blocks_ad_formats_formats_modal_child_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ad_formats_formats_modal_child_tabs_image_idx" ON "_pages_v_blocks_ad_formats_formats_modal_child_tabs" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ad_formats_formats_order_idx" ON "_pages_v_blocks_ad_formats_formats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ad_formats_formats_parent_id_idx" ON "_pages_v_blocks_ad_formats_formats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ad_formats_formats_image_idx" ON "_pages_v_blocks_ad_formats_formats" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ad_formats_order_idx" ON "_pages_v_blocks_ad_formats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ad_formats_parent_id_idx" ON "_pages_v_blocks_ad_formats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ad_formats_path_idx" ON "_pages_v_blocks_ad_formats" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_secondary_tabs_order_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_secondary_tabs_parent_id_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_image_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_video_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_video_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_left_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_secondary_tabs_multimedia_multimedia_logo_top_right_idx" ON "_pages_v_blocks_branded_content_categories_secondary_tabs" USING btree ("multimedia_logo_top_right_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_order_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_parent_id_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_multimedia_multimedia_image_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_multimedia_multimedia_video_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_video_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_multimedia_multimedia_logo_top_left_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_logo_top_left_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_categories_multimedia_multimedia_logo_top_right_idx" ON "_pages_v_blocks_branded_content_categories" USING btree ("multimedia_logo_top_right_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_order_idx" ON "_pages_v_blocks_branded_content" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_parent_id_idx" ON "_pages_v_blocks_branded_content" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_branded_content_path_idx" ON "_pages_v_blocks_branded_content" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_our_channels_channels_order_idx" ON "_pages_v_blocks_our_channels_channels" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_our_channels_channels_parent_id_idx" ON "_pages_v_blocks_our_channels_channels" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_our_channels_channels_logo_idx" ON "_pages_v_blocks_our_channels_channels" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_our_channels_order_idx" ON "_pages_v_blocks_our_channels" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_our_channels_parent_id_idx" ON "_pages_v_blocks_our_channels" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_our_channels_path_idx" ON "_pages_v_blocks_our_channels" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sports_events_events_order_idx" ON "_pages_v_blocks_sports_events_events" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sports_events_events_parent_id_idx" ON "_pages_v_blocks_sports_events_events" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sports_events_events_image_idx" ON "_pages_v_blocks_sports_events_events" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sports_events_order_idx" ON "_pages_v_blocks_sports_events" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sports_events_parent_id_idx" ON "_pages_v_blocks_sports_events" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sports_events_path_idx" ON "_pages_v_blocks_sports_events" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_representatives_order_idx" ON "_pages_v_blocks_contact_representatives" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_representatives_parent_id_idx" ON "_pages_v_blocks_contact_representatives" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_representatives_photo_idx" ON "_pages_v_blocks_contact_representatives" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_order_idx" ON "_pages_v_blocks_contact" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_parent_id_idx" ON "_pages_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_path_idx" ON "_pages_v_blocks_contact" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_contact_form_idx" ON "_pages_v_blocks_contact" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ai_recommendation_allowed_brands_order_idx" ON "_pages_v_blocks_ai_recommendation_allowed_brands" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ai_recommendation_allowed_brands_parent_idx" ON "_pages_v_blocks_ai_recommendation_allowed_brands" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ai_recommendation_examples_order_idx" ON "_pages_v_blocks_ai_recommendation_examples" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ai_recommendation_examples_parent_id_idx" ON "_pages_v_blocks_ai_recommendation_examples" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ai_recommendation_order_idx" ON "_pages_v_blocks_ai_recommendation" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ai_recommendation_parent_id_idx" ON "_pages_v_blocks_ai_recommendation" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_ai_recommendation_path_idx" ON "_pages_v_blocks_ai_recommendation" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_breadcrumbs_doc_idx" ON "_pages_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_desktop_sizes_desktop_filename_idx" ON "media" USING btree ("sizes_desktop_filename");
  CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "header_caracol_next_nav_anchors_order_idx" ON "header_caracol_next_nav_anchors" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_caracol_next_nav_anchors_parent_id_idx" ON "header_caracol_next_nav_anchors" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_caracol_next_logo_idx" ON "header_caracol_next" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "header_caracol_next_logo_dark_idx" ON "header_caracol_next" USING btree ("logo_dark_id");
  CREATE INDEX IF NOT EXISTS "header_ditu_nav_anchors_order_idx" ON "header_ditu_nav_anchors" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_ditu_nav_anchors_parent_id_idx" ON "header_ditu_nav_anchors" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_ditu_logo_idx" ON "header_ditu" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "header_ditu_logo_dark_idx" ON "header_ditu" USING btree ("logo_dark_id");
  CREATE INDEX IF NOT EXISTS "footer_caracol_next_columns_links_order_idx" ON "footer_caracol_next_columns_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_caracol_next_columns_links_parent_id_idx" ON "footer_caracol_next_columns_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_caracol_next_columns_order_idx" ON "footer_caracol_next_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_caracol_next_columns_parent_id_idx" ON "footer_caracol_next_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_caracol_next_social_links_order_idx" ON "footer_caracol_next_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_caracol_next_social_links_parent_id_idx" ON "footer_caracol_next_social_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_caracol_next_logo_idx" ON "footer_caracol_next" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "footer_ditu_columns_links_order_idx" ON "footer_ditu_columns_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_ditu_columns_links_parent_id_idx" ON "footer_ditu_columns_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_ditu_columns_order_idx" ON "footer_ditu_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_ditu_columns_parent_id_idx" ON "footer_ditu_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_ditu_social_links_order_idx" ON "footer_ditu_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_ditu_social_links_parent_id_idx" ON "footer_ditu_social_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_ditu_logo_idx" ON "footer_ditu" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "floating_contact_representatives_order_idx" ON "floating_contact_representatives" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "floating_contact_representatives_parent_id_idx" ON "floating_contact_representatives" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "floating_contact_representatives_photo_idx" ON "floating_contact_representatives" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_key_stats" CASCADE;
  DROP TABLE "pages_blocks_hero_brand_icons" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_audience_networks_audience_breakdown" CASCADE;
  DROP TABLE "pages_blocks_audience_networks_networks" CASCADE;
  DROP TABLE "pages_blocks_audience_networks" CASCADE;
  DROP TABLE "pages_blocks_audience_profile_age_bars" CASCADE;
  DROP TABLE "pages_blocks_audience_profile" CASCADE;
  DROP TABLE "pages_blocks_estratos_items" CASCADE;
  DROP TABLE "pages_blocks_estratos" CASCADE;
  DROP TABLE "pages_blocks_content_type_types" CASCADE;
  DROP TABLE "pages_blocks_content_type" CASCADE;
  DROP TABLE "pages_blocks_brand_tabs_tabs_audience_highlights" CASCADE;
  DROP TABLE "pages_blocks_brand_tabs_tabs_audience_age_picks" CASCADE;
  DROP TABLE "pages_blocks_brand_tabs_tabs_networks" CASCADE;
  DROP TABLE "pages_blocks_brand_tabs_tabs_ad_formats" CASCADE;
  DROP TABLE "pages_blocks_brand_tabs_tabs" CASCADE;
  DROP TABLE "pages_blocks_brand_tabs" CASCADE;
  DROP TABLE "pages_blocks_key_moments_events" CASCADE;
  DROP TABLE "pages_blocks_key_moments" CASCADE;
  DROP TABLE "pages_blocks_ad_formats_formats_modal_child_tabs" CASCADE;
  DROP TABLE "pages_blocks_ad_formats_formats" CASCADE;
  DROP TABLE "pages_blocks_ad_formats" CASCADE;
  DROP TABLE "pages_blocks_branded_content_categories_secondary_tabs" CASCADE;
  DROP TABLE "pages_blocks_branded_content_categories" CASCADE;
  DROP TABLE "pages_blocks_branded_content" CASCADE;
  DROP TABLE "pages_blocks_our_channels_channels" CASCADE;
  DROP TABLE "pages_blocks_our_channels" CASCADE;
  DROP TABLE "pages_blocks_sports_events_events" CASCADE;
  DROP TABLE "pages_blocks_sports_events" CASCADE;
  DROP TABLE "pages_blocks_contact_representatives" CASCADE;
  DROP TABLE "pages_blocks_contact" CASCADE;
  DROP TABLE "pages_blocks_ai_recommendation_allowed_brands" CASCADE;
  DROP TABLE "pages_blocks_ai_recommendation_examples" CASCADE;
  DROP TABLE "pages_blocks_ai_recommendation" CASCADE;
  DROP TABLE "pages_breadcrumbs" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_key_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_brand_icons" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_audience_networks_audience_breakdown" CASCADE;
  DROP TABLE "_pages_v_blocks_audience_networks_networks" CASCADE;
  DROP TABLE "_pages_v_blocks_audience_networks" CASCADE;
  DROP TABLE "_pages_v_blocks_audience_profile_age_bars" CASCADE;
  DROP TABLE "_pages_v_blocks_audience_profile" CASCADE;
  DROP TABLE "_pages_v_blocks_estratos_items" CASCADE;
  DROP TABLE "_pages_v_blocks_estratos" CASCADE;
  DROP TABLE "_pages_v_blocks_content_type_types" CASCADE;
  DROP TABLE "_pages_v_blocks_content_type" CASCADE;
  DROP TABLE "_pages_v_blocks_brand_tabs_tabs_audience_highlights" CASCADE;
  DROP TABLE "_pages_v_blocks_brand_tabs_tabs_audience_age_picks" CASCADE;
  DROP TABLE "_pages_v_blocks_brand_tabs_tabs_networks" CASCADE;
  DROP TABLE "_pages_v_blocks_brand_tabs_tabs_ad_formats" CASCADE;
  DROP TABLE "_pages_v_blocks_brand_tabs_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_brand_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_key_moments_events" CASCADE;
  DROP TABLE "_pages_v_blocks_key_moments" CASCADE;
  DROP TABLE "_pages_v_blocks_ad_formats_formats_modal_child_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_ad_formats_formats" CASCADE;
  DROP TABLE "_pages_v_blocks_ad_formats" CASCADE;
  DROP TABLE "_pages_v_blocks_branded_content_categories_secondary_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_branded_content_categories" CASCADE;
  DROP TABLE "_pages_v_blocks_branded_content" CASCADE;
  DROP TABLE "_pages_v_blocks_our_channels_channels" CASCADE;
  DROP TABLE "_pages_v_blocks_our_channels" CASCADE;
  DROP TABLE "_pages_v_blocks_sports_events_events" CASCADE;
  DROP TABLE "_pages_v_blocks_sports_events" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_representatives" CASCADE;
  DROP TABLE "_pages_v_blocks_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_ai_recommendation_allowed_brands" CASCADE;
  DROP TABLE "_pages_v_blocks_ai_recommendation_examples" CASCADE;
  DROP TABLE "_pages_v_blocks_ai_recommendation" CASCADE;
  DROP TABLE "_pages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_caracol_next_nav_anchors" CASCADE;
  DROP TABLE "header_caracol_next" CASCADE;
  DROP TABLE "header_ditu_nav_anchors" CASCADE;
  DROP TABLE "header_ditu" CASCADE;
  DROP TABLE "footer_caracol_next_columns_links" CASCADE;
  DROP TABLE "footer_caracol_next_columns" CASCADE;
  DROP TABLE "footer_caracol_next_social_links" CASCADE;
  DROP TABLE "footer_caracol_next" CASCADE;
  DROP TABLE "footer_ditu_columns_links" CASCADE;
  DROP TABLE "footer_ditu_columns" CASCADE;
  DROP TABLE "footer_ditu_social_links" CASCADE;
  DROP TABLE "footer_ditu" CASCADE;
  DROP TABLE "floating_contact_representatives" CASCADE;
  DROP TABLE "floating_contact" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_hero_brand_icons_brand";
  DROP TYPE "public"."enum_pages_blocks_hero_primary_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_secondary_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_tone";
  DROP TYPE "public"."enum_pages_blocks_audience_networks_networks_network";
  DROP TYPE "public"."enum_pages_blocks_brand_tabs_tabs_networks_network";
  DROP TYPE "public"."enum_pages_blocks_brand_tabs_tabs_brand";
  DROP TYPE "public"."enum_pages_blocks_brand_tabs_tabs_cta_contact_variant";
  DROP TYPE "public"."enum_pages_blocks_key_moments_events_importance";
  DROP TYPE "public"."enum_pages_blocks_key_moments_events_category";
  DROP TYPE "public"."enum_pages_blocks_key_moments_events_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_key_moments_display_mode";
  DROP TYPE "public"."enum_pages_blocks_ad_formats_formats_brand";
  DROP TYPE "public"."enum_pages_blocks_ad_formats_formats_category";
  DROP TYPE "public"."enum_pages_blocks_ad_formats_display_mode";
  DROP TYPE "public"."bc_multimedia_type";
  DROP TYPE "public"."enum_pages_blocks_our_channels_channels_category";
  DROP TYPE "public"."enum_pages_blocks_our_channels_layout";
  DROP TYPE "public"."enum_pages_blocks_contact_cta_button_variant";
  DROP TYPE "public"."enum_pages_blocks_contact_layout";
  DROP TYPE "public"."enum_pages_blocks_ai_recommendation_allowed_brands";
  DROP TYPE "public"."enum_pages_blocks_ai_recommendation_model";
  DROP TYPE "public"."enum_pages_landing";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_brand_icons_brand";
  DROP TYPE "public"."enum__pages_v_blocks_hero_primary_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_secondary_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_tone";
  DROP TYPE "public"."enum__pages_v_blocks_audience_networks_networks_network";
  DROP TYPE "public"."enum__pages_v_blocks_brand_tabs_tabs_networks_network";
  DROP TYPE "public"."enum__pages_v_blocks_brand_tabs_tabs_brand";
  DROP TYPE "public"."enum__pages_v_blocks_brand_tabs_tabs_cta_contact_variant";
  DROP TYPE "public"."enum__pages_v_blocks_key_moments_events_importance";
  DROP TYPE "public"."enum__pages_v_blocks_key_moments_events_category";
  DROP TYPE "public"."enum__pages_v_blocks_key_moments_events_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_key_moments_display_mode";
  DROP TYPE "public"."enum__pages_v_blocks_ad_formats_formats_brand";
  DROP TYPE "public"."enum__pages_v_blocks_ad_formats_formats_category";
  DROP TYPE "public"."enum__pages_v_blocks_ad_formats_display_mode";
  DROP TYPE "public"."enum__pages_v_blocks_our_channels_channels_category";
  DROP TYPE "public"."enum__pages_v_blocks_our_channels_layout";
  DROP TYPE "public"."enum__pages_v_blocks_contact_cta_button_variant";
  DROP TYPE "public"."enum__pages_v_blocks_contact_layout";
  DROP TYPE "public"."enum__pages_v_blocks_ai_recommendation_allowed_brands";
  DROP TYPE "public"."enum__pages_v_blocks_ai_recommendation_model";
  DROP TYPE "public"."enum__pages_v_version_landing";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_header_caracol_next_cta_button_variant";
  DROP TYPE "public"."enum_header_ditu_cta_button_variant";
  DROP TYPE "public"."enum_footer_caracol_next_social_links_network";
  DROP TYPE "public"."enum_footer_caracol_next_tone";
  DROP TYPE "public"."enum_footer_ditu_social_links_network";
  DROP TYPE "public"."enum_footer_ditu_tone";
  DROP TYPE "public"."enum_floating_contact_button_icon";
  DROP TYPE "public"."enum_floating_contact_position";
  DROP TYPE "public"."enum_site_settings_primary_brand";`);
}
