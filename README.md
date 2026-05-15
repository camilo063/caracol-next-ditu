# Caracol Next + Ditu — Mediakit

Micrositio corporativo del ecosistema Caracol con dos landings:

- **Caracol Next** → `/` (landing principal con tabs por marca)
- **Ditu** → `/ditu` (segunda landing, tono entretenimiento)

100% administrable por cliente vía Payload CMS.

---

## Stack

| Capa        | Tecnología                        | Versión |
| ----------- | --------------------------------- | ------- |
| Framework   | Next.js (App Router)              | 15.5.18 |
| Lenguaje    | TypeScript strict                 | 5.x     |
| UI          | React                             | 19.0    |
| Estilos     | Tailwind CSS v4 (`@theme inline`) | 4.x     |
| Componentes | shadcn/ui (style: new-york)       | manual  |
| CMS         | Payload v3                        | 3.34.0  |
| DB          | PostgreSQL                        | 14+     |
| Forms       | react-hook-form + zod             | latest  |
| Iconos      | lucide-react                      | latest  |

> **Nota Next 16:** la versión actual estable de Next es 16, pero pinneamos 15.5.18 para garantizar compatibilidad con Payload 3.34. Migración a Next 16 después de Fase 5.

---

## Quick start

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar env y rellenar
cp .env.example .env
# editar .env con: PAYLOAD_SECRET (openssl rand -hex 32) y DATABASE_URI

# 3. Levantar Postgres local (opción Docker)
docker run -d --name caracol-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=caracol_next_ditu \
  -p 5432:5432 \
  postgres:16

# 4. Dev server
npm run dev
```

- Frontend → http://localhost:3000
- Admin Payload → http://localhost:3000/admin
- API REST → http://localhost:3000/api/[collection]
- GraphQL → http://localhost:3000/api/graphql

En la primera carga del admin, Payload pide crear el usuario inicial.

---

## Scripts

| Script                       | Hace                                                      |
| ---------------------------- | --------------------------------------------------------- |
| `npm run dev`                | Levanta Next.js en modo dev (Payload incluido)            |
| `npm run devsafe`            | Limpia `.next` y levanta dev (úsalo si tienes cache raro) |
| `npm run build`              | Build de producción                                       |
| `npm start`                  | Sirve el build de producción                              |
| `npm run lint`               | ESLint                                                    |
| `npm run lint:fix`           | ESLint con autofix                                        |
| `npm run type-check`         | `tsc --noEmit`                                            |
| `npm run format`             | Prettier write                                            |
| `npm run format:check`       | Prettier check sin escribir                               |
| `npm run payload`            | CLI de Payload (ej. `npm run payload -- migrate`)         |
| `npm run generate:types`     | Regenera `src/payload-types.ts` desde el schema           |
| `npm run generate:importmap` | Regenera `src/app/(payload)/admin/importMap.js`           |

Pre-commit corre **prettier + eslint** sobre staged files vía Husky + lint-staged.

---

## Variables de entorno

| Variable                    | Cuándo  | Ejemplo                                      |
| --------------------------- | ------- | -------------------------------------------- |
| `PAYLOAD_SECRET`            | Siempre | string aleatorio 32+ chars                   |
| `DATABASE_URI`              | Siempre | `postgresql://user:pass@host:5432/db`        |
| `NEXT_PUBLIC_SITE_URL`      | Siempre | `http://localhost:3000`                      |
| `PAYLOAD_PUBLIC_SERVER_URL` | Siempre | igual al `NEXT_PUBLIC_SITE_URL` en monolito  |
| `RESEND_API_KEY`            | Fase 5  | clave Resend para el formulario de contacto  |
| `RESEND_FROM_EMAIL`         | Fase 5  | email verificado en Resend                   |
| `AI_GATEWAY_API_KEY`        | Fase 5  | Vercel AI Gateway para el block IA           |
| `AUDIENCE_API_URL`          | TBD     | fuente API de audiencia (cliente confirmará) |
| `NETWORKS_API_URL`          | TBD     | fuente API de redes (cliente confirmará)     |

