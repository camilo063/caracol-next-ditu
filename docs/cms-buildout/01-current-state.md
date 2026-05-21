# 01 · Estado actual del repo (inventario)

Snapshot del repo al momento de escribir estos docs (commit `ddf6bf2`). Antes de tocar nada, leé este archivo entero — describe **qué ya existe**, para que no rehagas trabajo ni rompas pixel-perfect.

## Estructura de directorios

```
src/
├── access/                       # Funciones de access control reutilizables
│   └── index.ts                  # exporta authenticated, publishedOrAuth, anyone, ...
├── app/
│   ├── (frontend)/               # Route group público
│   │   ├── layout.tsx
│   │   ├── page.tsx              # /                  → HubLanding (HARDCODED)
│   │   ├── caracol-next/page.tsx # /caracol-next      → lee demo-data.ts (HARDCODED)
│   │   └── ditu/page.tsx         # /ditu              → lee demo-data.ts (HARDCODED)
│   └── (payload)/                # Route group admin/API (auto-generado por Payload)
│       ├── admin/[[...segments]] # /admin             → admin UI
│       │   ├── page.tsx
│       │   └── importMap.js      # ⚠️ Commited (Payload v3 lo requiere en build)
│       └── api/                  # REST + GraphQL endpoints
│           ├── [...slug]/route.ts
│           ├── graphql/route.ts
│           └── graphql-playground/route.ts
├── blocks/                       # 12 blocks de página + utilities
│   ├── AIRecommendation/         # IA suggest brand (server action, Resend + AI Gateway)
│   ├── AdFormats/                # Pauta digital — display + video
│   ├── AudienceNetworks/         # "Nuestro Alcance" + Líderes en redes
│   ├── AudienceProfile/          # ADN Ditu (pie + bars)
│   ├── BrandTabs/                # 7 tabs por marca (Caracol Next)
│   ├── BrandedContent/           # 4 categorías + secondary tabs
│   ├── Contact/                  # CTA simple o form
│   ├── ContentType/              # Tipo de contenido (slider)
│   ├── Estratos/                 # Distribución NSE
│   ├── Hero/                     # Hero con brandIcons
│   ├── KeyMomentsCalendar/       # Calendario eventos
│   ├── OurChannels/              # Grid de canales
│   ├── RenderBlocks.tsx          # Switch que monta el block correcto
│   ├── SportsEvents/             # Eventos deportivos
│   ├── index.ts                  # exporta allBlocks: Block[]
│   ├── shared-fields.ts          # campos comunes: anchorIdField, ctaField, ...
│   └── types.ts                  # BlockOf<T> + alias por block
├── collections/                  # 4 collections Payload
│   ├── Categories.ts             # Categorías nested-docs
│   ├── Media.ts                  # Uploads
│   ├── Pages.ts                  # Página dinámica con layout=blocks[]
│   └── Users.ts                  # Auth users
├── components/                   # UI compartido (shadcn + marketing)
│   ├── animations/               # CountUp, FadeIn, etc
│   ├── marketing/                # HubLanding, FloatingContact, SiteHeader, SiteFooter
│   └── ui/                       # shadcn primitives
├── globals/                      # 6 globals + 2 shared field sets
│   ├── FloatingContact.ts        # Repeater de representantes contacto
│   ├── FooterCaracolNext.ts      # extiende shared-footer-fields
│   ├── FooterDitu.ts             # extiende shared-footer-fields
│   ├── HeaderCaracolNext.ts      # extiende shared-header-fields
│   ├── HeaderDitu.ts             # extiende shared-header-fields
│   ├── SiteSettings.ts           # SEO defaults + smtp + brand colors
│   ├── shared-footer-fields.ts
│   └── shared-header-fields.ts
├── lib/
│   ├── brand.ts                  # BRAND_META: tokens de color por brand (Caracol TV, Gol, etc)
│   ├── demo-data.ts              # ⚠️ FUENTE HARDCODED — desconectar en fase final
│   ├── format.ts                 # formatNumber, formatMillions, formatCompact
│   ├── hooks/                    # React hooks compartidos
│   ├── media.ts                  # mediaUrl() — extrae URL de Payload Media o string
│   ├── utils.ts                  # cn() + helpers
│   └── youtube.ts                # parse YouTube URL → embed
├── payload.config.ts             # Config principal Payload — buildConfig({...})
├── payload-types.ts              # ⚠️ Auto-generado — regenerar con `npm run generate:types`
└── styles/                       # Tailwind tokens + globals.css
```

## payload.config.ts — lo que YA está cableado

