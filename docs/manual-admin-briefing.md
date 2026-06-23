# Briefing para generar el Manual de Administración — Caracol Next + Ditu

> **Para Claude (o quien genere el manual):** este archivo contiene TODO el contexto
> del CMS de este proyecto. Tu tarea es producir un **manual de administración paso a
> paso, exhaustivo y para usuarios NO técnicos** (equipo comercial/marketing de Caracol),
> que explique cómo administrar el 100 % del sitio desde el panel de Payload.
>
> **Cómo debe ser el manual que generes:**
>
> - En **español**, tono claro y directo, tratando al lector de "tú".
> - **Paso a paso numerado** para cada tarea ("1. Entrá a… 2. Hacé clic en… 3. Escribí…").
> - Una sección por cada área del admin, siguiendo el orden real en que aparece.
> - Incluir, para cada bloque/campo, **qué controla en la página pública** (qué ve el visitante).
> - Marcar con 🟡 los campos/acciones **delicados** (publicar, borrar, slugs, hex, fechas ISO).
> - Incluir un apartado de **"Tareas comunes"** tipo recetario ("¿Cómo cambio…?").
> - Incluir un **glosario** (bloque, global, colección, publicar vs guardar, draft, media).
> - Dejar **marcadores `[CAPTURA: …]`** donde convendría una imagen del admin.
> - Asumir que el lector NO sabe de código, JSON ni bases de datos.
> - No inventes campos: usá EXACTAMENTE el inventario de este briefing. Si un campo no
>   está acá, no existe en el admin.

---

## 1. Qué es el proyecto

**Caracol Next + Ditu — Mediakit**: micrositio del ecosistema Caracol Comercial Digital.
Un solo CMS (Payload) administra **tres superficies públicas**:

| Superficie       | URL pública     | Cómo se administra                                                                  |
| ---------------- | --------------- | ----------------------------------------------------------------------------------- |
| **Home / Hub**   | `/`             | Global **Site Settings → Home Content** + colección **Brands** + **Botón flotante** |
| **Caracol Next** | `/caracol-next` | Página "Caracol Next" (Page Builder por bloques) + Header/Footer Caracol Next       |
| **Ditu**         | `/ditu`         | Página "Ditu" (Page Builder por bloques) + Header/Footer Ditu                       |

El **Botón flotante de contacto** y la colección **Brands** son **transversales** (afectan a varias superficies).

**Acceso al admin:** `https://<dominio>/admin` (en producción: el dominio de Vercel del proyecto).
La primera vez, Payload pide crear un usuario administrador. Login con email + contraseña.

---

## 2. Cómo está organizado el panel (navegación)

El menú lateral del admin tiene dos grandes grupos:

### Collections (colecciones — listas de documentos)

- **Páginas** — las páginas con su contenido por bloques (Caracol Next y Ditu).
- **Media** — biblioteca de imágenes/archivos (logos, fotos, íconos, mockups).
- **Categories** — categorías reutilizables (taxonomía).
- **Marcas (Brands)** — catálogo editable de marcas del ecosistema (bajo el grupo "Catálogos").
- **Users** — usuarios del admin.

### Globals (configuración única, no son listas)

- **Header — Caracol Next** y **Header — Ditu**
- **Footer — Caracol Next** y **Footer — Ditu**
- **Site Settings** (incluye el contenido del Home + SEO global)
- **Botón flotante de contacto**

> **Concepto clave:** una **Colección** es una lista (podés crear/borrar varios ítems).
> Un **Global** es una sola configuración (no se crea ni se borra, solo se edita).

---

## 3. Conceptos fundamentales que el manual debe explicar primero

### 3.1 Páginas y el Page Builder (bloques)

- Las landings **Caracol Next** y **Ditu** son una **Página** cada una (en Collections → Páginas).
- Cada página tiene un campo **Layout**: una lista de **bloques** apilados en orden.
- Cada bloque es una sección visual (Hero, Calendario, Video, etc.).
- Los bloques se pueden **reordenar arrastrando** (ícono de los 6 puntos ⠿ a la izquierda de cada bloque).
- Se pueden **colapsar/expandir** ("Collapse All / Show All") y **agregar** con "Add Layout".
- 🟡 **No cambiar el `Landing` ni el `Slug`** de una página existente sin saber lo que se hace
  (rompe la URL). `Slug`: usar `home` para la raíz de cada landing; kebab-case para sub-páginas.

