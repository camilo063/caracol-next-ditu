# 02 · Modelo de datos objetivo

Spec completa del schema Payload al final del build-out. Lo que existe ya está marcado **✓ EXISTE**; lo que hay que agregar **+ NUEVO**; lo que hay que modificar **△ MODIFICAR**.

## Principios

1. **Una sola fuente de verdad**. Cada string/número/imagen vive en un solo lugar de Payload. Si aparece en 2 lados, hay una relationship, no duplicación.
2. **Granularidad editable**. Un texto del Hero no debe requerir tocar 5 sub-campos para cambiarlo. Pero tampoco mega-blobs de JSON — el editor del cliente necesita campos labeled en español.
3. **Defaults sensatos**. Todos los campos opcionales con `defaultValue` para que crear un Page no falle por required vacíos.
4. **Validación en el field, no en el componente**. Si `email` debe ser email, validar con Payload `validate` no en React.
5. **Admin UX en español**. `labels`, `admin.description`, `admin.placeholder` — todo en español.

## Collections

### `users` △ MODIFICAR

Agregar campo `role` con RBAC. Ver doc 05 para la lógica de access control.

```ts
fields: [
  // ...existing email/password de Payload auth
  {
    name: "role",
    type: "select",
    required: true,
    defaultValue: "editor",
    options: [
      { label: "Admin (acceso total)", value: "admin" },
      { label: "Editor (CRUD contenido)", value: "editor" },
      { label: "Viewer (solo lectura)", value: "viewer" },
    ],
    access: {
      // Solo admins pueden cambiar roles
      update: ({ req: { user } }) => user?.role === "admin",
    },
    admin: {
      description: "Solo admin puede modificar roles. Editor no ve usuarios, viewer es read-only.",
    },
  },
  {
    name: "name",
    type: "text",
    required: true,
    admin: { description: "Nombre completo, visible en logs y admin UI." },
  },
],
access: {
  admin: ({ req: { user } }) => Boolean(user), // login al admin
  create: ({ req: { user } }) => user?.role === "admin",
  read: ({ req: { user } }) => user?.role === "admin", // editors no ven la lista de users
  update: ({ req: { user }, id }) =>
    user?.role === "admin" || user?.id === id, // editors solo se editan a sí mismos
  delete: ({ req: { user } }) => user?.role === "admin",
},
```

### `pages` △ MODIFICAR (extender `landing` enum)

**Cambio crítico**: agregar `"hub"` al enum `landing` para representar la home `/`.

```ts
{
  name: "landing",
  type: "select",
  required: true,
  defaultValue: "hub",
  options: [
    { label: "Hub Caracol Medios (/)", value: "hub" },
    { label: "Caracol Next (/caracol-next)", value: "caracol-next" },
    { label: "Ditu (/ditu)", value: "ditu" },
  ],
},
```

El resto del schema (title, slug, layout, heroOverride, versions, livePreview) **se mantiene**. Pages.ts ya está bien diseñado.

**Agregar** dos campos:

```ts
{
  name: "meta",
  type: "group",
  label: "SEO",
  admin: {
    description: "Override de SEO defaults del Site Settings. Vacío = usa defaults.",
  },
  fields: [
    { name: "title", type: "text" },
    { name: "description", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "noIndex", type: "checkbox", defaultValue: false },
  ],
},
{
  name: "revalidate",
  type: "number",
  admin: {
    description: "Segundos de ISR (default 3600 = 1h). Cambios manuales disparan revalidate inmediato vía afterChange hook.",
    position: "sidebar",
  },
  defaultValue: 3600,
},
```

### `media` △ MODIFICAR (Vercel Blob storage)

Agregar adapter de Vercel Blob para storage en prod. Local sigue usando filesystem.

```ts
// payload.config.ts
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";

// dentro de buildConfig:
plugins: [
  vercelBlobStorage({
    enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
    collections: { media: true },
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
  // ...resto
];
```

Agregar campos al schema de `media`:

```ts
{
  name: "alt",
  type: "text",
  required: true,
  admin: { description: "Alt text para accesibilidad (obligatorio)." },
},
{
  name: "caption",
  type: "text",
  admin: { description: "Caption opcional, visible en algunos contextos." },
},
{
  name: "credit",
  type: "text",
  admin: { description: "Crédito de autor/agencia si aplica." },
},
```

