# 05 · Seguridad y access control

> Sin compromiso: el sitio público no expone datos sensibles, los formularios no son spammables, el admin solo para autorizados, y los secrets nunca salen del servidor.

## Roles y RBAC

Tres roles en `users.role`:

| Rol      | Puede                                                                         | No puede                                                           |
| -------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `admin`  | Todo: CRUD users, settings, contenido, ver submissions                        | —                                                                  |
| `editor` | CRUD pages, globals, media, brands, events. Ver form submissions (no delete). | Crear/editar users. Cambiar site-settings críticos. Cambiar roles. |
| `viewer` | Read-only en admin (preview, debug)                                           | Cualquier mutación                                                 |

### Patrón de access function

Definir en `src/access/index.ts`:

```ts
// src/access/index.ts
import type { Access } from "payload";

type Role = "admin" | "editor" | "viewer";

const hasRole =
  (allowed: Role[]): Access =>
  ({ req: { user } }) =>
    Boolean(user && allowed.includes(user.role as Role));

export const isAdmin = hasRole(["admin"]);
export const isAdminOrEditor = hasRole(["admin", "editor"]);
export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user);
export const anyone: Access = () => true;

// Para read: published + auth puede ver drafts
export const publishedOrAuth: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: "published" } };
};

// Solo el dueño + admin
export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.id === id;
};
```

### Application por collection

```ts
// src/collections/Users.ts
import { isAdmin, isAdminOrSelf } from "@/access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    /* tokenExpiration etc */
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role", "updatedAt"],
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user), // cualquier user logueado entra al admin
    create: isAdmin, // solo admin crea usuarios
    read: isAdmin, // solo admin ve la lista
    update: isAdminOrSelf, // editors solo se editan a sí mismos
    delete: isAdmin,
  },
  fields: [
    /* email + password automáticos por auth: true */
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin (acceso total)", value: "admin" },
        { label: "Editor (CRUD contenido)", value: "editor" },
        { label: "Viewer (solo lectura)", value: "viewer" },
      ],
      access: { update: isAdmin }, // solo admin cambia roles
    },
  ],
};
```

### Por collection (resumen)

| Collection         | create                | read                   | update              | delete |
| ------------------ | --------------------- | ---------------------- | ------------------- | ------ |
| `users`            | admin                 | admin                  | adminOrSelf         | admin  |
| `pages`            | adminOrEditor         | publishedOrAuth        | adminOrEditor       | admin  |
| `media`            | adminOrEditor         | anyone (URLs públicas) | adminOrEditor       | admin  |
| `categories`       | adminOrEditor         | anyone                 | adminOrEditor       | admin  |
| `brands`           | admin                 | anyone                 | adminOrEditor       | admin  |
| `form-submissions` | anyone (POST público) | admin                  | admin (status only) | admin  |

### Por global

| Global                                                 | read          | update                 |
| ------------------------------------------------------ | ------------- | ---------------------- |
| `header-*`, `footer-*`, `floating-contact`, `hub-page` | anyone        | adminOrEditor          |
| `site-settings`                                        | adminOrEditor | admin (config crítica) |

## Auth — hardening

### Token expiration

Payload por defecto: 7 días. Bajar a 2h para admin productivo:

```ts
// src/collections/Users.ts
auth: {
  tokenExpiration: 60 * 60 * 2,        // 2 horas
  maxLoginAttempts: 5,                  // 5 intentos antes de lock
  lockTime: 60 * 60 * 1000,            // lock 1 hora
  cookies: {
    secure: process.env.NODE_ENV === "production", // HTTPS only en prod
    sameSite: "lax",                                // CSRF protection
    httpOnly: true,                                  // JS no accede al cookie
  },
  forgotPassword: {
    generateEmailHTML: ({ token, user }) => `<a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/reset?token=${token}">Reset</a>`,
  },
},
```

### Password policy

Payload no enforça por default. Validar en `beforeChange`:

```ts
hooks: {
  beforeChange: [
    ({ data, operation }) => {
      if (operation === "create" || data.password) {
        const pw = data.password as string
        if (pw && pw.length < 12) throw new Error("Password mínimo 12 caracteres")
        if (pw && !/[A-Z]/.test(pw)) throw new Error("Password requiere mayúscula")
        if (pw && !/[0-9]/.test(pw)) throw new Error("Password requiere número")
        if (pw && !/[^A-Za-z0-9]/.test(pw)) throw new Error("Password requiere símbolo")
      }
      return data
    },
  ],
}
```

### 2FA (opcional, recomendado prod)

Payload no tiene 2FA built-in. Opciones:

- **WebAuthn**: passkeys vía library externa (clave de hardware o Touch ID).
- **TOTP**: app authenticator (Google/Authy). Requiere libs custom.

**Decisión por defecto**: NO en MVP. Documentar como deuda técnica para v1.1.

## Formularios — protección anti-spam

El plugin `form-builder` expone un endpoint público `/api/form-submissions`. Sin protección, es spam-able.

### 1. Honeypot field

Añadir un campo invisible al form que humanos no llenan. Bots sí.

```tsx
// src/blocks/Contact/Component.tsx
<input
  type="text"
  name="website"
  tabIndex={-1}
  autoComplete="off"
  style={{ position: "absolute", left: "-9999px" }}
  aria-hidden="true"
