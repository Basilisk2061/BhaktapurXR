import assert from "node:assert/strict";
import { test } from "node:test";
import { validateWorldData, parseLandmarkModelPath } from "../src/lib/landmark-validation.ts";
import { landmarks, sources, developmentReference, localOrigin } from "../src/data/world/registry.ts";
import { resolveWorldMode, worldSpawns } from "../src/game/world/world-mode.ts";
import { createPlayerInput, pressGameplayKey, consumeJump } from "../src/game/input/player-input.ts";

test("architectural registry stays empty, geographic origin unresolved and synthetic fixture explicit", () => {
  assert.deepEqual(landmarks, []);
  assert.equal(new Set(sources.map(s => s.id)).size, sources.length);
  validateWorldData(landmarks, sources);
  assert.equal(localOrigin.geographicOrigin, null);
  validateWorldData([developmentReference], sources);
  assert.equal(developmentReference.accuracy, "PLACEHOLDER");
  assert.equal(developmentReference.developmentOnly, true);
  assert.equal(resolveWorldMode("bhaktapur"), "BHAKTAPUR");
  assert.equal(resolveWorldMode("invalid"), "BHAKTAPUR");
  assert.equal(resolveWorldMode("engineering"), "ENGINEERING");
  assert.notDeepEqual(worldSpawns.BHAKTAPUR, worldSpawns.ENGINEERING);
});

test("validator rejects missing/duplicate IDs, invalid transforms, bounds, accuracy and paths", () => {
  const invalid = [
    { id: "" }, { transform: { ...developmentReference.transform, position: [NaN, 0, 0] } },
    { transform: { ...developmentReference.transform, scale: [1, -1, 1] } },
    { approximateDimensions: { width: 0, height: 1, depth: 1 } }, { accuracy: "GUESS" },
    { modelAssetPath: "https://example.invalid/temple.glb" },
    { modelAssetPath: "/assets/models/architecture/../temple.glb" }, { sourceIds: ["missing"] },
  ];
  for (const patch of invalid) assert.throws(() => validateWorldData([{ ...developmentReference, ...patch }], []));
  assert.throws(() => validateWorldData([developmentReference, developmentReference], []));
  assert.deepEqual(parseLandmarkModelPath("/assets/models/architecture/local.glb"), { category: "architecture", filename: "local.glb" });
});

test("VERIFIED and APPROXIMATE require real source entries with supported claims", () => {
  for (const accuracy of ["VERIFIED", "APPROXIMATE"]) {
    const l = { ...developmentReference, developmentOnly: false, accuracy };
    assert.throws(() => validateWorldData([l], []));
    const source = { id: "test-evidence", title: "Unit test evidence fixture", type: "other", reference: "Synthetic test only", supportedClaims: ["Test dimensions"] };
    validateWorldData([{ ...l, sourceIds: [source.id] }], [source]);
    assert.throws(() => validateWorldData([{ ...l, sourceIds: [source.id] }], [{ ...source, supportedClaims: [] }]));
    assert.throws(() => validateWorldData([], [source, source]));
  }
});

test("held Space cannot repeat; airborne and unfocused requests do not buffer", () => {
  const input = createPlayerInput(0, 0); input.active = true;
  let now = 0; // Separate jumps, outside the double-Space flight window.
  pressGameplayKey(input, "Space", false, now += 500); assert.equal(consumeJump(input, true), true);
  pressGameplayKey(input, "Space", true); assert.equal(consumeJump(input, true), false);
  pressGameplayKey(input, "Space", false, now += 500); assert.equal(consumeJump(input, true), false);
  input.keys.delete("Space"); pressGameplayKey(input, "Space", false, now += 500);
  assert.equal(consumeJump(input, false), false); assert.equal(consumeJump(input, true), false);
  input.keys.delete("Space"); pressGameplayKey(input, "Space", false, now += 500);
  assert.equal(consumeJump(input, true), true);
  input.keys.delete("Space"); pressGameplayKey(input, "Space", false, now += 500); input.active = false;
  assert.equal(consumeJump(input, true), false);
});
