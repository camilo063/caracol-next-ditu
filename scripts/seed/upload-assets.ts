import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Payload } from "payload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../..");

interface AssetSpec {
  /** Ruta dentro de /public (con leading slash, como aparece en demo-data). */
  publicPath: string;
  /** Alt text obligatorio. */
  alt: string;
}

/**
 * Assets referenciados como upload-fields en demo-data.ts.
 *
 * Solo van aquí los assets que son DATA editable (icons del Hero, logos
 * que el cliente puede reemplazar desde admin). Los iconos hardcoded en
 * Component.tsx (e.g. BRAND_LOGO_PATHS de BrandTabs, social-* de Ditu)
 * NO se suben — siguen viviendo en `public/` y son parte del frontend.
 */
const ASSETS: AssetSpec[] = [
  // Brand icons del Hero Caracol Next — Figma 347:2037
  { publicPath: "/caracol-next/brands/caracoltv.png", alt: "Caracol Te Ve" },
  { publicPath: "/caracol-next/brands/noticias-caracol.png", alt: "Noticias Caracol" },
  { publicPath: "/caracol-next/brands/caracol-sports.png", alt: "Caracol Sports" },
  { publicPath: "/caracol-next/brands/blu-radio.png", alt: "Blu Radio" },
  { publicPath: "/caracol-next/brands/gol-caracol.png", alt: "Gol Caracol" },
  { publicPath: "/caracol-next/brands/volk.png", alt: "Volk" },
  { publicPath: "/caracol-next/brands/bumbox.png", alt: "BumBox" },
  { publicPath: "/caracol-next/brands/la-kalle.png", alt: "La Kalle" },
];

const MIME_BY_EXT: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};

function inferMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_BY_EXT[ext] ?? "application/octet-stream";
}

/**
 * Sube los assets a la collection `media` de forma idempotente.
 * Lookup por filename: si ya existe, actualiza `alt`; si no, crea.
 *
 * Devuelve un Map<publicPath, mediaId> para que el resto del seed pueda
 * reemplazar string paths por relationships reales.
 */
export async function uploadAssets(payload: Payload): Promise<Map<string, number>> {
  const result = new Map<string, number>();

  console.log(`📦 Subiendo ${ASSETS.length} assets...`);

  for (const asset of ASSETS) {
    const absolutePath = path.join(PROJECT_ROOT, "public", asset.publicPath);
    const filename = path.basename(asset.publicPath);

    let buffer: Buffer;
    try {
      buffer = await fs.readFile(absolutePath);
    } catch {
      console.warn(`  ⚠ ${asset.publicPath} no existe en public/ — skip`);
      continue;
    }

    const mimeType = inferMimeType(filename);

    // Idempotencia: lookup por `alt` (estable) en vez de `filename`. El field
    // `filename` no es confiable como key porque Payload puede reescribirlo:
    // (a) `formatOptions.format: "webp"` convierte la extensión (.png → .webp);
    // (b) si hay colisión de nombre, Payload agrega sufijo `-1`, `-2`...
    // El alt text lo controlamos nosotros y no muta entre runs del seed.
    const existing = await payload.find({
      collection: "media",
      where: { alt: { equals: asset.alt } },
      limit: 1,
      sort: "id",
    });

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]!;
      result.set(asset.publicPath, doc.id as number);
      console.log(`  ↻ ${filename} (existente, mediaId=${doc.id})`);
    } else {
      const created = await payload.create({
        collection: "media",
        data: { alt: asset.alt },
        file: {
          name: filename,
          data: buffer,
          mimetype: mimeType,
          size: buffer.length,
        },
      });
      result.set(asset.publicPath, created.id as number);
      console.log(`  + ${filename} (creado, mediaId=${created.id})`);
    }
  }

  console.log(`✓ Assets: ${result.size}/${ASSETS.length} listos.`);
  return result;
}
