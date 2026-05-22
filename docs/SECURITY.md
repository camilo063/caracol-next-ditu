# Security — Caracol Next + Ditu

Procedimientos de seguridad operacional. Mantener este doc actualizado tras cada incidente o cambio de práctica.

## Reportar un incidente

- Email: `camilo.villanueva@nivelics.com`
- Asunto: `[CARACOL-CMS] Security: <descripción corta>`
- Información a incluir: ruta afectada, severidad estimada (crítica/alta/media/baja), pasos para reproducir, capturas si las hay.

**No abrir issues públicos en GitHub para vulnerabilidades activas.**

## Headers de seguridad

Configurados en `next.config.ts` → `headers()`. Aplican a todas las respuestas del frontend:

| Header                      | Valor                                                          | Por qué                                              |
| --------------------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload`                 | Fuerza HTTPS en navegadores y futuros sub-dominios.  |
| `X-Content-Type-Options`    | `nosniff`                                                      | Bloquea MIME sniffing.                               |
| `X-Frame-Options`           | `DENY`                                                         | Previene clickjacking.                               |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                              | Limita info enviada en `Referer` cross-origin.       |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | Apaga APIs sensibles + FLoC.                         |
| `Content-Security-Policy`   | (ver next.config.ts)                                           | Solo en frontend público — NO en `/admin` ni `/api`. |

### Notas sobre CSP

- `script-src` incluye `'unsafe-inline'` y `'strict-dynamic'` para que Next inline scripts (con nonce) y RSC payloads carguen.
- En desarrollo se agrega `'unsafe-eval'` (Next dev usa eval para Fast Refresh).
- `style-src` permite `'unsafe-inline'` por necesidad de Tailwind v4 + `style={{}}` inline en componentes pixel-perfect.
- `frame-src` permite `youtube.com` y `youtube-nocookie.com` para los embeds del block `BrandedContent`.

## RBAC

3 roles definidos en `users.role` (`src/collections/Users.ts`):

| Rol      | Crear                                     | Leer                    | Editar                                   | Borrar |
| -------- | ----------------------------------------- | ----------------------- | ---------------------------------------- | ------ |
| `admin`  | users, pages, globals, media, settings    | Todo                    | Todo                                     | Todo   |
| `editor` | pages, globals, media (no users/settings) | Pages, globals públicos | Su propio user, pages, globals editables | —      |
| `viewer` | —                                         | UI read-only del admin  | —                                        | —      |

Definiciones en `src/access/index.ts` (`isAdmin`, `isAdminOrEditor`, `isAdminOrSelf`, etc.).

### Política de passwords

Aplicada por hook `enforcePasswordPolicy` en `src/collections/Users.ts`:

- Mínimo 12 caracteres
- Al menos una mayúscula
- Al menos un número
- Al menos un símbolo (`!@#$%^&*` etc.)

Aplica en `create` y en cualquier update que incluya `password`.

### Bloqueo de cuenta

- `maxLoginAttempts: 5` — tras 5 logins fallidos consecutivos, la cuenta se bloquea.
- `lockTime: 60 * 60 * 1000` ms — 1h de lockout.

### Token expiration

- Producción: 2h (`60 * 60 * 2`)
- Desarrollo: 7d (`60 * 60 * 24 * 7`)

Configurado en `Users.auth.tokenExpiration` (env-gated por `NODE_ENV`).

## Forms — protección anti-spam

- **Honeypot** field `_hp` agregado al ContactForm. Invisible para humanos (off-screen + `tabIndex={-1}` + `aria-hidden`). Si llega lleno al server, el hook `beforeChange` de `form-submissions` dropea la submission con error genérico.
- **Sanitización del honeypot**: si está vacío, se remueve del payload guardado.
- **Rate limiting**: TODO — pendiente de definir según plan Vercel. Si Hobby, integrar Upstash Ratelimit. Si Pro+, configurar Vercel WAF rate-limit rule en `/api/form-submissions` y `/api/ai-recommend`.

## File uploads — validación

Configurada en `src/collections/Media.ts`:

- **MIME types whitelist**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`, `video/mp4`, `video/webm`, `application/pdf`.
- **Tamaño máximo**: 10 MB (hook `beforeChange.validateUpload`).
- **SVG sanitization**: rechaza SVGs que contengan `<script>`, `on*=`, o `javascript:`.

## CORS y CSRF

Restringidos en `payload.config.ts` a:

- `process.env.NEXT_PUBLIC_SITE_URL`
- `process.env.PAYLOAD_PUBLIC_SERVER_URL`

Si se configura dominio custom (`https://caracol.com.co`), agregarlo a ambos arrays.

