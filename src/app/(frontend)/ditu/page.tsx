export const dynamic = "force-dynamic";

import type { Media } from "@/payload-types";
import { RenderBlocks } from "@/blocks";
import {
  DituWordmark,
  DituFooter,
  FloatingContact,
  SiteHeader,
} from "@/components/marketing";
import {
  getDituPage,
  getFloatingContact,
  getFooterDitu,
  getHeaderDitu,
} from "@/lib/payload/queries";

function mediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === "number") return null;
  return media.url ?? null;
}

export default async function DituPage() {
  const [header, floating, dituPage, footerData] = await Promise.all([
    getHeaderDitu(),
    getFloatingContact(),
    getDituPage(),
    getFooterDitu(),
  ]);

  const headerCta =
    header.ctaButton?.enabled === true && header.ctaButton.label && header.ctaButton.href
      ? {
          enabled: true as const,
          label: header.ctaButton.label,
          href: header.ctaButton.href,
          variant: header.ctaButton.variant ?? null,
        }
      : null;

  const socialLinks = (footerData.socialLinks ?? []).map((s) => ({
    network: s.network as
      | "facebook"
      | "instagram"
      | "x"
      | "tiktok"
      | "youtube"
      | "whatsapp",
    url: s.url,
    label: s.network,
  }));

  return (
    <div className="theme-ditu bg-background flex min-h-screen flex-col">
      <SiteHeader
        landing="ditu"
        logoUrl={mediaUrl(header.logo)}
        fallbackWordmark={<DituWordmark />}
        navAnchors={header.navAnchors ?? []}
        ctaButton={headerCta}
        sticky={header.sticky ?? true}
      />
      {/* pt-16 = h-16 del SiteHeader fixed */}
      <main className="flex-1 pt-16">
        <RenderBlocks layout={dituPage?.layout} />
      </main>
      <DituFooter
        socialLinks={socialLinks.length > 0 ? socialLinks : undefined}
        encuentranosLabel={footerData.encuentranosLabel ?? undefined}
        bottomLine={footerData.bottomLine ?? undefined}
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
        tone="ditu"
      />
    </div>
  );
}
