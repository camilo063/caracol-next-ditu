import { notFound } from "next/navigation";

import type { Media } from "@/payload-types";
import { RenderBlocks } from "@/blocks";
import {
  CaracolNextWordmark,
  FloatingContact,
  SiteFooter,
  SiteHeader,
} from "@/components/marketing";
import {
  getCaracolNextPage,
  getFooterCaracolNext,
  getFloatingContact,
  getHeaderCaracolNext,
} from "@/lib/payload/queries";

function mediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === "number") return null;
  return media.url ?? null;
}

/**
 * Caracol Next — `/caracol-next`.
 * Header + RenderBlocks + Footer + FloatingContact, todos desde Payload CMS.
 */
export default async function CaracolNextPage() {
  const [page, header, footer, floating] = await Promise.all([
    getCaracolNextPage(),
    getHeaderCaracolNext(),
    getFooterCaracolNext(),
    getFloatingContact(),
  ]);

  if (!page) notFound();

  const headerCta =
    header.ctaButton?.enabled === true && header.ctaButton.label && header.ctaButton.href
      ? {
          enabled: true as const,
          label: header.ctaButton.label,
          href: header.ctaButton.href,
          variant: header.ctaButton.variant ?? null,
        }
      : null;

  return (
    <div className="theme-caracol-next bg-background flex min-h-screen flex-col">
      <SiteHeader
        landing="caracol-next"
        logoUrl={mediaUrl(header.logo)}
        fallbackWordmark={<CaracolNextWordmark />}
        navAnchors={header.navAnchors ?? []}
        ctaButton={headerCta}
        sticky={header.sticky ?? true}
      />
      {/* pt-16 = h-16 del SiteHeader fixed para no quedar oculto. */}
      <main className="flex-1 pt-12 xl:pt-16">
        <RenderBlocks layout={page.layout} />
      </main>
      <SiteFooter
        landing="caracol-next"
        logoUrl={mediaUrl(footer.logo)}
        fallbackWordmark={<CaracolNextWordmark />}
        tagline={footer.tagline}
        columns={(footer.columns ?? []).map((col) => ({
          heading: col.heading,
          links: col.links ?? [],
        }))}
        socialLinks={(footer.socialLinks ?? []).map((sl) => ({
          network: sl.network,
          url: sl.url,
        }))}
        bottomLine={footer.bottomLine ?? undefined}
        useWave={footer.useWave ?? false}
        tone={footer.tone ?? undefined}
      />
      <FloatingContact
        enabled={floating.enabled ?? true}
        buttonLabel={floating.buttonLabel ?? undefined}
        buttonIcon={floating.buttonIcon ?? undefined}
        panelHeading={floating.panelHeading ?? undefined}
        panelDescription={floating.panelDescription ?? undefined}
        representatives={(floating.representatives ?? []).map((rep) => ({
          name: rep.name,
          role: rep.role,
          email: rep.email,
          whatsapp: rep.whatsapp,
          photo: rep.photo,
        }))}
        position={floating.position ?? undefined}
      />
    </div>
  );
}
