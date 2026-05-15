Inicializa el proyecto Nivelics Agent First.

YA EJECUTÉ: npx create-payload-app@latest con template "website" y PostgreSQL.

TAREAS:

1. VERIFICAR Y AJUSTAR DEPENDENCIAS:
   - Confirma Next.js 15.x, React 19, TypeScript strict
   - Tailwind v4 configurado
   - Añade: lucide-react, react-hook-form, zod, @hookform/resolvers
   - Añade dev: prettier, prettier-plugin-tailwindcss, husky, lint-staged

2. CONFIGURAR TOKENS DE DISEÑO:
   Lee `docs/auditoria-figma.md`. Extrae tokens del Figma vía MCP y créalos en:
   - `src/styles/globals.css`: CSS variables en :root y .dark
   - Tailwind v4 usa @theme inline en CSS, no tailwind.config.ts
   - Tokens: colors, fonts, spacing, radius, shadows
   - Naming semántico: --color-primary, --color-foreground, no --color-blue-500

3. CONFIGURAR ESLINT + PRETTIER + HUSKY:
   - .prettierrc con plugin de Tailwind
   - Husky pre-commit: lint-staged corre prettier + eslint
   - Script "type-check": tsc --noEmit

4. ESTRUCTURA DE CARPETAS:
   Crea (si no existen): src/blocks, src/components/ui, src/components/marketing,
   src/lib, prompts, docs

5. INSTALAR SHADCN/UI:
   - npx shadcn@latest init (style: new-york, base color: el primary del Figma)
   - Instala primero solo: button, input, textarea, label, dialog

6. README.md:
   Documenta stack, comandos, estructura, variables de entorno requeridas.

NO toques aún:

- Collections de Payload (vendrán después según mapeo de Figma)
- Páginas frontend (vendrán después)
- Blocks de contenido (vendrán después)

Cuando termines, muéstrame:

- Lista de archivos creados/modificados
- Tokens extraídos del Figma
- Comandos disponibles en package.json
- Próximos pasos sugeridos
