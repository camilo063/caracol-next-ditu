# Auditoría CMS ↔ Frontend — 2026-06-09

## 1. Resumen Ejecutivo

El portal tiene esquemas Payload bien definidos para el ~80% del contenido editable (todos los bloques de Caracol Next, globals de Header/Footer/FloatingContact), pero **ninguno de esos schemas está conectado al frontend todavía**. El 100% de las páginas sirven datos de `src/lib/demo-data.ts` o literales hardcoded en los componentes.

Los cuatro huecos más grandes son:

1. **Home (`/`)**: 100% hardcoded en `src/app/(frontend)/page.tsx`. No existe schema `homeContent` en `SiteSettings`; el global `site-settings` solo tiene SEO, contacto fallback y theme defaults. El logo de Caracol Medios, el heading complejo, las métricas, los textos de los product cards y el copyright no tienen ningún field Payload.
2. **Ditu (`/ditu`)**: 100% defaults internos en cada componente (`ditu-hero.tsx`, `ditu-audiencia.tsx`, `ditu-adn.tsx`, etc.). No existe ningún schema ni global Ditu dedicado para ninguno de sus ~9 bloques. La arquitectura (¿Page con bloques o globals separados?) está sin decidir.
3. **Caracol Next (`/caracol-next`)**: Los schemas de bloque están completos y bien diseñados, pero la page lee `caracolNextDemoLayout` de demo-data. La sustitución a `payload.find({ collection:"pages" })` no está implementada.
4. **Header / Footer / FloatingContact**: Los globals existen y los schemas están definidos, pero los tres componentes consumen objetos demo (`caracolNextHeaderDemo`, `dituHeaderDemo`, `caracolNextFooterDemo`, `dituFooterDemo`, `floatingContactDemo`) en lugar de llamadas `payload.findGlobal()`.

Bloqueo arquitectónico Ditu: los ~9 bloques visuales de `/ditu` son componentes custom (`ditu-*.tsx`) que no usan `RenderBlocks` ni reciben props desde Payload. Cada uno tiene datos const hardcoded internamente (stats, canales, tabs, eventos, categorías de pauta). Hasta que se decida si Ditu es una `Page` con page-builder o usa globals dedicados, es imposible conectar CMS sin romper la arquitectura actual.

Estimación de administrabilidad actual: **0% real** (todo viene de demo o hardcoded). Los schemas Payload representan la intención pero no están wired al front.

---

## 2. Tablas por Superficie

### 2.1 Home (`/`)

El componente es `src/components/marketing/hub-landing.tsx`. Los datos entran directamente como props desde `src/app/(frontend)/page.tsx`.

| Sección                                                                               | Schema (path / SIN-SCHEMA)                             | Estado           | Campos OK | Campos FIELD-FALTA                                                                                                                                    | Delta Figma                                                                                   |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Logo Caracol Medios + "DIGITAL"                                                       | SIN-SCHEMA                                             | HARDCODED        | —         | `logoCaracolMedios` (imagen SVG), `digitalLabel` (texto "DIGITAL")                                                                                    | No (logo hardcoded como `<img src="/home/logo-caracol-medios.svg">`, texto "DIGITAL" literal) |
| Eyebrow hero                                                                          | SIN-SCHEMA                                             | HARDCODED        | —         | `eyebrow` (texto "Unidad digital #1 en Colombia")                                                                                                     | No                                                                                            |
| Heading mixto (spans bold/semibold)                                                   | SIN-SCHEMA                                             | HARDCODED        | —         | `headingNormal` (partes Regular/SemiBold), `headingBold` (partes ExtraBold)                                                                           | No                                                                                            |
| CTA "Contáctenos"                                                                     | SIN-SCHEMA                                             | HARDCODED        | —         | `contactLabel` (string "Contáctenos"), `contactHref` (opcional)                                                                                       | No                                                                                            |
| Product card Caracol Next (título wordmark, descripción, ctaLabel, href)              | SIN-SCHEMA                                             | HARDCODED        | —         | `brands.caracolNext.description` (array de strings), `brands.caracolNext.ctaLabel`, `brands.caracolNext.href`, `brands.caracolNext.logo` (upload SVG) | No                                                                                            |
| Product card Ditu (título wordmark, descripción, ctaLabel, href)                      | SIN-SCHEMA                                             | HARDCODED        | —         | `brands.ditu.description`, `brands.ditu.ctaLabel`, `brands.ditu.href`, `brands.ditu.logo`                                                             | No                                                                                            |
| Metric cards (4 stats con icon, numericValue, prefix, suffix, label, accent, lgWidth) | SIN-SCHEMA                                             | HARDCODED        | —         | `stats[].icon` (select), `stats[].numericValue`, `stats[].prefix`, `stats[].suffix`, `stats[].label`, `stats[].accent`, `stats[].lgWidth`             | No                                                                                            |
| Iconos de métricas (4 SVGs en `/home/`)                                               | SIN-SCHEMA                                             | HARDCODED        | —         | `stats[].iconFile` (upload por stat)                                                                                                                  | No                                                                                            |
| Copyright pill                                                                        | SIN-SCHEMA                                             | HARDCODED        | —         | `copyright` (string "©2026 Caracol Comercial Digital")                                                                                                | No                                                                                            |
| Representantes del modal "Contáctenos"                                                | `src/globals/FloatingContact.ts` → `representatives[]` | DEMO             | —         | — (schema existe)                                                                                                                                     | No                                                                                            |
| Gradientes bg decorativos (posición/colores)                                          | SIN-SCHEMA                                             | HARDCODED en JSX | —         | — (puramente decorativo)                                                                                                                              | No                                                                                            |

