# Auditoría Figma — MCP Readiness

**Archivo auditado:** Mediakit Caracol — Design System
**URL:** https://www.figma.com/design/xP0yxleEgB2ecKd77ObU6m/Mediakit-Caracol-%E2%80%94-Design-System
**Fecha:** 2026-05-15
**Auditor:** Claude (Opus 4.7, vía Figma MCP oficial)
**Alcance del proyecto local:** `caracol-next-ditu` → micrositio multibrand Caracol Next + Ditu (Next.js 15 + Tailwind v4 + shadcn/ui + Payload CMS 3)

---

## Veredicto

### Score: **2 / 5** — "Usable con cirugía"

El archivo es un **mediakit multimarca** (DITU, CARACOL TV, GOL CARACOL, CARACOL SPORTS, BLUE RADIO, LA KALLE, VOLK, BUMBOX, CARACOL NEXT, CARACOL MEDIOS, CARACOL DIGITAL) que excede el alcance del proyecto local (Caracol Next + Ditu). Tiene **componentes maestros decentes (330 symbols)** y **variables de color/tipo bien nombradas con jerarquía `Marca/Tipo/Variante`**, pero arrastra problemas que castigan la generación automática vía MCP:

- ~88% de los frames con nombres genéricos (`Frame 14377`, `Rectangle 36`, `Group 19`, `Property 1=X`).
- Layout predominantemente **absoluto** (sin auto-layout consistente).
- Una sola página `Desing` con todas las pantallas pegadas a 1440px — **sin frames mobile/tablet dedicados**.
- 400+ vectores en un único frame "pattern" decorativo que cualquier codegen va a ahogar.
- Estados (hover/focus/disabled) cubiertos solo en botones — modales y formularios sin estados de error/loading.

**Recomendación:**

1. **No generes UI directamente con MCP "design-to-code" para páginas completas.** Saldrá frankenstein.
2. **Sí extrae tokens y componentes uno a uno** (botones, cards, modales) — la base atómica está sana.
3. **Reconstruye las páginas** Home y Ditu **como composición manual de Payload Blocks** (no como traducción 1:1 del Figma).
4. Antes de empezar codegen pesado, pídele al diseñador ~14 h de cleanup (renombrar frames, marcar auto-layout, agregar mobile, aislar el frame "pattern").

---

## Hallazgos por dimensión

### A. Estructura

| Dato                             | Hallazgo                                                                                                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Páginas top-level                | 2: `Design System` (id `0:1`) y `Desing` (id `3:5`)                                                                                                                                               |
| Profundidad de árbol             | Design System: 6 niveles · Desing: 13 niveles                                                                                                                                                     |
| Frames top-level (Design System) | ~31 frames "Foundations - {MARCA} - 1/2/3" + frames sueltos para Buttons, Icons, Cards, Modales, etc.                                                                                             |
| Frames top-level (Desing)        | 4 macroframes: `Home Caracol Medios - 9` (1440×1024), `HOME` (1440×6772), `Prueba 1` (1130×969, **hidden**), `Ditu` (1440×840).                                                                   |
| Frames con `hidden=true`         | **167** frames ocultos (drafts, decores, patrones, CTAs antiguos). Indica iteración no limpia.                                                                                                    |
| Nombres semánticos vs genéricos  | ~12% semánticos (`Section - Hero`, `Logo Bar`, `Footer`, `Header`) · ~88% genéricos (`Frame N`, `Rectangle N`, `Property 1=…`).                                                                   |
| Auto-layout detectable           | ⚠️ **El XML de MCP no expone flags de auto-layout.** Inferencia por posiciones X/Y: solo ~7% de frames en Design System y ~31% en Desing muestran señales de stacking limpio. El resto: absoluto. |

**Interpretación:** la página `Desing` se navega bien hasta el segundo nivel (HOME → Section-Hero, Header, Footer, Frame 201) pero a partir del nivel 3 las cosas se desordenan: hay frames anidados que parecen "rectángulos sobre rectángulos" (composición visual, no layout estructural).

---

### B. Componentes