### 3.2 Guardar vs Publicar (MUY IMPORTANTE)

- Las Páginas tienen **versiones y borradores (drafts)**.
- **Save Draft / Guardar borrador**: guarda los cambios pero **NO los publica** (el visitante no los ve).
- **Publish changes / Publicar**: hace los cambios **visibles en el sitio público**.
- 🟡 Si editás y solo guardás borrador, el cambio **no sale** en la web hasta que des "Publicar".
- Hay pestaña **"Versions"** para ver el historial y restaurar versiones anteriores.
- Los **Globals** (Header, Footer, Site Settings, Botón flotante) se guardan con **"Save"** y
  el cambio se refleja sin un paso de "publicar" aparte.

### 3.3 La biblioteca de Media (imágenes)

- Cualquier campo de imagen/logo/foto/ícono tiene **"Create New"** (subir nuevo) o
  **"Choose from existing"** (elegir de la biblioteca) o arrastrar y soltar.
- Al subir, conviene completar el **Alt text** (texto alternativo, accesibilidad/SEO) y opcional **Credit**.
- Payload genera tamaños automáticos (thumbnail, card, tablet, desktop).

### 3.4 Tipos de campo que vas a ver (para el glosario)

- **Texto / Área de texto**: campos de escritura simple o multilínea.
- **Número**: valores numéricos (porcentajes, métricas).
- **Select (desplegable)**: elegir una opción de una lista fija.
- **Checkbox**: casilla sí/no.
- **Upload (subida)**: imagen/archivo de la biblioteca Media.
- **Relationship (relación)**: enlaza a otra colección (ej. elegir una **Marca**).
- **Array (lista)**: lista de ítems repetibles (ej. eventos, representantes) — se agregan/borran/reordenan.
- **Group (grupo)**: conjunto de campos relacionados agrupados visualmente.
- **Rich text**: editor con formato (negrita, listas, links).
- 🟡 **Campo de color HEX**: se escribe el color en formato `#RRGGBB` (ej. `#77EDED`).
- 🟡 **Fecha ISO**: formato `AAAA-MM-DD` (ej. `2026-03-06`).

---

## 4. HOME (`/`) — se administra desde Globals + Brands

El Home **no usa Page Builder**. Su contenido sale de:

### 4.1 Site Settings → Home Content

Campos (en orden):

- **Logo Caracol Medios** (upload) — logo principal del hub.
- **digitalLabel** (texto) — etiqueta "DIGITAL".
- **Eyebrow** (texto) — tagline superior.
- **contactLabel** (texto) — texto del botón "Contáctenos".
- **Marcas (cards de producto)** (grupo) → dos sub-grupos:
  - **Caracol Next**: Logo (card), Descripción (lista de párrafos), Texto CTA, URL destino.
  - **Ditu**: Logo (card), Descripción (lista de párrafos), Texto CTA, URL destino.
- **Métricas (4 cards)** (array) — cada card: Ícono (40×40), Valor numérico (CountUp animado),
  Prefijo (ej. `+`), Sufijo (ej. `M`, `Min`), Label, Color acento (Caracol Next/Ditu), Ancho desktop px.
- **Copyright** (texto) — pie de página.

### 4.2 Site Settings → SEO & Metadata (global, afecta todo el sitio)

- siteName, defaultMetaTitle, defaultMetaDescription, Imagen OG por defecto, twitterHandle.
- Contacto fallback: Email por defecto, WhatsApp por defecto.
- Theme defaults: marca primaria (Caracol Next azul / Ditu violeta).

### 4.3 Representantes del Home

Salen del **Botón flotante de contacto** (ver §7), filtrados por "Mostrar en Home".

---

## 5. PÁGINA CARACOL NEXT (`/caracol-next`) — bloques en orden

Orden real de los bloques en el Layout:

1. **Hero** (`hero`) — encabezado principal.
   - Eyebrow, Título línea 1 (Regular), Título línea 2 (Bold), Subtítulo/Tagline.
   - **Métricas destacadas** (array): Valor, Prefijo, Sufijo, Label, Hint.
   - Imagen de fondo (opcional), Video de fondo (opcional, mp4 ≤ 8MB).
   - **Fila de íconos de marca** (array): cada uno elige una **Marca** (relación) + ícono.
   - CTA primario, CTA secundario (opcional), Tono visual (select).