Mantener `imageSizes` para responsive:

```ts
upload: {
  staticDir: "./media",
  mimeTypes: ["image/*", "video/mp4", "video/webm"],
  imageSizes: [
    { name: "thumbnail", width: 240, height: 240, position: "centre" },
    { name: "card", width: 640, height: undefined },
    { name: "feature", width: 1024, height: undefined },
    { name: "hero", width: 1920, height: undefined },
  ],
  adminThumbnail: "thumbnail",
  resizeOptions: { fit: "inside", withoutEnlargement: true },
}
```

### `categories` ✓ EXISTE (mantener)

Sin cambios. Está bien configurado para nested-docs futuro.

### `brands` + NUEVO (opcional pero recomendado)

Actualmente las marcas (Caracol TV, Gol Caracol, Caracol Sports, Blu Radio, La Kalle, BumBox, Volk, Ditu) están en `src/lib/brand.ts` con sus tokens de color hardcoded. Para que el editor pueda crear nuevas marcas o ajustar colores sin commit:

```ts
{
  slug: "brands",
  labels: { singular: "Marca", plural: "Marcas" },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "key", "color", "colorDark"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin" || user?.role === "editor",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "Identificador único, kebab-case (caracoltv, golcaracol, ...)." },
    },
    { name: "label", type: "text", required: true },
    {
      name: "color",
      type: "text",
      required: true,
      admin: { description: "Color primario hex (ej. #003381). Usado en heading del tab." },
    },
    {
      name: "colorDark",
      type: "text",
      admin: { description: "Color oscuro hex. Usado en panel derecho del tab." },
    },
    {
      name: "colorAccent",
      type: "text",
      admin: { description: "Accent (amarillo/magenta/cyan). Opcional." },
    },
    {
      name: "chartPeak",
      type: "text",
      admin: { description: "Color de la barra pico del Edad Pico chart." },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Wordmark SVG para el side panel (180×190 horizontal o 180×212 vertical)." },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      admin: { description: "Avatar PNG cuadrado (76×76) para top-right del panel." },
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "media",
      admin: { description: "Icono circular del Hero brand-icons row." },
    },
  ],
}
```

Migration: el seed inicial poblará 10 brands desde `BRAND_META` (`src/lib/brand.ts`). Después de seedear, los blocks que usan `brand: "caracoltv"` (string key) cambian a `brand: relationship → brands` o se mantiene `select` con opciones cargadas de la collection (más simple).

**Decisión por defecto**: mantener el `select` con las 10 keys actuales en blocks como `brand-tabs`, y usar la collection `brands` solo para tokens visuales (color, logos). Esto evita migrar 12 blocks que ya funcionan.

### `events` + NUEVO (opcional)

Los eventos del calendario (`KeyMomentsCalendar` block) hoy viven dentro del array `events` del block. Si el cliente va a editar el calendario MUY frecuentemente, vale extraerlos a una collection:

```ts
{
  slug: "events",
  labels: { singular: "Evento", plural: "Eventos" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "dateStart", "category", "importance"],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "dateStart", type: "date", required: true },
    { name: "dateEnd", type: "date" },
    { name: "dateLabelOverride", type: "text" },
    { name: "description", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "importance",
      type: "select",
      required: true,
      options: ["low", "medium", "high", "critical"].map(v => ({ label: v, value: v })),
    },
    {
      name: "category",
      type: "select",
      options: ["special", "entertainment", "news", "sports"].map(v => ({ label: v, value: v })),
    },
    { name: "badgeColor", type: "text" },
    { name: "categoryLabel", type: "text", defaultValue: "CATEGORÍA" },
  ],
}
```

Después el `key-moments` block usaría `events: relationship[]` o filtros por categoría/año.

**Decisión por defecto**: NO crear la collection. Mantener eventos en el block array (más simple para editor). Re-evaluar si el cliente pide gestión por año o por categoría.

### `form-submissions` ✓ EXISTE (via formBuilderPlugin)

Ya viene del plugin. Solo asegurar que:

- `access.read` requiera `role: admin` (sensible — emails, phones).
- `access.delete` requiera `role: admin`.
- `afterChange` hook envía email a representantes via Resend.

