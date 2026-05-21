# 06 · Fases de implementación

Orden estricto. Cada fase tiene acceptance criteria explícitos. **No marcar una fase como completa hasta que TODOS los criterios estén verdes.** Al final de cada fase: commit, push, dame un resumen para validar antes de pasar a la siguiente.

## Fase 0 — Bootstrap y validación

Antes de tocar código. Validar que el entorno funciona.

**Tareas:**

- [ ] Clonar repo y `npm install`.
- [ ] Copiar `.env.example` a `.env` y llenar `PAYLOAD_SECRET` (`openssl rand -hex 32`).
- [ ] Levantar Postgres local (Docker o Neon dev branch). Setear `DATABASE_URI`.
- [ ] `npm run dev` → `http://localhost:3000` renderiza `/`, `/caracol-next`, `/ditu` (data hardcoded).
- [ ] `http://localhost:3000/admin` carga la UI de Payload.
- [ ] Crear primer user manualmente vía admin (Payload pide email + password en first run).
- [ ] `npm run build` localmente pasa sin errores.
- [ ] Confirmar que Vercel deploy actual está READY (commit `ddf6bf2` o posterior).

**Acceptance criteria:**

- ✓ Frontend renderiza idéntico a antes del build-out.
- ✓ Admin Payload accesible.
- ✓ Build local + deploy Vercel verde.

**Si algo falla aquí, NO avanzar a Fase 1.** Resolver bloqueador primero.

---

## Fase 1 — Roles y access control

Setup de seguridad antes de exponer admin a editores.

**Tareas:**

- [ ] Editar `src/access/index.ts`: agregar `isAdmin`, `isAdminOrEditor`, `isAdminOrSelf`, `publishedOrAuth`, `anyone` (ver doc 05).
- [ ] Editar `src/collections/Users.ts`: agregar campo `role` + `name` + access policies. Agregar `auth.tokenExpiration: 7200`, `maxLoginAttempts: 5`, `lockTime: 3600000`, `cookies` secure.
- [ ] Editar `src/collections/Pages.ts`: aplicar `access: { create: isAdminOrEditor, read: publishedOrAuth, ... }`.
- [ ] Editar `src/collections/Media.ts`: `read: anyone`, `create/update: isAdminOrEditor`, `delete: isAdmin`. Hacer `alt` requerido. Validar SVG anti-XSS + size 10MB en `beforeChange`.
- [ ] Editar `src/collections/Categories.ts`: aplicar policies.
- [ ] Editar todos los `src/globals/*.ts`: agregar `access: { read: anyone, update: isAdminOrEditor }`. Site-settings: `update: isAdmin`.
- [ ] Migrar Users existentes: agregar role=admin al user inicial (manualmente via DB o admin UI).
- [ ] `npm run generate:types` para regenerar `payload-types.ts`.
- [ ] Password validation hook en Users (mínimo 12 chars + mayúscula + número + símbolo).

**Acceptance criteria:**

- ✓ Login como admin: ve todo.
- ✓ Crear user con rol "editor" desde admin.
- ✓ Login como editor: NO ve la sección Users en sidebar. Puede editar Pages, Globals (excepto site-settings), Media.
- ✓ Login como viewer: ve admin en read-only — todos los save buttons disabled.
- ✓ Password "abc123" rechazado en create user. "MiPassSeguro123!" aceptado.
- ✓ 5 logins fallidos consecutivos → cuenta locked 1h.
- ✓ `npm run build` + `npm run type-check` pasan.

**Commit**: `feat(cms): RBAC con admin/editor/viewer + auth hardening`

---

## Fase 2 — Schema completo + Vercel Blob

Llenar gaps del data model.

**Tareas:**

- [ ] Instalar `@payloadcms/storage-vercel-blob`: `npm i @payloadcms/storage-vercel-blob`.
- [ ] Crear Vercel Blob store: `vercel blob` CLI o Dashboard → auto-inyecta `BLOB_READ_WRITE_TOKEN`.
- [ ] Editar `payload.config.ts`: agregar `vercelBlobStorage` plugin gated por env.
- [ ] Editar `src/collections/Pages.ts`:
  - Extender `landing` enum con "hub".
  - Agregar `meta` group (SEO override).
  - Agregar `revalidate` number en sidebar.
- [ ] Crear `src/globals/HubPage.ts` con el schema del doc 02. Registrarlo en `payload.config.ts`.
- [ ] Editar `src/globals/SiteSettings.ts`: agregar `maintenanceMode` group + `defaultSeo` group.
- [ ] **Gap analysis blocks**: para CADA `src/blocks/*/config.ts`, comparar con la entrada correspondiente en `src/lib/demo-data.ts` y agregar campos faltantes. Documentar en commits separados.
- [ ] (Opcional) Crear `src/collections/Brands.ts` si se decide migrar tokens de marca al CMS. Si no, dejar `src/lib/brand.ts` y agregar nota.
- [ ] `npm run generate:types` después de cada cambio de schema.

