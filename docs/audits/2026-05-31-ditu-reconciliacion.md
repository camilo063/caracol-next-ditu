# Reconciliación Ditu (/ditu) vs Figma 548:3733 — 2026-05-31

Referencia Figma: `fileKey = xorK9SgP6likPV59r58dYt`, nodo raíz `548:3733` (frame "Ditu").  
Body principal: `512:2245` ("Body"), `1440 × 11080 px` (12 012 px incluyendo header/overlay).  
Metodología: `get_metadata(548:3733)` → HTML check en `localhost:3000/ditu` → lectura de código.

---

## 1. Estructura Figma — secciones de nivel superior (verticales, de arriba a abajo)

| #     | Nombre Figma                  | nodeId       | y           | h (px)  | Tipo                       |
| ----- | ----------------------------- | ------------ | ----------- | ------- | -------------------------- |
| —     | Header                        | 722:2582     | 0           | 64      | instance (overlay fijo)    |
| 1     | Hero                          | 512:2246     | 0           | 842     | frame                      |
| 2     | Video (primera aparición)     | 512:2244     | 840         | 809     | frame                      |
| 3     | Audiencia (macro-sección)     | 512:2243     | 1 647       | 3 255   | frame                      |
| 3a    | └─ Audiencia stats            | 512:5929     | 0 (rel)     | 1 688   | frame                      |
| 3b    | └─ ADN / demographics         | 747:2597     | 1 736 (abs) | 1 519   | frame                      |
| 4     | Tipo de contenido             | 750:3361     | 4 901       | 1 078   | instance                   |
| 5     | Nuestros canales              | 756:7691     | 5 977       | 1 104   | instance                   |
| 6     | Calendario                    | 760:9836     | 7 079       | 1 061   | frame                      |
| **7** | **Video (segunda aparición)** | **857:3974** | **8 139**   | **809** | **frame**                  |
| 8     | Pauta                         | 760:9793     | 8 946       | 2 053   | instance (master 892:6463) |
| 9     | Hablamos (¿Hablamos?)         | 541:7925     | 10 997      | 896     | frame                      |
| 10    | Footer                        | 541:7935     | 11 892      | 120     | instance                   |
| —     | Scrolling Counter Animation   | 717:3893     | 0           | 42      | frame (decorativo)         |
| —     | Menu open                     | 775:4636     | overlay     | 88      | instance (overlay UI)      |

---

## 2. Tabla de reconciliación — sección por sección

| Sección Figma (nodeId)                 | Componente en código                | Montado en page.tsx | Renderiza en /ditu | Estado               |
| -------------------------------------- | ----------------------------------- | ------------------- | ------------------ | -------------------- |
| Hero (`512:2246`)                      | `DituHero`                          | ✅                  | ✅                 | **OK**               |
| Video 1 (`512:2244`)                   | `DituVideoBlock` (`Figma 512:2244`) | ✅                  | ✅                 | **OK**               |
| Audiencia stats (`512:5929`)           | `DituAudienciaBlock`                | ✅                  | ✅                 | **OK**               |
| ADN/demographics (`747:2597`)          | `DituAdnBlock`                      | ✅                  | ✅                 | **DIVERGE** (ver §4) |
| Tipo de contenido (`750:3361`)         | `DituTipoContenidoBlock`            | ✅                  | ✅                 | **OK**               |
| Nuestros canales (`756:7691`)          | `DituCanalesBlock`                  | ✅                  | ✅                 | **OK**               |
| Calendario (`760:9836`)                | `DituCalendarioBlock`               | ✅                  | ✅                 | **OK**               |
| **Video 2 (`857:3974`)**               | **ninguno**                         | ❌                  | ❌                 | **AUSENTE**          |
| Pauta (`760:9793` / master `892:6463`) | `DituPautaBlock`                    | ✅                  | ✅                 | **OK**               |
| Hablamos (`541:7925`)                  | `DituHablamosBlock`                 | ✅                  | ✅                 | **OK**               |
| Footer (`541:7935`)                    | `DituFooter`                        | ✅                  | ✅                 | **OK**               |

---

## 3. Nota sobre la sospecha "la página termina tras +1.7M seguidores"

**INCORRECTA.** La verificación por HTML (`curl localhost:3000/ditu`) confirma que TODOS los bloques — incluyendo ADN, Tipo de contenido, Canales, Calendario, Pauta, Hablamos y Footer — están presentes en el HTML renderizado. La impresión de que "termina" probablemente se debe a que las `RevealSection` (Framer Motion) mantienen los componentes en `opacity: 0, y: 24` hasta que el IntersectionObserver los anima al scroll, haciéndolos invisibles en una inspección estática.

---

## 4. AUSENTE — Video 2 (`857:3974`)

**Qué es:** Segundo bloque de video fullscreen, idéntico al primero (`512:2244`), posicionado en y=8 139 px — entre el bloque Calendario y el bloque Pauta.

**Contenido Figma:** Un `<rounded-rectangle>` llamado "image 15" (mismo nombre que en 512:2244), `1440 × 809 px`. El contenido visual es el mismo video/imagen hero de Ditu.