## Globals

### `header-caracol-next`, `header-ditu` ✓ EXISTEN

Sin cambios estructurales. Verificar que **todos** los campos del demo coincidan:

- `navAnchors` (label + anchorId)
- `ctaButton` (enabled, label, href, variant)
- `sticky`
- `logo`

### `footer-caracol-next`, `footer-ditu` ✓ EXISTEN

Sin cambios. Verificar campos completos:

- `tagline`
- `columns` (heading + links[])
- `socialLinks` (network + url)
- `bottomLine`
- `useWave`
- `tone`
- `logo`

### `floating-contact` ✓ EXISTE

Sin cambios. Campos:

- `enabled`
- `buttonLabel`, `buttonIcon`
- `panelHeading`, `panelDescription`
- `representatives[]`
- `position`

### `site-settings` △ MODIFICAR

Asegurar que tenga:

- `defaultSeo: { title, description, image }`
- `brandPrimary, brandAccent: text` (override de tokens — opcional)
- `analyticsEnabled: checkbox`
- `maintenanceMode: { enabled, message }` (kill-switch para emergencias)

```ts
{
  name: "maintenanceMode",
  type: "group",
  admin: {
    description: "Modo mantenimiento. Si enabled, todas las rutas públicas redirigen a página de mantenimiento.",
  },
  fields: [
    { name: "enabled", type: "checkbox", defaultValue: false },
    { name: "message", type: "textarea", defaultValue: "Estamos trabajando en mejoras. Vuelve pronto." },
  ],
},
```

### `hub-page` + NUEVO global (alternativa a usar Pages)

**Decisión**: en lugar de crear un Page con slug `home` + landing `hub`, crear un **Global `hub-page`** dedicado para la home `/`. Más limpio porque la home tiene estructura única (no comparte el sistema de blocks de las otras landings).

```ts
{
  slug: "hub-page",
  label: "Página Hub (/)",
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "admin" || user?.role === "editor",
  },
  fields: [
    { name: "eyebrow", type: "text", required: true },
    {
      name: "heading",
      type: "richText", // lexical, permite spans bold/regular inline
      required: true,
      admin: { description: "Heading principal. Usa bold/regular spans para enfatizar palabras." },
    },
    { name: "contactLabel", type: "text", defaultValue: "Contáctenos" },
    {
      name: "brands",
      type: "group",
      fields: [
        {
          name: "caracolNext",
          type: "group",
          fields: [
            { name: "descriptionParagraphs", type: "array", fields: [{ name: "text", type: "textarea", required: true }] },
            { name: "ctaLabel", type: "text", defaultValue: "Conoce Caracol Next" },
            { name: "href", type: "text", defaultValue: "/caracol-next" },
          ],
        },
        {
          name: "ditu",
          type: "group",
          fields: [
            { name: "description", type: "textarea", required: true },
            { name: "ctaLabel", type: "text", defaultValue: "Conoce ditu" },
            { name: "href", type: "text", defaultValue: "/ditu" },
          ],
        },
      ],
    },
    {
      name: "stats",
      type: "array",
      label: "Métricas (4 cards animadas)",
      maxRows: 4,
      fields: [
        {
          name: "icon",
          type: "select",
          options: ["users", "tv", "zap", "clock"].map(v => ({ label: v, value: v })),
        },
        { name: "numericValue", type: "number", required: true },
        { name: "prefix", type: "text", defaultValue: "+" },
        { name: "suffix", type: "text", defaultValue: "M" },
        { name: "value", type: "text", admin: { description: "Display text (ej. +16M). Si vacío, se calcula." } },
        { name: "label", type: "text", required: true },
        {
          name: "accent",
          type: "select",
          options: ["caracolnext", "ditu"].map(v => ({ label: v, value: v })),
        },
        { name: "lgWidth", type: "number", admin: { description: "Ancho fijo en desktop (272/340/328/288 per Figma)." } },
      ],
    },
  ],
}
```

`src/app/(frontend)/page.tsx` queda con:

