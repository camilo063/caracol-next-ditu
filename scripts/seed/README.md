# Seed Scripts

Scripts para poblar Payload con la data inicial del sitio.

## Uso

```bash
npm run seed
```

Se ejecuta una vez por entorno (dev, preview, prod). **No correr en CI/build.**

## Pre-flight

Requiere estas env vars (carga automática desde `.env.local` o `.env`):

- `PAYLOAD_SECRET` — clave de Payload (32+ chars random).
- `DATABASE_URI` — Postgres connection string (usar pooler URL en prod).
- `BLOB_READ_WRITE_TOKEN` — opcional, para que los assets vayan a Vercel Blob.
  Sin esta var, los uploads van a `public/media` (filesystem local).

Opcionales:

- `SEED_ADMIN_EMAIL` — email del admin a crear (default `admin@caracoltv.com.co`).
- `SEED_ADMIN_PASSWORD` — password temporal (default `CaracolCMS2026!`).
- `SEED_ADMIN_NAME` — nombre visible del admin (default `Admin Caracol`).

## Qué hace

1. **`upload-assets.ts`** — sube los 8 brand icons del Hero (Caracol TV, Noticias
   Caracol, Caracol Sports, Blu Radio, Gol Caracol, Volk, BumBox, La Kalle) a
   la collection `media`. Idempotente vía lookup por `filename`.

2. **`seed-users.ts`** — crea un usuario admin si no existe. Lookup por email.

3. **`seed-globals.ts`** — sobreescribe los 7 globals (`hub-page`,
   `header-caracol-next`, `header-ditu`, `footer-caracol-next`, `footer-ditu`,
   `floating-contact`, `site-settings`) con datos de `src/lib/demo-data.ts`.
   `updateGlobal` siempre sobreescribe, no requiere lookup.

4. **`seed-pages.ts`** — crea/actualiza las 2 pages base (`caracol-next/home`,
   `ditu/home`) con sus block layouts. Idempotente vía lookup por
   `(landing, slug)`. Status `published`.

## Idempotencia

Re-correr `npm run seed` no duplica records — cada sub-script hace lookup
por una key única y decide create-vs-update. El output usa `+` para creación
y `↻` para update existente.

## Rewrite de referencias a media

Demo-data tiene paths hardcoded (`/caracol-next/brands/caracoltv.png`) como
shape `{ url, alt }` en los upload-fields. `rewrite-media.ts` recorre las
estructuras y reemplaza cada uno por el `mediaId` (number) correspondiente
del Map devuelto por `uploadAssets`. Si un path no se encuentra en el Map,
se reemplaza por `null` (Payload no falla en fields opcionales).

## Restricciones

- **No correr en build de Vercel** — sobreescribiría cambios que el editor
  haya hecho desde `/admin`. El seed es manual one-shot.
- **Password admin** — el default `CaracolCMS2026!` se debe rotar en el
  primer login. Documentar en el handoff al cliente.
- **Assets hardcoded en components** — algunos assets viven en `src/blocks/*/Component.tsx`
  (e.g. `BRAND_LOGO_PATHS` de BrandTabs, social-\* de Ditu). No se suben
  al CMS por diseño — son parte del frontend, no contenido editorial.
