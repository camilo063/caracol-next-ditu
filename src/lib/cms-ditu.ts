/**
 * Helpers específicos para fetchear + mapear el global `ditu-page` a las
 * props de cada componente Ditu del frontend. Vive en archivo separado para
 * no engordar `lib/cms.ts` — Ditu tiene 9 secciones con shapes propias.
 *
 * El componente Ditu sigue recibiendo las mismas props que tenía antes (no
 * tocamos visual); el mapper sólo extrae lo correspondiente del Payload doc.
 */

import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

import config from "@payload-config";

import { cacheTags } from "./cms-tags";
import type { CalendarEvent } from "@/components/marketing/ditu-calendario";
import type {
  CanalesTab,
  ChannelCard,
  TabKey,
} from "@/components/marketing/ditu-canales";
import type { DituAdnProps } from "@/components/marketing/ditu-adn";
import type { DituAudienciaProps } from "@/components/marketing/ditu-audiencia";
import type { DituCanalesProps } from "@/components/marketing/ditu-canales";
import type { DituHablamosProps } from "@/components/marketing/ditu-hablamos";
import type { DituPautaProps } from "@/components/marketing/ditu-pauta";
import type { DituTipoContenidoProps } from "@/components/marketing/ditu-tipo-contenido";
import type { DituVideoBlockProps } from "@/components/marketing/ditu-video-block";
import type { DituPage } from "@/payload-types";

import { mediaUrl } from "./media";

/**
 * Shape extendido para el Hero: el componente DituHero acepta `headingRest`
 * y `description` como ReactNode. El JSX se construye en el page wrapper
 * porque necesita CSS específico (span transparent placeholder, spans cyan,
 * spans bold). Aquí pasamos los strings crudos + flags.
 */
export interface DituHeroData {
  stickerText: string;
  headingPlaceholderText: string;
  headingMainText: string;
  headingEmphasisText: string;
  descriptionSegments: Array<{ text: string; boldCyan: boolean }>;
  buttons: Array<{ label: string; href: string; icon: "googleplay" | "appstore" | "tv" }>;
}

/**
 * Shape final consumido por `/ditu/page.tsx`. Cada key matchea un componente.
 * `heroData` es el raw — el page wrapper compone los ReactNodes.
 */
export interface DituPageProps {
  heroData: DituHeroData;
  video: DituVideoBlockProps;
  audiencia: DituAudienciaProps;
  adn: DituAdnProps;
  tipoContenido: DituTipoContenidoProps;
  canales: DituCanalesProps;
  calendario: { events: CalendarEvent[] };
  pauta: DituPautaProps;
  hablamos: DituHablamosProps;
}

const DEFAULT_DITU_PAGE: DituPageProps = {
  heroData: {
    stickerText: "TU MARCA",
    headingPlaceholderText: "Tu marca ",
    headingMainText: "",
    headingEmphasisText: "",
    descriptionSegments: [],
    buttons: [],
  },
  video: { src: undefined, alt: "" },
  audiencia: {
    totalFollowersHeadline: "",
    stats: [],
    devices: [],
    networks: [],
  },
  adn: { ageBars: [], genderData: [], nseCards: [] },
  tipoContenido: { autoplayInterval: 5000, tabs: [] },
  canales: { tabs: [], channelsByTab: { envivo: [], fast: [], aliados: [] } },
  calendario: { events: [] },
  pauta: { categories: [] },
  hablamos: {
    stickerText: "¿HABLAMOS?",
    headingLine1: "",
    headingLine2: "",
    headingLine2Emphasis: "",
    subtitle: "",
    ctaLabel: "Contáctanos",
    ctaHref: "#contacto",
  },
};

export const getDituPage = unstable_cache(
  async (): Promise<DituPageProps> => {
    try {
      const p = await getPayload({ config });
      const doc = (await p.findGlobal({ slug: "ditu-page" })) as DituPage;

      return {
        heroData: mapHeroData(doc.hero),
        video: mapVideo(doc.video),
        audiencia: mapAudiencia(doc.audiencia),
        adn: mapAdn(doc.adn),
        tipoContenido: mapTipoContenido(doc.tipoContenido),
        canales: mapCanales(doc.canales),
        calendario: mapCalendario(doc.calendario),
        pauta: mapPauta(doc.pauta),
        hablamos: mapHablamos(doc.hablamos),
      };
    } catch (err) {
      console.warn(
        `[cms] ditu-page fetch falló, usando fallback. Causa: ${(err as Error).message}`,
      );
      return DEFAULT_DITU_PAGE;
    }
  },
  ["ditu-page-v1"],
  { tags: [cacheTags.global("ditu-page")], revalidate: 3600 },
);

// ====================================================================
// Hero
// ====================================================================

