# `docs/claude-context/` — Índice

Documentación base para usar Claude en este proyecto. Pensada como
contexto persistente: cualquier nueva sesión de Claude debería empezar
leyendo `/CLAUDE.md` (raíz) y de ahí navegar a estos archivos según el
dominio de la tarea.

## Orden de lectura sugerido

1. **`/CLAUDE.md`** (raíz del repo) — Identidad, reglas innegociables,
   stack, comandos.
2. **`01-overview.md`** — Estructura detallada del proyecto, fases,
   scripts.
3. **`02-figma-workflow.md`** — Cómo usar el MCP Figma + reglas de
   fidelidad visual.
4. **`03-payload-cms.md`** — Arquitectura CMS, collections, globals,
   blocks, mapping.
5. **`04-design-system.md`** — Tokens, colores brand, tipografía,
   espaciado.
6. **`05-animations-effects.md`** — Animaciones, parallax, performance.
7. **`06-roadmap.md`** — Hecho / pendiente / decisiones abiertas.
8. **`07-prompt-templates.md`** — Templates listos para crear prompts
   nuevos.

## Cuándo consultar cada uno

| Necesito…                                         | Voy a…                     |
| ------------------------------------------------- | -------------------------- |
| Entender un módulo del repo                       | `01-overview.md`           |
| Implementar UI desde Figma                        | `02-figma-workflow.md`     |
| Conectar el frontend con Payload                  | `03-payload-cms.md`        |
| Saber qué color/font/spacing usar                 | `04-design-system.md`      |
| Agregar parallax / mejorar animación / Lighthouse | `05-animations-effects.md` |
| Saber qué falta hacer / priorizar                 | `06-roadmap.md`            |
| Generar un prompt nuevo rápido                    | `07-prompt-templates.md`   |

## Convenciones de mantenimiento

Estos `.md` son **living documents**. Cuando algo del proyecto cambia
significativamente:

- Cambios en stack/versiones → `CLAUDE.md` + `01-overview.md`.
- Nuevos nodos Figma importantes → `02-figma-workflow.md`.
- Cambios en schema Payload (collections / globals / blocks) →
  `03-payload-cms.md`.
- Nuevos colores brand o tokens → `04-design-system.md`.
- Nuevos componentes de animación o patterns → `05-animations-effects.md`.
- Cualquier tarea terminada o nueva → mover de "pendiente" a "hecho"
  en `06-roadmap.md`.
- Patterns repetidos de prompt → agregar a `07-prompt-templates.md`.

La regla: **si una próxima sesión de Claude necesita saberlo, vive
aquí.** Si solo importa a un dev por una hora, no contamines el
contexto.

## Cómo iniciar una nueva sesión de Claude

Mensaje inicial sugerido:

```
Lee CLAUDE.md y los archivos relevantes en docs/claude-context/.
Voy a trabajar en <tema>.
```

Claude leerá los `.md`, entenderá el proyecto, y estará listo para
ejecutar sin pedir clarifications básicas.

## Estado actual (snapshot 2026-05-31)

- ✅ Sesión de bugfix completada (13 tareas, ver `06-roadmap.md`).
- 🟡 Trabajando en Fase 4 (conexión Payload ↔ Frontend).
- 🎯 Próxima sesión: empezar por las tareas "alta prioridad" del
  `06-roadmap.md`, usando los templates B/C/D de
  `07-prompt-templates.md`.
