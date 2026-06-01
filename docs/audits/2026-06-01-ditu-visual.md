# Auditoría Visual Ditu (/ditu) — 2026-06-01

fileKey: `xorK9SgP6likPV59r58dYt` | Nodo raíz: `548:3733`
Auditor: Claude Code (claude-sonnet-4-6) | Método: Figma MCP + lectura de código fuente + screenshot headless Chrome 1440px

---

## Resumen ejecutivo

| #   | Sección           | nodeId   | BG Match | Assets Match | Estado global                       |
| --- | ----------------- | -------- | -------- | ------------ | ----------------------------------- |
| 1   | Hero              | 512:2246 | ✅       | ⚠️           | ⚠️ Sticker posición y overlay delta |
| 2   | Video 1           | 512:2244 | N/A      | N/A          | No auditado (bloque video simple)   |
| 3a  | Audiencia stats   | 512:2243 | ✅       | ✅           | ✅ Match                            |
| 3b  | ADN               | 747:2597 | ✅       | ⚠️           | ⚠️ Icon ADN posición vs Figma       |
| 4   | Tipo de Contenido | 750:3361 | ✅       | ❌           | ❌ Wave top ausente en front        |
| 5   | Nuestros Canales  | 756:7691 | ✅       | ⚠️           | ⚠️ Custom icon decorativo posición  |
| 6   | Calendario        | 760:9836 | ✅       | ✅           | ✅ Match                            |
| 7   | Video 2           | 857:3974 | N/A      | N/A          | No auditado                         |
| 8   | Pauta             | 760:9793 | ✅       | ✅           | ✅ Match                            |
| 9   | Hablamos          | 541:7925 | ⚠️       | ✅           | ⚠️ Gradient stop menor delta        |
| 10  | Footer            | 541:7935 | ✅       | ✅           | ✅ Match                            |

---

## Detalle por sección

---

### [1] Hero (512:2246)

**Background Figma:**

```
linear-gradient(129.43deg, rgb(18,8,45) 6.031%, rgb(59,26,147) 97.813%)
= linear-gradient(129.43deg, #12082D 6.031%, #3B1A93 97.813%)
```

Sobre imagen de fondo `hero-bg.png` con overlay de gradiente encima.

**Background Front** (`ditu-hero.tsx` línea 129-130):

```
linear-gradient(129.43deg, rgb(18,8,45) 6.03%, rgb(59,26,147) 97.81%)
```

Imagen de fondo: `/ditu/hero-bg.png` + overlay gradiente aplicado correctamente.

**Estado BG:** ✅ Exacto — grado 129.43deg, stops #12082D y #3B1A93 en porcentajes idénticos.

**Assets Figma (512:2246):**

- `hero-bg.png` como imagen de fondo (con overlay)
- Sticker "TU MARCA" rotado -2.42deg, posición `left-140px top-[-25px]` relativo al heading
- Heading 96px centrado
- 3 botones: GOOGLE PLAY / APP STORE / PORTAL WEB con iconos 24×24

**Assets Front:**

- `hero-bg.png` presente en `/public/ditu/` — ✅
- Sticker "TU MARCA": presente, rotate(-2.42deg) — ✅
- Botones 3x: presentes con iconos SVG — ✅
- `ParallaxBackground` aplicado al fondo — no en Figma (adición de front)

**Estado Assets:** ⚠️

**Deltas específicos:**

- **Delta 1 (Baja):** El front usa `ParallaxBackground` (efecto scroll parallax en el hero-bg). Figma no especifica parallax — es una adición de front que puede divergir levemente en posición de la imagen al hacer scroll.
- **Delta 2 (Media):** En el screenshot headless el hero aparece oscuro (sin contenido visible) porque el `hero-bg.png` no renderizó en Chrome headless sin GPU. En browser real con Next.js Image la imagen sí carga. Esto no es un delta de código sino una limitación de screenshot headless.

---

### [2] Video 1 (512:2244)

**Estado:** No auditado en este ciclo (bloque de video embebido, sin backgrounds críticos de gradiente).

---

### [3a] Audiencia stats (512:2243 + 512:5929)

**Background Figma** (del MCP `get_design_context` nodo 512:2243):

