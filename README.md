# Caracol Next + Ditu — Mediakit

Micrositio corporativo del ecosistema **Caracol Comercial Digital**, compuesto por dos
landings paralelas administradas por un único CMS:

| Ruta    | Landing      | Descripción                                  |
| ------- | ------------ | -------------------------------------------- |
| `/`     | Caracol Next | Hub principal — portafolio de marcas Caracol |
| `/ditu` | Ditu         | Plataforma OTT del ecosistema                |

100 % del contenido es editable desde el **Admin de Payload** (`/admin`).
Cliente: Caracol Comercial Digital. Entrega: Nivelics.

---

## Stack

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
| Forms           | react-hook-form + zod              | 7.x / 3.x               |
| Iconos          | lucide-react                       | 0.474.0                 |
| AI              | Vercel AI SDK                      | 6.0.183                 |
| Package manager | pnpm                               | 10.x                    |
| Node            | LTS                                | ^20.18.0 \|\| >=22.12.0 |

> **Por qué Next 16 + Payload 3.85:** la integración `@payloadcms/next` requiere
> estas versiones específicas. No actualizar ninguna sin validar compatibilidad.

---

## Requisitos previos

- **Node** ^20.18.0 o >=22.12.0 (recomendado: usar nvm)
- **pnpm** 10.x — `npm install -g pnpm@latest`
- **Docker Desktop** — para Postgres local
- Acceso al proyecto en **Vercel** (env vars de producción)
- Acceso al proyecto en **Neon** (DB productiva + branching para staging)

---

## Instalación local (paso a paso)

### 1. Clonar y entrar al repo

```bash
git clone <repo-url> caracol-next-ditu
cd caracol-next-ditu
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con los valores reales:

| Variable                    | Cómo obtenerla          |
| --------------------------- | ----------------------- |
| `PAYLOAD_SECRET`            | `openssl rand -hex 32`  |
| `DATABASE_URI`              | Ver paso 4              |
| `NEXT_PUBLIC_SITE_URL`      | `http://localhost:3000` |
| `PAYLOAD_PUBLIC_SERVER_URL` | `http://localhost:3000` |

Variables opcionales (solo para integraciones activas):

| Variable                | Para qué                    |
| ----------------------- | --------------------------- |
| `RESEND_API_KEY`        | Formulario de contacto      |
| `RESEND_FROM_EMAIL`     | Email verificado en Resend  |
| `AI_GATEWAY_API_KEY`    | Vercel AI Gateway           |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (media en prod) |

### 4. Levantar Postgres con Docker

El proyecto no incluye `docker-compose.yml` — arrancar el contenedor directamente:

```bash
docker run -d \
  --name caracol-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=caracol_next_ditu \
  -p 5432:5432 \
  postgres:16
```

Agregar en `.env`:

```
DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:5432/caracol_next_ditu
```

> Sesiones siguientes: `docker start caracol-pg`.
> Verificar antes de `pnpm dev`: `docker ps | grep caracol-pg`.

### 5. Correr las migraciones

```bash
echo "y" | pnpm payload migrate
```

Aplica todas las migraciones pendientes y crea el schema completo. En una DB
nueva deben correr las 10 migraciones sin errores.

### 6. Seed de contenido (opcional pero recomendado)

```bash
pnpm seed
```

Carga el contenido por defecto para ambas landings con todos los bloques,
imágenes y configuración de header/footer. El seed hace `upsert` — es seguro
correrlo múltiples veces. Requiere que el paso 5 ya esté completo.

### 7. Arrancar el servidor de desarrollo

```bash
pnpm dev
```

| URL                               | Descripción          |
| --------------------------------- | -------------------- |
| http://localhost:3000             | Landing Caracol Next |
| http://localhost:3000/ditu        | Landing Ditu         |
| http://localhost:3000/admin       | Admin Payload        |
| http://localhost:3000/api/pages   | REST API             |
| http://localhost:3000/api/graphql | GraphQL              |

