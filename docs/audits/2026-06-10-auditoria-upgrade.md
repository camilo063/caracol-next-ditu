# Auditoría de Upgrade de Dependencias — 2026-06-10

> Auditoría de solo lectura. Ningún archivo fue modificado durante su generación.
> Node.js instalado: v24.12.0 | pnpm lockfileVersion: 9.0

---

## Resumen Ejecutivo

El proyecto corre sobre Next.js 15.5.18 y Payload 3.34.0. Ambas versiones tienen problemas críticos que requieren atención inmediata:

1. **Vulnerabilidad crítica de SQL Injection activa (GHSA-xx6w-jxg9-2wh8, CVSS 9.8)**: `@payloadcms/drizzle` < 3.73.0 permite inyección SQL en queries con campos JSON/RichText sobre PostgreSQL. Este proyecto usa `@payloadcms/db-postgres` con Postgres. La corrección mínima es actualizar todo el ecosistema Payload a **3.85.1**.

2. **Vulnerabilidad crítica de Account Takeover (GHSA-hp5w-3hxx-vmwf, CVSS 9.1)**: `@payloadcms/graphql` < 3.79.1 permite tomar control de cuentas via inyección de parámetros en password recovery.

3. **Gap de compatibilidad Next ↔ Payload**: Next.js 15.5.x **no está soportado por ninguna versión de Payload**. La ventana sin soporte va de Next 15.5.0 a 16.1.x. El camino correcto es ir directamente a **Payload 3.85.1 + Next 16.2.x** en una sola operación coordinada.

4. **25 vulnerabilidades totales** (4 críticas, 3 altas, 18 moderadas), todas resueltas actualizando Payload a 3.85.1 y Next a 16.2.x.

### Tabla de upgrades prioritarios

| Paquete                   | Actual (lockfile)   | Target  | Tipo de salto        | Razón                                        |
| ------------------------- | ------------------- | ------- | -------------------- | -------------------------------------------- |
| `payload`                 | 3.34.0              | 3.85.1  | minor (51 versiones) | CVE crítica SQL injection + account takeover |
| `@payloadcms/db-postgres` | 3.34.0              | 3.85.1  | minor                | CVE crítica SQL injection (CVSS 9.8)         |
| `@payloadcms/graphql`     | 3.34.0 (transitive) | 3.85.1  | minor                | CVE crítica account takeover (CVSS 9.1)      |
| `@payloadcms/next`        | 3.34.0              | 3.85.1  | minor                | Dependiente de Payload; CVE alta             |
| `next`                    | 15.5.18             | 16.2.9  | **MAJOR**            | Soporte Payload 3.73+; Turbopack por defecto |
| `react` / `react-dom`     | 19.0.0              | 19.2.x  | minor                | Requerido por Next 16                        |
| `framer-motion`           | 11.18.2             | 12.40.0 | **MAJOR**            | Motion v12 reescribió API pública            |
| `sharp`                   | 0.34.4              | 0.35.0  | minor                | minor bump disponible                        |
| `ai` (Vercel AI SDK)      | 6.0.193             | 6.0.200 | patch                | patch seguro                                 |

### Recuento de CVEs por severidad

| Severidad | Cantidad | Estado                                    |
| --------- | -------- | ----------------------------------------- |
| Crítica   | 4        | Requiere acción inmediata                 |
| Alta      | 3        | Requiere acción inmediata                 |
| Moderada  | 18       | Resueltas como efecto del upgrade Payload |
| Total     | 25       | —                                         |

---

## Fase 0 — Inventario de Versiones

### Paquetes core

| Paquete      | Instalada (lockfile) | Última en npm | Tipo de salto | Notas                                                                   |
| ------------ | -------------------- | ------------- | ------------- | ----------------------------------------------------------------------- |
| `next`       | 15.5.18              | **16.2.9**    | MAJOR         | Turbopack por defecto; Async APIs removidas; `middleware` → `proxy`     |
| `react`      | 19.0.0               | 19.2.7        | minor         | Next 16 requiere React 19.2 (canary del App Router)                     |
| `react-dom`  | 19.0.0               | 19.2.7        | minor         | Alineado con React                                                      |
| `typescript` | 5.9.3                | 6.0.3         | **MAJOR**     | TS 6 es breaking; Next 16 requiere mínimo TS 5.1 — no urgente subir a 6 |

