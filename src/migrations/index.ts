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
];
