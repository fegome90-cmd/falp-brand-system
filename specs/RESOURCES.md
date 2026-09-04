# FALP Branding — Recursos y Design Tokens

> **Extraído de:** `dividi_slide`, `tqt_app` | **Fecha:** 2026-07-24
> **Propósito:** Referencia consolidada del sistema de diseño FALP

---

## 1. Fuentes Normativas de Marca (Brand Assets)

**Repo:** `~/Developer/tqt_app/outputs/falp-brand/`

| Asset | Path absoluto | Contenido |
|-------|--------------|-----------|
| Manual de marca (PDF) | `~/Developer/tqt_app/outputs/falp-brand/MANUAL-DE-NORMAS-FALP-25-B.pdf` | Normas completas (~9 MB) |
| Paleta de colores | `~/Developer/tqt_app/outputs/falp-brand/5Colores.pdf` | Colores oficiales (528 KB) |
| Tipografía | `~/Developer/tqt_app/outputs/falp-brand/6Tipografias.pdf` | Fuentes oficiales (872 KB) |
| Logotipo e isologotipo | `~/Developer/tqt_app/outputs/falp-brand/2Logotipo-e-isologotipo.pdf` | Normas de logo (234 KB) |
| Logo vectorial | `~/Developer/tqt_app/outputs/falp-brand/logo-falp.svg` | Logo principal SVG (3.7 KB) |
| Logo horizontal | `~/Developer/tqt_app/outputs/falp-brand/logo_falp_h.svg` | Variante horizontal SVG (3.7 KB) |
| Logo transparente | `~/Developer/tqt_app/outputs/falp-brand/falp-logo-transparent-cropped.png` | PNG fondo claro (21 KB) |
| Logo clean alpha | `~/Developer/tqt_app/outputs/falp-brand/falp-logo-chatgpt-clean-alpha.png` | PNG medallones (96 KB) |
| Logo compat PNG | `~/Developer/tqt_app/outputs/falp-brand/logo_falp_h_compat.png` | PNG horizontal (7 KB) |
| Manual web | `~/Developer/tqt_app/outputs/falp-brand/manual-de-marca-falp.html` | HTML interactivo (134 KB) |
| Modelo de salud web | `~/Developer/tqt_app/outputs/falp-brand/modelo-de-salud-falp.html` | HTML informativo (208 KB) |
| Renders | `~/Developer/tqt_app/outputs/falp-brand/renders/` | Directorio de renders adicionales |

---

## 2. Design Tokens (dividi_slide)

**Archivo normativo YAML:** `~/Developer/dividi_slide/designs/falp.yml`
**Archivo normativo completo:** `~/Developer/dividi_slide/designs/falp-design.md`

### 2.1 Paleta Principal

| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| `primary` / `blue` | `#004990` | 0, 73, 144 | Color institucional principal. Headers, lanes, accents |
| `secondary` | `#1A1A2E` | 26, 26, 46 | Color secundario |
| `accent` / `yellow` | `#F5C300` | 245, 195, 0 | Acento institucional. Dividers, markers, decision gates |
| `cyan` | `#009FE3` | 0, 159, 227 | Acento técnico. Conectores, callouts, nodos core |
| `light` / `white` | `#FFFFFF` | 255, 255, 255 | Fondos de card, texto inverso |
| `bg` | `#F5F9FD` | 245, 249, 253 | Fondo base de slide |
| `panel` | `#FFFFFF` | 255, 255, 255 | Fondo de cards/paneles |

### 2.2 Paleta Extendida (tokens adicionales)

| Token | Hex | Uso |
|-------|-----|-----|
| `dark-blue` | `#051C2C` | — |
| `medium-blue` | `#006BA6` | — |
| `light-blue` | `#41A5D4` | — |
| `warm-gold` | `#C49A2A` | — |
| `text-primary` / `text` | `#12385F` | Texto principal (headings, títulos) |
| `text-secondary` / `text2` | `#6B7C93` | Texto secundario (body, descripciones) |
| `text-muted` / `text3` | `#8A9AAF` | Texto metadata (labels, eyebrows) |
| `surface` | `#FFFFFF` | Fondos principales |
| `surface-secondary` | `#F3F4F6` | Fondos secundarios |
| `border-color` / `line` | `#D7E4EF` | Bordes, separadores |
| `mist` | `#EAF2FA` | Fondo suave para áreas secundarias |

### 2.3 Colores Derivados (para slides)