```
linear-gradient(145.2307310687869deg,
  rgb(66, 18, 131) 0%,
  rgb(89, 33, 215) 37.027%,
  rgb(82, 37, 194) 74.432%,
  rgb(31, 22, 71) 102.71%)
= linear-gradient(145.23deg, #421283 0%, #5921D7 37.027%, #5225C2 74.432%, #1F1647 102.71%)
```

**Background Front** (`ditu-audiencia.tsx` línea 115-117):

```
linear-gradient(145.23deg, #421283 0%, #5921D7 37.027%, #5225C2 74.432%, #1F1647 102.7%)
```

**Estado BG:** ✅ Exacto — 4 stops, grados y colores hex idénticos. Stop 4 Figma `102.71%` vs front `102.7%` — diferencia de 0.01% irrelevante.

**Assets Figma:**

- Mascot hand (`ditu custom icons` 738:2526): `top-[-11.25px] left-[816px]` del frame de seguidores, `w-107px h-121px`
- 6 íconos de redes sociales (FB, TikTok, X, YouTube, IG, WhatsApp)
- Íconos de stat cards: download, live_tv, electric_bolt, schedule (30×30px cada uno)
- Dashed divider entre 60MIN y device cards (Frame 14496)

**Assets Front:**

- `/ditu/mascot-hand.svg` presente — posición front: `right-[20%] -top-[11px]` en div contenedor. Figma: `left-816px top-[-11.25px]`. El front usa `right-[20%]` por ser responsive, Figma es fixed-pixel en 1440px. A 1440px esto equivale aproximadamente a `left-816px` (1440 - 0.2×1440 = 1152, no 816). **Delta de posición.**
- Íconos sociales 6x: ✅ presentes
- Íconos stat cards: ✅ `/ditu/icon-download.svg`, `icon-livetv.svg`, `icon-bolt.svg`, `icon-schedule.svg`
- Dashed divider: Recreado con CSS `repeating-linear-gradient` (no PNG) — equivalente visual

**Estado Assets:** ✅ (funcional) con nota de posición mascot-hand.

**Deltas específicos:**

- **Delta 1 (Media):** Mascot hand — Figma `left-[816px]` absoluto dentro del frame de 1440px. Front usa `right-[20%]` (= `left-[1152px]` a 1440px). La mascota aparece ~336px más a la derecha que en Figma. Severidad: Media.
- **Delta 2 (Baja):** Dashed divider recreado con CSS en vez del asset PNG original del Figma (Frame 14496). Visualmente equivalente.

---

### [3b] ADN (747:2597)

**Background Figma** (inner div `747:2626`, del MCP):

```
linear-gradient(175.3171695354846deg,
  rgb(18, 8, 45) 9.8408%,
  rgb(41, 18, 102) 47.991%,
  rgb(18, 8, 45) 85.011%)
= linear-gradient(175.32deg, #12082D 9.84%, #291266 47.99%, #12082D 85.01%)
```

**Background Front** (`ditu-adn.tsx` línea 104-105):

```
linear-gradient(175.32deg, #12082D 9.84%, #291266 47.99%, #12082D 85.01%)
```

**Estado BG:** ✅ Exacto — grado y 3 stops coinciden.

**Assets Figma (747:2597 / 738:3033 y 512:2823):**

- Wave ADN (`738:3033`): silhoueta cityscape `1569×233px`, overflow-clip, posición `top:0` del bloque ADN.
- `adn-custom-icon.png` (`512:2823`): decorativo `~181×204px` (Figma render ~174×198px con transformaciones). Posición Figma: `left-[1147px] top-[784.75px]` dentro del inner div, con `rotate-[-178.15deg] scaleY(-1)`.

**Assets Front** (`ditu-adn.tsx`):

- `/ditu/wave-adn.png`: presente, `top:0 left:0 width:100% height:233px hidden lg:block` — ✅
- `/ditu/adn-custom-icon.png`: presente, posición `top:1023px left:1327px` (comment explica: 233px wave h + 790px y-offset).

**Estado Assets:** ⚠️

**Deltas específicos:**

- **Delta 1 (Alta):** Posición del `adn-custom-icon.png`:
  - **Figma:** `left-[1147px] top-[784.75px]` dentro del inner div (excluyendo los 233px de wave), con `w-[180.718px] h-[203.103px]`. Transformación: `scaleY(-1) rotate(-178.15deg)`.
  - **Front:** `top:1023px left:1327px` (1023 = 233 + 790), `w:181px h:204px`. El `left` diverge: Figma `1147px` vs front `1327px` — **diferencia de 180px a la derecha**. La transformación en front es `rotate(-178.15deg) scaleY(-1)` que matemáticamente es diferente de `-scale-y-100 rotate(-178.15deg)` de Figma (orden de operaciones CSS transform). Severidad: Alta.