**Estado del componente:** `DituVideoBlock` (`ditu-video-block.tsx`, 91 líneas) ya existe e implementa este layout. Solo hay que montarlo una segunda vez en `page.tsx`, entre `DituCalendarioBlock` y `DituPautaBlock`.

**Acción necesaria:** Agregar `<DituVideoBlock />` (segundo) en `page.tsx` entre los dos bloques:

```tsx
<RevealSection>
  <DituCalendarioBlock />
</RevealSection>
{/* Video 2 — Figma 857:3974 */}
<RevealSection>
  <DituVideoBlock />
</RevealSection>
<RevealSection>
  <DituPautaBlock />
</RevealSection>
```

---

## 5. DIVERGE — Sub-elementos ausentes dentro de `DituAdnBlock` (747:2597)

El ADN block (747:2597) en el Figma contiene dos sub-elementos decorativos que NO están implementados en `ditu-adn.tsx`:

### 5a. Wave background — `738:3033` (Frame 14504)

| Campo                 | Valor                                                                               |
| --------------------- | ----------------------------------------------------------------------------------- |
| **Tipo**              | Frame decorativo (clip-path + vectores SVG)                                         |
| **Posición en Figma** | Dentro de `747:2597` ("Frame 14505"), y=0, h=233                                    |
| **Visual**            | "Ola" / transición ondulada entre la sección de stats (512:5929) y el contenido ADN |
| **En código**         | No hay ninguna referencia a `738:3033` ni a wave/clip-path en `ditu-adn.tsx`        |
| **Acción**            | Renderizar una transición SVG ondulada en el top del DituAdnBlock                   |

### 5b. Ditu custom icons — `512:2823`

| Campo                 | Valor                                                                              |
| --------------------- | ---------------------------------------------------------------------------------- |
| **Tipo**              | Instance de icono Ditu (probablemente el mascot/pato)                              |
| **Posición en Figma** | Dentro de `747:2626` ("Frame 14510"), x=1 327, y=790 — derecha del área NSE        |
| **Dimensiones**       | 180 × 203 px                                                                       |
| **En código**         | No hay ninguna referencia a `512:2823` ni a "ditu custom icons" en `ditu-adn.tsx`  |
| **Acción**            | Agregar elemento decorativo posicionado absolutamente en el área NSE del ADN block |

---

## 6. Sub-elementos mencionados — análisis y pertenencia

| nodeId     | Nombre Figma          | Pertenece a                  | Estado                                                               |
| ---------- | --------------------- | ---------------------------- | -------------------------------------------------------------------- |
| `738:3033` | Frame 14504 (wave bg) | ADN sub-section (`747:2597`) | DIVERGE — decorativo no implementado en `DituAdnBlock`               |
| `512:2823` | ditu custom icons     | ADN sub-section (`747:2626`) | DIVERGE — ícono no implementado en `DituAdnBlock`                    |
| `750:3361` | Tipo de contenido     | Sección top-level            | OK — `DituTipoContenidoBlock` montado y renderiza                    |
| `756:7691` | Nuestros canales      | Sección top-level            | OK — `DituCanalesBlock` montado y renderiza                          |
| `833:3850` | PatoDitu 1 (mascot)   | Hablamos (`541:7925`)        | OK — mencionado e implementado en `DituHablamosBlock` (línea 18, 45) |

---

## 7. Clarificación: `756:7691` — ¿sección ausente o footer?

**`756:7691` = "Nuestros canales"** — una sección de CONTENIDO, no el footer.

| Aclaración                                         | Nodo correcto |
| -------------------------------------------------- | ------------- |
| **"Nuestros canales"** (channels section, y=5 977) | `756:7691`    |
| **Footer** (barra de copyright, y=11 892)          | `541:7935`    |

Si `756:7691` fue citado como "footer" en algún contexto anterior, fue un error de naming. En el Figma la instancia se llama explícitamente "Nuestros canales" y está implementada correctamente por `DituCanalesBlock`. El footer real (`541:7935`) está implementado por `DituFooter`.

Si `756:7691` fue citado como "frame ausente", también es incorrecto: el HTML check confirma `DituCanalesBlock` está presente (`CanalesBlock: FOUND`).

---

## 8. `ditu-mascot.tsx` — componente sin montado directo

El archivo `ditu-mascot.tsx` (46 líneas) existe en `src/components/marketing/` pero NO está importado directamente en `page.tsx`. Probable uso: importado internamente por `DituHablamosBlock` (que menciona PatoDitu en líneas 18 y 45). Verificar si el import está dentro de ese componente o si el mascot se renderiza inline.

---

## 9. Resumen ejecutivo

| Estado         | Secciones                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ✅ OK (10)     | Hero, Video 1, Audiencia stats, Tipo de contenido, Nuestros canales, Calendario, Pauta, Hablamos, Footer + ADN block (montado) |
| ⚠️ DIVERGE (1) | ADN block (`747:2597`) — montado pero sin wave bg `738:3033` ni icon `512:2823`                                                |
| ❌ AUSENTE (1) | **Video 2** (`857:3974`) — ningún componente montado entre Calendario y Pauta                                                  |

**Único bloque verdaderamente ausente: Video 2 (`857:3974`).** Se resuelve con un segundo `<DituVideoBlock />` en `page.tsx`.