```ts
collections: [Pages, Media, Categories, Users];
globals: [
  HeaderCaracolNext,
  HeaderDitu,
  FooterCaracolNext,
  FooterDitu,
  FloatingContact,
  SiteSettings,
];
editor: lexicalEditor();
db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } });
plugins: [formBuilderPlugin, seoPlugin, nestedDocsPlugin];
cors: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "*";
```

Plugins:

- **formBuilderPlugin** — formularios editables (text, textarea, select, email, checkbox, message). Sin payment/number/state/country.
- **seoPlugin** — meta title/description/OG en `pages`. `uploadsCollection: "media"`.
- **nestedDocsPlugin** — pages como árbol (preparado pero no usado todavía).

## Collections — schema actual

### `pages`

- **versions: drafts (max 20)** ✓ ya habilitado
- **livePreview** ✓ ya configurado
- **access**: create/update/delete = `authenticated`, read = `publishedOrAuth`
- **fields**:
  - Tab "Contenido":
    - `title: text` (required)
    - `landing: select` (caracol-next | ditu) (required, default caracol-next)
    - `slug: text` (required, unique)
    - `layout: blocks[]` (required, blocks = allBlocks)
  - Tab "Hero alternativo":
    - `heroOverride: blocks[]` (maxRows: 1, blocks = [Hero])

### `media`

- Standard upload collection. Path `/media` por defecto.

### `categories`

- Para nested-docs. Slug + parent + breadcrumbs auto-generados.

### `users`

- Auth básico. No tiene roles todavía — **agregar en Fase 2** (ver doc 05).

## Globals — schema actual

### `header-caracol-next` (slug `header-caracol-next`)

Extiende `shared-header-fields.ts` (69 líneas) con campos comunes:

- `logo: upload (media)`
- `navAnchors: array<{ label, anchorId }>`
- `ctaButton: { enabled, label, href, variant }`
- `sticky: boolean`

### `header-ditu`

Igual structure que header-caracol-next pero datos distintos.

### `footer-caracol-next`, `footer-ditu`

Extienden `shared-footer-fields.ts` (84 líneas):

- `tagline: textarea`
- `columns: array<{ heading, links: array<{ label, href }> }>`
- `socialLinks: array<{ network, url }>`
- `bottomLine: text`
- `useWave: boolean`
- `tone: select` (default | ditu-deep | minimal)
- `logo: upload (media)`

### `floating-contact`

- `enabled: boolean`
- `buttonLabel: text`
- `buttonIcon: text`
- `panelHeading, panelDescription: text`
- `representatives: array<{ name, role, email, whatsapp, photo }>`
- `position: select` (bottom-right | bottom-left)

### `site-settings`

- SEO defaults (title, description, OG image)
- Brand colors (primary/accent overrides — no usado todavía)
- SMTP placeholder

## Blocks — los 12 que están construidos

Cada block tiene 3 archivos típicos: `config.ts` (Payload schema), `Component.tsx` (render), opcionalmente `actions.ts` (server actions) o subcomponentes (charts).

| Block              | Slug                | Render donde                             | Estado           |
| ------------------ | ------------------- | ---------------------------------------- | ---------------- |
| Hero               | `hero`              | Todas las landings                       | ✅ pixel-perfect |
| AudienceNetworks   | `audience-networks` | `/caracol-next` (top) + `/ditu` (cifras) | ✅ pixel-perfect |
| AudienceProfile    | `audience-profile`  | `/ditu` (ADN)                            | ✅ pixel-perfect |
| Estratos           | `estratos`          | `/ditu` (Y dónde encontrarlo)            | ✅ pixel-perfect |
| ContentType        | `content-type`      | `/ditu` (Tipo contenido)                 | ✅ pixel-perfect |
| BrandTabs          | `brand-tabs`        | `/caracol-next` (7 marcas)               | ✅ pixel-perfect |
| KeyMomentsCalendar | `key-moments`       | Ambas landings                           | ✅ pixel-perfect |
| BrandedContent     | `branded-content`   | `/caracol-next`                          | ✅ pixel-perfect |
| AdFormats          | `ad-formats`        | Ambas (grid / vertical-tabs)             | ✅ pixel-perfect |
| OurChannels        | `our-channels`      | `/ditu`                                  | ✅ pixel-perfect |
| Contact            | `contact`           | Ambas (cta-simple / stacked)             | ✅ pixel-perfect |
| SportsEvents       | `sports-events`     | Disponible, no usado en demo actual      | ✅ existe        |
| AIRecommendation   | `ai-recommendation` | Disponible, no usado en demo actual      | ✅ existe        |

