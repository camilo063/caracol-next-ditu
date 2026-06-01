# Auditoría fidelidad Ditu (/ditu) — 2026-05-31

Referencia: `fileKey = xorK9SgP6likPV59r58dYt`
Metodología: `get_design_context` por nodo → comparación literal campo a campo → edición directa en fuente → verificación `grep` en archivo (no screenshot estático, ya que `RevealSection` arranca con `opacity:0`).

Archivos editados:

- `src/components/marketing/ditu-audiencia.tsx`
- `src/components/marketing/ditu-footer.tsx`

---

## Sección 1 — Audiencia stats (nodo 512:5929 / Frame 14412)

### A-1 — `tracking-tight` en `<h2>` (Figma: sin letter-spacing)

|             | Valor                                                                   |
| ----------- | ----------------------------------------------------------------------- |
| **Figma**   | Sin `letter-spacing` (no se define tracking en el nodo)                 |
| **Antes**   | `className="... font-bold tracking-tight text-white ..."`               |
| **Después** | `className="... font-bold text-white ..."` (eliminado `tracking-tight`) |

**Verificación:** `grep 'tracking-tight' ditu-audiencia.tsx` → vacío. ✅

---

### A-2 — Watch time sticker label font-size (`lg:text-[18px]` → `lg:text-[20px]`)

|             | Valor                                                                                   |
| ----------- | --------------------------------------------------------------------------------------- |
| **Figma**   | `text-[20px] leading-[14px]` — mismo `text-[20px]` que todos los stickers de stat cards |
| **Antes**   | `lg:text-[18px]` (sticker del 60 MIN difería del resto)                                 |
| **Después** | `lg:text-[20px]` con `lineHeight: "14px"`                                               |

También: `px-3 py-1` → `px-[12px] py-[4px]` (explícito para alinear con el valor literal del Figma `px-[12px] py-[4px]`). En Tailwind estas son equivalentes (12px = 0.75rem = `px-3`), pero se usa el valor literal del Figma.

**Verificación:** `grep 'lg:text-\[20px\]' ditu-audiencia.tsx` → presente. ✅

---

### A-3 — `backdrop-blur-[25px]` ausente en el contenedor "60 MIN" (Figma 656:4863)

|             | Valor                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------ |
| **Figma**   | `backdrop-blur-[25px] rounded-[16px] px-[32px] py-[20px]` sobre el sub-contenedor "60 MIN" |
| **Antes**   | Sin `backdrop-blur` ni `rounded-[16px]` en ese div                                         |
| **Después** | `backdrop-blur-[25px] rounded-[16px] px-2 py-4 lg:px-[32px] lg:py-[20px]`                  |

**Verificación:** `grep 'backdrop-blur-\[25px\]' ditu-audiencia.tsx` → presente. ✅

---

### A-4 — Stat card background (`rgba(255,255,255,0.04)` no existe en Figma)

|             | Valor                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------- |
| **Figma**   | Sin `background-color` explícito — las cards sólo tienen `backdrop-blur-[30px]` + border |
| **Antes**   | `backgroundColor: "rgba(255,255,255,0.04)"`                                              |
| **Después** | Eliminado; `style` queda solo con `borderColor: CYAN`                                    |

**Verificación:** `grep 'rgba(255,255,255,0.04)' ditu-audiencia.tsx` → vacío. ✅

---

### A-5 — Device card background (`rgba(255,255,255,0.02)` no existe en Figma)

|             | Valor                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------- |
| **Figma**   | Sin `background-color` — las device cards sólo tienen `backdrop-blur-[7px]` + `border border-white` |
| **Antes**   | `style={{ backgroundColor: "rgba(255,255,255,0.02)", backdropFilter: "blur(7px)" }}`                |
| **Después** | `style={{ backdropFilter: "blur(7px)" }}` — eliminado `backgroundColor`                             |

**Verificación:** `grep 'rgba(255,255,255,0.02)' ditu-audiencia.tsx` → vacío. ✅

---

### A-6 — Bloque +1.7M: `items-end` → `items-start` + gap `lg:gap-[8px]`

|             | Valor                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------- |
| **Figma**   | `flex gap-[8px] items-start` — alineación top, gap de 8 px entre "+1.7m" y el bloque de texto |
| **Antes**   | `relative flex flex-wrap items-end gap-4 sm:gap-6`                                            |
| **Después** | `relative flex flex-wrap items-start gap-4 sm:gap-6 lg:gap-[8px]`                             |

**Verificación:** `grep 'items-start gap-4 sm:gap-6 lg:gap-\[8px\]' ditu-audiencia.tsx` → presente. ✅

---

### A-7 — Source dots: `size-[10px]` → `size-[13px]` (×2 instancias)

|             | Valor                                                                   |
| ----------- | ----------------------------------------------------------------------- |
| **Figma**   | `size-[13px]` (elipse bullet, dos ocurrencias: fuente AVS + fuente TGI) |
| **Antes**   | `h-[10px] w-[10px]`                                                     |
| **Después** | `h-[13px] w-[13px] shrink-0` (ambas instancias via `replace_all`)       |

**Verificación:** `grep 'h-\[13px\].*w-\[13px\]' ditu-audiencia.tsx` → 2 matches. ✅

---

## Sección 2 — Footer (nodo 541:7935)

### F-1 — Container `items-center` → `items-start` en desktop

|             | Valor                                                                                |
| ----------- | ------------------------------------------------------------------------------------ |
| **Figma**   | `flex items-start justify-between` — top-aligned                                     |
| **Antes**   | `sm:items-center` sin override en lg → en desktop el contenedor usaba `items-center` |
| **Después** | Agregado `lg:items-start` — en lg override correcto a `items-start`                  |

**Verificación:** `grep 'lg:items-start' ditu-footer.tsx` → presente. ✅

---

## Resumen

| ID  | Sección                        | Delta                                                    | Estado     |
| --- | ------------------------------ | -------------------------------------------------------- | ---------- |
| A-1 | Audiencia / h2                 | Eliminado `tracking-tight`                               | ✅ cerrado |
| A-2 | Audiencia / Watch time sticker | `lg:text-[18px]` → `lg:text-[20px]`                      | ✅ cerrado |
| A-3 | Audiencia / 60 MIN container   | Agregado `backdrop-blur-[25px] rounded-[16px]`           | ✅ cerrado |
| A-4 | Audiencia / Stat cards         | Eliminado `backgroundColor rgba 0.04`                    | ✅ cerrado |
| A-5 | Audiencia / Device cards       | Eliminado `backgroundColor rgba 0.02`                    | ✅ cerrado |
| A-6 | Audiencia / +1.7M block        | `items-end` → `items-start`, `sm:gap-6` → `lg:gap-[8px]` | ✅ cerrado |
| A-7 | Audiencia / Source dots (×2)   | `10px` → `13px`                                          | ✅ cerrado |
| F-1 | Footer / Container             | Agregado `lg:items-start`                                | ✅ cerrado |