### Paquetes Payload CMS

| Paquete                           | Instalada (lockfile) | Última en npm | Tipo de salto       | Notas                                                            |
| --------------------------------- | -------------------- | ------------- | ------------------- | ---------------------------------------------------------------- |
| `payload`                         | 3.34.0               | **3.85.1**    | minor (51 releases) | CVE críticas activas desde 3.34; fix en 3.44+ y 3.73+ y 3.79.1+  |
| `@payloadcms/db-postgres`         | 3.34.0               | **3.85.1**    | minor               | SQL injection fix en 3.73.0; mover toda la suite al mismo tag    |
| `@payloadcms/richtext-lexical`    | 3.34.0               | **3.85.1**    | minor               | file-type vuln resuelta; paquete tiene vuln por debajo de 3.85.1 |
| `@payloadcms/plugin-form-builder` | 3.34.0               | **3.85.1**    | minor               | Transitiva via payload/ui                                        |
| `@payloadcms/plugin-seo`          | 3.34.0               | **3.85.1**    | minor               | Transitiva via payload/ui                                        |
| `@payloadcms/plugin-nested-docs`  | 3.34.0               | **3.85.1**    | minor               | Transitiva via payload                                           |
| `@payloadcms/storage-vercel-blob` | 3.34.0               | **3.85.1**    | minor               | Transitiva via @vercel/blob + undici                             |
| `@payloadcms/next`                | 3.34.0               | **3.85.1**    | minor               | Debe coincidir con versión de payload                            |
| `@payloadcms/ui`                  | 3.34.0               | **3.85.1**    | minor               | Transitiva; CVE moderada activa                                  |

### Paquetes UI / Animaciones

| Paquete                | Instalada (lockfile) | Última en npm   | Tipo de salto | Notas                                                             |
| ---------------------- | -------------------- | --------------- | ------------- | ----------------------------------------------------------------- |
| `framer-motion`        | 11.18.2              | **12.40.0**     | **MAJOR**     | Renombrado a `motion`; API breaking (ver Fase 3)                  |
| `recharts`             | 2.15.4               | 3.8.1           | **MAJOR**     | Recharts 3 tiene breaking changes de API                          |
| `embla-carousel-react` | 8.6.0                | 8.6.0           | —             | Al día                                                            |
| `lucide-react`         | 0.474.0              | 1.17.0          | **MAJOR**     | v1.0 fue breaking; revisar icons eliminados/renombrados           |
| `zod`                  | 3.25.76              | 4.4.3           | **MAJOR**     | Zod v4 tiene cambios de API; `@ai-sdk/gateway` acepta zod ^3 o ^4 |
| `react-hook-form`      | 7.77.0               | 7.78.0          | patch         | —                                                                 |
| `@hookform/resolvers`  | 3.10.0               | _(últimos 7.x)_ | —             | Verificar con zod si se sube                                      |

### Paquetes dev / tooling

| Paquete                | Instalada (lockfile) | Última en npm | Tipo de salto | Notas             |
| ---------------------- | -------------------- | ------------- | ------------- | ----------------- |
| `tailwindcss`          | 4.3.0                | 4.3.0         | —             | Al día            |
| `@tailwindcss/postcss` | 4.3.0                | 4.3.0         | —             | Al día            |
| `typescript`           | 5.9.3                | 6.0.3         | MAJOR         | Ver nota arriba   |
| `@types/react`         | 19.2.15              | 19.2.17       | patch         | Seguro actualizar |
| `@types/react-dom`     | 19.2.3               | 19.2.3        | —             | Al día            |

### Paquetes AI / infra

| Paquete              | Instalada (lockfile)     | Última en npm    | Tipo de salto | Notas                                                   |
| -------------------- | ------------------------ | ---------------- | ------------- | ------------------------------------------------------- |
| `ai` (Vercel AI SDK) | 6.0.193                  | 6.0.200          | patch         | Seguro; `^6.0.183` en package.json ya cubre             |
| `@ai-sdk/anthropic`  | _(no directo, vía `ai`)_ | 3.0.82           | —             | No es dependencia directa; gestionado por Vercel AI SDK |
| `sharp`              | 0.34.4                   | 0.35.0           | minor         | Seguro; libvips bumps                                   |
| `graphql`            | 16.14.0                  | _(~16.9.0 spec)_ | —             | Al día dentro del rango declarado                       |