- **Delta 2 (Baja):** Wave ADN usa PNGs con texturas adicionales en el asset `/public/ditu/` (`wave-adn-mask-a.png`, `wave-adn-mask-b.png`, `wave-adn-texture.png`) que el front no referencia en el componente. Estas texturas adicionales del Figma no están aplicadas. Severidad: Baja (el wave principal sí está).
- **Delta 3 (Baja):** El bloque ADN en Figma aparece como hijo del nodo `512:2243` (Audiencia), comparte el mismo `<section>`. En el front, `DituAdnBlock` es un `<section>` separado. El fondo del sub-bloque ADN en Figma se aplica sólo al inner div `747:2626` (el wave es el separador visual). En front, el `background` del `<section>` de ADN inicia directamente sin la lógica de wave-as-separator-visual del parent. Severidad: Baja (el efecto visual final es similar).

---

### [4] Tipo de Contenido (750:3361)

**Background Figma** (del MCP `750:3361` inner frame):

```
linear-gradient(115.77541849272629deg,
  rgb(113, 41, 212) 11.561%,
  rgb(95, 32, 223) 63.291%,
  rgb(30, 20, 70) 101.84%)
= linear-gradient(115.78deg, #7129D4 11.561%, #5F20DF 63.291%, #1E1446 101.84%)
```

**Background Front** (`ditu-tipo-contenido.tsx` línea 91-93):

```
linear-gradient(115.78deg, #7129D4 11.561%, #5F20DF 63.291%, #1E1446 101.84%)
```

**Estado BG:** ✅ Exacto — grado 115.78deg y 3 stops coinciden perfectamente.

**Assets Figma (750:3361):**

- Wave superior (`803:3486`): silhoueta cityscape `1447×492px` posicionada `top-[-362.63px]` (por encima del section, crea la transición visual desde ADN oscuro). La wave aparece SOBRE el section, desbordando hacia arriba.
- Custom icon decorativo (`650:7349`): `h-148px w-131px` posición `left-658px top-106px` (dentro del section, arriba del heading). Es un ditu-icon pequeño de "ojo/personaje" visible en la captura de pantalla de Figma.
- Dots de paginación: 3 dots `size-16px` con gap-16px.
- Separator dots entre tabs: `size-20px`.

**Assets Front:**

- Wave superior: Front usa `/ditu/wave-hablamos-bottom.png` con `scaleY(-1)` y `mix-blend-mode:multiply` en el `top:0` del section — ✅ wave presente y voltead correctamente.
- Custom icon `650:7349` (el personaje ojo): **NO PRESENTE** en el front. El componente `DituTipoContenidoBlock` no incluye ninguna imagen decorativa en la zona superior. Este ícono "ditu custom icons" con el personaje ojo pequeño está en el Figma pero no en el código.
- Dots paginación: presentes en front, size `h-3/w-3 lg:h-16px/w-16px` — ✅
- Separator dots entre tabs: presentes `h-3/w-3 lg:h-20px/w-20px` — ✅

**Estado Assets:** ❌

**Deltas específicos:**

- **Delta 1 (Alta):** El custom icon decorativo `650:7349` (personaje de tipo "ojo/mascota ditu", `131×148px` en Figma, posición `left-658px top-106px`) está **completamente ausente** en el front. En el screenshot del Figma de TipoContenido se ve claramente el ícono pequeño de la mascota sobre el gradiente. Severidad: Alta.
- **Delta 2 (Media):** Wave superior (`803:3486` — la wave del ADN que aparece sobre el bloque de TipoContenido): En Figma el bloque de TipoContenido incluye como asset propio la silhoueta de cityscape que emerge de `top-[-362.63px]` (es decir, visualmente "sobre" el bloque ADN anterior, creando una transición de ADN oscuro → TipoContenido). El front usa `/ditu/wave-hablamos-bottom.png` con `scaleY(-1)` — el PNG es diferente al que usa el ADN (`wave-adn.png`). En Figma la wave de TipoContenido es la misma geometría que la del ADN (`803:3483` es el mismo grupo que `738:3033`). Visualmente puede ser similar pero no está confirmado que sea el mismo asset PNG. Severidad: Media.

