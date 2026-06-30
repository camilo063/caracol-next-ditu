import * as migration_20260601_000530 from "./20260601_000530";
import * as migration_20260609_120000 from "./20260609_120000";
import * as migration_20260610_000000 from "./20260610_000000";
import * as migration_20260610_120000 from "./20260610_120000";
import * as migration_20260610_130000 from "./20260610_130000";
import * as migration_20260610_140000 from "./20260610_140000";
import * as migration_20260610_214703 from "./20260610_214703";
import * as migration_20260611_fix_missing_parent_fks from "./20260611_fix_missing_parent_fks";
import * as migration_20260611_120000 from "./20260611_120000";
import * as migration_20260611_ditu_hero_cms_fields from "./20260611_ditu_hero_cms_fields";
import * as migration_20260612_audience_networks_cms_fields from "./20260612_audience_networks_cms_fields";
import * as migration_20260612_brands_collection from "./20260612_brands_collection";
import * as migration_20260619_ditu_audiencia_cms_fields from "./20260619_ditu_audiencia_cms_fields";
import * as migration_20260619_ditu_adn_cms_fields from "./20260619_ditu_adn_cms_fields";
import * as migration_20260619_ditu_calendario_cms_fields from "./20260619_ditu_calendario_cms_fields";
import * as migration_20260622_ditu_calendario_badge_color from "./20260622_ditu_calendario_badge_color";
import * as migration_20260622_ditu_pauta_cms_fields from "./20260622_ditu_pauta_cms_fields";
import * as migration_20260622_ditu_video_youtube_url from "./20260622_ditu_video_youtube_url";
import * as migration_20260622_floating_contact_per_landing from "./20260622_floating_contact_per_landing";
import * as migration_20260622_brand_tabs_data_source from "./20260622_brand_tabs_data_source";
import * as migration_20260623_key_moments_hide_past from "./20260623_key_moments_hide_past";
import * as migration_20260623_ad_formats_footer_cta_file from "./20260623_ad_formats_footer_cta_file";
import * as migration_20260623_ad_formats_footer_cta_newtab from "./20260623_ad_formats_footer_cta_newtab";
import * as migration_20260623_ditu_video_source from "./20260623_ditu_video_source";
import * as migration_20260623_branded_content_external_video from "./20260623_branded_content_external_video";
import * as migration_20260623_format_preview_video from "./20260623_format_preview_video";
import * as migration_20260623_cta_open_in_new_tab from "./20260623_cta_open_in_new_tab";
import * as migration_20260623_brand_tabs_panel_image from "./20260623_brand_tabs_panel_image";
import * as migration_20260623_brand_pie_colors from "./20260623_brand_pie_colors";
import * as migration_20260624_ditu_pauta_cta_file from "./20260624_ditu_pauta_cta_file";
import * as migration_20260630_site_settings_analytics from "./20260630_site_settings_analytics";

