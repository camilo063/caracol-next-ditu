# Auditoría de Fidelidad — /caracol-next vs Figma 347:1597

**Fecha:** 2026-05-31  
**Figma fileKey:** `xorK9SgP6likPV59r58dYt`  
**Rama:** `bugfixing`  
**Herramienta:** Claude Code + Figma MCP + Playwright computed-style inspection

---

## Nota crítica: caché de bundle Turbopack

Durante la auditoría se detectó que el dev server no está recompilando automáticamente algunos archivos de bloques (`BrandTabs/Component.tsx`, `KeyMomentsCalendar/Component.tsx`, `AdFormats/Component.tsx`). Los cambios están **correctos en el source** pero el bundle en `.next/static/chunks/app/(frontend)/caracol-next/page.js` tiene timestamp anterior a los edits.

**Acción requerida antes de verificar la página:**

```bash
npm run devsafe
```

Los fixes marcados como "✅ Aplicado" ya están en el source y se activarán después del devsafe.

---

## Resumen de deltas por bloque

| Bloque               | Nodo Figma | Deltas encontrados                                     | Estado fix                             |
| -------------------- | ---------- | ------------------------------------------------------ | -------------------------------------- |
| Hero                 | 347:2015   | 4 deltas (py, gap, brand-icon gap/padding)             | ✅ Verificado en browser               |
| AudienceNetworks     | 347:1600   | 2 deltas (format compact, inner sub-gap)               | ✅ Verificado en browser               |
| BrandTabs            | 402:5117   | 3 deltas (bluradio PNG, aspect-ratios, SVGs icon-only) | ✅ Source corregido (necesita devsafe) |
| KeyMomentsCalendar   | 401:913    | 1 delta (outer section py)                             | ✅ Source corregido (necesita devsafe) |
| BrandedContent       | 401:4267   | 1 delta (py-[160px] → py-[220px])                      | ✅ Aplicado                            |
| AdFormats            | 347:1706   | 1 delta (outer section py)                             | ✅ Source corregido (necesita devsafe) |
| Contact (cta-simple) | 634:4392   | Sin deltas                                             | ✓ OK                                   |

---

## 1. Hero (347:2015)

### Delta 1 — Section vertical padding

- **NodeId Figma:** 347:2015
- **Valor Figma:** `py-[94px]` (padding top + bottom = 94px cada lado)
- **Valor anterior:** `padding="xl"` → `py-32 md:py-40` (128px / 160px)
- **Fix:** `padding="none"` + `className="py-[40px] sm:py-[60px] md:py-[94px]"`
- **Verificación computed:** `heroPT: 94px` ✓ `heroPB: 94px` ✓

### Delta 2 — Outer flex gap (eyebrow → heading → brand icons)

- **NodeId Figma:** 347:2015 flex container
- **Valor Figma:** `gap-[10px]`
- **Valor anterior:** `gap-6 sm:gap-8 lg:gap-10` (hasta 40px en desktop)
- **Fix:** `gap-[10px]`
- **Verificación computed:** `outerFlexGap: 10px` ✓

### Delta 3 — BrandIconsRow gap entre iconos

- **NodeId Figma:** 347:2037
- **Valor Figma:** `gap-[16px]`
- **Valor anterior:** `gap-3` (12px) en StaggeredIcons, MarqueeIcons y fallback
- **Fix:** `gap-4` (16px) en los tres branches de BrandIconsRow
- **Verificación computed:** `brandIconsUl.gap: 16px` ✓

### Delta 4 — BrandIconsRow wrapper padding

- **NodeId Figma:** 347:2037 (`p-[16px]`)
- **Valor anterior:** sin padding en el wrapper
- **Fix:** Pasar `className="p-4"` al BrandIconsRow desde Hero
- **Verificación computed:** `brandIconsUl.pt/pb/pl/pr: 16px` ✓

### Headings verificados ✓ (sin deltas)

- span1 Regular 64px lh-72px ✓
- span2 Bold 64px lh-72px ✓
- Subheading Medium 32px lh-32px rgba(207,206,204,0.81) ✓
- Eyebrow Poppins Bold 20px #00ACFF uppercase ✓

---

## 2. AudienceNetworks (347:1600)

### Delta 1 — Stat card number format

- **NodeId Figma:** 347:1619 (`248M`), 347:1628 (`84.1M`)
- **Valor Figma:** `248M` / `84.1M` (compact, notación internacional, sin espacio)
- **Valor anterior:** `formatCompact(v)` con locale `"es-CO"` → `"248 M"` / `"84,1 M"`
- **Fix:** `formatCompact(v, "en-US")` en StatCard CountUp
- **Verificación:** Card values after animation = `["#1", "248M", "30.2%", "84.1M"]` ✓

