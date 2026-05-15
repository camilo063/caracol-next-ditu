# Estructura de contenido — Landings Caracol Next + Ditu

> Información provista por el cliente / PM (2026-05-15). Esta es la fuente de verdad para definir Payload Blocks. Sustituye/complementa el mapeo preliminar de la auditoría Figma.

## Scope confirmado

- **2 landings**:
  - `/` → Caracol Next (landing principal)
  - `/ditu` → Ditu (segunda landing)
- **Color brand para shadcn:** `#015BC4` (CaracolTV Azul Medio, base de Caracol Next).
- Las demás marcas del Mediakit (GolCaracol, BluRadio, LaKalle, Volk, BumBox, CaracolSports, Medios, Digital) entran solo como **identidad gráfica dentro de los tabs de la sección "Marcas"** del Caracol Next, no como landings propias.

---

## Caracol Next — Home `/`

**Header con anclas:** Marcas · Audiencia · Momentos · Pauta · Contacto

| #   | Sección                                          | Estado            | Qué cambia / se agrega                                                                                                                                  | Intención                                                          |
| --- | ------------------------------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1   | **Hero — Por qué elegir Caracol Next**           | No existe         | Mensaje comercial fuerte; reemplaza el "Qué somos" operativo                                                                                            | Enganchar al anunciante desde el primer segundo                    |
| 2   | **Audiencia + Redes globales**                   | Existe (separado) | Fusión alcance + redes, integración automática vía API                                                                                                  | Una sola mirada para entender el poder del ecosistema              |
| 3   | **Fusionar nuestras marcas + Audiencia + Redes** | Existe (íconos)   | **Tabs por marca con identidad gráfica propia.** Cada tab incluye: Por qué elegir X marca · Audiencia + Redes específicas · Formatos de pauta con specs | Explorar marcas sin salir de la página, cada una se posiciona sola |
| 4   | **Momentos Clave / Calendario**                  | No existe         | Eventos y temporadas de alto impacto, administrable desde CMS                                                                                           | Crear urgencia — "pauta ahora antes del Mundial"                   |
| 5   | **Formatos de pauta globales**                   | Existe            | Vista global de todos los formatos del ecosistema                                                                                                       | Ver toda la oferta sin entrar marca por marca                      |
| 6   | **Branded Content**                              | Existe            | Destacar contenido personalizado                                                                                                                        | Destacar contenido personalizado                                   |
| 7   | **Contacto**                                     | Existe            | Más accionable, con ancla desde el header                                                                                                               | Reducir fricción para cerrar                                       |
| 8   | **Footer**                                       | Existe            | Rediseño con links, redes y contacto directo                                                                                                            | Utilidad sin ruido visual                                          |
| 9   | ⭐ **IA de recomendación**                       | No existe         | El anunciante describe su objetivo, la IA sugiere marca y formato                                                                                       | **Primer mediakit en Colombia con IA — diferenciador brutal**      |

**Decisiones clave Caracol Next:**

- Tabs por marca con identidad gráfica propia **dentro del shell de Caracol Next**.
- Métricas con **integración automática vía APIs** (no manual desde CMS).
- Header con anclas: Marcas · Audiencia · Momentos · Pauta · Contacto.
- **Pendiente UX:** cómo hacer accesibles los formatos sin scrollear (tarea futura, no bloqueante MVP).

---

## Ditu — `/ditu`

**Header con anclas:** Canales · Contenido · Momentos · Pauta · Contacto

| #   | Sección                         | Estado            | Qué cambia / se agrega                                                                                               | Intención                                                                             |
| --- | ------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | **Hero — Por qué elegir Ditu**  | No existe         | Mix de datos estrella: **3M de pantallas activas + 42 min watch time** como argumento combinado de escala y atención | Demostrar que Ditu no solo llega a muchos sino que tiene la atención real del usuario |
| 2   | **Audiencia + Redes**           | Existe (separado) | Fusión de alcance + redes, integración automática                                                                    | Dimensionar la audiencia de un solo vistazo                                           |
| 3   | **Nuestros canales**            | Existe            | Se mantiene, rediseño visual                                                                                         | Mostrar la variedad de contenido disponible                                           |
| 4   | **Eventos deportivos**          | Existe parcial    | Se mantiene, rediseño visual                                                                                         | Audiencia que solo está en Ditu — argumento de venta único                            |
| 5   | **Momentos Clave / Calendario** | No existe         | Eventos y temporadas de alto impacto, administrable desde CMS                                                        | Crear urgencia — "pauta ahora antes del Mundial"                                      |
| 6   | **Formatos de pauta globales**  | Existe            | Vista global de todos los formatos del ecosistema                                                                    | Ver toda la oferta sin entrar marca por marca                                         |
| 7   | **Contacto**                    | Existe            | Más accionable, con ancla desde el header                                                                            | Reducir fricción para cerrar                                                          |
| 8   | **Footer**                      | Existe            | Rediseño con links, redes y contacto directo                                                                         | Utilidad sin ruido visual                                                             |
| 9   | ⭐ **IA de recomendación**      | No existe         | El anunciante describe su objetivo, la IA sugiere marca y formato                                                    | Primer mediakit en Colombia con IA — diferenciador brutal                             |

**Decisiones clave Ditu:**

- **Línea gráfica y tono propios de Ditu** — entretenimiento y calidez.
- **42 min watch time** como argumento estrella.
- Header con anclas: Canales · Contenido · Momentos · Pauta · Contacto.
- **Footer con onda** — referencia de tono del Wix actual.

