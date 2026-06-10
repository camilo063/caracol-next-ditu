import * as migration_20260601_000530 from "./20260601_000530";
import * as migration_20260609_120000 from "./20260609_120000";
import * as migration_20260610_000000 from "./20260610_000000";
import * as migration_20260610_120000 from "./20260610_120000";
import * as migration_20260610_130000 from "./20260610_130000";
import * as migration_20260610_140000 from "./20260610_140000";
import * as migration_20260610_214703 from "./20260610_214703";

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
];
