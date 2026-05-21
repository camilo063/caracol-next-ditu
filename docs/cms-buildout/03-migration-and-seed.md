# 03 · Migración de demo-data.ts → Payload y rewire de páginas

Objetivo: pasar **toda** la data hardcoded en `src/lib/demo-data.ts` (1877 líneas) y `src/app/(frontend)/page.tsx` (HubLanding inline) a Payload. Al terminar, `demo-data.ts` se elimina del runtime — solo el seed script lo lee.

## Estrategia general

1. **Crear un seed script** (`scripts/seed.ts`) que se ejecuta una vez por entorno (dev/preview/prod).
2. **El seed es idempotente**: si los registros ya existen, los actualiza; si no, los crea. Nunca duplica.
3. **El seed usa Payload Local API** directamente — no HTTP. Más rápido y atómico.
4. **Después del seed**, las páginas (`/`, `/caracol-next`, `/ditu`) se reescriben para hacer `await payload.find({...})` en vez de `import { ... } from "@/lib/demo-data"`.
5. **`demo-data.ts` se mueve** a `scripts/seed/source-data.ts` (para que solo el seed lo importe) o se elimina definitivamente después de validar que el seed funciona.

## Paso 1: Subir assets a Payload Media

Los assets en `public/caracol-next/` y `public/hub/` (logos de brand, avatars, hero images, etc) deben pasar a la collection `media`. Razón: el editor debe poder reemplazar el logo de Caracol TV desde el admin sin commit.

### Script: `scripts/seed/upload-assets.ts`

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import { getPayload } from "payload";
import config from "@payload-config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");

interface AssetSpec {
  /** Ruta dentro de /public */
  publicPath: string;
  /** Alt text obligatorio */
  alt: string;
  /** Identifier único para lookup en seed (no es field de Payload) */
  seedKey: string;
}

const ASSETS: AssetSpec[] = [
  // Brands del Hero (Caracol Next landing)
  {
    publicPath: "caracol-next/brands/caracoltv.png",
    alt: "Caracol Te Ve",
    seedKey: "brand-caracoltv-hero",
  },
  {
    publicPath: "caracol-next/brands/noticias-caracol.png",
    alt: "Noticias Caracol",
    seedKey: "brand-noticias-hero",
  },
  {
    publicPath: "caracol-next/brands/caracol-sports.png",
    alt: "Caracol Sports",
    seedKey: "brand-caracolsports-hero",
  },
  {
    publicPath: "caracol-next/brands/blu-radio.png",
    alt: "Blu Radio",
    seedKey: "brand-bluradio-hero",
  },
  {
    publicPath: "caracol-next/brands/gol-caracol.png",
    alt: "Gol Caracol",
    seedKey: "brand-golcaracol-hero",
  },
  { publicPath: "caracol-next/brands/volk.png", alt: "Volk", seedKey: "brand-volk-hero" },
  {
    publicPath: "caracol-next/brands/bumbox.png",
    alt: "BumBox",
    seedKey: "brand-bumbox-hero",
  },
  {
    publicPath: "caracol-next/brands/la-kalle.png",
    alt: "La Kalle",
    seedKey: "brand-lakalle-hero",
  },

  // Brand-tabs assets (wordmark + avatar por brand)
  {
    publicPath: "caracol-next/brand-tabs/caracoltv-logo.svg",
    alt: "Caracol TV wordmark",
    seedKey: "brand-caracoltv-logo",
  },
  {
    publicPath: "caracol-next/brand-tabs/caracoltv-avatar.png",
    alt: "Caracol TV avatar",
    seedKey: "brand-caracoltv-avatar",
  },
  // ... (los 13 assets identificados en BrandTabs/Component.tsx BRAND_LOGO_PATHS + BRAND_AVATAR_PATHS)
];

