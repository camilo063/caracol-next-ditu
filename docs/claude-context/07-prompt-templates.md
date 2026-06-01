# 07 — Templates de prompts listos para Claude

> Estos son prompts pre-armados para tareas comunes del proyecto.
> Copia, ajusta los placeholders `<…>` y pásaselos a Claude.

## Estructura de un buen prompt en este proyecto

1. **Contexto cero**: asume que Claude ya leyó `CLAUDE.md` y los archivos
   en `docs/claude-context/`. No repitas el stack o las reglas — apunta
   al archivo si necesitas reforzar (`"per docs/claude-context/02"`).
2. **Figma node ID**: si la tarea es visual, **siempre** incluye el
   `nodeId` del Figma. Sin él, Claude va a interpretar.
3. **Archivos específicos**: cita los paths que va a tocar.
4. **Criterios de done**: di qué quiere ver al final (preview verde,
   type-check ok, etc.).
5. **Sin clarifying questions**: agrega `"no preguntes; ejecuta"` para
   que avance directo.

---

## Templates por tipo de tarea

### A. Implementar un bloque nuevo desde Figma

```
Implementa un nuevo bloque <BlockType> en el page builder de Payload
con base en el nodo Figma <NODE_ID>
(fileKey xorK9SgP6likPV59r58dYt).

Steps:
1. mcp__figma__get_design_context con ese nodeId.
2. Crea src/blocks/<Nombre>/{config.ts, Component.tsx}.
3. En config.ts define el schema editable (textos, imágenes, items, CTAs).
4. En Component.tsx implementa con fidelidad 1:1 — colores hex literales,
   font-size y line-height exactos. Convierte el Tailwind genérico que
   te devuelve el MCP a Tailwind v4 + fonts vía CSS vars.
5. Registra el bloque en:
   - src/blocks/index.ts
   - src/blocks/RenderBlocks.tsx (case del switch)
   - src/blocks/types.ts
6. Agrega un ejemplo a src/lib/demo-data.ts (caracolNextDemoLayout o
   donde corresponda).
7. npm run generate:types y npm run type-check.
8. Verifica en http://localhost:3000/caracol-next que se renderiza
   idéntico al Figma.

Documentación relevante:
- docs/claude-context/02-figma-workflow.md
- docs/claude-context/03-payload-cms.md (sección "Crear un bloque nuevo")
- docs/claude-context/04-design-system.md

No preguntes; ejecuta. Reporta archivos creados al final.
```

### B. Fix visual con base en bug + Figma

```
Bug: <descripción del bug, p.ej. "el sticker TU MARCA se sobrepone
con la primera línea del heading en mobile (375px)">.

Componente afectado: <src/components/marketing/ditu-hero.tsx>.
Figma node: <725:2507>.

1. mcp__figma__get_screenshot del nodo Figma a maxDimension 1600.
2. Carga http://localhost:3000/ditu en preview a 375x812 (mobile).
3. Identifica el delta visual exacto.
4. Aplica el fix con valores literales del Figma. Si el Figma no
   muestra mobile, criterio dev manteniendo jerarquía.
5. Verifica con preview_inspect que los estilos computados coinciden.

No preguntes; ejecuta. Reporta el diff al final.
```

### C. Conectar un global Payload con el frontend

```
Conecta el global <SLUG> (Payload) con <ruta del frontend>.

1. Verifica el schema en src/globals/<SLUG>.ts.
2. En el server component de la página, fetcha:
     import { getPayload } from "payload";
     import config from "@payload-config";
     const payload = await getPayload({ config });
     const data = await payload.findGlobal({ slug: "<SLUG>" });
3. Pasa los datos como props al componente cliente.
4. Mantén defaults inline en el componente cliente para los campos
   que pueden venir undefined.
5. Sincroniza src/lib/demo-data.ts con el shape de Payload.
6. npm run generate:types && npm run type-check.

Referencia: docs/claude-context/03-payload-cms.md.

No preguntes; ejecuta.
```

### D. Migrar el Home a Payload (Fase 4)

```
Tarea Fase 4: migrar el contenido hardcoded de src/app/(frontend)/page.tsx
a un global Payload SiteSettings.homeContent.

Steps:
1. Extiende src/globals/SiteSettings.ts con un group "homeContent":
     - eyebrow (text)
     - heading (richText o blocks con spans bold/extrabold)
     - contactLabel (text)
     - brands.caracolNext { title (text|image), description (textarea), ctaLabel, href }
     - brands.ditu { ... idem ... }
     - stats (array: icon select, numericValue, prefix, suffix, value
       fallback, label, accent, lgWidth)
     - copyright (text)
2. En src/app/(frontend)/page.tsx, fetcha el global y pasa los datos
   al <HubLanding> en vez del literal actual.
3. Genera la migración: npm run payload -- migrate:create populate-home.
4. Implementa seed inicial con los valores actuales como default.
5. npm run generate:types && npm run type-check.
6. Verifica en /admin que el global aparece editable y en / que
   renderiza desde Payload.

Referencia: docs/claude-context/03-payload-cms.md.

No preguntes; ejecuta. Reporta los archivos modificados.
```

### E. Migrar Caracol Next a Pages (Fase 4)

