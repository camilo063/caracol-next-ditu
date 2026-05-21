# 04 · Caché y performance

> El cliente va a editar el sitio MUY rara vez. La premisa: **steady-state cache hit ratio ≥ 95%**, y cuando edita, el cambio se ve en < 5 segundos. Cero re-render por request.

## Estrategia: ISR + revalidateTag (on-demand)

Next.js 15 App Router permite combinar:

- **ISR** (`export const revalidate = N`) — regenera estática cada N segundos.
- **On-demand revalidate** (`revalidateTag(tag)`) — invalida el cache de un tag específico inmediatamente.

Combinamos ambos: las páginas tienen `revalidate = 3600` (1 hora) como safety net, pero el invalidate principal viene de **afterChange hooks de Payload** que llaman `revalidateTag()` cuando el editor guarda algo.

Flujo:

```
Editor guarda Page en /admin
  → Payload afterChange hook
  → revalidateTag(`page:caracol-next:home`)
  → Next regenera la página en background
  → Próximo request sirve la nueva versión
```

Resultado: el editor ve el cambio en su browser en ~2-5 segundos (build + propagación CDN), y todos los visitantes lo ven al siguiente request.

## Wiring concreto

### 1. Page-level cache con tags

```tsx
// src/app/(frontend)/caracol-next/page.tsx
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";

const TAG = "page:caracol-next:home";

const getPage = unstable_cache(
  async () => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "pages",
      where: { landing: { equals: "caracol-next" }, slug: { equals: "home" } },
      limit: 1,
      depth: 3, // resuelve uploads y relationships en una query
    });
    return result.docs[0] ?? null;
  },
  ["caracol-next-home"], // cache key
  { tags: [TAG], revalidate: 3600 },
);

export const revalidate = 3600;

export default async function Page() {
  const page = await getPage();
  if (!page) notFound();
  return <RenderBlocks layout={page.layout} />;
}
```

Lo mismo para `/`, `/ditu`. Tags consistentes:

```
page:{landing}:{slug}       — para Pages
global:{slug}               — para Globals (hub-page, header-*, footer-*, ...)
media:{filename}            — para Media (raro: cambiar un asset no usa este tag)
```

### 2. Payload afterChange hooks

```ts
// src/collections/Pages.ts
import type { CollectionAfterChangeHook } from "payload";
import { revalidateTag } from "next/cache";

const revalidatePage: CollectionAfterChangeHook = ({ doc, previousDoc, operation }) => {
  const landing = doc.landing as string;
  const slug = doc.slug as string;

  revalidateTag(`page:${landing}:${slug}`);

  // Si cambió el slug, invalidar la URL anterior también
  if (previousDoc?.slug && previousDoc.slug !== slug) {
    revalidateTag(`page:${landing}:${previousDoc.slug}`);
  }

  return doc;
};

export const Pages: CollectionConfig = {
  // ...existing
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [
      ({ doc }) => {
        revalidateTag(`page:${doc.landing}:${doc.slug}`);
      },
    ],
  },
};
```

Y para cada global (header, footer, hub-page, floating-contact, site-settings):

```ts
// src/globals/HubPage.ts
import { revalidateTag } from "next/cache";

export const HubPage: GlobalConfig = {
  slug: "hub-page",
  hooks: {
    afterChange: [
      () => {
        revalidateTag("global:hub-page");
        // El header y footer se renderizan también en /, /caracol-next, /ditu
      },
    ],
  },
  // ...
};
```

⚠️ Cuando cambia un Header o Footer, **todas** las páginas que lo renderean deben invalidarse. Solución: incluir `global:header-caracol-next` en los tags de TODA página que usa ese header.

```ts
// src/app/(frontend)/caracol-next/layout.tsx
const getHeader = unstable_cache(
  async () => {
    /* fetch header */
  },
  ["header-caracol-next"],
  { tags: ["global:header-caracol-next"], revalidate: 3600 },
);
```

### 3. Media — invalidate cuidadoso

Cambiar el alt text de una imagen no necesita invalidar páginas. Pero **reemplazar el archivo** sí (porque la URL pública cambia o el hash debe regenerarse).

