import { DituHablamosBlock } from "@/components/marketing/ditu-hablamos";
import type { DituHablamosBlockProps } from "../types";

export function DituHablamosBlockComponent(block: DituHablamosBlockProps) {
  return <DituHablamosBlock anchorId={block.anchorId ?? undefined} />;
}