/>
```

En el `beforeChange` de `form-submissions`:

```ts
hooks: {
  beforeChange: [
    ({ data }) => {
      const honeypot = data.submissionData?.find(f => f.field === "website")
      if (honeypot?.value) {
        // Bot — silently drop (no error visible para no leak detection)
        return null // o throw discreto
      }
      return data
    },
  ],
}
```

### 2. Rate limiting

Vercel WAF (en plan Pro+). Si Hobby, usar middleware con KV o Upstash:

```ts
// src/middleware.ts
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 req/min por IP
});

export async function middleware(request: Request) {
  if (request.url.includes("/api/form-submissions")) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/api/form-submissions", "/api/ai-recommend"] };
```

Requiere env vars `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`.

### 3. Verificación de email (opcional)

Mandar email de confirmación antes de aceptar el form. Útil si las submissions disparan workflows downstream (CRM, sales).

**Decisión por defecto**: NO en MVP. Form valid email + honeypot + rate limit es suficiente para un mediakit.

### 4. CAPTCHA

Cloudflare Turnstile (gratis, sin tracking). Solo si el spam persiste tras honeypot + rate limit.

## CSP — Content Security Policy

Headers de seguridad. Configurar en `next.config.ts`:

```ts
async headers() {
  const isDev = process.env.NODE_ENV !== "production"

  // CSP estricta. Nonces son inyectados por Next; permitir 'strict-dynamic'.
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${isDev ? "'unsafe-eval'" : ""} 'strict-dynamic' https://va.vercel-scripts.com https://vitals.vercel-insights.com`,
    "style-src 'self' 'unsafe-inline'", // tailwind genera inline styles via class
    "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.vercel-insights.com https://*.vercel-analytics.com",
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com", // YouTube embeds
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ")

  return [
    {
      source: "/((?!api/).*)", // todas las rutas excepto /api (Payload maneja sus headers)
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
      ],
    },
  ]
}
```

⚠️ La CSP rompe cosas. Probar en preview deploy primero. Si Framer Motion necesita `unsafe-eval`, agregarlo solo en dev.

## File uploads — validación

Payload valida `mimeTypes` declarados. Reforzar:

```ts
// src/collections/Media.ts
upload: {
  staticDir: "./media",
  mimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
  ],
  filesRequiredOnCreate: true,
},
hooks: {
  beforeChange: [
    ({ req, data }) => {
      const file = req.file
      if (!file) return data

      // Size limit 10MB
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Archivo excede 10MB")
      }

      // SVG: sanitizar contra XSS (los SVG pueden contener <script>)
      if (file.mimetype === "image/svg+xml") {
        const content = file.data.toString("utf-8")
        if (/<script|on\w+=/i.test(content)) {
          throw new Error("SVG contiene scripts no permitidos")
        }
      }

      return data
    },
  ],
}
```

## Secrets management

### Nunca exponer al cliente

- `PAYLOAD_SECRET` — solo server
- `DATABASE_URI` — solo server
- `RESEND_API_KEY` — solo server (usado en server action de Contact)
- `AI_GATEWAY_API_KEY` — solo server (usado en server action de AIRecommendation)
- `BLOB_READ_WRITE_TOKEN` — solo server (Vercel auto-inyecta)

Verificar: ningún `process.env.X` aparece en código bajo `src/components/` o cualquier `"use client"`. Solo en server actions, route handlers, payload config, o Server Components.

```bash
# Audit
grep -rn "process.env" src/ | grep -v "NEXT_PUBLIC_" | grep -E "(use client|components/)"
# Debe dar cero resultados
```

### Rotación

Documentar el procedimiento para rotar `PAYLOAD_SECRET`:

1. Generar nuevo secret: `openssl rand -hex 32`.
2. Setearlo como `PAYLOAD_SECRET_NEXT` en Vercel.
3. Redeploy → Payload usa el viejo todavía.
4. En el código: agregar `secret: process.env.PAYLOAD_SECRET_NEXT ?? process.env.PAYLOAD_SECRET`.
5. Redeploy → ahora usa el nuevo.
6. Forzar logout de todos los usuarios (admin invalidate all sessions — esto invalida tokens viejos).
7. Eliminar `PAYLOAD_SECRET_NEXT` y mover su valor a `PAYLOAD_SECRET`.

### Audit secrets en commits

Pre-commit hook (extender husky):

```bash
# .husky/pre-commit (agregar)
if git diff --cached | grep -E "(PAYLOAD_SECRET|DATABASE_URI|RESEND_API_KEY|BLOB_READ_WRITE_TOKEN)=[^$]" ; then
  echo "✗ Secret hardcoded detectado"
  exit 1
