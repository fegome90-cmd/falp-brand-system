# Cadena de Custodia y Provenance (FALP Brand System)

> **Fecha:** 2026-09-03  
> **Hash Manifest:** Ver `sources/SHA256SUMS` y `sources/manifest.json`

---

## 1. Clasificación Taxonómica de Activos

Cada recurso en este repositorio está formalmente categorizado para distinguir lo institucional de las adaptaciones digitales:

### A. Oficial Institucional (`official`)
* **Manuales Normativos:**
  * `manuales/MANUAL-DE-NORMAS-FALP-25-B.pdf`: Manual oficial completo de normas gráficas.
  * `manuales/5Colores.pdf`: Paleta cromática oficial (#004990, #F5C300).
  * `manuales/6Tipografias.pdf`: Normativa tipográfica (Myriad Pro / Source Sans Pro).
  * `manuales/2Logotipo-e-isologotipo.pdf`: Construcción y áreas de seguridad del isologotipo.
* **Logotipos Institucionales:**
  * `logos/official/logo-falp.svg`: Logotipo oficial vertical.
  * `logos/official/logo_falp_h.svg`: Variante oficial horizontal.
  * `logos/official/falp-logo-transparent-cropped.png`: PNG oficial para fondos claros.
  * `logos/official/falp-logo-clean-alpha.png`: PNG con medallón para fondos oscuros.

### B. Derivado Web / Digital (`derived/web`)
* **Logos y Favicons de Producto:**
  * `logos/derived/header-inline.svg`: Adaptación SVG inline para barras de navegación.
  * `logos/derived/favicon-waveform.svg`: Isotipo simplificado con onda sonora y punto dorado.
* **Tipografías Web Autohospedadas:**
  * `fonts/montserrat-600-900.woff2`: Variable font Display/Títulos.
  * `fonts/inter-400-800.woff2`: Variable font Body/UI.

### C. Tokens y Temas (`tokens` / `themes`)
* `tokens/core.json`: Valores base mapeados directamente desde la paleta institucional.
* `tokens/semantic.json`: Abstracción semántica (canvas, paper, ink, slate, line, action, highlight).
* `themes/*.json`: Temas algorítmicos derivados (`default`, `dark`, `compact`).

### D. Adaptadores Tecnológicos (`adapters`)
* `adapters/css/variables.css`: Custom properties CSS (`:root` y `--brand-*`).
* `adapters/css/fonts.css`: Directivas `@font-face`.
* `adapters/antd/theme.json`: ConfigProvider para Ant Design.

### E. Especificaciones y Plantillas (`specs` / `templates`)
* `specs/DESIGN.md`: Especificación Open Design para interfaces interactivas.
* `specs/SLIDE-DESIGN-SYSTEM.md`: Normativa técnica de generación PPTX v1.2.1.
* `templates/*`: Showcases interactivos y artefactos de presentación ejecutiva.