| Nombre | Hex | RGB | Uso |
|--------|-----|-----|-----|
| `softBlue` | `#EFF6FB` | 239, 246, 251 | Círculos y fondos suaves |
| `deepBlue` | `#255C98` | 37, 92, 152 | Círculos decorativos sobre azul |
| `tintCyan` | `#E8F8FB` | 232, 248, 251 | Pills, badges y fondos técnicos |
| `tintYellow` | `#FFF3CC` | 255, 243, 204 | Riesgo, advertencia, badge amarillo |
| `tintYellowWarm` | `#FFFDF5` | 255, 253, 245 | Paneles/gates amarillos muy suaves |
| `tintBlue` | `#F8FBFE` | 248, 251, 254 | Lanes, rails, screens, insight panels |
| `eyebrowOnBlue` | `#DCE8F5` | 220, 232, 245 | Eyebrow sobre azul institucional |
| `bodyOnBlue` | `#D7E8F8` | 215, 232, 248 | Body copy sobre azul institucional |
| `claimOnBlue` | `#E8F0F8` | 232, 240, 248 | Claim/subtitle sobre azul institucional |
| `darkText` | `#30465F` | 48, 70, 95 | Texto alternativo de portada |
| `goldText` | `#6A4F00` | 106, 79, 0 | Texto sobre `tintYellow` |

### 2.4 Tipografía

| Rol | Fuente | Size (px) | Weight | Color |
|-----|--------|-----------|--------|-------|
| Chapter number hero | Myriad Pro | 68 | Bold | blue |
| Hero title (divider) | Myriad Pro | 58 | Bold | white |
| Hero title (portada) | Myriad Pro | 50 | Bold | white |
| Slide title (titleblock) | Myriad Pro | 38 | Bold | text |
| Body (section divider) | Myriad Pro | 22 | Regular | body on blue |
| Institution name | Myriad Pro | 24 | Bold | blue |
| Subtitle brand | Myriad Pro | 24 | Bold | yellow |
| Card title | Myriad Pro | 20–22 | Bold | text |
| Body text | Myriad Pro | 16–18 | Regular | text2 |
| Eyebrow | Calibri | 9–14 | Bold | text2 / cyan |
| Page number | Calibri | 11–12 | Regular | text3 |
| Pill text | Calibri | 13 | Bold | text |

**Font stack:** Headings → Myriad Pro, Body → Myriad Pro / Source Sans Pro, Meta → Calibri

### 2.5 Espaciado

| Token | Valor (px) |
|-------|-----------|
| Grid base | 4 |
| `xs` | 4 |
| `sm` | 8 |
| `md` | 16 |
| `lg` | 32 |
| `xl` | 64 |
| `2xl` | 80 |
| Outer margin | 72 |
| Card padding lateral | 24 |
| Card padding vertical | 18–20 |
| Gap entre callouts | 20 |
| Gap entre cards | 20–30 |

### 2.6 Canvas

- **Dimensiones:** 1280 × 720 px (16:9 widescreen)
- **Border radius:** sm=4px, md=8px, lg=12px
- **Border width:** 0.75pt
- **Logo chrome:** 110 × 30 px (esquina superior derecha)

---

## 3. Componentes del Design Kit (PPTX)

El sistema de slides FALP implementa los siguientes helpers reutilizables en `theme.mjs`:

| Componente | Función | Uso |
|------------|---------|-----|
| `addRoot` | Fondo base de slide | Toda slide |
| `addChrome` | Header institucional (banda azul + título + logo + page number) | Slides de contenido |
| `addTitleBlock` | Bloque eyebrow + título + body text | Slides de contenido |
| `addCard` | Card rectangular con barra acento lateral | Contenido estructurado |
| `addPill` | Badge/píldora rectangular para tags | Categorías, riesgos |
| `addCallout` | Callout con dot + eyebrow + título + body | Highlights, claims |
| `addDiagramBox` | Caja de diagrama con borde acento | Diagramas |
| `addConnector` | Línea conectora horizontal/vertical | Diagramas |
| `addArrowConnector` | Conector con flecha direccional | Flujos, arquitectura |
| `addArchitectureLane` | Lane horizontal para diagramas | Arquitectura |
| `addArchitectureNode` | Nodo dentro de lane | Arquitectura |
| `addTimelineStep` | Step de roadmap con marcador | Roadmaps |
| `addDecisionGate` | Banda de decisión con borde superior | Preguntas abiertas |
| `addScopePanel` | Panel de scope in/out | Scope definition |
| `addSectionLabel` | Etiqueta de sección | Organización visual |
| `addIconBadge` | Badge semántico pequeño | Categorías, estados |
| `addMetricTile` | Placeholder KPI/indicador | Métricas |
| `addComparisonRow` | Fila de comparación A/B | Comparaciones |
| `addProcessCard` | Card de paso de proceso | Flujos |
| `addInsightPanel` | Panel de síntesis/aprendizaje | Insights |
| `addEvidenceRail` | Banda compacta de pills/evidencia | Evidencia |

### 3.1 Blueprints de Slide