fi
```

## CORS

Payload por default acepta `cors: "*"`. Restringir:

```ts
// payload.config.ts
cors: [
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "http://localhost:3000",
  // Si hay dominio custom: "https://caracol.com.co"
],
csrf: [
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.PAYLOAD_PUBLIC_SERVER_URL,
].filter(Boolean) as string[],
```

## Audit dependencies

```bash
# Manual antes de cada release
npm audit --production
npm audit fix --production --force # cuidado con breaking

# CI automatizado
# .github/workflows/audit.yml
- run: npm audit --production --audit-level=high
```

Considerar `snyk` o `socket.dev` para deeper scanning.

## Error tracking — Sentry (opcional MVP)

Si se quiere visibilidad de runtime errors:

```bash
npm i @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Env vars:

```
SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=caracol
SENTRY_PROJECT=caracol-next-ditu
```

Sentry SDK is gated por `process.env.SENTRY_DSN` — sin var, no inicializa.

⚠️ Validar que Sentry no captura PII de formularios (configurar `beforeSend` para scrub).

## Maintenance mode kill-switch

Configurado en `site-settings.maintenanceMode` (ver doc 02). Implementación:

```tsx
// src/app/(frontend)/layout.tsx
import { getPayload } from "payload";
import config from "@payload-config";

export default async function FrontendLayout({ children }) {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: "site-settings" });

  if (settings.maintenanceMode?.enabled) {
    return (
      <html lang="es">
        <body>
          <div className="flex min-h-screen items-center justify-center p-8">
            <p className="text-center">{settings.maintenanceMode.message}</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

Cache: si el global cambia, revalidate todo:

```ts
// src/globals/SiteSettings.ts hooks
afterChange: [
  ({ doc, previousDoc }) => {
    revalidateTag("global:site-settings")
    if (doc.maintenanceMode?.enabled !== previousDoc?.maintenanceMode?.enabled) {
      // Maintenance mode toggle afecta todo el sitio
      revalidateTag("page:hub:home")
      revalidateTag("page:caracol-next:home")
      revalidateTag("page:ditu:home")
    }
  },
],
```

## OWASP Top 10 — checklist

| Riesgo                        | Mitigación                                                    | Doc    |
| ----------------------------- | ------------------------------------------------------------- | ------ |
| A01 Broken Access Control     | RBAC por collection + per-field `access`                      | 05     |
| A02 Cryptographic Failures    | Cookies httpOnly + secure + HSTS preload                      | 05     |
| A03 Injection                 | Payload usa parameterized queries (drizzle); React escapa XSS | —      |
| A04 Insecure Design           | Drafts/versioning + maintenance mode kill-switch              | 02, 05 |
| A05 Security Misconfiguration | CSP estricta + headers + audit `npm audit`                    | 05     |
| A06 Vulnerable Components     | `npm audit` semanal + Snyk                                    | 05     |
| A07 ID & Auth Failures        | tokenExpiration 2h + maxLoginAttempts 5 + lockTime 1h         | 05     |
| A08 Software/Data Integrity   | Payload migrations + commits firmados (opcional)              | 05     |
| A09 Logging & Monitoring      | Sentry + Vercel logs + (Pro) drains                           | 04, 05 |
| A10 SSRF                      | No fetch a URLs user-supplied (revisar AI block)              | 05     |

## Checklist de validación

- [ ] `/admin` login con admin@... requiere password fuerte.
- [ ] Crear user con rol `editor` desde admin → editor NO ve users list.
- [ ] Editor NO puede modificar `site-settings`.
- [ ] Form contact submit con honeypot relleno → silently dropped.
- [ ] Form contact submit 6 veces seguidas desde misma IP → 429 en la 6ta.
- [ ] Header `Strict-Transport-Security` presente en respuesta de `/`.
- [ ] Header `Content-Security-Policy` presente y rompe `<script>alert(1)</script>` injected via DevTools.
- [ ] Upload SVG con `<script>` → rechazado.
- [ ] Upload archivo 11MB → rechazado.
- [ ] `grep -r "process.env" src/components/ src/app/(frontend)` → cero matches no-PUBLIC.
- [ ] `npm audit --production --audit-level=high` → 0 vulnerabilities.
- [ ] Maintenance mode toggle en admin → frontend redirige inmediatamente (revalidate).

## Próximo paso

→ Lee `06-implementation-phases.md` para el orden de tareas con acceptance criteria.
