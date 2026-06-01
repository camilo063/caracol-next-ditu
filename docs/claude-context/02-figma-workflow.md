# 02 — Figma Workflow + Reglas de Fidelidad

> **El Figma es la fuente de verdad. Está aprobado por el cliente.
> No interpretes — extrae valores literales.**

## fileKey y nodos clave

```
fileKey: xorK9SgP6likPV59r58dYt
```

| Vista                       | nodeId     |
| --------------------------- | ---------- |
| Home Caracol Medios         | `334:1559` |
| Home Caracol Next (landing) | `347:1597` |
| Home Ditu (landing)         | `548:3733` |
| Sistema de diseño completo  | `0:1`      |

> Las URLs Figma usan `node-id=334-1559` (con guión). En el MCP usar
> `334:1559` (con dos puntos) — la herramienta acepta ambos.

## Tools del MCP Figma — cuándo usar cada uno

### `mcp__figma__get_design_context` ⭐ default

Devuelve **código React + Tailwind** del nodo + screenshot + URLs de
assets (imágenes, SVGs). Es el modo principal de trabajo.

```ts
mcp__figma__get_design_context({
  fileKey: "xorK9SgP6likPV59r58dYt",
  nodeId: "334:1559",
  clientFrameworks: "react,nextjs",
  clientLanguages: "typescript,tsx,css",
});
```

El código devuelto está en Tailwind genérico — **conviértelo** al stack
del proyecto (Tailwind v4 con clases arbitrarias, tokens custom de
`@theme`, fonts vía CSS vars). Extrae los valores literales: colores
hex, `font-size`, `line-height`, `tracking`, padding, gap, radius.

**Nunca aproximes** — si Figma dice `font-size: 64px`, usa `text-[64px]`
o `style={{ fontSize: 64 }}`, no `text-6xl`.

### `mcp__figma__get_screenshot`

Para verificación visual o cuando solo necesitas la imagen (no el
código).

```ts
mcp__figma__get_screenshot({
  fileKey: "xorK9SgP6likPV59r58dYt",
  nodeId: "334:1559",
  maxDimension: 1600, // sube hasta 3000 para detalle fino
});
```

Devuelve una URL corta. Descarga con `curl` para inspeccionar local.

### `mcp__figma__get_metadata`

XML overview con todos los nodos hijos + posiciones + tamaños.
Útil para mapear la estructura sin traer todo el código. Cuando
`get_design_context` es demasiado pesado para el contexto.

### `mcp__figma__get_variable_defs`

Devuelve los **variables/tokens** vinculados a un nodo. Ej:
`{'CaracolTV/Primario/Azul Oscuro': '#003381'}`. Útil cuando quieres
verificar que estás usando el token correcto del design system y no
un color hardcoded suelto.

### `mcp__figma__get_context_for_code_connect`

Devuelve metadata estructurada de un componente Figma (variants, props,
descendant tree). Solo si vas a mappear ese componente a un componente
de código vía Code Connect.

## Workflow por escenario

### A. Implementar un bloque/sección nuevo

1. `get_design_context(nodeId)` → obtienes código + screenshot.
2. Lee el JSON con los tokens devueltos por la tool — esos son los
   colores aprobados.
3. Mapea estructura → componente del proyecto:
   - Si es un **block del Page Builder** → `src/blocks/<NombreBlock>/`
   - Si es un **componente de marketing** → `src/components/marketing/`
   - Si es un **UI primitive** → `src/components/ui/` (idealmente shadcn)
4. Convierte Tailwind genérico a Tailwind v4 con clases arbitrarias.
   Usa fonts vía CSS var (`var(--font-montserrat)`).
5. Para imágenes: descarga del Figma con `curl`, guarda en
   `public/<landing>/<bloque>/<asset>.{svg,png}`.
6. Antes de cerrar, valida con preview que el visual coincide.

### B. Fix de bug visual

1. Comparar lado a lado: screenshot Figma + screenshot del frontend.
2. `get_design_context(nodeId)` del bloque afectado.
3. Identificar el delta: ¿font-size? ¿color hex? ¿gap? ¿line-height?
4. Aplicar el valor literal del Figma.
5. Verificar con `preview_inspect` que las propiedades computadas
   coinciden (mejor que comparar screenshots por color).

### C. Decidir si un cambio del Figma justifica refactor

Si el Figma actualizado cambia estructura del componente (no solo
estilos), prioriza:

1. Mantener compatibilidad con datos de Payload (no romper schema).
2. Si rompe schema → escribir migración Payload primero.
3. Después refactorizar el componente.

## Reglas de fidelidad

| Atributo Figma     | Cómo se traduce en código                                                  |
| ------------------ | -------------------------------------------------------------------------- |
| Color hex          | `style={{ color: "#003381" }}` o `text-[#003381]` (siempre el hex literal) |
| Font size          | `text-[64px]` (px exactos)                                                 |
| Line height        | `leading-[72px]` o `style={{ lineHeight: "72px" }}`                        |
| Letter spacing     | `tracking-[-2.96px]` o `style={{ letterSpacing: "-2.96px" }}`              |
| Padding asimétrico | `pt-[40px] pr-[10px] pb-[30px] pl-[20px]` (no abreviar a `p-[X]`)          |
| Border radius      | `rounded-[8px]` (no `rounded-md` salvo que el valor token coincida)        |
| Gap                | `gap-[24px]`                                                               |
| Width fijo Figma   | `w-[306px]` (px exacto)                                                    |
| Width fluido       | `max-w-[1377px] mx-auto` (centrar siempre el container del Figma)          |

