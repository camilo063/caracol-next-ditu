export const dynamic = "force-dynamic";

import type { Media } from "@/payload-types";
import { getSiteSettings, getFloatingContact } from "@/lib/payload/queries";
import { mediaUrl } from "@/lib/media";
import { CaracolNextWordmark, DituWordmark, HubLanding } from "@/components/marketing";

/**
 * Hub principal — `/` (Home Caracol Medios).
 * Contenido servido desde SiteSettings.homeContent (Payload).
 * Fallbacks inline para pixel-identicidad cuando los campos están vacíos.
 */
export default async function HomePage() {
  const [settings, floating] = await Promise.all([
    getSiteSettings(),
    getFloatingContact(),
  ]);

  const hc = settings.homeContent;

  // ── Heading: construir ReactNode desde array de partes ──────────────────
  const headingParts = hc?.heading;
  const heading =
    headingParts && headingParts.length > 0 ? (
      <>
        {headingParts.map((part, i) => {
          const w = part.weight ?? "extrabold";
          const cls =
            w === "semibold"
              ? "font-semibold"
              : w === "regular"
                ? "font-normal"
                : "font-extrabold";
          return (
            <span key={i} className={cls}>
              {part.text}
            </span>
          );
        })}
      </>
    ) : (
      // Fallback — mismo JSX que la versión hardcoded anterior
      <>
        <span className="font-extrabold">Conecta</span>
        <span className="font-semibold"> tu marca con la audiencia </span>
        <span className="font-extrabold">más relevante del país.</span>
      </>
    );

  // ── Stats: mapear desde Payload con iconUrl desde Media ─────────────────
  type StatIconKey = "users" | "tv" | "zap" | "clock";
  const ICON_KEY_ORDER: StatIconKey[] = ["users", "tv", "zap", "clock"];

  const stats =
    hc?.stats && hc.stats.length > 0
      ? hc.stats.map((s, i) => ({
          icon: ICON_KEY_ORDER[i % ICON_KEY_ORDER.length],
          iconUrl: mediaUrl(s.icon as number | Media | null | undefined),
          numericValue: s.numericValue ?? undefined,
          prefix: s.prefix ?? undefined,
          suffix: s.suffix ?? undefined,
          value: (s.prefix ?? "") + (s.numericValue?.toString() ?? "") + (s.suffix ?? ""),
          label: s.label,
          accent:
            (s.accent as "caracolnext" | "ditu" | null | undefined) ?? "caracolnext",
          lgWidth: s.lgWidth ?? undefined,
        }))
      : // Fallback — valores del diseño original
        [
          {
            icon: "users" as const,
            numericValue: 16,
            prefix: "+",
            suffix: "M",
            value: "+16M",
            label: "usuarios",
            accent: "caracolnext" as const,
            lgWidth: 272,
          },
          {
            icon: "tv" as const,
            numericValue: 3,
            prefix: "+",
            suffix: "M",
            value: "+3M",
            label: "pantallas activas",
            accent: "ditu" as const,
            lgWidth: 340,
          },
          {
            icon: "zap" as const,
            numericValue: 127,
            prefix: "+",
            suffix: "M",
            value: "+127M",
            label: "seguidores",
            accent: "caracolnext" as const,
            lgWidth: 328,
          },
          {
            icon: "clock" as const,
            numericValue: 42,
            suffix: "Min",
            value: "42Min",
            label: "watch time",
            accent: "ditu" as const,
            lgWidth: 288,
          },
        ];

  // ── Brands: titles inline SVG; description de Payload o fallback ─────────
  const cnDesc = hc?.brands?.caracolNext?.description;
  const dituDesc = hc?.brands?.ditu?.description;

  const brands = {
    caracolNext: {
      title: <CaracolNextWordmark className="h-[32px] w-[205px]" />,
      description:
        cnDesc && cnDesc.length > 0
          ? cnDesc.map((p) => p.text)
          : [
              "Conecta tu marca con el respaldo de nuestros portales líderes a través de contenidos que generan impacto real.",
            ],
      ctaLabel: hc?.brands?.caracolNext?.ctaLabel ?? "Conoce Caracol Next",
      href: hc?.brands?.caracolNext?.href ?? "/caracol-next",
    },
    ditu: {
      title: <DituWordmark className="h-[32px] w-[92px]" showByline={false} />,
      description:
        dituDesc && dituDesc.length > 0
          ? dituDesc.map((p) => p.text)
          : [
              "Integra tu marca en el mejor contenido en vivo y On Demand en cualquier pantalla.",
            ],
      ctaLabel: hc?.brands?.ditu?.ctaLabel ?? "Conoce ditu",
      href: hc?.brands?.ditu?.href ?? "/ditu",
    },
  };

  // ── Representatives desde floating-contact (solo los marcados para Home) ──
  const representatives = (floating.representatives ?? [])
    .filter((r) => r.showOnHome !== false)
    .map((r) => ({
      name: r.name,
      email: r.email,
      whatsapp: r.whatsapp,
    }));

  return (
    <HubLanding
      eyebrow={hc?.eyebrow ?? "Unidad digital #1 en Colombia"}
      heading={heading}
      contactLabel={hc?.contactLabel ?? "Contáctenos"}
      logoCaracolMedios={mediaUrl(
        hc?.logoCaracolMedios as number | Media | null | undefined,
      )}
      digitalLabel={hc?.digitalLabel ?? "DIGITAL"}
      representatives={representatives.length > 0 ? representatives : undefined}
      brands={brands}
      stats={stats}
      copyright={hc?.copyright ?? "©2026 Caracol Comercial Digital"}
    />
  );
}
