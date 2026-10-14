import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

console.log("=== FALP Brand System Verification Suite ===");
let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failures++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

const HEX = /^#[0-9a-f]{6}$/i;
const SEMANTIC_SKIP_KEYS = new Set(["$schema", "name", "version"]);

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function listDir(p) {
  try {
    return fs.readdirSync(p);
  } catch {
    return [];
  }
}

function requireDir(dir) {
  const ok = isDir(path.join(root, dir));
  if (!ok) assert(false, `Required directory missing: ${dir}/`);
  return ok;
}

function readText(relPath) {
  const p = path.join(root, relPath);
  if (!isFile(p)) {
    assert(false, `Cannot read ${relPath}: missing or not a file`);
    return null;
  }
  try {
    return fs.readFileSync(p, "utf-8");
  } catch (e) {
    assert(false, `Cannot read ${relPath}: ${e.message}`);
    return null;
  }
}

function readBytes(relPath) {
  const p = path.join(root, relPath);
  try {
    return fs.readFileSync(p);
  } catch (e) {
    assert(false, `Cannot read ${relPath}: ${e.message}`);
    return null;
  }
}

function readJson(relPath) {
  const text = readText(relPath);
  if (text === null) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    assert(false, `Invalid JSON in ${relPath}: ${e.message}`);
    return null;
  }
}

function show(value) {
  return value === undefined ? "(missing)" : JSON.stringify(value);
}

// Missing (undefined) values always fail, so a deleted key cannot pass silently.
function assertEqual(label, expected, actual, { ci = false } = {}) {
  const norm = (v) => (ci && typeof v === "string" ? v.toLowerCase() : v);
  const ok = expected !== undefined && actual !== undefined && norm(actual) === norm(expected);
  assert(ok, ok ? label : `${label}: expected ${show(expected)}, actual ${show(actual)}`);
}

function assertHex(label, value) {
  const ok = typeof value === "string" && HEX.test(value);
  assert(
    ok,
    ok ? `${label} is a valid hex color` : `${label}: expected #rrggbb, actual ${show(value)}`
  );
}

function assertFontFamily(label, value, expectedPrefix) {
  const ok =
    typeof value === "string" &&
    typeof expectedPrefix === "string" &&
    value.trim().startsWith(expectedPrefix);
  assert(
    ok,
    ok
      ? `${label} starts with ${expectedPrefix}`
      : `${label}: expected font family starting with ${show(expectedPrefix)}, actual ${show(value)}`
  );
}

function getPath(obj, dotted) {
  let cur = obj;
  for (const key of dotted.split(".")) {
    if (cur === null || typeof cur !== "object" || !(key in cur)) return undefined;
    cur = cur[key];
  }
  return cur;
}

// Body of the first top-level `:root { ... }` block, comments stripped. Null (with FAIL) when absent.
function rootBlock(css, label) {
  if (css === null) return null;
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const match = stripped.match(/:root\s*\{([\s\S]*?)\n\}/);
  if (!match) {
    assert(false, `${label}: no :root { } block found`);
    return null;
  }
  return match[1];
}

// Value of a CSS custom property inside a block body, including multi-line values.
// Undefined when absent.
function cssVar(body, name) {
  if (body === null) return undefined;
  const match = body.match(new RegExp(`(?:^|[\\s{;])${name}\\s*:\\s*([^;]*);`));
  return match ? match[1].replace(/\s+/g, " ").trim() : undefined;
}

// Visits every object that carries a "value" key (a token leaf).
function walkTokens(node, prefix, visit) {
  if (node === null || typeof node !== "object" || Array.isArray(node)) return;
  if ("value" in node) {
    visit(prefix, node);
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    walkTokens(child, prefix ? `${prefix}.${key}` : key, visit);
  }
}

// 0. Required repository layout
console.log("\n[0] Verifying required repository layout...");
const REQUIRED_DIRS = [
  "tokens",
  "themes",
  "sources",
  "fonts",
  "specs",
  "adapters/antd",
  "adapters/css",
  "logos/official",
  "logos/derived",
  "manuales",
];
const REQUIRED_FILES = [
  "tokens/core.json",
  "tokens/semantic.json",
  "adapters/css/variables.css",
  "adapters/css/variables.dark.css",
  "adapters/css/fonts.css",
  "adapters/antd/theme.json",
  "themes/default.json",
  "themes/dark.json",
  "themes/compact.json",
  "sources/SHA256SUMS",
  "sources/manifest.json",
];
const MIN_ASSETS = [
  { dir: "fonts", ext: ".woff2" },
  { dir: "manuales", ext: ".pdf" },
  { dir: "logos/official", ext: ".svg" },
];

