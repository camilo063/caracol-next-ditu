import * as migration_20260601_000530 from "./20260601_000530";
import * as migration_20260610_214703 from "./20260610_214703";

export const migrations = [
  {
    up: migration_20260601_000530.up,
    down: migration_20260601_000530.down,
    name: "20260601_000530",
  },
  {
    up: migration_20260610_214703.up,
    down: migration_20260610_214703.down,
    name: "20260610_214703",
  },
];