2. **Audiencia + Redes** (`audience-networks`).
   - **Audiencia (grupo):** Alcance total (número), Etiqueta del alcance, Sufijo, **Fuente del alcance**,
     **Desglose** (array: label/valor/sufijo).
   - **Sección de redes (grupo):** Título de la sección, Texto tras el total de seguidores,
     Etiqueta bajo cada red, Fuente de redes.
   - **Redes sociales** (array): red (select), handle, seguidores (número), crecimiento, url.
   - Red destacada (slug).

3. **Marcas (tabs)** (`brand-tabs`) — el bloque estrella.
   - **Tabs por marca** (array). Cada tab:
     - **Marca** (relación a Brands), Nombre a mostrar (override), Logo de la marca, Color brand (hex),
       Tagline, "Por qué elegir esta marca" (rich text).
     - **WEB — métricas** (grupo): usuarios/mes, label, vistas/mes, label.
     - **Audiencia** (grupo): reach + label + sufijo, **Puntos destacados** (array),
       **Pie de género** (grupo: % mujeres, labels), **Bar chart Edad Pico** (array: rango/valor/¿es pico?),
       Texto de pico.
     - **Redes específicas** (array), **Formatos de pauta** (array), **CTA de contacto** (grupo).
   - **Tab activo por defecto** (número, índice 0-based).

4. **Momentos clave / Calendario** (`key-moments`).
   - **Eventos** (array): nombre, fecha inicio/fin, etiqueta de fecha (override), descripción, imagen,
     importancia (Crítico/Alto/Medio), categoría (select), **color de badge (hex)**, etiqueta de categoría, CTA.
   - Modo de visualización (Grid / Timeline / Lista).
   - **CTA del bloque** (grupo): heading, descripción, label, href.

5. **Branded Content** (`branded-content`).
   - **Multimedia principal:** tipo (**YouTube embed** / Imagen / Video MP4 propio), **URL del video YouTube**,
     imagen, video, tag inferior, título overlay, logos overlay (left/right).
   - **Categorías principales (tabs)** (array): key, label, heading, descripción, multimedia,
     **Secondary tabs** (array que cambian solo el multimedia).

6. **Formatos de pauta** (`ad-formats`).
   - **Formatos** (array): nombre, **Marca** (relación), categoría (select), imagen, specs (rich text),
     URL del briefing/PDF, **Modal** (grupo: título, descripción, CTA, **sub-tabs** con imagen/descripción).
   - Modo de visualización (Grid/Tabla/Acordeón/Tabs verticales), filtros por marca/categoría,
     **CTA inferior** (grupo).

7. **Contacto** (`contact`).
   - Heading énfasis, Botón CTA, **Formulario asociado** (relación), **Representantes comerciales**
     (array: nombre/rol/email/whatsapp/foto), Layout (5 variantes).

---

## 6. PÁGINA DITU (`/ditu`) — bloques en orden

1. **Ditu Hero** (`ditu-hero`).
   - Texto del sticker, Heading línea 1, línea 2, línea accent (cyan), Descripción.
   - **Botones de acción** (array): etiqueta, URL, ícono (key estático: Google Play/App Store/TV-Web),
     ícono (Media override).

2. **Ditu Video** (`ditu-video`) — primera instancia.
   - 🟡 **URL de YouTube**: pegás el link de YouTube y el sitio **genera el embed automáticamente**
     (extrae el ID solo). Acepta `watch?v=`, `youtu.be/`, `shorts/`, `embed/`. Si se deja vacío,
     se muestra solo la imagen.
   - **Imagen (poster / fallback)**: si hay URL, es la portada antes de reproducir; si no, se muestra sola.
   - Alt text, Background CSS (gradiente/color).

3. **Ditu Audiencia** (`ditu-audiencia`).
   - Sticker, **Titular** (grupo: antes / acento cyan / después).
   - **Stat cards** (array): label, valor, descripción, ícono, ¿grande?
   - **Watch time** (grupo): etiqueta, valor (ej. "60 MIN"), descripción.
   - **Watch time por dispositivo** (array): label, minutos, ícono (Smart TV/Mobile/Tablet/Web).
   - Fuente (superior), Titular seguidores (ej. "+1.7M"), Texto junto al titular, Subtítulo seguidores.
   - **Redes sociales** (array): red, seguidores, href. Etiqueta bajo cada red. Fuente (inferior).