for (const dir of REQUIRED_DIRS) {
  if (!requireDir(dir)) continue;
  const count = listDir(path.join(root, dir)).length;
  assert(count > 0, `Required directory is not empty: ${dir}/ (found ${count} entries)`);
}
for (const file of REQUIRED_FILES) {
  const ok = isFile(path.join(root, file));
  assert(ok, ok ? `Required file present: ${file}` : `Required file missing: ${file}`);
}
for (const { dir, ext } of MIN_ASSETS) {
  if (!requireDir(dir)) continue;
  const count = listDir(path.join(root, dir)).filter((f) => f.endsWith(ext)).length;
  assert(
    count >= 1,
    count >= 1
      ? `At least one ${ext} asset in ${dir}/ (found ${count})`
      : `At least one ${ext} asset in ${dir}/: expected >= 1, actual ${count}`
  );
}

// 1. SHA256SUMS Integrity Check
console.log("\n[1] Verifying SHA256SUMS against disk assets...");
const shaFile = path.join(root, "sources/SHA256SUMS");
assert(isFile(shaFile), "sources/SHA256SUMS exists");

const shaText = readText("sources/SHA256SUMS");
if (shaText !== null) {
  const lines = shaText.trim().split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;
    const [expectedHash, relPath] = line.trim().split(/\s+/);
    if (!relPath) {
      assert(false, `Malformed SHA256SUMS line (no path): ${line.trim()}`);
      continue;
    }
    const targetFile = path.join(root, relPath);
    if (!fs.existsSync(targetFile)) {
      assert(false, `File missing for hash: ${relPath}`);
      continue;
    }
    let data;
    try {
      data = fs.readFileSync(targetFile);
    } catch (e) {
      assert(false, `Cannot read ${relPath} for hashing: ${e.message}`);
      continue;
    }
    const actualHash = crypto.createHash("sha256").update(data).digest("hex");
    assert(actualHash === expectedHash, `SHA-256 match for ${relPath}`);
  }
}

// 2. JSON Validation
console.log("\n[2] Verifying JSON schemas and parsing...");
const jsonDirs = ["tokens", "themes", "sources", "fonts", "specs", "adapters/antd"];
for (const dir of jsonDirs) {
  if (!requireDir(dir)) continue;
  const fullDir = path.join(root, dir);
  for (const f of fs.readdirSync(fullDir)) {
    if (f.endsWith(".json")) {
      const p = path.join(fullDir, f);
      try {
        JSON.parse(fs.readFileSync(p, "utf-8"));
        assert(true, `Valid JSON: ${path.relative(root, p)}`);
      } catch (e) {
        assert(false, `Invalid JSON in ${path.relative(root, p)}: ${e.message}`);
      }
    }
  }
}

// 3. SVG XML & viewBox Validation
console.log("\n[3] Verifying SVG vector assets...");
for (const sub of ["official", "derived"]) {
  const logoDir = `logos/${sub}`;
  if (!requireDir(logoDir)) continue;
  for (const f of listDir(path.join(root, logoDir))) {
    if (f.endsWith(".svg")) {
      const rel = `${logoDir}/${f}`;
      const content = readText(rel);
      if (content === null) continue;
      const hasSvgTag = content.includes("<svg") && content.includes("</svg>");
      const hasViewBox = content.includes("viewBox=");
      assert(hasSvgTag && hasViewBox, `SVG structure & viewBox for ${rel}`);
    }
  }
}

// 4. Font & PDF Magic Bytes
console.log("\n[4] Verifying binary headers (WOFF2 / PDF)...");
if (requireDir("fonts")) {
  for (const f of listDir(path.join(root, "fonts"))) {
    if (f.endsWith(".woff2")) {
      const buf = readBytes(`fonts/${f}`);
      if (buf === null) continue;
      const magic = buf.subarray(0, 4).toString("utf-8");
      assert(magic === "wOF2", `Magic bytes wOF2 for fonts/${f}`);
    }
  }
}