| Dato                                  | Hallazgo                                                                                                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<symbol>` (masters) en Design System | **330**                                                                                                                                                                          |
| `<symbol>` (masters) en Desing        | 1 (orphan)                                                                                                                                                                       |
| Instancias usadas en `Desing`         | **81** instancias · **29 nombres únicos**                                                                                                                                        |
| Naming de variantes                   | Mezcla decente: `Property 1=Default/Hover/Pressed/Disabled`, `Variant=Primary, Size=Large, State=Default`, slash-naming `Card ads/calendar card`, `Card ads/calendar card Ditu`. |

**Familias de componentes detectadas:**

| Categoría                        | Aproximado                 | Ejemplos                                                                                                                                              |
| -------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons                          | ~24                        | `Button - DITU`, `Button white`, `CaracolNExt Buttons` (con variantes Primary/Secondary/Ghost · Size SM/MD/LG · State Default/Hover/Pressed/Disabled) |
| Cards                            | ~4 sets                    | `Card ads`, `Card ads/calendar card`, `Card ads/calendar card Ditu`, `Card Ditu`                                                                      |
| Social media icons               | ~16                        | Instagram, TikTok, YouTube, Facebook, Threads, WhatsApp, Web, X — con Filled/Outline                                                                  |
| Status / Toggles                 | ~21                        | Por marca (CaracolTV, Ditu, GolCaracol, BluRadio, LaKalle, Volk, BumBox) × Default/Active/Hover                                                       |
| Typography components            | ~60                        | `Type=Primary, Size=MD, State=Default` (labels de botones, no estilos de texto)                                                                       |
| Logos                            | 2 masters + ~10 instancias | `Property 1=logo-light`, `Property 1=logo-dark`, `Logo Caracol NEXT`, `Logo Caracol MEDIOS`, `logo-caracolTV`                                         |
| Modals                           | 2                          | `Ventana Emergente DITU`, `Ventana contacto`, `Modal Pauta`                                                                                           |
| Otros (huerfanos / Property 1=…) | ~145                       | Categoria-01..06, Banner Multigaleria, Banner Slider, brand wordmarks, etc.                                                                           |

**Instancias más usadas en Desing (frecuencia):**

- 14× `CaracolNExt Buttons`
- 12× `Card ads/calendar card`
- 10× `Card ads`
- 5× `Badget`, 5× `socialmedia`
- 3× `Menu open`, 3× `Fuente Data`, 3× `logo-caracolTV`
- 2× `Modal Pauta`, `Logo Caracol NEXT`, `Button white`, `Button - DITU`, `ditu custom icons`
- 1× cada uno: `Ventana contacto`, `Header`, `Footer`, `Footer-home`, `Tab-btn`, `Scrolling Counter Animation`, `Pauta`, `Nuestros canales`, `Tipo de contenido`, `Brandend Content` (sic, typo), `slider calendario`, `icon full screen`, `btn_contancto` (sic, typo), `Frame 160`.

**Interpretación:** la base atómica es **mejor de lo esperado**. El problema no es la falta de componentes, sino:

- Huérfanos en exceso (145 "Property 1=…" sin instancias = ruido en MCP).
- Dos typos en nombres de instancias (`Brandend`, `btn_contancto`) que se propagarán al código si no se corrigen.
- Componentes maestros viven en `Design System` pero las instancias en `Desing` los referencian — no hay biblioteca externa publicada con estos componentes (las 8 librerías sí adjuntas son Material 3, SDS, iOS, macOS, etc. — **no relevantes**).

---

### C. Tokens

**Sí hay variables definidas en Figma** (confirmadas vía `get_variable_defs`):

**Colores — marca CaracolTV (más completa):**

- Primario: Azul Claro `#00ACFF`, Azul Medio `#015BC4`, Azul Oscuro `#003381`
- Neutro: Blanco `#FFFFFF`, Gris Claro `#CFCECC`, Gris Medio `#95999A`, Gris Oscuro `#464553`, Negro `#121212`
- Digital: Azul Claro `#2862FF`, Azul Oscuro `#003381`

**Colores — Ditu:**

- Primario: Blanco `#FFFFFF`, Violeta `#8232F0`, Violeta Oscuro `#1F1647`
- Gradientes: `#8232F0 → #561BDB`, `#8232F0 → #561BDB → #1F1647@15%`

**Colores — LaKalle:**

- Secundario: Screamin Green `#66FF74`

**Sistema de categorías (uso transversal):**

- `Categorias/01` `#2862FF` · `02` `#0000C4` · `03` `#FFC200` · `04` `#A139C6` · `05` `#FF0013` · `06` `#05E8FD`