4. **Ditu ADN** (`ditu-adn`).
   - Sticker, **Titular** (grupo: acento cyan / resto).
   - **Card Género** (grupo: etiqueta, subtítulo, etiqueta Hombres, etiqueta Mujeres).
   - **% Hombres** (número — el % Mujeres se calcula solo como 100 − este valor).
   - **Card Edad pico** (grupo: etiqueta, texto del pico). **Barras de edad** (array: rango, altura, ¿es pico?).
   - **Segundo titular NSE** (grupo: línea 1 / línea 2 cyan), Descripción NSE.
   - **Tarjetas NSE** (array: etiqueta, porcentaje — la de mayor % se resalta sola). Fuente.

5. **Ditu Tipo de Contenido** (`ditu-tipo-contenido`).
   - **Tabs de contenido** (array): nombre del tab (ej. FAST), descripción.

6. **Ditu Canales** (`ditu-canales`).
   - **Canales EN VIVO** / **Canales FAST** / **Canales Aliados** (3 arrays): cada canal con nombre + logo.

7. **Ditu Calendario** (`ditu-calendario`).
   - Sticker, Titular, Subtítulo.
   - **Eventos del calendario** (array): 🟡 Fecha (texto libre, ej. "DEL 06 DE MARZO AL 04 DE MAYO"),
     🟡 Fecha inicio ISO (`AAAA-MM-DD`), 🟡 Fecha fin ISO, Título, Subtítulo, Categoría,
     🟡 **Color del badge (hex)** — cualquier color; el texto del badge se ajusta solo a claro/oscuro.
   - **CTA** (grupo): texto negrita, texto normal, etiqueta botón, link botón.
   - **Comportamiento:** se muestran **TODOS** los eventos cargados **en el orden del admin** (arrastrá
     para reordenar). No se filtran por fecha.