**Acceptance criteria:**

- ✓ Admin UI muestra el nuevo Global "Página Hub (/)".
- ✓ Site-settings tiene tab/section "Maintenance Mode" con toggle.
- ✓ Pages tab "Contenido" tiene los 3 valores de `landing` (incluyendo Hub).
- ✓ Pages sidebar tiene field "Revalidate (seg)".
- ✓ Upload imagen en admin → guardada en Vercel Blob (verificar URL incluye `.public.blob.vercel-storage.com`).
- ✓ Para cada block, los campos del `config.ts` cubren TODO lo que demo-data.ts pasa (revisar 1-a-1).
- ✓ `npm run generate:types` corre sin errores, `payload-types.ts` actualizado y commiteado.

**Commit(s)**: uno por área (`feat(cms): blob storage`, `feat(cms): hub-page global`, `feat(cms): block field gaps`).

---

## Fase 3 — Seed script

Poblar Payload con la data de demo-data.ts.

**Tareas:**

- [ ] Instalar `tsx`: `npm i -D tsx`.
- [ ] Agregar script a `package.json`: `"seed": "tsx scripts/seed.ts"`.
- [ ] Crear `scripts/seed/upload-assets.ts` con el listado completo de assets (caracol-next/brands/_, caracol-next/brand-tabs/_, hub/\*).
- [ ] Crear `scripts/seed/seed-users.ts`. Password temporal env-gated.
- [ ] Crear `scripts/seed/seed-globals.ts` (header/footer/floating/hub-page/site-settings).
- [ ] Crear `scripts/seed/seed-pages.ts` (caracol-next/home, ditu/home).
- [ ] Crear orchestrator `scripts/seed.ts`.
- [ ] Implementar **rewrite media refs**: helper que recorre demo-data y reemplaza URLs string por mediaIds.
- [ ] Hacer el seed **idempotente**: lookup por unique key (filename, slug+landing, slug global), update si existe, create si no.
- [ ] Documentar en `scripts/seed/README.md`: cómo correr, env vars necesarios, comportamiento.

**Acceptance criteria:**

- ✓ `npm run seed` en local (DB limpia) crea ~20 media, 6 globals, 2 pages, 1 user.
- ✓ Re-correr `npm run seed` no duplica. Output dice "updated" en cada record.
- ✓ Admin UI muestra los 7 brand tabs en `Pages > Caracol Next > Layout > brand-tabs`.
- ✓ Cada Page tiene `_status: published`.
- ✓ `media` collection tiene URLs de Vercel Blob (no rutas `/caracol-next/...`).
- ✓ Login con admin@caracoltv.com.co + password temporal funciona.

**Commit**: `feat(cms): seed script idempotente`

---

## Fase 4 — Rewire de páginas a Payload Local API

Desconectar `demo-data.ts` del runtime.

**Tareas:**

- [ ] Reescribir `src/app/(frontend)/page.tsx` para `findGlobal({ slug: "hub-page" })`. Mapear data a props de `<HubLanding>`. Agregar `export const revalidate = 3600`.
- [ ] Reescribir `src/app/(frontend)/caracol-next/page.tsx` para `find({ collection: "pages", where: { landing, slug } })`. `notFound()` si no existe.
- [ ] Reescribir `src/app/(frontend)/ditu/page.tsx` igual.
- [ ] Reescribir `src/app/(frontend)/layout.tsx` para leer `header-*`, `footer-*`, `floating-contact` desde Payload (con `unstable_cache` + tag).
- [ ] Mover `src/lib/demo-data.ts` → `scripts/seed/source-data.ts`. Actualizar imports en `scripts/seed/*.ts`. Confirmar `grep -r "demo-data"` solo retorna paths bajo `scripts/`.
- [ ] Diff visual: comparar `/`, `/caracol-next`, `/ditu` antes vs después → debe ser idéntico (pixel-perfect).

**Acceptance criteria:**

- ✓ `grep -rE "(demo-data|from \"@/lib/demo-data\")" src/` retorna 0 matches.
- ✓ Las 3 URLs renderean idénticas al pre-Fase-4 (screenshot diff manual o Percy).
- ✓ `npm run build` produce páginas estáticas (○) no dinámicas (ƒ). Verificar en output:
  ```
  ├ ○ /
  ├ ○ /caracol-next
  ├ ○ /ditu
  ```
- ✓ Cambiar `Hero > heading` desde admin → no se ve el cambio inmediato (sin revalidate todavía — siguiente fase).

**Commit**: `feat(cms): páginas leyendo de Payload Local API`

---

## Fase 5 — Cache + revalidate on-demand

Hacer que los edits del admin se reflejen rápido.

