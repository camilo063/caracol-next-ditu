/**
 * Seed idempotente — Sprint A + B + C1
 *
 * Pobla Payload con el contenido actual del front (demo-data) como punto de partida.
 * Corre sin mutar src/.
 * C1: añade assets de Ditu (piloto 2 bloques) y Page slug="ditu".
 *
 * Uso: npx tsx --env-file=.env scripts/seed.ts
 *      (o: npx tsx --env-file=.env.local scripts/seed.ts si los vars están ahí)
 *
 * Idempotente: correrlo 2 veces no duplica nada.
 *   - Media: busca por alt antes de crear.
 *   - Page:  busca por slug; update si existe, create si no.
 *   - Globals: updateGlobal siempre (son singletons).
 */

// --- Carga de variables de entorno (Node 20.12+ built-in) ----------------
try {
  process.loadEnvFile(".env.local");
} catch {}
try {
  process.loadEnvFile(".env");
} catch {}

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import configPromise from "@payload-config";
import { getPayload } from "payload";

import { BRAND_META } from "@/lib/brand";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

interface UploadedMedia {
  id: number;
  url?: string | null;
}

/**
 * Idempotente por `alt`: Payload convierte PNG→WebP y añade sufijo numérico
 * (-1, -2...) al filename cuando hay colisión, por lo que no podemos usar
 * `filename` como clave estable. Usamos `alt` que nosotros controlamos.
 */
async function uploadIfNeeded(
  payload: Awaited<ReturnType<typeof getPayload>>,
  filePath: string,
  alt: string,
): Promise<{ id: number; reused: boolean } | null> {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const existing = await payload.find({
    collection: "media",
    where: { alt: { equals: alt } },
    limit: 1,
    depth: 0,
    sort: "id",
  });
  if (existing.docs[0]) {
    return { id: existing.docs[0].id as number, reused: true };
  }

  const filename = path.basename(filePath);
  const data = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const mimetypeMap: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
  };
  const mimetype = mimetypeMap[ext] ?? "image/png";

  try {
    const doc = (await payload.create({
      collection: "media",
      data: { alt },
      file: { data, name: filename, mimetype, size: data.length },
    })) as UploadedMedia;
    return { id: doc.id, reused: false };
  } catch (err) {
    console.warn(`  ⚠️  No se pudo subir ${filename}:`, (err as Error).message);
    return null;
  }
}

/**
 * Elimina registros duplicados en Media para cada alt dado.
 * Conserva el de menor id, borra los demás. Retorna el nº de eliminados.
 */
async function dedupMediaByAlt(
  payload: Awaited<ReturnType<typeof getPayload>>,
  alts: string[],
): Promise<number> {
  let deleted = 0;
  for (const alt of alts) {
    const result = await payload.find({
      collection: "media",
      where: { alt: { equals: alt } },
      sort: "id",
      limit: 50,
      depth: 0,
    });
    const dupes = result.docs.slice(1);
    for (const doc of dupes) {
      await payload.delete({ collection: "media", id: doc.id as number });
      console.log(
        `  🗑️  Media #${doc.id} (${(doc as { filename?: string }).filename}) duplicado → eliminado`,
      );
      deleted++;
    }
  }
  return deleted;
}

// --------------------------------------------------------------------------
// Tipos de informe
// --------------------------------------------------------------------------
interface SeedReport {
  missingAssets: string[];
  uploadedAssets: string[];
  reusedAssets: string[];
  deletedDuplicates: number;
}

// --------------------------------------------------------------------------
// PASO 1 — Brand icons del Hero
// --------------------------------------------------------------------------
async function uploadBrandIcons(
  payload: Awaited<ReturnType<typeof getPayload>>,
  report: SeedReport,
): Promise<Record<string, number>> {
  console.log("\n📦 Brand icons del Hero...");
  const iconDir = path.join(PUBLIC, "caracol-next/brands");
  const icons: Array<{ file: string; alt: string; key: string }> = [
    { file: "caracoltv.png", alt: "Caracol TV", key: "caracoltv" },
    { file: "noticias-caracol.png", alt: "Noticias Caracol", key: "noticias-caracol" },
    { file: "caracol-sports.png", alt: "Caracol Sports", key: "caracol-sports" },
    { file: "blu-radio.png", alt: "Blu Radio", key: "blu-radio" },
    { file: "gol-caracol.png", alt: "Gol Caracol", key: "gol-caracol" },
    { file: "volk.png", alt: "Volk", key: "volk" },
    { file: "bumbox.png", alt: "BumBox", key: "bumbox" },
    { file: "la-kalle.png", alt: "La Kalle", key: "la-kalle" },
  ];

  // Dedup: elimina duplicados antes de verificar existencia
  const alts = icons.map((i) => i.alt);
  const deleted = await dedupMediaByAlt(payload, alts);
  report.deletedDuplicates += deleted;

  const map: Record<string, number> = {};
  for (const icon of icons) {
    const filePath = path.join(iconDir, icon.file);
    const result = await uploadIfNeeded(payload, filePath, icon.alt);
    if (result !== null) {
      map[icon.key] = result.id;
      if (result.reused) {
        report.reusedAssets.push(icon.file);
        console.log(`  ↩  ${icon.file} → Media #${result.id} (reutilizado)`);
      } else {
        report.uploadedAssets.push(icon.file);
        console.log(`  ✓  ${icon.file} → Media #${result.id} (creado)`);
      }
    } else {
      report.missingAssets.push(
        `Hero brandIcon: /public/caracol-next/brands/${icon.file}`,
      );
      console.log(`  ✗ ${icon.file} — archivo no encontrado (quedará null)`);
    }
  }
  return map;
}

