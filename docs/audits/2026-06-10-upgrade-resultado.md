# Resultado del upgrade de seguridad — feat/upgrade-payload385-next16

**Fecha:** 2026-06-10  
**Rama:** `feat/upgrade-payload385-next16` (base: `main`)  
**Estado:** ✅ Completado — listo para revisión antes de merge a main

---

## Resumen ejecutivo

El upgrade ataca dos CVEs críticos que existían en `main` con Payload 3.34.0:

| CVE                 | CVSS         | Descripción                                                   | Fix en         |
| ------------------- | ------------ | ------------------------------------------------------------- | -------------- |
| GHSA-xx6w-jxg9-2wh8 | 9.8 Critical | SQL injection en queries JSON/RichText (PostgreSQL y SQLite)  | Payload 3.73.0 |
| GHSA-hp5w-3hxx-vmwf | 9.1 Critical | Account takeover via parameter injection en password recovery | Payload 3.79.1 |

Ambos están **parcheados** en esta rama.

---

## Versiones antes / después

| Paquete                           | Antes   | Después    |
| --------------------------------- | ------- | ---------- |
| `payload` + todos `@payloadcms/*` | 3.34.0  | **3.85.1** |
| `next`                            | 15.5.18 | **16.2.9** |
| `react` / `react-dom`             | 19.0.0  | **19.2.0** |
| `@types/react`                    | 19.x    | 19.2.17    |
| `eslint-config-next`              | 15.5.18 | **16.2.9** |

---

## Fase 3 — Migraciones Payload

Payload 3.85.1 generó una migración nueva respecto al snapshot de `main`:

**`20260610_214703`** — aplicada exitosamente a Neon en 283ms:

```sql
CREATE TABLE "users_sessions" (   -- JWT invalidation (CVE fix para account takeover)
  "_order" integer, "_parent_id" integer, "id" varchar PRIMARY KEY,
  "created_at" timestamp, "expires_at" timestamp NOT NULL
);
CREATE TABLE "payload_kv" (       -- nuevo KV store interno de Payload
  "id" serial PRIMARY KEY, "key" varchar, "data" jsonb
);
-- + rename de 17 índices (normalización a 63 chars de Drizzle)
-- + ALTER TABLE forms_emails: corrección de quote escape en default
```

Estado de migraciones en Neon tras el upgrade:

```
20260601_000530  batch 1  Ran: Yes  (migración base de main)
20260610_214703  batch 3  Ran: Yes  (nueva — Payload 3.85.1)
```

> **Nota batch 3:** el batch 2 corresponde a las migraciones del branch `cms`
> que están registradas en Neon pero que esta rama no conoce. No es un problema —
> Payload solo aplica las migraciones que existen en `src/migrations/index.ts`.

---

## Fase 4 — Verificación

| Check                       | Resultado                                  |
| --------------------------- | ------------------------------------------ |
| `tsc --noEmit`              | ✅ 0 errores                               |
| `npm run build` (Turbopack) | ✅ Compiló en 19.5s — 8 rutas OK           |
| `pnpm audit` — critical     | ✅ 0                                       |
| `pnpm audit` — high         | ✅ 0                                       |
| `pnpm audit` — moderate     | ⚠️ 18 (ver abajo)                          |
| `npm run lint` — errors     | ✅ 0 errores                               |
| `npm run lint` — warnings   | ⚠️ 18 warnings (unused args en migrations) |

### Vulnerabilidades moderate restantes (no accionables)

Todas son dependencias transitivas del Admin UI de Payload (no del frontend público):

- `esbuild <=0.24.2` — vía `drizzle-kit/@esbuild-kit/esm-loader` (solo dev tooling)
- `dompurify <3.3.2` → `<3.4.0` — vía `monaco-editor` (el editor de código del Admin)

No son accionables sin subir Payload a 3.86+. El Admin está protegido por autenticación, por lo que la superficie de ataque es mínima.

---

## Breaking changes manejados

