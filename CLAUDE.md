# CLAUDE.md — Contexto base del proyecto

> Este archivo es leído automáticamente por Claude Code al abrir el repo.
> Lee primero esto, luego los archivos de `docs/claude-context/` cuando
> necesites profundizar en un dominio específico.
>
> **Última verificación contra el código: 2026-07-31.** Si algo de aquí no
> coincide con el repo, el repo manda — y actualiza este archivo en el mismo PR.

---

## Identidad del proyecto

**Caracol Next + Ditu — Mediakit**: micrositio corporativo del ecosistema
Caracol Comercial Digital. Dos landings paralelas, una unidad de negocio:

- `/` → **Home Caracol Medios** (hub principal, presenta ambas marcas)
- `/caracol-next` → **Caracol Next** (portafolio de marcas Caracol)
- `/ditu` → **Ditu** (plataforma OTT del ecosistema)

El cliente es Caracol Comercial Digital. Nivelics entrega.
Stakeholder principal: **Camilo Villanueva** (CEO Nivelics, PM/Tech Lead).

---

## Tres reglas innegociables

### 1. Figma es la fuente de verdad — 100% fidelidad

El diseño en Figma ya fue **aprobado por el cliente**. No interpretes, no
"mejores", no "simplifiques" sin pedir aprobación explícita. Si el código
diverge del Figma, el código está mal — no el Figma.

Cualquier cambio visual debe:

1. Empezar consultando el nodo Figma vía MCP (`mcp__Figma__get_design_context`).
2. Extraer los valores literales: colores hex, font-size, line-height,
   tracking, padding, gap, border-radius, etc.
3. Pegar el valor exacto en el código (preferir clases arbitrarias
   `text-[20px]` o `style` inline antes que aproximar con un token).
4. Verificar visualmente con preview tools o screenshots de comparación.

**Excepción ya establecida**: cuando el Figma calcó el encuadre de un asset
puntual (crop, zoom, offset), eso NO se replica — el CMS recibe piezas
distintas cada vez. Se implementa el contenedor (aspect-ratio + `object-cover`
centrado) y no el recorte del mockup. Precedente: Ditu Pauta, jul-2026.

Detalles operativos en [`docs/claude-context/02-figma-workflow.md`](docs/claude-context/02-figma-workflow.md).

### 2. CMS-driven — todo lo editable vive en Payload

El cliente edita TODO el contenido vía Payload Admin. Eso incluye:

- Textos de cada bloque (heading, subheading, descripciones, labels, CTAs)
- Imágenes, videos, logos
- Métricas y números
- Eventos del calendario y sus categorías
- Marcas (logos, colores de los charts, cifras por tab)
- Representantes de contacto, por landing
- Configuración de header / footer / floating contact
- Script de Google Analytics
- Estructura de bloques en cada landing

Cuando agregues un componente visual nuevo, **siempre** lo mapeas a un
field de Payload primero. Nunca hardcodees contenido que el cliente debería
poder cambiar.

Tres patrones que ya nos mordieron y son ley:

- **Nada de listas hardcodeadas por slug.** Si el comportamiento depende de
  `slug === "bumbox"`, es un bug esperando. Va como campo.
- **Vaciar ≠ no configurar.** Si el editor borra todos los ítems de un array,
  la sección debe quedar vacía, no caer a data demo. Distingue
  `undefined` (nunca tocado) de `[]` (vaciado a propósito).
- **Para ocultar algo, dale un toggle.** El editor no debería tener que
  borrar datos para esconder una sección.

Schema y mapping en [`docs/claude-context/03-payload-cms.md`](docs/claude-context/03-payload-cms.md).

### 3. Sin clarifying questions — ejecuta

Camilo prefiere ejecución directa. Si tienes una decisión razonable que
tomar, tómala y avanza; él te redirige si no es lo que quería. No pares
para preguntar "¿quieres que…?" salvo en cambios destructivos
(borrar tablas, force-push, migraciones que pierden datos).

---

