# 05 — Animaciones, Parallax y Performance

## Principios

1. **Suave > Llamativo**: easing cubic-bezier OutQuint (`[0.16, 1, 0.3, 1]`)
   en lugar de easeOut nativo. Duraciones 0.5–2.4s según el tipo.
2. **Respeta `prefers-reduced-motion`**: todas las animaciones deben
   chequear `useReducedMotion()` y degradar a render estático.
3. **Trigger al estar en viewport**: las animaciones se disparan cuando
   el usuario llega a la sección, no antes. `useInView({ once: true })`
   con `margin: "0px 0px -10% 0px"`.
4. **Stagger natural**: elementos hermanos entran con delay 0.08–0.15s
   en cascada (no todos al mismo tiempo).

## Easing cubic-bezier estándar

```ts
const STAGGER_EASE = [0.16, 1, 0.3, 1] as const; // OutQuint-like, smooth
```

Usar en:

- `transition: { duration, ease: STAGGER_EASE }`
- `animate(0, value, { ease: STAGGER_EASE })` (Framer Motion `animate()`)

## Componentes de animación reusables

### `CountUp` (`src/components/animations/count-up.tsx`)

Anima un número de 0 al valor final cuando entra al viewport.

```tsx
<CountUp value={16} format={(v) => `${Math.round(v)}M`} duration={2.4} />
```

- `duration` default 2.4s.
- Easing: cubic-bezier `[0.16, 1, 0.3, 1]`.
- `once: true` — no re-anima.
- Respeta reduced motion (muestra valor final sin animar).

### `RevealSection` (`src/components/animations/reveal-section.tsx`)

Fade-in + slide-up al entrar al viewport.

```tsx
<RevealSection>
  <BlockContent />
</RevealSection>
```

- `offset` (default 32px de slide).
- `rootMargin` default `"0px 0px -10% 0px"` (dispara cuando el top del
  bloque entró 10% en el viewport).
- `amount: 0.15` (15% del elemento visible para disparar).
- `duration: 0.55s`.
- `delay` opcional en ms para escalonar reveals contiguos.

### `ParallaxBackground` (`src/components/animations/parallax-background.tsx`)

Wrap de un background image/video para parallax suave al hacer scroll.

```tsx
<ParallaxBackground speed={0.4} className="absolute inset-0">
  <Image src="/hero-bg.png" alt="" fill priority />
</ParallaxBackground>
```

- `speed` default 0.4 (40% del scroll).
- En mobile + reduced-motion: parallax desactivado.
- Usado en DituHero y HeroBlockComponent con `backgroundImage`.

## Patterns de uso

### Stagger en lista de elementos

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

Aplicado en `HubLanding` (Home).

### Remount de Recharts para animar al ver

Recharts solo anima al `mount`. Si el componente ya está montado pero
oculto detrás del fold, la animación se pierde. Solución: render
condicional con `useInView`.

```tsx
const ref = useRef<HTMLDivElement>(null);
const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

return (
  <div ref={ref}>
    {inView ? (
      <ResponsiveContainer key="chart-in">
        <PieChart>...</PieChart>
      </ResponsiveContainer>
    ) : null}
  </div>
);
```

Aplicado en `DituAdnBlock` para pie chart género y bar chart edad.

### Tabs con `min-height` para evitar saltos

Si los tabs tienen contenido de altura variable (ej. 2 vs 7 cards),
fijar `min-h-[...]` al contenedor del contenido para que el switch no
salte abruptamente:

```tsx
<div className="min-h-[384px] lg:min-h-[284px]">
  <AnimatePresence mode="wait">
    <motion.div key={activeTab} ... />
  </AnimatePresence>
</div>
```

Aplicado en `DituCanalesBlock`.

### Header sticky con hide-on-scroll-down

`SiteHeader` (`src/components/marketing/site-header.tsx`):