8. **Ditu Video** (`ditu-video`) — segunda instancia (mismos campos que la #2).

9. **Ditu Pauta** (`ditu-pauta`).
   - Sticker, **Titular** (grupo: línea 1, línea 2), Subtítulo, Sticker del sidebar.
   - **Categorías de pauta** (array): clave (select), nombre visible en sidebar,
     **Formatos** (array: mini tag, título, descripción, imagen preview).
   - **CTA** (grupo): texto negrita, texto normal, etiqueta botón, link botón.

10. **Ditu Hablamos** (`ditu-hablamos`).
    - Sticker, Heading línea 1, Heading línea 2 acento (cyan), Descripción, **CTA** (grupo: texto botón, destino).

---

## 7. Botón flotante de contacto (Global, transversal)

Aparece en las 3 superficies. Campos:

- **Mostrar botón flotante** (checkbox), **Texto del botón**, **Button Icon** (select: MessageCircle/PhoneCall/Sparkles/Mail).
- **Panel Heading**, **Panel Description**.
- **Representantes** (array). Cada representante:
  - Name (req.), Role, Email (req.), Whatsapp (req., formato `573001234567`), Photo (upload).
  - 🟡 **Mostrar en Home** / **Mostrar en Caracol Next** / **Mostrar en Ditu** (3 checkboxes).
    Con las 3 marcadas = **transversal** (aparece en todas). Desmarcá para dejar el contacto
    **independiente** de una landing (ej. solo Ditu).
- **Position** (select: esquina inferior derecha/izquierda).

---

## 8. Header y Footer (Globals, uno por landing)

**Header — Caracol Next** y **Header — Ditu** comparten campos:

- Logo, Logo dark, **Ítems del nav** (array: label + anchorId), **Botón CTA del header** (grupo:
  enabled, label, href, variante), Header sticky en scroll (checkbox).

**Footer — Caracol Next** y **Footer — Ditu** comparten campos:

- Logo, Tagline, **Columnas de links** (array: heading + links{label, href, abrir en nueva pestaña}),
  **Redes sociales** (array: red + url), Línea inferior (legales/copyright), Onda decorativa, Tono visual.
- (Footer Ditu agrega: encuentranosLabel.)

---

## 9. Colección Brands (Marcas) — catálogo editable

Las marcas del ecosistema (Caracol TV, Gol Caracol, etc.) son una **colección editable**.
Agregar/editar una marca acá la habilita en todos los bloques que usan marcas
(**Brand Tabs**, **Hero** íconos, **Ad Formats**, **IA de recomendación**).

Campos de cada marca:

- **Nombre**, 🟡 **Slug (identificador)** (kebab/minúsculas, ej. `caracoltv` — estable, no cambiar
  una vez publicado), **Color primario (hex)**, Color oscuro (hex), Color accent (hex),
  Color pico de gráfica (hex), **Logo de la marca** (upload).

**Para agregar una marca nueva:** Collections → Marcas → "Create New" → completar nombre, slug y colores.
Luego, en el bloque donde la quieras, seleccionarla en el campo "Marca".

---

## 10. Otras colecciones

- **Categories** — name, slug, color. Taxonomía reutilizable.
- **Media** — biblioteca de imágenes (alt, credit). Recomendado siempre poner Alt text.
- **Users** — usuarios del admin (name, role: Admin/Editor). 🟡 Manejar con cuidado.

---

## 11. Comportamientos especiales que el manual DEBE destacar

1. **Marcas = colección editable.** Para sumar una marca no se toca código: se crea en
   Collections → Marcas y aparece en los selectores de marca de los bloques.
2. **Videos de Ditu por URL de YouTube.** En los 2 bloques "Ditu Video", pegar el link de YouTube
   genera el embed automáticamente. La imagen queda como portada/fallback.
3. **Branded Content** también soporta YouTube (campo "URL del video YouTube" con tipo "YouTube embed").
4. **Color de badge libre (hex)** en el calendario de Ditu (y en Momentos clave de Caracol Next):
   se escribe cualquier `#RRGGBB`; el texto del badge se ajusta solo a claro u oscuro.
5. **Calendario Ditu muestra todos los eventos en el orden del admin** (sin filtrar por fecha).
   Reordenar = arrastrar las filas del array de eventos.
6. **Representantes del botón flotante por landing**: 3 checkboxes por representante para elegir
   en qué superficies aparece (transversal o independiente).
7. **Fechas en formato ISO** (`AAAA-MM-DD`) en los campos que lo pidan.
8. **Colores en HEX** (`#RRGGBB`) en los campos de color.
9. **Publicar para que se vea**: en Páginas, los cambios requieren "Publish changes".

---

## 12. Tareas comunes que el manual debe cubrir (recetario paso a paso)

Para cada una, escribí los pasos numerados:

- Iniciar sesión en el admin.
- Editar un texto de una sección de Ditu o Caracol Next (entrar a la Página → expandir el bloque →
  cambiar el campo → Publicar).
- Agregar / quitar / reordenar un evento del calendario de Ditu.
- Cambiar el color de un badge de evento (hex).
- Poner un video de YouTube en un bloque "Ditu Video".
- Cambiar las métricas/porcentajes de Ditu Audiencia o Ditu ADN.
- Agregar una marca nueva (colección Marcas) y usarla en un tab.
- Cambiar el color o el logo de una marca.
- Agregar un representante de contacto solo para Ditu (desmarcando Home y Caracol Next).
- Editar el contenido del Home (Site Settings → Home Content).
- Cambiar el menú o el CTA del header de una landing.
- Cambiar links/redes/legales del footer.
- Subir una imagen a la biblioteca y reutilizarla.
- Ver el historial de versiones de una página y restaurar una anterior.
- Cambiar el SEO/meta por defecto (Site Settings → SEO).

---

## 13. Buenas prácticas y advertencias (para una sección final del manual)

- 🟡 Siempre **Publicar** después de editar una Página (sino el cambio no sale).
- 🟡 No cambiar **Slug** ni **Landing** de páginas existentes.
- 🟡 No cambiar el **Slug** de una marca ya publicada.
- Completar **Alt text** al subir imágenes.
- Respetar formatos: **HEX** (`#RRGGBB`) para colores, **ISO** (`AAAA-MM-DD`) para fechas.
- Usar **Save Draft** para trabajar sin publicar y revisar antes de salir al aire.
- Ante la duda, **Versions** permite volver atrás.

---

### Nota técnica (no incluir en el manual del cliente)

Inventario tomado del código actual del repo (`src/blocks/*/config.ts`, `src/globals/*`,
`src/collections/*`). Si se agregan bloques o campos nuevos, actualizar este briefing antes de
regenerar el manual. El Home se arma desde `Site Settings → Home Content`; las landings desde el
Page Builder de la colección Páginas.
