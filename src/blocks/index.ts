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
import { DituAdnBlock } from "./DituAdn/config";
import { DituAudienciaBlock } from "./DituAudiencia/config";
import { DituCalendarioBlock } from "./DituCalendario/config";
import { DituCanalesBlock } from "./DituCanales/config";
import { DituHablamosBlock } from "./DituHablamos/config";
import { DituHeroBlock } from "./DituHero/config";
import { DituPautaBlock } from "./DituPauta/config";
import { DituTipoContenidoBlock } from "./DituTipoContenido/config";
import { DituVideoBlock } from "./DituVideo/config";
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
  DituHeroBlock,
  DituVideoBlock,
  DituAudienciaBlock,
  DituAdnBlock,
  DituTipoContenidoBlock,
  DituCanalesBlock,
  DituCalendarioBlock,
  DituPautaBlock,
  DituHablamosBlock,
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
  DituAdnBlock,
  DituAudienciaBlock,
  DituCalendarioBlock,
  DituCanalesBlock,
  DituHablamosBlock,
  DituHeroBlock,
  DituPautaBlock,
  DituTipoContenidoBlock,
  DituVideoBlock,
  EstratosBlock,
  HeroBlock,
  KeyMomentsCalendarBlock,
  OurChannelsBlock,
  SportsEventsBlock,
};

export { RenderBlocks } from "./RenderBlocks";