export async function uploadAssets() {
  const payload = await getPayload({ config });
  const results = new Map<string, number>(); // seedKey → mediaId

  for (const asset of ASSETS) {
    const filePath = path.join(PROJECT_ROOT, "public", asset.publicPath);
    const buf = await fs.readFile(filePath);
    const filename = path.basename(asset.publicPath);
    const mimeType = inferMimeType(filename);

    // Lookup por filename para idempotencia
    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: filename } },
      limit: 1,
    });

    let mediaId: number;
    if (existing.docs[0]) {
      // Update alt si cambió
      await payload.update({
        collection: "media",
        id: existing.docs[0].id,
        data: { alt: asset.alt },
      });
      mediaId = existing.docs[0].id;
    } else {
      const created = await payload.create({
        collection: "media",
        data: { alt: asset.alt },
        file: { data: buf, name: filename, mimetype: mimeType, size: buf.length },
      });
      mediaId = created.id;
    }

    results.set(asset.seedKey, mediaId);
    console.log(`✓ ${filename} → mediaId=${mediaId}`);
  }

  return results;
}

function inferMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return (
    {
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
    }[ext] ?? "application/octet-stream"
  );
}
```

## Paso 2: Seedear Globals

```ts
// scripts/seed/seed-globals.ts
import { getPayload } from "payload"
import config from "@payload-config"
import {
  caracolNextHeaderDemo,
  dituHeaderDemo,
  caracolNextFooterDemo,
  dituFooterDemo,
  floatingContactDemo,
} from "@/lib/demo-data"
// (mover demo-data a scripts/seed/source-data.ts antes del paso final)

export async function seedGlobals(mediaIds: Map<string, number>) {
  const payload = await getPayload({ config })

  // Helper: convierte string|null URL a media relationship
  const mediaRef = (url: string | null | undefined): number | null => {
    if (!url) return null
    // Aquí necesitas un mapping URL → seedKey; ver doc 02
    return null // implementar lookup real
  }

  // Header Caracol Next
  await payload.updateGlobal({
    slug: "header-caracol-next",
    data: {
      ...caracolNextHeaderDemo,
      logo: mediaRef("/hub/caracol-medios-logo.svg"),
    },
  })

  // Header Ditu (mismo patrón)
  await payload.updateGlobal({
    slug: "header-ditu",
    data: { ...dituHeaderDemo },
  })

  // Footers
  await payload.updateGlobal({ slug: "footer-caracol-next", data: caracolNextFooterDemo })
  await payload.updateGlobal({ slug: "footer-ditu", data: dituFooterDemo })

  // Floating Contact
  await payload.updateGlobal({ slug: "floating-contact", data: floatingContactDemo })

  // Hub Page (Global nuevo — ver doc 02)
  await payload.updateGlobal({
    slug: "hub-page",
    data: {
      eyebrow: "Unidad digital #1 en Colombia",
      heading: /* lexical state — construir richText con spans bold/regular */,
      contactLabel: "Contáctenos",
      brands: {
        caracolNext: {
          descriptionParagraphs: [{ text: "Conecta tu marca con el respaldo..." }],
          ctaLabel: "Conoce Caracol Next",
          href: "/caracol-next",
        },
        ditu: {
          description: "Integra tu marca en el mejor contenido...",
          ctaLabel: "Conoce ditu",
          href: "/ditu",
        },
      },
      stats: [
        { icon: "users", numericValue: 16, prefix: "+", suffix: "M", label: "usuarios", accent: "caracolnext", lgWidth: 272 },
        { icon: "tv", numericValue: 3, prefix: "+", suffix: "M", label: "pantallas activas", accent: "ditu", lgWidth: 340 },
        // ... etc del HubLanding inline en page.tsx
      ],
    },
  })

  // Site Settings
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      defaultSeo: {
        title: "Caracol Medios · Mediakit",
        description: "El ecosistema digital más grande de Colombia.",
      },
      maintenanceMode: { enabled: false, message: "Estamos trabajando en mejoras." },
    },
  })

  console.log("✓ Globals seedeados")
}
```

## Paso 3: Seedear Pages

Crear 2 Pages: una para `/caracol-next` y otra para `/ditu`. (La Home `/` está en el Global `hub-page`, no en Pages.)

```ts
// scripts/seed/seed-pages.ts
import { getPayload } from "payload"
import config from "@payload-config"
import { caracolNextDemoLayout, dituDemoLayout } from "@/lib/demo-data"

