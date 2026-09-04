# AGENTS.md

Repository-level instructions for agents working in `falp-brand-system` (canonical FALP visual-identity repo: tokens, fonts, logos, adapters).

## First Read (10 min total)

1. Read [GOVERNANCE.md](GOVERNANCE.md) (3 min) — authority hierarchy L0–L4; manuals beat tokens, tokens beat specs, `adapters/` is never source.
2. Read [PROVENANCE.md](PROVENANCE.md) (3 min) — asset custody; what is institutional truth vs. web adaptation.
3. Reference [.agents/skills/falp-branding/SKILL.md](.agents/skills/falp-branding/SKILL.md) (4 min) — binding palette, typography, and ship checklist for artifacts.

Skip these → you will invent invalid colors, edit generated output as source, or fail verification.

## Build and Test

- Verify: `npm run verify` (must exit 0: SHA-256 integrity + token mappings)
- Final gate: `npm run check` (= verify && lint:ci, must exit 0) — never declare a task done on `verify` alone
- Pack dry-run: `npm run pack:dry`

## Working Rules

- Modify only files needed for the task; prefer minimal, reversible changes.
- Use only color literals registered in `tokens/core.json` (plus the derived literals in SKILL.md §1); for anything else, register the token first.
- Change identity at the source layer: edit `tokens/`, then mirror consistently in `adapters/`; never edit `adapters/` alone.
- Keep product-specific derivatives in `logos/derived/`; never promote them to `logos/official/`.
- Use Montserrat (display) / Inter (body) for web artifacts; reserve Myriad Pro for print contexts per `manuales/6Tipografias.pdf`.
- Run `npm run check` before claiming done.

## References

- [README.md](README.md) — layer map and consumption guide
- [GOVERNANCE.md](GOVERNANCE.md) — precedence rules
- [PROVENANCE.md](PROVENANCE.md) — asset taxonomy
- [specs/SLIDE-DESIGN-SYSTEM.md](specs/SLIDE-DESIGN-SYSTEM.md) — PPTX generation norm (v1.2.1)