```tsx
import { getPayload } from "payload";
import config from "@payload-config";

export const revalidate = 3600;

export default async function HomePage() {
  const payload = await getPayload({ config });
  const hub = await payload.findGlobal({ slug: "hub-page" });
  const floatingContact = await payload.findGlobal({ slug: "floating-contact" });
  return <HubLanding {...mapHubToProps(hub, floatingContact)} />;
}
```

## Blocks — gap analysis vs demo-data.ts

Para CADA block, verificar que su `config.ts` tiene un campo por cada propiedad que demo-data.ts pasa. Si falta alguno → agregarlo.

### Hero

demo-data tiene: `eyebrow, heading, headingBold, subheading, keyStats, brandIcons, backgroundImage, backgroundVideo, primaryCta, secondaryCta, tone, blockName`.
Verificar `src/blocks/Hero/config.ts` — agregar lo que falte.

### AudienceNetworks

demo-data tiene: `eyebrow, heading, description, audience: { reach, reachLabel, reachSuffix, breakdown[] }, networks[], highlightedNetwork`.
Cada breakdown item: `{ id, label, value, suffix }`. Cada network: `{ id, network, handle, followers, growth, url }`.

### BrandTabs

demo-data tiene: `eyebrow, heading, description, tabs[], defaultTab`. Cada tab tiene MUCHOS campos — verificar exhaustivamente que el config los soporta TODOS (`brand, displayName, brandLogo, brandColor, tagline, whyChoose, webMetrics: {...}, audience: {...}, networks[], adFormats[], ctaContact`).

### KeyMomentsCalendar

demo-data: `eyebrow, heading, description, events[], displayMode, ctaText`. Cada event: 13 campos.

### AdFormats

demo-data: `eyebrow, heading, description, formats[], displayMode, filtersEnabled, footerCta`. Cada format puede tener modal con childTabs[].

### BrandedContent

demo-data: `eyebrow, heading, description, categories[], defaultIndex`. Cada categoría: `key, label, heading, description, multimedia, secondaryTabs[]`.

### OurChannels

demo-data: `eyebrow, heading, description, channels[], layout`.

### Estratos

demo-data: `eyebrow, heading, description, items[], footnote`.

### AudienceProfile

demo-data: `eyebrow, heading, description, genderSplit, ageBars[], footnote`.

### ContentType

demo-data: `eyebrow, heading, description, types[], defaultIndex`.

### Contact

demo-data: `eyebrow, heading, headingEmphasis, description, form, representatives[], ctaButton, layout`.

**Acción concreta para fase 2 (esquema)**: abrir CADA `config.ts` de bloque, compararlo con la línea de `demo-data.ts` correspondiente, y agregar los campos faltantes. Re-generar `payload-types.ts` y verificar que `BlockOf<"hero">` tipa lo mismo que `demo-data.ts` provee.

## Resumen de cambios al schema

| Cambio                                 | Tipo                 | Donde                                             | Doc    |
| -------------------------------------- | -------------------- | ------------------------------------------------- | ------ |
| Roles en `users`                       | △ Modificar          | `src/collections/Users.ts`                        | 05     |
| Access control per-resource            | △ Modificar          | Todos los collections + globals                   | 05     |
| `pages.landing` agregar "hub"          | △ Modificar          | `src/collections/Pages.ts`                        | 02     |
| `pages.meta` SEO override              | + Agregar            | `src/collections/Pages.ts`                        | 02, 04 |
| `pages.revalidate` ISR seconds         | + Agregar            | `src/collections/Pages.ts`                        | 04     |
| `media.alt` requerido + caption/credit | △ Modificar          | `src/collections/Media.ts`                        | 02     |
| Vercel Blob storage                    | + Agregar            | `payload.config.ts` + env `BLOB_READ_WRITE_TOKEN` | 04     |
| `brands` collection                    | + Agregar (opcional) | `src/collections/Brands.ts`                       | 02     |
| `hub-page` global                      | + Agregar            | `src/globals/HubPage.ts`                          | 02     |
| `site-settings.maintenanceMode`        | + Agregar            | `src/globals/SiteSettings.ts`                     | 05     |
| Gap analysis blocks → demo-data        | △ Modificar          | Cada `src/blocks/*/config.ts`                     | 02     |

## Próximo paso

→ Lee `03-migration-and-seed.md` para el plan de seedeado de demo-data.ts → Payload + rewire de páginas.
