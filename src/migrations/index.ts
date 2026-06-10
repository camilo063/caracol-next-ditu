import * as migration_20260601_000530 from "./20260601_000530";
import * as migration_20260609_120000 from "./20260609_120000";

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
];