## Tech stack — versiones reales

| Capa            | Tecnología                         | Versión                 |
| --------------- | ---------------------------------- | ----------------------- |
| Framework       | Next.js 16 (App Router, Turbopack) | 16.2.9                  |
| Lenguaje        | TypeScript strict                  | 5.x                     |
| UI              | React                              | 19.2.0                  |
| Estilos         | Tailwind CSS v4 (`@theme inline`)  | 4.x                     |
| Componentes     | shadcn/ui (style: new-york)        | manual                  |
| Animaciones     | Framer Motion                      | 11.18.2                 |
| Charts          | Recharts                           | 2.15.4                  |
| Carrusel        | Embla Carousel React               | 8.6.0                   |
| CMS             | Payload v3                         | 3.85.1                  |
| DB              | PostgreSQL                         | 14+ (Neon en prod)      |
| Storage         | Vercel Blob (`clientUploads`)      | plugin oficial          |
| Forms           | react-hook-form + zod              | 7.x / 3.x               |
| Iconos          | lucide-react                       | 0.474.0                 |
| AI              | Vercel AI SDK + AI Gateway         | 6.0.183                 |
| Package manager | **pnpm**                           | 10.x                    |
| Node            | LTS                                | ^20.18.0 \|\| >=22.12.0 |

**Next 16 + Payload 3.85 van juntos**: `@payloadcms/next` exige ese par. No
subir ni bajar ninguno de los dos por separado. (El proyecto estuvo pinneado
a Next 15.5.18 + Payload 3.34 hasta el upgrade del 2026-06-10/11; ver
[`docs/audits/2026-06-10-upgrade-resultado.md`](docs/audits/2026-06-10-upgrade-resultado.md).)

**El package manager es pnpm.** Hay `pnpm-lock.yaml` y `pnpm-workspace.yaml`.
No corras `npm install` — rompe el lockfile.

---

## Comandos esenciales

```bash
pnpm dev                  # Dev en :3000 (Frontend + Payload + Admin)
pnpm devsafe              # Limpia .next y dev (cuando hay cache raro)
pnpm build                # Build prod (migrate en prod + generate:importmap + next build)
pnpm type-check           # tsc --noEmit — 0 errores antes de cualquier PR
pnpm lint:fix             # ESLint con autofix
pnpm format               # Prettier write
pnpm generate:types       # Regenera src/payload-types.ts desde el schema
pnpm generate:importmap   # Regenera el importmap del admin
echo "y" | pnpm payload migrate   # Aplica migraciones pendientes
pnpm seed                 # Carga el contenido por defecto en la DB (idempotente)
```

**IMPORTANTE — un solo puerto**: el dev server SIEMPRE corre en
`localhost:3000`. La config `.claude/launch.json` tiene `autoPort: false`
para evitar que el preview tool abra puertos aleatorios. Si 3000 está
ocupado, mata el proceso antes de arrancar otro.

Instalación local paso a paso (Docker + Postgres + seed):
[`docs/INSTALL.md`](docs/INSTALL.md) y el README.

---

## Estructura del repo

