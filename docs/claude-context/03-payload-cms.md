# 03 — Payload CMS Integration

> El cliente edita TODO desde Payload. Cuando agregues un componente
> visual, **primero** define el field en Payload, después renderiza.

## Arquitectura

Payload v3 corre **embebido** en Next.js (no en proceso separado).
Convención:

- `src/payload.config.ts` → registro central de collections, globals,
  plugins, DB, editor.
- `src/collections/*.ts` → Collections (entidades con CRUD: Pages, Media,
  Users, Categories).
- `src/globals/*.ts` → Globals (singletons: Header, Footer, FloatingContact,
  SiteSettings).
- `src/blocks/*/config.ts` → Blocks reutilizables que componen el array
  `layout` de un Page.
- `src/payload-types.ts` → **autogenerado** por `npm run generate:types`.
  Nunca editar a mano.

DB: PostgreSQL via `@payloadcms/db-postgres`. Migraciones automáticas
en dev. En prod usa migraciones explícitas (`npm run payload -- migrate`).

## Collections

### `Pages` (`src/collections/Pages.ts`)

Page del page builder. Campos clave:

- `slug` (text, required, único). Ej. `caracol-next`.
- `title` (text).
- `layout` (array de blocks — usa `src/blocks/index.ts` como pool).
- `seo` (group con title, description, image — plugin `@payloadcms/plugin-seo`).
- Status: draft/published (via plugin nested-docs / versioning).

Una entrada por landing dinámica. Hoy solo `caracol-next` está pensada
como Page. **Decisión pendiente** (ver `06-roadmap.md`): si `/ditu`
también pasa a ser una Page con layout o se queda como composición fija
de globals/blocks dedicados.

### `Media` (`src/collections/Media.ts`)

Upload de imágenes/SVGs/videos. Campos:

- `alt` (text, required) — accesibilidad.
- `url` (auto-generado).
- Sharp para resize automático.

Acceso a la URL:

```ts
import { mediaUrl, mediaAlt } from "@/lib/media";

const url = mediaUrl(field); // string | null
const alt = mediaAlt(field, fallback);
```

### `Users` (`src/collections/Users.ts`)

Admin users de Payload. Editor recibe credenciales en el primer arranque.

### `Categories` (`src/collections/Categories.ts`)

Taxonomía para los eventos del calendario (sports/news/special/etc.) y
otros usos transversales.

## Globals

### `SiteSettings` (`src/globals/SiteSettings.ts`)

Config global del sitio:

- Branding (logo principal, favicon).
- SEO defaults (title template, description, OG image).
- Datos del **Home** (`/`): eyebrow, heading, copyright, etc.

> **TODO Fase 4**: hoy `src/app/(frontend)/page.tsx` tiene los textos
> del Home hardcoded. Mover a `SiteSettings.homeHero.*` y leer con
> `payload.findGlobal({ slug: "site-settings" })`.

### `HeaderCaracolNext` (`src/globals/HeaderCaracolNext.ts`)

Config del header de `/caracol-next`:

- `navAnchors` (array: label + anchorId).
- `ctaButton` (label, href, variant).
- `logoUrl` opcional (default usa `<CaracolNextWordmark>` inline).
- `sticky`.

Demo equivalente: `caracolNextHeaderDemo` en `src/lib/demo-data.ts`.

### `HeaderDitu` (`src/globals/HeaderDitu.ts`)

Análogo para `/ditu`. Defaults:

- nav labels: "Nuestro Alcance", "ADN ditu", "Tipo de contenido",
  "Nuestros canales", "Calendario", "Formatos".
- CTA: "Ir a Caracol Next" → `/` (vuelve al hub).

### `FooterCaracolNext` / `FooterDitu`

Tagline, columns (heading + links), socialLinks (network + url),
bottomLine. Comparten `shared-footer-fields.ts` para reutilizar campos.

### `FloatingContact` (`src/globals/FloatingContact.ts`)

Config del botón fijo bottom-right que abre el modal de representantes:

- `enabled` (bool).
- `buttonLabel`, `buttonIcon`, `panelHeading`, `panelDescription`.
- `representatives` (array: name, role, email, whatsapp, photo).
- `position` (bottom-right / bottom-left).

## Blocks del page builder

Cada block vive en `src/blocks/<Nombre>/` con:

- `config.ts` → schema Payload (`Block` type de Payload).
- `Component.tsx` → renderizado React (recibe props desde el dispatch).
- `index.ts` (opcional) → re-export.

**Importante**: el block tiene **dos representaciones**:

1. **Config Payload** (en `config.ts`): qué campos puede editar el cliente.
2. **Props TypeScript** (en `types.ts`): qué recibe el componente React.

Mantenerlos sincronizados es responsabilidad de `npm run generate:types`,
pero a veces los `as never` en `demo-data.ts` indican una desconexión
que vale revisar.

### Blocks actuales