**Resumen Home**: 0 campos conectados a Payload. El global `SiteSettings` (`src/globals/SiteSettings.ts`) NO tiene ningún field de Home Content (el TODO de Fase 4 mencionado en los docs no está implementado). Los representantes que abre el modal usan `floatingContactDemo`, no `payload.findGlobal("floating-contact")`.

---

### 2.2 Caracol Next (`/caracol-next`)

La page `src/app/(frontend)/caracol-next/page.tsx` consume `caracolNextDemoLayout` de `src/lib/demo-data.ts`. Los schemas de bloque en `src/blocks/*/config.ts` están completos. Los componentes `Component.tsx` de cada bloque SÍ leen las props que les llegan, por lo que la conexión es un problema de **la page.tsx**, no de los componentes.

| Sección / Bloque                                         | Schema (path)                             | Estado | Campos OK (en config.ts)                                                                                                                                                                                                                                                                             | Campos FIELD-FALTA  | Delta Figma                                                                                                                                  |
| -------------------------------------------------------- | ----------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Header**                                               | `src/globals/HeaderCaracolNext.ts`        | DEMO   | `logo`, `logoDark`, `navAnchors[].label`, `navAnchors[].anchorId`, `ctaButton.enabled/label/href/variant`, `sticky`                                                                                                                                                                                  | — (schema completo) | No — `caracolNextHeaderDemo` no usa `logoUrl`, el front cae al `fallbackWordmark` (SVG inline)                                               |
| **Hero** (`blockType: "hero"`)                           | `src/blocks/Hero/config.ts`               | DEMO   | `anchorId`, `eyebrow`, `heading`, `headingBold`, `subheading`, `keyStats[].*`, `backgroundImage`, `backgroundVideo`, `brandIcons[].brand`, `brandIcons[].icon`, `primaryCta.*`, `secondaryCta.*`, `tone`                                                                                             | — (schema completo) | No                                                                                                                                           |
| **Audiencia + Redes** (`blockType: "audience-networks"`) | `src/blocks/AudienceNetworks/config.ts`   | DEMO   | `anchorId`, `eyebrow`, `heading`, `description`, `audience.reach`, `audience.reachLabel`, `audience.reachSuffix`, `audience.breakdown[]*`, `networks[].*`, `highlightedNetwork`                                                                                                                      | — (schema completo) | No                                                                                                                                           |
| **Marcas (BrandTabs)** (`blockType: "brand-tabs"`)       | `src/blocks/BrandTabs/config.ts`          | DEMO   | `anchorId`, `eyebrow`, `heading`, `description`, `tabs[].brand`, `tabs[].displayName`, `tabs[].brandLogo`, `tabs[].brandColor`, `tabs[].tagline`, `tabs[].whyChoose`, `tabs[].webMetrics.*`, `tabs[].audience.*`, `tabs[].networks[].*`, `tabs[].adFormats[].*`, `tabs[].ctaContact.*`, `defaultTab` | — (schema completo) | Sí — logos de marca (`brandLogo`) en demo-data son `undefined as never`, no se cargan imágenes reales                                        |
| **Calendario** (`blockType: "key-moments"`)              | `src/blocks/KeyMomentsCalendar/config.ts` | DEMO   | `anchorId`, `eyebrow`, `heading`, `description`, `events[].*`, `displayMode`, `ctaText.*`                                                                                                                                                                                                            | — (schema completo) | No                                                                                                                                           |
| **Branded Content** (`blockType: "branded-content"`)     | `src/blocks/BrandedContent/config.ts`     | DEMO   | `anchorId`, `eyebrow`, `heading`, `description`, `categories[].key`, `categories[].label`, `categories[].heading`, `categories[].description`, `categories[].multimedia.*`, `categories[].secondaryTabs[].*`, `defaultIndex`                                                                         | — (schema completo) | Sí — multimedia usa YouTube placeholder `dQw4w9WgXcQ`, no videos reales; overlays de logo (`logoTopLeft`, `logoTopRight`) en demo son `null` |
| **Pauta Digital** (`blockType: "ad-formats"`)            | `src/blocks/AdFormats/config.ts`          | DEMO   | `anchorId`, `eyebrow`, `heading`, `description`, `formats[].name`, `formats[].brand`, `formats[].category`, `formats[].image`, `formats[].specs`, `formats[].downloadUrl`, `formats[].modal.*`, `displayMode`, `filtersEnabled`, `footerCta.*`                                                       | — (schema completo) | Sí — `formats[].image` es `null` en todos los items demo; mockups de formato sin imágenes reales                                             |
| **Contacto** (`blockType: "contact"`)                    | `src/blocks/Contact/config.ts`            | DEMO   | `anchorId`, `eyebrow`, `heading`, `headingEmphasis`, `description`, `ctaButton.*`, `form` (relationship a `forms`), `representatives[].*`, `layout`                                                                                                                                                  | — (schema completo) | No — `form` es `null` (form-builder no está habilitado aún; está importado en `payload.config.ts` pero no hay forms creados)                 |
| **Footer**                                               | `src/globals/FooterCaracolNext.ts`        | DEMO   | `logo`, `tagline`, `columns[].heading`, `columns[].links[].*`, `socialLinks[].*`, `bottomLine`, `useWave`, `tone`                                                                                                                                                                                    | — (schema completo) | No                                                                                                                                           |
| **FloatingContact**                                      | `src/globals/FloatingContact.ts`          | DEMO   | `enabled`, `buttonLabel`, `buttonIcon`, `panelHeading`, `panelDescription`, `representatives[].*`, `position`                                                                                                                                                                                        | — (schema completo) | No                                                                                                                                           |

