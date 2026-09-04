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

// 1. SHA256SUMS Integrity Check
console.log("\n[1] Verifying SHA256SUMS against disk assets...");
const shaFile = path.join(root, "sources/SHA256SUMS");
assert(fs.existsSync(shaFile), "sources/SHA256SUMS exists");

if (fs.existsSync(shaFile)) {
  const lines = fs.readFileSync(shaFile, "utf-8").trim().split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;
    const [expectedHash, relPath] = line.trim().split(/\s+/);
    const targetFile = path.join(root, relPath);
    if (!fs.existsSync(targetFile)) {
      assert(false, `File missing for hash: ${relPath}`);
      continue;
    }
    const data = fs.readFileSync(targetFile);
    const actualHash = crypto.createHash("sha256").update(data).digest("hex");
    assert(actualHash === expectedHash, `SHA-256 match for ${relPath}`);
  }
}

// 2. JSON Validation
console.log("\n[2] Verifying JSON schemas and parsing...");
const jsonDirs = ["tokens", "themes", "sources", "fonts", "specs", "adapters/antd"];
for (const dir of jsonDirs) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) continue;
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
  const logoDir = path.join(root, "logos", sub);
  if (!fs.existsSync(logoDir)) continue;
  for (const f of fs.readdirSync(logoDir)) {
    if (f.endsWith(".svg")) {
      const p = path.join(logoDir, f);
      const content = fs.readFileSync(p, "utf-8");
      const hasSvgTag = content.includes("<svg") && content.includes("</svg>");
      const hasViewBox = content.includes("viewBox=");
      assert(hasSvgTag && hasViewBox, `SVG structure & viewBox for ${path.relative(root, p)}`);
    }
  }
}

// 4. Font & PDF Magic Bytes
console.log("\n[4] Verifying binary headers (WOFF2 / PDF)...");
const fontsDir = path.join(root, "fonts");
for (const f of fs.readdirSync(fontsDir)) {
  if (f.endsWith(".woff2")) {
    const buf = fs.readFileSync(path.join(fontsDir, f));
    const magic = buf.subarray(0, 4).toString("utf-8");
    assert(magic === "wOF2", `Magic bytes wOF2 for fonts/${f}`);
  }
}

const manualesDir = path.join(root, "manuales");
for (const f of fs.readdirSync(manualesDir)) {
  if (f.endsWith(".pdf")) {
    const buf = fs.readFileSync(path.join(manualesDir, f));
    const magic = buf.subarray(0, 4).toString("utf-8");
    assert(magic === "%PDF", `Magic bytes %PDF for manuales/${f}`);
  }
}

// 5. Token to CSS Correspondence
console.log("\n[5] Cross-checking Core Tokens against CSS Adapter...");
let coreTokens = null;
try {
  coreTokens = JSON.parse(fs.readFileSync(path.join(root, "tokens/core.json"), "utf-8"));
} catch (e) {
  assert(false, `tokens/core.json is not valid JSON: ${e.message}`);
}
if (coreTokens !== null) {
  const cssVars = fs.readFileSync(path.join(root, "adapters/css/variables.css"), "utf-8");
  const primaryHex = coreTokens.color.blue.institutional.value.toLowerCase();
  assert(
    cssVars.toLowerCase().includes(primaryHex),
    `Primary blue ${primaryHex} mapped in adapters/css/variables.css`
  );
}

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
    assert(fs.existsSync(shaFile), "sources/SHA256SUMS exists for manifest cross-check");
    const shaMap = new Map();
    if (fs.existsSync(shaFile)) {
      for (const line of fs.readFileSync(shaFile, "utf-8").trim().split("\n")) {
        if (!line.trim()) continue;
        const [hash, relPath] = line.trim().split(/\s+/);
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
