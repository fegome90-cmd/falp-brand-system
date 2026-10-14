import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import { openSync } from "fontkit";

const manifest = JSON.parse(readFileSync("fonts/manifest.json", "utf8"));
const custody = JSON.parse(readFileSync("sources/manifest.json", "utf8"));
const spanish = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ÁÉÍÓÚÜÑáéíóúüñ¡¿«»€";
for (const [role, family, min, max] of [["body", "Inter", 400, 800], ["display", "Montserrat", 600, 900]]) {
  test(`${family}: binary Spanish coverage, variable weights and licensed provenance`, () => {
    const record = manifest.digital_web_derived[role];
    const file = record.files[0];
    const font = openSync(file);
    assert.ok(font.familyName.startsWith(family), font.familyName);
    for (const char of spanish) assert.ok(font.hasGlyphForCodePoint(char.codePointAt(0)), `${family}: missing ${char}`);
    assert.ok(font.variationAxes.wght.min <= min && font.variationAxes.wght.max >= max);
    for (const weight of record.weights) {
      assert.ok(Number(weight) >= min && Number(weight) <= max);
      const run = font.layout("Información, corazón, Ñandú");
      assert.ok(run.glyphs.every(g => g.id !== 0));
      assert.ok(run.positions.every(p => Number.isFinite(p.xAdvance) && p.xAdvance >= 0));
    }
    assert.equal(record.subset, "latin");
    assert.ok(record.source_url.startsWith("https://fonts.gstatic.com/"));
    assert.match(readFileSync(record.license, "utf8"), /SIL OPEN FONT LICENSE Version 1.1/);
    for (const path of [file, record.license]) {
      const bytes = readFileSync(path);
      assert.equal(createHash("sha256").update(bytes).digest("hex"), custody.find(r => r.path === path).sha256);
    }
  });
}