export async function seedPages(mediaIds: Map<string, number>) {
  const payload = await getPayload({ config })

  // Helper: reemplaza string paths "/caracol-next/brand-tabs/caracoltv-logo.svg"
  // en el layout demo por media relationships (mediaIds).
  const rewriteLayoutMediaRefs = (layout: any[]): any[] =>
    layout.map(block => /* recursive rewrite */)

  // Caracol Next page
  const existingCnx = await payload.find({
    collection: "pages",
    where: { slug: { equals: "home" }, landing: { equals: "caracol-next" } },
    limit: 1,
  })
  const cnxLayout = rewriteLayoutMediaRefs(caracolNextDemoLayout)

  if (existingCnx.docs[0]) {
    await payload.update({
      collection: "pages",
      id: existingCnx.docs[0].id,
      data: { title: "Caracol Next", landing: "caracol-next", slug: "home", layout: cnxLayout },
    })
  } else {
    await payload.create({
      collection: "pages",
      data: { title: "Caracol Next", landing: "caracol-next", slug: "home", layout: cnxLayout, _status: "published" },
    })
  }

  // Ditu page (idem)
  // ...

  console.log("✓ Pages seedeadas")
}
```

## Paso 4: Crear admin user inicial

```ts
// scripts/seed/seed-users.ts
export async function seedUsers() {
  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: "admin@caracoltv.com.co" } },
    limit: 1,
  });

  if (existing.docs[0]) {
    console.log("✓ Admin user ya existe");
    return;
  }

  const tempPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2026";
  await payload.create({
    collection: "users",
    data: {
      email: "admin@caracoltv.com.co",
      password: tempPassword,
      name: "Admin Caracol",
      role: "admin",
    },
  });

  console.log(
    `✓ Admin user creado. Password temporal: ${tempPassword} — CAMBIAR INMEDIATAMENTE.`,
  );
}
```

⚠️ El password temporal debe rotarse en el primer login. Documentar en el handoff al cliente.

## Paso 5: Orchestrator

```ts
// scripts/seed.ts (entry point)
import { uploadAssets } from "./seed/upload-assets";
import { seedGlobals } from "./seed/seed-globals";
import { seedPages } from "./seed/seed-pages";
import { seedUsers } from "./seed/seed-users";

async function main() {
  console.log("🌱 Iniciando seed...");
  const mediaIds = await uploadAssets();
  await seedUsers();
  await seedGlobals(mediaIds);
  await seedPages(mediaIds);
  console.log("✓ Seed completo.");
  process.exit(0);
}

main().catch((err) => {
  console.error("✗ Seed falló:", err);
  process.exit(1);
});
```

Agregar a `package.json`:

```json
"scripts": {
  "seed": "tsx scripts/seed.ts"
}
```

Y instalar `tsx` (`npm i -D tsx`).

## Paso 6: Ejecutar el seed

```bash
# Local (dev)
npm run seed

# Vercel Production — usar Vercel CLI:
vercel env pull .env.production.local
NODE_ENV=production npm run seed
```

⚠️ **No automatizar el seed en el build de Vercel**. Es un comando manual one-shot por entorno. Si se corre en cada deploy, sobreescribiría cambios del editor.

## Paso 7: Rewire de las páginas

### `src/app/(frontend)/page.tsx` (Home `/`)

```tsx
import { getPayload } from "payload";
import config from "@payload-config";
import { HubLanding } from "@/components/marketing";

export const revalidate = 3600; // ISR 1h, on-demand desde Payload afterChange

