# FALP Slide Design System

> **Versión:** 1.2.1 · **Fecha:** 2026-05-18
> **Scope:** Generación programática de slides PPTX con identidad FALP
> **Canvas:** 1280 × 720 px (16:9) · **Grid base:** 4 px

---

## 1. Overview

Este documento es la **fuente normativa de diseño** para el sistema de slides FALP. Define la intención visual, los tokens autorizados, los componentes reutilizables y las reglas de composición.

**Audiencia:**
- Agentes AI: usan esta spec para modificar slides sin inventar identidad visual, paths ni geometría.
- Humanos: entienden la arquitectura del sistema, sus límites actuales y las reglas de composición.

**Principio operativo:** la fuente normativa es este documento; la fuente ejecutable es `theme.mjs` y los módulos `slide-*.mjs`. Si hay diferencia entre ambos, no se asume: se corrige el documento o se corrige la implementación y se regenera el deck.

### 1.1 Fuentes de Verdad y Precedencia

| Nivel | Fuente | Rol | Regla |
|-------|--------|-----|-------|
| Marca oficial | `outputs/falp-brand/` | Manuales, color, tipografía y logos FALP | Gana ante cualquier discrepancia de identidad visual. |
| Design system normativo | `docs/design/design.md` | Tokens, reglas, blueprints y límites | Debe reflejar el estado aprobado y guiar nuevos cambios. |
| Implementación ejecutable | `outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/slides/theme.mjs` + `slide-*.mjs` | Código que genera el PPTX real | Gana para verificar el estado actual renderizado. |
| Validación | `layout/*.layout.json`, `preview/*.png`, `preview/contact-sheet-runtime.png` | Evidencia visual y geométrica | Ningún cambio se considera correcto sin preview + layout QA. |
| Skills operativas | `skills/falp-presentation-format/SKILL.md`, `skills/falp-presentation-workflow/SKILL.md` | Activación y workflow para agentes | Deben apuntar a este documento, no duplicar la spec. |

### 1.2 Estado de Implementación

El deck actual es híbrido:

- `theme.mjs` contiene los tokens principales y helpers reutilizables.
- `slide-03` a `slide-06` consumen helpers, pero también contienen composición directa con `ctx.addShape` / `ctx.addText`.
- `slide-01` y `slide-02` son layouts custom con valores directos porque funcionan como portada y divisor de capítulo.
- Los colores derivados están documentados aquí; si un color derivado se reutiliza en más de una slide, debe promoverse a token exportado en `theme.mjs` antes de crear nuevos slides.

Por lo tanto, la regla correcta no es “no existen valores crudos”, sino: **no introducir nuevos valores crudos sin registrarlos en esta spec y, si son reutilizables, en `theme.mjs`.**

### 1.3 Quick Start para Agentes

Antes de editar una slide FALP, ejecutar mentalmente este checklist:

1. **Leer esta spec**: `docs/design/design.md`.
2. **Localizar workspace activo**: `outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/`.
3. **Editar fuente, no PPTX directo**: modificar `slides/theme.mjs` o `slides/slide-*.mjs`.
4. **Si el cambio se repite**: crear/ajustar helper en `theme.mjs`.
5. **Si el cambio es único**: permitir primitiva directa, pero registrar color/geometría si queda como patrón.
6. **Rebuild obligatorio**: regenerar PPTX, previews, layout JSON y contact sheet.
7. **QA obligatorio**: layout QA con `--min-gap 12` y revisión visual de PNG/contact sheet.
8. **Reportar paths absolutos**: PPTX, preview afectado, contact sheet y resultado QA.

### 1.3.1 Bootstrap obligatorio para decks nuevos

Cuando un agente cree una **nueva presentación FALP** o agregue una **slide nueva** a un deck:

1. **Mapear la slide a un blueprint existente** antes de tocar coordenadas:
   - portada
   - section divider
   - tipo A / producto
   - tipo B / arquitectura
   - tipo C / scope
   - tipo D / roadmap
   - alineamiento institucional con experto externo
2. **Declarar el proof object dominante** de la slide.
3. **Declarar el reading order** esperado si hay múltiples cards/rutas/capas.
4. **Usar layout custom sólo por excepción**:
   - si ningún blueprint calza,
   - documentar por qué,
   - y tratar esa slide como excepción, no como patrón base.

**Regla:** no arrancar un deck FALP desde composición libre “a ojo” para después normalizarlo con parches. Primero blueprint, después geometría.

### 1.4 Definición de Done

Un cambio de diseño FALP está terminado sólo si cumple todo esto:

- La modificación vive en `theme.mjs` o en el `slide-*.mjs` correcto.
- El PPTX en `output/falp-desarrollo-placeholders-v1.pptx` fue regenerado.
- El preview PNG de la slide afectada fue revisado visualmente.
- `check_layout_quality.mjs --min-gap 12` retorna `0 error(s), 0 warning(s)` o se documenta explícitamente la excepción.
- No se introdujo copy clínico/institucional real sin aprobación del usuario.
- No se introdujeron nuevos paths fantasma ni referencias a docs inexistentes.

---

## 2. Fuentes Normativas de Marca

La identidad visual FALP está definida en los siguientes documentos oficiales. Este sistema **referencia** esa marca, no la redefine.

| Asset | Ubicación relativa al repo | Contenido |
|-------|---------------------------|-----------|
| Manual de marca | `outputs/falp-brand/MANUAL-DE-NORMAS-FALP-25-B.pdf` | Normas completas |
| Paleta | `outputs/falp-brand/5Colores.pdf` | Colores oficiales |
| Tipografía | `outputs/falp-brand/6Tipografias.pdf` | Fuentes oficiales |
| Logo (vector) | `outputs/falp-brand/logo-falp.svg` | Logo principal |
| Logo (horizontal) | `outputs/falp-brand/logo_falp_h.svg` | Variante horizontal |
| Logo (transparente) | `outputs/falp-brand/falp-logo-transparent-cropped.png` | Para slides sobre fondos claros |
| Logo (clean alpha) | `outputs/falp-brand/falp-logo-chatgpt-clean-alpha.png` | Para medallones/fondos controlados |
| Manual web | `outputs/falp-brand/manual-de-marca-falp.html` | Versión HTML interactiva |

**Repo root esperado:** `/Users/felipe_gonzalez/Developer/tqt_app`. Las rutas anteriores son relativas a ese root; no deben interpretarse relativas a `docs/design/`.

**Regla:** Si hay conflicto entre este documento y el manual de marca FALP, el manual gana.

---

## 3. Design Tokens

### 3.1 Paleta de Color

#### Tokens Primarios

```javascript
const TOKENS = {
  blue:   '#004990',   // Color institucional principal
  yellow: '#F5C300',   // Acento institucional
  cyan:   '#009FE3',   // Acento técnico / conectores
  white:  '#FFFFFF',   // Fondos de card, texto inverso
  bg:     '#F5F9FD',   // Fondo base de slide
  panel:  '#FFFFFF',   // Fondo de cards/paneles
  mist:   '#EAF2FA',   // Fondo suave para áreas secundarias
  line:   '#D7E4EF',   // Líneas separadoras, bordes
  text:   '#12385F',   // Texto principal
  text2:  '#6B7C93',   // Texto secundario
  text3:  '#8A9AAF',   // Texto metadata / labels
};
```

