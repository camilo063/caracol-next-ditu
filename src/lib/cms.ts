/**
 * Helpers para fetchear contenido desde Payload Local API.
 *
 * Cada función envuelve `getPayload({ config }) + findGlobal/find` y devuelve
 * un objeto YA mapeado al shape que el componente del frontend espera.
 *
 * Cache: las funciones se envuelven con `unstable_cache` + tags. La invalidación
 * la dispara cada `afterChange` hook de su global/collection llamando
 * `revalidateTag()` + `revalidatePath()`. Ver `cms-tags.ts` y los hooks en
 * `src/collections/` y `src/globals/`.
 */

import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type { Payload } from "payload";

import config from "@payload-config";

import { cacheTags } from "./cms-tags";
import { mediaUrl } from "./media";
import type {
  FloatingContact as FloatingContactGlobal,
  FooterCaracolNext,
  FooterDitu,
  HeaderCaracolNext,
  HeaderDitu,
  HubPage,
  Page,
  SiteSetting,
} from "@/payload-types";

type Landing = "caracol-next" | "ditu";

/** Default ISR/cache window (1h). On-demand invalidation hace que sea opt-in safety net. */
const REVALIDATE_SECONDS = 3600;

async function payloadClient(): Promise<Payload> {
  return getPayload({ config });
}

// =====================================================================
// Hub page (`/`)
// =====================================================================

export interface HubPageProps {
  eyebrow: string;
  headingSegments: Array<{ text: string; weight: "semibold" | "bold" | "extrabold" }>;
  contactLabel: string;
  brands: {
    caracolNext: {
      descriptionParagraphs: string[];
      ctaLabel: string;
      href: string;
    };
    ditu: {
      descriptionParagraphs: string[];
      ctaLabel: string;
      href: string;
    };
  };
  stats: Array<{
    icon: "users" | "tv" | "zap" | "clock";
    numericValue?: number;
    prefix?: string;
    suffix?: string;
    value: string;
    label: string;
    accent: "caracolnext" | "ditu";
    lgWidth?: number;
  }>;
}

function mapHubPage(doc: HubPage): HubPageProps {
  return {
    eyebrow: doc.eyebrow,
    headingSegments: (doc.headingSegments ?? []).map((s) => ({
      text: s.text,
      weight: s.weight,
    })),
    contactLabel: doc.contactLabel,
    brands: {
      caracolNext: {
        descriptionParagraphs: (doc.brands?.caracolNext?.descriptionParagraphs ?? []).map(
          (p) => p.text,
        ),
        ctaLabel: doc.brands?.caracolNext?.ctaLabel ?? "Conoce Caracol Next",
        href: doc.brands?.caracolNext?.href ?? "/caracol-next",
      },
      ditu: {
        descriptionParagraphs: (doc.brands?.ditu?.descriptionParagraphs ?? []).map(
          (p) => p.text,
        ),
        ctaLabel: doc.brands?.ditu?.ctaLabel ?? "Conoce ditu",
        href: doc.brands?.ditu?.href ?? "/ditu",
      },
    },
    stats: (doc.stats ?? []).map((s) => ({
      icon: s.icon,
      numericValue: s.numericValue ?? undefined,
      prefix: s.prefix ?? undefined,
      suffix: s.suffix ?? undefined,
      value: s.value,
      label: s.label,
      accent: s.accent,
      lgWidth: s.lgWidth ?? undefined,
    })),
  };
}

export const getHubPage = unstable_cache(
  async (): Promise<HubPageProps> => {
    const p = await payloadClient();
    const doc = (await p.findGlobal({ slug: "hub-page" })) as HubPage;
    return mapHubPage(doc);
  },
  ["hub-page-v1"],
  { tags: [cacheTags.global("hub-page")], revalidate: REVALIDATE_SECONDS },
);

// =====================================================================
// Floating Contact (representatives)
// =====================================================================

export interface FloatingContactProps {
  enabled: boolean;
  buttonLabel: string;
  buttonIcon: string;
  panelHeading: string;
  panelDescription: string;
  representatives: Array<{
    name: string;
    role?: string | null;
    email: string;
    whatsapp: string;
    photo?: { url?: string | null; alt?: string | null } | null;
  }>;
  position: "bottom-right" | "bottom-left";
}

function mapFloatingContact(doc: FloatingContactGlobal): FloatingContactProps {
  return {
    enabled: doc.enabled ?? true,
    buttonLabel: doc.buttonLabel ?? "Contáctanos",
    buttonIcon: doc.buttonIcon ?? "Sparkles",
    panelHeading: doc.panelHeading ?? "Habla con nuestro equipo",
    panelDescription:
      doc.panelDescription ??
      "Escríbenos por correo o WhatsApp. Te respondemos en menos de 24 horas.",
    representatives: (doc.representatives ?? []).map((r) => {
      const photoUrl = mediaUrl(r.photo);
      return {
        name: r.name,
        role: r.role ?? null,
        email: r.email,
        whatsapp: r.whatsapp,
        photo: photoUrl ? { url: photoUrl, alt: r.name } : null,
      };
    }),
    position: doc.position ?? "bottom-right",
  };
}

export const getFloatingContact = unstable_cache(
  async (): Promise<FloatingContactProps> => {
    const p = await payloadClient();
    const doc = (await p.findGlobal({
      slug: "floating-contact",
    })) as FloatingContactGlobal;
    return mapFloatingContact(doc);
  },
  ["floating-contact-v1"],
  { tags: [cacheTags.global("floating-contact")], revalidate: REVALIDATE_SECONDS },
);

// =====================================================================
// Header / Footer globals
// =====================================================================

