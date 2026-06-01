# 01 — Project Overview

## Qué es

Mediakit oficial Caracol Comercial Digital. Dos landings administradas
desde un solo Payload CMS, montadas en Next.js 15 App Router. El cliente
edita TODO desde el admin (textos, imágenes, métricas, eventos,
representantes, configuración global).

## Tres páginas frontend

### `/` — HubLanding (Home Caracol Medios)

Componente único: `<HubLanding>` (`src/components/marketing/hub-landing.tsx`).

Layout:

- **Izquierda**: hero con eyebrow + heading mixto (Extra/Semi-Bold) +
  CTA "Contáctenos" que abre modal con representantes.
- **Derecha**: 2 product cards (Caracol Next + Ditu) + 4 metric cards
  con CountUp + 2 CTAs "Conoce X".
- **Footer**: pill copyright.

Datos: hoy hardcoded en `src/app/(frontend)/page.tsx`. En Fase 4 leerá
desde `globals.SiteSettings` (Home Content).

### `/caracol-next` — Page Builder con bloques

Componente: `<RenderBlocks>` (`src/blocks/RenderBlocks.tsx`) que despacha
por `blockType` a los componentes en `src/blocks/*/Component.tsx`.

Bloques actuales:

1. `hero` → `HeroBlockComponent` (eyebrow, heading mixto, subheading, brand icons row)
2. `audience-networks` → `AudienceNetworksBlockComponent` ("Nuestro Alcance" + grid de redes)
3. `brand-tabs` → `BrandTabsBlockComponent` ("Una marca para cada audiencia" — tabs con audiencia por marca)
4. `key-moments` → `KeyMomentsCalendarComponent` ("Calendario" con cards de eventos)
5. `branded-content` → `BrandedContentBlockComponent` (Video Podcast + Producción + Editorial)
6. `ad-formats` → `AdFormatsBlockComponent` ("Pauta Digital" con modales por formato)
7. `contact` → `ContactBlockComponent` (cierre con CTA o form-builder)

Datos: hoy desde `caracolNextDemoLayout` en `src/lib/demo-data.ts`.
En Fase 4 viene de `collections.Pages` (slug `caracol-next`).

### `/ditu` — Componentes custom (no usa RenderBlocks)

Componente: una composición en `src/app/(frontend)/ditu/page.tsx`
con componentes propios en `src/components/marketing/ditu-*.tsx`:

1. `DituHero` (sticker rotado "TU MARCA" + heading uppercase + 3 botones outline)
2. `DituVideoBlock`
3. `DituAudienciaBlock` (cifras + watch time + redes)
4. `DituAdnBlock` (gráfica género + edad pico + NSE)
5. `DituTipoContenidoBlock` (FAST / Simulcasts / En vivo / VOD)
6. `DituCanalesBlock` (tabs EN VIVO / FAST / Aliados)
7. `DituCalendarioBlock` (slider con dots paginan de 4 en 4)
8. `DituPautaBlock`
9. `DituHablamosBlock`

Cada componente recibe overrides desde props. Hoy usa defaults
internos. En Fase 4 deberá recibir datos desde Payload (probablemente
una collection `DituPages` con bloques o globals separados por bloque —
decidir en Fase 4).

## Layout root

`src/app/(frontend)/layout.tsx`:

- Carga fonts: Montserrat (principal), Poppins (eyebrow Caracol Next),
  Spline Sans (UI Ditu), Ditu Display (local, headings Ditu).
- `<body suppressHydrationWarning>` por extensiones de browser
  (Grammarly, etc.) que mutan el DOM antes de la hydration.

## Routes Payload

- `/admin` → UI de administración Payload
- `/api/[collection]` → REST API (Pages, Media, Users, Categories,
  globals: site-settings, header-caracol-next, header-ditu,
  footer-caracol-next, footer-ditu, floating-contact)
- `/api/graphql` → GraphQL endpoint
- `/api/graphql-playground` → playground

## Scripts críticos

```bash
npm run dev                        # Dev en :3000
npm run devsafe                    # rm -rf .next && next dev (cuando hay cache raro)
npm run build                      # Build prod (payload generate:importmap + next build)
npm run generate:types             # Regenera src/payload-types.ts
npm run generate:importmap         # Regenera src/app/(payload)/admin/importMap.js
npm run payload -- migrate         # Migraciones DB
npm run payload -- migrate:create  # Crea nueva migración (nombrada)
```

## Variables de entorno

| Variable                    | Cuándo  | Ejemplo                                     |
| --------------------------- | ------- | ------------------------------------------- |
| `PAYLOAD_SECRET`            | Siempre | `openssl rand -hex 32`                      |
| `DATABASE_URI`              | Siempre | `postgresql://user:pass@host:5432/db`       |
| `NEXT_PUBLIC_SITE_URL`      | Siempre | `http://localhost:3000`                     |
| `PAYLOAD_PUBLIC_SERVER_URL` | Siempre | igual al `NEXT_PUBLIC_SITE_URL` en monolito |
| `RESEND_API_KEY`            | Fase 5  | Envío de formulario contacto                |
| `RESEND_FROM_EMAIL`         | Fase 5  | Email verificado en Resend                  |
| `AI_GATEWAY_API_KEY`        | Fase 5  | Vercel AI Gateway para el block IA          |

`.env.example` está al día. Camilo confirma que el MVP NO conecta APIs
externas de audiencia / redes: todo se llena manual desde Payload.

## Branches y workflow git

- `main` → producción.
- `bugfixing` → trabajo actual (esta sesión).
- Pre-commit corre prettier + ESLint vía Husky + lint-staged.
- Nunca `--no-verify` ni amend salvo que Camilo lo pida.

## Deploy

Vercel. Variables de entorno se manejan con `vercel env`. CLI
recomendado >= 54.6.1.

Pipelines:

- Push a `main` → producción
- Push a otra rama → preview deployment
- Para producción manual: `vercel --prod`

## Phases del proyecto (status actual)

- ✅ Fase 1 — Setup Next + Payload + Tailwind + shadcn
- ✅ Fase 2 — Layout root, fonts, theming
- ✅ Fase 3 — Bloques visuales (1:1 Figma) con datos demo
- 🟡 Fase 4 — Conexión 100% Payload ↔ Frontend (en curso)
- ⏳ Fase 5 — APIs externas + Form-builder + AI Block
- ⏳ Fase 6 — QA, performance, accesibilidad, deploy producción
