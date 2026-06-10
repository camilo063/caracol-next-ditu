# 06 — Roadmap, Hecho, Pendiente

> Actualización: 2026-06-10. Sprint Caché — unstable_cache + invalidación on-demand vía hooks.

## Fases

- ✅ **Fase 1** — Setup repo, Next + Payload + Tailwind v4 + shadcn.
- ✅ **Fase 2** — Layout root, fonts, theming, design tokens.
- ✅ **Fase 3** — Bloques visuales 1:1 Figma con datos demo.
- ✅ **Fase 4** — Conexión 100% Payload ↔ Frontend.
  - ✅ **Sprint A** — Caracol Next + globals + seed (2026-06-09).
  - ✅ **Sprint B** — Home `/` → SiteSettings.homeContent (2026-06-09).
  - ✅ **Sprint C** — Ditu body (10 bloques + DituFooter). Completado 2026-06-09.
    - ✅ **Sprint C1** — Piloto page-builder: DituHero + DituVideoBlock (2026-06-09).
    - ✅ **Sprint C2** — 8 bloques restantes + footer-ditu (2026-06-09).
  - ✅ **Sprint Caché** — `unstable_cache` + `revalidateTag` on-demand (2026-06-10).
- ⏳ **Fase 5** — APIs externas (form-builder + Resend), AI Block.
- ⏳ **Fase 6** — QA, performance, accesibilidad, deploy producción.

## Hecho recientemente (Sprint Caché — 2026-06-10)

### Sprint Caché — `unstable_cache` + invalidación on-demand

- [x] **cache-tags.ts**: `pageTag(slug)` + `globalTag(slug)` — fuente de verdad centralizada.
- [x] **queries.ts**: 8 funciones envueltas en `unstable_cache`. keyParts: `[fnName, DEPLOY_ID]`.
      DEPLOY_ID = `VERCEL_GIT_COMMIT_SHA ?? 'dev'`. revalidate safety net: 3600s.
- [x] **Pages collection hook**: `afterChange` revalida `pageTag(doc.slug)` + el slug anterior
      si cambió. `afterDelete` revalida el slug borrado.
- [x] **Globals hooks** (6): `afterChange` revalida `globalTag(slug)` en HeaderCaracolNext,
      HeaderDitu, FooterCaracolNext, FooterDitu, FloatingContact, SiteSettings.
- [x] **Estrategia documentada**: `docs/claude-context/07-caching-strategy.md`. Justifica
      `unstable_cache` vs `use cache` (versión pinneada), plan de migración a Next 16.
- [x] `type-check` limpio (0 errores).

### Por qué NO `use cache` / `dynamicIO`

Next.js pinneado a 15.5.18 (Payload 3.34 requiere esa versión).
`use cache` es experimental en 15.x y requiere `dynamicIO: true`, que reescribe el rendering
model de toda la app. Migrar cuando Next 16+ sea validado con Payload. Ver doc 07.

## Hecho recientemente (Sprint C2 — 2026-06-09)

### Sprint C2 — Ditu `/ditu` completo en page-builder (10 bloques + footer)

- [x] **Fase 0**: `RenderBlocks.tsx` — `noReveal` convertido a `Set<AnyBlock["blockType"]>` data-driven.
      No-reveal: `hero`, `ditu-hero`, `ditu-video`, `ditu-audiencia`, `ditu-calendario`, `ditu-pauta`.
      Yes-reveal: `ditu-adn`, `ditu-tipo-contenido`, `ditu-canales`, `ditu-hablamos`.
- [x] **Fase 1**: 7 block configs nuevos (`ditu-audiencia`, `ditu-adn`, `ditu-tipo-contenido`,
      `ditu-canales`, `ditu-calendario`, `ditu-pauta`, `ditu-hablamos`).
      Video 2 reutiliza `ditu-video` config de C1 con background diferente.
- [x] **Fase 1 const→prop**: 5 componentes refactorizados (Audiencia, ADN, TipoContenido,
      Canales, Pauta). JSX/clases/animaciones INTACTOS. Calendario y Hablamos sin cambios.