---

## Fase 1 — Vulnerabilidades (npm audit)

Resultado: **25 vulnerabilidades** (4 críticas · 3 altas · 18 moderadas).
Todas son resolubles subiendo Payload a 3.85.1 y Next a una versión ≥ 16.3.0-canary.6 o ≥ 9.3.3 (la vuln de `postcss` tiene fix indicado a next@9.3.3, pero ese fix semver del audit es un artefacto — la corrección real está en next ≥ 16.3.0-canary.6 para postcss ≥ 8.5.10).

| CVE / Advisory                | Severidad              | Paquete(s) afectado(s)                                                                          | Directa / Transitiva                                                | Versión que resuelve                                  | Afecta este proyecto                                        |
| ----------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| GHSA-xx6w-jxg9-2wh8           | **Crítica** (CVSS 9.8) | `@payloadcms/drizzle` < 3.73.0                                                                  | Transitiva (vía `@payloadcms/db-postgres`)                          | `@payloadcms/db-postgres` ≥ 3.85.1                    | **SÍ** — usa Postgres con campos JSON/RichText              |
| GHSA-hp5w-3hxx-vmwf           | **Crítica** (CVSS 9.1) | `@payloadcms/graphql` < 3.79.1 — Pre-Auth Account Takeover via password recovery                | Transitiva (vía `@payloadcms/next`)                                 | `@payloadcms/richtext-lexical` ≥ 3.85.1               | **SÍ** — admin panel expuesto; usuarios autenticados        |
| _(sin CVE asignado)_          | Crítica agregada       | `@payloadcms/db-postgres` ≤ 3.84.1                                                              | **Directa**                                                         | 3.85.1                                                | **SÍ**                                                      |
| _(sin CVE asignado)_          | Crítica agregada       | `payload` ≤ 3.84.1 — payload-preferences IDOR (CVSS 5.4) + Session Fixation + JWT no invalidado | **Directa**                                                         | `@payloadcms/plugin-seo` ≥ 3.85.1                     | **SÍ** — usa `Users` collection con autenticación           |
| GHSA-26rv-h2hf-3fw4           | Moderada               | `@payloadcms/graphql` / `@payloadcms/next` < 3.44.0 — Session Fixation en SQLite adapter        | Transitiva                                                          | Payload ≥ 3.44.0 (incluido en 3.85.1)                 | Moderado (proyecto usa Postgres, no SQLite)                 |
| GHSA-5v66-m237-hwf7           | Moderada               | `@payloadcms/graphql` / `@payloadcms/next` < 3.44.0 — JWTs no invalidados en logout             | Transitiva                                                          | Payload ≥ 3.44.0                                      | **SÍ** — sesiones de admin no se invalidan al cerrar sesión |
| _(Drizzle ORM SQL injection)_ | Alta (CVSS 7.5)        | `drizzle-orm` < 0.45.2                                                                          | Transitiva (vía `@payloadcms/db-postgres`)                          | `@payloadcms/db-postgres` ≥ 3.85.1                    | **SÍ**                                                      |
| _(Undici memory/smuggling)_   | Alta                   | `undici` ≤ 6.23.0 (3 CVEs: CVSS 5.9 / 6.5 / 7.5)                                                | Transitiva (vía `@payloadcms/storage-vercel-blob` → `@vercel/blob`) | Actualizar `@payloadcms/storage-vercel-blob` ≥ 3.85.1 | Moderado — solo en rutas de upload de media                 |
| _(PostCSS XSS)_               | Moderada (CVSS 6.1)    | `postcss` < 8.5.10                                                                              | Transitiva (vía `next`)                                             | `next` ≥ 16.2.x (bundlea postcss ≥ 8.5.10)            | Bajo — solo en build, no en runtime                         |
| _(esbuild dev server CSRF)_   | Moderada (CVSS 5.3)    | `esbuild` ≤ 0.24.2                                                                              | Transitiva (vía `drizzle-kit` → `@esbuild-kit`)                     | `@payloadcms/db-postgres` ≥ 3.85.1                    | Bajo — solo en `next dev`                                   |
| _(file-type infinite loop)_   | Moderada (CVSS 5.3)    | `file-type` 13.0.0–21.3.0                                                                       | Transitiva (vía `@payloadcms/richtext-lexical`)                     | `@payloadcms/richtext-lexical` ≥ 3.85.1               | Moderado — parsing de uploads en rich text                  |
| _(ajv ReDoS)_                 | Moderada               | `ajv` 7.0.0-alpha – 8.17.1                                                                      | Transitiva                                                          | `@payloadcms/plugin-seo` ≥ 3.85.1                     | Bajo — validación de esquemas                               |
| _(uuid buffer overflow)_      | Moderada (CVSS 7.5)    | `uuid` < 11.1.1                                                                                 | Transitiva (vía `@payloadcms/ui`)                                   | `@payloadcms/plugin-seo` ≥ 3.85.1                     | Bajo                                                        |