## Rotación de `PAYLOAD_SECRET`

Procedimiento sin downtime:

1. Generar nuevo secret: `openssl rand -hex 32`.
2. Setear en Vercel/AWS env: `PAYLOAD_SECRET_NEXT=<nuevo>`.
3. Redeploy. Confirmar que está leyendo el viejo todavía.
4. En `payload.config.ts`, cambiar temporalmente:
   ```ts
   secret: process.env.PAYLOAD_SECRET_NEXT ?? process.env.PAYLOAD_SECRET ?? "",
   ```
5. Redeploy. Ahora usa el nuevo.
6. Forzar logout de todos los users desde admin (no hay UI native — borrar todas las rows de la tabla `users_sessions` si existe, o invalidar via `auth.logout` endpoint para cada user).
7. Eliminar `PAYLOAD_SECRET_NEXT` y mover su valor a `PAYLOAD_SECRET` en env.
8. Restaurar `payload.config.ts` al estado original.

Frecuencia recomendada: cada 90 días o tras cualquier incidente sospechoso.

## Audit de dependencies

Manual antes de releases:

```bash
npm audit --production --audit-level=high
```

### Vulnerabilidades upstream conocidas (mayo 2026)

`@payloadcms/db-postgres`, `@payloadcms/drizzle`, `@payloadcms/graphql`, `@payloadcms/richtext-lexical`, `@payloadcms/next` tienen vulns transitives reportadas (mayormente `uuid` y `@esbuild-kit/*`). Todas son fixed en Payload `3.84+`. Plan de mitigación:

- **No exposed a frontend público** — son módulos server-side que solo ejecutan en admin/build.
- **Plan**: upgrade a Payload 3.84+ cuando el resto del stack (Next, Drizzle, etc.) sea estable. Validar breaking changes antes.

## Maintenance mode

Kill-switch en `site-settings.maintenanceMode.enabled` (admin → Site Settings → Mantenimiento). Implementación pendiente — TODO en Fase 7: el frontend layout debe leer el global y redirigir a una página de mantenimiento cuando `enabled === true`.

## Secrets en commits

Pre-commit hook (`.husky/pre-commit`) detecta valores hardcoded de:

- `PAYLOAD_SECRET`, `DATABASE_URI`, `RESEND_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `AI_GATEWAY_API_KEY`, `UPSTASH_REDIS_REST_TOKEN`, `SENTRY_AUTH_TOKEN`

Bloquea el commit si encuentra un valor que no sea vacío, ni una variable `$VAR`, ni un comentario `#`.

## Backups de base de datos

- **Frecuencia**: diario.
- **Proveedor**: Neon Postgres tiene branching automático (point-in-time recovery hasta 7 días).
- **Procedimiento de restore**: documentado en `docs/RUNBOOK.md` (TODO Fase 8).

## OWASP Top 10 — checklist

| Riesgo                        | Mitigación                                                                | Estado                       |
| ----------------------------- | ------------------------------------------------------------------------- | ---------------------------- |
| A01 Broken Access Control     | RBAC + field-level access en `users.role`                                 | ✓                            |
| A02 Cryptographic Failures    | HTTPS + HSTS preload + cookies `secure`+`httpOnly`+`sameSite=lax` en prod | ✓                            |
| A03 Injection                 | Payload usa drizzle parameterized queries; React escapa XSS               | ✓                            |
| A04 Insecure Design           | Drafts/versioning + RBAC + maintenance mode kill-switch                   | ✓                            |
| A05 Security Misconfiguration | CSP + headers de seguridad + audit periódico                              | ✓                            |
| A06 Vulnerable Components     | `npm audit` + upgrade plan documentado                                    | Parcial (upstream pendiente) |
| A07 ID & Auth Failures        | tokenExpiration 2h + lockout + password policy                            | ✓                            |
| A08 Software/Data Integrity   | Payload migrations + git history; commits firmados pendiente              | Parcial                      |
| A09 Logging & Monitoring      | Vercel logs + Vercel Analytics; Sentry pendiente                          | Parcial                      |
| A10 SSRF                      | No hay fetch a URLs user-supplied (revisar AI block si se activa)         | ✓                            |
