import { RevealSection } from "@/components/animations";
import {
  DituAdnBlock,
  DituAudienciaBlock,
  DituCalendarioBlock,
  DituCanalesBlock,
  DituFooter,
  DituHablamosBlock,
  DituHero,
  DituPautaBlock,
  DituTipoContenidoBlock,
  DituVideoBlock,
  DituWordmark,
  FloatingContact,
  SiteHeader,
} from "@/components/marketing";
import { getFloatingContact, getFooter, getHeader } from "@/lib/cms";
import { getDituPage } from "@/lib/cms-ditu";

const CYAN = "#77EDED";

type DituSocialNetwork =
  | "facebook"
  | "x"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "whatsapp";
const DITU_SOCIAL_NETWORKS = new Set<DituSocialNetwork>([
  "facebook",
  "x",
  "instagram",
  "tiktok",
  "youtube",
  "whatsapp",
]);

/**
 * Ditu — `/ditu`.
 *
 * 100% editable desde Payload:
 *  - ditu-page Global (9 secciones: hero, video, audiencia, adn, tipoContenido,
 *    canales, calendario, pauta, hablamos)
 *  - header-ditu / footer-ditu Globals
 *  - floating-contact Global (compartido con Caracol Next)
 *
 * Los componentes Ditu son visualmente específicos (no usan el block system
 * genérico). El orden de sections está fijo en este wrapper — el CMS controla
 * el contenido pero no la composición.
 */
export default async function DituPage() {
  const [ditu, header, footer, floating] = await Promise.all([
    getDituPage(),
    getHeader("ditu"),
    getFooter("ditu"),
    getFloatingContact(),
  ]);

  // El componente DituHero acepta `headingRest`/`description` como ReactNode.
  // Construimos los JSX a partir de los strings + flags del CMS aquí, en el
  // wrapper, sin tocar el componente.
  const heroRest = (
    <>
      <span className="leading-[1] text-transparent">
        {ditu.heroData.headingPlaceholderText}
      </span>
      <span className="leading-[1]">{ditu.heroData.headingMainText}</span>
      <span className="leading-[1]" style={{ color: CYAN }}>
        {ditu.heroData.headingEmphasisText}
      </span>
    </>
  );

  const heroDescription = (
    <>
      {ditu.heroData.descriptionSegments.map((seg, i) =>
        seg.boldCyan ? (
          <span key={i} className="font-bold" style={{ color: CYAN }}>
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );

  // DituFooter solo conoce 6 networks. Filtramos los del global que entran en
  // el enum del componente.
  const dituSocialLinks = footer.socialLinks
    .filter((s): s is { network: DituSocialNetwork; url: string } =>
      DITU_SOCIAL_NETWORKS.has(s.network as DituSocialNetwork),
    )
    .map((s) => ({
      network: s.network,
      url: s.url,
      label: s.network.charAt(0).toUpperCase() + s.network.slice(1),
    }));

  return (
    <div className="theme-ditu bg-background flex min-h-screen flex-col">
      <SiteHeader {...header} fallbackWordmark={<DituWordmark />} />
      {/* pt-16 = h-16 del SiteHeader fixed. */}
      <main className="flex-1 pt-16">
        {/* Hero — sin RevealSection: parallax + visible al cargar. */}
        <DituHero
          stickerText={ditu.heroData.stickerText}
          headingRest={heroRest}
          description={heroDescription}
          buttons={ditu.heroData.buttons}
        />
        <RevealSection>
          <DituVideoBlock {...ditu.video} />
        </RevealSection>
        <RevealSection>
          <DituAudienciaBlock {...ditu.audiencia} />
        </RevealSection>
        <RevealSection>
          <DituAdnBlock {...ditu.adn} />
        </RevealSection>
        <RevealSection>
          <DituTipoContenidoBlock {...ditu.tipoContenido} />
        </RevealSection>
        <RevealSection>
          <DituCanalesBlock {...ditu.canales} />
        </RevealSection>
        <RevealSection>
          <DituCalendarioBlock events={ditu.calendario.events} />
        </RevealSection>
        <RevealSection>
          <DituPautaBlock {...ditu.pauta} />
        </RevealSection>
        <RevealSection>
          <DituHablamosBlock {...ditu.hablamos} />
        </RevealSection>
      </main>
      <DituFooter socialLinks={dituSocialLinks} bottomLine={footer.bottomLine} />
      <FloatingContact {...floating} />
    </div>
  );
}