| Tipo | Uso | Componentes clave |
|------|-----|-------------------|
| **Portada** | Apertura institucional | Columna brand azul + divider amarillo + logo + círculo suave |
| **Section Divider** | Separador de capítulo | Fondo azul + círculos decorativos + número hero |
| **Tipo A (Producto)** | Presentación de producto | TitleBlock + canvas + 3 callouts + evidence rail |
| **Tipo B (Arquitectura)** | Diagramas técnicos | TitleBlock + 3 lanes + 5 nodos + 4 arrows + 2 callouts |
| **Tipo C (Scope)** | Definición de alcance | TitleBlock + in/out scope panels + boundary + decision gate |
| **Tipo D (Roadmap)** | Línea de tiempo | TitleBlock + timeline spine + 3 steps + 2 arrows + decision gate |

---

## 4. Design System Web App (tqt_app)

**Archivo:** `~/Developer/tqt_app/docs/wiki/design/design-system.md`

### 4.1 Tokens CSS (Tailwind)

| Token CSS | Valor | Rol |
|-----------|-------|-----|
| `--color-surface` | `#f8f9fa` | App background |
| `--color-card` | `#ffffff` | Cards, sheets |
| `--color-primary-action` | `#014389` | Botones, nav active |
| `--color-primary` | `#002d60` | Accents, focus rings |
| `--color-text-heading` | `#191c1d` | Títulos |
| `--color-text-secondary` | `#424751` | Labels, descriptions |

**Font:** Nunito (400–900). **Touch minimum:** 48px.

---

## 5. Pipeline de Build (PPTX)

**Workspace activo:** `~/Developer/tqt_app/outputs/019e2dab-40e1-7a90-87d7-b7dd7aace26d/presentations/falp-portada/`

```
workspace/
├── slides/          ← Código fuente (.mjs)
│   ├── theme.mjs    ← Design kit (tokens + helpers)
│   └── slide-*.mjs  ← Slides individuales
├── layout/          ← Geometría exportada (.layout.json)
├── preview/         ← PNG previews + contact sheet
├── output/          ← PPTX generado + build manifest
└── profile-plan.txt ← Spec del deck
```

**Comando de build canónico (desde tqt_app):**
```bash
env PYTHON=/opt/homebrew/bin/python3 \
  /Users/felipe_gonzalez/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  /Users/felipe_gonzalez/.codex/plugins/cache/openai-primary-runtime/presentations/26.515.10909/skills/presentations/scripts/build_artifact_deck.mjs \
  --workspace <workspace-path> \
  --slides-dir <slides-dir> \
  --out <output-pptx-path> \
  --preview-dir <preview-dir> \
  --layout-dir <layout-dir> \
  --contact-sheet <contact-sheet-path> \
  --slide-count <N>
```

---

## 6. Referencias Rápidas

### 6.1 Reglas de Marca Esenciales

- ⚠️ **Logo FALP nunca sobre fondo azul** sin superficie clara (card, medallón)
- ⚠️ **Yellow (#F5C300) solo como acento** — no como fondo dominante
- ⚠️ **Máximo 3 colores de acento por slide**
- ⚠️ **No inventar datos clínicos/institucionales reales** en placeholders
- ⚠️ **Si hay conflicto con manual de marca FALP, el manual gana**

### 6.2 Archivos Clave (dividi_slide)

| Archivo | Path |
|---------|------|
| Design tokens YAML | `~/Developer/dividi_slide/designs/falp.yml` |
| Design system completo | `~/Developer/dividi_slide/designs/falp-design.md` |
| Deck ejemplo | `~/Developer/dividi_slide/designs/deck-product.yml` |
| Theme ejecutable | `~/Developer/dividi_slide/ref/theme.mjs` |

### 6.3 Skills Relacionadas

| Skill | Path | Propósito |
|-------|------|-----------|
| `falp-presentation-format` | `skills/falp-presentation-format/SKILL.md` | Reglas de marca, gates de diseño |
| `falp-presentation-workflow` | `skills/falp-presentation-workflow/SKILL.md` | Flujo completo: spec → build → QA |

---

## 7. Anti-Patrones

- ❌ Yellow como fondo dominante de slide
- ❌ Más de 3 callouts verticales en zona derecha
- ❌ Logo FALP azul sobre fondo `#004990` sin superficie clara
- ❌ Nuevos hex hardcodeados sin documentar/promover a tokens
- ❌ Contenido clínico/institucional real en placeholders (sin aprobación)
- ❌ Agrupar textos independientes en un solo `ctx.addText` con `\n`
- ❌ Vendor/proveedor como protagonista visual en decks de colaboración clínica
- ❌ Cerrar decks de alineamiento con "gracias" o "próximos pasos" prematuros
