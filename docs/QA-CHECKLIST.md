# QA Checklist — pre go-live

Lista exhaustiva de tests manuales antes de marcar el sitio production-ready. Marcá cada item con `[x]` cuando pase. Cualquier `[ ]` pendiente bloquea el go-live hasta resolverse o documentar como deuda aceptada.

Ejecutar todo este checklist en **cada deploy a producción** la primera vez. Después: solo regression-test las áreas tocadas por el cambio.

## 0. Preflight

- [ ] `npm install` limpio, sin warnings críticos.
- [ ] `npm run type-check` exit 0.
- [ ] `npm run lint` exit 0.
- [ ] `npm run build` exit 0. Las 3 landings aparecen como `○ Static` en el output.
- [ ] `npm run seed` corre idempotente — segunda corrida muestra `↻ existente` para todos los assets/pages/admins.
- [ ] `/admin/create-first-user` solo aparece la primera vez; tras seed, login con `admin@caracoltv.com.co` funciona.

## 1. Admin / RBAC

### Como admin

- [ ] Login con `admin@caracoltv.com.co` + password temporal funciona.
- [ ] Después de cambiar el password en `/admin/account`, el login con el nuevo password funciona y con el viejo falla.
- [ ] En la sidebar del admin se ven todos los grupos: Contenido, Configuración, Páginas, Media, Usuarios.
- [ ] Crear un user con rol `editor` desde `Users > Crear Usuario`.
- [ ] Crear un user con rol `viewer` desde `Users > Crear Usuario`.
- [ ] Cambiar el rol de un user desde admin funciona; el campo `role` es editable.

### Como editor (logout admin → login editor)

- [ ] Ve grupos: Contenido, Configuración (parcial), Páginas, Media.
- [ ] **NO** ve la sección Users en la sidebar.
- [ ] Puede editar `hub-page`, `ditu-page`, `header-*`, `footer-*`, `floating-contact`.
- [ ] **NO** puede editar `site-settings` (botón save deshabilitado o error 403).
- [ ] Puede crear/editar/borrar (su rol lo permite) `pages`, `media`, `categories`, `brands`.
- [ ] **NO** puede borrar otro user (delete deshabilitado).
- [ ] Puede cambiar su propio password desde `/admin/account`.

### Como viewer (logout editor → login viewer)

- [ ] Ve los mismos grupos que editor, pero todos los botones Save están deshabilitados.
- [ ] Intentar editar cualquier campo → no se guarda (UI bloquea o falla silently).

### Policy de password (crear nuevo user)

- [ ] Password `abc` → rechazado (mínimo 12 chars).
- [ ] Password `unalongstring` → rechazado (falta mayúscula).
- [ ] Password `Unalongstring` → rechazado (falta número).
- [ ] Password `Unalongstring1` → rechazado (falta símbolo).
- [ ] Password `Unalongstring1!` → aceptado.

### Lockout

- [ ] 5 logins fallidos consecutivos con el mismo email → cuenta queda bloqueada 1h.
- [ ] Login con password correcto durante el lockout → falla con error apropiado.

## 2. Edits desde admin → reflected en frontend

Para cada edit, abrir la URL pública correspondiente en otra pestaña y refrescar (sin caché del navegador) tras guardar.

### Hub (`/`)

- [ ] Editar `hub-page.eyebrow` → texto cambia en la home en < 5s.
- [ ] Editar un segmento de `hub-page.headingSegments` → cambia el heading.
- [ ] Editar `hub-page.brands.caracolNext.descriptionParagraphs` → cambia la card.
- [ ] Editar un `hub-page.stats[].label` → cambia el número/label.
- [ ] Editar `site-settings.copyright` → cambia el footer del Hub.

### Caracol Next (`/caracol-next`)

- [ ] Editar el Hero del Page `caracol-next/home` (e.g. cambiar `heading`) → cambia.
- [ ] Editar el `header-caracol-next.navAnchors[]` (e.g. cambiar label) → cambia.
- [ ] Editar el `footer-caracol-next.tagline` → cambia.
- [ ] Editar un brand-tab dentro de `BrandTabs` block → cambia.