### Delta 2 — Inner gap número → label de alcance

- **NodeId Figma:** 347:1604 (Container flex-col gap-[6px])
- **Valor Figma:** Sub-grupo `flex flex-col gap-[6px]` entre el número `16.943.700` y el label `Usuarios mensuales`
- **Valor anterior:** Todos los items en `flex flex-col gap-3` (12px), sin sub-grupo
- **Fix:** Wrap número + label en `<div className="flex flex-col items-start gap-[6px]">`, outer sigue con `gap-3` (12px)
- **Verificación computed:** `subGroupGap: 6px` ✓ `outerGap: 12px` ✓

### Heading y stat cards verificados ✓ (sin deltas adicionales)

- h2 64px Bold tracking-[-1px] #003381 ✓
- Número 64px ExtraBold #121212 ✓
- Label 32px Regular #464553 ✓
- StatCard p-20 rounded-[8px] gap-[8px] ✓
- Pill 14px Bold #00ACFF uppercase ✓
- Sub-label 18px Medium lh-22px #464553 ✓

---

## 3. BrandTabs (402:5117)

### Delta 1 — `bluradio-logo.svg` es un PNG binario

- **Causa:** El archivo `/public/caracol-next/brand-tabs/bluradio-logo.svg` (726KB) contiene bytes PNG, no XML SVG.
- **Valor anterior:** `BRAND_LOGO_PATHS.bluradio = "/caracol-next/brand-tabs/bluradio-logo.svg"` → renderizaba el PNG mal clasificado
- **Fix:** Eliminado `bluradio` de `BRAND_LOGO_PATHS`. El tab BluRadio usará el fallback de texto `displayName.toUpperCase()` en el right panel.
- **Estado:** ✅ Source corregido (requiere devsafe para activarse)

### Delta 2 — Aspect ratios hardcoded incorrectos para logos SVG

- **Causa:** Código usaba `[320, 180]` para todos los brands no-Volk, pero los SVGs tienen viewBoxes distintos:
  - `caracoltv-logo.svg`: viewBox 173.4 × 93.3 (actual 1.86:1)
  - `golcaracol-logo.svg`: viewBox 293.3 × 76.9 (actual 3.81:1 — muy diferente)
  - `caracolsports-logo.svg`: viewBox 151.6 × 80.0
  - `bumbox-logo.svg`: viewBox 42.6 × 41.9 (casi cuadrado)
- **Valor anterior:** `width={isVolk ? 180 : 320}` `height={isVolk ? 212 : 180}`
- **Fix:** `BRAND_LOGO_DIMS: Record<string, [number, number]>` con dimensiones reales por brand; `const [logoIntrinsicWidth, logoIntrinsicHeight] = BRAND_LOGO_DIMS[tab.brand] ?? [320, 180]`
- **Estado:** ✅ Source corregido (requiere devsafe para activarse)

### Delta 3 — SVGs de logos son icon-only, no wordmarks (ISSUE DE ASSETS)

- **Ningún SVG en `/public/caracol-next/brand-tabs/` contiene elementos `<text>`.** Son iconos/símbolos del brand, no wordmarks completos (e.g. "CARACOL TELEVISIÓN").
- **Figma 402:5117** muestra wordmarks completos centrados en el right panel.
- **Acción requerida:** Solicitar al diseño los SVGs con texto del wordmark para reemplazar los actuales.
- **Estado:** ⚠️ Pendiente de assets

### Heading, tabs y card content verificados ✓

- Eyebrow: Poppins Bold 20px #00ACFF uppercase ✓
- "Una marca para" Medium 64px lh-60px tracking-[-1px] #464553 ✓
- "cada audiencia" ExtraBold 64px lh-60px tracking-[-1px] #003381 ✓
- Tab pills: px-[48px] py-[12px] 16px SemiBold, active bg #015BC4 / inactive border #015BC4 ✓
- Card outer: rounded-[24px] border rgba(207,206,204,0.81) ✓
- Avatar top-right: 76×76 rounded-[16px] border-2 ✓

---

## 4. KeyMomentsCalendar (401:913)

### Delta 1 — Outer section padding extra

- **NodeId Figma:** 401:913 (el section navy NO tiene outer py en el Figma)
- **Valor Figma:** La sección calendar es el card navy directamente, sin wrapper con py extra
- **Valor anterior:** `<section ... className="py-6 sm:py-10">` → 40px extra top+bottom en desktop
- **Fix:** `<section id={anchorId ?? "momentos">` (sin py en el section)
- **Estado:** ✅ Source corregido (requiere devsafe)

### Inner layout verificado ✓ (sin deltas adicionales)

