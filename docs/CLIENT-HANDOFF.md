# Caracol Next + Ditu — Guía del editor

Este sitio se edita 100% desde un panel web. **No necesitás tocar código ni esperar a un desarrollador para cambiar textos, imágenes, cifras o representantes de contacto.**

## 1. Acceder al admin

1. Abrí `https://<tu-dominio>/admin` en el navegador.
2. Email: el que Nivelics te entregó (ej. `editor@caracoltv.com.co`).
3. Password: el temporal que recibiste. **Cambialo en tu primer login** desde `/admin/account → Change Password`.
4. Si te equivocás 5 veces seguidas tu cuenta queda bloqueada 1 hora — pedinos reset si pasa.

### Política de password

- Mínimo 12 caracteres.
- Al menos una mayúscula, un número y un símbolo.
- Ejemplo válido: `CaracolBrand2026!`

### Token de sesión

Cada sesión expira a las **2 horas** en producción (por seguridad). Tras eso, te pide login de nuevo.

## 2. Estructura del sitio

El sitio tiene **3 landings públicas** + **8 secciones editables** en el admin:

| URL pública              | Qué editás desde admin                                                            |
| ------------------------ | --------------------------------------------------------------------------------- |
| `/` (Hub Caracol Medios) | `Página Hub (/)` + `Botón flotante de contacto` + `Site Settings`                 |
| `/caracol-next`          | `Pages → Caracol Next - home` + `Header — Caracol Next` + `Footer — Caracol Next` |
| `/ditu`                  | `Página Ditu (/ditu)` + `Header — Ditu` + `Footer — Ditu`                         |

El panel del admin agrupa todo en 2 secciones de la sidebar:

- **Contenido**: páginas, globals de página (Hub, Ditu), media (imágenes), categories.
- **Configuración**: settings del site, headers, footers, floating contact, forms y submissions.

## 3. Ediciones comunes

### Cambiar un texto en el Hub

1. Sidebar → **Contenido → Página Hub (/)**.
2. Modificá el campo (ej. `Eyebrow` o el array `Heading principal (segmentos)`).
3. Click **Save**. Cambio reflejado en la home pública en menos de 5 segundos.

### Cambiar una métrica del Hub (`+16M usuarios`)

1. Sidebar → **Contenido → Página Hub (/) → Métricas (4 cards animadas)**.
2. Click en la card. Modificá `numericValue` (e.g. de `16` a `20`) y/o el `value` (display, e.g. `+20M`).
3. Save. El número anima desde 0 hasta el nuevo valor al cargar la home.

### Agregar un evento al calendario de Ditu

1. Sidebar → **Contenido → Página Ditu (/ditu) → Calendario (key moments) → Eventos**.
2. Click **Add Event**.
3. Rellenar: `Title`, `Subtitle`, `Date label` (texto mostrado), `Start date`, `End date`, `Category`, `Badge variant`.
4. Save.
5. El evento aparece en el slider de calendario; eventos con `End date < hoy` se ocultan automáticamente.

### Cambiar la foto de un representante de contacto

1. Subir la foto primero: sidebar → **Contenido → Media → Create New**. Drag-and-drop la imagen. Rellenar el campo `Alt` (obligatorio, descripción accesible). Save.
2. Sidebar → **Configuración → Botón flotante de contacto → Representantes**.
3. Click el representante. En el campo `Photo`, click "Select existing" y elegí la imagen recién subida.
4. Save.

### Cambiar el logo del header de Caracol Next

1. Subir el nuevo logo a Media (mismo flujo de arriba).
2. Sidebar → **Configuración → Header — Caracol Next → Logo**.
3. Select existing → elegí la imagen.
4. Save.

### Cambiar un texto del footer

1. Sidebar → **Configuración → Footer — Caracol Next** (o `Footer — Ditu`).
2. Modificá `Tagline`, columnas, social links, o `Bottom line`.
3. Save.

### Agregar una nueva sub-página