---

## Catálogo de Payload Blocks derivado

Definitivo para Fase 2 del Prompt 3. Cada block tendrá su collection field correspondiente.

### Blocks compartidos (ambas landings)

| Block                                         | Usado en                     | Campos principales                                                                                                                                                                                           |
| --------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HeroBlock`                                   | Ambas (variante por landing) | `landing: select [caracol-next \| ditu]`, `eyebrow`, `heading`, `subheading`, `tagline`, `keyStats: array<{ value, label, suffix? }>`, `backgroundImage`, `primaryCta`, `secondaryCta?`                      |
| `AudienceNetworksBlock`                       | Ambas                        | `landing: select`, `heading`, `audience: { reach, breakdown?: array<{ label, value }> }`, `networks: array<{ network, followers, growth?, apiSource? }>`, `apiIntegration: { enabled, lastSync, sourceUrl }` |
| `KeyMomentsCalendarBlock`                     | Ambas                        | `heading`, `description`, `events: array<{ name, dateStart, dateEnd?, description, image?, importance: select, ctaLabel?, ctaHref? }>`                                                                       |
| `AdFormatsBlock` (Formatos de pauta globales) | Ambas                        | `heading`, `description`, `formats: array<{ name, brand?, specs: richText, image?, category, downloadUrl? }>`, `displayMode: select [grid \| table \| accordion]`                                            |
| `ContactBlock`                                | Ambas                        | `id: text (ancla)`, `heading`, `description`, `formId: relation<forms>`, `representatives: array<{ name, role, email, whatsapp, photo }>`                                                                    |
| `AIRecommendationBlock` ⭐                    | Ambas                        | `heading`, `description`, `placeholder`, `aiModel: text (default openai/gpt-4o-mini via AI Gateway)`, `outputSchema: { brand, format, reasoning }`, `examples: array<{ prompt, expectedOutput }>`            |

### Blocks exclusivos Caracol Next

| Block                     | Campos principales                                                                                                                                                                                                                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `BrandTabsBlock` (Marcas) | `heading`, `tabs: array<{ brand: select [ditu, caracoltv, golcaracol, bluradio, lakalle, volk, bumbox, caracolsports], brandLogo: media, brandColor: text, whyChoose: richText, audience: { reach, breakdown }, networks: array<>, adFormats: array<{ name, specs, image? }>, ctaContact?: { label, href } }>`, `defaultTab: number` |
| `BrandedContentBlock`     | `heading`, `description`, `items: array<{ image, headline, eyebrow, href, brand? }>`, `layout: select [carousel \| grid]`                                                                                                                                                                                                            |

### Blocks exclusivos Ditu

| Block                                    | Campos principales                                                                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OurChannelsBlock` (Nuestros canales)    | `heading`, `description`, `channels: array<{ logo, name, color, href, description, audienceSize? }>`                                                                                  |
| `SportsEventsBlock` (Eventos deportivos) | `heading`, `description`, `events: array<{ name, dateStart, sport, league?, image, viewershipEstimate?, exclusivity?: boolean, ctaLabel?, ctaHref? }>`, `highlightExclusive: boolean` |

### Globals (no Blocks)

| Global                  | Campos principales                                                                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HeaderGlobal`          | `landing: select`, `logo: media`, `navAnchors: array<{ label, anchorId }>`, `ctaButton: { label, href }`, `theme: select`                                                                                |
| `FooterGlobal`          | `landing: select`, `description?: richText`, `columns: array<{ heading, links: array<{ label, href }> }>`, `socialLinks: array<{ network, url }>`, `bottomLine: text` (con onda visual en variante Ditu) |
| `FloatingContactGlobal` | `enabled: boolean`, `representatives: array<{ name, email, whatsapp, photo?, role? }>` — implementa NOTA TÉCNICA `899:4832`                                                                              |
| `SiteSettings`          | `defaultMetadata`, `ogImageDefault`, `apiIntegrations: { audienceApiUrl, networksApiUrl, refreshIntervalMinutes }`                                                                                       |

### Anclas estándar (slugs)

- Caracol Next: `#marcas`, `#audiencia`, `#momentos`, `#pauta`, `#contacto`
- Ditu: `#canales`, `#contenido`, `#momentos`, `#pauta`, `#contacto`

---

## Notas técnicas relevantes

- **API de audiencia/redes:** El cliente confirma "integración automática vía APIs". Se debe definir con el cliente cuál es la fuente (¿Google Analytics? ¿Plataforma propia de Caracol? ¿Meta/Instagram/TikTok APIs?). MVP: dejar el campo `apiSource: text` configurable + valores hardcodeados editables desde CMS hasta confirmar fuente real.
- **IA de recomendación:** usar **Vercel AI Gateway** con `openai/gpt-4o-mini` o `anthropic/claude-haiku-4-5` por costo. Output estructurado con `generateObject` + Zod schema `{ brand, format, reasoning }`.
- **Tabs por marca:** mantener accesibilidad — usar Radix Tabs o `@radix-ui/react-tabs` (shadcn), no carrousel, no scroll horizontal en mobile.
- **Calendario / Momentos clave:** considerar timeline horizontal con scroll en desktop + vertical en mobile. Admin desde Payload.
- **Footer Ditu con "onda":** efecto visual SVG decorativo en el top del footer (referencia Wix actual). Diferenciado del footer Caracol Next.