---

## Fase 2 — Compatibilidad Next ↔ Payload

### Matriz de compatibilidad (verificada con web research)

| Next.js         | Payload compatible                 | Estado                 |
| --------------- | ---------------------------------- | ---------------------- |
| 15.0.x – 15.4.x | Payload 3.x (todas las versiones)  | Soportado              |
| **15.5.x**      | **Ninguna versión de Payload**     | **GAP — no soportado** |
| 16.0.x – 16.1.x | Ninguna versión de Payload estable | GAP — solo canaries    |
| **16.2.x+**     | **Payload ≥ 3.73.0**               | **Soportado**          |

**Situación actual del proyecto**: Next 15.5.18 está en la ventana de GAP. Payload 3.73.0 fue la primera versión con soporte explícito de Next 16 (Turbopack HMR + build), y requirió Next ≥ 16.2.0. La versión 3.82.0 elevó el mínimo a Next 16.2.2 para corregir un bug de Turbopack HMR.

### Versiones target para el upgrade coordinado

| Paquete                          | Target                                            | Razón                                                       |
| -------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| `next`                           | **16.2.9** (latest estable)                       | Soportado por Payload ≥ 3.73.0; Turbopack estable           |
| `payload` + todo `@payloadcms/*` | **3.85.1**                                        | Último estable; resuelve todas las CVEs; soporta Next 16.2+ |
| `react` / `react-dom`            | **19.2.x** (lo que instale next@16.2.9 como peer) | Next 16 App Router requiere React 19.2                      |
| `@types/react`                   | **19.2.17**                                       | Alineado                                                    |

### Por qué NO se puede hacer el upgrade en dos pasos separados

- Subir solo Next 15.5 → 16.x: rompe Payload 3.34 (incompatibilidad confirmada).
- Subir solo Payload 3.34 → 3.85.1 sin subir Next: Payload 3.85.1 puede correr con Next 15.x pero las versiones 3.73+ están optimizadas para Next 16 y algunas mejoras de Turbopack HMR solo aplican en Next 16.2+.
- Solución: una sola rama de upgrade que mueve ambos simultáneamente.

---

## Fase 3 — Breaking Changes

### Next 15 → 16 (impacto sobre este proyecto)

#### CRÍTICO — Async Request APIs (sincrónico removido completamente)

Next 15 introdujo las APIs asíncronas con compatibilidad temporal sincrónica. **Next 16 la remueve definitivamente.**

| API                          | Afecta este proyecto                       | Archivo                                            | Acción requerida                                        |
| ---------------------------- | ------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------- | ---------------------------- |
| `cookies()`                  | No (no usada directamente)                 | —                                                  | Ninguna                                                 |
| `headers()`                  | No (no usada directamente)                 | —                                                  | Ninguna                                                 |
| `params` en `page.tsx`       | **SÍ** — `/admin/[[...segments]]/page.tsx` | `src/app/(payload)/admin/[[...segments]]/page.tsx` | Ya usa `Promise<{segments: string[]}>` — **compatible** |
| `searchParams` en `page.tsx` | **SÍ** — mismo archivo                     | Idem                                               | Ya usa `Promise<{[key:string]: string                   | string[]}>` — **compatible** |

