import { DituAdnBlock, type DituAdnProps } from "@/components/marketing/ditu-adn";
import type { DituAdnBlockProps } from "../types";

export function DituAdnBlockComponent(block: DituAdnBlockProps) {
  const ageBars: DituAdnProps["ageBars"] =
    block.ageBars && block.ageBars.length > 0
      ? block.ageBars.map((b) => ({
          label: b.label,
          value: b.value,
          peak: b.peak ?? false,
        }))
      : undefined;

  const nseCards: DituAdnProps["nseCards"] =
    block.nseCards && block.nseCards.length > 0
      ? block.nseCards.map((c) => ({ label: c.label, value: c.value }))
      : undefined;

  return (
    <DituAdnBlock
      anchorId={block.anchorId ?? undefined}
      stickerLabel={block.stickerLabel ?? undefined}
      heading={block.heading ?? undefined}
      gender={block.gender ?? undefined}
      genderMalePercent={block.genderMalePercent ?? undefined}
      agePeak={block.agePeak ?? undefined}
      ageBars={ageBars}
      secondHeading={block.secondHeading ?? undefined}
      nseDescription={block.nseDescription ?? undefined}
      nseCards={nseCards}
      source={block.source ?? undefined}
    />
  );
}