- Inner padding 120px ✓
- `borderBottomLeftRadius: "100px"` (100px intencional per user spec; Figma = 180px)
- Heading "Calendario": 64px Bold white lh-72px ✓
- Description: 24px Regular rgba(207,206,204,0.81) ✓
- gap heading→description: `gap-4` (16px) = Figma `gap-[16px]` ✓
- mt heading→cards: `lg:mt-16` (64px) = Figma `gap-[64px]` entre 521:7018 y grid ✓
- Cards grid: `lg:grid-cols-4 lg:gap-6` (24px) = Figma `gap-x-[24px] gap-y-[24px]` ✓
- Card: `rounded-[12px] gap-[18px] px-4 py-5` = Figma `rounded-[12px] gap-[18px] px-[16px] py-[20px]` ✓
- Badge: 12px Bold white uppercase rounded-[4px] ✓
- CTA button: w-[306px] h-12 bg #00ACFF SemiBold 18px ✓

---

## 5. BrandedContent (401:4267)

### Delta 1 — Section vertical padding

- **NodeId Figma:** 401:4267 (spec: `py-[220px]`)
- **Valor Figma:** `py-[220px]` (220px cada lado)
- **Valor anterior:** `lg:py-[160px]` (160px, 60px menos por lado)
- **Fix:** `lg:py-[220px]`
- **Estado:** ✅ Aplicado (hot-reloadable — en el client component)

### Layout verificado ✓

- `lg:px-[120px]` ✓
- 2 columnas (gap-64) left 568px + right 568px — responsive ✓
- Pill "BRANDED CONTENT" visible solo cuando tab ≠ primera ✓
- Heading split con "|": Medium line 1 + Bold line 2, 64px #003381 ✓
- Description: Medium 18px lh-24 #464553 ✓
- Tabs: px-[32px] py-[8px] SemiBold 14px, active bg #015BC4 / outline ✓
- Media preview: aspect 480/270 rounded-12 ✓

---

## 6. AdFormats (347:1706)

### Delta 1 — Outer section padding extra

- **Igual que Calendar:** `<section ... className="py-6 sm:py-10">` → 40px extra top+bottom
- **Fix:** `<section id={anchorId ?? "pauta"}>` (sin py)
- **Estado:** ✅ Source corregido (requiere devsafe)

### Inner layout verificado ✓

- `borderTopRightRadius: "100px"` (100px intencional per user spec; Figma = 180px)
- `lg:p-[120px]` inner padding ✓
- Heading: 64px Bold white lh-72px ✓
- Description: 24px Regular rgba(207,206,204,0.81) ✓
- gap heading→columns: `lg:gap-16` ✓
- Column header: 32px Medium tracking-[-1px] white ✓
- Divider: `h-px` bg rgba(207,206,204,0.81) ✓
- Format pill: `min-h-[68px] rounded-[6px]` (Figma: rounded-8 — intentionally reduced per code comment)
- CheckCircleIcon: 20px filled cyan ✓
- Chevron: 16px thin stroke ✓
- CTA: w-[306px] h-12 bg #00ACFF SemiBold 18px ✓

---

## 7. Contact / CtaSimpleLayout (634:4392)

### Sin deltas — Sección conforme al Figma ✓

- Section py: `lg:py-[94px]` = 94px cada lado ✓
- Heading line 1: Medium (fw:500) 64px #003381 ✓
- Heading line 2: Black (fw:900) 64px #003381 ✓
- Description: 24px lh-32px Regular #464553 ✓
- CTA button: 306×48px bg #015BC4 SemiBold 18px rounded-[4px] ✓

---

## Diagnóstico transversal: espaciado vertical entre secciones

### Causa confirmada

El problema de "demasiado espacio entre bloques" tiene **dos causas** diferenciadas:

1. **Outer section `py-*` en bloques con navbar interno:** `KeyMomentsCalendar` y `AdFormats` tenían un wrapper `<section className="py-6 sm:py-10">` (40px extra) alrededor del card con su propio `p-[120px]`. En el Figma, estos bloques son el card directamente sin wrapper exterior. Fix aplicado en ambos (requiere devsafe).

2. **Hero outer flex gap demasiado grande:** `gap-6 sm:gap-8 lg:gap-10` (hasta 40px) vs Figma `gap-[10px]`. Fix aplicado y verificado ✓.

3. **BrandedContent py insuficiente:** Offset parcial — el `py-[160px]` era 60px MENOS que Figma, compensando parcialmente el exceso de los otros bloques. Fix aplicado a `py-[220px]`.

### Acciones pendientes post-devsafe

Ejecutar `npm run devsafe` para limpiar el cache de Turbopack y recompilar todos los bloques. Después re-verificar computed styles de:

- `#momentos` → `sectionPT` debe ser `0px`
- `#pauta` → `sectionPT` debe ser `0px`
- BrandTabs → `cssAR` de logo debe ser `173 / 93` para CaracolTV
