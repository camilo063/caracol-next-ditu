/**
 * Barrel de Payload Block configs.
 * Importar todos para registrarlos en el field `blocks` de la collection Pages.
 */
import { AdFormatsBlock } from "./AdFormats/config";
import { AIRecommendationBlock } from "./AIRecommendation/config";
import { AudienceNetworksBlock } from "./AudienceNetworks/config";
import { BrandTabsBlock } from "./BrandTabs/config";
import { BrandedContentBlock } from "./BrandedContent/config";
import { ContactBlock } from "./Contact/config";
import { HeroBlock } from "./Hero/config";
import { KeyMomentsCalendarBlock } from "./KeyMomentsCalendar/config";
import { OurChannelsBlock } from "./OurChannels/config";
import { SportsEventsBlock } from "./SportsEvents/config";

export const allBlocks = [
  HeroBlock,
  AudienceNetworksBlock,
  BrandTabsBlock,
  KeyMomentsCalendarBlock,
  AdFormatsBlock,
  BrandedContentBlock,
  OurChannelsBlock,
  SportsEventsBlock,
  ContactBlock,
  AIRecommendationBlock,
] as const;

export {
  AdFormatsBlock,
  AIRecommendationBlock,
  AudienceNetworksBlock,
  BrandTabsBlock,
  BrandedContentBlock,
  ContactBlock,
  HeroBlock,
  KeyMomentsCalendarBlock,
  OurChannelsBlock,
  SportsEventsBlock,
};