if (requireDir("manuales")) {
  for (const f of listDir(path.join(root, "manuales"))) {
    if (f.endsWith(".pdf")) {
      const buf = readBytes(`manuales/${f}`);
      if (buf === null) continue;
      const magic = buf.subarray(0, 4).toString("utf-8");
      assert(magic === "%PDF", `Magic bytes %PDF for manuales/${f}`);
    }
  }
}

// 5. Token mappings: core -> semantic -> antd / themes / CSS adapters
console.log("\n[5] Cross-checking token mappings (core, semantic, antd, themes, CSS)...");
const core = readJson("tokens/core.json");
const semantic = readJson("tokens/semantic.json");
const antd = readJson("adapters/antd/theme.json");
const themes = {
  default: readJson("themes/default.json"),
  compact: readJson("themes/compact.json"),
  dark: readJson("themes/dark.json"),
};
// Only the :root block is read; the .dark { } block in variables.css must not supply light values.
const cssLight = rootBlock(readText("adapters/css/variables.css"), "adapters/css/variables.css");
const cssDark = rootBlock(
  readText("adapters/css/variables.dark.css"),
  "adapters/css/variables.dark.css"
);

// 5a. Every color token in core.json is a valid hex value.
let coreColorCount = 0;
walkTokens(core?.color, "color", (key, leaf) => {
  if (leaf.type !== "color") return;
  coreColorCount++;
  assertHex(`tokens/core.json ${key}`, leaf.value);
});
assert(coreColorCount > 0, `tokens/core.json defines color tokens (found ${coreColorCount})`);

// Expected values, taken from core and referenced by every adapter below.
const INSTITUTIONAL = "color.blue.institutional.value";
const DEEP = "color.blue.deep.value";
const CANVAS = "color.blue.canvas.value";
const BODY_FONT = "typography.web_derived.body";
const bodyFont = getPath(core, BODY_FONT);

// 5b. Every semantic leaf: references must resolve to core, literals must be hex and match resolved.
walkTokens(
  semantic
    ? Object.fromEntries(Object.entries(semantic).filter(([k]) => !SEMANTIC_SKIP_KEYS.has(k)))
    : null,
  "",
  (key, leaf) => {
    const label = `tokens/semantic.json ${key}`;
    const ref = typeof leaf.value === "string" ? leaf.value.match(/^\{([^{}]+)\}$/) : null;
    if (ref) {
      const target = getPath(core, `${ref[1]}.value`);
      if (target === undefined) {
        assert(
          false,
          `${label}: reference {${ref[1]}} does not exist in tokens/core.json (expected ${ref[1]}.value)`
        );
        return;
      }
      assertEqual(`${label} resolved matches core ${ref[1]}`, target, leaf.resolved, { ci: true });
    } else {
      assertHex(`${label} literal value`, leaf.value);
      assertEqual(`${label} value equals resolved`, leaf.value, leaf.resolved, { ci: true });
    }
  }
);

// 5c. antd token mapping.
const ANTD_MAP = [
  ["colorPrimary", INSTITUTIONAL],
  ["colorInfo", INSTITUTIONAL],
  ["colorLink", INSTITUTIONAL],
  ["colorTextBase", DEEP],
  ["colorBgBase", CANVAS],
];
for (const [key, corePath] of ANTD_MAP) {
  assertEqual(
    `adapters/antd/theme.json token.${key} matches core ${corePath}`,
    getPath(core, corePath),
    getPath(antd, `token.${key}`),
    { ci: true }
  );
}
assertFontFamily(
  "adapters/antd/theme.json token.fontFamily",
  getPath(antd, "token.fontFamily"),
  bodyFont
);

// 5d. Theme JSON mapping (top-level keys).
const THEME_MAP = [
  ["colorPrimary", INSTITUTIONAL],
  ["colorInfo", INSTITUTIONAL],
  ["colorLink", INSTITUTIONAL],
];
for (const name of ["default", "compact"]) {
  for (const [key, corePath] of THEME_MAP) {
    assertEqual(
      `themes/${name}.json ${key} matches core ${corePath}`,
      getPath(core, corePath),
      getPath(themes[name], key),
      { ci: true }
    );
  }
  assertFontFamily(`themes/${name}.json fontFamily`, getPath(themes[name], "fontFamily"), bodyFont);
}
// Dark primary is derived, not a core token: only require a valid hex.
assertHex("themes/dark.json colorPrimary", getPath(themes.dark, "colorPrimary"));
assertFontFamily("themes/dark.json fontFamily", getPath(themes.dark, "fontFamily"), bodyFont);

