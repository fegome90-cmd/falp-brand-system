# Gobernanza del Brand System FALP

> **Versión:** 0.1.0  
> **Estado:** Canonical Candidate / Independent System  
> **Ámbito:** Fundación Arturo López Pérez (FALP)

---

## 1. Jerarquía de Autoridad y Precedencia de Marca

Cuando surja cualquier discrepancia entre documentos, implementaciones o extensiones, rige la siguiente jerarquía estricta:

| Nivel | Capa | Fuente | Rol y Regla de Precedencia |
|---|---|---|---|
| **L0 (Suprema)** | Manuales Oficiales | `manuales/*.pdf` | **Gana ante cualquier discrepancia.** Define colores institucionales (#004990, #F5C300), uso de logotipos y proporciones oficiales. |
| **L1 (Canónica)** | Tokens Core & Semánticos | `tokens/core.json`, `tokens/semantic.json` | Representación estructurada y machine-readable de la identidad. Si un token choca con el manual, se corrige el token. |
| **L2 (Normativa Técnica)** | Especificaciones | `specs/DESIGN.md`, `specs/SLIDE-DESIGN-SYSTEM.md` | Reglas de composición, grilla de 4px/8px, factor de escala PPTX ($px \times 0.75$). |
| **L3 (Adaptadores)** | Adapters Tecnológicos | `adapters/css/variables.css`, `adapters/antd/theme.json` | Salidas generadas para stacks específicos. **Nunca deben editarse como fuente primaria.** |
| **L4 (Consumidores)** | Aplicaciones y Sitios | Repositorios externos (ej. `falp-voice-banking-site3`) | Deben importar o sincronizar los adaptadores; no inventar tokens locales. |

---

## 2. Reconciliación Tipográfica Oficial vs. Adaptación Digital

* **Tipografía Oficial Institucional (Papelería y Documentos Impresos):**
  * Primaria: **Myriad Pro**
  * Secundaria: **Source Sans Pro**
  * Terciaria: **Calibri**
  * *Fuente:* `manuales/6Tipografias.pdf`
* **Adaptación Autorizada para Productos Digitales y Web:**
  * Display / Headings: **Montserrat** (pesos 600, 750, 800, 850, 900) con tracking negativo (`-0.045em`) y line-height ceñido (`1.02–1.04`).
  * Body / UI: **Inter** (pesos 400, 600, 750, 800) con excelente legibilidad en pantallas retina y bajas densidades.
  * *Justificación:* Montserrat e Inter son fuentes abiertas, libres de licenciamiento propietario para web apps, autohospedables en WOFF2 y con paridad visual moderna para productos interactivos.

---

## 3. Reglas para Agentes de IA

1. **Auto-descubrimiento:** La skill operativa vive en `.agents/skills/falp-branding/SKILL.md`.
2. **Prohibición de invención de tokens:** Ningún agente puede introducir colores hexadecimales que no estén registrados en `tokens/core.json`.
3. **No contaminar con extensiones de producto:** Elementos específicos de un caso de uso (como el waveform de clonado de voz) deben permanecer catalogados en `logos/derived/` y no promoverse a logo institucional.