export default async function HomePage() {
  const payload = await getPayload({ config });
  const [hub, floating] = await Promise.all([
    payload.findGlobal({ slug: "hub-page" }),
    payload.findGlobal({ slug: "floating-contact" }),
  ]);

  return (
    <HubLanding
      eyebrow={hub.eyebrow}
      heading={renderLexical(hub.heading)}
      contactLabel={hub.contactLabel}
      representatives={(floating.representatives ?? []).map((r) => ({
        name: r.name,
        email: r.email,
        whatsapp: r.whatsapp,
      }))}
      brands={mapHubBrands(hub.brands)}
      stats={hub.stats ?? []}
    />
  );
}
```

### `src/app/(frontend)/caracol-next/page.tsx`

```tsx
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { RenderBlocks } from "@/blocks/RenderBlocks";

export const revalidate = 3600;

export default async function CaracolNextPage() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "pages",
    where: { landing: { equals: "caracol-next" }, slug: { equals: "home" } },
    limit: 1,
    draft: false, // En preview mode esto pasa a true
  });

  const page = result.docs[0];
  if (!page) notFound();

  return <RenderBlocks layout={page.layout} />;
}
```

### `src/app/(frontend)/ditu/page.tsx`

Mismo patrón pero `landing: "ditu"`.

## Paso 8: Limpieza

Una vez que las 3 páginas leen de Payload y funcionan:

1. Mover `src/lib/demo-data.ts` → `scripts/seed/source-data.ts` (o eliminar si no se necesita re-seed).
2. Borrar import de `demo-data` en cualquier componente que quede (verificar con `rg "demo-data"`).
3. Validar que `npm run build` pasa sin referencia a demo-data en el bundle del client.

## Paso 9: Wire de `revalidateTag` (caché)

En cada collection/global afectada, agregar hook `afterChange`:

```ts
// src/collections/Pages.ts
import { revalidateTag } from "next/cache"

hooks: {
  afterChange: [
    ({ doc, previousDoc, operation }) => {
      const landing = doc.landing
      const slug = doc.slug
      const tag = `page:${landing}:${slug}`
      revalidateTag(tag)
      // Si cambió el slug, revalidar también el anterior
      if (previousDoc?.slug && previousDoc.slug !== slug) {
        revalidateTag(`page:${landing}:${previousDoc.slug}`)
      }
      return doc
    },
  ],
}
```

Y en las páginas:

```tsx
import { unstable_cache } from "next/cache";

const getPage = unstable_cache(
  async (landing: string, slug: string) => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "pages",
      where: { landing: { equals: landing }, slug: { equals: slug } },
      limit: 1,
    });
    return result.docs[0] ?? null;
  },
  ["page-by-slug"],
  { tags: ["page:caracol-next:home"], revalidate: 3600 },
);
```

Detalles completos en doc 04.

## Checklist de validación post-migración

- [ ] `npm run seed` corre sin error en local.
- [ ] `/admin` carga, login con admin@caracoltv.com.co funciona, rol "admin" visible.
- [ ] En admin, `Pages > Caracol Next` muestra el layout completo con los 7 brand tabs poblados.
- [ ] En admin, `Globals > Footer Caracol Next` muestra columnas + social links.
- [ ] `npm run build` pasa sin importar `demo-data` en bundle de client.
- [ ] `/`, `/caracol-next`, `/ditu` renderean idénticos al pre-migración (visual diff = 0).
- [ ] Edit un texto en admin → save → revalidate → cambio reflejado en la URL pública en < 5s.
- [ ] Reemplazar logo de Caracol TV en `media` → ver cambio en el side panel del tab.
- [ ] `grep -r "demo-data" src/` retorna **0 matches** fuera de `scripts/seed/`.

## Próximo paso

→ Lee `04-cache-and-performance.md` para implementar ISR + revalidate + image opt + Core Web Vitals.
