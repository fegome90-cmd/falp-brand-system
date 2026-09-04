# Clonado de voz FALP · Presentación ejecutiva — Brand Guide

*Preservar la voz antes de que cambie*

Exploración ejecutiva de un clon de voz personalizado para preservar la identidad comunicativa, sin almacenar muestras de voz en FALP.

Extracted and measured from https://falp-voice-banking.horizon9020.chatgpt.site/ — an executive slide presenter (deck) built with Tailwind CSS on a light stage.

## System in one sentence

A calm, institutional light-stage system: white panels on a pale blue canvas, deep-blue ink typography, one blue action color and one gold highlight, driven by numbered structure and line-icon diagrams instead of photography.

## Color roles (measured from site CSS variables)

- **Canvas / Background** (`#f5f9fd`, oklch 98.0% 0.007 247.9) — page canvas. The real `body` background is `var(--canvas)` with two faint radial washes: `#004990` at ~10% alpha top-left, `#008db5` at ~8% alpha bottom-right.
- **Paper / Surface** (`#ffffff`) — cards, content panels, deck frame (`--paper`, `--surface-cover`).
- **Ink / Foreground** (`#12385f`) — body text and slide copy (`--ink`, also `--blue-deep`). Cover title uses an even darker `--heading-dark: #191c1d`.
- **Slate / Muted** (`#6b7c93`) — secondary text (`--muted`); lighter tier `#8a9aaf` for hints.
- **Line / Border** (`#d7e4ef`) — hairlines and card borders (`--line`); softer `--hairline: #e1e3e5` exists for chrome surfaces.
- **FALP Blue / Accent** (`#004990`, oklch 41.0% 0.133 254.6) — primary brand color: logo wordmark, primary CTAs, links, focus-visible outlines (`#008db5` for focus), `tone-blue` cards. By far the most frequent literal in the stylesheet (×112).
- **FALP Gold / Accent-secondary** (`#f5c300`, oklch 83.8% 0.171 89.9) — highlight accent: eyebrow bar, `tone-gold` cards, step badges. Use sparingly; never as a large wash. For gold text on light surfaces the site darkens it (`#8a6a00`, `#705800`).
- Tertiary support tones measured on the site: `--cyan: #009fe3` (eyebrow labels), `--soft-blue: #eff6fb`, `--soft-cyan: #e8f8fb`, `--soft-gold: #fffdf5`, `--mist: #eaf2fa`, `--falp-primary: #002d60`, `--falp-action: #014389`.

Note: an earlier provisional pass registered a dark palette (#000000 background). Live CSS measurement shows the opposite — this is a light-theme site. The dark values are not part of this brand.

## Typography

- **Display:** Montserrat — weights 600, 750, 800, 850 (variable 600–900) — fallbacks: Inter, ui-sans-serif, system-ui, sans-serif. Used for `.slide-copy h1/h2` with `letter-spacing: -0.045em`, `line-height: 1.04`, `clamp(2rem, 3.25vw, 3.95rem)`. The cover title uses Inter 800 (`clamp(46px, 4.7vw, 74px)`, `letter-spacing: -0.035em`), so Inter is acceptable as a display face for hero moments.
- **Body:** Inter — weights 400, 600, 750, 800 (variable) — fallbacks: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif.
- **Mono:** none branded; the site falls back to Tailwind's system mono stack (ui-monospace, SFMono-Regular).
- Both families are on Google Fonts and self-hosted by the kit:
  - Montserrat: `https://fonts.googleapis.com/css2?family=Montserrat:wght@600..900&display=swap`
  - Inter: `https://fonts.googleapis.com/css2?family=Inter:wght@400..800&display=swap`
- Eyebrow pattern: uppercase, `letter-spacing: 0.14em`, cyan `#009fe3`, weight 850, ~0.75rem, preceded by a small gold bar.

## Logo

- **Primary:** `logos/header-inline.svg` — the real FALP wordmark ("FALP, Fundación Arturo López Pérez"), inline SVG, two-color: blue `#004990` letterforms with a gold `#f5c300` arc and dot.
- **Alternate:** `logos/favicon-1.svg` — site favicon: blue rounded square, white waveform stroke, gold dot.
- Clear space: keep the wordmark on white or the pale canvas; never place it on saturated gold.

## Voice & tone

- **Adjectives:** Humano, Institucional, Claro, Sobrio, Prudente.
- **Tone:** Ejecutivo y humano. Frases cortas en primera persona, sin jerga técnica; estructura numérica (01–06) con categoría en mayúsculas y tema en minúsculas; cada capítulo cierra con una tesis breve. Informativo, no promocional: plantea decisiones (continuar · ajustar · detener) en lugar de vender.
- **Messaging pillars:**
  - Preservar la voz antes de que cambie
  - La voz también es identidad comunicativa
  - No es guardar una voz: es crear un clon para usarlo después
- **Use:** identidad comunicativa, clon de voz, recorrido, acompañamiento, prueba acotada, habilitadores, horas protegidas, evidencia mínima.
- **Avoid:** jerga de IA generativa, promesas absolutas, "guardar" o "almacenar" muestras de voz, términos clínicos sin explicar.

## Imagery

- **Style:** Sin fotografía — comunicación tipográfica y diagramática. Iconografía de línea (Lucide, stroke 2px), tarjetas de tono semántico y flujos numerados de pasos.
- **Subjects:** iconos de línea, diagramas de flujo, tarjetas semánticas de tono, badges numerados.
- **Treatment:** superficies blancas sobre canvas celeste con lavados radiales azul/cian a ~8–10% de opacidad; sombras suaves azul-tinta; el dorado se reserva para barras y badges.
- **Avoid:** fotografías de stock, ilustraciones figurativas, emojis como iconos, gradientes saturados.
- **Samples:** the source site ships no raster images (no `<img>`, no CSS background photos, no og:image ≥320px), so `imagery.samples` is intentionally empty; the kit's imagery gallery falls back to the deterministic cover image.

## Layout

- **Radius:** 14px (cards); 12/11/10px for smaller chips and inner boxes; 4px only for micro-elements.
- **Border weight:** 1px.
- **Spacing:** 8px baseline grid.

### Posture rules (measured)

1. 16:9 deck presenter: top progress bar, keyboard navigation (← →, Space, Home/End), footer with numbered slide pagination and prev/next buttons.
2. Cover is a two-column grid: eyebrow + title + objective framing box on the left, chapter index (01–06) on the right.
3. Eyebrows: uppercase, 0.14em tracking, cyan `#009fe3`, gold bar prefix.
4. Display type: Montserrat 800/850, negative tracking (-0.035em to -0.045em), tight line-height (1.02–1.04).
5. Semantic tone cards (blue/cyan/gold/deep) on white, radius 10–14px, soft shadow `0 2px 8px rgba(18,56,95,0.04)`.
6. Deck frame carries the deep layered shadow: `0 30px 80px rgba(32,58,82,0.17), 0 3px 12px rgba(32,58,82,0.08)`.
7. Primary CTA in FALP Blue; focus-visible outline `#008db5`; active links in institutional blue.
8. Numbered structure everywhere: chapter indices (01–06), flow steps (1–3), question cards (01–04), request cards, next-step badges.

## Design-system seed

- `seed.controlHeight: 44` — controls (nav buttons, CTAs) target a 44px touch height.