// --------------------------------------------------------------------------
// PASO 1.5 — Upsert colección Brands (marcas editables)
// Crea/actualiza las 10 marcas desde BRAND_META y devuelve un mapa slug→id
// para que los bloques las referencien vía relationship.
// --------------------------------------------------------------------------
async function seedBrands(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<Record<string, number>> {
  console.log("\n🏷️  Upserting Brands...");
  const map: Record<string, number> = {};
  for (const [slug, meta] of Object.entries(BRAND_META)) {
    const data = {
      name: meta.label,
      slug,
      color: meta.color,
      colorDark: meta.colorDark ?? null,
      colorAccent: meta.colorAccent ?? null,
      chartPeak: meta.chartPeak ?? null,
    };
    const existing = await payload.find({
      collection: "brands",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs[0]) {
      await payload.update({ collection: "brands", id: existing.docs[0].id, data });
      map[slug] = existing.docs[0].id as number;
      console.log(`  ↩  ${slug} → Brand #${map[slug]} (actualizado)`);
    } else {
      const created = await payload.create({ collection: "brands", data });
      map[slug] = created.id as number;
      console.log(`  ✓  ${slug} → Brand #${map[slug]} (creado)`);
    }
  }
  return map;
}

// --------------------------------------------------------------------------
// PASO 2 — Construir layout saneado (sin as unknown as never)
// --------------------------------------------------------------------------
function buildCaracolNextLayout(
  iconIds: Record<string, number>,
  brandIds: Record<string, number>,
) {
  return [
    // ── HERO ─────────────────────────────────────────────────────────────
    {
      blockType: "hero" as const,
      anchorId: "inicio",
      eyebrow: "Donde el contenido conecta",
      heading: "Nuestro ecosistema digital al",
      headingBold: "servicio de tu marca.",
      subheading: "Vamos más allá de la pauta tradicional.",
      keyStats: [],
      brandIcons: [
        { brand: brandIds["caracoltv"]!, icon: iconIds["caracoltv"] ?? null },
        { brand: brandIds["caracoltv"]!, icon: iconIds["noticias-caracol"] ?? null },
        { brand: brandIds["caracolsports"]!, icon: iconIds["caracol-sports"] ?? null },
        { brand: brandIds["bluradio"]!, icon: iconIds["blu-radio"] ?? null },
        { brand: brandIds["golcaracol"]!, icon: iconIds["gol-caracol"] ?? null },
        { brand: brandIds["volk"]!, icon: iconIds["volk"] ?? null },
        { brand: brandIds["bumbox"]!, icon: iconIds["bumbox"] ?? null },
        { brand: brandIds["lakalle"]!, icon: iconIds["la-kalle"] ?? null },
      ],
      backgroundImage: null,
      backgroundVideo: null,
      primaryCta: {
        label: "",
        href: "",
        variant: "default" as const,
        openInNewTab: false,
      },
      secondaryCta: {
        label: "",
        href: "",
        variant: "outline" as const,
        openInNewTab: false,
      },
      tone: "caracolnext-deep" as const,
      blockName: "Hero Caracol Next",
    },

    // ── AUDIENCIA + REDES ─────────────────────────────────────────────────
    {
      blockType: "audience-networks" as const,
      anchorId: "audiencia",
      eyebrow: "El ecosistema",
      heading: "Nuestro Alcance",
      description: null,
      audience: {
        reach: 16943700,
        reachLabel: "Usuarios mensuales",
        reachSuffix: null,
        source: "Fuente: Comscore Feb 2026",
        breakdown: [
          { label: "LIDERAZGO | Unidad digital Colombia", value: 1, suffix: "" },
          {
            label: "ALCANCE COLOMBIA | 3 de cada 10 colombianos",
            value: 30.2,
            suffix: "%",
          },
          { label: "TIEMPO | Minutos", value: 248000000, suffix: "" },
          { label: "CONTENIDO | Vistas/mes", value: 84100000, suffix: "" },
        ],
      },
      networksSection: {
        heading: "Líderes en redes",
        totalSuffix: "de seguidores",
        itemLabel: "Seguidores",
        source: "Fuente: Abril 6 2026",
      },
      networks: [
        {
          network: "facebook" as const,
          handle: "Caracol Next",
          followers: 30500000,
          growth: 0,
          url: null,
        },
        {
          network: "tiktok" as const,
          handle: "@caracolnext",
          followers: 18400000,
          growth: 0,
          url: null,
        },
        {
          network: "x" as const,
          handle: "@caracolnext",
          followers: 14900000,
          growth: 0,
          url: null,
        },
        {
          network: "youtube" as const,
          handle: "Caracol Next",
          followers: 30500000,
          growth: 0,
          url: null,
        },
        {
          network: "instagram" as const,
          handle: "@caracolnext",
          followers: 22300000,
          growth: 0,
          url: null,
        },
        {
          network: "whatsapp" as const,
          handle: "@caracolnext",
          followers: 11100000,
          growth: 0,
          url: null,
        },
      ],
      highlightedNetwork: null,
      blockName: null,
    },

    // ── BRAND TABS ────────────────────────────────────────────────────────
    {
      blockType: "brand-tabs" as const,
      anchorId: "marcas",
      eyebrow: "El ecosistema Caracol",
      heading: "Una marca para|cada audiencia",
      description: null,
      tabs: [
        {
          brand: brandIds["caracoltv"]!,
          displayName: null,
          brandLogo: null,
          brandColor: "#015BC4",
          tagline: "Referente de entretenimiento y contenido original para todo el país.",
          whyChoose: null,
          webMetrics: {
            usersPerMonth: 3076977,
            usersLabel: "Usuarios/mes",
            viewsPerMonth: 11803973,
            viewsLabel: "Vistas/mes",
          },
          audience: {
            reach: 3076977,
            reachLabel: "Usuarios/mes",
            reachSuffix: null,
            highlights: [],
            genderSplit: {
              femalePercent: 77,
              femaleLabel: "Mujeres",
              maleLabel: "Hombres",
            },
            agePicks: [
              { range: "18-24", value: 30, isPeak: false },
              { range: "25-34", value: 47, isPeak: false },
              { range: "35-44", value: 60, isPeak: false },
              { range: "45-54", value: 30, isPeak: false },
              { range: "55-64", value: 100, isPeak: true },
              { range: "+65", value: 43, isPeak: false },
            ],
            peakAgeRange: "Pico: 55-64 años",
          },
          networks: [
            {
              network: "facebook" as const,
              handle: null,
              followers: 17821911,
              url: "https://www.facebook.com/CaracolTV",
            },
            {
              network: "instagram" as const,
              handle: null,
              followers: 3543872,
              url: "https://www.instagram.com/caracoltv",
            },
            {
              network: "tiktok" as const,
              handle: null,
              followers: 3894409,
              url: "https://www.tiktok.com/@caracoltv",
            },
            {
              network: "youtube" as const,
              handle: null,
              followers: 8942899,
              url: "https://www.youtube.com/@CaracolTV",
            },
            {
              network: "x" as const,
              handle: null,
              followers: 5000000,
              url: "https://x.com/CaracolTV",
            },
            { network: "whatsapp" as const, handle: null, followers: 381028, url: null },
          ],
          adFormats: [],
          ctaContact: {
            label: "Conoce más",
            href: "#contacto",
            variant: "default" as const,
            openInNewTab: false,
          },
        },
        {
          brand: brandIds["golcaracol"]!,
          displayName: null,
          brandLogo: null,
          brandColor: "#00C853",
          tagline:
            "La casa del fútbol colombiano — pasión, transmisión y análisis exclusivo.",
          whyChoose: null,
          webMetrics: {
            usersPerMonth: 2400000,
            usersLabel: "Usuarios/mes",
            viewsPerMonth: 8600000,
            viewsLabel: "Vistas/mes",
          },
          audience: {
            reach: 3173667,
            reachLabel: "Aficionados",
            reachSuffix: null,
            highlights: [],
            genderSplit: {
              femalePercent: 28,
              femaleLabel: "Mujeres",
              maleLabel: "Hombres",
            },
            agePicks: [
              { range: "18-24", value: 60, isPeak: false },
              { range: "25-34", value: 100, isPeak: true },
              { range: "35-44", value: 78, isPeak: false },
              { range: "45-54", value: 50, isPeak: false },
              { range: "55-64", value: 30, isPeak: false },
              { range: "+65", value: 20, isPeak: false },
            ],
            peakAgeRange: "Pico: 25-34 años",
          },
          networks: [
            { network: "facebook" as const, handle: null, followers: 6200000, url: null },
            {
              network: "instagram" as const,
              handle: null,
              followers: 2300000,
              url: null,
            },
            { network: "tiktok" as const, handle: null, followers: 3200000, url: null },
            { network: "youtube" as const, handle: null, followers: 1800000, url: null },
          ],
          adFormats: [],
          ctaContact: {
            label: "Conoce más",
            href: "#contacto",
            variant: "default" as const,
            openInNewTab: false,
          },
        },
        {
          brand: brandIds["caracolsports"]!,
          displayName: null,
          brandLogo: null,
          brandColor: "#FF6F00",
          tagline:
            "Cobertura deportiva multipantalla — fútbol internacional, ciclismo y atletismo.",
          whyChoose: null,
          webMetrics: {
            usersPerMonth: 1300000,
            usersLabel: "Usuarios/mes",
            viewsPerMonth: 4900000,
            viewsLabel: "Vistas/mes",
          },
          audience: {
            reach: 2067121,
            reachLabel: "Fans deportes",
            reachSuffix: null,
            highlights: [],
            genderSplit: {
              femalePercent: 16,
              femaleLabel: "Mujeres",
              maleLabel: "Hombres",
            },
            agePicks: [
              { range: "18-24", value: 45, isPeak: false },
              { range: "25-34", value: 90, isPeak: false },
              { range: "35-44", value: 100, isPeak: true },
              { range: "45-54", value: 55, isPeak: false },
              { range: "55-64", value: 28, isPeak: false },
              { range: "+65", value: 15, isPeak: false },
            ],
            peakAgeRange: "Pico: 35-44 años",
          },
          networks: [
            { network: "instagram" as const, handle: null, followers: 980000, url: null },
            { network: "tiktok" as const, handle: null, followers: 720000, url: null },
            { network: "youtube" as const, handle: null, followers: 1100000, url: null },
            { network: "x" as const, handle: null, followers: 450000, url: null },
          ],
          adFormats: [],
          ctaContact: {
            label: "Conoce más",
            href: "#contacto",
            variant: "default" as const,
            openInNewTab: false,
          },
        },
        {
          brand: brandIds["bluradio"]!,
          displayName: null,
          brandLogo: null,
          brandColor: "#1976D2",
          tagline:
            "Radio + digital — actualidad, opinión y análisis para la audiencia más informada.",
          whyChoose: null,
          webMetrics: {
            usersPerMonth: 1800000,
            usersLabel: "Usuarios/mes",
            viewsPerMonth: 5400000,
            viewsLabel: "Vistas/mes",
          },
          audience: {
            reach: 6705515,
            reachLabel: "Oyentes",
            reachSuffix: null,
            highlights: [],
            genderSplit: {
              femalePercent: 65,
              femaleLabel: "Mujeres",
              maleLabel: "Hombres",
            },
            agePicks: [
              { range: "18-24", value: 18, isPeak: false },
              { range: "25-34", value: 35, isPeak: false },
              { range: "35-44", value: 65, isPeak: false },
              { range: "45-54", value: 100, isPeak: true },
              { range: "55-64", value: 88, isPeak: false },
              { range: "+65", value: 55, isPeak: false },
            ],
            peakAgeRange: "Pico: 45-54 años",
          },
          networks: [
            { network: "facebook" as const, handle: null, followers: 2400000, url: null },
            {
              network: "instagram" as const,
              handle: null,
              followers: 1100000,
              url: null,
            },
            { network: "x" as const, handle: null, followers: 920000, url: null },
            { network: "youtube" as const, handle: null, followers: 480000, url: null },
          ],
          adFormats: [],
          ctaContact: {
            label: "Conoce más",
            href: "#contacto",
            variant: "default" as const,
            openInNewTab: false,
          },
        },
        {
          brand: brandIds["lakalle"]!,
          displayName: null,
          brandLogo: null,
          brandColor: "#FF1744",
          tagline: "Música urbana y entretenimiento juvenil 24/7.",
          whyChoose: null,
          webMetrics: {
            usersPerMonth: 1100000,
            usersLabel: "Usuarios/mes",
            viewsPerMonth: 3800000,
            viewsLabel: "Vistas/mes",
          },
          audience: {
            reach: 2057540,
            reachLabel: "Oyentes urbanos",
            reachSuffix: null,
            highlights: [],
            genderSplit: {
              femalePercent: 71,
              femaleLabel: "Mujeres",
              maleLabel: "Hombres",
            },
            agePicks: [
              { range: "18-24", value: 100, isPeak: true },
              { range: "25-34", value: 82, isPeak: false },
              { range: "35-44", value: 40, isPeak: false },
              { range: "45-54", value: 22, isPeak: false },
              { range: "55-64", value: 12, isPeak: false },
              { range: "+65", value: 8, isPeak: false },
            ],
            peakAgeRange: "Pico: 18-24 años",
          },
          networks: [
            {
              network: "instagram" as const,
              handle: null,
              followers: 1800000,
              url: null,
            },
            { network: "tiktok" as const, handle: null, followers: 2700000, url: null },
            { network: "youtube" as const, handle: null, followers: 950000, url: null },
          ],
          adFormats: [],
          ctaContact: {
            label: "Conoce más",
            href: "#contacto",
            variant: "default" as const,
            openInNewTab: false,
          },
        },
        {
          brand: brandIds["bumbox"]!,
          displayName: null,
          brandLogo: null,
          brandColor: "#FFC200",
          tagline:
            "Marketplace y comercio digital — audiencia transaccional con alta intención.",
          whyChoose: null,
          webMetrics: {
            usersPerMonth: 520000,
            usersLabel: "Usuarios/mes",
            viewsPerMonth: 1900000,
            viewsLabel: "Vistas/mes",
          },
          audience: {
            reach: 800000,
            reachLabel: "Audiencia comercio",
            reachSuffix: null,
            highlights: [],
            genderSplit: {
              femalePercent: 77,
              femaleLabel: "Mujeres",
              maleLabel: "Hombres",
            },
            agePicks: [
              { range: "18-24", value: 30, isPeak: false },
              { range: "25-34", value: 75, isPeak: false },
              { range: "35-44", value: 100, isPeak: true },
              { range: "45-54", value: 68, isPeak: false },
              { range: "55-64", value: 35, isPeak: false },
              { range: "+65", value: 12, isPeak: false },
            ],
            peakAgeRange: "Pico: 35-44 años",
          },
          networks: [
            { network: "instagram" as const, handle: null, followers: 380000, url: null },
            { network: "facebook" as const, handle: null, followers: 240000, url: null },
            { network: "tiktok" as const, handle: null, followers: 110000, url: null },
          ],
          adFormats: [],
          ctaContact: {
            label: "Conoce más",
            href: "#contacto",
            variant: "default" as const,
            openInNewTab: false,
          },
        },
        {
          brand: brandIds["volk"]!,
          displayName: null,
          brandLogo: null,
          brandColor: "#00B8D4",
          tagline: "Lifestyle, cultura pop y contenido nicho para audiencia urbana.",
          whyChoose: null,
          webMetrics: {
            usersPerMonth: 380000,
            usersLabel: "Usuarios/mes",
            viewsPerMonth: 1200000,
            viewsLabel: "Vistas/mes",
          },
          audience: {
            reach: 600000,
            reachLabel: "Audiencia",
            reachSuffix: null,
            highlights: [],
            genderSplit: {
              femalePercent: 77,
              femaleLabel: "Mujeres",
              maleLabel: "Hombres",
            },
            agePicks: [
              { range: "18-24", value: 85, isPeak: false },
              { range: "25-34", value: 100, isPeak: true },
              { range: "35-44", value: 60, isPeak: false },
              { range: "45-54", value: 28, isPeak: false },
              { range: "55-64", value: 12, isPeak: false },
              { range: "+65", value: 6, isPeak: false },
            ],
            peakAgeRange: "Pico: 25-34 años",
          },
          networks: [
            { network: "instagram" as const, handle: null, followers: 280000, url: null },
            { network: "tiktok" as const, handle: null, followers: 410000, url: null },
            { network: "youtube" as const, handle: null, followers: 95000, url: null },
          ],
          adFormats: [],
          ctaContact: {
            label: "Conoce más",
            href: "#contacto",
            variant: "default" as const,
            openInNewTab: false,
          },
        },
      ],
      defaultTab: 0,
      blockName: null,
    },

    // ── CALENDARIO ────────────────────────────────────────────────────────
    {
      blockType: "key-moments" as const,
      anchorId: "momentos",
      eyebrow: null,
      heading: "Calendario",
      description: "Los grandes momentos del año, una oportunidad para tu marca.",
      events: [
        {
          name: "Año Nuevo",
          dateStart: "2026-01-01",
          dateEnd: null,
          dateLabelOverride: "ENE",
          description: "Apertura del año, balances",
          image: null,
          importance: "high" as const,
          category: "special" as const,
          badgeColor: "#2862FF",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
        {
          name: "Carnaval de Barranquilla",
          dateStart: "2026-03-13",
          dateEnd: "2026-03-17",
          dateLabelOverride: "DEL 13 AL 17 DE MARZO",
          description: "Celebraciones",
          image: null,
          importance: "critical" as const,
          category: "entertainment" as const,
          badgeColor: "#0000C4",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
        {
          name: "Semana Santa",
          dateStart: "2026-03-29",
          dateEnd: null,
          dateLabelOverride: "MARZO",
          description: "Turismo y familia",
          image: null,
          importance: "high" as const,
          category: "special" as const,
          badgeColor: "#FFC200",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
        {
          name: "Día del niño",
          dateStart: "2026-04-26",
          dateEnd: null,
          dateLabelOverride: "ABR",
          description: "Audiencia familiar",
          image: null,
          importance: "medium" as const,
          category: "entertainment" as const,
          badgeColor: "#A139C6",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
        {
          name: "FilBo 2026",
          dateStart: "2026-04-29",
          dateEnd: "2026-05-04",
          dateLabelOverride: "DEL 06 DE MARZO AL 04 DE MAYO",
          description: "Libros e historias",
          image: null,
          importance: "medium" as const,
          category: "special" as const,
          badgeColor: "#FF0013",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
        {
          name: "Mundial / Eurocopa",
          dateStart: "2026-06-11",
          dateEnd: "2026-07-19",
          dateLabelOverride: "JUN",
          description: "Picos deportivos",
          image: null,
          importance: "critical" as const,
          category: "sports" as const,
          badgeColor: "#05E8FD",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
        {
          name: "Halloween",
          dateStart: "2026-10-31",
          dateEnd: null,
          dateLabelOverride: "OCT",
          description: "Entretenimiento y consumo",
          image: null,
          importance: "medium" as const,
          category: "entertainment" as const,
          badgeColor: "#2862FF",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
        {
          name: "Día de la independencia",
          dateStart: "2026-07-20",
          dateEnd: null,
          dateLabelOverride: "20-JUL",
          description: "Conversaciones",
          image: null,
          importance: "high" as const,
          category: "news" as const,
          badgeColor: "#FFC200",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
        {
          name: "Black Fridays",
          dateStart: "2026-11-27",
          dateEnd: null,
          dateLabelOverride: "NOV",
          description: "Comercio digital",
          image: null,
          importance: "high" as const,
          category: "special" as const,
          badgeColor: "#2862FF",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
        {
          name: "Vuelta a clases",
          dateStart: "2026-08-15",
          dateEnd: null,
          dateLabelOverride: "AGO",
          description: "Educación y economía familiar",
          image: null,
          importance: "medium" as const,
          category: "news" as const,
          badgeColor: "#2862FF",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
        {
          name: "Amor y amistad",
          dateStart: "2026-09-19",
          dateEnd: null,
          dateLabelOverride: "SEP",
          description: "Pico de gifting",
          image: null,
          importance: "medium" as const,
          category: "entertainment" as const,
          badgeColor: "#0000C4",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
        {
          name: "Año nuevo",
          dateStart: "2026-12-31",
          dateEnd: "2027-01-01",
          dateLabelOverride: "ENE - 2027",
          description: "Nuevos comienzos y balances",
          image: null,
          importance: "high" as const,
          category: "special" as const,
          badgeColor: "#2862FF",
          categoryLabel: "CATEGORÍA",
          cta: { label: "", href: "" },
        },
      ],
      displayMode: "grid" as const,
      ctaText: {
        heading:
          "¡Asegura la presencia de tu marca en los eventos más importantes del país!",
        description: "Contáctanos ahora y diseñemos juntos tu participación.",
        label: "Contáctenos",
        href: "#contacto",
      },
      blockName: null,
    },

    // ── BRANDED CONTENT ───────────────────────────────────────────────────
    {
      blockType: "branded-content" as const,
      anchorId: "branded",
      eyebrow: null,
      heading: "",
      description: null,
      categories: [
        {
          key: "branded-content",
          label: "Branded Content",
          heading: "Branded Content",
          description:
            "Elevamos tu marca a través de formatos de contenido integrados en nuestro ecosistema líder. Logramos una presencia orgánica y potente que asegura la atención de la audiencia, generando credibilidad y resultados medibles que trascienden la publicidad convencional.",
          multimedia: {
            type: "youtube" as const,
            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            image: null,
            video: null,
            captionTag: "Video Podcast",
            titleOverlay: "Reel 2025 Caracol Next",
            logoTopLeft: null,
            logoTopRight: null,
          },
          secondaryTabs: [],
        },
        {
          key: "video-podcast",
          label: "Video Podcast",
          heading: "Video|Podcast",
          description:
            "Domina el formato con mayor retención del entorno digital. Ofrecemos dos soluciones estratégicas: el desarrollo de producciones exclusivas alineadas al ADN de tu marca, o la integración orgánica en nuestros espacios ya posicionados para aprovechar su influencia y alcance.",
          multimedia: {
            type: "youtube" as const,
            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            image: null,
            video: null,
            captionTag: "Video Podcast",
            titleOverlay: "Eduardo Lora — Host: Lina Martínez",
            logoTopLeft: null,
            logoTopRight: null,
          },
          secondaryTabs: [
            {
              label: "Realities",
              multimedia: {
                type: "youtube" as const,
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                image: null,
                video: null,
                captionTag: "Reality",
                titleOverlay: "Reality Show",
                logoTopLeft: null,
                logoTopRight: null,
              },
            },
            {
              label: "Series Web",
              multimedia: {
                type: "youtube" as const,
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                image: null,
                video: null,
                captionTag: "Series Web",
                titleOverlay: "Series exclusivas",
                logoTopLeft: null,
                logoTopRight: null,
              },
            },
            {
              label: "Talk Shows",
              multimedia: {
                type: "youtube" as const,
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                image: null,
                video: null,
                captionTag: "Talk Show",
                titleOverlay: "Eduardo Lora",
                logoTopLeft: null,
                logoTopRight: null,
              },
            },
            {
              label: "Lives",
              multimedia: {
                type: "youtube" as const,
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                image: null,
                video: null,
                captionTag: "Live",
                titleOverlay: "Lives Caracol Next",
                logoTopLeft: null,
                logoTopRight: null,
              },
            },
            {
              label: "Documental",
              multimedia: {
                type: "youtube" as const,
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                image: null,
                video: null,
                captionTag: "Documental",
                titleOverlay: "Documental Caracol",
                logoTopLeft: null,
                logoTopRight: null,
              },
            },
          ],
        },
        {
          key: "produccion-comercial",
          label: "Producción Comercial",
          heading: "Producción Comercial",
          description:
            "Producciones de alto valor para tu campaña con la infraestructura técnica y creativa de Caracol Medios. Desde spot tradicional hasta producciones largas.",
          multimedia: {
            type: "youtube" as const,
            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            image: null,
            video: null,
            captionTag: "Comercial",
            titleOverlay: "Producción Comercial",
            logoTopLeft: null,
            logoTopRight: null,
          },
          secondaryTabs: [],
        },
        {
          key: "contenido-editorial",
          label: "Contenido Editorial",
          heading: "Contenido Editorial",
          description:
            "Potenciamos tu marca a través del criterio y el reconocimiento de nuestros periodistas. Ya sea mediante la creación de contenidos especializados o el cubrimiento estratégico de tus eventos, ofrecemos el respaldo informativo y la credibilidad necesarios para conectar de forma auténtica con la audiencia.",
          multimedia: {
            type: "youtube" as const,
            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            image: null,
            video: null,
            captionTag: "Editorial",
            titleOverlay: "Contenido Editorial",
            logoTopLeft: null,
            logoTopRight: null,
          },
          secondaryTabs: [],
        },
      ],
      defaultIndex: 0,
      blockName: null,
    },

    // ── PAUTA DIGITAL ─────────────────────────────────────────────────────
    {
      blockType: "ad-formats" as const,
      anchorId: "pauta",
      eyebrow: null,
      heading: "Pauta Digital",
      description:
        "Llega a millones de colombianos con los formatos publicitarios del ecosistema digital más grande del país.",
      formats: [
        {
          name: "Display tradicional y toma",
          brand: null,
          category: "display" as const,
          image: null,
          specs: null,
          downloadUrl: null,
          modal: {
            title: "Display tradicional y tomas",
            description:
              "Formato display estándar — banners IAB en posiciones top y middle del sitio. Alta visibilidad con tomas full screen.",
            ctaLabel: "Contáctanos",
            ctaHref: "#contacto",
            childTabs: [
              {
                label: "Top Banner",
                image: null,
                description: "Banner superior visible al cargar la página.",
              },
              {
                label: "Toma Full Screen",
                image: null,
                description: "Toma full screen previo al contenido.",
              },
            ],
          },
        },
        {
          name: "Interestitial",
          brand: null,
          category: "display" as const,
          image: null,
          specs: null,
          downloadUrl: null,
          modal: {
            title: "Interestitial",
            description:
              "Anuncio de pantalla completa que aparece entre navegación de páginas.",
            ctaLabel: "Contáctanos",
            ctaHref: "#contacto",
            childTabs: [],
          },
        },
        {
          name: "Sticky",
          brand: null,
          category: "display" as const,
          image: null,
          specs: null,
          downloadUrl: null,
          modal: {
            title: "Sticky",
            description:
              "Banner adhesivo que permanece visible al hacer scroll. Alta atención sostenida.",
            ctaLabel: "Contáctanos",
            ctaHref: "#contacto",
            childTabs: [],
          },
        },
        {
          name: "Overlay",
          brand: null,
          category: "display" as const,
          image: null,
          specs: null,
          downloadUrl: null,
          modal: {
            title: "Overlay",
            description:
              "Capa flotante sobre el contenido — alto impacto visual con interacción opcional.",
            ctaLabel: "Contáctanos",
            ctaHref: "#contacto",
            childTabs: [],
          },
        },
        {
          name: "Banner Slider",
          brand: null,
          category: "display" as const,
          image: null,
          specs: null,
          downloadUrl: null,
          modal: {
            title: "Banners de Alto Impacto",
            description:
              "Formatos interactivos de diseñados para integrar múltiples piezas o imágenes en un único espacio creativo de gran visibilidad.\n\nEsta solución estratégica permite que el usuario interactúe directamente para descubrir información detallada, transformando la pauta en una experiencia de marca.",
            ctaLabel: "Contáctanos",
            ctaHref: "#contacto",
            childTabs: [
              {
                label: "Banner Slider",
                image: null,
                description:
                  "Carrusel de banners de alto impacto — varias piezas en un solo espacio creativo.",
              },
              {
                label: "Banner Multigalería",
                image: null,
                description:
                  "Galería multi-banner que el usuario explora con interacción táctil.",
              },
              {
                label: "Expandible Roll Over",
                image: null,
                description:
                  "Banner que se expande al hover, revelando contenido extendido sin salir de la página.",
              },
              {
                label: "Banner Hover Reveal",
                image: null,
                description:
                  "Banner con capa oculta que se revela en hover — efecto sorpresa de alto recall.",
              },
            ],
          },
        },
        {
          name: "Espacio en RRSS",
          brand: null,
          category: "branded" as const,
          image: null,
          specs: null,
          downloadUrl: null,
          modal: {
            title: "Espacio en Redes Sociales",
            description:
              "Pauta integrada en las redes oficiales del ecosistema Caracol — Facebook, Instagram, TikTok, X, YouTube.",
            ctaLabel: "Contáctanos",
            ctaHref: "#contacto",
            childTabs: [],
          },
        },
        {
          name: "Video Banner",
          brand: null,
          category: "video" as const,
          image: null,
          specs: null,
          downloadUrl: null,
          modal: {
            title: "Video Banner",
            description:
              "Banner con video auto-play silencioso. Alta retención visual sin invadir la experiencia.",
            ctaLabel: "Contáctanos",
            ctaHref: "#contacto",
            childTabs: [],
          },
        },
        {
          name: "Pre-Roll Video",
          brand: null,
          category: "video" as const,
          image: null,
          specs: null,
          downloadUrl: null,
          modal: {
            title: "Pre-Roll Video",
            description:
              "Anuncio de 15s al inicio de cada video del ecosistema. Atención garantizada.",
            ctaLabel: "Contáctanos",
            ctaHref: "#contacto",
            childTabs: [],
          },
        },
        {
          name: "DAI Corte Comercial",
          brand: null,
          category: "video" as const,
          image: null,
          specs: null,
          downloadUrl: null,
          modal: {
            title: "DAI — Corte Comercial",
            description:
              "Dynamic Ad Insertion en cortes comerciales del contenido en vivo y on-demand.",
            ctaLabel: "Contáctanos",
            ctaHref: "#contacto",
            childTabs: [],
          },
        },
        {
          name: "PreRoll y MidRoll Audio",
          brand: null,
          category: "audio" as const,
          image: null,
          specs: null,
          downloadUrl: null,
          modal: {
            title: "PreRoll y MidRoll Audio",
            description:
              "Cuñas pre-roll (antes del contenido) y mid-roll (durante el contenido) en streaming de audio.",
            ctaLabel: "Contáctanos",
            ctaHref: "#contacto",
            childTabs: [],
          },
        },
      ],
      displayMode: "grid" as const,
      filtersEnabled: false,
      footerCta: {
        heading:
          "¡Asegura la presencia de tu marca en los eventos más importantes del país!",
        description: "Contáctanos ahora y diseñemos juntos tu participación.",
        label: "Descargar Especificaciones",
        href: "#contacto",
      },
      blockName: null,
    },

    // ── CONTACTO ──────────────────────────────────────────────────────────
    {
      blockType: "contact" as const,
      anchorId: "contacto",
      eyebrow: null,
      heading: "Con nosotros, lleva tu marca",
      headingEmphasis: "al siguiente nivel.",
      description:
        "Cuéntanos tus objetivos y armemos juntos la mejor estrategia para conectar tu marca con millones de colombianos.",
      form: null,
      representatives: [],
      ctaButton: {
        label: "Contáctenos",
        href: "#contacto",
        variant: "default" as const,
        openInNewTab: false,
      },
      layout: "cta-simple" as const,
      blockName: null,
    },
  ];
}

// --------------------------------------------------------------------------
// PASO 3 — Upsert Page
// --------------------------------------------------------------------------
async function upsertCaracolNextPage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  iconIds: Record<string, number>,
  brandIds: Record<string, number>,
) {
  console.log("\n📄 Upserting Page slug='caracol-next'...");
  const layout = buildCaracolNextLayout(iconIds, brandIds);

  const existing = await payload.find({
    collection: "pages",
    where: { slug: { equals: "caracol-next" } },
    limit: 1,
    depth: 0,
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "pages",
      id: existing.docs[0].id,
      data: {
        title: "Caracol Next",
        landing: "caracol-next",
        slug: "caracol-next",
        layout,
      },
    });
    console.log(`  ✓ Page actualizada (id=${existing.docs[0].id})`);
  } else {
    const created = await payload.create({
      collection: "pages",
      data: {
        title: "Caracol Next",
        landing: "caracol-next",
        slug: "caracol-next",
        layout,
      },
    });
    console.log(`  ✓ Page creada (id=${created.id})`);
  }
}

// --------------------------------------------------------------------------
// PASO 4 — Upsert globals
// --------------------------------------------------------------------------
async function upsertGlobals(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log("\n🌐 Upserting globals...");

  // header-caracol-next
  await payload.updateGlobal({
    slug: "header-caracol-next",
    data: {
      logo: null,
      logoDark: null,
      navAnchors: [
        { label: "Marcas", anchorId: "marcas" },
        { label: "Audiencia", anchorId: "audiencia" },
        { label: "Momentos", anchorId: "momentos" },
        { label: "Pauta", anchorId: "pauta" },
        { label: "Contacto", anchorId: "contacto" },
      ],
      ctaButton: {
        enabled: true,
        label: "Conoce ditu",
        href: "/ditu",
        variant: "brand-ditu" as const,
      },
      sticky: true,
    },
  });
  console.log("  ✓ header-caracol-next");

  // header-ditu
  await payload.updateGlobal({
    slug: "header-ditu",
    data: {
      logo: null,
      logoDark: null,
      navAnchors: [
        { label: "Nuestro Alcance", anchorId: "cifras" },
        { label: "ADN ditu", anchorId: "adn" },
        { label: "Tipo de contenido", anchorId: "tipo-contenido" },
        { label: "Nuestros canales", anchorId: "canales" },
        { label: "Calendario", anchorId: "momentos" },
        { label: "Formatos", anchorId: "pauta" },
      ],
      ctaButton: {
        enabled: true,
        label: "Ir a Caracol Next",
        href: "/caracol-next",
        variant: "brand-caracolnext" as const,
      },
      sticky: true,
    },
  });
  console.log("  ✓ header-ditu");

  // footer-caracol-next
  await payload.updateGlobal({
    slug: "footer-caracol-next",
    data: {
      logo: null,
      tagline:
        "El ecosistema digital más grande de Colombia. Tu marca en los contenidos que mueven al país.",
      columns: [
        {
          heading: "Marcas",
          links: [
            { label: "Caracol TV", href: "#marcas" },
            { label: "Gol Caracol", href: "#marcas" },
            { label: "BluRadio", href: "#marcas" },
            { label: "La Kalle", href: "#marcas" },
          ],
        },
        {
          heading: "Pauta",
          links: [
            { label: "Formatos", href: "#pauta" },
            { label: "Branded Content", href: "#branded" },
            { label: "Especificaciones", href: "#pauta" },
          ],
        },
        {
          heading: "Empresa",
          links: [
            { label: "Acerca de", href: "#" },
            { label: "Trabaja con nosotros", href: "#" },
            { label: "Términos", href: "#" },
          ],
        },
        {
          heading: "Contacto",
          links: [
            { label: "Comercial", href: "#contacto" },
            { label: "Prensa", href: "#" },
          ],
        },
      ],
      socialLinks: [
        { network: "facebook" as const, url: "https://facebook.com/caracolnext" },
        { network: "instagram" as const, url: "https://instagram.com/caracolnext" },
        { network: "x" as const, url: "https://x.com/caracolnext" },
        { network: "youtube" as const, url: "https://youtube.com/caracolnext" },
        { network: "tiktok" as const, url: "https://tiktok.com/@caracolnext" },
      ],
      bottomLine: "©2026 Caracol Comercial Digital",
      useWave: false,
      tone: "minimal" as const,
    },
  });
  console.log("  ✓ footer-caracol-next");

  // floating-contact
  await payload.updateGlobal({
    slug: "floating-contact",
    data: {
      enabled: true,
      buttonLabel: "Contáctanos",
      buttonIcon: "Sparkles" as const,
      panelHeading: "Habla con nuestro equipo",
      panelDescription:
        "Escríbenos por correo o WhatsApp. Te respondemos en menos de 24 horas.",
      representatives: [
        {
          name: "Daniela Forero",
          role: "Senior accounts",
          email: "dforero@caracoltv.com.co",
          whatsapp: "573001234567",
          photo: null,
        },
        {
          name: "Carlos Méndez",
          role: "Brand partnerships",
          email: "cmendez@caracoltv.com.co",
          whatsapp: "573009876543",
          photo: null,
        },
      ],
      position: "bottom-right" as const,
    },
  });
  console.log("  ✓ floating-contact");
}

// --------------------------------------------------------------------------
// PASO 5 — Home assets + SiteSettings.homeContent
// --------------------------------------------------------------------------
async function uploadHomeAssets(
  payload: Awaited<ReturnType<typeof getPayload>>,
  report: SeedReport,
): Promise<{
  logoCaracolMedios: number | null;
  iconUsers: number | null;
  iconScreens: number | null;
  iconFollowers: number | null;
  iconWatch: number | null;
}> {
  console.log("\n🏠 Home assets...");
  const homeDir = path.join(PUBLIC, "home");

  const assets: Array<{ file: string; alt: string; key: string }> = [
    {
      file: "logo-caracol-medios.svg",
      alt: "Logo Caracol Medios",
      key: "logoCaracolMedios",
    },
    { file: "icon-users.svg", alt: "Icono usuarios home", key: "iconUsers" },
    { file: "icon-screens.svg", alt: "Icono pantallas home", key: "iconScreens" },
    { file: "icon-followers.svg", alt: "Icono seguidores home", key: "iconFollowers" },
    { file: "icon-watch.svg", alt: "Icono watch time home", key: "iconWatch" },
  ];

  const alts = assets.map((a) => a.alt);
  const deleted = await dedupMediaByAlt(payload, alts);
  report.deletedDuplicates += deleted;

  const ids: Record<string, number | null> = {};
  for (const asset of assets) {
    const filePath = path.join(homeDir, asset.file);
    const result = await uploadIfNeeded(payload, filePath, asset.alt);
    if (result !== null) {
      ids[asset.key] = result.id;
      if (result.reused) {
        report.reusedAssets.push(asset.file);
        console.log(`  ↩  ${asset.file} → Media #${result.id} (reutilizado)`);
      } else {
        report.uploadedAssets.push(asset.file);
        console.log(`  ✓  ${asset.file} → Media #${result.id} (creado)`);
      }
    } else {
      ids[asset.key] = null;
      report.missingAssets.push(`Home: /public/home/${asset.file}`);
      console.log(`  ✗  ${asset.file} — archivo no encontrado (quedará null)`);
    }
  }

  return {
    logoCaracolMedios: ids["logoCaracolMedios"] ?? null,
    iconUsers: ids["iconUsers"] ?? null,
    iconScreens: ids["iconScreens"] ?? null,
    iconFollowers: ids["iconFollowers"] ?? null,
    iconWatch: ids["iconWatch"] ?? null,
  };
}

async function upsertHomeContent(
  payload: Awaited<ReturnType<typeof getPayload>>,
  homeAssets: Awaited<ReturnType<typeof uploadHomeAssets>>,
) {
  console.log("\n🏠 Upserting SiteSettings.homeContent...");
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      homeContent: {
        logoCaracolMedios: homeAssets.logoCaracolMedios,
        digitalLabel: "DIGITAL",
        eyebrow: "Unidad digital #1 en Colombia",
        heading: [
          { text: "Conecta", weight: "extrabold" as const },
          { text: " tu marca con la audiencia ", weight: "semibold" as const },
          { text: "más relevante del país.", weight: "extrabold" as const },
        ],
        contactLabel: "Contáctenos",
        brands: {
          caracolNext: {
            logo: null,
            description: [
              {
                text: "Conecta tu marca con el respaldo de nuestros portales líderes a través de contenidos que generan impacto real.",
              },
            ],
            ctaLabel: "Conoce Caracol Next",
            href: "/caracol-next",
          },
          ditu: {
            logo: null,
            description: [
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
            icon: homeAssets.iconUsers,
            numericValue: 16,
            prefix: "+",
            suffix: "M",
            label: "usuarios",
            accent: "caracolnext" as const,
            lgWidth: 272,
          },
          {
            icon: homeAssets.iconScreens,
            numericValue: 3,
            prefix: "+",
            suffix: "M",
            label: "pantallas activas",
            accent: "ditu" as const,
            lgWidth: 340,
          },
          {
            icon: homeAssets.iconFollowers,
            numericValue: 127,
            prefix: "+",
            suffix: "M",
            label: "seguidores",
            accent: "caracolnext" as const,
            lgWidth: 328,
          },
          {
            icon: homeAssets.iconWatch,
            numericValue: 42,
            prefix: null,
            suffix: "Min",
            label: "watch time",
            accent: "ditu" as const,
            lgWidth: 288,
          },
        ],
        copyright: "©2026 Caracol Comercial Digital",
      },
    },
  });
  console.log("  ✓ site-settings (homeContent)");
}

// --------------------------------------------------------------------------
// PASO 6 — Ditu piloto (C1): assets + Page
// --------------------------------------------------------------------------
async function uploadDituPilotAssets(
  payload: Awaited<ReturnType<typeof getPayload>>,
  report: SeedReport,
): Promise<{
  googleplay: number | null;
  appstore: number | null;
  tv: number | null;
  videoBlock: number | null;
  iconDownload: number | null;
  iconLivetv: number | null;
  iconBolt: number | null;
  logoCaracol: number | null;
  pautaCard: number | null;
}> {
  console.log("\n🦆 Ditu assets (C1 + C2)...");
  const dituDir = path.join(PUBLIC, "ditu");
  const logosDir = path.join(PUBLIC, "logos");

  const assets: Array<{ file: string; dir: string; alt: string; key: string }> = [
    // C1
    {
      dir: dituDir,
      file: "googleplay.svg",
      alt: "Ditu icon Google Play",
      key: "googleplay",
    },
    { dir: dituDir, file: "appstore.svg", alt: "Ditu icon App Store", key: "appstore" },
    { dir: dituDir, file: "tv.svg", alt: "Ditu icon TV web", key: "tv" },
    {
      dir: dituDir,
      file: "video-block.png",
      alt: "Ditu video showcase",
      key: "videoBlock",
    },
    // C2 — stat icons
    {
      dir: dituDir,
      file: "icon-download.svg",
      alt: "Ditu icon descargas",
      key: "iconDownload",
    },
    {
      dir: dituDir,
      file: "icon-livetv.svg",
      alt: "Ditu icon dispositivos activos",
      key: "iconLivetv",
    },
    { dir: dituDir, file: "icon-bolt.svg", alt: "Ditu icon pico", key: "iconBolt" },
    // C2 — canal logo placeholder
    {
      dir: logosDir,
      file: "logo - Caracol.svg",
      alt: "Logo Caracol placeholder",
      key: "logoCaracol",
    },
    // C2 — pauta card
    {
      dir: dituDir,
      file: "pauta-card.png",
      alt: "Ditu pauta card placeholder",
      key: "pautaCard",
    },
  ];

  const alts = assets.map((a) => a.alt);
  const deleted = await dedupMediaByAlt(payload, alts);
  report.deletedDuplicates += deleted;

  const ids: Record<string, number | null> = {};
  for (const asset of assets) {
    const filePath = path.join(asset.dir, asset.file);
    const result = await uploadIfNeeded(payload, filePath, asset.alt);
    if (result !== null) {
      ids[asset.key] = result.id;
      if (result.reused) {
        report.reusedAssets.push(asset.file);
        console.log(`  ↩  ${asset.file} → Media #${result.id} (reutilizado)`);
      } else {
        report.uploadedAssets.push(asset.file);
        console.log(`  ✓  ${asset.file} → Media #${result.id} (creado)`);
      }
    } else {
      ids[asset.key] = null;
      report.missingAssets.push(`Ditu: ${filePath}`);
      console.log(`  ✗  ${asset.file} — archivo no encontrado (quedará null)`);
    }
  }

  return {
    googleplay: ids["googleplay"] ?? null,
    appstore: ids["appstore"] ?? null,
    tv: ids["tv"] ?? null,
    videoBlock: ids["videoBlock"] ?? null,
    iconDownload: ids["iconDownload"] ?? null,
    iconLivetv: ids["iconLivetv"] ?? null,
    iconBolt: ids["iconBolt"] ?? null,
    logoCaracol: ids["logoCaracol"] ?? null,
    pautaCard: ids["pautaCard"] ?? null,
  };
}

function buildDituLayout(assets: {
  googleplay: number | null;
  appstore: number | null;
  tv: number | null;
  videoBlock: number | null;
  iconDownload: number | null;
  iconLivetv: number | null;
  iconBolt: number | null;
  logoCaracol: number | null;
  pautaCard: number | null;
}) {
  return [
    // 1 — Hero
    {
      blockType: "ditu-hero" as const,
      anchorId: "inicio",
      stickerText: "TU MARCA",
      headingLine1: "en todas las",
      headingLine2: "pantallas,",
      headingAccent: "en todo momento",
      description:
        "Somos ditu la plataforma OTT que integra lo mejor de Caracol Televisión en un ecosistema multiplataforma, desde la pantalla grande hasta el smartphone. Ofrecemos una experiencia gratuita de fácil acceso que se convierte en la vitrina estratégica ideal para que tu marca conecte con una audiencia masiva, fiel y comprometida.",
      buttons: [
        {
          label: "Google Play",
          href: "#",
          iconKey: "googleplay" as const,
          iconMedia: assets.googleplay,
        },
        {
          label: "App Store",
          href: "#",
          iconKey: "appstore" as const,
          iconMedia: assets.appstore,
        },
        { label: "Portal web", href: "#", iconKey: "tv" as const, iconMedia: assets.tv },
      ],
      blockName: "Ditu Hero",
    },
    // 2 — Video 1
    {
      blockType: "ditu-video" as const,
      image: assets.videoBlock,
      alt: "Pantalla de la aplicación Ditu",
      background: "linear-gradient(90deg, #1E0E4C 0%, #3A1A92 100%)",
      blockName: "Ditu Video 1",
    },
    // 3 — Audiencia
    {
      blockType: "ditu-audiencia" as const,
      anchorId: "cifras",
      stickerLabel: "Las cifras que mueven a Ditu",
      heading: {
        pre: "Cada mes,",
        accent: "millones de pantallas",
        post: "prendidas.",
      },
      watchTime: {
        label: "Watch time promedio",
        value: "60 MIN",
        description: "Por sesión, sin interrupciones",
      },
      topSource: "Fuente: Ditu AVS Accenture · Abril 2026",
      totalFollowersHeadline: "+1.7M",
      followersSuffix: "DE SEGUIDORES",
      followersSubtext: "QUE ESPERAN VER TU MARCA",
      networkItemLabel: "Seguidores",
      bottomSource: "Fuente: TGI CO 2025",
      stats: [
        {
          label: "Descargas acumuladas",
          value: 10717937,
          description: "De puertas abiertas para tu marca",
          icon: assets.iconDownload,
          large: true,
        },
        {
          label: "Dispositivos activos",
          value: 3039409,
          description: "Pantallas encendidas cada mes",
          icon: assets.iconLivetv,
          large: false,
        },
        {
          label: "Pico dispositivos/día",
          value: 474339,
          description: "En su momento de mayor atención",
          icon: assets.iconBolt,
          large: false,
        },
      ],
      devices: [
        { label: "Smart TV", minutes: 52, icon: "smarttv" as const },
        { label: "Mobile", minutes: 32, icon: "mobile" as const },
        { label: "Tablet", minutes: 34, icon: "tablet" as const },
        { label: "Web", minutes: 28, icon: "web" as const },
      ],
      networks: [
        {
          network: "facebook" as const,
          followers: 45274642,
          href: "https://www.facebook.com",
        },
        {
          network: "tiktok" as const,
          followers: 21101000,
          href: "https://www.tiktok.com",
        },
        { network: "x" as const, followers: 20675885, href: "https://www.x.com" },
        {
          network: "youtube" as const,
          followers: 19201460,
          href: "https://www.youtube.com",
        },
        {
          network: "instagram" as const,
          followers: 14076513,
          href: "https://www.instagram.com",
        },
        {
          network: "whatsapp" as const,
          followers: 4991401,
          href: "https://www.whatsapp.com",
        },
      ],
      blockName: "Ditu Audiencia",
    },
    // 4 — ADN
    {
      blockType: "ditu-adn" as const,
      anchorId: "adn",
      stickerLabel: "ADN DITU",
      heading: { accent: "Sabemos", rest: "a quién le hablas." },
      gender: {
        label: "Género",
        subtitle: "nos prefieren",
        maleLabel: "Hombres",
        femaleLabel: "Mujeres",
      },
      genderMalePercent: 52,
      agePeak: { label: "EDAD PICO", text: "Pico: 55-64 años" },
      secondHeading: { pre: "y dónde", accent: "encontrarlo" },
      nseDescription:
        "El nivel socioeconómico de nuestra audiencia refleja la Colombia real. Diversa, masiva y lista para conectar con tu marca.",
      source: "Fuente: TGI CO 2025",
      ageBars: [
        { label: "18-24", value: 58, peak: false },
        { label: "25-34", value: 80, peak: false },
        { label: "35-44", value: 95, peak: false },
        { label: "45-54", value: 58, peak: false },
        { label: "55-64", value: 148, peak: true },
        { label: "+65", value: 74, peak: false },
      ],
      nseCards: [
        { label: "ESTRATO 1 o 2", value: 22.7 },
        { label: "ESTRATO 3", value: 37.8 },
        { label: "ESTRATO 4", value: 28.9 },
        { label: "ESTRATO 5 o 6", value: 10.6 },
      ],
      blockName: "Ditu ADN",
    },
    // 5 — Tipo de contenido
    {
      blockType: "ditu-tipo-contenido" as const,
      anchorId: "tipo-contenido",
      tabs: [
        {
          label: "FAST",
          description:
            "Canales digitales con programación las 24 horas, especializados en temáticas específicas (cocina, películas de acción, series). Es la experiencia de la TV tradicional pero con contenido curado para nichos concretos.",
        },
        {
          label: "Simulcasts / en vivo",
          description:
            "Transmisión simultánea de la señal abierta y eventos en vivo. El usuario ve en streaming exactamente lo que está en pantalla, con la misma inmediatez que la TV tradicional.",
        },
        {
          label: "VOD / Catchup",
          description:
            "Biblioteca de contenido on-demand: novelas, series y producciones de Caracol disponibles cuando el usuario quiera. La libertad de elegir qué ver y cuándo.",
        },
      ],
      blockName: "Ditu Tipo Contenido",
    },
    // 6 — Canales
    {
      blockType: "ditu-canales" as const,
      anchorId: "canales",
      channelsEnVivo: [
        { name: "caracol televisión", logo: assets.logoCaracol },
        { name: "blu", logo: assets.logoCaracol },
        { name: "noticias caracol en vivo", logo: assets.logoCaracol },
        { name: "la kalle", logo: assets.logoCaracol },
        { name: "Caracol Sports", logo: assets.logoCaracol },
        { name: "a otro nivel", logo: assets.logoCaracol },
        { name: "negocios ditu", logo: assets.logoCaracol },
      ],
      channelsFast: [
        { name: "Caracol FAST", logo: assets.logoCaracol },
        { name: "Sports FAST", logo: assets.logoCaracol },
      ],
      channelsAliados: [
        { name: "Eventos Caracol en vivo", logo: assets.logoCaracol },
        { name: "A otro Nivel", logo: assets.logoCaracol },
      ],
      blockName: "Ditu Canales",
    },
    // 7 — Calendario
    {
      blockType: "ditu-calendario" as const,
      anchorId: "momentos",
      events: [
        {
          dateLabel: "DEL 06 DE MARZO AL 04 DE MAYO",
          startDate: "2026-03-06",
          endDate: "2026-05-04",
          title: "FilBo 2026",
          subtitle: "Libros e historias",
          category: "Categoría",
          badgeVariant: "cyan" as const,
        },
        {
          dateLabel: "DEL 13 AL 17 DE MARZO",
          startDate: "2026-03-13",
          endDate: "2026-03-17",
          title: "Carnaval de Barranquilla",
          subtitle: "Celebraciones",
          category: "Categoría",
          badgeVariant: "violet" as const,
        },
        {
          dateLabel: "JUN",
          startDate: "2026-06-11",
          endDate: "2026-07-19",
          title: "Mundial / Eurocopa",
          subtitle: "Picos deportivos",
          category: "Categoría",
          badgeVariant: "navy" as const,
        },
        {
          dateLabel: "20 - JUL",
          startDate: "2026-07-20",
          endDate: "2026-07-20",
          title: "Día de la independencia",
          subtitle: "Conversaciones",
          category: "Categoría",
          badgeVariant: "white" as const,
        },
        {
          dateLabel: "14 DE FEBRERO",
          startDate: "2026-02-14",
          endDate: "2026-02-14",
          title: "San Valentín",
          subtitle: "Conexiones",
          category: "Categoría",
          badgeVariant: "cyan" as const,
        },
        {
          dateLabel: "21 DE JUNIO",
          startDate: "2026-06-21",
          endDate: "2026-06-21",
          title: "Día del Padre",
          subtitle: "Familias",
          category: "Categoría",
          badgeVariant: "violet" as const,
        },
        {
          dateLabel: "10 DE MAYO",
          startDate: "2026-05-10",
          endDate: "2026-05-10",
          title: "Día de la Madre",
          subtitle: "Tributos",
          category: "Categoría",
          badgeVariant: "navy" as const,
        },
        {
          dateLabel: "19 DE SEPTIEMBRE",
          startDate: "2026-09-19",
          endDate: "2026-09-19",
          title: "Día del Amor y la Amistad",
          subtitle: "Conexiones",
          category: "Categoría",
          badgeVariant: "white" as const,
        },
        {
          dateLabel: "31 DE OCTUBRE",
          startDate: "2026-10-31",
          endDate: "2026-10-31",
          title: "Halloween",
          subtitle: "Espectáculos",
          category: "Categoría",
          badgeVariant: "cyan" as const,
        },
        {
          dateLabel: "DEL 20 AL 31 DE DICIEMBRE",
          startDate: "2026-12-20",
          endDate: "2026-12-31",
          title: "Navidad",
          subtitle: "Tradiciones",
          category: "Categoría",
          badgeVariant: "violet" as const,
        },
        {
          dateLabel: "31 DE DICIEMBRE",
          startDate: "2026-12-31",
          endDate: "2026-12-31",
          title: "Fin de Año",
          subtitle: "Celebraciones",
          category: "Categoría",
          badgeVariant: "navy" as const,
        },
        {
          dateLabel: "DEL 05 AL 12 DE OCTUBRE",
          startDate: "2026-10-05",
          endDate: "2026-10-12",
          title: "Festival de Cine Cartagena",
          subtitle: "Cultura audiovisual",
          category: "Categoría",
          badgeVariant: "white" as const,
        },
        {
          dateLabel: "DEL 04 AL 06 DE JULIO",
          startDate: "2026-07-04",
          endDate: "2026-07-06",
          title: "Rock al Parque",
          subtitle: "Música en vivo",
          category: "Categoría",
          badgeVariant: "cyan" as const,
        },
        {
          dateLabel: "DEL 31 DE JULIO AL 09 DE AGOSTO",
          startDate: "2026-07-31",
          endDate: "2026-08-09",
          title: "Feria de las Flores",
          subtitle: "Tradiciones",
          category: "Categoría",
          badgeVariant: "violet" as const,
        },
      ],
      blockName: "Ditu Calendario",
    },
    // 8 — Video 2 (fondo diferente, sin imagen específica)
    {
      blockType: "ditu-video" as const,
      image: null,
      alt: "",
      background:
        "linear-gradient(90deg, #6C27D8 0%, #6020DF 47%, #471BA7 68%, #371881 82%, #251557 99%)",
      blockName: "Ditu Video 2",
    },
    // 9 — Pauta
    {
      blockType: "ditu-pauta" as const,
      anchorId: "pauta",
      categories: [
        {
          key: "ads" as const,
          label: "Ad's",
          formats: [
            {
              tag: "Ad-s",
              title: "pre-roll",
              description:
                "El pre-roll es un anuncio de video que se reproduce antes de que inicie el contenido principal que el usuario ha seleccionado.",
              image: assets.pautaCard,
            },
            {
              tag: "Ad-s",
              title: "MID-ROLL",
              description:
                "Mid-roll es un anuncio que aparece en una pausa o corte programado durante la reproducción de un contenido.",
              image: assets.pautaCard,
            },
            {
              tag: "Ad-s",
              title: "DAI",
              description:
                "La pauta DAI se refiere a la inserción de anuncios en los cortes comerciales de canales que transmiten en simultáneo (simulcast) la señal de televisión lineal.",
              image: assets.pautaCard,
            },
          ],
        },
        {
          key: "patrocinio" as const,
          label: "Patrocinio",
          formats: [
            {
              tag: "Patrocinio",
              title: "patrocinio de canal",
              description:
                "Vincula tu marca a un canal FAST completo con presencia constante en bumpers, billboards y placement editorial.",
              image: assets.pautaCard,
            },
            {
              tag: "Patrocinio",
              title: "PATROCINIO DE PROGRAMA",
              description:
                "Asocia tu marca con un programa específico de Caracol Televisión vía bumper de entrada, salida y menciones del presentador.",
              image: assets.pautaCard,
            },
            {
              tag: "Patrocinio",
              title: "PATROCINIO DE EVENTO",
              description:
                "Tu marca presente en los eventos en vivo más importantes — Mundial, Eurocopa, Festival de Cine, conciertos y más.",
              image: assets.pautaCard,
            },
          ],
        },
        {
          key: "branded" as const,
          label: "Branded",
          formats: [
            {
              tag: "Branded",
              title: "branded content",
              description:
                "Contenido original creado en alianza con tu marca — narrativas integradas a la línea editorial de ditu y Caracol Next.",
              image: assets.pautaCard,
            },
            {
              tag: "Branded",
              title: "SERIES PROPIAS",
              description:
                "Co-producimos series y miniseries con tu marca como eje narrativo, distribuidas en ditu y redes sociales.",
              image: assets.pautaCard,
            },
            {
              tag: "Branded",
              title: "PODCASTS",
              description:
                "Branded podcasts conducidos por talento Caracol con tu marca presente desde guión hasta distribución.",
              image: assets.pautaCard,
            },
          ],
        },
        {
          key: "eventos" as const,
          label: "Eventos especiales",
          formats: [
            {
              tag: "Eventos",
              title: "MUNDIAL / EUROCOPA",
              description:
                "Activaciones publicitarias premium durante coberturas deportivas masivas — pre/mid-rolls + branding integrado.",
              image: assets.pautaCard,
            },
            {
              tag: "Eventos",
              title: "FESTIVALES",
              description:
                "Patrocinio integral de festivales de música, cine y cultura con cobertura en vivo en Caracol Next.",
              image: assets.pautaCard,
            },
            {
              tag: "Eventos",
              title: "FECHAS ESPECIALES",
              description:
                "20 de Julio, Día del Padre, Día de la Madre — fechas de alto consumo con paquetes publicitarios curados.",
              image: assets.pautaCard,
            },
          ],
        },
      ],
      blockName: "Ditu Pauta",
    },
    // 10 — Hablamos
    {
      blockType: "ditu-hablamos" as const,
      anchorId: "hablamos",
      stickerLabel: "¿HABLAMOS?",
      heading: "Lleva tu marca",
      headingAccent: "siguiente nivel.",
      description: "Cuéntanos tus objetivos y armemos juntos la mejor estrategia.",
      cta: { label: "Contáctanos", href: "#contacto" },
      blockName: "Ditu Hablamos",
    },
  ];
}

async function upsertDituPage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  assets: {
    googleplay: number | null;
    appstore: number | null;
    tv: number | null;
    videoBlock: number | null;
    iconDownload: number | null;
    iconLivetv: number | null;
    iconBolt: number | null;
    logoCaracol: number | null;
    pautaCard: number | null;
  },
) {
  console.log("\n📄 Upserting Page slug='ditu'...");
  const layout = buildDituLayout(assets);

  const existing = await payload.find({
    collection: "pages",
    where: { slug: { equals: "ditu" } },
    limit: 1,
    depth: 0,
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "pages",
      id: existing.docs[0].id,
      data: { title: "Ditu", landing: "ditu", slug: "ditu", layout },
    });
    console.log(`  ✓ Page actualizada (id=${existing.docs[0].id})`);
  } else {
    const created = await payload.create({
      collection: "pages",
      data: { title: "Ditu", landing: "ditu", slug: "ditu", layout },
    });
    console.log(`  ✓ Page creada (id=${created.id})`);
  }
}

// --------------------------------------------------------------------------
// PASO 7 — Footer Ditu global
// --------------------------------------------------------------------------
async function upsertFooterDitu(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log("\n🦶 Upserting global footer-ditu...");
  await payload.updateGlobal({
    slug: "footer-ditu",
    data: {
      encuentranosLabel: "Encuentranos",
      socialLinks: [
        { network: "facebook", url: "https://facebook.com/ditu" },
        { network: "x", url: "https://x.com/ditu" },
        { network: "instagram", url: "https://instagram.com/ditu" },
        { network: "tiktok", url: "https://tiktok.com/@ditu" },
        { network: "youtube", url: "https://youtube.com/@ditu" },
      ],
    },
  });
  console.log("  ✓ footer-ditu");
}

// --------------------------------------------------------------------------
// PASO 8 — Reporte final
// --------------------------------------------------------------------------
function printReport(report: SeedReport) {
  console.log("\n" + "═".repeat(60));
  console.log("REPORTE DE ASSETS FALTANTES (quedan null — pendientes del diseñador)");
  console.log("═".repeat(60));

  const alwaysNull = [
    "Hero: backgroundImage — no hay imagen de fondo en el Figma",
    "Hero: backgroundVideo — no hay video de fondo",
    "BrandTabs: brandLogo (todos) — SVGs no subidos; el front usa texto fallback",
    "BrandTabs: adFormats (todos) — vacíos en demo",
    "BrandedContent: multimedia.image/video — se usa YouTube; imágenes reales pendientes",
    "BrandedContent: logoTopLeft/logoTopRight — logos de overlay pendientes",
    "AdFormats: formats[].image (todos) — mockups de formato pendientes",
    "AdFormats: formats[].specs — richText vacío",
    "AdFormats: modal.childTabs[].image (todos) — mockups pendientes",
    "Contact: form — Form Builder sin formularios creados (Fase 5)",
    "Globales: header logo/logoDark — wordmarks SVG inline; logos Payload pendientes",
    "FloatingContact: representatives[].photo — fotos de representantes pendientes",
  ];

  if (report.missingAssets.length > 0) {
    console.log("\n⚠️  Archivos no encontrados en /public:");
    report.missingAssets.forEach((a) => console.log(`  · ${a}`));
  }

  console.log("\n📋 Campos que quedan null por diseño (pendientes del diseñador):");
  alwaysNull.forEach((a) => console.log(`  · ${a}`));

  if (report.deletedDuplicates > 0) {
    console.log(`\n🗑️  Duplicados eliminados: ${report.deletedDuplicates}`);
  }
  console.log(`\n✅ Media creados esta corrida: ${report.uploadedAssets.length}`);
  if (report.uploadedAssets.length > 0) {
    report.uploadedAssets.forEach((a) => console.log(`  · ${a}`));
  }
  console.log(`   Media reutilizados (ya existían): ${report.reusedAssets.length}`);
  if (report.reusedAssets.length > 0) {
    report.reusedAssets.forEach((a) => console.log(`  · ${a}`));
  }

  console.log("\n" + "═".repeat(60) + "\n");
}

// --------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------
const report: SeedReport = {
  missingAssets: [],
  uploadedAssets: [],
  reusedAssets: [],
  deletedDuplicates: 0,
};

async function main() {
  console.log("🌱 Iniciando seed Sprint A + B + C1 + C2...\n");
  const payload = await getPayload({ config: configPromise });

  const brandIds = await seedBrands(payload);
  const iconIds = await uploadBrandIcons(payload, report);
  await upsertCaracolNextPage(payload, iconIds, brandIds);
  await upsertGlobals(payload);
  const homeAssets = await uploadHomeAssets(payload, report);
  await upsertHomeContent(payload, homeAssets);
  const dituAssets = await uploadDituPilotAssets(payload, report);
  await upsertDituPage(payload, dituAssets);
  await upsertFooterDitu(payload);
  printReport(report);

  console.log("✅ Seed completado.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed falló:", err);
  process.exit(1);
});