### Responsive

El Figma viene principalmente a 1440px (desktop). Para mobile/tablet:

- **Mobile (< 640px)**: usar valores reducidos proporcionalmente, NO
  el valor exacto del Figma. Ej. heading 96px desktop → 44–48px mobile.
- **Tablet (640–1024px)**: rangos intermedios.
- **Desktop (>= 1024px / `lg:`)**: valores exactos del Figma.

Mobile NO tiene Figma propio. Camilo confirma que las decisiones
mobile son criterio dev, **siempre que se mantenga la jerarquía
visual** (orden de elementos, prominencia relativa).

### Fonts

| Font         | Uso                                     | CSS var                    |
| ------------ | --------------------------------------- | -------------------------- |
| Montserrat   | Headings + body en Caracol Next + Home  | `var(--font-montserrat)`   |
| Poppins      | Eyebrows en Caracol Next y Home         | `var(--font-poppins)`      |
| Spline Sans  | UI Ditu (botones, body)                 | `var(--font-spline-sans)`  |
| Ditu Display | Headings Ditu (heading hero, secciones) | `var(--font-ditu-display)` |

Aplicar via:

```tsx
style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}
```

O via Tailwind v4 token: `font-display` (alias configurado a la font del
contexto — Ditu Display en Ditu, Montserrat en Caracol Next).

### Colores

Toda la paleta vive en [`04-design-system.md`](04-design-system.md).
Reglas:

- Usar el hex exacto del Figma.
- Si el Figma referencia un token (`CaracolTV/Primario/Azul Oscuro`),
  documentarlo en código como comentario:
  ```tsx
  color: "#003381"; // CaracolTV/Primario/Azul Oscuro
  ```

## Trampas conocidas

### 1. Inline SVG vs `<img>`

Si necesitas que un SVG **herede `currentColor`** (para pintar con
`text-white`/`text-black`), debes **inlinearlo** como JSX `<svg>`. Un
`<img src="*.svg">` no hereda CSS color. Ya pasó con el wordmark Ditu
del Home (logo se veía oscuro sobre fondo morado por usar `<img>`).

### 2. preserveAspectRatio

Cuando el Figma exporta `preserveAspectRatio="none"`, el SVG se
deforma al cambiar el tamaño del contenedor. Reemplázalo por
`xMidYMid meet` para mantener proporciones.

### 3. Composites multi-asset

A veces un "logo" del Figma son 2-3 SVGs apilados con `position: absolute`
en porcentajes. Replicarlos así rompe en otros tamaños. Mejor:

- Descargar el composite ya combinado del Figma, o
- Re-construir como single SVG con paths absolutos en un viewBox propio.

### 4. Estados del Figma (Default / Hover / Active)

Los nodos `Default` muestran solo el estado base. Para hover/active hay
variants separados. Si el Figma no los tiene, define hover sutil:

- Botones primarios: bg darker 10%, shadow brand-colored, scale 0.98 active.
- Cards: scale-[1.01], shadow-lg.
- Tabs: opacity-90 hover.
- Links nav: subrayado o color accent.

### 5. Border radius asimétrico

Patrón frecuente: navy section con `border-bottom-left-radius: 180px`
(curva grande) y resto 0. Si el cliente lo siente exagerado, reducir a
~100px (ya pasó en Calendario y Pauta).

## Templates para prompts derivados

### Implementar nueva sección Figma → código

```
Implementa la sección con nodeId <NODE_ID> del Figma
(fileKey xorK9SgP6likPV59r58dYt) como un nuevo bloque de Payload.

Pasos:
1. Llama mcp__figma__get_design_context con ese nodeId.
2. Crea src/blocks/<Nombre>/{Component.tsx, config.ts}.
3. Define el schema Payload en config.ts (todos los textos/imágenes/CTAs
   editables).
4. En Component.tsx implementa con fidelidad 1:1 al Figma:
   colores hex literales, font-size y line-height exactos, padding/gap
   con clases arbitrarias.
5. Mobile responsive: criterio dev manteniendo jerarquía.
6. Registra el bloque en src/blocks/index.ts y src/blocks/RenderBlocks.tsx.
7. Agrega ejemplo a src/lib/demo-data.ts para testear sin admin.
8. Verifica con preview en localhost:3000 que coincide con el Figma.

No preguntes; ejecuta y reporta al final.
```

### Fix visual de un bloque existente

```
El bloque <BlockName> en <ruta> está divergiendo del Figma node <NODE_ID>.

1. Saca screenshot del Figma con get_screenshot.
2. Saca screenshot del frontend en localhost:3000.
3. Identifica todas las diferencias visibles.
4. Arregla con los valores literales del Figma (no aproximes).
5. Verifica con preview_inspect que los estilos computados coinciden.
```