```
Tarea Fase 4: migrar /caracol-next de demo-data al collection Pages
de Payload.

Steps:
1. Verifica que src/collections/Pages.ts tenga slug + layout (array de
   blocks).
2. En src/app/(frontend)/caracol-next/page.tsx reemplaza:
     <RenderBlocks layout={caracolNextDemoLayout} />
   por:
     const payload = await getPayload({ config });
     const result = await payload.find({
       collection: "pages",
       where: { slug: { equals: "caracol-next" } },
       limit: 1,
       depth: 3,
     });
     const layout = result.docs[0]?.layout ?? [];
     <RenderBlocks layout={layout} />
3. Crea un seed script en scripts/seed-caracol-next.ts que use
   caracolNextDemoLayout para crear la Page si no existe.
4. Documenta el comando para correrlo (ej. tsx scripts/seed-*.ts).
5. npm run generate:types && npm run type-check.
6. Sin la Page seedeada → fallback graceful (404 o landing vacío con
   mensaje admin).

Referencia: docs/claude-context/03-payload-cms.md (templates al final).

No preguntes; ejecuta.
```

### F. Agregar parallax a una sección

```
Agrega efecto parallax al background de la sección <Sección>
(componente <ruta>).

1. Identifica el wrapper visual de la sección.
2. Si tiene un background con Image, envuélvelo con
   <ParallaxBackground speed={0.3}>.
3. Asegúrate que el contenido foreground esté en z-index superior.
4. Verifica que en mobile (< sm) el parallax esté off (el componente
   ya lo hace internamente).
5. Test scroll suave en preview.

Referencia: docs/claude-context/05-animations-effects.md.

No preguntes; ejecuta.
```

### G. Form-builder + Resend (Fase 5)

```
Configura el ContactBlock para usar @payloadcms/plugin-form-builder
+ Resend.

Steps:
1. Habilita formBuilderPlugin en src/payload.config.ts (plugins array).
   Config básica: collection slug "forms", redirect a /gracias.
2. En el admin crea un form "Contacto Caracol Next" con campos:
   nombre (text, required), email (email, required), empresa (text),
   mensaje (textarea, required), presupuesto (select).
3. En src/blocks/Contact/Component.tsx implementa ContactForm:
   - Reemplaza el formObj.fields stub por el populate real.
   - Usa react-hook-form + zod.
   - On submit: fetch POST a /api/form-submissions con form id + data.
   - Show success/error inline.
4. En la collection form-submissions, agrega hook afterChange que envíe
   email vía Resend:
     await resend.emails.send({ from: process.env.RESEND_FROM_EMAIL,
       to: "comercial@caracol.com.co", subject: "Nueva consulta", ... })
5. Agrega RESEND_API_KEY y RESEND_FROM_EMAIL a .env.example.
6. Documenta los pasos para producción en docs/cms-buildout/.

Referencia: docs/claude-context/03-payload-cms.md (template "Form de contacto").

No preguntes; ejecuta.
```

### H. Animación "se siente brusca, suavízala"

```
La animación de <componente> se siente brusca. Suavízala:

1. Cambia easing de "easeOut" a [0.16, 1, 0.3, 1] (cubic-bezier OutQuint).
2. Aumenta duración según el caso:
   - Counters: 2.4s
   - Reveals (fade+slide): 0.55s
   - Hovers: 0.2s
3. Si es Recharts y solo dispara al mount, agrega useInView + render
   condicional con key para forzar remount cuando entra al viewport.
4. Verifica que respeta useReducedMotion (degrade a sin animación).

Referencia: docs/claude-context/05-animations-effects.md.

No preguntes; ejecuta.
```

### I. Auditoría de un landing contra Figma

```
Audita la landing <ruta> contra el Figma <NODE_ID raíz>.

1. Saca screenshot del Figma a maxDimension 1600 y guárdalo en
   /tmp/audit-<landing>.png.
2. Carga http://localhost:3000<ruta> en preview a 1440x1024.
3. Saca screenshot del preview.
4. Lista TODAS las divergencias visibles entre ambos, agrupadas por
   sección. Para cada divergencia indica:
   - Sección (con nodeId Figma específico).
   - Qué dice el Figma.
   - Qué muestra el código.
   - Severidad (alta / media / baja).
5. Genera un .md en docs/audits/<fecha>-<landing>.md con la tabla.

No arregles nada en esta tarea — solo audita.
```

### J. QA performance / Lighthouse

```
Audita Lighthouse de las 3 páginas (/, /caracol-next, /ditu).

1. Build de producción: npm run build && npm start (puerto 3000).
2. Para cada ruta, corre lighthouse desde CLI (o usa los preview tools)
   y reporta:
   - Performance / Accessibility / Best Practices / SEO scores.
   - Core Web Vitals: LCP, INP, CLS, TBT, Speed Index.
3. Identifica los top 5 issues por página.
4. Para cada issue prioritario, sugiere fix concreto (lazy-load, font
   display, image sizes, etc.).
5. Genera reporte en docs/audits/<fecha>-lighthouse.md.

Targets:
- Performance >= 90 desktop, >= 80 mobile.
- LCP < 2.5s, INP < 200ms, CLS < 0.1.

No optimices todavía — solo reporta.
```

---

## Patrón meta — pidiendo a Claude que pase a la siguiente tarea

Cuando Claude termine una tarea del roadmap, dile literalmente:

```
Marca esa tarea como hecha en docs/claude-context/06-roadmap.md y
pasa a la siguiente de la lista pendiente alta prioridad. Usa el
template correspondiente en 07-prompt-templates.md.
```

Esto deja el roadmap como living document — fuente de verdad de
"qué falta".

---

## Patrón meta — debugging colaborativo

Cuando algo no funciona y necesitas que Claude investigue antes de
arreglar:

```
Investiga primero (sin tocar código):
- Qué dice el server (preview_logs error).
- Qué dice el client (preview_console_logs error).
- Cómo se ve la sección afectada (preview_inspect del selector específico).
- Cómo debería verse (mcp__figma__get_design_context del nodo).

Después de investigar, propone una hipótesis del problema y el fix
en un solo párrafo. Espera mi OK para ejecutar.
```
