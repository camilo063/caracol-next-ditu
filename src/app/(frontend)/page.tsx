import type { Metadata } from "next";

import { CaracolNextWordmark, DituWordmark, HubLanding } from "@/components/marketing";
import { getFloatingContact, getHubPage, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    settings,
    path: "/",
    fallbackTitle: "Caracol Medios — Mediakit",
    fallbackDescription:
      "Unidad digital #1 en Colombia. Conecta tu marca con la audiencia más relevante del país.",
  });
}

/**
 * Hub principal — `/` (Home Caracol Medios).
 *
 * Data 100% editable desde Payload:
 *  - hub-page Global (eyebrow, headingSegments, contactLabel, brands, stats)
 *  - floating-contact Global (representatives para el modal)
 *  - site-settings Global (copyright)
 *
 * Los wordmarks (CaracolNextWordmark, DituWordmark) son SVGs hardcoded — son
 * parte del frontend visual, no contenido editorial.
 *
 * El componente HubLanding mantiene su shape de props original — el mapeo
 * Payload → JSX (en particular el heading con spans de distinto weight) se
 * hace aquí en el wrapper, sin tocar el componente.
 */
export default async function HomePage() {
  const [hub, floating, settings] = await Promise.all([
    getHubPage(),
    getFloatingContact(),
    getSiteSettings(),
  ]);

  return (
    <HubLanding
      eyebrow={hub.eyebrow}
      heading={renderHeadingSegments(hub.headingSegments)}
      contactLabel={hub.contactLabel}
      representatives={floating.representatives.map((r) => ({
        name: r.name,
        email: r.email,
        whatsapp: r.whatsapp,
      }))}
      brands={{
        caracolNext: {
          title: <CaracolNextWordmark className="h-[32px] w-[205px]" />,
          description: hub.brands.caracolNext.descriptionParagraphs,
          ctaLabel: hub.brands.caracolNext.ctaLabel,
          href: hub.brands.caracolNext.href,
        },
        ditu: {
          title: <DituWordmark className="!h-[32px] !w-[92px]" />,
          description: hub.brands.ditu.descriptionParagraphs,
          ctaLabel: hub.brands.ditu.ctaLabel,
          href: hub.brands.ditu.href,
        },
      }}
      stats={hub.stats}
      copyright={settings.copyright}
    />
  );
}

/**
 * Convierte `headingSegments[]` (text + weight) en una secuencia de spans
 * con la clase Tailwind correspondiente. El componente HubLanding mantiene
 * el patrón original de aceptar `heading: ReactNode`.
 */
function renderHeadingSegments(
  segments: Array<{ text: string; weight: "semibold" | "bold" | "extrabold" }>,
): React.ReactNode {
  const weightClass = {
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  } as const;
  return (
    <>
      {segments.map((seg, i) => (
        <span key={i} className={cn(weightClass[seg.weight])}>
          {seg.text}
        </span>
      ))}
    </>
  );
}