El boilerplate de Payload ya fue generado con la API asíncrona. Las páginas públicas (`/`, `/caracol-next`, `/ditu`) no usan `params` ni `searchParams` directamente.

#### CRÍTICO — `revalidateTag` requiere segundo argumento

**Este es el cambio más impactante para este proyecto.**

Next 16 hace que `revalidateTag(tag)` (un solo argumento) sea **deprecated con error TypeScript** y requiere un segundo argumento `cacheLife`:

```ts
// Next 15 (actual)
revalidateTag("page:caracol-next");

// Next 16 (requerido)
revalidateTag("page:caracol-next", "max"); // o 'days', 'hours', etc.
```

**Archivos afectados** (9 llamadas a `revalidateTag` sin segundo argumento):

| Archivo                            | Llamadas | Contexto                        |
| ---------------------------------- | -------- | ------------------------------- |
| `src/globals/HeaderCaracolNext.ts` | 1        | afterChange hook                |
| `src/globals/HeaderDitu.ts`        | 1        | afterChange hook                |
| `src/globals/FooterCaracolNext.ts` | 1        | afterChange hook                |
| `src/globals/FooterDitu.ts`        | 1        | afterChange hook                |
| `src/globals/FloatingContact.ts`   | 1        | afterChange hook                |
| `src/globals/SiteSettings.ts`      | 1        | afterChange hook                |
| `src/collections/Pages.ts`         | 3        | afterChange + afterDelete hooks |

**Acción**: agregar `'max'` como segundo argumento en todas las llamadas. Con `'max'` el comportamiento es stale-while-revalidate, que es la semántica que ya tiene el proyecto (los hooks de Payload invalidan on-demand, el TTL de 3600s es safety-net).

Adicionalmente, `unstable_cache` en `src/lib/payload/queries.ts` tendrá que evaluarse para migrar a `use cache` + `cacheTag`/`cacheLife` (su prefijo `unstable_` sigue funcionando pero está marcado para eventual deprecación).

#### ALTO — Turbopack por defecto en `next dev` Y `next build`

El proyecto actualmente corre `next dev` (sin `--turbopack`). En Next 16, Turbopack es el bundler por defecto también en `next build`. El proyecto usa `withPayload()` en `next.config.ts` que puede añadir configuración de webpack interna.

**Riesgo**: si `withPayload` de Payload 3.34 inyecta configuración webpack, `next build` fallará en Next 16 con error de configuración conflictiva. Con Payload 3.85.1 esto debe estar resuelto. Verificar con `next build --webpack` como escape si es necesario.

#### MEDIO — `middleware.ts` → `proxy.ts` (deprecated, no removido aún)

El proyecto no tiene `middleware.ts`. Sin impacto.

#### MEDIO — `serverRuntimeConfig` / `publicRuntimeConfig` removidos

El proyecto no usa `next/config` ni `serverRuntimeConfig`. Sin impacto.

#### BAJO — Cambios en `next/image`

- `minimumCacheTTL` cambia de 60s a 4h por defecto → beneficioso para CDN
- `imageSizes` elimina `16` del array por defecto → sin impacto (no se usan imágenes de 16px)
- `images.remotePatterns` ya se usa (vacío actualmente) → compatible

#### BAJO — ESLint Flat Config por defecto

El proyecto ya usa ESLint 9 con flat config (`eslint.config.mjs` o similar). Verificar que `eslint-config-next` 15.x → 16.x sea compatible.

#### INFORMATIVO — Turbopack filesystem caching (beta)

Nueva opción `experimental.turbopackFileSystemCacheForDev: true` que acelera cold starts. Opcional, no breaking.

### Payload 3.34 → 3.85.1

Los cambios de minor entre 3.34 y 3.85.1 son de 51 releases. Los más relevantes para este proyecto:

| Versión | Cambio relevante                                                                                          |
| ------- | --------------------------------------------------------------------------------------------------------- |
| 3.44.0  | Fix Session Fixation (GHSA-26rv-h2hf-3fw4) + JWT invalidation (GHSA-5v66-m237-hwf7)                       |
| 3.73.0  | **SQL Injection fix (GHSA-xx6w-jxg9-2wh8)**; soporte Next 16.2.0+; `@payloadcms/drizzle` ≥ 3.73           |
| 3.79.1  | **Account Takeover fix (GHSA-hp5w-3hxx-vmwf)**; fix password recovery                                     |
| 3.82.0  | Mínimo Next 16.2.2 elevado (fix Turbopack HMR); `--no-server-fast-refresh` en dev scripts para Next 16.2+ |
| 3.85.1  | Latest estable; `@payloadcms/drizzle` y toda la suite unificada; ajv ReDoS; uuid fix                      |

