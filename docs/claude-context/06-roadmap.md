# 06 — Roadmap, Hecho, Pendiente

> Actualización: 2026-05-31. Tras sesión de bugfix de 13 tareas.

## Fases

- ✅ **Fase 1** — Setup repo, Next + Payload + Tailwind v4 + shadcn.
- ✅ **Fase 2** — Layout root, fonts, theming, design tokens.
- ✅ **Fase 3** — Bloques visuales 1:1 Figma con datos demo.
- 🟡 **Fase 4** — Conexión 100% Payload ↔ Frontend.
- ⏳ **Fase 5** — APIs externas (form-builder + Resend), AI Block.
- ⏳ **Fase 6** — QA, performance, accesibilidad, deploy producción.

## Hecho recientemente (sesión bugfix mayo 2026)

### Home (`/`)

- [x] Layout centrado con `mx-auto max-w-[1377px]`.
- [x] Line-height del título responsive (no 80px fijo).
- [x] Wordmark Ditu sin deformación (inline SVG 92×32 con `currentColor`).
- [x] Counters animados con cubic-bezier OutQuint (2.4s).
- [x] Stagger entrance del hero (motion.main + variants).
- [x] Hover en CTAs ("Conoce X" y "Contáctenos") con shadow + scale.
- [x] Mobile: tarjetas de producto al 50% cada una (no más Next ocupando todo).

### Caracol Next (`/caracol-next`)

- [x] RevealSection más conservadora (`rootMargin -10%`).
- [x] Header scroll-up suave (thresholds 8/12px delta).
- [x] Hamburguesa blanca cuando bg navy.
- [x] Click-outside + ESC cierran menú mobile.
- [x] Hero: gap reducido eyebrow→título; label responsive.
- [x] BumBox y BluRadio pie chart: colores distintos por slice.
- [x] "Una marca para cada audiencia": removido bg/marco redondeado envolvente.
- [x] Calendario: radius 100px, cards sin ancho fijo en lg, mobile slider llega al borde.
- [x] Pauta Digital: format pills `rounded-[6px]`, chevron 16px thin.
- [x] Cierre/Contacto: hover button con bg darker + shadow.

### Ditu (`/ditu`)

- [x] Hero: botones `flex-row flex-wrap` centrados.
- [x] Cifras: flex en vez de grid (large card 40%, otras 28%).
- [x] ADN: pie y bar charts re-animan al entrar viewport (useInView + remount).
- [x] Canales: `min-height` para evitar saltos al cambiar tab.
- [x] Calendario: pato reubicado top-right (no sobre título).
- [x] Calendario: dots paginan de a 4 (3 dots para 12 events).
- [x] Footer mobile: `pb-24` para no tapar redes con FloatingContact.

### Global

- [x] `cursor-pointer` y hovers en todos los elementos clickeables clave.
- [x] FormatModal X redesigned (32×32 sin background circular).
- [x] FormatModal mobile tabs: `flex-wrap` (no scroll horizontal).
- [x] HomeContactModal X y FloatingContact con hover refinado.

## Pendiente — alta prioridad

### 1. Conexión Payload ↔ Frontend (Fase 4)

- [ ] **Home `/`**: hoy hardcoded en `page.tsx`. Migrar a global
      `SiteSettings.homeContent` (eyebrow, heading, brands.{next,ditu},
      stats, copyright).
- [ ] **Caracol Next `/caracol-next`**: hoy lee `caracolNextDemoLayout`.
      Cambiar a `payload.find({ collection: "pages", where: { slug:
    "caracol-next" } })`.
- [ ] **Ditu `/ditu`**: decidir con Camilo si es Page con bloques o
      composición de globals. Implementar la decisión.
- [ ] **Header / Footer / FloatingContact**: hoy usan demo. Cambiar a
      `payload.findGlobal({ slug: ... })` en `layout.tsx` o en cada
      page.
- [ ] **Seed inicial**: script (`scripts/seed.ts` o un `payload migrate`)
      que poblé Payload con el mismo contenido del Figma para arrancar
      QA.
- [ ] **Validar TypeScript**: `npm run generate:types` + `npm run type-check`
      después de cada conexión.

### 2. Bugs visuales Figma — segunda pasada

Que quedaron pendientes (no se pudieron verificar a profundidad sin más
contexto del Figma):

- [ ] Brand audience tab: imágenes deformadas en algunos brands
      (revisar aspect-ratio vs Image `width/height` específico por brand).
- [ ] DITU Cifras: línea divisoria dashed cyan y íconos de Watch Time
      coinciden con Figma node específico (validar 738:2713).
- [ ] DITU ADN: "piquitos" decorativos de entrada/salida (laterales) —
      identificar nodes Figma y replicar.
- [ ] DITU Pauta: el menú vertical no sigue correctamente la
      navegación al hacer scroll (validar IntersectionObserver).