**Neutrales globales:** `Neutral Color/100` `#FDFDFD`

**Tipografía (variables tipográficas):**

- `CaracolTV/Display/H1` → Montserrat Black 64/72/900
- `CaracolTV/Body/Regular` → Montserrat Regular 16/24/400
- `Mobile-Tablet/Button/SM` → Spline Sans Bold 12/1/700
- Familias mencionadas en frames: **Montserrat, Barlow, Filson Pro, Gilroy, Tusker Grotesque, Spline Sans, Arial, Ditu Display Bold**

**Spacing / Radius / Shadows:** ⚠️ **No hay variables `spacing-*`, `radius-*` ni `shadow-*` expuestas por MCP.** La separación, esquinas y sombras están aplicadas pixel a pixel en cada frame. Tendremos que **inferir desde diseño** (8/16/24/32 son los gaps más probables visto el grid 1440).

**Interpretación:** Tokens de color y tipografía → bien (con naming jerárquico `Marca/Tipo/Variante`). Tokens espaciales → no existen como tokens, hay que diseñarlos nosotros. Para Tailwind v4 los voy a derivar manualmente y proponer una escala 4/8/12/16/24/32/48/64.

---

### D. Estados

| Estado          | Cobertura                                                                        |
| --------------- | -------------------------------------------------------------------------------- |
| `Default`       | ✅ Universal — 27+ masters                                                       |
| `Hover`         | ✅ Buena en buttons (7+ symbols) y typography labels (40+ variantes State=Hover) |
| `Pressed`       | ✅ Buena en buttons (15+ variantes)                                              |
| `Disabled`      | ✅ Buena en buttons (15+ variantes)                                              |
| `Active`        | ⚠️ Solo en 7 status indicators (toggles por marca)                               |
| `Focus`         | ❌ **No detectado** en ningún master                                             |
| `Loading`       | ❌ **No detectado**                                                              |
| `Error`         | ❌ **No detectado** (modales y formularios sin estados de error)                 |
| `Empty`         | ❌ **No detectado** (cards sin variante "sin contenido")                         |
| `Open / Closed` | Parcial — instancia `Menu open` (no se ve variante closed)                       |

**Interpretación:** Botones e indicadores tienen estados completos; **modal `Ventana contacto`, formularios y cards no tienen estados de validación/error/loading**. Tendremos que crear esos estados en código (no en Figma) y validarlos con el cliente después.

---

### E. Responsive

| Breakpoint                      | Frames detectados                                                            |
| ------------------------------- | ---------------------------------------------------------------------------- |
| Desktop 1440                    | ✅ Sí — 31 frames (toda la maqueta principal)                                |
| Tablet 1200                     | Parcial — 27 frames a 1200 pero son secciones internas, no páginas completas |
| Tablet 768                      | ❌ Ningún frame top-level a 768                                              |
| Mobile 375/390                  | ❌ Ningún frame top-level a 375/390                                          |
| Sufijos `Mobile/Tablet/Desktop` | ❌ No usados                                                                 |

**Excepción:** el token tipográfico se llama `Mobile-Tablet/Button/SM`, lo que sugiere que el diseñador pensó en mobile-tablet pero **no maquetó pantallas para esos breakpoints**.

**Nota técnica embebida (frame `899:4832`):** El frame que tú me enviaste como URL es solo un sticky-note (`NOTA TÉCNICA`) que describe la spec del **botón flotante de contacto**:

- Posición fija esquina inferior derecha, sigue scroll.
- Click abre panel con representantes (nombre + correo + WhatsApp).
- Cierre con X.
- Animación: Framer Motion, fade-in 300ms ease.
- Representantes repetibles desde CMS.

→ Esto **NO** es un diseño — es una instrucción que entra como block `FloatingContactBlock` en Payload.

**Interpretación:** **Bloqueador medio.** El cliente aprobó solo desktop. Habrá que tomar decisiones de responsive en código (mobile-first) sin referencia visual del Figma. Riesgo: el cliente pedirá ajustes mobile en aprobación final.

---

### F. Assets

