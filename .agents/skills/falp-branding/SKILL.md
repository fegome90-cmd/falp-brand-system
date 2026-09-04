---
name: falp-branding
description: >
  Apply the "Clonado de voz FALP · Presentación ejecutiva" design system when
  building any artifact for this brand: decks, landings, posters, emails,
  newsletters, or forms. Trigger when the active design system is
  user:falp-voice-banking-horizon9020-chatgpt-site or the user asks for
  FALP voice-banking branded design work.
---

# Skill — Clonado de voz FALP · Presentación ejecutiva

## 1. Bind tokens first

Paste the seven roles from `brand.json` (or `system/variables.css`) into the
artifact's `:root` before writing any layout. Never invent hex outside:

- Canvas `#f5f9fd` (background) · Paper `#ffffff` (surface) · Ink `#12385f` (fg)
- Slate `#6b7c93` (muted) · Line `#d7e4ef` (border)
- FALP Blue `#004990` (accent — sparing, high signal) · FALP Gold `#f5c300` (accent-secondary — bars/badges only)
- Derived literals measured from source that are legal: cyan `#009fe3` (eyebrow text), focus `#008db5`, lighter slate tier `#8a9aaf`.

FALP Blue is not a wash color: CTAs, links, focus rings, logo, tone-blue cards.

## 2. Typography

- Display: **Montserrat** 600/750/800/850/900, letter-spacing −0.035em…−0.045em, line-height 1.02–1.04, `clamp(2rem, 3.25vw, 3.95rem)` for hero titles.
- Body: **Inter** 400/600/750/800.
- Load via `fonts/fonts.css` (self-hosted) or the Google Fonts URLs in `brand.json`. Ship fallback stacks verbatim.

## 3. Voice contract

Ejecutivo y humano. Frases cortas en primera persona. Estructura numérica
01–06: categoría en MAYÚSCULAS, tema en minúsculas, tesis breve al cierre de
cada capítulo. Informativo, no promocional — plantea decisiones
(continuar · ajustar · detener).

- Use: identidad comunicativa, clon de voz, recorrido, acompañamiento, prueba acotada, habilitadores, horas protegidas, evidencia mínima.
- Avoid: jerga de IA generativa, promesas absolutas, "guardar/almacenar muestras de voz", términos clínicos sin explicar.

## 4. Imagery: none

This brand is typographic and diagrammatic. Line icons (Lucide, 2px stroke),
semantic tone cards (blue/cyan/gold/deep), numbered step flows. No stock
photos, no figurative illustration, no emoji icons, no saturated gradients.
Do not add photography even where a template has an image slot — replace the
slot with a diagram, tone card, or typographic panel.

## 5. Layout posture

- Radius 14px (cards 10–14px), 1px borders, 8px baseline grid.
- Decks: 16:9 presenter frame, top progress bar, keyboard nav (← →, Space, Home/End), numbered footer pagination; frame shadow `0 30px 80px rgba(32,58,82,0.17), 0 3px 12px rgba(32,58,82,0.08)`.
- Cover: two-column grid — eyebrow + title + objective frame left, chapter index right.
- Eyebrows: uppercase, letter-spacing 0.14em, cyan `#009fe3`, preceded by a gold bar.
- Tone cards on white, radius 10–14px, shadow `0 2px 8px rgba(18,56,95,0.04)`.
- Primary CTA: FALP Blue `#004990`; visible focus `#008db5`; touch targets ≥44px (`controlHeight: 44`).

## 6. Ship checklist

1. Every color literal ∈ registered palette (plus the derived literals in §1).
2. Display face ≠ body face; Montserrat titles carry the negative tracking.
3. No invented metrics or photography.
4. `data-od-id` on page regions, headings, CTAs, repeated cards.
5. Deck position persists to localStorage; no `scrollIntoView`.
