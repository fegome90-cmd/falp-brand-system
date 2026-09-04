import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, test } from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const verifierSource = path.join(repositoryRoot, "scripts/verify.mjs");
const temporaryRoots = new Set();

afterEach(async () => {
  await Promise.all(
    [...temporaryRoots].map((temporaryRoot) =>
      fs.rm(temporaryRoot, { recursive: true, force: true })
    )
  );
  temporaryRoots.clear();
});

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

async function writeFixtureFile(root, relativePath, data) {
  const target = path.join(root, relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, data);
}

async function createValidFixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "falp-verify-test-"));
  temporaryRoots.add(root);

  const asset = Buffer.from("canonical fixture asset\n");
  const assetHash = sha256(asset);
  const manifest = [
    {
      path: "fixture/asset.txt",
      classification: "test-fixture",
      sha256: assetHash,
      bytes: asset.length,
    },
  ];

  await Promise.all([
    fs.mkdir(path.join(root, "fonts"), { recursive: true }),
    fs.mkdir(path.join(root, "manuales"), { recursive: true }),
    writeFixtureFile(root, "scripts/verify.mjs", await fs.readFile(verifierSource)),
    writeFixtureFile(root, "fixture/asset.txt", asset),
    writeFixtureFile(root, "sources/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`),
    writeFixtureFile(root, "sources/SHA256SUMS", `${assetHash}  fixture/asset.txt\n`),
    writeFixtureFile(
      root,
      "tokens/core.json",
      `${JSON.stringify({ color: { blue: { institutional: { value: "#004990" } } } })}\n`
    ),
    writeFixtureFile(root, "adapters/css/variables.css", ":root { --brand-blue: #004990; }\n"),
    writeFixtureFile(
      root,
      ".agents/skills/falp-branding/SKILL.md",
      "---\nname: falp-branding\ndescription: Test fixture\n---\n"
    ),
  ]);

  return { asset, assetHash, manifest, root };
}

function runVerifier(root) {
  const result = spawnSync(process.execPath, ["scripts/verify.mjs"], {
    cwd: root,
    encoding: "utf8",
  });

  return {
    ...result,
    output: `${result.stdout}${result.stderr}`,
  };
}

function assertVerificationFailure(result, expectedMessage) {
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /VERIFICATION FAILED/);
  assert.match(result.output, expectedMessage);
  assert.equal(result.signal, null);
}