| Tipo                                     | Cantidad / detalle                                                                                                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Íconos como `<symbol>` SVG               | Sí, pero **distribuidos** — no hay un set dedicado "Icons". 16 socials, 2 ditu custom icons, varios Material Design (`tablet_mac_24dp_*`) importados, `Menu open`       |
| Vectores planos (`<vector>`) en `Desing` | **429** vectores — de ellos **~400 concentrados en un solo frame "pattern"** (textura decorativa de puntos). Bloqueador para codegen.                                   |
| Logos                                    | 2 masters genéricos (`logo-light`, `logo-dark`) + 10+ instancias con nombres de marca. Los logos reales viven como vectores embebidos, no como SVG exportable nombrado. |
| Nomenclatura de assets                   | Mixta — algunos con kebab (`logo-caracolTV`), otros camelCase, otros con typo (`Brandend Content`, `btn_contancto`).                                                    |

**Recomendación:** usar `lucide-react` para el set genérico de íconos (chevrones, menú, cerrar, flechas) y exportar manualmente solo los logos de marca + iconos sociales como SVG en `public/assets/`. El frame "pattern" → exportar como un único PNG/WebP y dejar de tratarlo como vectores.

---

### G. Bloques reutilizables (mapeo a Payload Blocks)

Bloques visibles dentro de `HOME` (347:1597, 1440×6772):

| Bloque Figma                 | ID         | Dimensiones | Probable contenido                                 |
| ---------------------------- | ---------- | ----------- | -------------------------------------------------- |
| Section - Hero               | `347:2015` | 1440×546    | Heading + tagline + CTA + background image/pattern |
| Header                       | `430:519`  | 1440×52     | Logo + nav                                         |
| Logo Bar                     | `347:1637` | 1440×147    | Carrusel de logos de marca                         |
| Frame 201 (contenido)        | `347:1599` | 1440×5580   | Contenedor de las secciones medias del Home        |
| Tabs                         | `364:3235` | 1440×1309   | Tabs + `Tab-btn` instances                         |
| Frame 14397 (CTA secundario) | `634:4392` | 1360×524    | CTA banner                                         |
| Footer                       | `347:1736` | 1440×124    | Footer minimal                                     |

Bloques visibles dentro de `Ditu` (548:3733, 1440×840) y `Body` (512:2245, 1440×11080):

| Bloque Figma                     | Probable contenido                             |
| -------------------------------- | ---------------------------------------------- |
| Ditu Hero                        | Hero estático con violeta corporativo          |
| Body (11080px)                   | Stack vertical de cards/grid de contenido Ditu |
| Scrolling Counter Animation      | Ticker numérico animado                        |
| Scrolling Counter Animation DITU | Variante Ditu                                  |

Bloques distribuidos (instancias sueltas):

- `Ventana contacto` — modal flotante de contacto (descrito en NOTA TÉCNICA).
- `Modal Pauta` (×2) — modal de pauta publicitaria.
- `Tipo de contenido` — selector/filtro de tipo de contenido.
- `Nuestros canales` — grid de marcas/canales.
- `Branded Content` — sección de contenido patrocinado.
- `slider calendario` — slider de fechas.
- `Pauta` — sección de pauta/ads.
- `Cards (Card ads × 10, Card ads/calendar card × 12)` — grid de cards reutilizable.

---

## Bloqueadores críticos

1. **Layout absoluto, no auto-layout (~70% de frames).** Sin auto-layout, MCP no puede inferir `flex`/`grid`/`gap`. La codegen entregará posiciones absolutas que no se adaptan. → **Bloqueador para "Generate Code".**
2. **Nombres genéricos (88% de frames).** `Frame 14377`, `Rectangle 36`, `Property 1=Default` no aportan semántica a un LLM. → **Bloqueador para mapeo automático a Payload Blocks.**
3. **Sin frames mobile / tablet.** Solo 1440px maquetado. → **Bloqueador para responsive fiel al diseño.**
4. **Frame "pattern" con ~400 vectores.** Codegen lo intentará parsear y se ahogará. → **Bloqueador local.** Solución: exportar como imagen o aislar.
5. **Tokens de spacing / radius / shadow inexistentes.** Hay que derivarlos a ojo. → **Bloqueador medio.**
6. **Falta cobertura de estados** para formularios y modales (focus, error, loading). → **Bloqueador medio** que se resuelve definiendo estados directamente en código.
7. **Multimarca vs alcance del proyecto.** El Figma cubre 11 marcas; el repo se llama `caracol-next-ditu`. → **Decisión de scope pendiente con el cliente.**
8. **167 frames ocultos + nombres con typos** (`Brandend Content`, `btn_contancto`). → **Ruido** que confunde a MCP y que arrastraríamos al código si no se corrige.
9. **No se pudo capturar screenshots para evidencia visual.** Plan Starter de Figma MCP rate-limit alcanzado en la auditoría. → Auditoría hecha 100% sobre XML metadata + variables. Sugerencia: upgrade del plan antes de codegen real.

