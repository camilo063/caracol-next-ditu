/**
 * Helpers para generar Metadata de Next desde los globals + page-level overrides.
 *
 * Patrón:
 *  1. Lee site-settings.defaultSeo como base.
 *  2. Si la page tiene `meta.{title,description,image,noIndex}` (del plugin SEO),
 *     overridean los defaults.
 *  3. Devuelve Metadata listo para `generateMetadata`.
 */

import type { Metadata } from "next";

import { mediaUrl } from "./media";
import type { SiteSettingsData } from "./cms";
import type { Page } from "@/payload-types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export interface BuildMetadataInput {
  /** Defaults del site-settings global. */
  settings: SiteSettingsData;
  /** Override por page (del SEO plugin de Payload). */
  pageMeta?: Page["meta"];
  /** Path absoluto (sin trailing slash) para canonical y OG url. */
  path: string;
  /** Override del title si no hay pageMeta.title. */
  fallbackTitle?: string;
  /** Override de description si no hay pageMeta.description. */
  fallbackDescription?: string;
}

export function buildMetadata({
  settings,
  pageMeta,
  path,
  fallbackTitle,
  fallbackDescription,
}: BuildMetadataInput): Metadata {
  const title = pageMeta?.title || fallbackTitle || settings.defaultSeo.title;
  const description =
    pageMeta?.description || fallbackDescription || settings.defaultSeo.description;
  const ogImageUrl = mediaUrl(pageMeta?.image);
  const noIndex = Boolean((pageMeta as { noIndex?: boolean } | undefined)?.noIndex);
  const url = `${SITE_URL}${path}`;
  const twitterHandle = settings.defaultSeo.twitterHandle ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: settings.siteName,
      type: "website",
      locale: "es_CO",
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(twitterHandle ? { site: twitterHandle, creator: twitterHandle } : {}),
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