---

### [5] Nuestros Canales (756:7691)

**Background Figma** (del MCP `756:6921`):

```
linear-gradient(199.26361045191248deg,
  rgb(18, 8, 45) 15.056%,
  rgb(59, 26, 147) 45.857%,
  rgb(18, 8, 45) 79.425%)
= linear-gradient(199.26deg, #12082D 15.056%, #3B1A93 45.857%, #12082D 79.425%)
```

**Background Front** (`ditu-canales.tsx` línea 86-88):

```
linear-gradient(199.26deg, #12082D 15.056%, #3B1A93 45.857%, #12082D 79.425%)
```

**Estado BG:** ✅ Exacto — grado y 3 stops coinciden.

**Assets Figma (756:7691):**

- Custom icon decorativo (`756:6732`): `173×197px`, posición `left-[1086px] top-[192.75px]` dentro del inner wrapper. Es un conjunto de piezas del "ditu robot/eye" character.
- Logos de canales en las cards: En Figma todas las cards del tab "EN VIVO" usan el mismo SVG placeholder de "Caracol Sports" logo. No hay logos reales diferenciados por canal.
- Pill de tabs: `bg-rgba(255,255,255,0.2) border-white p-8 rounded-54px`.
- Grid 3 cols × 3 rows de channel cards.

**Assets Front:**

- Custom icon decorativo `756:6732`: **NO PRESENTE** explícitamente en el código de `DituCanalesBlock`. El código no incluye ningún `<img>` o `<div>` para el decorativo de la sección Canales.
- Channel cards: logos implementados como texto placeholder (iniciales del brand) en cyan sobre fondo oscuro — correcto según el comentario en el código que indica que los logos reales de Caracol aún no han sido entregados.
- Pill de tabs: ✅ implementado correctamente.
- Grid cards: ✅ 3 cols desktop, 2 cols mobile.

**Estado Assets:** ⚠️

**Deltas específicos:**

- **Delta 1 (Media):** Custom icon decorativo de la sección Canales (`756:6732`, el personaje robot/ojo, `173×197px`, posición `left-1086px top-192.75px`) está **ausente** en el front. El Figma lo muestra en la esquina superior derecha del bloque. Severidad: Media.
- **Delta 2 (Baja):** Logos de canal: tanto Figma como front usan placeholders (Figma usa el mismo SVG de Caracol Sports para todas las cards; front usa iniciales de texto). La diferencia es que Figma tiene al menos un SVG real de referencia. Pendiente de entrega de assets finales. Severidad: Baja (acknowledged).
- **Delta 3 (Baja):** Figma nota `py-[120px]` para el outer container, front usa `py-12 sm:py-16 lg:py-[64px]`. En desktop el Figma tiene padding vertical 120px exterior + 64px inner (= 184px total top/bottom), mientras front tiene `py-64px` únicamente. El padding vertical total difiere. Severidad: Baja-Media.

---

### [6] Calendario (760:9836)

**Background Figma** (del código del componente, alineado con spec del CLAUDE.md):

```
linear-gradient(116.12deg, #7129D4 11.561%, #5F20DF 63.291%, #1E1446 101.84%)
```

**Background Front** (`ditu-calendario.tsx` línea 250-253):

```
linear-gradient(116.12deg, #7129D4 11.561%, #5F20DF 63.291%, #1E1446 101.84%)
```

**Estado BG:** ✅ Exacto.

**Assets Figma:**

- Decoración calendario (`756:6515`): imagen `calendar-decoration.png`, `103×92px`, `top-[-10px] left-[317px]` relativo al heading container de `449px`.
- Cards de evento: `rounded-12px border-white p-16px h-232px`.
- Dots de paginación: `size-16px`, border white, gap-16px.
- CTA: texto Spline Sans Bold 24px + botón blanco.

**Assets Front:**

- `/ditu/calendar-decoration.png`: presente, posición `top:-10px left:317px w:103px h:92px` — ✅ Match exacto.
- Cards: `rounded-[12px] border border-white p-[16px] h-[232px]` — ✅
- Dots paginación: `h-[16px] w-[16px] border-1.5 border-white gap-[16px]` — ✅
- CTA: Spline Sans, botón blanco texto `#561BDB` — ✅

**Estado Assets:** ✅ Match.

