# Prompt para sesión nueva de Claude Code

Copia y pega esto como **primer mensaje** en una sesión limpia de Claude Code. Adáptalo si necesitas algo distinto (deploy a producción, foco en un módulo específico, etc).

---

## Prompt (copiar desde aquí)

```
Soy Camilo, CEO de Nivelics y tech lead para el cliente Caracol. Trabajo en el repo
caracol-next-ditu (Next.js 15 + Payload 3 + Tailwind v4) ya con el frontend pixel-perfect
construido en una sesión anterior. Tu trabajo en esta sesión es construir el CMS Payload
completo: pasar TODA la data hardcoded a Payload, conectar las páginas para que lean del
CMS, y dejar el sitio listo para que el cliente edite cada texto/número/imagen sin tocar
código.

PRIMER PASO OBLIGATORIO — lee estos archivos en orden antes de hacer cualquier cosa:

  1. docs/cms-buildout/README.md         — visión, stack, decisiones, targets
  2. docs/cms-buildout/01-current-state.md — qué ya existe en el repo
  3. docs/cms-buildout/02-target-data-model.md — schema completo objetivo
  4. docs/cms-buildout/03-migration-and-seed.md — cómo migrar demo-data.ts → Payload
  5. docs/cms-buildout/04-cache-and-performance.md — ISR, revalidate, Core Web Vitals
  6. docs/cms-buildout/05-security-and-access.md — RBAC + hardening
  7. docs/cms-buildout/06-implementation-phases.md — fases ordenadas con acceptance criteria

Después de leerlos, NO empieces a codear inmediatamente. Primero:

  a) Confirma que entendiste la premisa única: "100% del sitio editable desde Payload, cero
     hardcoded." Si encuentras AMBIGÜEDAD en algún doc, pregúntame antes de implementar.

  b) Lista las decisiones por defecto del README (sección "Decisiones por defecto"). Si crees
     que alguna debería ser diferente para este cliente, sugiérelo con justificación.

  c) Propón el plan de fases que vas a ejecutar (basado en doc 06). Espera mi OK antes de
     arrancar la Fase 1.

REGLAS DURANTE LA EJECUCIÓN:

  1. Trabaja una fase a la vez. Al terminar cada fase: lint + typecheck + build local limpio
     + commit + push + dame un resumen para que valide antes de pasar a la siguiente.

  2. NO toques el frontend visual (componentes en src/components/, src/blocks/*/Component.tsx).
     Pixel-perfect ya está finalizado. Solo cambia la FUENTE DE DATOS — los componentes
     deben seguir recibiendo las mismas props con la misma forma.

  3. Cada cambio de schema (collection, global, block field) → regenerar payload-types.ts
     con `npm run generate:types` y commitear.

  4. Cero `any` implícito. Tipa todo. Si Payload genera tipos imprecisos, crea aliases en
     src/blocks/types.ts.

  5. Tests manuales obligatorios al final de cada fase: instrucción explícita de qué probar
     en /admin (crear/editar/borrar X, ver cambio reflejado en /, /caracol-next, /ditu).

  6. Acceptance criteria de cada fase está en el doc 06. No marcar una fase completa hasta
     que TODOS los criterios estén verdes.

CONTEXTO DE STACK:
  - Postgres en Neon (env var DATABASE_URI ya seteada en Vercel)
  - PAYLOAD_SECRET ya seteado
  - Build: `payload generate:importmap && next build` (Vercel + local)
  - Husky pre-commit con lint-staged (no skippeable)
  - Las páginas en src/app/(frontend)/ actualmente importan demo-data.ts — tu fase final es
    desconectar esto

Cuando estés listo, lee los 7 docs y responde con: (a) entendí la premisa, (b) decisiones
que cuestionas (si alguna), (c) plan de fases propuesto. NO ARRANQUES A CODEAR aún.
```

---

## Notas para el orquestador (Camilo)

- Antes de pegar el prompt: subí los 7 .md al repo y haz push. La sesión nueva va a clonarlo o
  trabajar contra el clone existente.
- Después de pegar el prompt y recibir respuesta del agente, validá las decisiones que
  cuestione antes de dar OK para Fase 1.
- Si la sesión nueva pierde contexto a mitad de fase, dale `/clear` y arranca con: "Sigamos
  con la fase N del doc 06-implementation-phases.md. Resumime dónde estás y los acceptance
  criteria pendientes."
- Para handoffs entre fases largas, considera ejecutar `npm run generate:types` y commitear
  payload-types.ts antes de cambiar de sesión — así la próxima parte de un schema verificable.