---

## Ajustes recomendados (no bloqueadores)

Esto NO bloquea — pero acelera muchísimo la calidad del codegen si el diseñador lo aplica antes de generar:

1. **Renombrar 150+ frames genéricos** a semánticos (`Frame 201` → `Home Sections Container`, `Frame 14397` → `Secondary CTA Block`). Estimado: 3 h.
2. **Marcar auto-layout** en todos los containers + setear gaps. Estimado: 4 h.
3. **Crear breakpoints mobile (375) y tablet (768)** para Home y Ditu. Estimado: 6 h (probablemente lo aprueba el cliente como "ajuste de spec").
4. **Aislar el frame "pattern"** como asset PNG/WebP y borrar vectores. Estimado: 30 min.
5. **Limpiar 167 frames `hidden=true`** o moverlos a una página "Drafts". Estimado: 1 h.
6. **Corregir typos** (`Brandend`, `btn_contancto`). 5 min.
7. **Crear estados focus/error/loading** para `Ventana contacto` y futuro form de contacto. Estimado: 1 h.
8. **Consolidar 145 huérfanos** "Property 1=…" en sets variant nombrados (`Button/Variant=Ghost`, `IconSet/Social/Instagram`). Estimado: 3 h.

**Total cleanup sugerido: ~14–18 horas de diseño.** Sin esto, codegen pasará de ~30% utilizable a ~70–80%.

---

## Mapeo a Payload Blocks

Esta es la lista preliminar — la afinaremos en la **Fase 2 / Fase 3** del Prompt 3 cuando definamos collections.

| Sección Figma                    | Payload Block sugerido            | Campos editables (preliminares)                                                                                                     |
| -------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Section - Hero                   | `HeroBlock`                       | `heading: text`, `tagline: text`, `backgroundImage: media`, `cta: { label, href, variant }`, `theme: select [Caracol-Next \| Ditu]` |
| Header                           | `HeaderGlobal` (Global, no Block) | `logo: media`, `navItems: array<{ label, href }>`, `ctaButton: { label, href }`                                                     |
| Logo Bar                         | `LogoCarouselBlock`               | `logos: array<{ image: media, alt: text, href?: text }>`, `autoScroll: boolean`, `speed: number`                                    |
| Tabs                             | `TabsBlock`                       | `tabs: array<{ label: text, content: richText \| blocks }>`, `defaultTab: number`                                                   |
| CTA Secundario (Frame 14397)     | `CTABannerBlock`                  | `heading`, `description`, `primaryCta`, `secondaryCta`, `backgroundColor: select`                                                   |
| Scrolling Counter                | `CounterTickerBlock`              | `items: array<{ value: number, label: text, prefix?: text, suffix?: text }>`, `direction: select`, `speed: number`                  |
| Branded Content                  | `BrandedContentBlock`             | `title`, `brand: select`, `items: array<{ image, headline, href }>`                                                                 |
| Tipo de contenido                | `ContentTypeFilterBlock`          | `categories: array<{ label, slug, color }>`, `displayMode: select [tabs \| pills]`                                                  |
| Nuestros canales                 | `OurChannelsBlock`                | `channels: array<{ logo, name, color, href, description }>`                                                                         |
| Pauta                            | `PautaBlock`                      | `title`, `description`, `modalContent: richText`, `cta`                                                                             |
| Card ads / calendar card (grids) | `CardGridBlock`                   | `columns: select [2\|3\|4]`, `cards: array<{ image, heading, eyebrow, href, badge? }>`                                              |
| Slider calendario                | `CalendarSliderBlock`             | `events: array<{ date, title, description, image, href }>`                                                                          |
| Footer                           | `FooterGlobal` (Global)           | `columns: array<{ heading, links: array<{ label, href }> }>`, `socialLinks: array<{ network, url }>`, `legal: text`                 |
| Ventana contacto (flotante)      | `FloatingContactGlobal` (Global)  | `representatives: array<{ name, email, whatsapp, photo?, role? }>`, `enabled: boolean`, `position: select`                          |
| Modal Pauta                      | `ModalPautaBlock` (interno)       | `title`, `body: richText`, `cta`, `image?`                                                                                          |

