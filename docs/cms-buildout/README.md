# Caracol Next + Ditu — CMS Build-out Brief

Este directorio contiene la **especificación completa** para construir el CMS Payload del proyecto `caracol-next-ditu`. Está pensado para ser consumido por una sesión nueva de Claude Code sin contexto previo del repo.

## Premisa única (no negotiable)

> **El 100% del sitio debe ser editable desde el admin de Payload.**
> Cero contenido hardcoded en código. Cada texto, número, imagen, color, URL, label, asset, evento, representante de contacto — todo administrable. El editor del cliente nunca pide un commit para cambiar texto.

## Cómo leer estos docs

Léelos **en orden**. Cada uno depende del anterior:

| #   | Doc                                                        | Qué entrega                                                                     |
| --- | ---------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 00  | [Prompt para sesión nueva](./00-prompt-for-new-session.md) | Prompt copiable para arrancar una sesión fresca de Claude Code                  |
| 01  | [Estado actual](./01-current-state.md)                     | Inventario de lo que ya existe (collections, globals, blocks, rutas, demo-data) |
| 02  | [Modelo de datos objetivo](./02-target-data-model.md)      | Spec completa de cada collection, global, block y campo                         |
| 03  | [Migración y seed](./03-migration-and-seed.md)             | Cómo pasar `demo-data.ts` a Payload + rewire de páginas                         |
| 04  | [Caché y performance](./04-cache-and-performance.md)       | ISR + revalidate + image opt + Core Web Vitals targets                          |
| 05  | [Seguridad y acceso](./05-security-and-access.md)          | RBAC + checklist OWASP + Payload hardening                                      |
| 06  | [Fases de implementación](./06-implementation-phases.md)   | Tareas ordenadas con acceptance criteria                                        |

## Stack y restricciones

- **Frontend**: Next.js 15.5.18 (App Router) + React 19 + Tailwind v4 + Framer Motion + Recharts
- **CMS**: Payload 3.34.0 (collections, globals, blocks, lexical richtext, versions/drafts)
- **DB**: Postgres (`@payloadcms/db-postgres`) — Neon en prod
- **Deploy**: Vercel (Git integration, build command `payload generate:importmap && next build`)
- **Plugins instalados**: `form-builder`, `seo`, `nested-docs`
- **Auth**: Payload nativo (collection `users`)
- **Node**: `^20.18.0 || >=22.12.0`

## Decisiones por defecto (validar antes de implementar)

Estas decisiones se asumieron al escribir los docs. Si el cliente prefiere otra cosa, ajustar el doc correspondiente **antes** de implementar:

| Decisión         | Default                                                                                    | Doc donde se trata |
| ---------------- | ------------------------------------------------------------------------------------------ | ------------------ |
| Media storage    | **Vercel Blob** (integrado, sin cuenta extra)                                              | `02`, `05`         |
| Idioma           | **Solo español** (sin i18n por ahora; hooks listos para futuro)                            | `02`               |
| Drafts/Versiones | **Habilitado** (Pages: drafts + 20 versiones)                                              | `02`, `06`         |
| Preview mode     | **Live Preview** de Payload (ya configurado en `Pages.ts`)                                 | `04`               |
| Form submissions | **Payload `form-submissions` + email Resend**                                              | `02`, `05`         |
| Roles            | **admin** (full) + **editor** (CRUD contenido, no users/settings) + **viewer** (read-only) | `05`               |
| Rate limiting    | **Payload built-in** (configurar threshold) + Vercel WAF si pasa Hobby                     | `05`               |
| Error tracking   | **Sentry** (env-gated, opcional MVP)                                                       | `04`, `05`         |
| Analytics        | **Vercel Web Analytics + Speed Insights** (gratis, instalar)                               | `04`               |
| ISR              | **revalidate por tag** (on-demand desde Payload afterChange hooks)                         | `04`               |

## Targets de performance (obligatorios)

Per requisito del cliente — "el sitio debe responder demasiado rápido":

| Métrica                  | Target                | Cómo se logra                                        |
| ------------------------ | --------------------- | ---------------------------------------------------- |
| LCP (móvil 3G)           | < 2.0s                | ISR + images priority + critical CSS automático Next |
| LCP (desktop)            | < 1.0s                | Static + edge CDN                                    |
| CLS                      | < 0.05                | Reservar dimensiones de todas las imágenes y embeds  |
| TTFB                     | < 200ms               | Static + Vercel Edge Cache                           |
| Lighthouse Performance   | ≥ 95                  | Image opt + dynamic imports + tree-shake             |
| Lighthouse Accessibility | ≥ 95                  | Audit con axe-core en PR                             |
| Bundle First Load JS     | < 250kB               | Code-split charts/animations                         |
| Cache hit ratio          | ≥ 95% en steady state | ISR + on-demand revalidate                           |

## Non-negotiables de seguridad

- **No secrets en el cliente**. Todo lo `NEXT_PUBLIC_*` se asume público.
- **CSP estricta** (script-src self + Vercel-injected nonces; ningún inline sin nonce).
- **HTTPS only** (Vercel default) + **HSTS** con `preload`.
- **CSRF tokens** en formularios (Payload los maneja para admin; en form-submissions añadir verificación honeypot + rate limit).
- **Sanitización** de inputs ricos (Lexical) antes de render — XSS-safe.
- **File upload validation** — mime + size + extension allow-list.
- **Dependency audit** semanal (`npm audit` + Snyk si está disponible).
- **Rotación** de `PAYLOAD_SECRET` documentada en `05`.

## Cómo entregar

Cuando termines, debe quedar:

1. **Cero referencias a `demo-data.ts`** en `src/app/`. Borrar el archivo o moverlo a `scripts/seed/source-data.ts` para que solo el seed lo use.
2. **Las 3 páginas (`/`, `/caracol-next`, `/ditu`) leyendo de Payload** vía Local API.
3. **6 globals seedeados** con la data actual de demo-data.ts.
4. **3 Pages records seedeados** (home, caracol-next/home, ditu/home) con sus block layouts.
5. **Roles `admin`, `editor`, `viewer`** funcionales con access control real.
6. **Test manual completo del admin**: un usuario `editor` puede modificar cada texto/número/imagen del sitio y ver el cambio reflejado tras `revalidate`.
7. **Lighthouse en `https://<deploy>.vercel.app/` ≥ 95 Performance + ≥ 95 Accessibility**.

## Contacto y handoff

Este brief lo escribió la sesión que construyó el frontend pixel-perfect (Fases 1-3). Estado del frontend al momento de handoff:

- ✅ Hub Landing (`/`) implementado con Figma 892:5740
- ✅ Caracol Next (`/caracol-next`) implementado con Figma 347:1600+
- ✅ Ditu (`/ditu`) implementado con Figma 512:2246+
- ⚠️ Las páginas todavía importan de `src/lib/demo-data.ts` — tu trabajo es desconectar esto y leer de Payload.

**No tocar el frontend visual** salvo para cambiar la fuente de datos. Los componentes pixel-perfect están finalizados.
