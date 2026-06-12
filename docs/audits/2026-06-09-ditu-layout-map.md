# Mapa de Layout — Ditu (`/ditu`) — 2026-06-09

> Contrato visual antes de migrar a page-builder. Fuente: lectura directa de
> `src/app/(frontend)/ditu/page.tsx` + componentes.

---

## 1. Wrapper raíz (page.tsx)

```tsx
<div className="theme-ditu bg-background flex min-h-screen flex-col">
  <SiteHeader … />
  <main className="flex-1 pt-16">   ← pt-16 compensa el header fixed h-16
    {/* bloques 1-9 */}
  </main>
  <DituFooter />
  <FloatingContact … />
</div>
```

`pt-16` vive en `<main>`, NO en los bloques. Cualquier layout migrado a
`RenderBlocks` sigue dentro de este `<main>` y hereda el padding.

---

## 2. Orden exacto de los 9 bloques

| #   | Componente                       | RevealSection | Background / wrapper propio en page.tsx | Props pasadas desde page.tsx                                                                                        |
| --- | -------------------------------- | ------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | `<DituHero />`                   | ❌ No         | —                                       | Ninguna — defaults internos                                                                                         |
| 2   | `<DituVideoBlock />`             | ❌ No         | —                                       | Solo default (sin background prop, usa default del componente `"linear-gradient(90deg, #1E0E4C 0%, #3A1A92 100%)"`) |
| 3   | `<DituAudienciaBlock />`         | ❌ No         | —                                       | Ninguna — defaults internos                                                                                         |
| 4   | `<DituAdnBlock />`               | ✅ Sí         | —                                       | Ninguna — defaults internos                                                                                         |
| 5   | `<DituTipoContenidoBlock />`     | ✅ Sí         | —                                       | Ninguna — defaults internos                                                                                         |
| 6   | `<DituCanalesBlock />`           | ✅ Sí         | —                                       | Ninguna — defaults internos                                                                                         |
| 7   | `<DituCalendarioBlock />`        | ❌ No         | —                                       | Ninguna — defaults internos                                                                                         |
| 8   | `<DituVideoBlock background=…/>` | ❌ No         | —                                       | `background="linear-gradient(90deg, #6C27D8 0%, #6020DF 47%, #471BA7 68%, #371881 82%, #251557 99%)"`               |
| 9   | `<DituPautaBlock />`             | ❌ No         | —                                       | Ninguna — defaults internos                                                                                         |
| 10  | `<DituHablamosBlock />`          | ✅ Sí         | —                                       | Ninguna — defaults internos                                                                                         |

**Conclusión clave**: ningún bloque tiene wrapper extra ni background en page.tsx,
**excepto** el bloque 8 (VideoBlock 2.ª instancia) cuyo gradient se pasa como prop
`background`. Para los bloques piloto (1 y 2), no hay nada en page.tsx que
perdamos al moverlos a RenderBlocks.

---

## 3. Detalle de los bloques piloto

### Bloque 1 — DituHero

**Archivo**: `src/components/marketing/ditu-hero.tsx`