| Token | Hex | RGB | Uso principal |
|-------|-----|-----|---------------|
| `blue` | `#004990` | 0, 73, 144 | Color institucional. Headers, lanes, accents principales |
| `yellow` | `#F5C300` | 245, 195, 0 | Acento institucional. Dividers, markers, decision gates |
| `cyan` | `#009FE3` | 0, 159, 227 | Acento técnico. Conectores, callouts, nodos core |
| `white` | `#FFFFFF` | 255, 255, 255 | Fondos de card, texto inverso |
| `bg` | `#F5F9FD` | 245, 249, 253 | Fondo base de slide |
| `panel` | `#FFFFFF` | 255, 255, 255 | Fondo de cards y paneles |
| `mist` | `#EAF2FA` | 234, 242, 250 | Fondo suave secundario |
| `line` | `#D7E4EF` | 215, 228, 239 | Bordes, separadores, hairlines |
| `text` | `#12385F` | 18, 56, 95 | Texto principal (headings, títulos) |
| `text2` | `#6B7C93` | 107, 124, 147 | Texto secundario (body, descripciones) |
| `text3` | `#8A9AAF` | 138, 154, 175 | Texto metadata (labels, eyebrows) |

#### Colores Derivados

Los siguientes colores ya existen en slides actuales. Son válidos para mantener compatibilidad visual, pero no todos están exportados como `TOKENS` en `theme.mjs`. Para nuevas composiciones reutilizables, primero promoverlos a tokens nombrados en `theme.mjs` y luego usarlos desde helpers.

| Nombre | Hex | RGB | Uso |
|--------|-----|-----|-----|
| Soft blue circle outer | `#255C98` | 37, 92, 152 | Círculo decorativo exterior (section divider) |
| Soft blue fill | `#EFF6FB` | 239, 246, 251 | Círculo decorativo portada |
| Tint cyan | `#E8F8FB` | 232, 248, 251 | Barras suaves, pills, rows |
| Tint yellow | `#FFF3CC` | 255, 243, 204 | Barras suaves, badges de riesgo |
| Tint yellow warm | `#FFFDF5` | 255, 253, 245 | Fondo decision gates amarillos, panels out-of-scope |
| Tint blue | `#F8FBFE` | 248, 251, 254 | Fondo lanes, rails, screens |
| Eyebrow on blue | `#DCE8F5` | 220, 232, 245 | Texto eyebrow sobre fondo azul |
| Body on blue | `#D7E8F8` | 215, 232, 248 | Texto body sobre fondo azul |
| Claim on blue | `#E8F0F8` | 232, 240, 248 | Texto claim sobre fondo azul |
| Dark text variant | `#30465F` | 48, 70, 95 | Texto alternativo portada |
| Gold text | `#6A4F00` | 106, 79, 0 | Texto sobre badge amarillo |

#### Tokens Derivados en `theme.mjs`

Los colores derivados reutilizables se exportan desde `TOKENS` con estos nombres:

| Token | Hex | Uso |
|-------|-----|-----|
| `softBlue` | `#EFF6FB` | Círculos y fondos suaves |
| `deepBlue` | `#255C98` | Círculos decorativos sobre azul |
| `tintCyan` | `#E8F8FB` | Pills, badges y fondos técnicos suaves |
| `tintYellow` | `#FFF3CC` | Riesgo, advertencia, badge amarillo suave |
| `tintYellowWarm` | `#FFFDF5` | Paneles/gates amarillos muy suaves |
| `tintBlue` | `#F8FBFE` | Lanes, rails, screens, insight panels |
| `eyebrowOnBlue` | `#DCE8F5` | Eyebrow sobre azul institucional |
| `bodyOnBlue` | `#D7E8F8` | Body copy sobre azul institucional |
| `claimOnBlue` | `#E8F0F8` | Claim/subtitle sobre azul institucional |
| `darkText` | `#30465F` | Texto alternativo de portada |
| `goldText` | `#6A4F00` | Texto sobre `tintYellow` |

### 3.2 Tipografía

```javascript
const FONTS = {
  title: 'Myriad Pro',  // Títulos, headings
  body:  'Myriad Pro',  // Body text
  meta:  'Calibri',     // Metadata, labels, page numbers
};
```

#### Escala Tipográfica Completa

| Rol | Size (px) | Weight | Fuente | Color token |
|-----|-----------|--------|--------|-------------|
| Chapter number hero | 68 | Bold | Myriad Pro | blue |
| Hero title (divider) | 58 | Bold | Myriad Pro | white |
| Hero title (portada) | 50 | Bold | Myriad Pro | white |
| Slide title (titleblock) | 38 | Bold | Myriad Pro | text |
| Body (section divider) | 22 | Regular | Myriad Pro | body on blue |
| Institution name | 24 | Bold | Myriad Pro | blue |
| Subtitle brand | 24 | Bold | Myriad Pro | yellow |
| Body (titleblock) | 18 | Regular | Myriad Pro | text2 |
| Section title (chrome) | 18 | Bold | Myriad Pro | text |
| Subtitle claim | 18 | Regular | Myriad Pro | claim on blue |
| Card title | 20–22 | Bold | Myriad Pro | text |
| Diagram label | 20 | Bold | Myriad Pro | text |
| Timeline step title | 17 | Bold | Myriad Pro | text |
| Chapter label | 16 | Bold | Calibri | eyebrow on blue |
| Body (card) | 11–15 | Regular | Myriad Pro | text2 |
| Eyebrow (titleblock) | 14 | Bold | Calibri | cyan |
| Support line | 14 | Regular | Calibri | text |
| Eyebrow (chrome) | 12 | Bold | Calibri | text2 |
| Eyebrow (portada) | 15 | Bold | Myriad Pro | eyebrow on blue |
| Pill text | 13 | Bold | Calibri | text |
| Page number | 11–12 | Regular | Calibri | text3 |
| Eyebrow (callout/gate) | 9 | Bold | Calibri | text3 |
| Meta labels | 9–12 | Bold | Calibri | text3 |
| Arrow label | 8 | Bold | Calibri | text3 |

#### Alineaciones

| Contexto | Alineación | Nota |
|----------|------------|------|
| Títulos en columna izquierda | Left | x = 72 |
| Títulos en nodos/diagramas | Center | valign: mid |
| Institution name | Center | Sobre logo |
| Chapter number hero | Center | Dentro de círculo |
| Page number | Right | x = 1140 |

#### ⚠️ Reglas de Renderizado PptxGenJS (build.mjs)

Los valores tipográficos de esta spec están en **píxeles (px)**. PptxGenJS habla en **puntos (pt)**. La conversión es **px × 0.75 = pt** (porque 1px = 0.75pt a 96 DPI). El `build.mjs` aplica esta conversión automáticamente.

