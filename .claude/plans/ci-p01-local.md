# Feature: CI P0.1 local (workflow + engines + Node pin)

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Add the local half of Cole P0.1: a GitHub Actions workflow that runs `npm run check` (`verify` + `lint:ci`) on `push` to `main` and on every `pull_request`, plus `engines` in `package.json` and a `.nvmrc` pin (Node 22), so local and CI run the same runtime. This turns today's voluntary gates into automatic ones. GitHub-side enforcement (ruleset / required check / blocking direct push) is explicitly out of scope — manual follow-up by the repo owner (route option A, agreed 2026-09-04).

## User Story

As a maintainer of the canonical FALP repo
I want `npm run check` to run automatically on every PR/push to `main`
So that no change lands without `verify` + `lint:ci` green.

## Problem Statement

`npm run verify` and `npm run lint:ci` exist and are green, but nothing executes them except human memory. There is no `.github/` directory, no `engines` field, no Node pin. Any contributor can push a red tree and nobody notices until someone runs the gates by hand.

## Solution Statement

Prerequisite first: the Biome baseline from this session (`biome.json`, `package.json` scripts, formatted tree, regenerated `SHA256SUMS`, `package-lock.json`) must already be committed on `main` — without `biome.json` on the runner, `npm run check` fails by default config (audit Alta #1). Then P0.1 is a 3-path diff: `.github/workflows/ci.yml` (checkout → setup-node 22 → `npm ci --no-audit --no-fund --engine-strict` → `npm run check`), `engines: { "node": ">=18" }` in `package.json` (matches README "Node.js 18+" and dividi_slide), `.nvmrc` containing `22`.

## Out of Scope / Non-Goals

- Not included: GitHub ruleset / required check / blocking direct push to `main` (manual owner step after merge — route option A).
- Not included: P0.2 (`provenance:update/check`), P0.3 (Ajv schemas), P0.4 (color registry gate), P1 cross-checks, templates governance, `verify.mjs` missing-dir hardening (audit silent-failure #6, deferred to P1 backlog — separate plans).
- Not changing in the P0.1 diff: `tokens/`, `adapters/`, `themes/`, `scripts/verify.mjs`, `SHA256SUMS`, or any pre-existing dirty file (`SKILL.md`, `README.md`, `fonts.css`, `guide.md`, `brand.json` stay out).
- Prerequisite, not this diff: the Biome baseline (committed to `main` in Phase 0 below, its own commit — after that, P0.1 assumes `npm run check` already exists and is green on `main`).
- Not adding: test runner, build step, CI matrix (single Node 22 — matrix is gold-plating for a zero-dependency asset repo), npm cache (single 15MB dep — cache costs more than it saves, audit Baja #11).

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Low
**Primary Systems Affected**: Phase 0: `biome.json`, `package.json` (scripts+devDep), formatted tree, `SHA256SUMS`, `package-lock.json`, `.gitignore` (track and commit). P0.1: `.github/workflows/`, `package.json` (`engines` only), `.nvmrc`.
**Dependencies**: None (actions/checkout + actions/setup-node pinned by SHA are remote Actions, not npm deps)

## Related Work

**Implements**: Cole P0.1-local (session review 2026-09-04; full text in chat history — CI+ruleset backlog, option A selected)

**Back-references** (decisions inherited, not re-decided):

- Biome 2.4.15 config + `lint`/`lint:ci`/`check` scripts (this session) — CI calls exactly `npm run check`, nothing else.
- `npm ci`, never `npm install` in CI (Cole) — plus observed evidence: `npm install` hung 180s locally this session.
- `npm run check` must be exactly what CI enforces (Cole rule) — no extra commands in the workflow.

**Forward-references** (follow-ups, each its own plan):

- P0.1-remote: ruleset + required check + block direct push (manual, owner).
- P0.2: `provenance:update` / `provenance:check` scripts.
- P0.3: JSON Schemas + Ajv gate.
- P0.4: token-registry color gate in `verify.mjs`.
- P1.x: `verify.mjs` must fail on missing expected dirs (currently `continue` at lines 47/65 skips silently → green on deleted assets; audit silent-failure #6).

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `package.json` (scripts block + devDependencies) - Why: Phase 0 commits scripts/devDep; P0.1 ADDs only `engines`. Confirm `check` = `verify && lint:ci`.
- `biome.json` - Why: Phase 0 prerequisite artifact; CI's `lint:ci` requires it on the runner (audit Alta #1).
- `.gitignore` - Why: confirms `node_modules/` ignored; `package-lock.json` must NOT be ignored (track and commit, audit Media #4).
- `README.md` (Instalación section, "Node.js 18+") - Why: `engines >=18` must stay consistent with documented prereq.
- `AGENTS.md` (Working Rules + Build and Test) - Why: `npm run verify` must exit 0; stage named paths only, never `git add -A`; Conventional Commits.
- `scripts/verify.mjs` (tail: exit codes) - Why: CI depends on nonzero exit on failure — confirm `process.exit(1)` path exists.

### New Files to Create

- `.github/workflows/ci.yml` - CI workflow (checkout, setup-node 22, `npm ci`, `npm run check`).
- `.nvmrc` - Single line `22`.
- `.claude/plans/ci-p01-local.md` - This plan (already created).

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [GitHub Actions workflow syntax](https://docs.github.com/en/actions/reference/workflows/workflow-syntax-for-github-actions#on) - Specific section: `on.<push|pull_request>.<branches>` filters - Why: trigger scoping to `main` + all PRs.
- [actions/setup-node](https://github.com/actions/setup-node#usage) - Specific section: `node-version-file` - Why: pin via `.nvmrc` instead of hardcoding the version twice. (No `cache: npm` — deliberately omitted, audit Baja #11.)
- [npm ci docs](https://docs.npmjs.com/cli/v10/commands/npm-ci) - Specific section: requires existing lockfile - Why: proves `package-lock.json` must be committed, not ignored.

### Patterns to Follow

**Naming Conventions:** Conventional Commits (`chore:` scope for CI-only change); branch `chore/ci-p01` (piv-implement creates working branch by default).

**Error Handling:** Workflow must fail closed — any step failure reds the run; job `timeout-minutes: 3` + step `timeout-minutes: 2` on `npm ci` (bounds the 180s hang class observed 2026-09-04 without masking real failures for 10 minutes, audit Baja #12). No `; echo` after gates — bare commands so exit codes propagate (audit Alta #2).

**Other Relevant Patterns:** Minimal reversible diffs (repo rule); stage explicit paths only.

---

## IMPLEMENTATION PLAN

Phases run **top to bottom by default**.

### Phase 0: Prerequisite — Biome baseline on `main`

Without this, P0.1's CI (`npm run check` → `biome ci .`) fails on the runner where `biome.json` doesn't exist (audit Alta #1). Commit this session's Biome work first — its own commit/PR, merged before P0.1 starts.

**Tasks:**

- Commit: `biome.json`, `package.json` (scripts+devDep), formatted tree (`tokens/`, `themes/`, `adapters/`, `specs/brand.json`, `sources/manifest.json`, `fonts/manifest.json`, `scripts/verify.mjs` incl. try/catch), regenerated `SHA256SUMS`, `package-lock.json` (track and commit — `npm ci` requires it, audit Media #4), `.gitignore` (`node_modules/`).
- Prove `npm run check` exit 0 on `main` after merge.
- Cut `chore/ci-p01` from that clean `main`.

### Phase 1: Runtime contract (package.json + .nvmrc)

Local files, zero CI involvement. Establishes what runtime is authoritative before the workflow references it. (No staging task here — all staging happens once in the STAGE task, audit Media #5.)

**Tasks:**

- ADD `engines: { "node": ">=18" }` to `package.json` (after `devDependencies`, before `keywords`). Advisory locally; enforced in CI via `--engine-strict` (audit silent-failure #5 — `engines` alone warns and exits 0).
- CREATE `.nvmrc` with content `22\n`.

### Phase 2: Workflow

**Depends on:** Phase 0 (workflow assumes `biome.json` + `check` script exist on `main`) and Phase 1 (workflow references `.nvmrc`).

Single job, four steps. No matrix, no cache, no extra commands (Cole rule: `check` is exactly what CI runs).

```yaml
name: check
on:
  push:
    branches: [main]
  pull_request:
jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 3
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: actions/setup-node@1a4442cacd436585916779262731c5b162bc6ec7 # v4.2.0
        with:
          node-version-file: .nvmrc
      - run: npm ci --no-audit --no-fund --engine-strict
        timeout-minutes: 2
      - run: npm run check
```

(Action SHAs re-validate at execution time; major-version comments record intent. SHA-pinning per audit Baja #14 — `@v4` tags are mutable.)

### Phase 3: Stage + prove in isolation

Stage exactly 3 paths, then prove the staged set — not the polluted workdir — is green (audit Media #6: `npm run check` runs on the workdir, never on the index).

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### Phase-0 COMMIT Biome baseline (prerequisite)

- **IMPLEMENT**: Commit this session's Biome work on its own (message `chore: integrate biome lint and format`), merge to `main`, cut `chore/ci-p01` from there. Paths: `biome.json`, `package.json`, formatted tree, `SHA256SUMS`, `package-lock.json`, `.gitignore`.
- **GOTCHA**: P0.1 tasks below assume `npm run check` exists and is green on `main`. If Phase 0 is skipped, AC #2/AC #4 are unachievable — stop, do not proceed (audit Alta #1).
- **VALIDATE**: On clean `main`: `npm run check` exit 0.
- **SATISFIES**: Precondition for AC #1–AC #5.

### UPDATE package.json

- **IMPLEMENT**: ADD `"engines": { "node": ">=18" }` after the `devDependencies` block. Touch nothing else.
- **PATTERN**: Minimal key addition; 2-space indent (Biome `indentStyle: space`, `indentWidth: 2` — `biome.json`).
- **GOTCHA**: Do NOT add an `engines` range narrower than README ("Node.js 18+") — `>=18` is the documented floor; the pin lives in `.nvmrc`, not here. Enforcement comes from CI's `--engine-strict`, not this field alone.
- **VALIDATE**: `npm run lint:ci && node -e "const assert=require('node:assert'); const e=require('./package.json').engines; assert.strictEqual(e?.node, '>=18')"`
- **SATISFIES**: AC #2 (runtime floor declared and asserted, not merely printed — audit Media #10).

### CREATE .nvmrc

- **IMPLEMENT**: File content exactly `22` + trailing newline.
- **PATTERN**: No precedent in repo (first pin file); `.nvmrc` over `.node-version` (setup-node supports both; `.nvmrc` is the wider convention).
- **GOTCHA**: Must match the version the workflow resolves — workflow uses `node-version-file`, single source of truth, never hardcode `22` in the YAML.
- **VALIDATE**: `test "$(tr -d '\r\n' < .nvmrc)" = "22"`
- **SATISFIES**: AC #3 (local/CI runtime parity).

### CREATE .github/workflows/ci.yml

- **IMPLEMENT**: Exact YAML from Phase 2. Job id `check` (matches the npm script it runs — intentional naming).
- **PATTERN**: Job `timeout-minutes: 3`, step `timeout-minutes: 2` on `npm ci`; no `cache: npm`; actions pinned by SHA with version comments; `--engine-strict` on `npm ci`.
- **IMPORTS**: `actions/checkout@11bd71…` (# v4.2.2), `actions/setup-node@1a4442…` (# v4.2.0) — re-validate SHAs against upstream before writing (skill requirement).
- **GOTCHA**: Do NOT use `npm install` (hang evidence + Cole decision); do NOT add matrix/build/test/cache steps (no such scripts exist; cache costs more than it saves on 1 dep); do NOT reference secrets (none needed).
- **VALIDATE**: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))" && echo "YAML syntax OK"` (offline, zero-dependency — pyyaml confirmed present 2026-09-04; `npx js-yaml` rejected as network-dependent, audit Media #9). Grammar only — schema proof arrives with the first Actions run.
- **SATISFIES**: AC #1 (workflow exists with exact triggers/steps).

### STAGE named paths only (+ isolation exit-gate)

- **IMPLEMENT**: `git add .github/workflows/ci.yml .nvmrc package.json` — and nothing else.
- **PATTERN**: Named-path staging (global rule: never `git add -A` / `git add .`).
- **GOTCHA**: Pre-existing dirty files must NOT enter this commit. Prove the staged set in isolation (the workdir is polluted; `npm` never reads the index — audit Media #6): `git stash push --keep-index -m p01-check -q && npm run check; rc=$?; git stash pop -q; exit $rc` — must print `ALL VERIFICATIONS PASSED` AND `Checked 16 files … No fixes applied` with exit 0. Either half red → stop, do not push.
- **VALIDATE**: `diff <(git diff --name-only --cached | sort) <(printf '%s\n' .github/workflows/ci.yml .nvmrc package.json | sort)` — asserts the exact staged set, exit-nonzero on drift (audit Baja #13).
- **SATISFIES**: AC #4 (clean scoped diff) + AC #5 (staged set green in isolation, not merely the workdir).

---

## HANDOFF (manual — needs user authorization, out of local scope)

Pushed out of STEP-BY-STEP: this plan is local-write; push/PR are Git-mutating/external mutation and this plan alone does not grant them (audit Media #3).

### PUSH + OPEN PR

- **IMPLEMENT** (operator, after explicit go-ahead): Push `chore/ci-p01`, open PR against `main` (title `chore: enforce check on push and PR`).
- **GOTCHA**: `gh` needs auth (`gh auth status` first).
- **VALIDATE**: `sleep 5 && gh pr checks --watch --fail-fast` (no `green` arg — invalid syntax, audit Alta #3; sleep covers the webhook race; programmatic alternative: `gh pr checks --json name,state,bucket --jq '.[] | select(.bucket!="pass")'`).
- **SATISFIES**: AC #6 (CI proven on a real PR).

### Post-merge (owner): ruleset for `main` with `check` as required status. Without it, CI exists but does not enforce (Cole core objection).

---

## TESTING STRATEGY

No test suite exists in this repo (asset repo; Vitest explicitly deferred per Cole review). Strategy is gate-evidence, not unit tests:

### Unit Tests

n/a — no runner, no `src/`. Do not introduce one for this change.

### Integration Tests

The PR's Actions run IS the integration test: clean Ubuntu image + `npm ci` from the committed lockfile + `npm run check`.

### Edge Cases

- Lockfile missing from the pushed tree → `npm ci` fails loudly (by design; Phase 0 commits it).
- `.nvmrc`/workflow version drift → impossible by construction (`node-version-file`, single source).
- Action SHA rotated upstream → executor re-validates SHAs before writing YAML; version comments record intent.
- `npm` registry slowness (observed) → `--no-audit --no-fund` + job timeout 3min + step timeout 2min, no cache.
- Webhook race on fresh PR → `sleep 5` before `gh pr checks --watch --fail-fast` (audit Alta #3).
- Pre-existing dirty files leaking into the PR → named-path staging + diff-assert + stash isolation gate.
- Incompatible local Node → warns only (advisory); CI enforces via `--engine-strict` (audit silent-failure #5).

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions.

### Level 1: Syntax & Style

- `npm run lint:ci` — Biome over all 16 scoped files (covers edited `package.json`; YAML is not in Biome scope — covered offline by the pyyaml task validation above).

### Level 2: Unit Tests

- n/a (no suite; do not invent one).

### Level 3: Integration Tests

- `npm run check` — exit 0 (exact command CI will run; runs `verify` internally — no separate `verify` line, audit Media #7).
- `npm ci --dry-run` — exit 0 (proves lockfile/package.json sync before pushing; audit Baja #15).

### Level 4: Manual Validation (handoff — see HANDOFF)

- Staged set asserted by diff (STAGE task).
- PR → Actions `check` run green.
- Post-merge ruleset (owner, out of plan).

### Level 5: Additional Validation (Optional)

- `npm run pack:dry` — still packs (`.github/` and `.nvmrc` are outside `files[]` — pack unaffected; confirm no error).

---

## ACCEPTANCE CRITERIA

- [ ] AC #0 — Phase 0 merged: `main` contains `biome.json` + `check` script and `npm run check` is green there.
- [ ] AC #1 — `.github/workflows/ci.yml` exists with triggers `push: [main]` + `pull_request`, job `check` (`timeout-minutes: 3`), steps checkout@SHA → setup-node@SHA (`node-version-file: .nvmrc`, no cache) → `npm ci --no-audit --no-fund --engine-strict` (step timeout 2) → `npm run check`.
- [ ] AC #2 — `package.json` contains `engines: { "node": ">=18" }` (asserted programmatically), nothing else changed in the file vs Phase-0 `main`.
- [ ] AC #3 — `.nvmrc` contains `22`; workflow pins via file, no hardcoded version.
- [ ] AC #4 — Commit diff contains ONLY `.github/workflows/ci.yml`, `.nvmrc`, `package.json`; zero pre-existing dirty files (asserted by diff, not eyeballed).
- [ ] AC #5 — Staged set proven green in isolation (`stash --keep-index` gate): `ALL VERIFICATIONS PASSED` + `Checked 16 files … No fixes applied`, exit 0.
- [ ] AC #6 (manual handoff) — PR's Actions `check` run is green.
- [ ] Explicit non-AC: GitHub ruleset/required status NOT done here (owner manual follow-up).

---

## COMPLETION CHECKLIST

- [ ] Phase 0 merged; P0.1 branch cut from clean `main`
- [ ] All tasks completed in order
- [ ] Each task validation passed immediately
- [ ] `npm run lint:ci` green; YAML syntax OK offline
- [ ] No linting errors; staged set asserted to 3 paths
- [ ] Isolation gate green (staged set, not workdir)
- [ ] PR run green (manual handoff, needs authorization)
- [ ] Acceptance criteria all met (except declared non-AC)

---

## OPEN QUESTIONS / ASSUMPTIONS

All three GATE questions answered 2026-09-04 ("va con los recomendados"):

- Assumed — Node 22 single, no matrix. Rationale recorded: zero-dependency asset repo; matrix adds minutes per run for no signal.
- Assumed — `package-lock.json` committed (now in Phase 0, prerequisite for `npm ci`).
- Assumed — triggers push-to-main + all PRs. PR-only would leave direct pushes unchecked.
- Assumed — plan file at `.claude/plans/ci-p01-local.md` per skill contract (repo has no prior plans convention).
- Assumed — action SHAs re-validated at execution time; executor must re-check docs links before writing YAML (skill requirement).
- Audit record 2026-09-04: tmux-plan-auditor deterministic layer (4/4, 3 generic Baja patches, superseded) + 4 agy subagents (`gemini-3.8-flash-high`, serialized) — logic/quality/silent/testing, all APROBADO CON OBSERVACIONES (0.94–0.95). All 15 batched patches approved and applied here; deterministic trio marked rejected/superseded. (opencode-go/mimo-v2.5 lane blocked: no workspace balance; parallel `opencode run` in one workdir causes sqlite `database is locked` — serialize.)

## NOTES (open canvas)

- Alternatives rejected: Node matrix 20+22 (cost without signal); `npm install` in CI (hang evidence 2026-09-04 + Cole); PR-only triggers (hole on direct push); hardcoding `22` in YAML (two sources of truth); `engines` narrower than `>=18` (contradicts README); `cache: npm` (4–8s cache ops vs 1.5s clean install on 1 dep + 503 flakiness); `timeout-minutes: 10` (masks real hangs 3× longer than the observed one); `@v4` mutable tags (SHA pins + version comments); `npx js-yaml` (unpinned network fetch for an 18-line static file); `gh pr checks --watch green` (invalid — `green` parses as branch name).
- Why `.nvmrc` over `.node-version`: setup-node supports both; `.nvmrc` is the de-facto standard (nvm/fnm/asdf-compatible), `.node-version` narrower.
- Sequencing risk: P0.1's value is capped until the owner adds the ruleset — the plan's non-AC makes this visible rather than letting "CI exists" be mistaken for "enforcement" (Cole's core objection, preserved).
- Push/PR tasks live in HANDOFF, not STEP-BY-STEP: this plan authorizes local-write only; crossing into push/PR needs the explicit go-ahead at execution time, not from this plan.
- `verify.mjs` missing-dir hardening (`continue` → assert, lines 47/65) deliberately deferred to P1 backlog — it mutates `verify.mjs` semantics, out of P0.1's CI-only scope.

## AMENDMENTS

- 2026-09-04 — Audit-driven revision (agy 4-front audit, all approved batches applied): added Phase 0 Biome-baseline prerequisite (Alta #1); exit-code-safe validations (Alta #2); fixed `gh` syntax + webhook race (Alta #3); lockfile track-and-commit wording (Media #4); push/PR moved to HANDOFF with AC #6 manual (Media #3); stash isolation exit-gate (Media #6); removed duplicate `verify` line (Media #7); folded validate-task into STAGE (Media #8); offline pyyaml YAML check (Media #9); programmatic `engines` assert + CI `--engine-strict` (Media #10/silent #5); removed `cache: npm` (Baja #11); timeouts 3/2 (Baja #12); prose-free backticked commands (Baja #13); action SHA pins (Baja #14); `npm ci --dry-run` + verify-scope correction (Baja #15).