describe("scripts/verify.mjs provenance consistency", () => {
  test("accepts a manifest, checksum index, and disk asset that agree", async () => {
    const { root } = await createValidFixture();

    const result = runVerifier(root);

    assert.equal(result.status, 0, result.output);
    assert.match(result.output, /Manifest SHA-256 match for fixture\/asset\.txt/);
    assert.match(result.output, /Manifest byte size match for fixture\/asset\.txt/);
    assert.match(result.output, /Manifest hash matches SHA256SUMS for fixture\/asset\.txt/);
    assert.match(result.output, /ALL VERIFICATIONS PASSED \(0 failures\)/);
  });

  test("reports malformed core token JSON without aborting the suite", async () => {
    const { root } = await createValidFixture();
    await writeFixtureFile(root, "tokens/core.json", "{not-json\n");

    const result = runVerifier(root);

    assertVerificationFailure(result, /tokens\/core\.json is not valid JSON/);
    assert.match(result.output, /\[7\] Verifying manifest/);
  });

  test("reports malformed manifest JSON without an uncaught exception", async () => {
    const { root } = await createValidFixture();
    await writeFixtureFile(root, "sources/manifest.json", "[not-json\n");

    const result = runVerifier(root);

    assertVerificationFailure(result, /sources\/manifest\.json is not valid JSON/);
    assert.doesNotMatch(result.output, /at file:\/\//);
  });

  test("requires the manifest root to be an array", async () => {
    const { root } = await createValidFixture();
    await writeFixtureFile(root, "sources/manifest.json", '{"entries": []}\n');

    const result = runVerifier(root);

    assertVerificationFailure(result, /sources\/manifest\.json is an array/);
  });

  test("validates path, hash, and byte-count field types", async () => {
    const { assetHash, root } = await createValidFixture();
    const malformedEntries = [
      null,
      { path: 42, sha256: assetHash, bytes: 1 },
      { path: "fixture/asset.txt", sha256: 42, bytes: "24" },
    ];
    await writeFixtureFile(
      root,
      "sources/manifest.json",
      `${JSON.stringify(malformedEntries)}\n`
    );

    const result = runVerifier(root);

    assertVerificationFailure(result, /Manifest entry has string path \(\(missing path\)\)/);
    assert.match(result.output, /Manifest entry has string sha256 \(fixture\/asset\.txt\)/);
    assert.match(result.output, /Manifest entry has numeric bytes \(fixture\/asset\.txt\)/);
  });

  test("rejects duplicate manifest paths", async () => {
    const { manifest, root } = await createValidFixture();
    await writeFixtureFile(
      root,
      "sources/manifest.json",
      `${JSON.stringify([...manifest, ...manifest])}\n`
    );

    const result = runVerifier(root);

    assertVerificationFailure(result, /No duplicate manifest path: fixture\/asset\.txt/);
  });

  test("reports a manifest file that is missing from disk", async () => {
    const { root } = await createValidFixture();
    await fs.rm(path.join(root, "fixture/asset.txt"));

    const result = runVerifier(root);

    assertVerificationFailure(result, /Manifest file missing on disk: fixture\/asset\.txt/);
  });

  test("detects incorrect manifest hashes and byte counts", async () => {
    const { manifest, root } = await createValidFixture();
    const alteredManifest = [
      {
        ...manifest[0],
        sha256: "0".repeat(64),
        bytes: manifest[0].bytes + 1,
      },
    ];
    await writeFixtureFile(root, "sources/manifest.json", `${JSON.stringify(alteredManifest)}\n`);

    const result = runVerifier(root);

    assertVerificationFailure(result, /Manifest SHA-256 match for fixture\/asset\.txt/);
    assert.match(result.output, /Manifest byte size match for fixture\/asset\.txt/);
    assert.match(result.output, /Manifest hash matches SHA256SUMS for fixture\/asset\.txt/);
  });

  test("requires every manifest path to appear in SHA256SUMS", async () => {
    const { root } = await createValidFixture();
    await writeFixtureFile(root, "sources/SHA256SUMS", "\n");

    const result = runVerifier(root);

    assertVerificationFailure(result, /Manifest path present in SHA256SUMS: fixture\/asset\.txt/);
  });

  test("requires every SHA256SUMS path to appear in the manifest", async () => {
    const { assetHash, root } = await createValidFixture();
    const extraAsset = Buffer.from("checksum-only fixture\n");
    await writeFixtureFile(root, "fixture/checksum-only.txt", extraAsset);
    await writeFixtureFile(
      root,
      "sources/SHA256SUMS",
      `${assetHash}  fixture/asset.txt\n${sha256(extraAsset)}  fixture/checksum-only.txt\n`
    );

    const result = runVerifier(root);

    assertVerificationFailure(
      result,
      /SHA256SUMS path present in manifest: fixture\/checksum-only\.txt/
    );
  });

  test("detects disagreement between a manifest hash and SHA256SUMS", async () => {
    const { root } = await createValidFixture();
    await writeFixtureFile(root, "sources/SHA256SUMS", `${"f".repeat(64)}  fixture/asset.txt\n`);

    const result = runVerifier(root);

    assertVerificationFailure(result, /Manifest hash matches SHA256SUMS for fixture\/asset\.txt/);
  });

  test("fails closed when SHA256SUMS is missing", async () => {
    const { root } = await createValidFixture();
    await fs.rm(path.join(root, "sources/SHA256SUMS"));

    const result = runVerifier(root);

    assertVerificationFailure(result, /sources\/SHA256SUMS exists for manifest cross-check/);
  });
});