- [x] **Fase 1 Components**: 7 `Component.tsx` thin wrappers creados.
      Canales: 3 arrays separados → `channelsByTab` Record. Pauta: `Category[]` mapeada.
- [x] **Fase 2**: `scripts/seed.ts` extendido (C2): 5 assets adicionales (icon-download,
      icon-livetv, icon-bolt, logo - Caracol placeholder, pauta-card.png).
      Page "ditu" actualizada con layout de 10 bloques completos. `upsertFooterDitu()` añadida.
      Idempotente confirmado (2ª corrida: 0 creates).
- [x] **Fase 3**: `src/app/(frontend)/ditu/page.tsx` — híbrido eliminado. 100% via
      `<RenderBlocks layout={dituPage?.layout} />`. `getFooterDitu()` añadida a queries.
- [x] **Fase 4**: `type-check` limpio (0 errores).
- [x] **Fase 5**: `src/globals/FooterDitu.ts` — `encuentranosLabel` añadido como campo nuevo.
      `footerSharedFields` mantenidos (additive-only, sin drops). `getFooterDitu()` en queries.ts.
      `DituFooter` wired desde global: `socialLinks` + `encuentranosLabel`.

### Assets sembrados en C2

| Asset                | Media# | Propósito                        |
| -------------------- | ------ | -------------------------------- |
| `icon-download.svg`  | #26    | Stat card Descargas              |
| `icon-livetv.svg`    | #27    | Stat card Dispositivos           |
| `icon-bolt.svg`      | #28    | Stat card Pico                   |
| `logo - Caracol.svg` | #29    | Placeholder logos 11 canales     |
| `pauta-card.png`     | #30    | Placeholder 12 formatos de pauta |

Todos los campos de imagen visibles hoy están sembrados (cero null gaps).
Reemplazos: cada logo de canal se puede actualizar independientemente desde `/admin`.

## Hecho recientemente (Sprint C1 — 2026-06-09)

### Sprint C1 — Ditu `/ditu` piloto page-builder (2 bloques)

- [x] **Fase 0**: `docs/audits/2026-06-09-ditu-layout-map.md` — mapa visual completo
      de 9 bloques + RevealSection + backgrounds + assets. Juntura bloque 2→3 analizada.
- [x] **Fase 1a**: `src/blocks/DituHero/config.ts` — Block Payload `"ditu-hero"`.
      Campos: `anchorId`, `stickerText`, `buttons[]` (label, href, iconKey, iconMedia upload).
- [x] **Fase 1b**: `src/blocks/DituVideo/config.ts` — Block Payload `"ditu-video"` (sin schema previo).
      Campos: `anchorId`, `image` (upload), `alt`, `background` (text CSS).
- [x] **Fase 1c**: `src/components/marketing/ditu-hero.tsx` const→prop:
      `anchorId` → `id={anchorId ?? "inicio"}`, `btn.iconUrl` override sobre `ICON_PATHS`.
      JSX/clases/animaciones INTACTOS.
- [x] **Fase 1d**: `src/blocks/index.ts` — `DituHeroBlock` y `DituVideoBlock` añadidos
      a `allBlocks[]` y re-exports.
- [x] **Fase 1e**: `src/blocks/RenderBlocks.tsx` — imports + cases `"ditu-hero"`/`"ditu-video"`.
      Ambos excluidos de `RevealSection` (`noReveal` condition).
- [x] **Fase 1f**: `src/blocks/types.ts` — `DituHeroBlockProps` y `DituVideoBlockProps`.
- [x] **Fase 1g**: `src/blocks/DituHero/Component.tsx` — thin wrapper: Payload block → DituHero props.
      `iconMedia` → `mediaUrl()` → `iconUrl`. `heading`/`description` = `undefined` (fallback JSX).
- [x] **Fase 1h**: `src/blocks/DituVideo/Component.tsx` — thin wrapper: `image` → `mediaUrl()` → `src`.
- [x] **Fase 1i**: `npm run generate:types` — tipos `ditu-hero` y `ditu-video` generados en
      `payload-types.ts`.