**Deltas específicos:**

- **Delta 1 (Baja):** Dots de paginación — Figma muestra dots por item individual (1 dot por evento). Front agrupa de 4 en 4 (ceil(n/4) dots). Comportamiento de paginación diferente al Figma aunque los dots son visualmente similares. Severidad: Baja (decisión de UX documentada en código).

---

### [7] Video 2 (857:3974)

**Estado:** No auditado en este ciclo.

---

### [8] Pauta (760:9793)

**Background Figma** (del MCP `760:9793`):

```
linear-gradient(204.26455765915887deg,
  rgb(18, 8, 45) 37.947%,
  rgb(59, 26, 147) 106.75%)
= linear-gradient(204.26deg, #12082D 37.947%, #3B1A93 106.75%)
```

**Background Front** (`ditu-pauta.tsx` línea 191-192):

```
linear-gradient(204.26deg, #12082D 37.947%, #3B1A93 106.75%)
```

**Estado BG:** ✅ Exacto — grado 204.26deg y 2 stops hex idénticos.

**Assets Figma:**

- Sidebar sticky con sticker "Formatos de pauta" + 4 tabs verticales.
- Formato rows: `w-176px h-320px` imagen izquierda + texto derecho.
- CTA botón blanco "Descargar Especificaciones".
- Imágenes de formato: `pauta-card.png` con crop Figma `h-125.96% w-106.89% top-(-4.98%) left-(-5.96%)`.

**Assets Front:**

- `/ditu/pauta-card.png`: presente, crop exacto del Figma implementado — ✅
- Sidebar: implementado con sticky, backdrop-blur — ✅
- 4 tabs: Ad's, Patrocinio, Branded, Eventos especiales — ✅
- Botón CTA "Descargar Especificaciones": ✅

**Estado Assets:** ✅ Match.

**Deltas específicos:**

- **Delta 1 (Baja):** Figma tiene la imagen de formato card como `Rectangle57` (un único placeholder para todos los formatos). El front usa el mismo `/ditu/pauta-card.png` para todos — coherente con Figma.

---

### [9] Hablamos (541:7925)

**Background Figma** (del MCP `541:7925`):

```css
bg-gradient-to-b from-[#8232f0] to-[#561bdb]
= linear-gradient(180deg, #8232F0 0%, #561BDB 100%)
```

**Background Front** (`ditu-hablamos.tsx` línea 39-41):

```
linear-gradient(180deg, #8232F0 0%, #561BDB 100%)
```

**Estado BG:** ✅ Exacto.

**Assets Figma (541:7925):**

- PatoDitu mascota (`833:3850`): composite 6 SVGs (`pato-a.svg` hasta `pato-j.svg`), dentro de un div `w-530.251px h-493.161px`. Posición: `left-[915px] top-[38.31px]` relativo al heading content div. Transformación: `scaleY(-1) rotate(171.39deg)` en un inner div de `471.567×427.358px`.
- Wave bottom (`808:5736`): silhoueta cityscape `1440×131px` en absolute `bottom-0`. Clip path group con imagen enmascarada.
- Relleno de unión 4px `#12082D` bajo la wave.

**Assets Front:**

- PatoDitu: composite de 6 SVGs (`pato-a.svg`, `pato-b.svg`, `pato-c.svg`, `pato-g.svg`, `pato-i.svg`, `pato-j.svg`):
  - Outer div: `bottom:131px left:915px w:530.251px h:493.161px` — posición Figma `top:38.31px left:915px`. **El front usa `bottom:131px` en vez de `top:38.31px`**, lo que posiciona la mascota en la mitad inferior de la sección en vez de alineada al heading.
  - Transform inner div: `scaleY(-1) rotate(171.39deg)` — ✅ coincide con Figma.
  - Inner viewport: `w-471.567px h-427.358px` — ✅
  - Insets de cada pieza SVG: verificados en ambos lados y coinciden (a, b, c, g, i, j).
- Wave bottom `/ditu/wave-hablamos-bottom.png`: `absolute bottom:0 h:131px mix-blend-mode:multiply` + strip 4px `#12082D` — ✅
- Archivos SVG presentes en `/public/ditu/`: `pato-a.svg`, `pato-b.svg`, `pato-c.svg`, `pato-g.svg`, `pato-i.svg`, `pato-j.svg` — ✅ (nota: `pato-d.svg`, `pato-e.svg`, `pato-f.svg`, `pato-h.svg` no existen en `/public/ditu/`, ni en el Figma para este composite).