| Cambio                                                    | Archivo               | Acción tomada                                                                                                                |
| --------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `eslint` key inválida en `NextConfig`                     | `next.config.ts`      | Eliminada                                                                                                                    |
| `FlatCompat` no soporta `eslint-config-next@16`           | `eslint.config.mjs`   | Migrado a flat config nativo (`core-web-vitals` y `typescript` como arrays directos)                                         |
| `react-hooks` v6 agrega reglas estrictas nuevas           | `eslint.config.mjs`   | Reglas `set-state-in-effect`, `purity`, `refs` deshabilitadas (violaciones pre-existentes, no introducidas por este upgrade) |
| `pnpm-workspace.yaml` requiere `minimumReleaseAgeExclude` | `pnpm-workspace.yaml` | Agregadas entradas para `next@16.2.9` y paquetes `@next/*`                                                                   |
| `tsconfig.json` `jsx: "preserve"` → `"react-jsx"`         | `tsconfig.json`       | Actualizado (React 19 new JSX transform)                                                                                     |
| `package-lock.json` stale de npm obsoleto                 | raíz                  | Eliminado (proyecto usa pnpm; npm audit leía el lockfile incorrecto)                                                         |

---

## Warning no-bloqueante en build/dev

```
⨯ turbopackServerFastRefresh
```

Fuente: `@payloadcms/next/withPayload` inyecta `experimental.turbopackServerFastRefresh: false`
en Next 16.2.9+. La opción fue movida/renombrada en algún punto de Next 16.2.x.
**No bloquea el build ni la ejecución.** Se debe reportar al issue tracker de Payload.

---

## Pendientes para después del merge

### 1. `revalidateTag({ expire: 0 })` — CRÍTICO al mergear `cms` → esta rama

El sistema de cache (`unstable_cache`, `revalidateTag`) vive **solo** en el branch `cms`.
Cuando `cms` se mergee aquí, hay 9 llamadas a `revalidateTag(tag)` que deben cambiarse a:

```typescript
revalidateTag(tag, { expire: 0 }); // ← read-your-writes semantics
// NO usar 'max' — eso es SWR, no purge inmediato
```

Archivos afectados (todos en `src/globals/` y `src/collections/`):

- `HeaderCaracolNext.ts`, `HeaderDitu.ts`
- `FooterCaracolNext.ts`, `FooterDitu.ts`
- `FloatingContact.ts`, `SiteSettings.ts`
- `Pages.ts` (×3 hooks)

### 2. Violaciones de `react-hooks` v6

Los 10 componentes que violan `set-state-in-effect`, `purity`, y `refs` son patrones
pre-existentes que funcionan en runtime pero que el React Compiler considera inseguros.
Deben corregirse en un PR separado antes de re-habilitar las reglas:

```javascript
"react-hooks/set-state-in-effect": "off",  // ← remover cuando se corrijan
"react-hooks/purity": "off",
"react-hooks/refs": "off",
```

Archivos: `FormatModal.tsx`, `BrandedContent/Component.tsx`, `RenderBlocks.tsx`,
`count-up.tsx`, `floating-contact.tsx`, `fullscreen-toggle.tsx`,
`hub-landing.tsx`, `carousel.tsx`, `use-media-query.ts`

### 3. Verificación manual del Admin

No fue posible hacer browser testing en este contexto. Antes del merge a main verificar:

- `/admin` carga y login funciona (el nuevo `users_sessions` table es requisito del CVE fix)
- CRUD en Pages / Media / Globals
- Las 3 rutas públicas (`/`, `/caracol-next`, `/ditu`) renderizan correctamente
- HMR en `src/blocks/*` (mejorado con Turbopack en Next 16)

---

## Commits en esta rama

```
d9dd36a  fix: disable react-hooks v6 strict rules introduced by eslint-config-next 16
f38226d  feat: security upgrade Payload 3.85.1 + Next 16.2.9 + React 19.2
```

**NO mergear a `main` hasta verificación manual del Admin en staging.**
