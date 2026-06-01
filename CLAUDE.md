# CLAUDE.md — Contexto base del proyecto

> Este archivo es leído automáticamente por Claude Code al abrir el repo.
> Lee primero esto, luego los archivos de `docs/claude-context/` cuando
> necesites profundizar en un dominio específico.

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

1. Empezar consultando el nodo Figma vía MCP (`mcp__figma__get_design_context`).
2. Extraer los valores literales: colores hex, font-size, line-height,
   tracking, padding, gap, border-radius, etc.
3. Pegar el valor exacto en el código (preferir clases arbitrarias
   `text-[20px]` o `style` inline antes que aproximar con un token).
4. Verificar visualmente con preview tools o screenshots de comparación.

Detalles operativos en [`docs/claude-context/02-figma-workflow.md`](docs/claude-context/02-figma-workflow.md).

### 2. CMS-driven — todo lo editable vive en Payload

El cliente edita TODO el contenido vía Payload Admin. Eso incluye:

- Textos de cada bloque (heading, subheading, descripciones)
- Imágenes, videos, logos
- Métricas y números
- Eventos del calendario
- Representantes de contacto
- Configuración de header / footer / floating contact
- Estructura de bloques en cada landing

Cuando agregues un componente visual nuevo, **siempre** lo mapeas a un
field de Payload primero. Nunca hardcodees contenido que el cliente debería
poder cambiar.

Schema y mapping en [`docs/claude-context/03-payload-cms.md`](docs/claude-context/03-payload-cms.md).

### 3. Sin clarifying questions — ejecuta

Camilo prefiere ejecución directa. Si tienes una decisión razonable que
tomar, tómala y avanza; él te redirige si no es lo que quería. No pares
para preguntar "¿quieres que…?" salvo en cambios destructivos
(borrar tablas, force-push, etc.).

---

## Tech stack — versiones pinneadas

| Capa        | Tecnología                        | Versión |
| ----------- | --------------------------------- | ------- |
| Framework   | Next.js (App Router)              | 15.5.18 |
| Lenguaje    | TypeScript strict                 | 5.x     |
| UI          | React                             | 19.0    |
| Estilos     | Tailwind CSS v4 (`@theme inline`) | 4.x     |
| Componentes | shadcn/ui (style: new-york)       | manual  |
| Animaciones | Framer Motion v11                 | 11.18.2 |
| Charts      | Recharts                          | 2.15.4  |
| Carousel    | Embla Carousel React              | 8.6.0   |
| CMS         | Payload v3                        | 3.34.0  |
| DB          | PostgreSQL                        | 14+     |
| Forms       | react-hook-form + zod             | latest  |
| Iconos      | lucide-react                      | latest  |
| AI          | Vercel AI SDK v6 + AI Gateway     | 6.0.183 |

**Pinneado** a Next 15.5.18 por compatibilidad con Payload 3.34. No subir
versión sin validar con Camilo.

---

## Comandos esenciales

```bash
npm run dev               # Dev en :3000 (Frontend + Payload + Admin)
npm run devsafe           # Limpia .next y dev (cuando hay cache raro)
npm run build             # Build prod (corre generate:importmap primero)
npm run type-check        # tsc --noEmit
npm run lint:fix          # ESLint con autofix
npm run generate:types    # Regenera src/payload-types.ts desde el schema
npm run payload -- migrate # Corre migraciones Payload
```

**IMPORTANTE — un solo puerto**: el dev server SIEMPRE corre en
`localhost:3000`. La config `.claude/launch.json` tiene `autoPort: false`
para evitar que el preview tool abra puertos aleatorios. Si 3000 está
ocupado, mata el proceso antes de arrancar otro.

---

## Estructura del repo

```
src/
├── app/(frontend)/         # Routes públicas
│   ├── page.tsx            #   → / (HubLanding Home)
│   ├── caracol-next/       #   → /caracol-next
│   ├── ditu/               #   → /ditu
│   └── layout.tsx          #   Root layout + fonts
├── app/(payload)/          # Admin Payload (/admin)
├── blocks/                 # Bloques renderizables del Page Builder
│   ├── Hero/               #   Cada bloque tiene Component.tsx + config.ts
│   ├── AudienceNetworks/
│   ├── BrandTabs/
│   ├── KeyMomentsCalendar/
│   ├── BrandedContent/
│   ├── AdFormats/
│   ├── Contact/
│   └── RenderBlocks.tsx    # Dispatcher por blockType
├── components/
│   ├── ui/                 # shadcn primitives (Button, Card, etc.)
│   ├── marketing/          # Componentes de landing (Header, Footer, Hero Ditu, etc.)
│   └── animations/         # CountUp, RevealSection, ParallaxBackground
├── collections/            # Payload collections (Pages, Media, Users, Categories)
├── globals/                # Payload globals (Header, Footer, FloatingContact, SiteSettings)
├── lib/                    # brand.ts, format.ts, media.ts, utils.ts, youtube.ts, hooks/
├── styles/                 # globals.css con @theme y CSS vars
└── payload.config.ts       # Config Payload (collections, globals, plugins, db)
```

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
  nunca editar a mano. Regenera con `npm run generate:types`.

---

## Documentación detallada

Cuando necesites profundizar en un dominio, lee el archivo correspondiente:

| Tema                                         | Archivo                                                                                        |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Vista general detallada del proyecto         | [`docs/claude-context/01-overview.md`](docs/claude-context/01-overview.md)                     |
| Workflow con Figma MCP + reglas de fidelidad | [`docs/claude-context/02-figma-workflow.md`](docs/claude-context/02-figma-workflow.md)         |
| Arquitectura Payload CMS + mapping bloques   | [`docs/claude-context/03-payload-cms.md`](docs/claude-context/03-payload-cms.md)               |
| Design system (tokens, colores, tipografía)  | [`docs/claude-context/04-design-system.md`](docs/claude-context/04-design-system.md)           |
| Spec de animaciones, parallax, performance   | [`docs/claude-context/05-animations-effects.md`](docs/claude-context/05-animations-effects.md) |
| Roadmap, hecho, pendiente, prioridades       | [`docs/claude-context/06-roadmap.md`](docs/claude-context/06-roadmap.md)                       |

---

## Links rápidos al Figma

| Vista                       | URL                                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Home Caracol Medios         | <https://www.figma.com/design/xorK9SgP6likPV59r58dYt/Mediakit-Caracol-%E2%80%94-Design-System--Copy-?node-id=334-1559> |
| Home Caracol Next (landing) | <https://www.figma.com/design/xorK9SgP6likPV59r58dYt/Mediakit-Caracol-%E2%80%94-Design-System--Copy-?node-id=347-1597> |
| Home Ditu (landing)         | <https://www.figma.com/design/xorK9SgP6likPV59r58dYt/Mediakit-Caracol-%E2%80%94-Design-System--Copy-?node-id=548-3733> |
| Sistema de diseño completo  | <https://www.figma.com/design/xorK9SgP6likPV59r58dYt/Mediakit-Caracol-%E2%80%94-Design-System--Copy-?node-id=0-1>      |

**fileKey** (para llamadas MCP): `xorK9SgP6likPV59r58dYt`