**Tareas:**

- [ ] En `src/collections/Pages.ts`: agregar `hooks.afterChange = [revalidatePage]` (ver doc 04).
- [ ] En cada `src/globals/*.ts`: agregar afterChange que revalida `global:{slug}` + las pages que usan ese global. Header/footer revalidan todas las pages.
- [ ] Wrap todas las queries de páginas en `unstable_cache` con `tags` y `revalidate: 3600`.
- [ ] Site-settings.maintenanceMode change → revalida todas las pages.
- [ ] Media afterChange con archivo cambiado → revalida pages que la referencian (sobreinvalidar es OK).
- [ ] Instalar `@vercel/analytics` y `@vercel/speed-insights`: agregar a `layout.tsx`.
- [ ] Configurar `next.config.ts`:
  - `images.remotePatterns` para Vercel Blob.
  - `experimental.optimizePackageImports: ["lucide-react", "framer-motion", "recharts"]`.
  - Headers `Cache-Control` para `/media` y `/_next/static`.
- [ ] Dynamic imports para `AgePeakBarChart`, `GenderPieChart` (Recharts).
- [ ] Audit bundle: `npm run build` → confirmar `First Load JS shared` < 110 kB.

**Acceptance criteria:**

- ✓ Editar `Hero > heading` en admin → save → ir a la URL pública (sin recargar) → cambio visible en < 5s. (Test: abrir DevTools Network, ver que el HTML refresca con nuevo contenido tras revalidate.)
- ✓ Site-settings → activar maintenance mode → frontend redirige a página de mantenimiento en < 5s.
- ✓ `npm run build` output:
  - First Load JS shared by all ≤ 110 kB
  - Cada route First Load JS ≤ 250 kB
- ✓ En el deploy de Vercel, Network tab muestra `cache-control: public, max-age=31536000` en assets `/media/*`.
- ✓ Vercel Speed Insights muestra data después de 24h de tráfico.

**Commit**: `feat(cms): revalidate on-demand + bundle optimization`

---

## Fase 6 — Hardening security

Aplicar checklist de seguridad.

**Tareas:**

- [ ] Configurar `next.config.ts` `headers()` con CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- [ ] Probar CSP en preview deploy: confirmar que Framer Motion + Recharts no rompen. Ajustar `script-src` si necesario.
- [ ] Honeypot field en formularios + `beforeChange` hook en `form-submissions` que dropea silently.
- [ ] (Opcional Hobby+) Rate limiting con Upstash Redis: instalar `@upstash/ratelimit @upstash/redis`, configurar middleware. Env vars `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`.
- [ ] Restringir `payload.config.ts` `cors` a domain específico (no `*`).
- [ ] Configurar Vercel WAF (si plan permite) — rules para `/api/form-submissions` y `/api/ai-recommend`.
- [ ] Agregar `.husky/pre-commit` check de secrets hardcoded.
- [ ] Audit: `npm audit --production --audit-level=high` → 0 vulnerabilities. Fix las que aparezcan.
- [ ] (Opcional) Sentry: instalar wizard, configurar `SENTRY_DSN` env var.
- [ ] Documentar en `docs/SECURITY.md`: rotación de PAYLOAD_SECRET, manejo de incidentes, contacto.

**Acceptance criteria:**

- ✓ `curl -I https://<deploy>.vercel.app/` muestra:
  - `strict-transport-security: max-age=63072000; includeSubDomains; preload`
  - `content-security-policy: default-src 'self'; ...`
  - `x-content-type-options: nosniff`
  - `x-frame-options: DENY`
- ✓ Intentar embed del sitio en un iframe externo → bloqueado por X-Frame-Options.
- ✓ Inyectar `<script>alert(1)</script>` en un input del admin (richtext) → al renderizar en frontend, NO ejecuta (lexical sanitiza).
- ✓ Form contact con honeypot relleno → submit retorna 200 (silent drop), pero NO se crea form-submission record.
- ✓ Form contact 6 submits seguidos desde misma IP → 6to retorna 429.
- ✓ `grep -rE "process\.env\.[A-Z_]+" src/` con filtro de archivos client/components → solo `NEXT_PUBLIC_*`.

**Commit**: `chore(security): CSP + rate limiting + audit`

---

## Fase 7 — SEO, sitemap, robots, 404, error pages

UX y discoverability.

**Tareas:**

- [ ] `src/app/(frontend)/sitemap.ts` que itera Pages publicadas y genera XML.
- [ ] `src/app/(frontend)/robots.ts` con `Disallow: /admin` y `Sitemap: <site>/sitemap.xml`.
- [ ] `src/app/(frontend)/not-found.tsx` branded (logo + mensaje + CTA volver home).
- [ ] `src/app/global-error.tsx` para crashes (Server Component error boundary).
- [ ] Pages → `meta` field se usa en `generateMetadata` por página (override de site-settings.defaultSeo).
- [ ] Validar JSON-LD para SEO (Organization schema en root layout).
- [ ] OG image dinámica (opcional): `app/opengraph-image.tsx` o pre-generadas.