| Parámetro | Valor obligatorio | Razón |
|-----------|-------------------|-------|
| `fontSize` | `valor × 0.75` | Los valores en theme.mjs/slide-*.mjs están en px. PptxGenJS interpreta pt. Sin conversión, las fuentes salen 33% más grandes. Ej: `50` → `37.5pt` (equivale a 50px visuales). |
| `line.width` | `valor × 0.75` | Los valores de borde en theme.mjs están en px. PptxGenJS interpreta pt. Sin conversión, los bordes salen 33% más gruesos. `ctx.line(color, width)` aplica la conversión automáticamente — no pasar `line.width` directo. |
| `margin` | `[0, 0, 0, 0]` | PptxGenJS mete ~0.1in (~10px) de margen por default. En cajas de height:18 con fontSize:12, el texto exige 36px y se deforma. |
| `valign` | `'top'` (default) | PptxGenJS centra verticalmente por default (`middle`). El texto crece hacia arriba Y abajo, rompiendo baseline. |
| Coordenadas | `px ÷ 96` | PptxGenJS habla en pulgadas. 1280÷96 = 13.33in × 720÷96 = 7.5in = Widescreen 16:9 estándar. |

**Anti-patrón mortal:** pasar fontSize 1:1 sin la conversión `× 0.75`. Si el texto sale 33% más grande, falta la conversión. Si no cuadra en la caja, faltan márgenes 0 o valign top.

**Anti-patrón line.width:** pasar `lineWidth` directamente al objeto `line` de PptxGenJS sin `× 0.75`. Aplica a `addArrowConnector` (parámetro `lineWidth`) y a cualquier `ctx.addShape` con `line.width` manual. Usar siempre `ctx.line(color, widthInPx)` que aplica la conversión.

### 3.3 Espaciado y Geometría

#### Canvas y Zonas

| Zona | Rango (px) | Descripción |
|------|------------|-------------|
| Canvas completo | 0–1280 × 0–720 | Frame total |
| Top band | 0–18 y | Barra azul institucional |
| Chrome eyebrow | 42–60 y | Sección metadata |
| Chrome title | 62–84 y | Título de página |
| Chrome rule | 98 y | Separador horizontal |
| Content area | 126–640 y | Zona útil principal |
| Footer / page number | 680–698 y | Número de página |
| Margen izquierdo | 72 px | Todas las slides |
| Margen derecho | ~72 px implícito | 1280 - 72 = 1208 |

#### Valores de Espaciado

| Parámetro | Valor (px) | Nota |
|-----------|------------|------|
| Grid base | 4 | Todos los valores en múltiplos |
| Outer margin | 72 | Izquierdo, seguro |
| Card padding lateral | 24 | Dentro de cards |
| Card padding vertical | 18–20 | Dentro de cards |
| Accent bar width (lateral) | 5–6 | En cards, callouts, lanes |
| Accent bar width (top) | 8–10 | En scope panels, decision gates |
| Hairline | 1 | Separadores finos |
| Rule | 1–3 | Líneas de chrome, spine |
| Accent line | 6 | Footer accent, divider accent |
| Gap entre callouts | 20 | Mínimo (real: 132 px total con 112 height) |
| Gap entre cards | 20–30 | Dependiendo contexto |
| Pill height | 34 | Fijo |
| Marker dot | 9–10 | En callouts y nodos |
| Timeline marker | 36 × 36 | Elipse circular |
| Logo chrome | 110 × 30 | Esquina superior derecha |

---

## 4. Componentes del Design Kit

Cada componente se define con: descripción, firma, defaults geométricos, medidas internas exactas, variantes, y reglas de uso.

### 4.1 `addRoot`

**Descripción:** Fondo base de la slide. Rectángulo que cubre todo el canvas.

```
addRoot(slide, ctx, color = TOKENS.bg)
```