- Sticky `fixed top-0`.
- Esconde con scroll-down (delta > 8px).
- Muestra con scroll-up (delta > 12px) — threshold mayor para evitar oscilación.
- Siempre visible cuando `scrollY <= 120`.
- BG cambia a opaco/scrolled cuando `scrollY > 24`.

### IntersectionObserver para active anchor

Tracking del item de nav activo según sección visible:

```tsx
const io = new IntersectionObserver(
  (entries) => {
    /* set active id */
  },
  { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
);
```

El `rootMargin` deja una franja activa en el centro del viewport
(40–55% del top). Aplicado en `SiteHeader`.

## Hover patterns

### Botón primario

```css
hover:bg-[<10% darker>]
hover:shadow-lg hover:shadow-[<brand>]/30
active:scale-[0.98]
transition-all duration-200
```

### Card hover

```css
hover:scale-[1.01]
hover:shadow-lg
transition-all duration-200
```

### Icon hover (social, etc.)

```css
hover:scale-110
hover:opacity-80
transition-all duration-200
```

### Arrow icon en botón

```tsx
<ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
```

Requiere `group` en el padre.

## Performance — qué cuidar

### Lazy load de assets pesados

- **Hero bgs**: `priority` en Image, `sizes="100vw"`.
- **Videos**: `autoPlay loop muted playsInline` + `preload="metadata"`.
- **YouTube**: usar `<iframe>` con `loading="lazy"` o un Player on-demand.
- **Logos brand**: PNG con `sizes` apropiado (no full-width).

### Bundle size

- Framer Motion: si solo necesitas `motion.div` simple, plantéate
  `motion/react` (alias del paquete `motion` v11+).
- Recharts pesa 100KB+. Solo cargar en las páginas que lo necesitan
  (ya está en client components).
- Embla Carousel: usado en Calendario; OK.

### Hydration

- Componentes con `Math.random()`, `Date.now()`, `Intl` o detección de
  device width al render → marcar `"use client"` con `useState` para
  hidratar después.
- `<body suppressHydrationWarning>` ya está en `layout.tsx` para
  extensiones de browser que mutan atributos.

### Imágenes

- Usar `next/image` con `width`+`height` o `fill`+`sizes`.
- Para SVGs decorativos pequeños: inline (mejor `currentColor` + bundle único).
- Para SVGs de logos compartidos: archivos en `/public/<landing>/`.

## Roadmap de animaciones pendientes

Ver [`06-roadmap.md`](06-roadmap.md) sección "Animaciones + Parallax",
pero en resumen:

- [ ] Parallax en secciones internas (no solo hero) — ej. Calendario
      con bg que se mueve a velocidad distinta.
- [ ] Piquitos decorativos del ADN Ditu (decoraciones de entrada/salida
      laterales).
- [ ] Skew/rotate sutil en stickers Ditu al hover.
- [ ] Confetti/particles opcional en Hero al landing (low priority).
- [ ] Cursor custom (style Caracol cuando estás sobre Hero) — pendiente
      de aprobación.

## Templates para prompts derivados

### Agregar parallax a una sección existente

```
Agrega un efecto parallax al background de la sección <Sección>
en <ruta>.

1. Identifica el wrapper de la sección.
2. Mueve el background actual a un layer absoluto interior.
3. Envuelve ese layer con <ParallaxBackground speed={0.3}>.
4. Verifica que en mobile (< sm) el parallax esté off (ya lo hace el
   componente).
5. Asegúrate que el contenido del foreground no se solape con el
   parallax (z-index).
```

### Optimizar animación que se siente brusca

```
La animación de <componente> se siente brusca. Suavízala:

1. Cambia easing de "easeOut" a [0.16, 1, 0.3, 1] (cubic-bezier OutQuint).
2. Aumenta duración a 0.5-2.4s según el caso (counters = 2.4s,
   reveals = 0.55s, hovers = 0.2s).
3. Si es un counter Recharts, asegúrate que use useInView + remount.
4. Verifica que respeta reduced-motion.
```