**Estado BG:** ✅ | **Estado Assets:** ✅ (con delta de posición de PatoDitu)

**Deltas específicos:**

- **Delta 1 (Alta):** PatoDitu posición vertical — Figma: `top:38.31px` (alineado con el inicio del heading content, mascota visible junto al texto). Front: `bottom:131px` (las patas a 131px del fondo de la sección). Visualmente la mascota en front aparece en la parte baja-derecha de la sección, mientras que en Figma aparece en la parte derecha alineada al heading. La diferencia vertical puede ser de ~300-400px dependiendo de la altura total de la sección. Severidad: Alta.
- **Delta 2 (Baja):** El PatoDitu en Figma está dentro del overflow-clip del inner div. El front movió el PatoDitu al `<section>` padre para evitar el clipping (comentado en el código: "Sacado del inner-div... al section para que el duck sea visible"). Esto genera una pequeña diferencia en el comportamiento del recorte. Severidad: Baja.

---

### [10] Footer (541:7935)

**Background Figma:** `#12082D` (sólido, sin gradiente).

**Background Front** (`ditu-footer.tsx`):

```
backgroundColor: "#12082D"
```

**Estado BG:** ✅ Exacto.

**Assets Figma:**

- Logo Ditu: variante pequeña `h-40px w-82px`
- "Encuéntranos" texto: Ditu Display Medium 24/lh-1.5 white
- 5 iconos sociales: FB, X, IG, TikTok, YouTube — `size-40px`
- WhatsApp **NO** aparece en Figma 541:7935

**Assets Front:**

- Logo Ditu: `DituWordmark` con `!h-[40px] !w-[82px]` — ✅
- "Encuéntranos": Ditu Display Medium 24px lh-1.5 — ✅
- Iconos sociales: FB, X, IG, TikTok, YouTube — ✅ (WhatsApp no incluido en DEFAULT_SOCIALS del footer)

**Estado Assets:** ✅ Match.

**Deltas específicos:**

- **Delta 1 (Baja):** Footer tiene `padding-bottom` ampliado en mobile (pb-24) por especificación de UX (FloatingContact). No en Figma. Intencional.

---

## Inventario de assets en `/public/ditu/`

| Asset                      | Presente en Figma           | Referenciado en front                              | Notas                  |
| -------------------------- | --------------------------- | -------------------------------------------------- | ---------------------- |
| `wave-adn.png`             | ✅ (738:3033)               | ✅ `ditu-adn.tsx`                                  | ✅ Usado correctamente |
| `wave-adn-mask-a.png`      | Posiblemente (texturas ADN) | ❌ No referenciado                                 | Delta                  |
| `wave-adn-mask-b.png`      | Posiblemente (texturas ADN) | ❌ No referenciado                                 | Delta                  |
| `wave-adn-texture.png`     | Posiblemente (texturas ADN) | ❌ No referenciado                                 | Delta                  |
| `wave-hablamos-bottom.png` | ✅ (808:5736 / Hablamos)    | ✅ `ditu-hablamos.tsx` + `ditu-tipo-contenido.tsx` | ✅ Doble uso correcto  |
| `adn-custom-icon.png`      | ✅ (512:2823)               | ✅ `ditu-adn.tsx`                                  | ⚠️ Posición delta      |
| `hero-bg.png`              | ✅ (512:2246)               | ✅ `ditu-hero.tsx`                                 | ✅                     |
| `mascot-hand.svg`          | ✅ (738:2526)               | ✅ `ditu-audiencia.tsx`                            | ⚠️ Posición delta      |
| `calendar-decoration.png`  | ✅ (756:6515)               | ✅ `ditu-calendario.tsx`                           | ✅                     |
| `pauta-card.png`           | ✅ (760:9793)               | ✅ `ditu-pauta.tsx`                                | ✅                     |
| `pato-a/b/c/g/i/j.svg`     | ✅ (833:3850)               | ✅ `ditu-hablamos.tsx`                             | ⚠️ Posición delta      |
| `adn-custom-icon.png`      | ✅ (512:2823 en ADN)        | ✅ `ditu-adn.tsx`                                  | ⚠️ left 180px off      |
| `mascot/` (dir)            | N/A                         | N/A                                                | No auditado            |