function mapHeroData(hero: DituPage["hero"]): DituHeroData {
  const safe = hero ?? ({} as DituPage["hero"]);
  return {
    stickerText: safe?.stickerText ?? "TU MARCA",
    headingPlaceholderText: safe?.headingPlaceholderText ?? "Tu marca ",
    headingMainText: safe?.headingMainText ?? "en todas las pantallas, ",
    headingEmphasisText: safe?.headingEmphasisText ?? "en todo momento",
    descriptionSegments: (safe?.descriptionSegments ?? []).map((s) => ({
      text: s.text,
      boldCyan: s.boldCyan ?? false,
    })),
    buttons: (safe?.buttons ?? []).map((b) => ({
      label: b.label,
      href: b.href,
      icon: b.icon,
    })),
  };
}

// ====================================================================
// Video
// ====================================================================

function mapVideo(video: DituPage["video"]): DituVideoBlockProps {
  return {
    src: mediaUrl(video?.media) ?? undefined,
    alt: video?.alt ?? "",
  };
}

// ====================================================================
// Audiencia
// ====================================================================

function mapAudiencia(audiencia: DituPage["audiencia"]): DituAudienciaProps {
  return {
    totalFollowersHeadline: audiencia.totalFollowersHeadline,
    stats: (audiencia.stats ?? []).map((s) => ({
      label: s.label,
      value: s.value,
      description: s.description,
      icon: s.icon,
      large: s.large ?? false,
      // format se omite — CountUp aplica fallback es-CO por defecto.
    })),
    devices: (audiencia.devices ?? []).map((d) => ({
      label: d.label,
      minutes: d.minutes,
      icon: d.icon,
    })),
    networks: (audiencia.networks ?? []).map((n) => ({
      network: n.network,
      followers: n.followers,
    })),
  };
}

// ====================================================================
// ADN
// ====================================================================

function mapAdn(adn: DituPage["adn"]): DituAdnProps {
  const safe = adn ?? {};
  return {
    ageBars: (safe.ageBars ?? []).map((a) => ({
      label: a.label,
      value: a.value,
      peak: a.peak ?? false,
    })),
    genderData: (safe.genderData ?? []).map((g) => ({
      name: g.name,
      value: g.value,
      color: g.color,
    })),
    nseCards: (safe.nseCards ?? []).map((n) => ({
      label: n.label,
      value: n.value,
    })),
  };
}

// ====================================================================
// Tipo Contenido
// ====================================================================

function mapTipoContenido(tc: DituPage["tipoContenido"]): DituTipoContenidoProps {
  const safe = tc ?? {};
  return {
    autoplayInterval: safe.autoplayInterval ?? 5000,
    tabs: (safe.tabs ?? []).map((t) => ({
      label: t.label,
      description: t.description,
    })),
  };
}

// ====================================================================
// Canales
// ====================================================================

function mapCanales(canales: DituPage["canales"]): DituCanalesProps {
  const safe = canales ?? {};
  const tabs: CanalesTab[] = (safe.tabs ?? []).map((t) => ({
    key: t.key as TabKey,
    label: t.label,
  }));

  const channelsByTab = (safe.channels ?? []).reduce<Record<TabKey, ChannelCard[]>>(
    (acc, ch) => {
      const tabKey = ch.tabKey as TabKey;
      if (!acc[tabKey]) acc[tabKey] = [];
      acc[tabKey].push({
        id: `${tabKey}-${ch.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: ch.name,
        brand: ch.brand ?? undefined,
      });
      return acc;
    },
    { envivo: [], fast: [], aliados: [] },
  );

  return { tabs, channelsByTab };
}

// ====================================================================
// Calendario
// ====================================================================

function mapCalendario(cal: DituPage["calendario"]): { events: CalendarEvent[] } {
  const safe = cal ?? {};
  return {
    events: (safe.events ?? []).map((e, idx) => ({
      id: `evt-${idx}`,
      title: e.title,
      subtitle: e.subtitle,
      dateLabel: e.dateLabel,
      startDate: typeof e.startDate === "string" ? e.startDate.slice(0, 10) : e.startDate,
      endDate: typeof e.endDate === "string" ? e.endDate.slice(0, 10) : e.endDate,
      category: e.category,
      badgeVariant: e.badgeVariant,
    })),
  };
}

// ====================================================================
// Pauta
// ====================================================================

function mapPauta(pauta: DituPage["pauta"]): DituPautaProps {
  const safe = pauta ?? {};
  return {
    categories: (safe.categories ?? []).map((c) => ({
      key: c.key,
      label: c.label,
      formats: (c.formats ?? []).map((f, idx) => ({
        id: `${c.key}-${idx}`,
        tag: f.tag,
        title: f.title,
        description: f.description,
        image: mediaUrl(f.image) ?? undefined,
      })),
    })),
  };
}

// ====================================================================
// Hablamos
// ====================================================================

function mapHablamos(hablamos: DituPage["hablamos"]): DituHablamosProps {
  return {
    stickerText: hablamos.stickerText,
    headingLine1: hablamos.headingLine1,
    headingLine2: hablamos.headingLine2,
    headingLine2Emphasis: hablamos.headingLine2Emphasis,
    subtitle: hablamos.subtitle,
    ctaLabel: hablamos.ctaLabel,
    ctaHref: hablamos.ctaHref,
  };
}
