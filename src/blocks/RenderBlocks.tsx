import { RevealSection } from "@/components/animations";
import { AdFormatsBlockComponent } from "./AdFormats/Component";
import { AIRecommendationBlockComponent } from "./AIRecommendation/Component";
import { AudienceNetworksBlockComponent } from "./AudienceNetworks/Component";
import { AudienceProfileBlockComponent } from "./AudienceProfile/Component";
import { BrandTabsBlockComponent } from "./BrandTabs/Component";
import { BrandedContentBlockComponent } from "./BrandedContent/Component";
import { ContactBlockComponent } from "./Contact/Component";
import { ContentTypeBlockComponent } from "./ContentType/Component";
import { EstratosBlockComponent } from "./Estratos/Component";
import { HeroBlockComponent } from "./Hero/Component";
import { KeyMomentsCalendarComponent } from "./KeyMomentsCalendar/Component";
import { OurChannelsBlockComponent } from "./OurChannels/Component";
import { SportsEventsBlockComponent } from "./SportsEvents/Component";
import type { AnyBlock } from "./types";

/**
 * RenderBlocks — orchestrator. Recibe el array `layout` de una Page de Payload
 * y despacha al componente correspondiente según `blockType`.
 *
 * Animaciones:
 *  - Hero: parallax interno en el background. No se envuelve con RevealSection.
 *  - Demás bloques: fade-in + slide-up al entrar al viewport (RevealSection).
 */
export function RenderBlocks({ layout }: { layout: AnyBlock[] | null | undefined }) {
  if (!layout || layout.length === 0) return null;
  return (
    <>
      {layout.map((block) => {
        const key = `${block.blockType}-${block.id ?? Math.random()}`;
        const node = renderBlock(block, key);
        if (block.blockType === "hero") return node;
        return <RevealSection key={key}>{node}</RevealSection>;
      })}
    </>
  );
}

function renderBlock(block: AnyBlock, key: string) {
  switch (block.blockType) {
    case "hero":
      return <HeroBlockComponent key={key} {...block} />;
    case "audience-networks":
      return <AudienceNetworksBlockComponent key={key} {...block} />;
    case "audience-profile":
      return <AudienceProfileBlockComponent key={key} {...block} />;
    case "estratos":
      return <EstratosBlockComponent key={key} {...block} />;
    case "content-type":
      return <ContentTypeBlockComponent key={key} {...block} />;
    case "brand-tabs":
      return <BrandTabsBlockComponent key={key} {...block} />;
    case "key-moments":
      return <KeyMomentsCalendarComponent key={key} {...block} />;
    case "ad-formats":
      return <AdFormatsBlockComponent key={key} {...block} />;
    case "branded-content":
      return <BrandedContentBlockComponent key={key} {...block} />;
    case "our-channels":
      return <OurChannelsBlockComponent key={key} {...block} />;
    case "sports-events":
      return <SportsEventsBlockComponent key={key} {...block} />;
    case "contact":
      return <ContactBlockComponent key={key} {...block} />;
    case "ai-recommendation":
      return <AIRecommendationBlockComponent key={key} {...block} />;
    default:
      console.warn("[RenderBlocks] block desconocido", block);
      return null;
  }
}
