/**
 * Barrel de Payload Block configs + componentes de render.
 */
import { AdFormatsBlock } from "./AdFormats/config";
import { AIRecommendationBlock } from "./AIRecommendation/config";
import { AudienceNetworksBlock } from "./AudienceNetworks/config";
import { AudienceProfileBlock } from "./AudienceProfile/config";
import { BrandTabsBlock } from "./BrandTabs/config";
import { BrandedContentBlock } from "./BrandedContent/config";
import { ContactBlock } from "./Contact/config";
import { ContentTypeBlock } from "./ContentType/config";
import { EstratosBlock } from "./Estratos/config";
import { HeroBlock } from "./Hero/config";
import { KeyMomentsCalendarBlock } from "./KeyMomentsCalendar/config";
import { OurChannelsBlock } from "./OurChannels/config";
import { SportsEventsBlock } from "./SportsEvents/config";

export const allBlocks = [
  HeroBlock,
  AudienceNetworksBlock,
  AudienceProfileBlock,
  EstratosBlock,
  ContentTypeBlock,
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
  AudienceProfileBlock,
  BrandTabsBlock,
  BrandedContentBlock,
  ContactBlock,
  ContentTypeBlock,
  EstratosBlock,
  HeroBlock,
  KeyMomentsCalendarBlock,
  OurChannelsBlock,
  SportsEventsBlock,
};

export { RenderBlocks } from "./RenderBlocks";