export const migrations = [
  {
    up: migration_20260601_000530.up,
    down: migration_20260601_000530.down,
    name: "20260601_000530",
  },
  {
    up: migration_20260609_120000.up,
    down: migration_20260609_120000.down,
    name: "20260609_120000",
  },
  {
    up: migration_20260610_000000.up,
    down: migration_20260610_000000.down,
    name: "20260610_000000",
  },
  {
    up: migration_20260610_120000.up,
    down: migration_20260610_120000.down,
    name: "20260610_120000",
  },
  {
    up: migration_20260610_130000.up,
    down: migration_20260610_130000.down,
    name: "20260610_130000",
  },
  {
    up: migration_20260610_140000.up,
    down: migration_20260610_140000.down,
    name: "20260610_140000",
  },
  {
    up: migration_20260610_214703.up,
    down: migration_20260610_214703.down,
    name: "20260610_214703",
  },
  {
    up: migration_20260611_fix_missing_parent_fks.up,
    down: migration_20260611_fix_missing_parent_fks.down,
    name: "20260611_fix_missing_parent_fks",
  },
  {
    up: migration_20260611_120000.up,
    down: migration_20260611_120000.down,
    name: "20260611_120000",
  },
  {
    up: migration_20260611_ditu_hero_cms_fields.up,
    down: migration_20260611_ditu_hero_cms_fields.down,
    name: "20260611_ditu_hero_cms_fields",
  },
  {
    up: migration_20260612_audience_networks_cms_fields.up,
    down: migration_20260612_audience_networks_cms_fields.down,
    name: "20260612_audience_networks_cms_fields",
  },
  {
    up: migration_20260612_brands_collection.up,
    down: migration_20260612_brands_collection.down,
    name: "20260612_brands_collection",
  },
  {
    up: migration_20260619_ditu_audiencia_cms_fields.up,
    down: migration_20260619_ditu_audiencia_cms_fields.down,
    name: "20260619_ditu_audiencia_cms_fields",
  },
  {
    up: migration_20260619_ditu_adn_cms_fields.up,
    down: migration_20260619_ditu_adn_cms_fields.down,
    name: "20260619_ditu_adn_cms_fields",
  },
  {
    up: migration_20260619_ditu_calendario_cms_fields.up,
    down: migration_20260619_ditu_calendario_cms_fields.down,
    name: "20260619_ditu_calendario_cms_fields",
  },
  {
    up: migration_20260622_ditu_calendario_badge_color.up,
    down: migration_20260622_ditu_calendario_badge_color.down,
    name: "20260622_ditu_calendario_badge_color",
  },
  {
    up: migration_20260622_ditu_pauta_cms_fields.up,
    down: migration_20260622_ditu_pauta_cms_fields.down,
    name: "20260622_ditu_pauta_cms_fields",
  },
  {
    up: migration_20260622_ditu_video_youtube_url.up,
    down: migration_20260622_ditu_video_youtube_url.down,
    name: "20260622_ditu_video_youtube_url",
  },
  {
    up: migration_20260622_floating_contact_per_landing.up,
    down: migration_20260622_floating_contact_per_landing.down,
    name: "20260622_floating_contact_per_landing",
  },
  {
    up: migration_20260622_brand_tabs_data_source.up,
    down: migration_20260622_brand_tabs_data_source.down,
    name: "20260622_brand_tabs_data_source",
  },
  {
    up: migration_20260623_key_moments_hide_past.up,
    down: migration_20260623_key_moments_hide_past.down,
    name: "20260623_key_moments_hide_past",
  },
  {
    up: migration_20260623_ad_formats_footer_cta_file.up,
    down: migration_20260623_ad_formats_footer_cta_file.down,
    name: "20260623_ad_formats_footer_cta_file",
  },
  {
    up: migration_20260623_ad_formats_footer_cta_newtab.up,
    down: migration_20260623_ad_formats_footer_cta_newtab.down,
    name: "20260623_ad_formats_footer_cta_newtab",
  },
  {
    up: migration_20260623_ditu_video_source.up,
    down: migration_20260623_ditu_video_source.down,
    name: "20260623_ditu_video_source",
  },
  {
    up: migration_20260623_branded_content_external_video.up,
    down: migration_20260623_branded_content_external_video.down,
    name: "20260623_branded_content_external_video",
  },
  {
    up: migration_20260623_format_preview_video.up,
    down: migration_20260623_format_preview_video.down,
    name: "20260623_format_preview_video",
  },
  {
    up: migration_20260623_cta_open_in_new_tab.up,
    down: migration_20260623_cta_open_in_new_tab.down,
    name: "20260623_cta_open_in_new_tab",
  },
  {
    up: migration_20260623_brand_tabs_panel_image.up,
    down: migration_20260623_brand_tabs_panel_image.down,
    name: "20260623_brand_tabs_panel_image",
  },
  {
    up: migration_20260623_brand_pie_colors.up,
    down: migration_20260623_brand_pie_colors.down,
    name: "20260623_brand_pie_colors",
  },
  {
    up: migration_20260624_ditu_pauta_cta_file.up,
    down: migration_20260624_ditu_pauta_cta_file.down,
    name: "20260624_ditu_pauta_cta_file",
  },
  {
    up: migration_20260630_site_settings_analytics.up,
    down: migration_20260630_site_settings_analytics.down,
    name: "20260630_site_settings_analytics",
  },
];
