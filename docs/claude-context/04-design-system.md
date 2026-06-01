# 04 — Design System (Tokens, Brand, Tipografía)

> Fuente: Sistema de diseño Figma (`fileKey xorK9SgP6likPV59r58dYt`,
> nodeId `0:1`). Replicado aquí para consulta rápida sin saltar al MCP.

## Paleta — colores aprobados

### Caracol Medios (Home `/`)

| Nombre Figma                   | Hex       | Uso                              |
| ------------------------------ | --------- | -------------------------------- |
| CaracolTV/Primario/Azul Oscuro | `#003381` | BG hero, borders, text primario  |
| CaracolTV/Primario/Azul Medio  | `#015BC4` | Botones secundarios, links       |
| CaracolTV/Primario/Azul Claro  | `#00ACFF` | Eyebrows, CTAs, accents          |
| CaracolTV/Neutro/Blanco        | `#FFFFFF` | Text inverso, BG cards           |
| CaracolTV/Neutro/Gris Oscuro   | `#464553` | Text secundario, labels métricas |
| CaracolTV/Neutro/Gris Medio    | `#95999A` | Borders, dividers                |
| CaracolTV/Neutro/Negro         | `#121212` | Text body                        |

### Ditu

| Nombre Figma                           | Hex       | Uso                                 |
| -------------------------------------- | --------- | ----------------------------------- |
| Ditu/Primario/Violeta                  | `#8232F0` | Heading brand, peak bar             |
| Ditu/Complementario/Violeta Medio      | `#561BDB` | Botón CTA gradient, slice pie chart |
| Ditu/Primario/Violeta Oscuro           | `#12082D` | BG card, sticker text               |
| Ditu/Complementario/Violeta Muy Oscuro | `#1F1647` | BG section gradient                 |
| Ditu/Primario/Cyan                     | `#77EDED` | Accents, stickers, eyebrows         |
| Ditu/Primario/Blanco                   | `#FFFFFF` | Text                                |

### Gradients Ditu

```css
/* Hero */
linear-gradient(129.43deg, #12082D 6.03%, #3B1A93 97.81%)

/* Audiencia (cifras) */
linear-gradient(180deg, #3B1A93 0%, #2A1469 60%, #12082D 100%)

/* ADN Ditu */
linear-gradient(175.32deg, #12082D 9.84%, #291266 47.99%, #12082D 85.01%)

/* Canales */
linear-gradient(199.26deg, #12082D 15.056%, #3B1A93 45.857%, #12082D 79.425%)

/* Calendario */
linear-gradient(116.12deg, #7129D4 11.561%, #5F20DF 63.291%, #1E1446 101.84%)

/* Ditu CTA button */
linear-gradient(115.47deg, #8232F0 14.111%, #561BDB 81.738%)
```

### Categorías (calendario)

| Token Figma   | Hex       | Tag mostrado |
| ------------- | --------- | ------------ |
| Categorias/01 | `#2862FF` | Azul medio   |
| Categorias/02 | `#0000C4` | Azul oscuro  |
| Categorias/03 | `#FFC200` | Amarillo     |
| Categorias/04 | `#A139C6` | Morado       |
| Categorias/05 | `#FF0013` | Rojo         |
| Categorias/06 | `#05E8FD` | Cyan         |

### Marcas (BrandTabs en Caracol Next)

`src/lib/brand.ts` exporta `BRAND_META` con la paleta por marca:

| Brand         | color (heading) | colorDark (panel/secondary slice) | colorAccent (accent/primary slice) | chartPeak |
| ------------- | --------------- | --------------------------------- | ---------------------------------- | --------- |
| caracoltv     | `#003381`       | `#003381`                         | `#00ACFF`                          | `#003381` |
| golcaracol    | `#006AEF`       | `#071D49`                         | —                                  | `#006AEF` |
| caracolsports | `#005294`       | `#005294`                         | `#00B3FB`                          | `#005294` |
| bluradio      | `#00AEEF`       | `#005BAA`                         | —                                  | `#005BAA` |
| lakalle       | `#353535`       | `#353535`                         | `#FEFF00`                          | `#FEFF00` |
| bumbox        | `#1EB1FB`       | `#042D66`                         | —                                  | `#042D66` |
| volk          | `#0E3DFF`       | `#0E3DFF`                         | `#FF0080`                          | `#0E3DFF` |
| ditu          | `#8232F0`       | `#1F1647`                         | `#77EDED`                          | `#8232F0` |

> Para BluRadio y BumBox: `colorDark` se ajustó a la versión oscura del
> color para que los slices del pie chart sean visualmente distinguibles
> (bug histórico de "mismo color").

## Tipografía

### Fonts en uso

| Font         | Familia origen                             | Peso disponible                   | CSS var                    |
| ------------ | ------------------------------------------ | --------------------------------- | -------------------------- |
| Montserrat   | Google                                     | 300, 400, 500, 600, 700, 800, 900 | `var(--font-montserrat)`   |
| Poppins      | Google                                     | 400, 500, 600, 700                | `var(--font-poppins)`      |
| Spline Sans  | Google                                     | 300, 400, 500, 600, 700           | `var(--font-spline-sans)`  |
| Ditu Display | Local (`/public/fonts/Ditu-Display-*.otf`) | 500, 700                          | `var(--font-ditu-display)` |

Cargadas en `src/app/(frontend)/layout.tsx` con `next/font/google` y
`next/font/local`. Variables CSS expuestas en `<html>`.

### Escala tipográfica — Caracol Next + Home