| BlockType           | Componente                       | Usa en                         |
| ------------------- | -------------------------------- | ------------------------------ |
| `hero`              | `HeroBlockComponent`             | caracol-next                   |
| `audience-networks` | `AudienceNetworksBlockComponent` | caracol-next                   |
| `audience-profile`  | `AudienceProfileBlockComponent`  | ditu (vía RenderBlocks futuro) |
| `estratos`          | `EstratosBlockComponent`         | ditu                           |
| `content-type`      | `ContentTypeBlockComponent`      | ditu                           |
| `brand-tabs`        | `BrandTabsBlockComponent`        | caracol-next                   |
| `key-moments`       | `KeyMomentsCalendarComponent`    | ambos                          |
| `branded-content`   | `BrandedContentBlockComponent`   | caracol-next                   |
| `ad-formats`        | `AdFormatsBlockComponent`        | ambos (variants)               |
| `our-channels`      | `OurChannelsBlockComponent`      | ditu (futuro)                  |
| `sports-events`     | `SportsEventsBlockComponent`     | reservado                      |
| `contact`           | `ContactBlockComponent`          | ambos (variants)               |
| `ai-recommendation` | `AIRecommendationBlockComponent` | ambos (Fase 5)                 |

`RenderBlocks` (`src/blocks/RenderBlocks.tsx`) hace el dispatch por
`blockType`. Si agregas un block nuevo:

1. Crea `src/blocks/<Nombre>/{Component.tsx, config.ts}`.
2. Registra en `src/blocks/index.ts` (export del config).
3. Agrega el case en el `switch` de `RenderBlocks.tsx`.
4. Agrega el type a `src/blocks/types.ts`.
5. Registra el config en el array `blocks` del campo `layout` de Pages.
6. Corre `npm run generate:types` para que TypeScript reconozca el shape.

## Mapping de datos: estado actual

### Home (`/`) — `HARDCODED en page.tsx`

Toda la data viene del literal en `src/app/(frontend)/page.tsx`.
**TODO Fase 4**: migrar a global `SiteSettings.homeContent`.

### Caracol Next (`/caracol-next`) — `DEMO data`

Lee de `caracolNextDemoLayout` en `src/lib/demo-data.ts`.
**TODO Fase 4**: reemplazar por:

```ts
const page = await payload.find({
  collection: "pages",
  where: { slug: { equals: "caracol-next" } },
  limit: 1,
});
const layout = page.docs[0]?.layout ?? [];
```

### Ditu (`/ditu`) — `defaults internos de cada componente`

Cada `ditu-*.tsx` tiene defaults internos. **TODO Fase 4**: definir si:

- (a) Crear Page con slug `ditu` y migrar todos los componentes a
  bloques del page builder.
- (b) Crear globals específicos (`DituHero`, `DituAudiencia`, etc.) por
  bloque.

Decisión pendiente con Camilo.

### FloatingContact — `DEMO data`

Lee de `floatingContactDemo`. **TODO Fase 4**: reemplazar por:

```ts
const floating = await payload.findGlobal({ slug: "floating-contact" });
```

### Header/Footer — `DEMO data`

Análogo: hoy usan `caracolNextHeaderDemo` / `dituHeaderDemo` /
`caracolNextFooterDemo` / `dituFooterDemo`.

## Templates para prompts derivados

### Conectar un global con el frontend

```
Conecta el global Payload <SLUG> con el frontend de <ruta>.

1. Verifica el schema del global en src/globals/<SLUG>.ts.
2. En el server component de la página, fetcha con:
     const data = await payload.findGlobal({ slug: "<SLUG>" });
3. Pasa los datos como props al componente cliente.
4. Si hay campos undefined / null, mantén defaults inline para no
   romper el render.
5. Actualiza src/lib/demo-data.ts para que el shape sea idéntico al
   de Payload (mismas keys, mismos tipos).
6. Corre npm run generate:types y npm run type-check.
```

### Crear un bloque nuevo + conectarlo a Payload

```
Crea un bloque <Nombre> en Payload que renderiza la sección
con nodeId <NODE_ID> del Figma.

Schema sugerido (ajustar a lo que ves en el Figma):
- eyebrow: text
- heading: text
- description: textarea
- items: array (label + value + description + image)
- cta: group (label + href + variant)

Pasos:
1. mcp__figma__get_design_context con el nodeId.
2. Crea src/blocks/<Nombre>/{config.ts, Component.tsx}.
3. Define el schema en config.ts según lo que ves.
4. Implementa el componente con fidelidad 1:1 al Figma.
5. Registra el bloque en src/blocks/index.ts, RenderBlocks.tsx, types.ts.
6. Agrega un ejemplo a src/lib/demo-data.ts (caracolNextDemoLayout o donde aplique).
7. Verifica en localhost:3000 que se renderiza idéntico al Figma.
8. npm run generate:types && npm run type-check.
```

### Form de contacto vía form-builder + Resend

```
Conecta el ContactBlock (layout "form-reps") con:
- @payloadcms/plugin-form-builder (ya está en deps) para el schema del form.
- Resend para enviar la submission al equipo comercial.

Pasos:
1. Habilita el form-builder plugin en payload.config.ts.
2. En el admin: crear un form "Contacto Caracol Next" con los fields:
   nombre, email, empresa, mensaje, presupuesto.
3. En src/blocks/Contact/Component.tsx implementa el ContactForm:
   - Usa react-hook-form + zod para validación.
   - On submit: POST a /api/form-submissions (endpoint del plugin).
4. Crea un hook afterChange en la collection form-submissions que
   envíe email vía Resend con resend.emails.send().
5. RESEND_API_KEY y RESEND_FROM_EMAIL en .env.
6. Mostrar success/error inline (ya hay scaffold en ContactForm).
```