La primera vez que se abre `/admin`, Payload pide crear el usuario
administrador inicial. Completar con email y contraseña seguros.

---

## Scripts

| Script                    | Descripción                                               |
| ------------------------- | --------------------------------------------------------- |
| `pnpm dev`                | Dev server en :3000 (Frontend + Payload Admin)            |
| `pnpm devsafe`            | Limpia `.next/` y levanta dev (usar si hay cache raro)    |
| `pnpm build`              | Build de producción                                       |
| `pnpm start`              | Sirve el build de producción                              |
| `pnpm lint`               | ESLint                                                    |
| `pnpm lint:fix`           | ESLint con autofix                                        |
| `pnpm type-check`         | `tsc --noEmit` — debe dar 0 errores antes de cualquier PR |
| `pnpm format`             | Prettier write                                            |
| `pnpm format:check`       | Prettier check sin escribir                               |
| `pnpm payload migrate`    | Aplica migraciones pendientes                             |
| `pnpm generate:types`     | Regenera `src/payload-types.ts` desde el schema           |
| `pnpm generate:importmap` | Regenera el importmap del admin                           |
| `pnpm seed`               | Carga el contenido por defecto en la DB                   |

**Pre-commit (Husky + lint-staged):** Prettier y ESLint corren automáticamente
sobre los archivos staged antes de cada commit.

---

## Migraciones de base de datos

### Flujo general

El proyecto usa `push: false` en el adaptador de Postgres — **Payload nunca
modifica el schema automáticamente**. Todo cambio de schema va por una
migración explícita:

```
Cambiar config.ts de un Block / Collection / Global
    ↓
Escribir migración en src/migrations/ (manual)
Registrar en src/migrations/index.ts
    ↓
echo "y" | pnpm payload migrate
    ↓
pnpm generate:types
```

### Migraciones actuales (10 total)

| Nombre                            | Qué hace                                                     |
| --------------------------------- | ------------------------------------------------------------ |
| `20260601_000530`                 | Schema inicial completo (tablas base Payload)                |
| `20260609_120000`                 | Tablas de Caracol Next blocks                                |
| `20260610_000000`                 | Tablas de Ditu blocks                                        |
| `20260610_120000`                 | SiteSettings globals                                         |
| `20260610_130000`                 | Ajustes de schema                                            |
| `20260610_140000`                 | Ajustes de schema                                            |
| `20260610_214703`                 | `users_sessions`, `payload_kv`, renombre de índices largos   |
| `20260611_fix_missing_parent_fks` | 6 FK CASCADE faltantes (BrandedContent, SiteSettings)        |
| `20260611_120000`                 | Campos CMS DituHablamos (sticker, heading, description, cta) |
| `20260611_ditu_hero_cms_fields`   | Campos CMS DituHero (heading lines, description)             |

### migrate NO corre automático en el deploy

El build de Vercel (`payload generate:importmap && next build`) no incluye
`migrate`. Antes de cada deploy con cambios de schema, correr manualmente
contra prod:

```bash
export DATABASE_URI="<neon-production-uri>"
echo "y" | pnpm payload migrate
```

### Flujo de staging seguro (pre-merge gate)

Antes de tocar prod en vivo, crear una branch de Neon desde production para
validar las migraciones:

```bash
# 1. Crear branch desde prod
neon branches create \
  --project-id flat-rice-42779922 \
  --parent br-sweet-smoke-aqmhmaxf \
  --name staging-<feature>

# 2. Migrate contra la branch de staging
export DATABASE_URI="<uri-de-la-branch>"
echo "y" | pnpm payload migrate
# Verificar que solo corren las migraciones nuevas

# 3. Si pasa → merge → migrate prod → deploy
```

IDs de Neon:

- **Proyecto:** `flat-rice-42779922` (Caracol Next - Ditu)
- **Branch producción:** `br-sweet-smoke-aqmhmaxf`