El cambio de config más notable: algunos templates de Payload 3.82+ agregan `--no-server-fast-refresh` al script `dev`. Evaluar si aplica al `withPayload({ devBundleServerPackages: false })` que ya tiene el proyecto.

### Otros major bumps (evaluación de riesgo)

#### framer-motion v11 → v12 (MAJOR — riesgo alto)

Motion v12 fue un rebranding/reescritura parcial:

- El paquete principal se renombró a `motion` (aunque `framer-motion` sigue como alias)
- `motion/react` es el nuevo entry point recomendado
- Algunos hooks cambiaron de firma
- **Impacto**: este proyecto usa `framer-motion` en componentes de animación (`src/components/animations/`, `src/blocks/`). Requiere auditoría de imports antes de actualizar. **No incluir en la misma etapa que el upgrade Payload/Next.**

#### lucide-react v0.474 → v1.17 (MAJOR — riesgo bajo-medio)

Lucide pasó a v1.0 con algunos íconos renombrados/eliminados. El proyecto usa `^0.474.0`. Verificar íconos específicos usados. Upgrade seguro pero verificar visualmente.

#### zod v3 → v4 (MAJOR — riesgo medio)

Zod v4 tiene breaking changes en refinements y `.transform()`. El proyecto usa zod con react-hook-form. `@ai-sdk/gateway` acepta `zod ^3.25.76 || ^4.1.8`. Upgrade opcional, no urgente.

#### recharts v2 → v3 (MAJOR — riesgo medio)

Recharts 3 tiene breaking changes en props de componentes. El proyecto usa recharts en bloques de métricas. Upgrade no urgente.

#### TypeScript v5 → v6 (MAJOR — riesgo alto)

TypeScript 6 tiene breaking changes en narrowing estricto. Next 16 solo requiere TS ≥ 5.1. **No subir TS a v6 en el mismo ciclo.**

---

## Fase 4 — Superficie de Impacto

### Archivos que requieren cambios para el upgrade Payload + Next

| Archivo                            | Motivo del cambio                                                                                                                        | Nivel de riesgo        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `src/globals/HeaderCaracolNext.ts` | `revalidateTag` sin segundo argumento → TS error en Next 16                                                                              | **Medio**              |
| `src/globals/HeaderDitu.ts`        | Ídem                                                                                                                                     | **Medio**              |
| `src/globals/FooterCaracolNext.ts` | Ídem                                                                                                                                     | **Medio**              |
| `src/globals/FooterDitu.ts`        | Ídem                                                                                                                                     | **Medio**              |
| `src/globals/FloatingContact.ts`   | Ídem                                                                                                                                     | **Medio**              |
| `src/globals/SiteSettings.ts`      | Ídem                                                                                                                                     | **Medio**              |
| `src/collections/Pages.ts`         | 3 llamadas a `revalidateTag` sin segundo argumento                                                                                       | **Medio**              |
| `next.config.ts`                   | `withPayload` de 3.85.1 puede cambiar opciones; evaluar `--no-server-fast-refresh`; mover `experimental.turbopack` a top-level si se usa | **Bajo**               |
| `package.json`                     | Actualizar versiones de next, react, react-dom, @types/react, payload y todos @payloadcms/\*                                             | **Alto**               |
| `pnpm-lock.yaml`                   | Regenerado por pnpm tras actualizar package.json                                                                                         | **Alto** (generado)    |
| `src/lib/payload/queries.ts`       | `unstable_cache` sigue funcionando en Next 16 pero está deprecated; migración a `use cache` + `cacheTag` es trabajo futuro               | **Bajo** (no breaking) |

### Archivos que NO requieren cambios