export interface SiteHeaderData {
  landing: Landing;
  logoUrl: string | null;
  navAnchors: Array<{ label: string; anchorId: string }>;
  ctaButton: {
    enabled: boolean;
    label: string;
    href: string;
    variant?: "default" | "outline" | "brand-caracolnext" | "brand-ditu" | "ghost" | null;
  } | null;
  sticky: boolean;
}

function mapHeader(
  doc: HeaderCaracolNext | HeaderDitu,
  landing: Landing,
): SiteHeaderData {
  const cta = doc.ctaButton;
  return {
    landing,
    logoUrl: mediaUrl(doc.logo) ?? null,
    navAnchors: (doc.navAnchors ?? []).map((a) => ({
      label: a.label,
      anchorId: a.anchorId,
    })),
    ctaButton: cta
      ? {
          enabled: cta.enabled ?? true,
          label: cta.label ?? "",
          href: cta.href ?? "#",
          variant: cta.variant ?? "default",
        }
      : null,
    sticky: doc.sticky ?? true,
  };
}

export async function getHeader(landing: Landing): Promise<SiteHeaderData> {
  const slug = landing === "ditu" ? "header-ditu" : "header-caracol-next";
  return unstable_cache(
    async () => {
      const p = await payloadClient();
      const doc = (await p.findGlobal({ slug })) as HeaderCaracolNext | HeaderDitu;
      return mapHeader(doc, landing);
    },
    ["header", landing, "v1"],
    { tags: [cacheTags.global(slug)], revalidate: REVALIDATE_SECONDS },
  )();
}

export interface SiteFooterData {
  landing: Landing;
  logoUrl: string | null;
  tagline: string | null;
  columns: Array<{
    heading: string;
    links: Array<{ label: string; href: string; openInNewTab?: boolean | null }>;
  }>;
  socialLinks: Array<{ network: string; url: string }>;
  bottomLine: string;
  useWave: boolean;
  tone: "dark" | "caracolnext-deep" | "ditu-deep" | "default" | "minimal";
}

function mapFooter(
  doc: FooterCaracolNext | FooterDitu,
  landing: Landing,
): SiteFooterData {
  return {
    landing,
    logoUrl: mediaUrl(doc.logo) ?? null,
    tagline: doc.tagline ?? null,
    columns: (doc.columns ?? []).map((c) => ({
      heading: c.heading ?? "",
      links: (c.links ?? []).map((l) => ({
        label: l.label ?? "",
        href: l.href ?? "#",
        openInNewTab: l.openInNewTab ?? false,
      })),
    })),
    socialLinks: (doc.socialLinks ?? [])
      .filter((s) => Boolean(s.network && s.url))
      .map((s) => ({ network: String(s.network), url: String(s.url) })),
    bottomLine: doc.bottomLine ?? "",
    useWave: doc.useWave ?? false,
    tone: (doc.tone ?? (landing === "ditu" ? "ditu-deep" : "caracolnext-deep")) as
      | "dark"
      | "caracolnext-deep"
      | "ditu-deep"
      | "default"
      | "minimal",
  };
}

export async function getFooter(landing: Landing): Promise<SiteFooterData> {
  const slug = landing === "ditu" ? "footer-ditu" : "footer-caracol-next";
  return unstable_cache(
    async () => {
      const p = await payloadClient();
      const doc = (await p.findGlobal({ slug })) as FooterCaracolNext | FooterDitu;
      return mapFooter(doc, landing);
    },
    ["footer", landing, "v1"],
    { tags: [cacheTags.global(slug)], revalidate: REVALIDATE_SECONDS },
  )();
}

// =====================================================================
// Site Settings (copyright, maintenance mode, defaults)
// =====================================================================

export interface SiteSettingsData {
  siteName: string;
  copyright: string;
  maintenanceMode: { enabled: boolean; message: string };
  defaultSeo: {
    title: string;
    description: string;
    twitterHandle: string | null;
  };
}

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsData> => {
    const p = await payloadClient();
    const doc = (await p.findGlobal({ slug: "site-settings" })) as SiteSetting;
    return {
      siteName: doc.siteName ?? "Caracol Next + Ditu",
      copyright: doc.copyright ?? "©2026 Caracol Comercial Digital",
      maintenanceMode: {
        enabled: doc.maintenanceMode?.enabled ?? false,
        message:
          doc.maintenanceMode?.message ?? "Estamos trabajando en mejoras. Vuelve pronto.",
      },
      defaultSeo: {
        title: doc.defaultMetaTitle ?? "Caracol Next + Ditu — Mediakit",
        description: doc.defaultMetaDescription ?? "",
        twitterHandle: doc.twitterHandle ?? null,
      },
    };
  },
  ["site-settings-v1"],
  { tags: [cacheTags.global("site-settings")], revalidate: REVALIDATE_SECONDS },
);

// =====================================================================
// Pages (collection)
// =====================================================================

/**
 * Fetch una page por (landing, slug). Devuelve null si no existe.
 * El layout del page se entrega tal cual (Payload Block array). El renderer
 * (RenderBlocks o DituRenderBlocks) hace el mapeo a componentes.
 */
export async function getPage(landing: Landing, slug: string): Promise<Page | null> {
  return unstable_cache(
    async () => {
      const p = await payloadClient();
      const result = await p.find({
        collection: "pages",
        where: {
          and: [{ landing: { equals: landing } }, { slug: { equals: slug } }],
        },
        limit: 1,
        depth: 3, // resuelve uploads + relationships en una query
      });
      return (result.docs[0] as Page | undefined) ?? null;
    },
    ["page", landing, slug, "v1"],
    { tags: [cacheTags.page(landing, slug)], revalidate: REVALIDATE_SECONDS },
  )();
}