```
src/
├── app/(frontend)/         # Routes públicas
│   ├── page.tsx            #   → / (HubLanding Home, desde SiteSettings.homeContent)
│   ├── caracol-next/       #   → /caracol-next (page-builder)
│   ├── ditu/               #   → /ditu (page-builder)
│   └── layout.tsx          #   Root layout + fonts + metadata + GoogleAnalytics
├── app/(payload)/          # Admin Payload (/admin) + API REST
├── access/                 # Helpers de access control de Payload
├── blocks/                 # Bloques del Page Builder — 22 bloques
│   ├── <Bloque>/           #   Cada uno: config.ts (schema) + Component.tsx (wrapper)
│   ├── RenderBlocks.tsx    #   Dispatcher por blockType + Set noReveal
│   ├── shared-fields.ts    #   Campos reutilizables (CTA, anchorId, etc.)
│   ├── types.ts            #   Props tipadas por bloque
│   └── index.ts            #   allBlocks[] — registro para payload.config
├── collections/            # Pages, Media, Categories, Brands, EventCategories, Users
├── globals/                # HeaderCaracolNext, HeaderDitu, FooterCaracolNext,
│                           # FooterDitu, FloatingContact, SiteSettings
│                           # + shared-header-fields.ts / shared-footer-fields.ts
├── components/
│   ├── ui/                 # shadcn primitives (Button, Card, etc.)
│   ├── marketing/          # Componentes de landing (header, footer, secciones Ditu…)
│   ├── animations/         # CountUp, RevealSection, ParallaxBackground
│   └── analytics/          # GoogleAnalytics.tsx
├── fields/                 # richHeading.ts (headings con pesos mixtos)
├── lib/
│   ├── payload/            #   queries.ts, cache-tags.ts, revalidate-pages.ts
│   ├── brand.ts            #   Resolución de marca / theming
│   ├── event-dates.ts      #   Semántica de fechas de eventos (ver abajo)
│   ├── event-categories.ts #   Resolución de categoría → label + color por landing
│   ├── media.ts            #   mediaUrl() — Media de Payload → src
│   ├── format.ts, youtube.ts, utils.ts, hooks/
├── migrations/             # SQL a mano + index.ts (registro ordenado)
├── styles/                 # globals.css con @theme y CSS vars
└── payload.config.ts       # Config Payload (collections, globals, plugins, db)
```

### Bloques registrados (22, en `allBlocks`)

`AIRecommendation`, `AdFormats`, `AudienceNetworks`, `AudienceProfile`,
`BrandTabs`, `BrandedContent`, `Contact`, `ContentType`, `DituAdn`,
`DituAudiencia`, `DituCalendario`, `DituCanales`, `DituHablamos`, `DituHero`,
`DituPauta`, `DituTipoContenido`, `DituVideo`, `Estratos`, `Hero`,
`KeyMomentsCalendar`, `OurChannels`, `SportsEvents`.

Patrón: `config.ts` declara el schema Payload; `Component.tsx` es un wrapper
delgado que traduce el bloque de Payload a las props del componente de
`components/marketing/`. La lógica visual vive en `marketing/`, no en el bloque.

---

## Arquitectura Payload

### Plugins habilitados (`src/payload.config.ts`)

| Plugin                | Estado                                                            |
| --------------------- | ----------------------------------------------------------------- |
| `plugin-form-builder` | Activo. Campos: text, textarea, select, email, checkbox, message. |
| `plugin-seo`          | Activo sobre `pages` (title/description/OG generados).            |
| `plugin-nested-docs`  | Configurado sobre `pages`, sin uso activo en MVP.                 |
| `storage-vercel-blob` | Activo si hay `BLOB_READ_WRITE_TOKEN`. `clientUploads: true`.     |

`clientUploads: true` hace que el navegador suba el archivo **directo** a
Vercel Blob, saltándose el límite de ~4.5 MB de body de las funciones
serverless. Sin eso, los videos grandes fallaban con "Your request was too large".

### Migraciones — `push: false`, todo a mano

El adapter de Postgres tiene **`push: false`**: Drizzle NO sincroniza el
schema en dev. Toda diferencia de schema se aplica vía `payload_migrations`.
(Motivo original: dos FK de `branded_content` truncaban al mismo identificador
de 63 chars y reventaban el arranque con `duplicate_object`.)

Reglas de migración en este repo:

- Van en `src/migrations/AAAAMMDD_descripcion.ts` y **se registran en
  `src/migrations/index.ts`** (si no está en el index, no corre).
- Son SQL escrito a mano con `sql` de `@payloadcms/db-postgres`, con un
  comentario de cabecera que explica **qué problema resuelve y qué pasa con
  los datos existentes**. Sigue ese estilo: no es opcional, es la única
  documentación de por qué la columna existe.