- [x] **Fase 2a**: `getDituPage()` añadida a `src/lib/payload/queries.ts`.
- [x] **Fase 2b**: `scripts/seed.ts` extendido (`Sprint A + B + C1`):
      `uploadDituPilotAssets()` (4 assets: googleplay.svg, appstore.svg, tv.svg, video-block.png).
      `upsertDituPage()` crea/actualiza Page slug="ditu" landing="ditu" con layout de 2 bloques piloto.
- [x] **Fase 3**: `src/app/(frontend)/ditu/page.tsx` híbrido:
      bloques 1-2 via `<RenderBlocks layout={dituPage?.layout} />`,
      bloques 3-9 hardcoded exactamente igual que antes. `DituHero` removido del import
      (ya no se usa directamente).
- [x] **Fase 4**: `type-check` limpio. Sin delta visual en top (Hero + Video) — juntura 2→3 OK.

### Assets provisionales Ditu (C1)

Todos los assets sembrados son los mismos que hoy muestra el front (no hay huecos):

- `googleplay.svg`, `appstore.svg`, `tv.svg` — iconos reales (usados en prod).
- `video-block.png` — placeholder de la pantalla Ditu. Reemplazar con captura real.

## Hecho recientemente (Sprint B — 2026-06-09)

### Sprint B — Home `/` → SiteSettings.homeContent

- [x] **Fase 0**: `src/fields/richHeading.ts` — field reutilizable para headings mixtos
      (array de `{ text, weight: regular|semibold|extrabold }`).
- [x] **Fase 0**: `SiteSettings.ts` extendido con tab nombrado `homeContent` (crea namespace
      `settings.homeContent.*`). Campos: logoCaracolMedios (upload), digitalLabel,
      eyebrow, heading (richHeading), contactLabel, brands.{caracolNext,ditu}
      (logo upload + description array + ctaLabel + href), stats[] (icon upload,
      numericValue, prefix, suffix, label, accent, lgWidth), copyright.
- [x] **Fase 1**: `getSiteSettings()` añadida a `src/lib/payload/queries.ts`.
- [x] **Fase 2**: `scripts/seed.ts` extendido con `uploadHomeAssets()` y
      `upsertHomeContent()`. 5 assets de `/public/home/` subidos (logo + 4 iconos).
      2da corrida = 0 Media creados (idempotencia confirmada, 13 reutilizados).
- [x] **Fase 3**: `hub-landing.tsx` parametrizado (const→prop).
      Props nuevas: `logoCaracolMedios?: string | null`, `digitalLabel?: string | null`,
      `stats[].iconUrl?: string | null`. `CaracolMediosLogo` acepta `logoSrc`/`digitalLabel`.
      `MetricCard` usa `s.iconUrl ?? ICON_PATHS[s.icon]`. JSX/clases/animaciones INTACTOS.
- [x] **Fase 4**: `src/app/(frontend)/page.tsx` reescrito como server component async.
      `Promise.all([getSiteSettings(), getFloatingContact()])`. Heading ReactNode construido
      desde partes array. Stats con iconUrl desde Payload Media. Representatives desde
      floating-contact. Fallbacks completos para pixel-identicidad.
- [x] **Fase 5**: `generate:types` + `type-check` pasan sin errores.
- [x] **Fase 5 ghost**: Logo (`logoCaracolMedios`) → Payload retorna
      `/api/media/file/logo-caracol-medios.svg` (override del fallback `/home/...`). ✅
      Icons stats → Payload retorna `/api/media/file/icon-*.svg` (override de `ICON_PATHS`). ✅
      Ambos campos son funcionales (no fantasmas).
- [x] **Fase 6**: Roadmap actualizado (este archivo).

## Hecho recientemente (Sprint A — 2026-06-09)

### Sprint A — Conexión Payload ↔ Frontend: Caracol Next + globals + seed