---

## Resumen de deltas críticos (ordenados por severidad)

| Prioridad | Sección            | Delta                                                                                                         | Severidad      |
| --------- | ------------------ | ------------------------------------------------------------------------------------------------------------- | -------------- |
| 1         | Tipo Contenido (4) | Custom icon `650:7349` (personaje mascota) completamente ausente                                              | **Alta**       |
| 2         | Hablamos (9)       | PatoDitu posición: `top:38px` (Figma) vs `bottom:131px` (front) — ~300-400px off vertical                     | **Alta**       |
| 3         | ADN (3b)           | `adn-custom-icon.png` posición `left:1327px` (front) vs `left:1147px` (Figma) — 180px off                     | **Alta**       |
| 4         | Canales (5)        | Custom icon decorativo `756:6732` ausente en front                                                            | **Media**      |
| 5         | Tipo Contenido (4) | Wave top: `wave-hablamos-bottom.png` scaleY(-1) vs wave específica de Figma `803:3486` — asset podría diferir | **Media**      |
| 6         | Audiencia (3a)     | `mascot-hand.svg` posición: `right:[20%]` → `left:1152px` vs Figma `left:816px` — 336px off                   | **Media**      |
| 7         | Canales (5)        | Padding vertical `py-64px` vs Figma `py-120px + py-64px inner`                                                | **Baja-Media** |
| 8         | ADN (3b)           | `wave-adn-mask-a.png`, `wave-adn-mask-b.png`, `wave-adn-texture.png` no referenciados                         | **Baja**       |
| 9         | Hero (1)           | ParallaxBackground no en Figma (adición de front)                                                             | **Baja**       |
| 10        | Calendario (6)     | Paginación dots por grupo de 4 vs dots por ítem en Figma                                                      | **Baja**       |

---

## Notas metodológicas

- El screenshot headless de Chrome no renderiza contenido dinámico de React (SSR/Hydration). La auditoría de backgrounds y assets se basó primariamente en **lectura de código fuente** y **Figma MCP `get_design_context`**, no en comparación pixel-a-pixel de screenshots.
- Todos los backgrounds de gradiente fueron verificados comparando los valores literales del MCP contra el código fuente.
- No se auditaron: secciones Video 1 (512:2244) y Video 2 (857:3974).
- Figma fileKey: `xorK9SgP6likPV59r58dYt` — datos extraídos el 2026-06-01.

---

## Correcciones aplicadas post-auditoría (2026-06-01)

| Delta                                                      | Acción                                                                                                                                                                                        | Estado       |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| [Alta] Tipo Contenido — icon `650:7349` ausente            | Descargado `tipoc-icon.png` (131×148px RGBA) y agregado en `ditu-tipo-contenido.tsx` con `top:234px left:658px`                                                                               | ✅ Cerrado   |
| [Alta] ADN icon posición `left:1327px` vs `left:1147px`    | **Falso positivo del audit agent** — Figma `x=1327.72px` en Frame 14510 (747:2626). El front usa `left:1327px` que es EXACTO. No se modifica.                                                 | ✅ N/A       |
| [Alta] Hablamos PatoDitu `bottom:131px` vs `top:38.31px`   | **Verificado visualmente**: Figma muestra pato en área inferior-derecha con patas tocando el wave. `bottom:131px` produce exactamente ese efecto. Delta del audit agent estaba sobreestimado. | ✅ N/A       |
| [Media] Audiencia mascot-hand posición                     | Front usa `right:[20%]`; Figma `left:816px`. A 1440px: `right:[20%]` = `left:1152px`. Delta real: 336px off. Pendiente.                                                                       | ⏳ Pendiente |
| [Media] Canales icon `756:6732` ausente                    | Pendiente.                                                                                                                                                                                    | ⏳ Pendiente |
| [Media] Audiencia mascot-hand `right:[20%]`→`left:[696px]` | Corregido: `lg:right-auto lg:left-[696px]`. Figma `x=816px` desde section left; flex div inicia a 120px → `816-120=696px` desde flex div.                                                     | ✅ Cerrado   |
| [Media] Canales icon `756:6732` ausente                    | Descargado `canales-icon.png` (173×197px RGBA fondo `#12082D`). Agregado en `ditu-canales.tsx` `absolute top:192.75px left:1086px hidden lg:block`.                                           | ✅ Cerrado   |