// 5e. CSS adapters.
const CSS_MAP = [
  ["--brand-color-primary", INSTITUTIONAL],
  ["--brand-color-info", INSTITUTIONAL],
  ["--brand-color-link", INSTITUTIONAL],
  ["--brand-color-bg-container", CANVAS],
];
for (const [name, corePath] of CSS_MAP) {
  assertEqual(
    `adapters/css/variables.css ${name} matches core ${corePath}`,
    getPath(core, corePath),
    cssVar(cssLight, name),
    { ci: true }
  );
}
assertFontFamily(
  "adapters/css/variables.css --brand-font-family",
  cssVar(cssLight, "--brand-font-family"),
  bodyFont
);
assertHex(
  "adapters/css/variables.dark.css --brand-color-primary",
  cssVar(cssDark, "--brand-color-primary")
);

// 6. Agent Skill Verification
console.log("\n[6] Verifying Agent Skill frontmatter...");
const skillPath = path.join(root, ".agents/skills/falp-branding/SKILL.md");
assert(fs.existsSync(skillPath), ".agents/skills/falp-branding/SKILL.md exists");
if (fs.existsSync(skillPath)) {
  const content = fs.readFileSync(skillPath, "utf-8");
  assert(content.startsWith("---"), "SKILL.md starts with YAML frontmatter");
  assert(content.includes("name: falp-branding"), "SKILL.md defines name: falp-branding");
  assert(content.includes("description:"), "SKILL.md defines description trigger");
}

// 7. Manifest ↔ SHA256SUMS ↔ Disk Consistency
console.log("\n[7] Verifying manifest ↔ SHA256SUMS ↔ disk consistency...");
let manifest = null;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(root, "sources/manifest.json"), "utf-8"));
} catch (e) {
  assert(false, `sources/manifest.json is not valid JSON: ${e.message}`);
}
if (manifest !== null) {
  assert(Array.isArray(manifest), "sources/manifest.json is an array");
  if (Array.isArray(manifest)) {
    assert(isFile(shaFile), "sources/SHA256SUMS exists for manifest cross-check");
    const shaMap = new Map();
    if (shaText !== null) {
      for (const line of shaText.trim().split("\n")) {
        if (!line.trim()) continue;
        const [hash, relPath] = line.trim().split(/\s+/);
        if (!relPath) continue;
        shaMap.set(relPath, hash);
      }
    }
    const seen = new Set();
    for (const entry of manifest) {
      const label = entry && typeof entry.path === "string" ? entry.path : "(missing path)";
      assert(entry && typeof entry.path === "string", `Manifest entry has string path (${label})`);
      assert(
        entry && typeof entry.sha256 === "string",
        `Manifest entry has string sha256 (${label})`
      );
      assert(
        entry && typeof entry.bytes === "number",
        `Manifest entry has numeric bytes (${label})`
      );
      if (!entry || typeof entry.path !== "string") continue;
      assert(!seen.has(entry.path), `No duplicate manifest path: ${entry.path}`);
      seen.add(entry.path);
      let data = null;
      try {
        data = fs.readFileSync(path.join(root, entry.path));
      } catch {
        assert(false, `Manifest file missing on disk: ${entry.path}`);
        continue;
      }
      const actualHash = crypto.createHash("sha256").update(data).digest("hex");
      assert(actualHash === entry.sha256, `Manifest SHA-256 match for ${entry.path}`);
      assert(data.length === entry.bytes, `Manifest byte size match for ${entry.path}`);
      assert(shaMap.has(entry.path), `Manifest path present in SHA256SUMS: ${entry.path}`);
      if (shaMap.has(entry.path)) {
        assert(
          shaMap.get(entry.path) === entry.sha256,
          `Manifest hash matches SHA256SUMS for ${entry.path}`
        );
      }
    }
    for (const relPath of shaMap.keys()) {
      assert(seen.has(relPath), `SHA256SUMS path present in manifest: ${relPath}`);
    }
  }
}

console.log("\n===========================================");
if (failures === 0) {
  console.log("🎉 ALL VERIFICATIONS PASSED (0 failures)");
  process.exit(0);
} else {
  console.error(`💥 VERIFICATION FAILED with ${failures} errors`);
  process.exit(1);
}
