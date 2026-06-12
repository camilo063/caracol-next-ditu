import { DituHablamosBlock } from "@/components/marketing/ditu-hablamos";
import type { DituHablamosBlockProps } from "../types";

export function DituHablamosBlockComponent(block: DituHablamosBlockProps) {
  return (
    <DituHablamosBlock
      anchorId={block.anchorId ?? undefined}
      stickerLabel={block.stickerLabel ?? undefined}
      heading={block.heading ?? undefined}
      headingAccent={block.headingAccent ?? undefined}
      description={block.description ?? undefined}
      cta={
        block.cta
          ? { label: block.cta.label ?? undefined, href: block.cta.href ?? undefined }
          : undefined
      }
    />
  );
}