- **Additive-only y sin mutar datos.** Una migración no debe cambiar lo que
  el cliente ve el día del deploy. Si un campo nuevo cambia el render, la
  migración le pone a los registros viejos el valor que reproduce el
  comportamiento actual (precedentes: `brand_tabs_show_web_networks`,
  `event_categories_collection`).
- Tras cualquier cambio de schema: `pnpm generate:types`.

En producción las migraciones corren **solas** en el deploy: el script
`build` ejecuta `payload migrate` cuando `VERCEL_ENV=production`.
(El README todavía tiene una sección que dice lo contrario — el
`package.json` manda.)

### Caché e invalidación

- `src/lib/payload/queries.ts` — todas las lecturas del frontend público van
  envueltas en `unstable_cache`. keyParts: `[fnName, DEPLOY_ID]`, con
  `DEPLOY_ID = VERCEL_GIT_COMMIT_SHA ?? "dev"` (auto-bust por deploy).
  `revalidate: 3600` es solo red de seguridad.
- `src/lib/payload/cache-tags.ts` — `pageTag(slug)` / `globalTag(slug)`,
  fuente de verdad única, más un wrapper de `revalidateTag` que es seguro
  fuera del contexto de request (seed, scripts).
- Invalidación real: on-demand, desde hooks `afterChange`/`afterDelete`.
  Pages invalida su propio `pageTag` (y el slug anterior si cambió); los 6
  globals invalidan su `globalTag`; Brands y EventCategories llaman a
  `revalidateAllPages()` porque un cambio ahí puede afectar cualquier landing.
- En Next 16 el `revalidateTag` se llama con profile `undefined` a propósito
  → purga dura inmediata (read-your-writes). Con `"max"` o `{expire:0}` sirve
  contenido viejo en el primer reload. No lo "arregles".
- `/admin` lee Payload directo, nunca cacheado.

Detalle y plan de migración a `use cache`:
[`docs/claude-context/07-caching-strategy.md`](docs/claude-context/07-caching-strategy.md).
Ojo: ese doc y el comentario de cabecera de `queries.ts` todavía justifican
la decisión citando "Next 15.5.18 pinneado", que ya no es cierto.

### Fechas de eventos

`src/lib/event-dates.ts` es la semántica compartida por los dos calendarios:
el día del evento se lee en **UTC** y "hoy" en **America/Bogota**. Así el
server y el navegador renderizan lo mismo (esto cerró un hydration mismatch
real con fechas guardadas como `T00:00:00Z`). Un evento vence al terminar su
día de fin. Cualquier lógica de fechas de evento pasa por ahí.

### Variables de entorno

`PAYLOAD_SECRET`, `DATABASE_URI`, `NEXT_PUBLIC_SITE_URL`,
`PAYLOAD_PUBLIC_SERVER_URL`, `BLOB_READ_WRITE_TOKEN` (uploads a Blob),
`AI_GATEWAY_API_KEY` (bloque de IA), `RESEND_API_KEY` / `RESEND_FROM_EMAIL`
(aún sin conectar). Ver `.env.example` — le falta `BLOB_READ_WRITE_TOKEN`.

---

## Convenciones de código

- **TypeScript strict**: nunca `any` sin justificación en comentario.
- **Tailwind v4**: tokens en `@theme inline`. Para valores precisos del
  Figma usa clases arbitrarias `text-[64px]` o style inline.
- **Componentes UI custom**: vienen de shadcn `style: new-york`,
  importan desde `@/components/ui`.
- **Imports absolutos**: usar `@/` (configurado en `tsconfig.json`).
- **Server components por default**, `"use client"` solo cuando se
  necesite (Framer Motion, hooks, event handlers).
- **Tipos generados**: `src/payload-types.ts` es **autogenerado** —
  nunca editar a mano. Regenera con `pnpm generate:types`.
- **Commits en español**, en presente, describiendo el efecto para el
  cliente y no el archivo tocado. El cuerpo explica el porqué y qué pasa con
  los datos existentes. Ej: `fix: la categoría manda sobre texto y color, y
la migración deja de mutar datos`.
- **Antes de abrir PR**: `pnpm type-check` en 0 y `pnpm lint`.