`.env.example` tiene la lista completa con comentarios.

---

## Estructura

```
caracol-next-ditu/
├── docs/                              # auditoria-figma.md, landings-content-blocks.md
├── prompts/                           # prompts originales por fase
├── src/
│   ├── app/
│   │   ├── (frontend)/                # Páginas públicas (Caracol Next, Ditu)
│   │   │   ├── layout.tsx             # Fonts (Montserrat, Spline Sans), es-CO
│   │   │   ├── page.tsx               # / Caracol Next
│   │   │   └── ditu/page.tsx          # /ditu (con theme-ditu override)
│   │   └── (payload)/                 # Admin + API de Payload
│   │       ├── admin/[[...segments]]/ # Admin UI
│   │       ├── api/[...slug]/         # REST
│   │       ├── api/graphql/           # GraphQL
│   │       └── layout.tsx             # Layout del admin
│   ├── blocks/                        # Payload Blocks (Fase 3)
│   ├── collections/                   # Payload Collections (Fase 2)
│   │   └── Users.ts                   # Stub auth (Fase 0)
│   ├── components/
│   │   ├── ui/                        # shadcn primitives (button, input, textarea, label, dialog)
│   │   └── marketing/                 # componentes brand (Fase 1)
│   ├── globals/                       # Payload Globals (Fase 2)
│   ├── lib/
│   │   └── utils.ts                   # cn() para Tailwind
│   ├── styles/
│   │   └── globals.css                # Tokens (@theme inline) + .theme-ditu
│   └── payload.config.ts              # Config Payload (Postgres, Lexical, Sharp)
├── public/
├── .env.example
├── .prettierrc / .prettierignore
├── components.json                    # config shadcn
├── eslint.config.mjs
├── next.config.ts                     # withPayload wrapper
├── postcss.config.mjs                 # Tailwind v4 vía @tailwindcss/postcss
├── tsconfig.json
└── package.json
```

---

## Design tokens

Definidos en `src/styles/globals.css` con CSS variables y exportados a Tailwind vía `@theme inline`.

**Naming semántico:**

- `bg-background`, `text-foreground`, `text-primary`, `bg-primary`, etc. (shadcn-compatible).
- Brand tokens: `text-caracolnext`, `bg-ditu`, `text-screamin-green`.
- Categorías: `bg-cat-01` … `bg-cat-06`.

**Theme switcher por landing:**

- `/` (Caracol Next) usa primary azul `#015BC4`.
- `/ditu` aplica clase `.theme-ditu` en el `<main>` que sobreescribe `--color-primary` al violeta Ditu `#8232F0`.

**Fuentes:**

- `font-sans` / `font-display` → Montserrat (300 → 900).
- `font-mobile-btn` → Spline Sans (400/600/700).

Ver `docs/auditoria-figma.md` § C "Tokens" para el origen de cada valor.

---

## Próximos pasos (Prompt 3 — Fases)

- **Fase 1** — Atoms: Container, Section, FloatingContact, theme switcher.
- **Fase 2** — Payload Collections (Pages, Posts, Media, Categories, Forms) + Globals (Header, Footer, FloatingContact, SiteSettings) + Blocks declarados.
- **Fase 3** — Render de cada Block (Hero, Audiencia, BrandTabs, Momentos, Pauta, BrandedContent, Channels, SportsEvents, AIRecommendation, Contacto).
- **Fase 4** — Página dinámica `[slug]` + seed Home/Ditu + sitemap/robots/metadata.
- **Fase 5** — Resend, Vercel Analytics, plugin SEO Payload.

Cada fase requiere OK explícito antes de avanzar.

---

## Referencias

- `docs/auditoria-figma.md` — auditoría Figma MCP-readiness (score 2/5, qué arreglar).
- `docs/landings-content-blocks.md` — tabla de bloques por landing aprobada por cliente.
- Figma: https://www.figma.com/design/xP0yxleEgB2ecKd77ObU6m/Mediakit-Caracol-%E2%80%94-Design-System