1. Sidebar → **Contenido → Páginas → Create New**.
2. Rellenar:
   - `Title`: visible en la lista del admin.
   - `Landing`: `Caracol Next` o `Ditu`.
   - `Slug`: kebab-case, único por landing (ej. `casos-de-exito`).
   - `Layout`: arrastrar blocks desde la barra para componer la página.
3. Guardar como `Draft` para preview, o `Published` para publicar.
4. URL pública: `/{landing}/{slug}`. Ejemplo: `/caracol-next/casos-de-exito`.

### Activar maintenance mode (sitio fuera de servicio)

> **Usar con cuidado** — el sitio público entero queda oculto.

1. Sidebar → **Configuración → Site Settings → Mantenimiento**.
2. Toggle `Activar`. Editá el `Mensaje` que verán los visitantes.
3. Save.
4. Las 3 landings muestran la página de mantenimiento en menos de 5 segundos.
5. Para volver al sitio normal: toggle off y Save.

El admin **NO** se ve afectado por el toggle — siempre podés acceder.

## 4. Imágenes — buenas prácticas

- **Alt text es obligatorio**. Describí en una frase qué muestra la imagen (ej. "Logo Caracol TV en blanco sobre fondo navy"). Esto mejora accesibilidad y SEO.
- **Formatos aceptados**: JPG, PNG, WebP, GIF, SVG, MP4, WebM, PDF.
- **Tamaño máximo**: 10 MB por archivo.
- **SVGs con scripts internos son rechazados** por seguridad.
- El sistema procesa automáticamente versiones para móvil/tablet/desktop. Subí la versión de mayor calidad disponible.
- Las imágenes son inmutables: una vez subidas, la URL cambia si reemplazás el archivo.

## 5. Drafts y versionado

Las **Pages** soportan drafts (las landings Hub y Ditu, al ser Globals, no — todo cambio se publica inmediatamente al guardar).

- Para una Page: guardá como `Draft` para iterar sin publicar.
- Al guardar como `Published`, la página se sirve a los usuarios.
- Cada page guarda hasta 20 versiones. Podés revertir a una versión anterior desde el botón "Versions" en la esquina superior derecha del editor de Page.

## 6. Formularios

El sitio tiene un sistema de formularios genérico. Para agregar un form al ContactBlock:

1. Sidebar → **Configuración → Forms → Create New**.
2. Definí los campos (text, email, textarea, select, checkbox, message).
3. Save.
4. Sidebar → **Contenido → Páginas → (la page que use ContactBlock)**.
5. En el block `Contact` del layout, asignar el form creado en el campo `Form`.
6. Save.

Las submissions se guardan en **Configuración → Form Submissions** (solo admins pueden leerlas — contienen datos personales).

### Anti-spam

El sistema descarta automáticamente submissions que llegan con un campo invisible relleno (honeypot). No hace falta acción de tu parte.

## 7. Cuándo necesitás llamar a Nivelics

Estas son cosas que **no podés hacer desde admin**, requieren commit + deploy:

- Cambiar el diseño visual (colores de marca, tipografías, layout de un block).
- Agregar un nuevo tipo de block (e.g. un "carrusel de testimonios").
- Cambiar el sistema de URL (e.g. mover `/caracol-next` a `/cnxt`).
- Agregar funcionalidad nueva (e.g. login social, comentarios).
- Subir iconos al design system (los iconos `/ditu/icon-*.svg`, `/home/icon-*.svg` viven en el código).
- Integrar APIs externas nuevas (e.g. Mailchimp, HubSpot).

Para todo eso, abrí un ticket con Nivelics (`camilo.villanueva@nivelics.com`).

## 8. Soporte y emergencias

- **Bug bloqueante** (sitio caído, admin no carga, data corrupta): email a `camilo.villanueva@nivelics.com` con `[CARACOL-URGENT]` en el asunto.
- **Bug no-bloqueante** (un texto se ve mal, una imagen no carga, etc.): mismo email, sin URGENT.
- **Solicitud de feature**: mismo email con `[FEATURE]`.

Horario de respuesta: lunes a viernes 9-18h COT. Bugs URGENT respondemos en 2h hábiles.

---

**Bienvenido al admin. Editá con confianza — todo cambio se guarda con historial y podés revertir.**