| Elemento visible                                         | Fuente actual                                                     | Editable vía CMS post-C1     |
| -------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------- |
| Sticker "TU MARCA"                                       | `DituHeroProps.stickerText` default `"TU MARCA"`                  | ✅ campo `stickerText`       |
| Heading (en todas las pantallas, / en todo momento cyan) | `headingFallback` JSX interno                                     | ❌ usa fallback (C2+)        |
| Descripción con spans cyan                               | `descriptionFallback` JSX interno                                 | ❌ usa fallback (C2+)        |
| Botones × 3 (Google Play / App Store / Portal web)       | `buttonsFallback` array interno                                   | ✅ campo `buttons[]`         |
| Iconos de botones (googleplay.svg, appstore.svg, tv.svg) | `ICON_PATHS` const, override `btn.iconUrl` (Sprint C1 const→prop) | ✅ vía `iconMedia` upload    |
| Background gradient (129.43deg #12082D → #3B1A93)        | `style={{ background: "..." }}` hardcoded en componente           | ❌ no prop (decorativo fijo) |
| `id="inicio"` de la sección                              | Hardcoded — const→prop a `anchorId ?? "inicio"`                   | ✅ campo `anchorId`          |

**Const→prop que aplica en Sprint C1**:

- `id="inicio"` → `id={anchorId ?? "inicio"}` (agregar prop `anchorId`)
- `btn.icon` → `btn.iconUrl ?? ICON_PATHS[btn.icon]` (agregar `iconUrl` a botones)

### Bloque 2 — DituVideoBlock (1ª instancia)

**Archivo**: `src/components/marketing/ditu-video-block.tsx`

| Elemento visible                        | Fuente actual                                                                                 | Editable vía CMS post-C1        |
| --------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------- |
| Imagen `/ditu/video-block.png`          | `DituVideoBlockProps.src` default `"/ditu/video-block.png"`                                   | ✅ campo `image` (upload Media) |
| Background gradient `#1E0E4C → #3A1A92` | `DituVideoBlockProps.background` default `"linear-gradient(90deg, #1E0E4C 0%, #3A1A92 100%)"` | ✅ campo `background` (text)    |
| `-mt-1` (overlap con bloque anterior)   | Hardcoded en `className` del `<section>`                                                      | ❌ decorativo fijo              |
| `anchorId`                              | Ya es prop (optional)                                                                         | ✅ campo `anchorId`             |

**Const→prop que aplica**: Ninguno — el componente ya es 100% props.

---

## 4. Juntura crítica (bloque 2 → bloque 3)

Bloque 2 (`ditu-video`, via RenderBlocks) termina con:

```html
<section class="relative -mt-1 overflow-hidden …" style="background: …">
  <motion.div …>…</motion.div>
</section>
```

El `-mt-1` es propio del componente (no de page.tsx).

Bloque 3 (`DituAudienciaBlock`, hardcoded) empieza con su propia sección.

- No hay wrapper extra de RenderBlocks entre bloque 2 y bloque 3 (ambos sin RevealSection).
- No hay padding/margin en page.tsx entre ellos.
- La juntura está determinada enteramente por los márgenes propios de cada componente.

**Riesgo**: Si RenderBlocks añade un `<div>` o `<RevealSection>` wrapper alrededor de
`ditu-video`, podría romper el `-mt-1` o introducir espacio. Para evitarlo, `ditu-hero`
y `ditu-video` se añaden a la lista de bloques sin RevealSection en `RenderBlocks.tsx`.

---

## 5. Assets en /public/ditu/ referenciados por bloques 1 y 2

| Asset             | Path                    | Bloque     | Uso                         |
| ----------------- | ----------------------- | ---------- | --------------------------- |
| `video-block.png` | `/ditu/video-block.png` | VideoBlock | Imagen principal del bloque |
| `googleplay.svg`  | `/ditu/googleplay.svg`  | Hero       | Ícono botón Google Play     |
| `appstore.svg`    | `/ditu/appstore.svg`    | Hero       | Ícono botón App Store       |
| `tv.svg`          | `/ditu/tv.svg`          | Hero       | Ícono botón Portal web      |

Todos deben estar en Media (seed idempotente por `alt`).

---

## 6. Bloques 3-9 — estado para fase híbrida

Se mantienen exactamente como están: instanciación directa en page.tsx sin
props de Payload. NO se tocan en Sprint C1.

| Bloque                 | RevealSection | Prioridad siguiente sprint |
| ---------------------- | ------------- | -------------------------- |
| DituAudienciaBlock     | ❌            | C2                         |
| DituAdnBlock           | ✅            | C2                         |
| DituTipoContenidoBlock | ✅            | C2                         |
| DituCanalesBlock       | ✅            | C2                         |
| DituCalendarioBlock    | ❌            | C2                         |
| DituVideoBlock (2ª)    | ❌            | C2                         |
| DituPautaBlock         | ❌            | C2                         |
| DituHablamosBlock      | ✅            | C2                         |