- [ ] DITU Redes (mobile): elementos se superponen — revisar layout
      `dn1-dn6` en `DituAudienciaBlock`.

### 3. Animaciones + Parallax — segunda fase

- [ ] Parallax en sections internas (no solo hero):
  - Calendario Caracol Next: bg con scroll velocity ≠ 1.
  - Pauta Digital: shadow halos animados al scroll.
- [ ] Decoraciones flotantes en ADN Ditu ("piquitos" como SVGs animados).
- [ ] Hover micro-interacciones en stickers Ditu (skew/rotate sutil).
- [ ] Cursor custom estilo Caracol/Ditu (a definir con Camilo).
- [ ] Page transitions entre `/`, `/caracol-next`, `/ditu` (Framer Motion
      o ViewTransitions API).

## Pendiente — media prioridad

### 4. Form de contacto (Fase 5)

- [ ] Habilitar `@payloadcms/plugin-form-builder` en `payload.config.ts`.
- [ ] Crear forms desde admin: "Contacto Caracol Next", "Contacto Ditu".
- [ ] `ContactBlockComponent` con form dinámico (campos desde Payload).
- [ ] Submit handler que POSTea a `/api/form-submissions`.
- [ ] Hook afterChange que envía email vía Resend.
- [ ] Variables `RESEND_API_KEY` + `RESEND_FROM_EMAIL` en Vercel.

### 5. AI Block (Fase 5)

- [ ] Definir scope del block IA con Camilo (¿chatbot? ¿generación de
      copy? ¿recomendador?).
- [ ] Habilitar Vercel AI Gateway en `payload.config.ts` o directamente
      en la route handler.
- [ ] Usar AI SDK v6 con strings tipo `"provider/model"` (default
      Anthropic/Claude vía gateway).
- [ ] Implementar `AIRecommendationBlockComponent` con la lógica.

### 6. Accesibilidad

- [ ] Lighthouse Accessibility >= 95 en las 3 páginas.
- [ ] Validar contraste de cyan (#77EDED) sobre violeta oscuro (#12082D)
      en headings Ditu.
- [ ] `aria-label` en todos los IconButtons, social links, slider dots.
- [ ] Focus rings visibles (no `outline-none` sin reemplazo).
- [ ] Navegación por teclado en tabs + modales (ya parcialmente
      implementada con `role="tab"`).

### 7. Performance

- [ ] Lighthouse Performance >= 90 desktop, >= 80 mobile.
- [ ] Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1.
- [ ] Code-split de bloques pesados (Recharts, Embla).
- [ ] Compress + lazy-load de todas las imágenes Figma exportadas.
- [ ] Pre-render estático donde sea posible (Next 15 SSG).

### 8. SEO

- [ ] OpenGraph images por landing.
- [ ] `metadata` en cada page (title, description, OG, Twitter).
- [ ] `sitemap.xml` y `robots.txt`.
- [ ] Schema.org Organization JSON-LD.

## Pendiente — baja prioridad / nice-to-have

- [ ] Modo oscuro / claro toggle (probablemente NO se necesita; el
      Mediakit es brand-driven).
- [ ] Internacionalización (es-CO default; en/pt-BR si el cliente lo
      pide).
- [ ] Versionado de Pages en Payload (drafts + publishing workflow).
- [ ] Analytics (Vercel Analytics o GA4).
- [ ] CMS plugins adicionales: search, redirects, audit log.

## Decisiones técnicas pendientes con Camilo

1. **Ditu como Page o como globals**: ¿el cliente edita Ditu con un
   page builder (`layout: [...]` array de blocks) o con globals
   separados por bloque?
2. **Form-builder vs forms hardcoded**: ¿usar el plugin o implementar
   un form fijo por landing?
3. **AI Block scope**: ¿qué hace exactamente el AIRecommendationBlock?
4. **Hosting de assets pesados**: ¿videos Ditu via Vercel Blob, S3 o
   Mux?
5. **Cursor custom**: ¿queremos? ¿qué estilo?
6. **Page transitions**: ¿Framer Motion o ViewTransitions API?

## Estado de los puertos / dev server

- Dev server SIEMPRE en `http://localhost:3000`.
- `.claude/launch.json` tiene `autoPort: false`.
- Si 3000 está ocupado → `lsof -i :3000` y matar el PID antes de arrancar.
- Si hydration mismatch raro → `npm run devsafe` (limpia `.next` y rearranca).

## Cómo usar este roadmap para generar prompts

El patrón recomendado es: leer una sección, identificar un bloque
acotado de trabajo (2-3 items relacionados), y construir un prompt
que cite los archivos relevantes y los Figma nodes.

Ver [`07-prompt-templates.md`](07-prompt-templates.md) para los
templates listos para copiar/pegar.