- **Default fill:** `TOKENS.bg` (#F5F9FD)
- **Override:** Pasar `TOKENS.blue` para slides de portada / section divider
- **Siempre es el primer elemento** de cualquier slide

---

### 4.2 `addChrome`

**Descripción:** Header institucional reutilizable. Banda azul superior + sección metadata + título + logo FALP + page number.

```
await addChrome(slide, ctx, { title, section, page })
```

**Parámetros:**

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| title | string | `'DESARROLLO TÉCNICO'` | Título de la página |
| section | string | `'FALP · MODELO SOCIAL'` | Eyebrow de sección |
| page | string | `''` | Número de página (esquina inferior derecha) |

**Coordenadas (extraído de layout JSON):**

| Elemento | left | top | width | height | fill/font |
|----------|------|-----|-------|--------|-----------|
| top-band | 0 | 0 | 1280 | 18 | blue |
| section-meta | 72 | 42 | 240 | 18 | Calibri 12 bold, text2 |
| page-title-mini | 72 | 62 | 420 | 22 | Myriad Pro 18 bold, text |
| rule-top | 72 | 98 | 1136 | 1 | line |
| logo | 1066 | 36 | 110 | 30 | image contain |
| page-number | 1140 | 680 | 48 | 18 | Calibri 11, text3 |

**Uso:** Toda slide de contenido (no portada, no section divider) lleva `addChrome`.

---

### 4.3 `addTitleBlock`

**Descripción:** Bloque de título con eyebrow, título principal, y body text opcional.

```
addTitleBlock(slide, ctx, { eyebrow, title, body, left, top, width })
```

**Defaults:** left=72, top=130, width=480

**Coordenadas internas (base: top param):**

| Elemento | Offset | Size | Font spec |
|----------|--------|------|-----------|
| eyebrow | +0 | width×20 | Calibri 14 bold, cyan |
| title | +28 | width×104 | Myriad Pro 38 bold, text |
| body | +140 | width×72 | Myriad Pro 18, text2 |

**Regla:** Usar en combinación con `addChrome` para slides de contenido.

---

### 4.4 `addCard`

**Descripción:** Card rectangular con barra de acento lateral izquierda.

```
addCard(slide, ctx, { left, top, width, height, title, body, accent, fill, meta })
```

**Defaults:** accent=`TOKENS.blue`, fill=`TOKENS.panel`, border=`TOKENS.line` 1px, accent bar=6px

**Layout interno:**

| Elemento | Offset desde top del card |
|----------|--------------------------|
| Meta label | +18 |
| Title | +42 |
| Body | +84 |

---

### 4.5 `addPill`

**Descripción:** Badge/píldora rectangular para tags y categorías.

```
addPill(slide, ctx, { text, left, top, width, accent, color })
```

**Defaults:** width=150, height=34, accent=`TOKENS.mist`, color=`TOKENS.text`

**Variantes:**

| Variante | accent fill | text color | Uso |
|----------|-------------|------------|-----|
| Default | mist | text | Categoría normal |
| Cyan | tint cyan | text | Dato técnico |
| Yellow/risk | #FFF3CC | #6A4F00 | Riesgo/advertencia |

**Regla:** Usar para labels cortos (1–3 palabras). No para body text.

---

### 4.6 `addCallout`

**Descripción:** Callout con dot decorativo, eyebrow, título y body. Para highlights y claims.

```
addCallout(slide, ctx, { left, top, width, height, eyebrow, title, body, accent, fill, name })
```

**Defaults:** accent=`TOKENS.cyan`, fill=`TOKENS.white`, accent bar=6px

**Coordenadas internas:**

| Sub-elemento | Offset desde top |
|--------------|-------------------|
| accent bar | 0, width=6, height=full |
| dot (ellipse) | +18 left, +18 top, 9×9 |
| eyebrow | +36 left, +14 top |
| title | +18 left, +36 top |
| body | +18 left, +64 top |

**Dimensiones típicas:** width=246, height=112. Gap entre callouts: 20px.

**Variantes de color:**

| Variante | accent | Uso |
|----------|--------|-----|
| Blue | blue | Claim principal |
| Cyan | cyan | Claim técnico |
| Yellow | yellow | Claim de riesgo |

**Regla:** Máximo 3 callouts verticales. En la implementación actual de slide 03 se usan 3 callouts de 112px con gaps de 20px.

---

### 4.7 `addDiagramBox`

**Descripción:** Caja de diagrama con borde de acento y label centrado.

```
addDiagramBox(slide, ctx, { left, top, width, height, label, fill, accent, small })
```

**Defaults:** fill=`TOKENS.panel`, accent=`TOKENS.blue`, border=1px

**Layout:**

| Elemento | Offset |
|----------|--------|
| Small label | +14 |
| Main label | +32, valign center |

---

### 4.8 `addConnector`

**Descripción:** Línea conectora horizontal o vertical.

```
addConnector(slide, ctx, { left, top, width, height, color, vertical })
```

**Defaults:** height=4, color=`TOKENS.cyan`, vertical=false

---

### 4.9 `addArrowConnector`

**Descripción:** Conector con flecha direccional usando LINE shape nativo PptxGenJS y label opcional.

```
addArrowConnector(slide, ctx, { left, top, width, height, direction, color, label, name })
```

**Parámetros:** direction=`'right'`|`'left'`|`'down'`|`'up'`, color=`TOKENS.cyan`

**Implementación:** `geometry: 'line'` nativo con `line: { endArrowType: 'triangle' }`. Shaft=2px, punta triangular renderizada por PptxGenJS (OOXML `<a:tailEnd type="triangle"/>`). Dirección `'down'`/`'up'` usa `flipV: true`/`flipH: true` según corresponda.

**Notas para agentes:**
- NO usar rectángulo + Unicode para flechas. El patrón anterior fue reemplazado.
- `endArrowType` otros valores disponibles: `'stealth'`, `'diamond'`, `'oval'`, `'open'`.
- Si se necesita `label`, se genera un `addText` centrado sobre el midpoint del conector.
- PptxGenJS muta option objects in-place; nunca reusar objects entre llamadas.

---

### 4.10 `addArchitectureLane`

**Descripción:** Lane horizontal para diagramas de arquitectura.

```
addArchitectureLane(slide, ctx, { left, top, width, height, label, fill, accent, name })
```

**Defaults:** fill=`#F8FBFE` (derived token: Tint blue), accent=`TOKENS.blue`, label band fill=`TOKENS.mist`

**Coordenadas internas:**

| Sub-elemento | Dimensiones |
|--------------|-------------|
| Panel | full width × height |
| Label band | 78px wide × full height |
| Accent bar | 5px wide × full height |
| Label text | +14 horizontal, valign center, 52px wide |

**Instancias reales (slide 04):**

| Lane | top | height | accent |
|------|-----|--------|--------|
| CANALES | 150 | 116 | blue |
| CORE | 282 | 130 | cyan |
| SOPORTE | 440 | 138 | yellow |

Gap entre lanes: 16–28 px.

---

### 4.11 `addArchitectureNode`

**Descripción:** Nodo individual dentro de una architecture lane.

```
addArchitectureNode(slide, ctx, { left, top, width, height, title, meta, body, accent, fill, name })
```

**Coordenadas internas:**

| Sub-elemento | Offset |
|--------------|--------|
| Marker (10×10 ellipse) | +14, +14 |
| Meta text | +32 horizontal, +10 vertical |
| Title | +16 horizontal, +32 vertical |
| Body | +16 horizontal, +56 vertical |

**Instancias reales (slide 04):**

| Nodo | left | top | width | height | accent |
|------|------|-----|-------|--------|--------|
| Canal 01 | 520 | 166 | 164 | 90 | blue |
| Canal 02 | 772 | 166 | 164 | 90 | blue |
| Core motor | 624 | 306 | 224 | 96 | cyan |
| Persistencia | 520 | 462 | 178 | 94 | yellow |
| Proveedor | 762 | 462 | 190 | 94 | yellow |

Gap horizontal entre nodos: ~88px. Nodos empiezan ~90px desde left de lane.

---

### 4.12 `addTimelineStep`

**Descripción:** Step de roadmap con marcador circular numerado flotante.

```
addTimelineStep(slide, ctx, { left, top, width, height, index, meta, title, body, accent, name })
```

**Coordenadas internas:**

| Sub-elemento | Posición |
|--------------|----------|
| Card | left, top, full dimensions |
| Marker (36×36 ellipse) | left+18, top-18 (flotante) |
| Index text | left+18, top-8 |
| Meta | left+70, top+18 |
| Title | left+20, top+42 |
| Body | left+20, top+78 |

**Instancias reales (slide 06):**

| Step | left | width | accent |
|------|------|-------|--------|
| Fase 01 | 420 | 206 | blue |
| Fase 02 | 666 | 206 | cyan |
| Fase 03 | 912 | 206 | yellow |

Step gap: 40px. Timeline spine: left=430, top=318, width=650, height=3.

**Regla:** El marker sobresale 18px por encima del card. Dejar espacio arriba.

---

### 4.13 `addDecisionGate`

**Descripción:** Banda de decisión con borde superior. Para marcar preguntas abiertas.

```
addDecisionGate(slide, ctx, { left, top, width, height, eyebrow, title, body, accent, fill, name })
```

**Coordenadas internas:**

| Sub-elemento | Posición |
|--------------|----------|
| Top rule | left, top, full width, 8px |
| Eyebrow | +18 horizontal, +22 vertical |
| Title | +18 horizontal, +44 vertical |
| Body | +18 horizontal, +76 vertical |

**Variantes:**

| Variante | accent | fill | Uso |
|----------|--------|------|-----|
| Default | yellow | #FFFDF5 | Decision gate estándar |
| Cyan | cyan | #F8FBFE | Gate técnico |
| Blue | blue | #F8FBFE | Gate subordinado |

---

### 4.14 `addScopePanel`

**Descripción:** Panel de scope con barra superior de acento y lista de items.

```
addScopePanel(slide, ctx, { left, top, width, height, meta, title, items, accent, fill, name })
```

**Coordenadas internas:**

| Sub-elemento | Posición |
|--------------|----------|
| Top accent bar | left, top, full width, 10px |
| Meta | +22 horizontal, +28 vertical |
| Title | +22 horizontal, +52 vertical |
| Items | +24 horizontal, +96 vertical |

**Variantes:**

| Variante | accent | fill | Uso |
|----------|--------|------|-----|
| In-scope | blue | white | Lo que sí |
| Out-of-scope | yellow | #FFFDF5 | Lo que no |

**Instancias reales (slide 05):**

| Panel | left | width | accent |
|-------|------|-------|--------|
| In-scope | 420 | 390 | blue |
| Out-of-scope | 884 | 280 | yellow |

---

### 4.15 Elementos Custom (sin helper)

**Portada (slide 01):**

| Elemento | left | top | width | height | fill |
|----------|------|-----|-------|--------|------|
| brand-column | 0 | 0 | 420 | 720 | blue |
| accent-divider | 420 | 0 | 16 | 720 | yellow |
| soft-circle (ellipse) | 760 | 58 | 438 | 438 | #EFF6FB |
| footer-accent | 72 | 620 | 210 | 6 | yellow |

**Section Divider (slide 02):**

| Elemento | left | top | width | height | fill |
|----------|------|-----|-------|--------|------|
| side-accent | 0 | 0 | 18 | 720 | yellow |
| circle (outer) | 646 | 76 | 500 | 500 | #255C98 |
| circle (inner) | 708 | 140 | 380 | 380 | #EAF2FA |
| hero-rule-yellow | 780 | 416 | 236 | 2 | yellow |

---

## 5. Resource Catalog para creación rápida

Estos recursos son helpers editables de segundo nivel. Usarlos cuando el patrón se repite o cuando acelera la creación de una slide nueva sin romper el lenguaje FALP.

### 5.1 `addSectionLabel`

**Uso:** etiqueta breve para nombrar una zona visual: `EVIDENCIA`, `CRITERIOS`, `SECUENCIA`, `RIESGO`.

```javascript
addSectionLabel(slide, ctx, { text: 'EVIDENCIA EDITABLE', left: 430, top: 126, rule: true });
```

**Reglas:** uppercase, 8-10 px, color `TOKENS.text3`; usar rule sólo si ayuda a agrupar. En diagramas de arquitectura, sirve para mover labels de conectores a una leyenda lateral y reducir ruido dentro del flujo.

### 5.2 `addIconBadge`

**Uso:** badge semántico pequeño sin depender de íconos raster. Sirve para categorías, estados o leyendas.

```javascript
addIconBadge(slide, ctx, { icon: '✓', label: 'Validado', left: 72, top: 560, accent: TOKENS.cyan });
```

**Reglas:** no usar como decoración suelta; debe explicar una categoría real del slide. En leyendas verticales, preferir badges sin `label` + una columna de texto separada para evitar warnings `split-inline` en layout QA. Si va dentro de una lane o panel, dejar al menos 12 px de padding inferior real.

### 5.3 `addMetricTile`

**Uso:** placeholder KPI/indicador cuando la slide necesita una señal cuantitativa editable sin datos finales.

```javascript
addMetricTile(slide, ctx, { value: '[00]', label: 'INDICADOR', context: 'Dato editable', left: 430, top: 160, width: 180 });
```

**Reglas:** valores placeholder entre brackets; no inventar métricas clínicas reales. Si se usa `context`, mantener altura mínima cercana a 106 px y configurar `contextHeight` compacto (18 px) para evitar descuadre visual contra el borde inferior.

### 5.4 `addComparisonRow`

**Uso:** comparación horizontal de criterio, antes/después, opción A/B o incluido/excluido.

```javascript
addComparisonRow(slide, ctx, { label: 'CRITERIO', before: '[Actual]', after: '[Objetivo]', left: 430, top: 220, width: 620 });
```

**Reglas:** máximo 4 filas por slide salvo layout dedicado; mantener labels cortos.

### 5.5 `addProcessCard`

**Uso:** pasos de proceso cuando el roadmap de `addTimelineStep` es demasiado pesado o no representa secuencia temporal.

```javascript
addProcessCard(slide, ctx, { index: '01', meta: 'PASO', title: '[Acción]', body: 'Dependencia editable', left: 430, top: 180, width: 220 });
```

**Reglas:** usar 3-4 cards por fila como máximo; si hay tiempo/fases, preferir `addTimelineStep`.

### 5.6 `addInsightPanel`

**Uso:** síntesis, aprendizaje, criterio o quote institucional placeholder.

```javascript
addInsightPanel(slide, ctx, { eyebrow: 'LECTURA', title: '[Aprendizaje clave]', body: 'Texto editable.', left: 430, top: 500, width: 560 });
```

**Reglas:** no usar para párrafos largos; mantener 1 idea principal.

### 5.7 `addEvidenceRail`

**Uso:** banda compacta para agrupar pills, evidencias o modos de uso.

```javascript
addEvidenceRail(slide, ctx, {
  label: 'RAIL DE PRUEBA PLACEHOLDER',
  left: 458,
  top: 520,
  width: 430,
  items: ['Modo paciente', 'Modo cuidador', { text: 'Dato editable', accent: TOKENS.tintCyan }],
});
```

**Reglas:** máximo 4 pills; si la evidencia necesita explicación, usar callouts o insight panel.

### 5.8 Resource board / sample slide

**Path ejecutable:** `outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/slides/slide-07.mjs`

**Preview:** `outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/preview/slide-07.png`

**Uso:** slide de referencia para ver juntos `addSectionLabel`, `addIconBadge`, `addMetricTile`, `addComparisonRow`, `addProcessCard`, `addInsightPanel`, `addEvidenceRail` y conectores sobrios.

**Reglas:** mantenerla como muestrario placeholder; no convertirla en slide de contenido final ni usarla para inventar métricas reales.

### 5.9 Anti-patrones del resource catalog

- No mezclar todos los recursos en una slide de contenido final: elegir un proof object dominante.
- No usar badges o arrows como ornamento.
- No crear métricas o evidencia real sin datos entregados por el usuario.
- Si un recurso empieza a necesitar muchas excepciones geométricas, crear una variante explícita en `theme.mjs`.
- No usar el resource board como punto de partida literal para slides reales; es banco de componentes, no template de composición final.

---

## 6. Patrones de Slide (Blueprints)

### 5.1 Portada

**No usa helpers.** Layout custom.

**Zonas:**
- Columna brand: 0–420 (azul + contenido)
- Divider: 420–436 (amarillo)
- Columna contenido: 436–1280 (blanco + logo + texto)

| Elemento | left | top | width | height | fill/font |
|----------|------|-----|-------|--------|-----------|
| bg-root | 0 | 0 | 1280 | 720 | white |
| brand-column | 0 | 0 | 420 | 720 | blue |
| accent-divider | 420 | 0 | 16 | 720 | yellow |
| soft-circle (ellipse) | 760 | 58 | 438 | 438 | #EFF6FB |
| eyebrow | 72 | 84 | 278 | 36 | Myriad 15 bold, #DCE8F5 |
| title | 72 | 186 | 296 | 248 | Myriad 50 bold, white |
| subtitle-brand | 72 | 502 | 176 | 28 | Myriad 24 bold, yellow |
| subtitle-claim | 72 | 540 | 250 | 52 | Myriad 18, #E8F0F8 |
| footer-accent | 72 | 620 | 210 | 6 | yellow |
| logo (image) | 700 | 168 | 420 | 156 | contain |
| institution-name | 650 | 378 | 520 | 34 | Myriad 24 bold, blue |
| institution-line-1 | 610 | 422 | 600 | 28 | Myriad 18, text2 |
| support-line | 648 | 490 | 520 | 22 | Calibri 14, text |
| accent-cyan-rule | 648 | 580 | 270 | 2 | cyan |
| year | 1092 | 612 | 78 | 22 | Calibri 14, text2 |

### 5.2 Section Divider

**Solo usa `addRoot` con blue.** Resto custom.

| Elemento | left | top | width | height | fill/font |
|----------|------|-----|-------|--------|-----------|
| bg-root | 0 | 0 | 1280 | 720 | blue |
| side-accent | 0 | 0 | 18 | 720 | yellow |
| chapter | 72 | 94 | 180 | 22 | Calibri 16 bold, #D7E8F8 |
| title | 72 | 148 | 420 | 156 | Myriad 58 bold, white |
| body | 72 | 340 | 420 | 82 | Myriad 22, #D7E8F8 |
| accent-line | 72 | 456 | 220 | 6 | yellow |
| circle (outer) | 646 | 76 | 500 | 500 | #255C98 |
| circle (inner) | 708 | 140 | 380 | 380 | #EAF2FA |
| logo (image) | 770 | 232 | 256 | 74 | contain |
| chapter-number-hero | 742 | 326 | 312 | 82 | Myriad 68 bold, blue |
| hero-rule-yellow | 780 | 416 | 236 | 2 | yellow |
| meta | 760 | 442 | 276 | 22 | Calibri 12 bold, text |
| page | 1128 | 664 | 48 | 20 | Calibri 12, #D7E8F8 |

### 5.3 Producto / Tipo A

**Helpers:** addRoot, addChrome, addTitleBlock, addCallout, addPill

| Zona | Rango horizontal | Contenido |
|------|------------------|-----------|
| TitleBlock | 72–432 | Eyebrow + título + body |
| Product canvas | 458–888 | Mockup + screen + evidence |
| Callouts | 918–1164 | 3 callouts verticales |
| Evidence rail | 458–888 | Pills + label |

**Product canvas detail:**

| Elemento | left | top | width | height |
|----------|------|-----|-------|--------|
| product-canvas | 458 | 146 | 430 | 460 |
| product-screen | 492 | 188 | 362 | 258 |
| product-screen-header | 492 | 188 | 362 | 38 |
| product-proof-card | 522 | 258 | 142 | 106 |
| product-row-01 | 690 | 260 | 132 | 20 |
| product-row-02 | 690 | 298 | 108 | 20 |
| product-row-03 | 690 | 336 | 146 | 20 |
| evidence-bar-cyan | 522 | 428 | 292 | 5 |
| evidence-bar-yellow | 522 | 444 | 214 | 5 |
| evidence-rail | 458 | 520 | 430 | 106 |

### 5.4 Arquitectura / Tipo B

**Helpers:** addRoot, addChrome, addTitleBlock, addCallout, addArchitectureLane, addArchitectureNode, addArrowConnector

| Zona | Rango horizontal | Contenido |
|------|------------------|-----------|
| TitleBlock | 72–382 | Eyebrow + título + body |
| Callouts | 72–358 | 2 callouts técnicos (abajo) |
| Architecture | 430–1160 | 3 lanes + 5 nodos + 4 arrows |

**Arrows (slide 04):**

| Instancia | left | top | direction | color | label |
|-----------|------|-----|-----------|-------|-------|
| Channel→Channel | 688 | 206 | right | cyan | deriva |
| Channel↓Core | 736 | 268 | down | cyan | orquesta |
| Core↓Provider | 858 | 402 | down | blue | integra |
| Core↓Data | 624 | 402 | down | yellow | registra |

### 5.5 Scope / Tipo C

**Helpers:** addRoot, addChrome, addTitleBlock, addScopePanel, addDecisionGate

| Zona | Rango horizontal | Contenido |
|------|------------------|-----------|
| TitleBlock | 72–432 | Eyebrow + título + body |
| In-scope panel | 420–810 | Scope panel azul |
| Boundary | 832 | Línea vertical + node |
| Out-of-scope | 884–1164 | Scope panel amarillo |
| Decision gate | 420–1164 | Banda de decisión |

**Scope boundary:**

| Elemento | left | top | width | height |
|----------|------|-----|-------|--------|
| boundary-line | 832 | 166 | 4 | 276 |
| boundary-node (ellipse) | 818 | 274 | 32 | 32 |
| boundary-label | 786 | 456 | 100 | 14 |

### 5.6 Roadmap / Tipo D

**Helpers:** addRoot, addChrome, addTitleBlock, addTimelineStep, addArrowConnector, addDecisionGate, addPill

| Zona | Rango horizontal | Contenido |
|------|------------------|-----------|
| TitleBlock | 72–422 | Eyebrow + título + body |
| Timeline | 420–1118 | Spine + 3 steps + 2 arrows |
| Decision gate | 420–1118 | Gate subordinado |
| Pills | 72–476 | Categorías footer |

**Timeline layout:**

| Elemento | left | width |
|----------|------|-------|
| Spine | 430 | 650 |
| Step 01 | 420 | 206 |
| Arrow 01→02 | 626 | 40 |
| Step 02 | 666 | 206 |
| Arrow 02→03 | 872 | 40 |
| Step 03 | 912 | 206 |

### 5.7 Alineamiento institucional con experto externo

**Uso:** reuniones donde FALP necesita alinear criterio con un colaborador externo, experto clínico/técnico o institución par, sin convertir la presentación en pitch comercial ni en propuesta de implementación cerrada.

**Reglas:**
- El eje debe ser la **hipótesis clínica/institucional**, no el proveedor.
- Si el experto trae una herramienta propia y además una conexión con terceros, la herramienta/experiencia propia entra primero; la infraestructura o vendor queda como capa complementaria.
- El cierre debe ordenar **rutas de decisión prudente**; evitar slides de “gracias”, contacto o próximos pasos operativos prematuros.
- La credencial institucional no debe sonar a brochure: preferir trayectoria, estándar asistencial, gobernanza o señal operativa por sobre volumen/promoción.
- Si una slide define prioridad estratégica entre tres capas/cards, la prioridad debe verse en el **orden de lectura** (izquierda→derecha o dominancia visual), no sólo en la etiqueta A/B/C.

---

## 7. Reglas de Composición

### Obligatorias

1. **Todo slide debe crear un fondo explícito primero** — idealmente `addRoot`; portada puede usar `bg-root` custom blanco.
2. **Slides de contenido llevan `addChrome`** — portadas y section dividers no.
3. **Logo FALP nunca va directo sobre fondo azul** — usar fondo claro, medallón/card claro o asset preparado para ese contexto.
4. **Yellow como acento** — no como fondo dominante de slide. Uso permitido: dividers, markers, pills, decision gates y bars.
5. **Texto en cards respeta padding visual** — mínimo 18–24 px desde borde; nunca pegado al accent bar.
6. **Page number sólo en slides con chrome o layouts custom que lo declaren** — formato string, esquina inferior derecha.
7. **Contenido placeholder visible** — texto genérico y editable; no inventar datos clínicos/institucionales reales.
8. **4 px grid como objetivo** — se permiten ajustes ópticos puntuales cuando el layout renderizado lo justifica, pero deben quedar documentados.
9. **Conectores sobrios** — shaft fino, cabeza alineada, sin flechas decorativas. Si una flecha no agrega dirección semántica, usar línea simple o eliminarla.
10. **Un texto por elemento visual** — cuando N textos se alinean con N elementos (badges, iconos, nodos), crear N `ctx.addText` independientes con coordenadas propias. Nunca un solo bloque multilinea (`\n`) para múltiples elementos, porque el layout interno del salto de línea no se controla y nunca alinea con los elementos externos.
11. **Reading order > intención declarada** — si una card, ruta o argumento es el principal, debe leerse primero por posición o dominancia visual. No confiar en que el usuario “entienda” la prioridad sólo por labels.
12. **Tono institucional > brochure** — en slides de contexto o credenciales, evitar frases de marketing barato y métricas de volumen si no aportan a la decisión. Preferir trayectoria, gobernanza, estándar de atención o señal operativa.

### Anti-patrones

- ❌ No usar `TOKENS.yellow` como fondo dominante de slide.
- ❌ No apilar más de 3 callouts verticales en la zona derecha estándar.
- ❌ No introducir nuevos `ctx.addShape` / `ctx.addText` repetibles sin evaluar si corresponde helper.
- ❌ No mezclar más de 3 colores de acento en una slide.
- ❌ No colocar logo FALP azul sobre fondo `TOKENS.blue` sin superficie clara.
- ❌ No introducir nuevos hex hardcodeados. Si el color ya existe como derivado, documentarlo/promoverlo antes de reusarlo.
- ❌ No generar contenido clínico/institucional real — sólo placeholders editables salvo que el usuario entregue copy aprobado.
- ❌ No usar rectángulo shaft + Unicode arrow head para conectores direccionales; usar LINE nativo con `endArrowType: 'triangle'` vía `addArrowConnector`.
- ❌ No agrupar textos visualmente independientes en un solo `ctx.addText` con `\n`. Cada texto que se alinea con un elemento distinto (icono, badge, nodo) DEBE ser su propio `ctx.addText` con coordenadas propias. Un solo bloque de texto multilinea nunca alinea correctamente con elementos externos porque su layout interno depende del motor de renderizado.
- ❌ No dejar que un vendor/proveedor se vuelva protagonista visual cuando la conversación real es de colaboración clínica, herramienta propia o hipótesis institucional.
- ❌ No cerrar decks de alineamiento con “gracias”, datos de contacto o siguientes pasos operativos si la decisión todavía es de factibilidad/criterio.

### Constraints y Límites

| Constraint | Valor | Razón |
|------------|-------|-------|
| Máx callouts verticales | 3 | 3×112 + 2×20 = 376px + chrome |
| Máx timeline steps | 3 | 3×206 + 2×40 = 698px desde x=420 |
| Máx architecture lanes | 3 | ~400px total + chrome |
| Máx scope panels | 2 | In-scope + Out-of-scope con boundary |
| Máx pills en rail | 4 | ~140×4 + gaps ≈ 600px |
| Máx nodos por lane | 3 | 730px lane / ~180px nodo |

### Zonas Prohibidas

| Zona | Rango | Razón |
|------|-------|-------|
| Sobre top band | 0–18 y | Chrome institucional |
| Bajo page number | 680+ y | Footer |
| Sobre chrome rule | 98–126 y | Separación |
| Dentro de accent bars | 0–6 px lateral | Solo decorativo |

---

## 8. Matriz de Componentes por Tipo de Slide

| Componente | Portada | Divider | Tipo A | Tipo B | Tipo C | Tipo D |
|------------|:-------:|:-------:|:------:|:------:|:------:|:------:|
| addRoot | custom bg-root | ✅ blue | ✅ bg | ✅ bg | ✅ bg | ✅ bg |
| addChrome | — | — | ✅ | ✅ | ✅ | ✅ |
| addTitleBlock | — | — | ✅ | ✅ | ✅ | ✅ |
| addCallout | — | — | ✅ 3× | ✅ 2× | — | — |
| addCard | — | — | available | available | available | available |
| addPill | — | — | ✅ 3× | — | — | ✅ 3× |
| addDiagramBox | — | — | — | — | — | — |
| addConnector | — | — | available | available | available | available |
| addArrowConnector | — | — | — | ✅ 4× | — | ✅ 2× |
| addArchitectureLane | — | — | — | ✅ 3× | — | — |
| addArchitectureNode | — | — | — | ✅ 5× | — | — |
| addTimelineStep | — | — | — | — | — | ✅ 3× |
| addDecisionGate | — | — | — | — | ✅ 1× | ✅ 1× |
| addScopePanel | — | — | — | — | ✅ 2× | — |
| addSectionLabel | — | custom | available | ✅ 2× | available | ✅ 1× |
| addIconBadge | — | — | available | ✅ legend | available | available |
| addMetricTile | — | — | ✅ 2× target | available | available | available |
| addComparisonRow | — | — | available | available | available | available |
| addProcessCard | — | — | available | available | available | available |
| addInsightPanel | — | — | available | available | available | available |
| addEvidenceRail | — | — | ✅ 1× target | available | available | available |

---

## 9. Pipeline de Build

### Estructura de Workspace

Workspace real actual:

`outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/`

Plantilla general:

```
outputs/{session-id}/presentations/{deck-name}/
├── slides/
│   ├── slide-01.mjs       # Código de cada slide
│   ├── slide-02.mjs
│   ├── ...
│   └── theme.mjs          # Design kit (tokens + helpers)
├── layout/
│   ├── slide-01.layout.json  # Geometría exportada de cada slide
│   └── ...
├── preview/
│   ├── slide-01.png           # Preview PNG de cada slide
│   ├── ...
│   └── contact-sheet-runtime.png  # Contact sheet de todas las slides
├── output/
│   ├── {name}-v1.pptx         # PPTX generado
│   └── artifact-build-manifest.json  # Registro de build
└── profile-plan.txt            # Spec del deck
```

### Flujo

1. **Definir** → `profile-plan.txt` (modo, profile, proof objects requeridos)
2. **Construir** → `slides/*.mjs` usando `theme.mjs`
3. **Build** → Generar PPTX via artifact tooling
4. **Export layout** → `layout/*.layout.json` (geometría precisa de cada elemento)
5. **Render previews** → `preview/*.png` + `contact-sheet-runtime.png`
6. **QA** → Verificar layout JSON contra tokens, revisar contact sheet visual

### Comandos Canónicos de Validación

Usar el runtime de Presentations disponible en esta máquina. El patrón actual validado es:

```bash
env PYTHON=/opt/homebrew/bin/python3 \
/Users/felipe_gonzalez/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
/Users/felipe_gonzalez/.codex/plugins/cache/openai-primary-runtime/presentations/26.515.10909/skills/presentations/scripts/build_artifact_deck.mjs \
  --workspace /Users/felipe_gonzalez/Developer/tqt_app/outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada \
  --slides-dir /Users/felipe_gonzalez/Developer/tqt_app/outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/slides \
  --out /Users/felipe_gonzalez/Developer/tqt_app/outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/output/falp-desarrollo-placeholders-v1.pptx \
  --preview-dir /Users/felipe_gonzalez/Developer/tqt_app/outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/preview \
  --layout-dir /Users/felipe_gonzalez/Developer/tqt_app/outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/layout \
  --contact-sheet /Users/felipe_gonzalez/Developer/tqt_app/outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/preview/contact-sheet-runtime.png \
  --slide-count 6
```

```bash
/Users/felipe_gonzalez/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
/Users/felipe_gonzalez/.codex/plugins/cache/openai-primary-runtime/presentations/26.515.10909/skills/presentations/scripts/check_layout_quality.mjs \
  --layout /Users/felipe_gonzalez/Developer/tqt_app/outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/layout \
  --min-gap 12
```

**Gotcha:** contact sheet requiere `/opt/homebrew/bin/python3` porque ese Python tiene Pillow disponible. Si se usa otro Python sin PIL, el build puede fallar aunque el deck compile.

### Build Manifest

El archivo `artifact-build-manifest.json` registra:

| Campo | Contenido |
|-------|-----------|
| `slideCount` | Número de slides |
| `slideSize` | Dimensiones del canvas |
| `previewDir` / `previewPaths` | Paths absolutos a previews |
| `layoutDir` / `layoutResults` | Paths absolutos a layout JSONs |
| `contactSheet` | Path absoluto al contact sheet |
| `slides[].modulePath` | Path absoluto al .mjs de cada slide |
| `slides[].exportName` | Nombre de export de la función |

---

## 10. Skills y Contrato Operativo

Las skills FALP no son la spec; son el mecanismo de activación/workflow. Deben apuntar a este archivo.

| Skill | Path | Responsabilidad |
|-------|------|-----------------|
| `falp-presentation-format` | `skills/falp-presentation-format/SKILL.md` | Resume reglas de marca, gates de diseño y output contract. |
| `falp-presentation-workflow` | `skills/falp-presentation-workflow/SKILL.md` | Define el flujo: leer spec, editar helpers/slides, rebuild, preview y layout QA. |

**Regla de mantenimiento:** si una skill menciona paths de specs FALP divididas de drafts anteriores, está desactualizada. El path vigente es `docs/design/design.md`.

## 11. Mantenimiento del Design System

### Cuándo editar `design.md`

Editar este archivo cuando cambie cualquiera de estos contratos:

- token de color, tipografía o espaciado;
- helper reutilizable en `theme.mjs`;
- patrón macro de una slide tipo A/B/C/D;
- patrón narrativo/visual repetible (por ejemplo, decks de alineamiento institucional con experto externo);
- regla de marca FALP;
- pipeline de build/QA;
- path activo del workspace o assets.

### Cuándo editar una skill

Editar `skills/falp-presentation-format/SKILL.md` o `skills/falp-presentation-workflow/SKILL.md` sólo cuando cambie la forma de trabajar, no cuando cambie una coordenada visual. Las skills deben apuntar a esta spec y evitar duplicarla.

Ejemplos válidos:
- cambiar el protocolo de arranque de decks nuevos;
- cambiar el gate entre blueprint existente vs layout custom;
- cambiar la política de validación (por ejemplo, cuándo el contact sheet no basta).

### Política de tracking

`.gitignore` debe mantener ignorados los docs generados bajo `docs/design/*`, pero permitir este archivo:

```gitignore
docs/design/*
!docs/design/design.md
```

Esto evita versionar reportes generados viejos sin perder la spec normativa FALP.

## 12. Known Gaps / Deuda Técnica

| Gap | Estado | Regla hasta corregir |
|-----|--------|----------------------|
| `slide-01` define `colors` local | Existe en implementación actual | No copiar el patrón a slides nuevas; migrar a `TOKENS` cuando se toque portada. |
| Slides tienen `ctx.addShape` / `ctx.addText` directos | Existe para layouts custom y proof objects | Permitido si es específico de una slide; si se repite, crear helper en `theme.mjs`. |
| Colores derivados no exportados todos como tokens | Existe | Mantener documentados aquí; promover a `TOKENS` antes de reuso amplio. |
| `addArrowConnector` usa LINE nativo | Resuelto — triangulo nativo PptxGenJS | Patrón rect+Unicode eliminado; usar `endArrowType: 'triangle'`. No revertir. |
| Resource board/sample slide | Resuelto en `slide-07.mjs` | Mantener como muestrario placeholder y actualizarlo cuando cambien helpers. |
| `outputs/` no suele estar versionado | Riesgo operativo | Guardar paths exactos en reportes y validar existencia antes de usar. |
| `addScopePanel` usaba `\n` concatenado — violaba regla 10 | Corregido en v1.1.9 | Patrón refactorizado a N `ctx.addText` por item. No revertir a `join('\n')`. |
| Contact sheet puede dar falso positivo de jerarquía | Riesgo vigente | Si una slide queda “justa” o depende de orden de lectura fino, revisar también el PNG individual y ajustar con margen conservador. |

## 13. Changelog

| Versión | Fecha | Cambio |
|---------|-------|--------|
| 1.2.1 | 2026-05-18 | Agrega protocolo obligatorio de bootstrap para decks/slides nuevas: blueprint-first, proof object dominante, reading order explícito y custom layout sólo por excepción documentada. Alinea la spec principal `falp-development-slide-design` con las skills locales. |
| 1.2.0 | 2026-05-18 | Captura aprendizajes del deck Richard Cave: nuevo patrón de “alineamiento institucional con experto externo”; reglas de reading order > labels; anti-patrón vendor-led framing; anti-patrón de cierre operativo prematuro; tono institucional sobre brochure; gotcha de contact sheet como falso positivo de jerarquía. Actualiza skills locales FALP a v3.1. |
| 1.1.9 | 2026-05-17 | Corrige ISSUE-02 (`lineWidth × 0.75` en `addArrowConnector`), ISSUE-07 (`addScopePanel` N ctx.addText por item, elimina `join('\n')`), ISSUE-08 (`addEvidenceRail` `console.warn` en > 4 items). Agrega `line.width` a tabla de renderizado §3.2 (GAP-A). Registra `addScopePanel` corregido en Known Gaps. |
| 1.1.8 | 2026-05-17 | Anti-patrón: un solo ctx.addText multilinea para múltiples elementos. Regla 10 de composición: un texto por elemento visual. Fix en slides 03 y 07. |
| 1.1.7 | 2026-05-17 | Corrige regla de renderizado: fontSize en spec son px, no pt. PptxGenJS requiere `× 0.75`. Verificado contra PPTX original (v3). |
| 1.1.6 | 2026-05-17 | Documenta reglas de renderizado PptxGenJS: margin=[0,0,0,0], valign=top, fontSize sin conversión. Anti-patrón de multiplicadores. |
| 1.1.5 | 2026-05-17 | Refactor `addArrowConnector`: reemplaza rect+Unicode por LINE nativo PptxGenJS con `endArrowType: 'triangle'`. Actualiza spec, anti-patrones y errata. |
| 1.1.4 | 2026-05-17 | Registra aprendizaje de slide 04: mover labels de conectores a leyenda lateral con section label + badges reduce ruido del flujo. |
| 1.1.3 | 2026-05-17 | Ajusta regla de metric tiles: contexto compacto de 18 px para evitar descuadre visual inferior en Señal A/B. |
| 1.1.2 | 2026-05-17 | Registra aprendizajes de slide 03: altura mínima de metric tiles con contexto y patrón de leyendas verticales con badges sin label. |
| 1.1.1 | 2026-05-17 | Agrega resource board/sample slide 07 y referencia de preview para validar el kit visual. |
| 1.1.0 | 2026-05-17 | Agrega catálogo de recursos reutilizables y tokens derivados exportados para acelerar creación de slides. |
| 1.0.2 | 2026-05-17 | Agrega quick start, definition of done, comandos canónicos de build/QA, política de tracking y mantenimiento de skills. |
| 1.0.1 | 2026-05-17 | Corrige precedencia, paths vigentes, contrato con skills, reglas sobre valores crudos y estado híbrido real del deck. |
| 1.0.0 | 2026-05-17 | Documentación inicial del sistema existente. 15 componentes, 6 slides, pipeline completo. Coordenadas extraídas de layout JSON. |
