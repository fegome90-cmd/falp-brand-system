# FALP Brand System

> **Versión:** 0.1.0  
> **Ámbito:** Fundación Arturo López Pérez (FALP)  
> **Estado:** Independent Layered Repository with Cryptographic Provenance

Repositorio canónico e independiente de identidad visual, design tokens estructurados, tipografías, manuales normativos y skills para agentes de IA de la **Fundación Arturo López Pérez (FALP)**.

---

## 1. Arquitectura en Capas

El sistema separa estrictamente la fuente original institucional de las adaptaciones digitales y los artefactos de salida:

$$\text{Upstream Institucional} \longrightarrow \text{Tokens Core} \longrightarrow \text{Tokens Semánticos} \longrightarrow \text{Adapters (CSS/AntD)} \longrightarrow \text{Consumers}$$

```text
falp-brand-system/
├── README.md                            # Guía maestro del sistema
├── GOVERNANCE.md                        # Jerarquía de autoridad y reglas de precedencia
├── PROVENANCE.md                        # Cadena de custodia y taxonomía de activos
├── package.json                         # v0.1.0 (private: true)
│
├── sources/                             # 📦 Cadena de custodia criptográfica
│   ├── manifest.json                    # Catálogo máquina de activos con SHA-256
│   └── SHA256SUMS                       # Checksums para verificación determinista
│
├── manuales/                            # 📕 Upstream institucional (PDFs oficiales)
│   ├── MANUAL-DE-NORMAS-FALP-25-B.pdf   # Manual oficial completo (~9 MB)
│   ├── 5Colores.pdf                     # Paleta cromática oficial
│   ├── 6Tipografias.pdf                 # Tipografías oficiales impresas
│   └── 2Logotipo-e-isologotipo.pdf      # Reglas y áreas de reserva del isologotipo
│
├── logos/                               # 🛡️ Identidad gráfica
│   ├── official/                        # Logotipos oficiales institucionales (SVG / PNG)
│   └── derived/                         # Adaptaciones para interfaces digitales y web
│
├── fonts/                               # 🔤 Tipografías autohospedadas WOFF2
│   ├── manifest.json                    # Reconciliación: Oficial (Myriad) vs Digital (Montserrat/Inter)
│   ├── montserrat-600-900.woff2         # Display / Headings
│   └── inter-400-800.woff2              # Body / UI
│
├── tokens/                              # 🪙 Tokens de Diseño Canónicos
│   ├── core.json                        # Valores base (#004990, #F5C300, etc.)
│   ├── semantic.json                    # Roles semánticos (canvas, paper, ink, action)
│   └── seed.json                        # Semilla algorítmica
│
├── themes/                              # 🌗 Temas algorítmicos
│   ├── default.json                     # Light theme completo
│   ├── dark.json                        # Dark theme
│   └── compact.json                     # Versión densa / compacta
│
├── adapters/                            # 🔌 Artefactos tecnológicos de consumo
│   ├── css/
│   │   ├── variables.css                # CSS Custom Properties (:root y --brand-*)
│   │   ├── variables.dark.css           # Variables para modo oscuro
│   │   └── fonts.css                    # Declaraciones @font-face
│   └── antd/
│       └── theme.json                   # Tema para Ant Design ConfigProvider
│
├── specs/                               # 📐 Especificaciones de diseño
│   ├── DESIGN.md                        # Spec de Open Design
│   ├── SLIDE-DESIGN-SYSTEM.md           # Normativa de diapositivas PPTX (v1.2.1)
│   ├── guide.md                         # Mediciones de live CSS y espaciados
│   └── BRAND-SYSTEM.md                  # Arquitectura del seed
│
├── templates/                           # 💻 Prototipos y artefactos HTML interactivos
│   ├── brand.html                       # Visor interactivo de marca
│   ├── kit.html                         # Showcase de componentes (Light)
│   ├── kit.dark.html                    # Showcase de componentes (Dark)
│   ├── index.html                       # Galería principal
│   └── artifacts/                       # Templates (deck, landing, form, poster, email)
│
├── scripts/                             # ⚙️ Tooling de verificación
│   └── verify.mjs                       # Script de prueba determinista
│
└── .agents/                             # 🤖 Auto-descubrimiento para Antigravity / Gemini
    └── skills/
        └── falp-branding/
            ├── SKILL.md                 # Skill oficial con activation contract
            └── references/              # Punteros canónicos
```

---

## 2. Paleta de Colores y Tokens Principales

| Token | Rol Semántico | Hex | Uso en UI |
|---|---|---|---|
| `color.blue.institutional` | `action.primary` | `#004990` | Color primario institucional (logos, CTAs, links) |
| `color.blue.deep` | `text.primary` | `#12385f` | Textos principales y títulos |
| `color.neutral.slate` | `text.secondary` | `#6b7c93` | Bajadas, labels secundarios y metadatos |
| `color.blue.hairline` | `border.default` | `#d7e4ef` | Hairlines y bordes de tarjetas |
| `color.blue.canvas` | `surface.canvas` | `#f5f9fd` | Fondo general de escenario |
| `color.neutral.white` | `surface.paper` | `#ffffff` | Superficie de paneles y cards |
| `color.gold.accent` | `highlight.decision` | `#f5c300` | Barras de acento, badges de decisión (uso sobrio) |
| `color.cyan.tech` | `highlight.technical` | `#009fe3` | Eyebrow labels y conectores de arquitectura |

---

## 3. Tipografía: Reconciliación Oficial vs. Digital

1. **Oficial Institucional (Papelería Impresa):**
   * Primaria: **Myriad Pro** | Secundaria: **Source Sans Pro** | Terciaria: **Calibri** (ver `manuales/6Tipografias.pdf`).
2. **Adaptación Digital Autorizada (Web & Apps):**
   * **Display & Headings:** `Montserrat` (600..900) con tracking `-0.045em` y line-height `1.02-1.04`.
   * **Body & UI:** `Inter` (400..800).
   * *Archivos autohospedados:* `fonts/montserrat-600-900.woff2` e `fonts/inter-400-800.woff2`.

---

## 4. Cómo Consumir en Proyectos

### Vía CSS / Tailwind
Podés importar los adaptadores directamente:
```css
@import "@falp/brand-system/adapters/css/variables.css";
@import "@falp/brand-system/adapters/css/fonts.css";
```

### Vía JSON Tokens
```javascript
import coreTokens from "@falp/brand-system/tokens/core.json";
import semanticTokens from "@falp/brand-system/tokens/semantic.json";
```

---

## 5. Agentes de IA (Antigravity & Gemini)

La skill canónica está ubicada en `.agents/skills/falp-branding/SKILL.md`.

Para instalarla globalmente en tu máquina:
```bash
cp -r .agents/skills/falp-branding ~/.gemini/config/skills/
```

---

## 6. Verificación Determinista

Para comprobar la integridad de todos los activos, hashes SHA-256 y correspondencias:
```bash
npm run verify
npm pack --dry-run
```