---

## Estructura del repositorio

```
caracol-next-ditu/
├── docs/
│   └── INSTALL.md                # Guía de instalación local
├── scripts/
│   └── seed.ts                   # Seed de contenido (ambas landings)
├── src/
│   ├── app/
│   │   ├── (frontend)/           # Rutas públicas
│   │   │   ├── layout.tsx        # Root layout + fonts
│   │   │   ├── page.tsx          # / → Caracol Next
│   │   │   └── ditu/page.tsx     # /ditu → Ditu
│   │   └── (payload)/            # Admin Payload + API
│   │       ├── admin/            # UI admin (/admin)
│   │       └── api/              # REST + GraphQL
│   ├── blocks/                   # Bloques del Page Builder
│   │   ├── shared-fields.ts      # anchorIdField compartido
│   │   ├── RenderBlocks.tsx      # Dispatcher blockType → Component
│   │   │
│   │   │   # Caracol Next
│   │   ├── Hero/
│   │   ├── AudienceNetworks/
│   │   ├── AudienceProfile/
│   │   ├── BrandTabs/
│   │   ├── BrandedContent/
│   │   ├── AdFormats/
│   │   ├── KeyMomentsCalendar/
│   │   ├── OurChannels/
│   │   ├── SportsEvents/
│   │   ├── ContentType/
│   │   ├── Estratos/
│   │   ├── AIRecommendation/
│   │   ├── Contact/
│   │   │
│   │   │   # Ditu
│   │   ├── DituHero/
│   │   ├── DituVideo/
│   │   ├── DituAudiencia/
│   │   ├── DituAdn/
│   │   ├── DituTipoContenido/
│   │   ├── DituCanales/
│   │   ├── DituCalendario/
│   │   ├── DituPauta/
│   │   └── DituHablamos/
│   ├── collections/
│   │   ├── Pages.ts              # Page Builder + versiones/drafts
│   │   ├── Media.ts              # Imágenes (Vercel Blob en prod)
│   │   ├── Categories.ts
│   │   └── Users.ts              # Auth (email/password)
│   ├── globals/
│   │   ├── SiteSettings.ts       # Config global (stats, logos, descripciones)
│   │   ├── HeaderCaracolNext.ts
│   │   ├── HeaderDitu.ts
│   │   ├── FooterCaracolNext.ts
│   │   ├── FooterDitu.ts
│   │   └── FloatingContact.ts
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── marketing/            # Componentes de landing
│   │   └── animations/           # CountUp, RevealSection, ParallaxBackground
│   ├── lib/
│   │   ├── brand.ts
│   │   ├── media.ts
│   │   ├── utils.ts              # cn()
│   │   └── hooks/
│   ├── migrations/               # Ver sección Migraciones
│   ├── styles/
│   │   └── globals.css           # @theme inline + CSS vars + .theme-ditu
│   └── payload.config.ts         # Config Payload
├── public/media/                 # Assets estáticos (SVGs, logos)
├── .env.example
├── components.json               # Config shadcn/ui
├── next.config.ts
└── package.json
```

---

## Arquitectura CMS

### Collections

| Collection   | Descripción                                           |
| ------------ | ----------------------------------------------------- |
| `Pages`      | Páginas con Page Builder. Versiones + drafts activos. |
| `Media`      | Imágenes/archivos. Vercel Blob en prod, disco en dev. |
| `Categories` | Taxonomía reutilizable.                               |
| `Users`      | Usuarios del admin (email/password).                  |

### Globals

| Global              | Descripción                                                    |
| ------------------- | -------------------------------------------------------------- |
| `SiteSettings`      | Config del Home: heading, stats, logos, descripciones de marca |
| `HeaderCaracolNext` | Nav + logo de Caracol Next                                     |
| `HeaderDitu`        | Nav + logo de Ditu                                             |
| `FooterCaracolNext` | Footer de Caracol Next                                         |
| `FooterDitu`        | Footer de Ditu                                                 |
| `FloatingContact`   | Botón flotante de contacto                                     |

