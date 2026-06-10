import type { Block } from "payload";
import { anchorIdField } from "../shared-fields";

export const DituHablamosBlock: Block = {
  slug: "ditu-hablamos",
  labels: { singular: "Ditu Hablamos", plural: "Ditu Hablamos" },
  fields: [anchorIdField],
};