```ts
// src/collections/Media.ts
hooks: {
  afterChange: [
    ({ doc, req }) => {
      // Si el archivo cambió, buscar todas las páginas que la referencian
      // y revalidarlas. Implementación: query reverse relationships.
      if (req.file) {
        // Sobre-invalidar es OK: revalidar todos los tags de pages
        revalidateTag("page:hub:home")
        revalidateTag("page:caracol-next:home")
        revalidateTag("page:ditu:home")
      }
    },
  ],
}
```

## Image optimization

### Next/Image — usar SIEMPRE

```tsx
import Image from "next/image";

<Image
  src={mediaUrl(brand.logo)}
  alt={brand.alt ?? "Logo"}
  width={brand.width ?? 320}
  height={brand.height ?? 180}
  sizes="(max-width: 768px) 100vw, 320px"
  priority={isAboveFold} // Solo el hero LCP
  loading={isAboveFold ? undefined : "lazy"}
  placeholder={brand.blurDataURL ? "blur" : "empty"}
  blurDataURL={brand.blurDataURL}
/>;
```

Reglas:

- **`priority` solo para LCP**. Generalmente el primer Hero image. Una sola imagen por página.
- **`sizes` siempre**. Sin esto, Next sirve la imagen más grande siempre.
- **`width` + `height` obligatorios**. Previenen CLS.
- **Formato**: Next genera WebP + AVIF automáticamente. Solo subir originals (PNG/JPG/SVG).
- **SVG**: subir como `image/svg+xml`. No pasar por Next/Image — usar `<Image />` con `unoptimized` o `<img />` raw para SVG (más liviano).

### Payload imageSizes

Ya configurado en `Media.ts` (ver doc 02). Reglas:

- `thumbnail` 240×240 — admin UI
- `card` 640w — cards y listings
- `feature` 1024w — secciones medianas
- `hero` 1920w — heros + banners

Next/Image las usa automáticamente via `sizes`.

### `next.config.ts`

```ts
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // Vercel Blob storage
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    minimumCacheTTL: 31536000, // 1 año — los assets son inmutables (hash en URL)
  },
  // ...
};
```

## Bundle optimization

### Dynamic imports para componentes pesados

`Recharts` y `Framer Motion` son grandes (~50kB cada uno). Si un block usa charts, importarlo dynamically:

```tsx
// src/blocks/BrandTabs/Component.tsx
import dynamic from "next/dynamic";

const AgePeakBarChart = dynamic(
  () => import("./AgePeakBarChart").then((m) => m.AgePeakBarChart),
  { ssr: false, loading: () => <div className="h-[88px] w-full bg-gray-100" /> },
);

const GenderPieChart = dynamic(
  () => import("./GenderPieChart").then((m) => m.GenderPieChart),
  { ssr: false },
);
```

⚠️ Validar que los charts sí funcionan después del cambio. Hay que evitar layout shift — el placeholder debe tener las mismas dimensiones.

### Tree-shaking de lucide-react

```ts
// next.config.ts
experimental: {
  optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
}
```

Esto le dice a Next que solo incluya los íconos/componentes importados, no todo el package.

### Verificar bundle

Después de build:

```bash
npm run build
# Output muestra:
# Route (app)                  Size    First Load JS
# ┌ ○ /                        XX kB   YYY kB
```

Target: First Load JS shared ≤ 110 kB, por-página ≤ 250 kB total. Si excede:

```bash
ANALYZE=true npm run build  # require @next/bundle-analyzer
```

E identificar packages grandes.

## Web Vitals — instalar y monitorear

```bash
npm i @vercel/analytics @vercel/speed-insights
```

