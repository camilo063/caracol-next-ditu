import type { Payload } from "payload";

import {
  caracolNextFooterDemo,
  caracolNextHeaderDemo,
  dituFooterDemo,
  dituHeaderDemo,
  floatingContactDemo,
} from "@/lib/demo-data";

import { rewriteMediaRefs } from "./rewrite-media";

/**
 * Seedea los 7 globals:
 *  - hub-page  (datos hardcoded del HubLanding actual, NO viene de demo-data)
 *  - header-caracol-next, header-ditu
 *  - footer-caracol-next, footer-ditu
 *  - floating-contact
 *  - site-settings
 *
 * Idempotente: payload.updateGlobal sobreescribe siempre (no hay create para globals).
 */
export async function seedGlobals(
  payload: Payload,
  assetMap: Map<string, number>,
): Promise<void> {
  console.log("🌐 Seedeando globals...");

  // ===== Hub Page =====
  // Datos del componente HubLanding cuando estaba hardcoded en page.tsx.
  await payload.updateGlobal({
    slug: "hub-page",
    data: {
      eyebrow: "Unidad digital #1 en Colombia",
      headingSegments: [
        { text: "Conecta", weight: "extrabold" },
        { text: " tu marca con la audiencia ", weight: "semibold" },
        { text: "más relevante del país.", weight: "extrabold" },
      ],
      contactLabel: "Contáctenos",
      brands: {
        caracolNext: {
          descriptionParagraphs: [
            {
              text: "Conecta tu marca con el respaldo de nuestros portales líderes a través de contenidos que generan impacto real.",
            },
          ],
          ctaLabel: "Conoce Caracol Next",
          href: "/caracol-next",
        },
        ditu: {
          descriptionParagraphs: [
            {
              text: "Integra tu marca en el mejor contenido en vivo y On Demand en cualquier pantalla.",
            },
          ],
          ctaLabel: "Conoce ditu",
          href: "/ditu",
        },
      },
      stats: [
        {
          icon: "users",
          numericValue: 16,
          prefix: "+",
          suffix: "M",
          value: "+16M",
          label: "usuarios",
          accent: "caracolnext",
          lgWidth: 272,
        },
        {
          icon: "tv",
          numericValue: 3,
          prefix: "+",
          suffix: "M",
          value: "+3M",
          label: "pantallas activas",
          accent: "ditu",
          lgWidth: 340,
        },
        {
          icon: "zap",
          numericValue: 127,
          prefix: "+",
          suffix: "M",
          value: "+127M",
          label: "seguidores",
          accent: "caracolnext",
          lgWidth: 328,
        },
        {
          icon: "clock",
          numericValue: 42,
          prefix: "",
          suffix: "Min",
          value: "42Min",
          label: "watch time",
          accent: "ditu",
          lgWidth: 288,
        },
      ],
    },
  });
  console.log("  ✓ hub-page");

  // Helper: demo-data tiene tipos string laxos (e.g. `network: string`)
  // pero Payload exige enums estrictos en updateGlobal. Los valores son
  // compatibles en runtime — cast pragmático para evitar narrows redundantes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const asPayloadData = <T>(v: T): any => v;

  // ===== Headers =====
  await payload.updateGlobal({
    slug: "header-caracol-next",
    data: asPayloadData(rewriteMediaRefs(caracolNextHeaderDemo, assetMap)),
  });
  console.log("  ✓ header-caracol-next");

  await payload.updateGlobal({
    slug: "header-ditu",
    data: asPayloadData(rewriteMediaRefs(dituHeaderDemo, assetMap)),
  });
  console.log("  ✓ header-ditu");

  // ===== Footers =====
  await payload.updateGlobal({
    slug: "footer-caracol-next",
    data: asPayloadData(rewriteMediaRefs(caracolNextFooterDemo, assetMap)),
  });
  console.log("  ✓ footer-caracol-next");

  await payload.updateGlobal({
    slug: "footer-ditu",
    data: asPayloadData(rewriteMediaRefs(dituFooterDemo, assetMap)),
  });
  console.log("  ✓ footer-ditu");

  // ===== Floating Contact =====
  await payload.updateGlobal({
    slug: "floating-contact",
    data: asPayloadData(rewriteMediaRefs(floatingContactDemo, assetMap)),
  });
  console.log("  ✓ floating-contact");

  // ===== Site Settings =====
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      siteName: "Caracol Next + Ditu",
      defaultMetaTitle: "Caracol Next + Ditu — Mediakit",
      defaultMetaDescription:
        "Mediakit oficial Caracol Next + Ditu. Audiencia, formatos de pauta y momentos clave del ecosistema Caracol.",
      twitterHandle: "@caracolnext",
      fallbackEmail: floatingContactDemo.representatives[0]?.email ?? "",
      fallbackWhatsapp: floatingContactDemo.representatives[0]?.whatsapp ?? "",
      primaryBrand: "caracol-next",
      copyright: "©2026 Caracol Comercial Digital",
      maintenanceMode: {
        enabled: false,
        message: "Estamos trabajando en mejoras. Vuelve pronto.",
      },
    },
  });
  console.log("  ✓ site-settings");
}