### Page Builder

Cada página se compone de bloques arrastrables en el admin. Cada bloque tiene:

- `config.ts` — definición de campos Payload
- `Component.tsx` — render server component que consume los fields del CMS

---

## Design system

Tokens en `src/styles/globals.css` con CSS custom properties, exportados a
Tailwind vía `@theme inline`.

**Colores de marca:**

| Token                              | Valor     | Uso                 |
| ---------------------------------- | --------- | ------------------- |
| `--color-primary`                  | `#015BC4` | Caracol Next (azul) |
| `--color-primary` en `.theme-ditu` | `#8232F0` | Ditu (violeta)      |
| `#77EDED` (inline)                 | cyan      | Accent Ditu         |

**Tipografía:**

| Font family                  | Fuente       | Pesos       |
| ---------------------------- | ------------ | ----------- |
| `font-sans` / `font-display` | Montserrat   | 300–900     |
| `font-spline-sans`           | Spline Sans  | 400/600/700 |
| `font-ditu-display`          | Ditu Display | Bold        |

**Theme switching:** la landing Ditu aplica `.theme-ditu` en `<main>`,
sobreescribiendo los tokens del sistema base.

Para valores exactos del Figma: usar clases arbitrarias `text-[64px]` en vez
de aproximar con tokens del sistema.

---

## Deploy

### Pipeline actual

```
git push origin <branch>
    ↓ Vercel auto-deploy (Preview)
    ↓ pnpm build → payload generate:importmap && next build
    ↓ Status: Ready
```

### Merge a main (producción)

1. Validar migraciones en staging (ver sección Migraciones → pre-merge gate)
2. Merge PR → `main`
3. Correr migrate contra prod Neon **antes** de que el deploy sirva tráfico:
   ```bash
   export DATABASE_URI="<prod-neon-uri>"
   echo "y" | pnpm payload migrate
   ```
4. Vercel despliega automáticamente al detectar el push a `main`

### Env vars en Vercel

| Variable                | Production      | Preview                |
| ----------------------- | --------------- | ---------------------- |
| `DATABASE_URI`          | Neon production | Neon branch de staging |
| `PAYLOAD_SECRET`        | Encrypted       | Encrypted              |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob     | Vercel Blob            |
| `NEXT_PUBLIC_SITE_URL`  | URL de prod     | URL del preview        |

---

## Convenciones de código

- **TypeScript strict**: nunca `any` sin justificación en comentario.
- **Server components por defecto**: `"use client"` solo cuando sea necesario
  (Framer Motion, hooks de React, event handlers).
- **Imports absolutos**: siempre `@/` (configurado en `tsconfig.json`).
- **Tailwind v4**: para valores exactos del Figma usar clases arbitrarias
  `text-[64px]` antes de aproximar con tokens.
- **`src/payload-types.ts` es autogenerado**: nunca editar a mano.
  Regenerar con `pnpm generate:types` tras cualquier cambio de schema.
- **Pre-commit**: Prettier + ESLint corren automáticamente sobre staged files.
- **Figma es la fuente de verdad**: cualquier divergencia visual entre el código
  y el Figma es un bug en el código.

---

## Links rápidos

| Recurso                   | URL                                                                   |
| ------------------------- | --------------------------------------------------------------------- |
| Admin local               | http://localhost:3000/admin                                           |
| Vercel Dashboard          | https://vercel.com/camilo063s-projects/caracol-next-ditu              |
| Neon Dashboard            | https://console.neon.tech/app/projects/flat-rice-42779922             |
| Figma — sistema completo  | `https://www.figma.com/design/xorK9SgP6likPV59r58dYt/...?node-id=0-1` |
| Figma — Home Caracol Next | `...?node-id=347-1597`                                                |
| Figma — Home Ditu         | `...?node-id=548-3733`                                                |