Cada block ya tiene `config.ts` con sus campos definidos. **No necesitas crear los blocks — ya están**. Lo que falta:

1. Validar que los campos cubren TODO el contenido que demo-data.ts hardcodea (gap analysis: ver doc 03).
2. Agregar campos faltantes si demo-data.ts tiene algo no representado.
3. Seedear datos reales.

## demo-data.ts — la fuente hardcoded actual

`src/lib/demo-data.ts` (1877 líneas) exporta:

```ts
export const caracolNextDemoLayout: AnyBlock[]; // layout completo de /caracol-next
export const dituDemoLayout: AnyBlock[]; // layout completo de /ditu
export const caracolNextHeaderDemo; // datos del header de caracol-next
export const dituHeaderDemo; // datos del header de ditu
export const caracolNextFooterDemo; // datos del footer de caracol-next
export const dituFooterDemo; // datos del footer de ditu
export const floatingContactDemo; // datos del floating contact
```

Cada uno mapea 1:1 a una Page (layout) o Global (header/footer/floating).

El HubLanding (`/`) actualmente recibe sus props **inline en `src/app/(frontend)/page.tsx`** (líneas 16-200ish), no desde demo-data. Hay que crear un Page record con slug `home` + landing `caracol-next` (o introducir un tercer valor `hub` — ver doc 02) que represente esta home.

## Páginas del frontend — cómo leen datos hoy

| Ruta            | Source actual                                  | Componente         |
| --------------- | ---------------------------------------------- | ------------------ |
| `/`             | Hardcoded inline en `page.tsx`                 | `<HubLanding />`   |
| `/caracol-next` | `caracolNextDemoLayout` + headers/footers demo | `<RenderBlocks />` |
| `/ditu`         | `dituDemoLayout` + headers/footers demo        | `<RenderBlocks />` |

**Objetivo de la migración:** las 3 deben leer de Payload Local API (`getPayload({ config })` → `payload.find()` / `payload.findGlobal()`). Ver doc 03.

## Variables de entorno (ya seteadas)

`.env` local (en `.gitignore`) y Vercel Project Settings tienen:

```
PAYLOAD_SECRET=<set>
DATABASE_URI=<postgres connection string>
NEXT_PUBLIC_SITE_URL=<deploy URL o localhost>
PAYLOAD_PUBLIC_SERVER_URL=<same>
RESEND_API_KEY=<vacío, llenar en Fase 5>
RESEND_FROM_EMAIL=<vacío>
AI_GATEWAY_API_KEY=<vacío>
AUDIENCE_API_URL=<TBD, no usado>
NETWORKS_API_URL=<TBD, no usado>
```

## Lo que NO existe todavía (gaps a llenar)

| Gap                                                                            | Lo necesita         | Doc donde se trata |
| ------------------------------------------------------------------------------ | ------------------- | ------------------ |
| Roles en `users` (admin/editor/viewer)                                         | Fase 2              | 05                 |
| Access control per-collection/global                                           | Fase 2              | 05                 |
| `Brands` collection (Caracol TV, Gol, etc — actualmente en `src/lib/brand.ts`) | Decidir si vale CMS | 02                 |
| `KeyEvents` collection (eventos de calendario, hoy en block array)             | Decidir si vale CMS | 02                 |
| Seed script (`scripts/seed.ts`)                                                | Fase 3              | 03                 |
| ISR + revalidateTag wiring                                                     | Fase 4              | 04                 |
| Sentry + Web Analytics + Speed Insights                                        | Fase 5              | 04, 05             |
| CSP headers                                                                    | Fase 5              | 05                 |
| Rate limiting (contact form + AI)                                              | Fase 5              | 05                 |
| Robots.txt + sitemap.xml                                                       | Fase 6              | 06                 |
| 404 / error pages branded                                                      | Fase 6              | 06                 |

## Convenciones del proyecto (respetar)

- **Idioma código + comments**: español (con anglicismos técnicos: "block", "field", etc).
- **Labels admin**: español (`labels: { singular: "Página", plural: "Páginas" }`).
- **Slugs**: kebab-case (`caracol-next`, `ad-formats`).
- **Tailwind v4**: con tokens en `@theme inline`. Brand colors en `--color-primary`, `--color-accent`.
- **Husky + lint-staged**: corre en pre-commit, no se puede skippear.
- **Commits**: convencionales (`feat:`, `fix:`, `chore:`, `docs:`).
- **Pre-commit hook**: corre `prettier --write` + `eslint --fix` automáticamente.

## Próximo paso

→ Lee `02-target-data-model.md` para entender el schema completo objetivo (qué cambia, qué se agrega).
