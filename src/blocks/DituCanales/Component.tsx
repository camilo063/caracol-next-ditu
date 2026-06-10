import type { Media } from "@/payload-types";
import {
  DituCanalesBlock,
  type DituCanalesProps,
} from "@/components/marketing/ditu-canales";
import { mediaUrl } from "@/lib/media";
import type { DituCanalesBlockProps } from "../types";

type TabKey = "envivo" | "fast" | "aliados";

function mapChannels(
  arr:
    | { name: string; logo?: (number | null) | Media; id?: string | null }[]
    | null
    | undefined,
) {
  if (!arr || arr.length === 0) return [];
  return arr.map((ch, idx) => ({
    id: ch.id ?? String(idx),
    name: ch.name,
    logoUrl: mediaUrl(ch.logo as number | Media | null | undefined) ?? undefined,
  }));
}

export function DituCanalesBlockComponent(block: DituCanalesBlockProps) {
  const envivo = mapChannels(block.channelsEnVivo);
  const fast = mapChannels(block.channelsFast);
  const aliados = mapChannels(block.channelsAliados);

  const channelsByTab: DituCanalesProps["channelsByTab"] =
    envivo.length > 0 || fast.length > 0 || aliados.length > 0
      ? ({ envivo, fast, aliados } as Record<TabKey, typeof envivo>)
      : undefined;

  return (
    <DituCanalesBlock
      anchorId={block.anchorId ?? undefined}
      channelsByTab={channelsByTab}
    />
  );
}