**Globals (Payload Globals, no Blocks):** `HeaderGlobal`, `FooterGlobal`, `FloatingContactGlobal`, `SiteSettings`.
**Collections:** `Pages` (con blocks), `Media`, `Categories`, `Forms` (plugin Payload Form Builder).

---

## Estimación realista de ajuste post-generación

Suponiendo que **NO** se hace el cleanup recomendado del Figma:

| Etapa                                         | % de ajuste manual esperado                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Tokens (colores, tipografía)                  | **15%** — la base existe, falta derivar spacing/radius/shadows                              |
| Componentes atómicos (Button, Card, Modal)    | **30–40%** — hay buena estructura de variantes; ajustes para Tailwind v4 + shadcn           |
| Bloques de sección (Hero, CTA, LogoBar, Tabs) | **50–70%** — el codegen entregará posiciones absolutas; hay que rehacer layout responsive   |
| Páginas completas (Home, Ditu)                | **70–90%** — no recomiendo codegen directo de página; mejor componer manualmente con blocks |
| Responsive (mobile/tablet)                    | **100%** — no existe en Figma, hay que diseñarlo en código                                  |
| Estados (focus/error/loading)                 | **100%** — no existen, se crean en código                                                   |

Suponiendo que **SÍ** se hace el cleanup (14–18 h del diseñador):

| Etapa                | % de ajuste manual esperado                   |
| -------------------- | --------------------------------------------- |
| Tokens               | 10%                                           |
| Componentes atómicos | 15–20%                                        |
| Bloques de sección   | 25–35%                                        |
| Páginas completas    | 40–50%                                        |
| Responsive           | 60–80% (si agregan frames mobile, baja a 30%) |
| Estados              | 100% (no cambia)                              |

---

## Plan de acción sugerido

1. **Confirmar scope con cliente:** ¿solo Caracol Next + Ditu, o todas las marcas? (impacta tokens y collections).
2. **Pedir al diseñador 3 cleanups críticos** antes de empezar codegen:
   - Renombrar frames del Home y de Ditu (mínimo nivel 1–3).
   - Marcar auto-layout en containers principales.
   - Aislar el frame "pattern" como asset.
     (Si no es posible: seguimos pero con la realidad del 70–90% de ajuste manual en páginas).
3. **Continuar con Prompt 2 (Setup inicial del proyecto):**
   - Inicializar Next.js 15 + Tailwind v4 + Payload CMS 3.
   - Volcar los tokens de color/tipografía de esta auditoría en `src/styles/globals.css` con `@theme inline`.
   - Definir escala de spacing/radius nosotros (4/8/12/16/24/32/48/64; radius 4/8/12/16/full).
   - Instalar shadcn (`button`, `input`, `textarea`, `label`, `dialog`) con `new-york` y base color = primary CaracolTV `#015BC4` (o Ditu `#8232F0` según scope).
4. **Prompt 3 — Fases** (con tu OK explícito entre cada fase):
   - **Fase 1** — Atoms: Button, Card, Modal, Container, Section, FloatingContact.
   - **Fase 2** — Collections + Blocks definidos arriba.
   - **Fase 3** — Render de cada Block.
   - **Fase 4** — Página dinámica `[slug]` + seed de Home y Ditu.
   - **Fase 5** — Resend, Analytics, SEO.
5. **Antes de codegen real:** considerar upgrade del plan Figma MCP (Starter agotado en esta misma auditoría).

---

## Notas honestas

- **No mentí en el score.** 2/5 refleja que sin cleanup el codegen automático no es viable; con cleanup sube a 3.5/5.
- **El Figma es un Mediakit, no una guía de implementación.** Está pensado para que un humano lo lea, no para que MCP lo lea.
- **Los componentes atómicos sí son rescatables** — la jerarquía `Variant=…, Size=…, State=…` es la correcta.
- **Las páginas no son rescatables 1:1 con MCP** — hay que componerlas a mano con los Blocks de Payload.
- **El plan B siempre es válido:** generamos atoms con MCP + tokens, y los blocks de sección los componemos manualmente con shadcn primitives, validando contra screenshots del Figma uno a uno.