| Archivo                                            | Razón                                                                                                           |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `src/app/(payload)/admin/[[...segments]]/page.tsx` | Ya usa `Promise<params>` y `Promise<searchParams>` — compatible con Next 16                                     |
| `src/app/(frontend)/page.tsx`                      | Sin `params`/`searchParams`; usa Server Components async — compatible                                           |
| `src/app/(frontend)/caracol-next/page.tsx`         | Ídem                                                                                                            |
| `src/app/(frontend)/ditu/page.tsx`                 | Ídem                                                                                                            |
| `src/payload.config.ts`                            | API de `buildConfig` estable; `postgresAdapter`, `lexicalEditor`, plugins — sin breaking changes en 3.34→3.85.1 |
| `src/lib/payload/cache-tags.ts`                    | Solo exports de funciones puras — sin cambios                                                                   |

### Nota sobre Turbopack HMR en `src/blocks/*`

El proyecto pineó Next 15.5.18 en parte por compatibilidad con Payload. El Turbopack HMR en dev tenía un bug documentado con Next 16.0–16.1 que afectaba hot-reload de Server Components en el admin panel. Payload 3.82.0 subió el mínimo a Next **16.2.2** precisamente para garantizar que este bug esté corregido. Con el upgrade target (Next 16.2.9 + Payload 3.85.1), el bug de HMR debería estar resuelto.

---

## Fase 5 — Plan por Etapas

### Etapa A — Preparación (prerequisito, en rama dedicada)

**Objetivo**: preparar el código para que compile con Next 16 antes de instalar Next 16.

**Cambios en código**:

1. En los 8 archivos con `revalidateTag(tag)`:
   ```ts
   // Antes
   revalidateTag(globalTag("header-caracol-next"));
   // Después
   revalidateTag(globalTag("header-caracol-next"), "max");
   ```
2. Verificar que `eslint-config-next` se actualice junto con Next.
3. Verificar que no hay imports de `next/legacy/image` (no hay, confirmado).
4. Verificar que no hay `AMP` config (no hay, confirmado).
5. Verificar que no hay `serverRuntimeConfig` / `publicRuntimeConfig` (no hay, confirmado).

**Checklist de verificación**:

- [ ] `npm run type-check` pasa localmente (con Next 15 aún)
- [ ] `npm run lint:fix` sin errores
- [ ] `npm run build` pasa con Next 15
- [ ] PR de preparación mergeado a `main` antes de iniciar Etapa B

---

### Etapa B — Upgrade Coordinado Payload 3.85.1 + Next 16.2.9

**Esta es la operación de mayor riesgo. Hacerla en una sola PR atómica.**

**Cambios en `package.json`**:

```json
{
  "dependencies": {
    "next": "^16.2.9",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "payload": "3.85.1",
    "@payloadcms/db-postgres": "3.85.1",
    "@payloadcms/next": "3.85.1",
    "@payloadcms/richtext-lexical": "3.85.1",
    "@payloadcms/plugin-form-builder": "3.85.1",
    "@payloadcms/plugin-seo": "3.85.1",
    "@payloadcms/plugin-nested-docs": "3.85.1",
    "@payloadcms/storage-vercel-blob": "3.85.1",
    "@payloadcms/ui": "3.85.1"
  },
  "devDependencies": {
    "eslint-config-next": "^16.2.9",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3"
  }
}
```

**Comando de instalación**:

```bash
pnpm install
```

**Tras instalar**:

1. Regenerar tipos de Payload: `npm run generate:types`
2. Regenerar importmap: `npm run generate:importmap`
3. Correr migraciones si las hay: `npm run payload -- migrate`

**Checklist de verificación**:

- [ ] `npm run type-check` sin errores
- [ ] `npm run build` pasa (Turbopack por defecto)
- [ ] `npm run dev` arranca sin errores
- [ ] Admin panel `/admin` carga y se puede loguear
- [ ] Páginas públicas `/`, `/caracol-next`, `/ditu` renderizan correctamente
- [ ] Editar un global en el admin → revalidación funciona (page se actualiza)
- [ ] `npm audit` muestra 0 críticas / altas tras el upgrade
- [ ] Hot Module Replacement en dev funciona en bloques de `src/blocks/*`

---

### Etapa C — CVE residuales (post Etapa B)

