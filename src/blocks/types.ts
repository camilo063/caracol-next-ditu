/**
 * Helpers de tipo para extraer cada block type desde el union generado
 * en `payload-types.ts`. Permite tipar cada componente de render con
 * exactamente las props que llegan desde Payload.
 */
import type { Page } from "@/payload-types";

type LayoutBlocks = NonNullable<Page["layout"]>[number];

export type BlockOf<T extends LayoutBlocks["blockType"]> = Extract<
  LayoutBlocks,
  { blockType: T }
>;

export type HeroBlockProps = BlockOf<"hero">;
export type AudienceNetworksBlockProps = BlockOf<"audience-networks">;
export type BrandTabsBlockProps = BlockOf<"brand-tabs">;
export type KeyMomentsBlockProps = BlockOf<"key-moments">;
export type AdFormatsBlockProps = BlockOf<"ad-formats">;
export type BrandedContentBlockProps = BlockOf<"branded-content">;
export type OurChannelsBlockProps = BlockOf<"our-channels">;
export type SportsEventsBlockProps = BlockOf<"sports-events">;
export type ContactBlockProps = BlockOf<"contact">;
export type AIRecommendationBlockProps = BlockOf<"ai-recommendation">;

export type AnyBlock = LayoutBlocks;