```tsx
// src/app/(frontend)/layout.tsx
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

Ambos son gratis en Hobby. Dashboard en `vercel.com/{team}/{project}/{analytics|speed-insights}`.

## Fonts

`next/font` ya está siendo usado (font-Montserrat en CSS variables). Mantener `display: "swap"` y `preload: true` para fonts críticas. NO cargar fonts via `@import` o `<link>` raw — bloquean render.

```tsx
// src/app/layout.tsx
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
});
```

## Headers de caché (Vercel)

Vercel maneja `Cache-Control` automáticamente para rutas estáticas. Para rutas dinámicas (rare en este proyecto), configurar `next.config.ts`:

```ts
async headers() {
  return [
    {
      source: "/api/(.*)",
      headers: [
        { key: "Cache-Control", value: "no-store" }, // APIs no cachean
      ],
    },
    {
      source: "/_next/static/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      // Assets de /media (Vercel Blob URLs)
      source: "/media/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ]
}
```

## Database — Postgres tuning

### Connection pooling

Usar la **pooler URL** de Neon (no la connection directa). Diferencias:

```
# Direct: postgresql://user:pass@ep-xxx.neon.tech/db
# Pooled: postgresql://user:pass@ep-xxx-pooler.neon.tech/db   ← este

DATABASE_URI=postgresql://...pooler.neon.tech/db
```

El pooler maneja conexiones serverless eficientemente (Vercel Functions arrancan/mueren a cada request).

### Indices

Payload no crea indices automáticos en todos los campos. Crear migration:

```sql
CREATE INDEX IF NOT EXISTS pages_landing_slug_idx ON pages(landing, slug);
CREATE INDEX IF NOT EXISTS pages_status_idx ON pages(_status);
CREATE INDEX IF NOT EXISTS media_filename_idx ON media(filename);
```

Si Payload tiene migrations habilitadas, generar:

```bash
npx payload migrate:create add-frontend-indices
# Editar el archivo SQL generado
npx payload migrate
```

### Query depth

```ts
payload.find({
  collection: "pages",
  where: { ... },
  depth: 3, // resolve uploads (depth 1) + relationships (depth 2) en una query
})
```

Sin `depth`, Next hace N queries adicionales. Con `depth: 3`, una sola query con joins.

⚠️ No usar `depth: 0` salvo que sepas que no necesitas resoluciones — devuelve IDs raw.

## Edge runtime — ¿usar?

**No** para las páginas que leen de Payload. Payload usa Postgres driver Node-only.
\*\*\*\* para Middleware si se agrega (auth check global).

```ts
// src/middleware.ts (si se usa)
export const config = { matcher: ["/admin/:path*"] };
// export const runtime = "edge" // no compatible con Payload
```

## Lighthouse — auditar y bloquear merge

Agregar a CI (GitHub Actions):

```yaml
# .github/workflows/lighthouse.yml
- uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      https://${{ env.VERCEL_PREVIEW_URL }}
      https://${{ env.VERCEL_PREVIEW_URL }}/caracol-next
      https://${{ env.VERCEL_PREVIEW_URL }}/ditu
    configPath: ./.lighthouserc.json
```

`.lighthouserc.json`:

```json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    }
  }
}
```

PR no mergea si una de las URLs cae bajo 95.

## Smoke tests

```ts
// scripts/smoke.ts (opcional, post-deploy)
const URLS = ["/", "/caracol-next", "/ditu"];
const BASE = process.env.SITE_URL ?? "https://caracol-next-ditu.vercel.app";

for (const url of URLS) {
  const res = await fetch(`${BASE}${url}`);
  if (!res.ok) {
    console.error(`✗ ${url} → ${res.status}`);
    process.exit(1);
  }
  console.log(`✓ ${url} → 200`);
}
```

## Resumen de targets

| Métrica                            | Target  | Verificación                       |
| ---------------------------------- | ------- | ---------------------------------- |
| LCP móvil                          | < 2.0s  | Lighthouse mobile preset           |
| LCP desktop                        | < 1.0s  | Lighthouse desktop preset          |
| CLS                                | < 0.05  | Lighthouse                         |
| TTFB                               | < 200ms | `curl -w "%{time_starttransfer}"`  |
| First Load JS                      | < 250kB | `npm run build` output             |
| Cache hit ratio                    | ≥ 95%   | Vercel Analytics → Performance     |
| Revalidate latency (edit → public) | < 5s    | manual: edit, hit URL with `?ts=N` |
| Lighthouse Performance             | ≥ 95    | CI block                           |
| Lighthouse Accessibility           | ≥ 95    | CI block                           |

## Próximo paso

→ Lee `05-security-and-access.md` para RBAC, auth y hardening.
