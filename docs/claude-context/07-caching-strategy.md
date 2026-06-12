# 07 — Estrategia de Caché (Sprint Caché — Fase 6 parte 1)

> Implementado: 2026-06-10. Próxima acción: migrar a `use cache` / `cacheComponents` cuando Next 16+ sea validado con Payload.

---

## Por qué `unstable_cache` y NO `use cache`

| Aspecto                         | `use cache` (nuevo)                             | `unstable_cache` (actual)         |
| ------------------------------- | ----------------------------------------------- | --------------------------------- |
| Estabilidad en Next 15.5.18     | ❌ Experimental — requiere `dynamicIO: true`    | ✅ Estable de facto desde Next 14 |
| Impacto en el app               | Reescribe el modelo de rendering de toda la app | Solo envuelve funciones de query  |
| Compatibilidad con Payload 3.34 | No validada                                     | ✅ Funciona                       |
| Invalidación on-demand          | `revalidateTag`                                 | `revalidateTag` (mismo mecanismo) |

**Decisión**: Next.js está pinneado a 15.5.18 por compatibilidad con Payload 3.34. Habilitar `dynamicIO` implica auditar y adaptar TODOS los server components de la app. Riesgo innecesario para MVP. Se usa `unstable_cache` + `revalidateTag`, que es el patrón establecido para Next 13-15.

**Migración futura**: cuando se valide Payload con Next 16+ (o la versión que estabilice `use cache`), migrar las queries a `use cache` y habilitar `cacheComponents` para mayor granularidad. Anotar en roadmap.

---

## Arquitectura de la capa de caché

```
src/lib/payload/
├── cache-tags.ts   ← fuente de verdad de tags
│                       pageTag(slug)   → "page:<slug>"
│                       globalTag(slug) → "global:<slug>"
└── queries.ts      ← funciones de query envueltas en unstable_cache
```

```
src/collections/Pages.ts     ← afterChange + afterDelete → revalidateTag(pageTag(doc.slug))
src/globals/
  ├── HeaderCaracolNext.ts   ← afterChange → revalidateTag(globalTag("header-caracol-next"))
  ├── HeaderDitu.ts          ← afterChange → revalidateTag(globalTag("header-ditu"))
  ├── FooterCaracolNext.ts   ← afterChange → revalidateTag(globalTag("footer-caracol-next"))
  ├── FooterDitu.ts          ← afterChange → revalidateTag(globalTag("footer-ditu"))
  ├── FloatingContact.ts     ← afterChange → revalidateTag(globalTag("floating-contact"))
  └── SiteSettings.ts        ← afterChange → revalidateTag(globalTag("site-settings"))
```

---

## Anatomía de la clave de caché

```typescript
unstable_cache(
  async () => {
    /* payload.find / findGlobal */
  },
  ["getFunctionName", DEPLOY_ID], // keyParts
  { tags: ["global:header-ditu"], revalidate: 3600 },
);
```

**`DEPLOY_ID`** = `process.env.VERCEL_GIT_COMMIT_SHA ?? 'dev'`

- En producción (Vercel): cada deploy tiene un SHA distinto → todos los keyParts cambian → cache bust automático al deployar.
- En local/dev: `'dev'` fijo → el caché persiste entre hot-reloads y solo se invalida vía `revalidateTag`.

**`revalidate: 3600`**: safety net de 1 hora. Si por algún motivo un hook falla, el caché se invalida solo a más tardar en 1 hora. La invalidación real es on-demand vía hooks.

---

## Flujo de invalidación on-demand

```
Admin edita contenido en /admin
      ↓
Payload afterChange hook
      ↓
revalidateTag("page:ditu") o revalidateTag("global:header-ditu")
      ↓
Next.js Data Cache invalida esa entrada
      ↓
Siguiente request al front → cache miss → re-fetch desde Payload DB
      ↓
Resultado cacheado con el contenido nuevo
```

Payload está embebido en Next.js (monolito). Los hooks corren en el mismo proceso Node.js. `revalidateTag` de `next/cache` funciona directamente — no se necesita un route handler `/api/revalidate`.

---

## Alcance: solo frontend público

Las queries cacheadas son SOLO para las rutas públicas (`/`, `/caracol-next`, `/ditu`).  
El área `/admin` usa la Payload Admin UI que llama directamente a la Payload API — nunca pasa por `queries.ts`. Los datos en admin siempre son frescos (sin caché).

---

## Verificación manual (cómo confirmar que funciona)

1. **Cache hit en public**: abrir `/ditu` por primera vez (cache miss → hit DB). Recargar → sin logs de DB query (hit del caché).
2. **Invalidación on-demand**: editar un campo en `/admin/globals/header-ditu` y guardar. Recargar `/ditu` → el cambio aparece de inmediato (no hay que esperar 3600s).
3. **Admin siempre fresco**: editar en admin, ver los cambios reflejados en admin UI sin recargar (Payload Admin no pasa por `queries.ts`).
4. **Slug rename invalida el tag viejo**: si se cambia el slug de una Page de `"home"` a `"home-v2"`, el hook llama `revalidateTag("page:home")` Y `revalidateTag("page:home-v2")`.

---

## Roadmap de evolución

| Cuando                        | Qué hacer                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| Next 16+ validado con Payload | Migrar queries a `use cache` directive                                             |
| Payload 4.x                   | Revisar si tienen caché nativo integrado                                           |
| High-traffic                  | Considerar Redis adapter para el Data Cache en lugar del filesystem/memory default |