### Ditu (`/ditu`)

- [ ] Editar `ditu-page.hero.stickerText` → cambia el sticker.
- [ ] Editar `ditu-page.audiencia.totalFollowersHeadline` → cambia.
- [ ] Editar un `ditu-page.adn.nseCards[].value` → la barra se redibuja.
- [ ] Editar un `ditu-page.calendario.events[].title` → cambia.
- [ ] Editar `header-ditu.ctaButton.label` → cambia.
- [ ] Editar `footer-ditu.socialLinks[].url` → links cambian.

### Floating Contact (las 3 landings)

- [ ] Editar `floating-contact.representatives[0].name` → cambia el nombre en el modal de las 3 landings.
- [ ] Cambiar `floating-contact.position` a `bottom-left` → el botón se mueve.
- [ ] Toggle `floating-contact.enabled` a `false` → el botón desaparece.

### Media

- [ ] Subir una imagen PNG en `/admin/media` → aparece en la lista con su `alt`.
- [ ] Reemplazar el archivo de un media existente que esté usado por algún Page → la imagen pública se actualiza tras revalidate.
- [ ] Intentar subir SVG con `<script>` dentro → rechazado por el hook de validación.
- [ ] Intentar subir archivo de 12 MB → rechazado por límite 10 MB.

## 3. Maintenance mode

- [ ] Toggle `site-settings.maintenanceMode.enabled` → `true` desde admin.
- [ ] Visitar `/`, `/caracol-next`, `/ditu` → ven la página de mantenimiento (bg navy, "Volvemos pronto.", mensaje configurable).
- [ ] `/admin` sigue accesible (no bloqueado por maintenance).
- [ ] Toggle back a `false` → frontend vuelve a la nav normal en < 5s.

## 4. Forms

- [ ] Crear un Form en `/admin/Configuración/Forms` con campos: name (text required), email (email required), message (textarea).
- [ ] Asignar el Form a un Page que use el `Contact` block con `layout: form-reps`.
- [ ] Submit del form en la URL pública con datos válidos → success message.
- [ ] La submission aparece en `/admin/Configuración/Form Submissions`.
- [ ] Submit con email inválido (`foo`) → error de validación.
- [ ] DevTools → seleccionar el input `_hp` (off-screen) → rellenar `bot-test` → submit → drop silencioso (NO aparece submission en admin).
- [ ] Como editor: `/admin/Configuración/Form Submissions` NO accesible (solo admin lee submissions con PII).

## 5. Mobile / responsive

Probar en viewport 375px (iPhone SE), 768px (iPad), 1440px (desktop).

### /

- [ ] Mobile: hero arriba, product cards apiladas, metrics OCULTAS, CTAs apilados.
- [ ] Desktop: split 2-col, metrics 2x2 a la derecha.

### /caracol-next

- [ ] Mobile: nav hamburguesa funciona, blocks apilados, charts visibles.
- [ ] Desktop: nav horizontal, sticky.

### /ditu

- [ ] Mobile: hero stacked, sticker visible y rotado, botones apilados.
- [ ] Mobile: device cards en `Audiencia` apiladas. Network counters legibles.
- [ ] Desktop: secciones en grid, mascot visible en Hablamos.

### Floating Contact

- [ ] Botón visible en bottom-right en las 3 landings.
- [ ] Click → modal abre. Click overlay → cierra. ESC → cierra.
- [ ] Mobile: modal full-screen, links mailto: y wa.me/ funcionan.

## 6. Performance

- [ ] Lighthouse en prod sobre `/` (mobile + desktop). Capturar el reporte.
- [ ] Lighthouse sobre `/caracol-next`.
- [ ] Lighthouse sobre `/ditu`.
- [ ] Performance ≥ 90 en las 3 (ideal ≥ 95).
- [ ] Accessibility ≥ 95 en las 3.
- [ ] Best Practices ≥ 90 en las 3.
- [ ] SEO ≥ 95 en las 3.
- [ ] LCP < 2.5s mobile, < 1.5s desktop.
- [ ] CLS < 0.1.
- [ ] Vercel Speed Insights (después de 24h de tráfico) muestra metrics OK.

