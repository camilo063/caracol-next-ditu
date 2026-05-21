import { CaracolNextWordmark, DituWordmark, HubLanding } from "@/components/marketing";

/**
 * Hub principal — `/` (Home Caracol Medios).
 * Implementación 1:1 con Figma 892:5740. Layout split:
 *  - Left: hero (eyebrow + heading + CTA Contáctenos)
 *  - Right: 2 product cards (Caracol Next + Ditu) + 4 metric cards (con
 *    CountUp animation 0→final) + 2 "Conoce X" CTAs
 *
 * Spec usuario (Camilo):
 *  - Mobile: todo apilado verticalmente, metric cards ocultas
 *  - Números animan 0 → final al entrar viewport (Framer Motion CountUp)
 */
export default function HomePage() {
  return (
    <HubLanding
      eyebrow="Unidad digital #1 en Colombia"
      heading={
        <>
          <span className="font-extrabold">Conecta</span>
          <span className="font-semibold"> tu marca con la audiencia </span>
          <span className="font-extrabold">más relevante del país.</span>
        </>
      }
      contactLabel="Contáctenos"
      contactHref="/caracol-next#contacto"
      brands={{
        caracolNext: {
          title: <CaracolNextWordmark className="h-[32px] w-[205px]" />,
          description:
            "Conecta tu marca con el respaldo de nuestros portales líderes a través de contenidos que generan impacto real.",
          ctaLabel: "Conoce Caracol Next",
          href: "/caracol-next",
        },
        ditu: {
          title: <DituWordmark className="!h-[32px] !w-[92px]" />,
          description:
            "Integra tu marca en el mejor contenido en vivo y On Demand en cualquier pantalla.",
          ctaLabel: "Conoce ditu",
          href: "/ditu",
        },
      }}
      stats={[
        {
          icon: "users",
          numericValue: 16,
          prefix: "+",
          suffix: "M",
          value: "+16M",
          label: "usuarios",
          accent: "caracolnext",
        },
        {
          icon: "tv",
          numericValue: 3,
          prefix: "+",
          suffix: "M",
          value: "+3M",
          label: "pantallas activas",
          accent: "ditu",
        },
        {
          icon: "zap",
          numericValue: 127,
          prefix: "+",
          suffix: "M",
          value: "+127M",
          label: "seguidores",
          accent: "caracolnext",
        },
        {
          icon: "clock",
          numericValue: 42,
          suffix: "Min",
          value: "42Min",
          label: "watch time",
          accent: "ditu",
        },
      ]}
      copyright="©2026 Caracol Comercial Digital"
    />
  );
}
