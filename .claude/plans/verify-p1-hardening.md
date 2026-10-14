# Plan: `verify.mjs` P1 hardening — token mappings + missing-dir failures

Scope: only `scripts/verify.mjs`. No changes to `tokens/`, `adapters/`, `themes/`, `SHA256SUMS`, or `manifest.json` (`scripts/verify.mjs` is not hashed in `SHA256SUMS`). No new dependencies, no test runner.

## Problem

1. **Weak token check (section 5).** Only verifies that `#004990` appears *somewhere* in `adapters/css/variables.css`. Drift in `semantic.json`, `adapters/antd/theme.json`, `themes/*.json`, or the other CSS vars passes silently.
2. **Silent skips on missing assets.** `continue` at lines 47 (JSON dirs) and 65 (logo dirs) makes deleted directories pass. `fonts/` and `manuales/` call `readdirSync` unguarded → uncaught crash instead of a clean FAIL. Section 5 reads `variables.css` unguarded.

Note: adapters are antd-derived (most core hexes such as gold/cyan do NOT appear in them). Do not assert "every core hex appears in adapters" — that would fail and force an identity change. Assert explicit mappings instead.

## Design

### A. Required layout (new section `[0]`, runs first)
- `REQUIRED_DIRS` (must exist, be a directory, and be non-empty): `tokens`, `themes`, `sources`, `fonts`, `specs`, `adapters/antd`, `adapters/css`, `logos/official`, `logos/derived`, `manuales`.
- `REQUIRED_FILES`: `tokens/core.json`, `tokens/semantic.json`, `adapters/css/variables.css`, `adapters/css/variables.dark.css`, `adapters/css/fonts.css`, `adapters/antd/theme.json`, `themes/default.json`, `themes/dark.json`, `themes/compact.json`, `sources/SHA256SUMS`, `sources/manifest.json`.
- Minimum asset counts: ≥1 `.woff2` in `fonts/`, ≥1 `.pdf` in `manuales/`, ≥1 `.svg` in `logos/official/`.
- Sections 2/3/4: replace `continue` with `assert(false, "Required directory missing: …")` then skip that dir; guard `fonts/` and `manuales/` `readdirSync` the same way. Script must never throw — always reach the summary and `exit(1)`.

### B. Token mapping checks (replace section 5)
Helpers: `readJson(rel)` (returns `null` + FAIL on missing/invalid), `getPath(obj, "a.b.c")`, `cssVar(cssText, name)` → value of `--name:` (handle multi-line values: capture up to `;`, trim, collapse whitespace), hex compare case-insensitive.

1. **core.json**: every leaf under `color` with `type: "color"` has `value` matching `/^#[0-9a-f]{6}$/i`.
2. **semantic.json**: for every leaf with `value`/`resolved`:
   - if `value` is `{color.x.y}` → path must exist in core (`core.color.x.y.value`) and `resolved` must equal it;
   - else (literal) → `value === resolved` and is valid hex.
3. **adapters/antd/theme.json** (`token.*`) and **themes/default.json**, **themes/compact.json** (top-level):
   explicit mapping table:
   - antd: `colorPrimary`, `colorInfo`, `colorLink` → blue.institutional; `colorTextBase` → blue.deep; `colorBgBase` → blue.canvas.
   - themes default/compact: `colorPrimary`, `colorInfo`, `colorLink` → blue.institutional.
   - `fontFamily` (antd token + all 3 themes) must start with `typography.web_derived.body` (`Inter`).
   - themes/dark.json: `colorPrimary` present and valid hex only (dark primary is derived, not core).
4. **adapters/css/variables.css**: `--brand-color-primary`, `--brand-color-info`, `--brand-color-link` → blue.institutional; `--brand-color-bg-container` → blue.canvas; `--brand-font-family` starts with `Inter`. A missing var is a FAIL, not a skip.
5. **adapters/css/variables.dark.css**: `--brand-color-primary` present and valid hex.

Each assertion message names file + key + expected + actual so a FAIL is actionable.

## Validation
- `npm run check` exits 0 on the unmodified tree.
- Mutation tests (temp copy of repo, never the real tree) each exit 1 with a targeted FAIL line and no uncaught exception:
  delete `logos/derived/`, delete `fonts/`, delete `manuales/`, delete `adapters/css/variables.css`, change `semantic.json` `action.primary.resolved`, point a semantic ref to a non-existent core path, change antd `colorPrimary`, remove `--brand-color-link` from `variables.css`, change `themes/default.json` `colorInfo`, set a core color to `#zzz`.