**Resumen Caracol Next**: Los schemas de los 7 bloques del page builder + Header + Footer + FloatingContact están **100% completos**. La brecha es exclusivamente de conexión: la page.tsx necesita reemplazar `caracolNextDemoLayout` por `payload.find(...)`, y `SiteHeader`/`SiteFooter`/`FloatingContact` necesitan reemplazar los objetos demo por `payload.findGlobal(...)`.

---

### 2.3 Ditu (`/ditu`)

La page `src/app/(frontend)/ditu/page.tsx` instancia directamente los componentes `ditu-*.tsx` sin pasarles props de Payload. Cada componente tiene sus datos como constantes internas.

| Sección / Componente                                                            | Schema Payload (path / SIN-SCHEMA)                                                                                                                                                         | Estado                             | Datos actuales (fuente)                                                                                                                                                                                    | Campos visibles sin field Payload                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Delta Figma                                                                                                                               |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Header Ditu**                                                                 | `src/globals/HeaderDitu.ts` (slug: `"header-ditu"`)                                                                                                                                        | DEMO                               | `dituHeaderDemo` en demo-data.ts                                                                                                                                                                           | — (schema existe)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | No                                                                                                                                        |
| **DituHero** (`src/components/marketing/ditu-hero.tsx`)                         | SIN-SCHEMA dedicado                                                                                                                                                                        | HARDCODED (defaults en componente) | Defaults internos de `DituHero`: `stickerText="TU MARCA"`, `headingRest` (JSX inline), `description` (JSX inline con span bold cyan), `buttons[]` (3 items: Google Play/App Store/Portal web con href="#") | `stickerText`, `heading` (texto plano + marcado), `description` (texto + énfasis rich), `buttons[].label`, `buttons[].href`, `buttons[].icon`, bg gradient (hardcoded CSS)                                                                                                                                                                                                                                                                                                                                      | Sí — sticker comentado en el código (`<!-- sticker absolute -->` desactivado), parallax bg imagen comentado (`/ditu/hero-bg.png` sin uso) |
| **DituVideoBlock** (primera instancia)                                          | SIN-SCHEMA                                                                                                                                                                                 | HARDCODED                          | Props hardcoded en page.tsx: `src="/ditu/video-block.png"` (default), `background` (default)                                                                                                               | `src` (imagen/video), `alt`, `background` (CSS)                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | No                                                                                                                                        |
| **DituAudienciaBlock** (`src/components/marketing/ditu-audiencia.tsx`)          | SIN-SCHEMA                                                                                                                                                                                 | HARDCODED (const internas)         | `DEFAULT_STATS` (3 stat cards), `DEFAULT_DEVICES` (4 device cards con minutos), `DEFAULT_NETWORKS` (6 redes con followers), texto del sticker, headings, fuente                                            | `stickerText` ("Las cifras que mueven a Ditu"), `heading` ("Cada mes, millones de pantallas prendidas."), `stats[].label`, `stats[].value`, `stats[].description`, `stats[].icon`, `watchTime.value` (60 MIN hardcoded), `watchTime.label`, `watchTime.description`, `devices[].label`, `devices[].minutes`, `networks[].network`, `networks[].followers`, `totalFollowersHeadline` (prop existe pero default hardcoded "+1.7M"), `fuenteTop` (texto fuente hardcoded), `fuenteBottom` (texto fuente hardcoded) | Sí — línea divisoria dashed cyan (`738:2713`) pendiente de validación; redes mobile superpuestas                                          |
| **DituAdnBlock** (`src/components/marketing/ditu-adn.tsx`)                      | Parcial: `src/blocks/AudienceProfile/config.ts` (slug: `"audience-profile"`) + `src/blocks/Estratos/config.ts` (slug: `"estratos"`) — pero el componente NO usa estos bloques              | HARDCODED (const internas)         | `GENDER_DATA` (52% Hombres / 48% Mujeres), `AGE_BARS` (6 rangos con valores Figma), `NSE_CARDS` (4 estratos), textos de headings y descripciones                                                           | `stickerText` ("ADN DITU"), `heading` ("Sabemos a quién le hablas."), `genderSplit.malePercent`, `genderSplit.maleLabel`, `genderSplit.femalePercent`, `genderSplit.femaleLabel`, `ageBars[].label`, `ageBars[].value`, `nseHeading` ("y dónde encontrarlo"), `nseDescription` (texto NSE), `nseCards[].label`, `nseCards[].value`, `footnote` (fuente TGI CO 2025), `descriptionGender` ("52% nos prefieren"), `peakLabel` ("Pico: 55-64 años")                                                                | Sí — "piquitos" decorativos de entrada/salida laterales pendientes                                                                        |
| **DituTipoContenidoBlock** (`src/components/marketing/ditu-tipo-contenido.tsx`) | Parcial: `src/blocks/ContentType/config.ts` (slug: `"content-type"`) — no consumido                                                                                                        | HARDCODED (const internas)         | `TABS` (3 items: FAST / Simulcasts en vivo / VOD Catchup)                                                                                                                                                  | `stickerText` ("tipo de contenido"), `heading` (2 líneas), `tabs[].label`, `tabs[].description`, `autoplayInterval` (prop existe), `defaultIndex` (prop existe)                                                                                                                                                                                                                                                                                                                                                 | No                                                                                                                                        |
| **DituCanalesBlock** (`src/components/marketing/ditu-canales.tsx`)              | Parcial: `src/blocks/OurChannels/config.ts` (slug: `"our-channels"`) — no consumido                                                                                                        | HARDCODED (const internas)         | `CHANNELS_BY_TAB` (3 tabs: envivo/fast/aliados con arrays de channels), logos placeholder genérico `/logos/logo - Caracol.svg`                                                                             | `stickerText` ("Nuestros canales"), `heading` (2 partes), `subtitle` ("La tuya está esperando por verte."), `tabs[].key`, `tabs[].label`, `channels[tab][].id`, `channels[tab][].name`, `channels[tab][].logo` (imagen real por canal), tab navigation labels, `actionIconUrl` (imagen decorativa `/ditu/icons/action-icon.svg`)                                                                                                                                                                                | Sí — logos reales de cada canal sin entregar; todos muestran `/logos/logo - Caracol.svg` como placeholder                                 |
| **DituCalendarioBlock** (`src/components/marketing/ditu-calendario.tsx`)        | Parcial: `src/blocks/KeyMomentsCalendar/config.ts` (slug: `"key-moments"`) — no consumido. El componente ACEPTA prop `events?: CalendarEvent[]` pero el call en page.tsx NO pasa ese prop. | DEMO (const interna `DEMO_EVENTS`) | 14 eventos hardcoded en el componente con dateLabel, title, subtitle, category, badgeVariant                                                                                                               | `stickerText` ("ESTO SE VIENE"), `calendarHeading` ("Calendario"), `subtitle` ("Los momentos que no te puedes perder."), `events[].dateLabel`, `events[].startDate`, `events[].endDate`, `events[].title`, `events[].subtitle`, `events[].category`, `events[].badgeVariant`, `ctaHeading`, `ctaButtonLabel`, `ctaButtonHref`                                                                                                                                                                                   | No                                                                                                                                        |
| **DituVideoBlock** (segunda instancia)                                          | SIN-SCHEMA                                                                                                                                                                                 | HARDCODED                          | `background="linear-gradient(90deg, #6C27D8...)"` literal en page.tsx                                                                                                                                      | `src` (imagen/video), `background`                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | No                                                                                                                                        |
| **DituPautaBlock** (`src/components/marketing/ditu-pauta.tsx`)                  | Parcial: `src/blocks/AdFormats/config.ts` (slug: `"ad-formats"`, `displayMode: "vertical-tabs"`) — no consumido                                                                            | HARDCODED (const internas)         | `CATEGORIES` (4 categorías: Ads/Patrocinio/Branded/Eventos Especiales) cada una con 3 formatos; imagen placeholder `/ditu/pauta-card.png` para todos                                                       | `stickerText` ("Impulsa tu marca"), `heading` (2 líneas), `subtitle`, `categories[].key`, `categories[].label`, `categories[].formats[].id`, `categories[].formats[].tag`, `categories[].formats[].title`, `categories[].formats[].description`, `categories[].formats[].image`                                                                                                                                                                                                                                 | No                                                                                                                                        |
| **DituHablamosBlock** (`src/components/marketing/ditu-hablamos.tsx`)            | SIN-SCHEMA                                                                                                                                                                                 | HARDCODED                          | Todos los textos inline en JSX                                                                                                                                                                             | `stickerText` ("¿HABLAMOS?"), `headingLine1` ("Lleva tu marca"), `headingLine2` ("al siguiente nivel."), `highlightColor` (#77EDED), `description`, `ctaLabel`, `ctaHref`                                                                                                                                                                                                                                                                                                                                       | No                                                                                                                                        |
| **DituFooter** (`src/components/marketing/ditu-footer.tsx`)                     | Parcial: `src/globals/FooterDitu.ts` — no consumido                                                                                                                                        | HARDCODED (DEFAULT_SOCIALS const)  | `DEFAULT_SOCIALS` (5 redes), `encuentranosLabel="Encuéntranos"`, sin `bottomLine`                                                                                                                          | `socialLinks[].network`, `socialLinks[].url`, `socialLinks[].label`, `encuentranosLabel`, `bottomLine`                                                                                                                                                                                                                                                                                                                                                                                                          | No                                                                                                                                        |
| **FloatingContact Ditu**                                                        | `src/globals/FloatingContact.ts`                                                                                                                                                           | DEMO                               | `floatingContactDemo` de demo-data.ts                                                                                                                                                                      | — (schema existe)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | No                                                                                                                                        |

**Resumen Ditu**: 0 campos conectados a Payload. Existen 5 schemas de bloque (`audience-profile`, `estratos`, `content-type`, `our-channels`, `key-moments`) que podrían servir datos a Ditu, pero ninguno está wired. Los 9 componentes custom tienen sus datos enteramente hardcoded o como constantes internas.

---

### 2.4 Globales (Header, Footer, FloatingContact, SiteSettings)

| Global            | Schema (path)                      | Slug registrado         | Frontend lo consume                                                                    | Estado          |
| ----------------- | ---------------------------------- | ----------------------- | -------------------------------------------------------------------------------------- | --------------- |
| HeaderCaracolNext | `src/globals/HeaderCaracolNext.ts` | `"header-caracol-next"` | `src/app/(frontend)/caracol-next/page.tsx` → `<SiteHeader {...caracolNextHeaderDemo}>` | DEMO            |
| HeaderDitu        | `src/globals/HeaderDitu.ts`        | `"header-ditu"`         | `src/app/(frontend)/ditu/page.tsx` → `<SiteHeader {...dituHeaderDemo}>`                | DEMO            |
| FooterCaracolNext | `src/globals/FooterCaracolNext.ts` | `"footer-caracol-next"` | `src/app/(frontend)/caracol-next/page.tsx` → `<SiteFooter {...caracolNextFooterDemo}>` | DEMO            |
| FooterDitu        | `src/globals/FooterDitu.ts`        | `"footer-ditu"`         | NO consumido — la page `/ditu` usa `<DituFooter />` con DEFAULT_SOCIALS                | SCHEMA-HUÉRFANO |
| FloatingContact   | `src/globals/FloatingContact.ts`   | `"floating-contact"`    | Ambas pages → `<FloatingContact {...floatingContactDemo}>`                             | DEMO            |
| SiteSettings      | `src/globals/SiteSettings.ts`      | `"site-settings"`       | No consumido en ninguna page                                                           | SCHEMA-HUÉRFANO |

**Notas críticas sobre Globales**:

- `FooterDitu.ts` tiene schema completo con `footerSharedFields` pero la página `/ditu` NO usa `SiteFooter`; usa `DituFooter` (componente custom en `src/components/marketing/ditu-footer.tsx`) que tiene su propio `DEFAULT_SOCIALS` hardcoded. El global `footer-ditu` es completamente huérfano.
- `SiteSettings.ts` tiene 3 tabs (SEO & Metadata, Contacto fallback, Theme defaults) pero NO tiene ningún field de contenido del Home (`eyebrow`, `heading`, stats, brands, copyright). El TODO de Fase 4 descrito en los docs (`SiteSettings.homeContent`) nunca se implementó en el schema real.
- `SiteHeader` acepta `logoUrl?: string | null` — si es null/undefined usa `fallbackWordmark` (el SVG inline `CaracolNextWordmark` o `DituWordmark`). Cuando se conecte a Payload, `logo` del global puede ser `null` y el fallback cubrirá el gap.

---

## 3. Campos Faltantes (Consolidado)

Lista de todo lo que se ve en el front y NO tiene field en Payload (SIN-SCHEMA o incompleto).

### 3.1 Home (`/`) — SiteSettings no tiene campos de contenido Home

Todos los siguientes son visibles en `/` y no tienen field en ningún schema Payload:

| Campo visible                         | Valor actual (hardcoded)                      | Dónde en el código                               |
| ------------------------------------- | --------------------------------------------- | ------------------------------------------------ |
| Logo Caracol Medios imagen            | `/home/logo-caracol-medios.svg`               | `hub-landing.tsx` → `CaracolMediosLogo()`        |
| Texto "DIGITAL" junto al logo         | `"DIGITAL"` literal                           | `hub-landing.tsx` → `CaracolMediosLogo()`        |
| Eyebrow hero                          | `"Unidad digital #1 en Colombia"`             | `page.tsx` prop `eyebrow`                        |
| Heading hero parte regular            | `"Conecta"` / `"tu marca con la audiencia"`   | `page.tsx` prop `heading` (JSX)                  |
| Heading hero parte bold               | `"más relevante del país."`                   | `page.tsx` prop `heading` (JSX)                  |
| Label botón "Contáctenos"             | `"Contáctenos"`                               | `page.tsx` prop `contactLabel`                   |
| Descripción product card Caracol Next | Array `["Conecta tu marca..."]`               | `page.tsx` prop `brands.caracolNext.description` |
| Label CTA Caracol Next                | `"Conoce Caracol Next"`                       | `page.tsx` prop `brands.caracolNext.ctaLabel`    |
| Href CTA Caracol Next                 | `"/caracol-next"`                             | `page.tsx` prop `brands.caracolNext.href`        |
| Descripción product card Ditu         | `"Integra tu marca en el mejor contenido..."` | `page.tsx` prop `brands.ditu.description`        |
| Label CTA Ditu                        | `"Conoce ditu"`                               | `page.tsx` prop `brands.ditu.ctaLabel`           |
| Href CTA Ditu                         | `"/ditu"`                                     | `page.tsx` prop `brands.ditu.href`               |
| Stat 1: numericValue                  | `16`                                          | `page.tsx` → `stats[0].numericValue`             |
| Stat 1: prefix/suffix/label           | `"+"` / `"M"` / `"usuarios"`                  | `page.tsx` → `stats[0].*`                        |
| Stat 2: numericValue                  | `3`                                           | `page.tsx` → `stats[1].numericValue`             |
| Stat 2: prefix/suffix/label           | `"+"` / `"M"` / `"pantallas activas"`         | `page.tsx` → `stats[1].*`                        |
| Stat 3: numericValue                  | `127`                                         | `page.tsx` → `stats[2].numericValue`             |
| Stat 3: prefix/suffix/label           | `"+"` / `"M"` / `"seguidores"`                | `page.tsx` → `stats[2].*`                        |
| Stat 4: numericValue                  | `42`                                          | `page.tsx` → `stats[3].numericValue`             |
| Stat 4: suffix/label                  | `"Min"` / `"watch time"`                      | `page.tsx` → `stats[3].*`                        |
| Copyright                             | `"©2026 Caracol Comercial Digital"`           | `page.tsx` prop `copyright`                      |
| Iconos de métricas (4 SVGs)           | `/home/icon-users.svg` etc.                   | `hub-landing.tsx` → `ICON_PATHS` const           |

### 3.2 Ditu (`/ditu`) — Componentes sin schema

**DituHero**:

- `stickerText` → `"TU MARCA"` (default)
- `heading` → JSX hardcoded con estructura tipográfica
- `description` → JSX hardcoded con spans bold cyan
- `buttons[0..2].label` → `"Google Play"`, `"App Store"`, `"Portal web"`
- `buttons[0..2].href` → `"#"` (todos apuntan a hash, no reales)
- `buttons[0..2].icon` → `"googleplay"`, `"appstore"`, `"tv"`

**DituVideoBlock** (×2):

- `src` → default `"/ditu/video-block.png"` (sin field editable)
- `background` → CSS gradient hardcoded en `page.tsx`

**DituAudienciaBlock**:

- Sticker label, heading principal, stat cards (label, value, description, icon) ×3
- Watch time value (`60 MIN`), watch time label, watch time description
- Device cards (label + minutes) ×4 — `DEFAULT_DEVICES` const
- Total followers headline (`"+1.7M"` — prop existe pero default interno)
- Texto de seguidores ("DE SEGUIDORES", "QUE ESPERAN VER TU MARCA")
- Red + followers ×6 — `DEFAULT_NETWORKS` const
- Fuentes (2 textos de fuente: "Fuente: Ditu AVS Accenture · Abril 2026", "Fuente: TGI CO 2025")

**DituAdnBlock**:

- Sticker label ("ADN DITU"), heading ("Sabemos a quién le hablas.")
- `genderSplit.malePercent` (52), `genderSplit.femalePercent` (48), labels Hombres/Mujeres
- Descripción genero ("52% nos prefieren")
- `ageBars[]` ×6 — `AGE_BARS` const (label + value + peak flag)
- Peak label ("Pico: 55-64 años")
- NSE heading ("y dónde encontrarlo"), NSE description
- `nseCards[]` ×4 — `NSE_CARDS` const (label + value)
- Fuente ("Fuente: TGI CO 2025")

**DituTipoContenidoBlock**:

- Sticker ("tipo de contenido"), heading (2 líneas)
- `tabs[]` ×3 — `TABS` const (label + description)

**DituCanalesBlock**:

- Sticker ("Nuestros canales"), heading (2 partes blanco/cyan)
- Subtitle ("La tuya está esperando por verte.")
- `tabs[]` ×3 labels + keys (`TABS` const)
- `channels[].id`, `.name`, `.logo` (imagen real por canal) ×9+ — `CHANNELS_BY_TAB` const

**DituCalendarioBlock** (el componente acepta props pero page.tsx no los pasa):

- Sticker ("ESTO SE VIENE"), heading ("Calendario"), subtitle
- `events[]` ×14 — `DEMO_EVENTS` const
- Textos del CTA del bloque

**DituPautaBlock**:

- Sticker ("Impulsa tu marca"), heading (2 líneas), subtitle
- `categories[]` ×4 con `formats[]` ×3 cada una — `CATEGORIES` const
- Imagen de cada formato (actualmente `/ditu/pauta-card.png` para todos)

**DituHablamosBlock**:

- Sticker ("¿HABLAMOS?"), heading line 1, heading line 2 con cyan
- Descripción, label y href del CTA ("Contáctanos" → `"#contacto"`)

**DituFooter** (componente `ditu-footer.tsx`, no el global `FooterDitu`):

- `socialLinks[]` — `DEFAULT_SOCIALS` const (5 redes con URLs)
- `encuentranosLabel` ("Encuéntranos")
- `bottomLine` (no se muestra actualmente, no tiene default)

---

## 4. Decisiones Arquitectónicas para Camilo

### 4.1 Ditu: Arquitectura de datos

El front de `/ditu` usa 9 componentes custom (`ditu-*.tsx`) que no participan en el sistema de bloques de Payload. Hay dos opciones:

**Opción A — Ditu como Page con page-builder (layout blocks)**

- Crear un documento `Pages` con `slug: "ditu"` y `landing: "ditu"`.
- Migrar los 9 bloques visuales a `Component.tsx` de bloques Payload (algunos ya existen: `audience-profile`, `estratos`, `content-type`, `our-channels`, `key-moments`).
- La page `/ditu/page.tsx` haría `payload.find({ collection: "pages", where: { slug: "ditu" } })` y usaría `RenderBlocks`.
- **Trade-off**: Requiere refactorizar todos los `ditu-*.tsx` como `Component.tsx` de bloque, alinear sus props a los schemas existentes (que no matchean exactamente), y migrar la lógica de layout (grid flex custom) al sistema de dispatch de `RenderBlocks`.

**Opción B — Globals dedicados por bloque Ditu**

- Crear un global Payload por cada sección (ej. `DituHero`, `DituAudiencia`, `DituAdn`, `DituCanales`, `DituCalendario`, `DituPauta`, `DituHablamos`).
- La page `/ditu/page.tsx` haría `payload.findGlobal(...)` para cada sección y pasaría las props a los componentes existentes.
- **Trade-off**: Más globals (7+ nuevos), cada uno con su propio schema. El cliente edita cada sección en una pantalla separada del admin (sin el drag-and-drop del page builder). Más simple de implementar sin tocar los `ditu-*.tsx`.

**Opción C — Híbrida**: DituHero + DituHablamos como globals (son únicos/fijos), el resto como Page con bloques.

Los schemas `audience-profile`, `estratos`, `content-type`, `our-channels` ya existen en `src/blocks/` pero sus shapes no matchean exactamente los datos de los componentes actuales (ej. `AudienceProfileBlock.ageBars` es array con `label/value/suffix`; `DituAdnBlock` tiene `AGE_BARS` con `label/value/peak`). Una conexión directa requeriría adaptar uno u otro.

### 4.2 Home: global SiteSettings vs. Page slug "/"

El global `SiteSettings` actual (SEO + contacto fallback + theme) no tiene campos de contenido del Home. Hay dos opciones para agregar el contenido del Home:

**Opción A — Extender SiteSettings con un tab "Home Content"**

- Agregar un tab `homeContent` al global `SiteSettings.ts` con fields: `eyebrow`, `headingParts[]` (array para las partes del heading mixto), `contactLabel`, `brands.caracolNext.*`, `brands.ditu.*`, `stats[].*`, `copyright`, `logoCaracolMedios` (upload).
- El heading mixto (JSX con spans de distintos pesos) es el mayor reto: requiere serializar el marcado bold/semibold en un array de parts o usar richText.

**Opción B — Crear una Page con slug "home" / landing "caracol-next"**

- Igual que Caracol Next, el Home sería una `Page` con `slug: "home"`.
- Requeriría crear un `HubBlock` nuevo para el content del Home (no encaja en ningún bloque existente).
- Más coherente arquitectónicamente con la colección `Pages`, pero más trabajo.

El comentario en `03-payload-cms.md` menciona la Opción A como el plan previsto: `payload.findGlobal({ slug: "site-settings" })` en `page.tsx`.

### 4.3 DituFooter vs. global FooterDitu

El global `FooterDitu.ts` existe con schema completo (logo, tagline, columns, socialLinks, bottomLine, useWave, tone), pero la página `/ditu` usa `DituFooter` (componente custom con DEFAULT_SOCIALS hardcoded). No están conectados.

**Decisión necesaria**: ¿El footer de Ditu se mueve a `SiteFooter` consumiendo `FooterDitu` global, o `DituFooter` agrega props para recibir datos de Payload? La primera opción elimina el componente custom pero cambia el layout visual (el `DituFooter` actual es más simple — solo logo + red social). La segunda es menos disruptiva.

### 4.4 Heading mixto del Home

El heading de Home es `<span className="font-extrabold">Conecta</span><span className="font-semibold"> tu marca con la audiencia </span><span className="font-extrabold">más relevante del país.</span>`. Almacenar este markup en Payload requiere decidir entre:

- **richText (Lexical editor)**: permite marcado rich pero la serialización al render es más compleja.
- **Array de parts**: campo `array` con `[{ text, weight: "regular" | "semibold" | "extrabold" }]`. Más predecible para el render.
- **3 campos de texto separados** (`headingPart1`, `headingPart2`, `headingPart3` con weight implícito por posición).

### 4.5 Form Builder

`formBuilderPlugin` está importado y habilitado en `payload.config.ts` con los fields básicos. El `ContactBlock.config.ts` tiene el field `form: relationship → "forms"`. Sin embargo, no hay formularios creados en el admin, y `ContactBlockComponent` en el demo usa `layout: "cta-simple"` (sin form). Esto está documentado como Fase 5.

---

## 5. Seed y Migraciones

### Estado actual

- **Migración**: existe `src/migrations/20260601_000530.ts` + `.json`. Esta es la migración inicial del schema DB (generada automáticamente por Payload al primer `migrate`).
- **Seed**: NO existe ningún script de seed. El directorio `src/migrations/` contiene solo la migración automática; no hay `scripts/seed.ts` ni similar.
- El contenido del `src/lib/demo-data.ts` (que tiene datos representativos del Figma para todas las páginas) es la fuente de verdad actual para QA visual, pero no hay ningún mecanismo para volcarlos a Payload automáticamente.

### Lo que falta

Para poder hacer QA con el CMS real se necesita un script de seed que:

1. Cree el documento `Pages` con `slug: "caracol-next"`, `landing: "caracol-next"` y `layout: caracolNextDemoLayout` convertido al formato Payload (sin los `as unknown as never`).
2. Cree o actualice los globals: `header-caracol-next`, `header-ditu`, `footer-caracol-next`, `footer-ditu`, `floating-contact` con los valores de los objetos demo.
3. Para Ditu: una vez que se decida la arquitectura (Opción A/B/C de sección 4.1), agregar el seed correspondiente.
4. Suba assets (logos de marca, imágenes de formatos, fotos de representantes) a la colección `Media`.

El script puede ser `scripts/seed.ts` ejecutado con `npx tsx scripts/seed.ts` o como `payload migrate:create --name seed-inicial` si se integra en el pipeline de migraciones.

---

## 6. Plan Propuesto (PROPUESTA — priorización final la decide Camilo)

### Sprint A — Conexión inmediata (sin cambios de schema)

Todo lo que se puede conectar sin crear nuevos fields porque los schemas ya están listos:

1. **Caracol Next (`/caracol-next`)**: Reemplazar `caracolNextDemoLayout` por `payload.find({ collection: "pages", where: { slug: { equals: "caracol-next" } }, limit: 1 })` en `src/app/(frontend)/caracol-next/page.tsx`. Agregar `await getPayload()`. El array `layout` pasa a `RenderBlocks` sin más cambios.
2. **HeaderCaracolNext**: Reemplazar `caracolNextHeaderDemo` por `payload.findGlobal({ slug: "header-caracol-next" })`.
3. **HeaderDitu**: Reemplazar `dituHeaderDemo` por `payload.findGlobal({ slug: "header-ditu" })`.
4. **FooterCaracolNext**: Reemplazar `caracolNextFooterDemo` por `payload.findGlobal({ slug: "footer-caracol-next" })`.
5. **FloatingContact**: Reemplazar `floatingContactDemo` por `payload.findGlobal({ slug: "floating-contact" })`.
6. **Seed Sprint A**: Poblar Payload con los valores de demo-data para poder hacer QA real después del Sprint A.

Estimación: todo esto es wiring sin cambios de schema. Después del Sprint A, Caracol Next + Header + Footer + FloatingContact serán 100% editables.

### Sprint B — Home (requiere decisión y schema nuevo)

1. Decidir entre Opción A (extender SiteSettings) y Opción B (Page "home").
2. Implementar el schema elegido en Payload.
3. Actualizar `src/app/(frontend)/page.tsx` para leer desde Payload.
4. Seed del Home con los valores actuales.
5. `npm run generate:types && npm run type-check`.

### Sprint C — Ditu (requiere decisión arquitectónica)

1. Decidir Opción A/B/C de la sección 4.1.
2. Si Opción A (page builder): Crear/adaptar los `Component.tsx` de los bloques Ditu, ajustar shapes al schema. Crear el documento `Pages` slug `"ditu"`. Actualizar `ditu/page.tsx` para usar `RenderBlocks`.
3. Si Opción B (globals): Crear 7 globals nuevos, definir schemas, actualizar `ditu/page.tsx` para fetcharlos.
4. Resolver `DituFooter` vs. global `FooterDitu`.
5. Seed Ditu.

### Sprint D — Form Builder (Fase 5)

1. Crear formularios desde el admin Payload.
2. Implementar el submit handler en `ContactBlockComponent`.
3. Configurar Resend hook.