| Uso                   | Font       | Weight                         | Size         | Line    | Tracking |
| --------------------- | ---------- | ------------------------------ | ------------ | ------- | -------- |
| Hero heading          | Montserrat | Bold/ExtraBold/SemiBold (mix)  | 74px desktop | 80px    | -2.96px  |
| Section heading       | Montserrat | Bold (regular+ExtraBold split) | 64px desktop | 72px    | -1px     |
| Eyebrow               | Poppins    | Bold uppercase                 | 20px desktop | normal  | —        |
| Tab pills             | Montserrat | SemiBold                       | 16px         | 24px    | —        |
| Body                  | Montserrat | Medium                         | 14–16px      | 20–24px | —        |
| Number stat (CountUp) | Montserrat | ExtraBold                      | 60px         | 48px    | —        |
| Label métrica         | Montserrat | SemiBold                       | 20px         | 24px    | —        |
| Botón primario        | Montserrat | SemiBold                       | 18px         | 24px    | —        |

### Escala tipográfica — Ditu

| Uso                    | Font         | Weight         | Size                              | Line   |
| ---------------------- | ------------ | -------------- | --------------------------------- | ------ |
| Hero heading           | Ditu Display | Bold uppercase | clamp(2.75rem … 6rem)             | 1      |
| Section heading        | Ditu Display | Bold uppercase | 84px / 60px / 36px (lg/sm/mobile) | 1      |
| Sticker (rotado -2deg) | Ditu Display | Bold uppercase | 48px desktop                      | 1      |
| Eyebrow                | Ditu Display | Bold uppercase | 18–24px                           | normal |
| Body                   | Spline Sans  | Regular        | 16–22px                           | normal |
| Botón outline          | Ditu Display | Bold uppercase | 20px desktop                      | 20px   |
| Botón CTA pill         | Spline Sans  | Bold           | 16px                              | 1.5    |

## Responsive — breakpoints

Tailwind v4 defaults pero usar nomenclatura propia:

| Token  | Tailwind  | px     | Uso                       |
| ------ | --------- | ------ | ------------------------- |
| mobile | (default) | < 640  | Layouts apilados          |
| sm     | `sm:`     | ≥ 640  | Tablet vertical           |
| md     | `md:`     | ≥ 768  | Tablet horizontal         |
| lg     | `lg:`     | ≥ 1024 | Desktop (Figma reference) |
| xl     | `xl:`     | ≥ 1280 | Desktop ancho             |

Reglas:

- El Figma viene a **1440px**. Diseñar en `lg:` con valores literales del Figma.
- Para `< lg`: reducir font-size del heading, line-height proporcional,
  paddings menores, stacks verticales.
- Containers principales usan `max-w-[1377px] mx-auto` (ancho útil del Figma).

## Espaciado / Padding patterns

| Patrón                       | Valor                            |
| ---------------------------- | -------------------------------- |
| Section padding desktop      | `py-[120px]` o `py-[160px]`      |
| Section padding mobile       | `py-12` (48px) o `py-16` (64px)  |
| Container horizontal desktop | `lg:px-[84px]` o `lg:px-[120px]` |
| Container horizontal mobile  | `px-6` (24px) o `px-4` (16px)    |
| Gap entre cards row          | `gap-[24px]` o `gap-[32px]`      |
| Card internal padding        | `p-[20px]` o `p-[40px]`          |

## Border radius patterns

| Patrón                         | Valor                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------- |
| Botón primario                 | `rounded-[4px]`                                                                   |
| Card                           | `rounded-[8px]` o `rounded-[12px]`                                                |
| Section bg con curva (esquina) | `borderTopRightRadius: 100px` (era 180px en Figma; reducido por sentir exagerado) |
| Pill / badge                   | `rounded-[4px]` (cuadradito) o `rounded-[64px]` (pill)                            |
| Sticker rotado Ditu            | `rounded-[8px]`                                                                   |

## Shadows

| Patrón                              | CSS                                                           |
| ----------------------------------- | ------------------------------------------------------------- |
| Card hover Caracol Next             | `shadow-lg hover:shadow-[#00ACFF]/30`                         |
| Card hover Ditu                     | `shadow-lg hover:shadow-[#8232F0]/40`                         |
| Modal panel                         | `box-shadow: 0 4px 4px rgba(0,0,0,0.25)`                      |
| Halo entre hero y siguiente section | `0px -34px 20px rgba(0,51,129,0.55)` (AudienceNetworks block) |

## Cursors / Interacción

- Todos los elementos clickeables → `cursor-pointer`.
- Botones primarios: `hover:bg-<10% darker>` + `shadow-lg shadow-<brand>/30`
  - `active:scale-[0.98]`.
- Cards de producto: `hover:scale-[1.01]` + `shadow-lg`.
- Tabs: `hover:opacity-90` (sutil, no shadow).
- Icons sociales: `hover:scale-110` + `hover:opacity-80`.
- Arrow icons (`ArrowRight`): `transition-transform group-hover:translate-x-0.5`.

## CSS variables ya expuestas

En `src/styles/globals.css` (revisar archivo para lista completa):

- `--font-montserrat`, `--font-poppins`, `--font-spline-sans`, `--font-ditu-display`
- Theme tokens shadcn (background, foreground, primary, secondary, muted, etc.)
- Tokens custom específicos del Mediakit cuando se requieran

## Para extender el design system

Cuando llegues a una pantalla nueva del Figma con tokens no documentados:

1. Llama `mcp__figma__get_variable_defs` con el nodeId.
2. Copia los tokens devueltos a este archivo.
3. Si son colores nuevos de brand, agregarlos a `src/lib/brand.ts`.
4. Si son font sizes/styles nuevos, agregar a la tabla correspondiente.