**Acceptance criteria:**

- ✓ `curl https://<deploy>.vercel.app/sitemap.xml` retorna XML con las 3 URLs.
- ✓ `curl https://<deploy>.vercel.app/robots.txt` retorna `Disallow: /admin`.
- ✓ `curl https://<deploy>.vercel.app/url-inexistente` retorna 404 con página branded.
- ✓ Google Rich Results Test sobre `/` muestra Organization schema OK.
- ✓ Twitter Card Validator + Facebook Sharing Debugger muestran OG image correcta.

**Commit**: `feat(seo): sitemap + robots + branded 404 + metadata per page`

---

## Fase 8 — QA final, Lighthouse, handoff

Validación end-to-end antes de marcar done.

**Tareas:**

- [ ] Setup Lighthouse CI: `.lighthouserc.json` + `.github/workflows/lighthouse.yml` (ver doc 04).
- [ ] Correr Lighthouse manual sobre las 3 URLs en prod. Capturas en `docs/lighthouse-reports/`.
- [ ] Test manual exhaustivo: lista en `docs/QA-CHECKLIST.md` (crear) con 50+ items cubriendo:
  - Cada block edit/save → revalidate → cambio visible
  - Roles: admin/editor/viewer con acciones específicas
  - Forms: submit válido, submit inválido, submit con honeypot, rate limit
  - Mobile/tablet/desktop visual
  - Performance: TTFB, LCP por URL
  - Maintenance mode toggle on/off
  - Logout → login → ve admin
- [ ] Crear `docs/CLIENT-HANDOFF.md`: cómo el cliente edita el sitio, login admin URL, contactos en caso de issues.
- [ ] Crear `docs/RUNBOOK.md`: cómo restaurar de DB backup, rotar secrets, escalar Postgres.
- [ ] Cleanup: borrar archivos demo no usados, comments stale, console.logs olvidados.

**Acceptance criteria:**

- ✓ Lighthouse CI verde (≥ 95 en Performance, Accessibility, Best Practices, SEO) en las 3 URLs.
- ✓ QA checklist 100% completado.
- ✓ Client handoff doc revisado y aprobado por Camilo.
- ✓ Runbook listo con procedimientos de recovery.
- ✓ `npm run build` clean, sin warnings.
- ✓ `npm run type-check` clean.
- ✓ `npm audit --production --audit-level=high` → 0 vulns.

**Commit**: `chore: QA final + handoff docs`

---

## Resumen del orden

| Fase      | Foco                          | Estimación |
| --------- | ----------------------------- | ---------- |
| 0         | Bootstrap                     | 1h         |
| 1         | RBAC + auth hardening         | 2-3h       |
| 2         | Schema completo + Vercel Blob | 4-6h       |
| 3         | Seed script                   | 3-4h       |
| 4         | Rewire pages a Payload        | 4-6h       |
| 5         | Cache + bundle opt            | 3-4h       |
| 6         | Security hardening            | 3-4h       |
| 7         | SEO + 404 + sitemap           | 2-3h       |
| 8         | QA + handoff                  | 4-6h       |
| **Total** | **26-37h**                    |            |

## Reglas de ejecución

1. **Una fase a la vez.** No mezclar PRs/commits de fases distintas.
2. **Lint + typecheck + build pasan antes de commit.** Si lint-staged falla, fixear, no skipear.
3. **Commit messages convencionales** (`feat:`, `fix:`, `chore:`, `docs:`).
4. **Push después de cada fase** y avisar a Camilo para validar antes de la siguiente.
5. **Si algún acceptance criteria no pasa**, abrir issue/comment en lugar de avanzar. Documentar el bloqueador.
6. **Cero `any` implícito.** Tipa todo (excepto Payload-generated types que no son tu responsabilidad).
7. **No tocar el frontend visual** (componentes de blocks). Solo data source.

## Salida final

Cuando la Fase 8 esté completa, el repo debería tener:

```
✓ Frontend pixel-perfect intacto
✓ CMS Payload con RBAC funcional
✓ Cero data hardcoded (demo-data.ts solo en scripts/)
✓ Cache hit ratio ≥ 95%
✓ Revalidate < 5s edit-to-visible
✓ Lighthouse ≥ 95 en las 3 categorías
✓ CSP estricta + security headers + rate limiting
✓ Vercel Blob storage para media
✓ Vercel Analytics + Speed Insights instalados
✓ Sitemap + robots.txt + 404 branded
✓ Client handoff doc + runbook
```

Y el cliente edita su sitio entero desde `/admin` sin tocar código.