Verificar que `npm audit` no reporta vulnerabilidades tras el upgrade de Etapa B. Si `postcss` aún aparece como moderada con el `next` bundled, verificar que es postcss ≥ 8.5.10.

Si `undici` sigue apareciendo como alta, verificar la versión instalada de `@vercel/blob` transitivo.

**Checklist**:

- [ ] `npm audit --json | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['metadata']['vulnerabilities'])"` muestra `critical: 0, high: 0`
- [ ] Vuln de `postcss` resuelta (bundled en Next 16.2.9)

---

### Etapa D — Upgrades opcionales (sin urgencia, etapas separadas)

Estos upgrades tienen valor pero no son bloqueantes de seguridad. Hacerlos en PRs separadas, una por paquete.

| Upgrade                               | Esfuerzo                                                   | Beneficio                | Cuándo                                   |
| ------------------------------------- | ---------------------------------------------------------- | ------------------------ | ---------------------------------------- |
| `sharp` 0.34.4 → 0.35.0               | Bajo — cambiar versión                                     | minor bug fixes          | Próximo sprint                           |
| `lucide-react` 0.474 → 1.x            | Bajo-medio — verificar íconos                              | API estable v1           | Próximo sprint                           |
| `ai` (Vercel AI SDK) patch            | Trivial — ya en rango `^6`                                 | patches automáticos      | Ya cubierto por `^6.0.183`               |
| `react-hook-form` patch               | Trivial                                                    | patch                    | Ya cubierto por `^7`                     |
| `framer-motion` v11 → v12             | **Alto** — auditoría de todos los componentes de animación | Performance, nuevas APIs | Sprint dedicado; no combinar con Etapa B |
| `recharts` v2 → v3                    | Medio — revisar props de charts                            | API mejorada             | Sprint dedicado                          |
| `zod` v3 → v4                         | Medio — validar resolvers de react-hook-form               | API más ergonómica       | Evaluar cuando Zod v4 madure             |
| `typescript` v5 → v6                  | **Alto** — puede romper tipos estrictos                    | Tipos más precisos       | Ciclo separado, post-estabilización      |
| Migrar `unstable_cache` → `use cache` | Medio — refactor de queries.ts                             | API estable de Next 16   | Después de validar Etapa B en producción |

---

## Fase 6 — Riesgos y Rollback

### Estrategia de branches

```
main
 └── feat/upgrade-etapa-a-revalidate-fix     ← Etapa A (segura, solo código)
      └── feat/upgrade-etapa-b-payload-next16  ← Etapa B (riesgosa, deps)
```

No mergear Etapa B a `main` sin verificar en un entorno de staging con una base de datos de PostgreSQL real.

### Variables de entorno

Verificar que `DATABASE_URI`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, y `PAYLOAD_PUBLIC_SERVER_URL` están correctamente seteadas en el entorno de staging antes de correr migraciones.

### Migraciones de base de datos

Payload 3.85.1 puede incluir nuevas migraciones de Drizzle sobre el schema existente. **Siempre hacer backup de la base de datos antes de correr `npm run payload -- migrate`**.

```bash
# Backup antes de migrar (ejemplo con pg_dump)
pg_dump $DATABASE_URI > backup-pre-upgrade-$(date +%Y%m%d).sql
npm run payload -- migrate
```

### Procedimiento de rollback

Si el build o el admin panel fallan tras la Etapa B:

1. **No hacer force-push**. Crear una nueva rama desde `main` pre-upgrade.
2. Revertir `package.json` y correr `pnpm install` para restaurar el lockfile.
3. Si se corrieron migraciones y fallaron: restaurar el backup de base de datos.
4. Los archivos modificados en Etapa A (`revalidateTag` con dos argumentos) son retrocompatibles con Next 15 — no necesitan revertirse.

### Criterio de go/no-go para producción

- `npm audit` sin críticas ni altas
- `next build` (Turbopack) completa sin errores
- Admin panel funcional: login, CRUD en Pages, Media upload
- `revalidateTag` funciona end-to-end: editar en admin → página pública se actualiza
- Performance: `next build` no incrementa bundle size > 20% vs línea base

---

_Auditoría generada el 2026-06-10 usando datos en tiempo real de npm registry, GitHub advisories, y documentación oficial de Next.js y Payload CMS._
