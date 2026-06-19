import type { Media } from "@/payload-types";
import {
  DituAudienciaBlock,
  type DituAudienciaProps,
} from "@/components/marketing/ditu-audiencia";
import { mediaUrl } from "@/lib/media";
import type { DituAudienciaBlockProps } from "../types";

export function DituAudienciaBlockComponent(block: DituAudienciaBlockProps) {
  const stats: DituAudienciaProps["stats"] =
    block.stats && block.stats.length > 0
      ? block.stats.map((s) => ({
          label: s.label,
          value: s.value,
          description: s.description ?? "",
          icon: mediaUrl(s.icon as number | Media | null | undefined) ?? "",
          large: s.large ?? false,
        }))
      : undefined;

  const devices: DituAudienciaProps["devices"] =
    block.devices && block.devices.length > 0
      ? block.devices.map((d) => ({
          label: d.label,
          minutes: d.minutes,
          icon: (d.icon ?? "smarttv") as "smarttv" | "mobile" | "tablet" | "web",
        }))
      : undefined;

  const networks: DituAudienciaProps["networks"] =
    block.networks && block.networks.length > 0
      ? block.networks.map((n) => ({
          network: n.network as
            | "facebook"
            | "tiktok"
            | "x"
            | "youtube"
            | "instagram"
            | "whatsapp",
          followers: n.followers,
          href: n.href ?? undefined,
        }))
      : undefined;

  return (
    <DituAudienciaBlock
      anchorId={block.anchorId ?? undefined}
      stickerLabel={block.stickerLabel ?? undefined}
      heading={block.heading ?? undefined}
      watchTime={block.watchTime ?? undefined}
      topSource={block.topSource ?? undefined}
      totalFollowersHeadline={block.totalFollowersHeadline ?? undefined}
      followersSuffix={block.followersSuffix ?? undefined}
      followersSubtext={block.followersSubtext ?? undefined}
      networkItemLabel={block.networkItemLabel ?? undefined}
      bottomSource={block.bottomSource ?? undefined}
      stats={stats}
      devices={devices}
      networks={networks}
    />
  );
}