---

## Estado del proyecto (2026-07-31)

- ✅ Las 3 landings renderizan 100% desde Payload (page-builder + globals).
- ✅ Marcas, categorías de evento, representantes, header/footer/floating y
  Google Analytics son administrables sin deploy.
- ✅ Caché con invalidación on-demand.
- ✅ Upgrade a Next 16 + Payload 3.85 y uploads a Vercel Blob.
- ✅ Ronda de ajustes reportados por el cliente (jul-2026): orden y vigencia
  de los dos calendarios, WEB/REDES por marca, watch time con toggles,
  encuadre de Pauta, categorías administrables con estilo de badge por landing.
- ⏳ **Resend**: el form-builder está montado pero no hay envío de email —
  un submit hoy no le llega a nadie.
- ⏳ **SEO de páginas**: solo hay `metadata` en el layout raíz. Faltan
  metadata por landing, OG images, `sitemap.xml`, `robots.txt`.
- ⏳ **Accesibilidad y performance**: falta el pase de Lighthouse (Fase 6).
- ⏳ **BrandTabs.brandLogo**: bloqueado por assets del diseñador.

> [`docs/claude-context/06-roadmap.md`](docs/claude-context/06-roadmap.md)
> está congelado en 2026-06-10 y da por pendientes cosas que ya se
> entregaron. Úsalo como historia, no como estado.

---

## Documentación detallada

| Tema                                           | Archivo                                                                                        |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Vista general detallada del proyecto           | [`docs/claude-context/01-overview.md`](docs/claude-context/01-overview.md)                     |
| Workflow con Figma MCP + reglas de fidelidad   | [`docs/claude-context/02-figma-workflow.md`](docs/claude-context/02-figma-workflow.md)         |
| Arquitectura Payload CMS + mapping bloques     | [`docs/claude-context/03-payload-cms.md`](docs/claude-context/03-payload-cms.md)               |
| Design system (tokens, colores, tipografía)    | [`docs/claude-context/04-design-system.md`](docs/claude-context/04-design-system.md)           |
| Spec de animaciones, parallax, performance     | [`docs/claude-context/05-animations-effects.md`](docs/claude-context/05-animations-effects.md) |
| Roadmap e historia de sprints (desactualizado) | [`docs/claude-context/06-roadmap.md`](docs/claude-context/06-roadmap.md)                       |
| Estrategia de caché e invalidación             | [`docs/claude-context/07-caching-strategy.md`](docs/claude-context/07-caching-strategy.md)     |
| Templates de prompts                           | [`docs/claude-context/07-prompt-templates.md`](docs/claude-context/07-prompt-templates.md)     |
| Instalación local paso a paso                  | [`docs/INSTALL.md`](docs/INSTALL.md)                                                           |
| Auditorías de fidelidad Figma y del upgrade    | [`docs/audits/`](docs/audits/)                                                                 |

---

## Links rápidos al Figma

| Vista                       | URL                                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Home Caracol Medios         | <https://www.figma.com/design/xorK9SgP6likPV59r58dYt/Mediakit-Caracol-%E2%80%94-Design-System--Copy-?node-id=334-1559> |
| Home Caracol Next (landing) | <https://www.figma.com/design/xorK9SgP6likPV59r58dYt/Mediakit-Caracol-%E2%80%94-Design-System--Copy-?node-id=347-1597> |
| Home Ditu (landing)         | <https://www.figma.com/design/xorK9SgP6likPV59r58dYt/Mediakit-Caracol-%E2%80%94-Design-System--Copy-?node-id=548-3733> |
| Sistema de diseño completo  | <https://www.figma.com/design/xorK9SgP6likPV59r58dYt/Mediakit-Caracol-%E2%80%94-Design-System--Copy-?node-id=0-1>      |

**fileKey** (para llamadas MCP): `xorK9SgP6likPV59r58dYt`
