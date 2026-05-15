import { HubLanding } from "@/components/marketing";
import { formatCompact } from "@/lib/format";

/**
 * Hub principal — `/`.
 * Matching del Figma "Caracol Next.png": split landing con dos cards de marca
 * + 4 métricas globales + dos CTAs hacia /caracol-next y /ditu.
 */
export default function HomePage() {
  return (
    <HubLanding
      eyebrow="UNIDAD DIGITAL #1 EN COLOMBIA"
      heading={
        <>
          Conecta tu marca con la audiencia{" "}
          <em className="font-black not-italic">más relevante</em> del país.
        </>
      }
      contactLabel="Contáctenos"
      contactHref="/caracol-next#contacto"
      brands={{
        caracolNext: {
          title: (
            <span className="font-display text-2xl font-black tracking-tight">
              CARACOL<span className="font-light">NEXT</span>
            </span>
          ),
          description:
            "Conecta tu marca con el respaldo de nuestros portales líderes a través de contenidos que generan impacto real.",
          ctaLabel: "Conoce Caracol Next",
          href: "/caracol-next",
        },
        ditu: {
          title: (
            <span className="font-display text-3xl font-black tracking-tight lowercase">
              ditu
            </span>
          ),
          description:
            "Integra tu marca en el mejor contenido en vivo y On Demand en cualquier pantalla.",
          ctaLabel: "Conoce ditu",
          href: "/ditu",
        },
      }}
      stats={[
        {
          icon: "users",
          value: `+${formatCompact(16_000_000)}`,
          label: "usuarios",
          accent: "caracolnext",
        },
        {
          icon: "tv",
          value: `+${formatCompact(3_000_000)}`,
          label: "pantallas activas",
          accent: "ditu",
        },
        {
          icon: "zap",
          value: `+${formatCompact(127_000_000)}`,
          label: "seguidores",
          accent: "caracolnext",
        },
        { icon: "clock", value: "42Min", label: "watch time", accent: "ditu" },
      ]}
      copyright="©2026 Caracol Comercial Digital"
    />
  );
}