## 7. SEO

- [ ] `curl <prod>/sitemap.xml` → XML válido con las 3 URLs.
- [ ] `curl <prod>/robots.txt` → contiene `Disallow: /admin` + `Sitemap: ...`.
- [ ] Google Rich Results Test sobre `/` → Organization schema detectado y válido.
- [ ] Twitter Card Validator sobre `/` → preview correcto.
- [ ] Facebook Sharing Debugger sobre `/` → OG preview correcto.
- [ ] Cada page tiene `<title>` único y `<meta name="description">` distinto.

## 8. Security

- [ ] `curl -I <prod>/` muestra:
  - [ ] `strict-transport-security: max-age=63072000; includeSubDomains; preload`
  - [ ] `content-security-policy: default-src 'self'; ...`
  - [ ] `x-content-type-options: nosniff`
  - [ ] `x-frame-options: DENY`
  - [ ] `referrer-policy: strict-origin-when-cross-origin`
  - [ ] `permissions-policy: camera=(), microphone=(), ...`
- [ ] Intentar embed del sitio en un `<iframe>` externo → bloqueado por X-Frame-Options.
- [ ] DevTools console al cargar `/` → cero errores CSP violation.
- [ ] DevTools console al cargar `/caracol-next` → cero errores CSP violation.
- [ ] DevTools console al cargar `/ditu` → cero errores CSP violation.
- [ ] Inyectar `<script>alert(1)</script>` en un richtext del admin → al renderear en frontend, NO ejecuta (lexical sanitiza).
- [ ] `grep -rE "process\.env\.[A-Z_]+" src/` con filtro de archivos client/components → solo `NEXT_PUBLIC_*`.
- [ ] `npm audit --production --audit-level=high` → 0 vulnerabilities nuevas (las 29 upstream documentadas son aceptadas).

## 9. Caché / revalidate

- [ ] DevTools → Network → recargar `/` → response `cache-control` aparece.
- [ ] Editar un global desde admin → en otra pestaña, ir a la URL afectada → cambio visible en < 5s sin hard reload.
- [ ] Borrar un Page → URL retorna 404 en próximo request.
- [ ] Reemplazar un media → URL pública del archivo cambia tras revalidate.

## 10. Cleanup pre-handoff

- [ ] `grep -rE "console\.(log|debug)\b" src/` → 0 matches (excepto warns/errors intencionales).
- [ ] `grep -rE "TODO|FIXME|XXX" src/` → revisado, ninguno bloqueante.
- [ ] `grep -r "demo-data" src/` → 0 matches.
- [ ] `npm run build` final, output limpio sin warnings nuevos.
- [ ] Password admin temporal **rotado** (`/admin/account` → Change Password).
- [ ] `.env.production` en Vercel revisado: `PAYLOAD_SECRET`, `DATABASE_URI`, `NEXT_PUBLIC_SITE_URL`, `PAYLOAD_PUBLIC_SERVER_URL`, `BLOB_READ_WRITE_TOKEN` seteados.
- [ ] Custom domain configurado en Vercel y `cors`/`csrf` arrays del payload.config actualizados.

## 11. Handoff al cliente

- [ ] `docs/CLIENT-HANDOFF.md` revisado.
- [ ] Walkthrough con el editor del cliente: login + 3 ediciones de prueba (1 texto, 1 imagen, 1 evento de calendario).
- [ ] Credenciales del admin entregadas por canal seguro (1Password / Bitwarden, NO email plano).
- [ ] Acceso al repo GitHub revocado para personas que ya no participan.
- [ ] Acceso a Vercel/AWS revisado.

---

**Cuando todos los items estén ✓, marcar el deploy como ready para anunciar.**