- [x] **Fase 0**: `FooterCaracolNext` tone `"minimal"` añadido a `shared-footer-fields.ts`
      (no estaba en el schema; `SiteFooter` ya lo aceptaba).
- [x] **Fase 1**: `src/lib/payload/queries.ts` — funciones tipadas centralizadas:
      `getCaracolNextPage()`, `getHeaderCaracolNext()`, `getHeaderDitu()`,
      `getFooterCaracolNext()`, `getFloatingContact()`.
- [x] **Fase 2**: `scripts/seed.ts` — seed idempotente. Idempotencia por `alt` en Media
      (Payload renombra PNG→WebP con sufijo; `filename` no es estable),
      por `slug` en Pages, y `updateGlobal` en globals. Prueba: 2 corridas = 0 duplicados.
      8 brand icons subidos (Media #1-8). Page "caracol-next" creada. 4 globals poblados.
- [x] **Fase 3**: `/caracol-next/page.tsx` — async, datos desde Payload.
      `caracolNextDemoLayout`, `caracolNextHeaderDemo`, `caracolNextFooterDemo`,
      `floatingContactDemo` reemplazados por `getCaracolNextPage()` + queries.
- [x] **Fase 4**: `/ditu/page.tsx` — header y floating desde Payload.
      `dituHeaderDemo` → `getHeaderDitu()`. `floatingContactDemo` → `getFloatingContact()`.
      Cuerpo Ditu sigue hardcoded → Sprint C.
- [x] **Fase 5**: `generate:types` + `type-check` pasa sin errores.
      4 `@ts-expect-error` removidos (ya innecesarios post-generate).
      `Contact/Component.tsx`: `heading ?? ""` para tipo `string | null | undefined`.
- [x] **Fase 5 extra**: Verificación `brandLogo` → **FIELD FANTASMA** (ver abajo).
- [x] **Fase 6**: Roadmap actualizado (este archivo).

### Field fantasma documentado: BrandTabs.brandLogo

`BrandTabsBlock.tabs[].brandLogo` **no renderiza** aunque esté lleno en el admin.

- **Archivo**: [`src/blocks/BrandTabs/Component.tsx`](../../src/blocks/BrandTabs/Component.tsx)
  líneas 234-238.
- **Comportamiento**: el componente computa `cmsLogoUrl = mediaUrl(tab.brandLogo)` y
  `logoUrl = wordmarkLogoUrl ?? cmsLogoUrl`, pero `logoUrl` nunca se usa en el JSX.
  La columna derecha del panel solo renderiza el `avatarUrl` (hardcoded path).
- **Consecuencia**: para brands con SVG hardcoded (CaracolTV, GolCaracol, Caracol Sports,
  BumBox, Volk), `brandLogo` del CMS es completamente ignorado. Para brands sin SVG
  hardcoded (BluRadio, La Kalle), el campo tampoco renderiza porque el `<Image>` del
  wordmark simplemente no está escrito.
- **Comentario en código**: `{/* Wordmark logo centrado — pendiente de assets definitivos */}`.
- **No corregido**: fuera de scope Sprint A (requiere cambio visual).
- **Sprint target**: Sprint B (cuando el diseñador entregue los assets finales).

## Hecho recientemente (sesión bugfix mayo 2026)

### Home (`/`)

- [x] Layout centrado con `mx-auto max-w-[1377px]`.
- [x] Line-height del título responsive (no 80px fijo).
- [x] Wordmark Ditu sin deformación (inline SVG 92×32 con `currentColor`).
- [x] Counters animados con cubic-bezier OutQuint (2.4s).
- [x] Stagger entrance del hero (motion.main + variants).
- [x] Hover en CTAs ("Conoce X" y "Contáctenos") con shadow + scale.
- [x] Mobile: tarjetas de producto al 50% cada una (no más Next ocupando todo).

### Caracol Next (`/caracol-next`)

- [x] RevealSection más conservadora (`rootMargin -10%`).
- [x] Header scroll-up suave (thresholds 8/12px delta).
- [x] Hamburguesa blanca cuando bg navy.
- [x] Click-outside + ESC cierran menú mobile.
- [x] Hero: gap reducido eyebrow→título; label responsive.
- [x] BumBox y BluRadio pie chart: colores distintos por slice.
- [x] "Una marca para cada audiencia": removido bg/marco redondeado envolvente.
- [x] Calendario: radius 100px, cards sin ancho fijo en lg, mobile slider llega al borde.
- [x] Pauta Digital: format pills `rounded-[6px]`, chevron 16px thin.
- [x] Cierre/Contacto: hover button con bg darker + shadow.

### Ditu (`/ditu`)

- [x] Hero: botones `flex-row flex-wrap` centrados.
- [x] Cifras: flex en vez de grid (large card 40%, otras 28%).
- [x] ADN: pie y bar charts re-animan al entrar viewport (useInView + remount).
- [x] Canales: `min-height` para evitar saltos al cambiar tab.
- [x] Calendario: pato reubicado top-right (no sobre título).
- [x] Calendario: dots paginan de a 4 (3 dots para 12 events).
- [x] Footer mobile: `pb-24` para no tapar redes con FloatingContact.

### Global

- [x] `cursor-pointer` y hovers en todos los elementos clickeables clave.
- [x] FormatModal X redesigned (32×32 sin background circular).
- [x] FormatModal mobile tabs: `flex-wrap` (no scroll horizontal).
- [x] HomeContactModal X y FloatingContact con hover refinado.

## Pendiente — alta prioridad

### 1. Conexión Payload ↔ Frontend (Fase 4)

- [x] ~~**Caracol Next `/caracol-next`**~~ → Sprint A ✅
- [x] ~~**Header / Footer / FloatingContact** (Caracol Next + Ditu header)~~ → Sprint A ✅
- [x] ~~**Seed inicial**~~ → Sprint A ✅
- [x] ~~**Home `/`** (Sprint B)~~ → ✅ Sprint B completado.
- [x] ~~**Ditu body piloto** (Sprint C1)~~ → ✅ Sprint C1 completado (DituHero + DituVideoBlock).
- [ ] **Ditu body completo** (Sprint C2): 7 bloques restantes (DituAudiencia, DituAdn,
      DituTipoContenido, DituCanales, DituCalendario, DituPauta, DituHablamos) + DituFooter global.
- [ ] **BrandTabs.brandLogo wordmark**: `<Image src={logoUrl}>` faltante en la columna
      derecha del panel — **bloqueado por assets del diseñador**.
      Tarea: completar render de brandLogo cuando el diseñador entregue los SVGs finales.

### 2. Bugs visuales Figma — segunda pasada

Que quedaron pendientes (no se pudieron verificar a profundidad sin más
contexto del Figma):

- [ ] Brand audience tab: imágenes deformadas en algunos brands
      (revisar aspect-ratio vs Image `width/height` específico por brand).
- [ ] DITU Cifras: línea divisoria dashed cyan y íconos de Watch Time
      coinciden con Figma node específico (validar 738:2713).
- [ ] DITU ADN: "piquitos" decorativos de entrada/salida (laterales) —
      identificar nodes Figma y replicar.
- [ ] DITU Pauta: el menú vertical no sigue correctamente la
      navegación al hacer scroll (validar IntersectionObserver).
- [ ] DITU Redes (mobile): elementos se superponen — revisar layout
      `dn1-dn6` en `DituAudienciaBlock`.

### 3. Animaciones + Parallax — segunda fase

- [ ] Parallax en sections internas (no solo hero):
  - Calendario Caracol Next: bg con scroll velocity ≠ 1.
  - Pauta Digital: shadow halos animados al scroll.
- [ ] Decoraciones flotantes en ADN Ditu ("piquitos" como SVGs animados).
- [ ] Hover micro-interacciones en stickers Ditu (skew/rotate sutil).
- [ ] Cursor custom estilo Caracol/Ditu (a definir con Camilo).
- [ ] Page transitions entre `/`, `/caracol-next`, `/ditu` (Framer Motion
      o ViewTransitions API).

## Pendiente — media prioridad

### 4. Form de contacto (Fase 5)

- [ ] Habilitar `@payloadcms/plugin-form-builder` en `payload.config.ts`.
- [ ] Crear forms desde admin: "Contacto Caracol Next", "Contacto Ditu".
- [ ] `ContactBlockComponent` con form dinámico (campos desde Payload).
- [ ] Submit handler que POSTea a `/api/form-submissions`.
- [ ] Hook afterChange que envía email vía Resend.
- [ ] Variables `RESEND_API_KEY` + `RESEND_FROM_EMAIL` en Vercel.

### 5. AI Block (Fase 5)

- [ ] Definir scope del block IA con Camilo (¿chatbot? ¿generación de
      copy? ¿recomendador?).
- [ ] Habilitar Vercel AI Gateway en `payload.config.ts` o directamente
      en la route handler.
- [ ] Usar AI SDK v6 con strings tipo `"provider/model"` (default
      Anthropic/Claude vía gateway).
- [ ] Implementar `AIRecommendationBlockComponent` con la lógica.

### 6. Accesibilidad

- [ ] Lighthouse Accessibility >= 95 en las 3 páginas.
- [ ] Validar contraste de cyan (#77EDED) sobre violeta oscuro (#12082D)
      en headings Ditu.
- [ ] `aria-label` en todos los IconButtons, social links, slider dots.
- [ ] Focus rings visibles (no `outline-none` sin reemplazo).
- [ ] Navegación por teclado en tabs + modales (ya parcialmente
      implementada con `role="tab"`).

### 7. Performance

- [ ] Lighthouse Performance >= 90 desktop, >= 80 mobile.
- [ ] Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1.
- [ ] Code-split de bloques pesados (Recharts, Embla).
- [ ] Compress + lazy-load de todas las imágenes Figma exportadas.
- [ ] Pre-render estático donde sea posible (Next 15 SSG).

### 8. SEO

- [ ] OpenGraph images por landing.
- [ ] `metadata` en cada page (title, description, OG, Twitter).
- [ ] `sitemap.xml` y `robots.txt`.
- [ ] Schema.org Organization JSON-LD.

## Pendiente — baja prioridad / nice-to-have

- [ ] Modo oscuro / claro toggle (probablemente NO se necesita; el
      Mediakit es brand-driven).
- [ ] Internacionalización (es-CO default; en/pt-BR si el cliente lo
      pide).
- [ ] Versionado de Pages en Payload (drafts + publishing workflow).
- [ ] Analytics (Vercel Analytics o GA4).
- [ ] CMS plugins adicionales: search, redirects, audit log.

## Decisiones técnicas pendientes con Camilo

1. **Ditu como Page o como globals**: ¿el cliente edita Ditu con un
   page builder (`layout: [...]` array de blocks) o con globals
   separados por bloque?
2. **Form-builder vs forms hardcoded**: ¿usar el plugin o implementar
   un form fijo por landing?
3. **AI Block scope**: ¿qué hace exactamente el AIRecommendationBlock?
4. **Hosting de assets pesados**: ¿videos Ditu via Vercel Blob, S3 o
   Mux?
5. **Cursor custom**: ¿queremos? ¿qué estilo?
6. **Page transitions**: ¿Framer Motion o ViewTransitions API?

## Estado de los puertos / dev server

- Dev server SIEMPRE en `http://localhost:3000`.
- `.claude/launch.json` tiene `autoPort: false`.
- Si 3000 está ocupado → `lsof -i :3000` y matar el PID antes de arrancar.
- Si hydration mismatch raro → `npm run devsafe` (limpia `.next` y rearranca).

## Cómo usar este roadmap para generar prompts

El patrón recomendado es: leer una sección, identificar un bloque
acotado de trabajo (2-3 items relacionados), y construir un prompt
que cite los archivos relevantes y los Figma nodes.

Ver [`07-prompt-templates.md`](07-prompt-templates.md) para los
templates listos para copiar/pegar.
