Vamos a construir el sitio en fases. NO saltes fases sin mi aprobación.

CONTEXTO: lee docs/auditoria-figma.md y los archivos del proyecto.

FASE 1 — Design System base (atoms):

- Componentes shadcn ya instalados, custómizalos con los tokens
- Crea componentes base que no estén en shadcn: Container, Section, etc.
- Storybook NO, demasiado overhead para MVP

FASE 2 — Collections de Payload:
Basado en el mapeo del Figma audit, define collections:

- Pages (con blocks)
- Posts (si hay blog)
- Media
- Categories (si aplica)
- Forms (Payload Form Builder plugin)
  Define los blocks reutilizables identificados en la auditoría.

FASE 3 — Blocks del CMS (uno por uno):
Por cada block identificado:

- Schema en Payload (campos editables)
- Componente React que lo renderiza
- Validar que el cliente puede editar todo lo necesario

FASE 4 — Páginas y routing:

- Página dinámica [slug] que renderiza blocks
- Home, About, etc. seedeadas en Payload
- Sitemap, robots.txt, metadata por página

FASE 5 — Integraciones:

- Resend para formulario de contacto
- Vercel Analytics
- SEO plugin de Payload configurado

REGLAS:

- Cada fase requiere mi OK antes de pasar a la siguiente
- Si encuentras ambigüedad, pregunta. No inventes.
- Commits atómicos por fase con mensaje claro
