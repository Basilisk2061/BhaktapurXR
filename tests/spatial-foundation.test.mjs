import assert from "node:assert/strict";
import { test } from "node:test";
import { mapPointToLocal, validateCalibration, buildSpatialRegistry, validateSpatialFeatures, polygonArea } from "../src/lib/map-calibration.ts";
import { mapCalibrations, mapFeatures, calibrationStatus, bhaktapurGround } from "../src/data/world/map-measurements.ts";
import { spatialFeatures } from "../src/data/world/spatial-registry.ts";
import { sources, localOrigin } from "../src/data/world/registry.ts";
import { bhaktapurComponent } from "../src/data/world/sources.ts";
import { worldSpawns } from "../src/game/world/world-mode.ts";

// Synthetic math fixtures only: these are NOT UNESCO measurements or Bhaktapur geometry.
const calibration = {
  id: "synthetic-calibration", sourceId: sources[0].id, pageIndex: 0,
  image: { width: 1000, height: 1000, sha256: "a".repeat(64) }, origin: [500, 500],
  scaleBar: { start: [100, 900], end: [300, 900], metres: 100 },
  northArrow: { base: [900, 200], tip: [900, 100] },
  accuracy: "APPROXIMATE", measurementMethod: "Synthetic unit-test ruler", uncertaintyNote: "No real data",
};
const feature = {
  id: "synthetic-footprint", name: "Synthetic test footprint", kind: "building-footprint",
  sourceIds: [sources[0].id], calibrationId: calibration.id,
  vertices: [[500, 500], [520, 500], [520, 520], [500, 520]],
  accuracy: "APPROXIMATE", measurementMethod: "Synthetic fixture", uncertaintyNote: "Not real data",
};
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test("official source metadata does not masquerade as calibrated geometry", () => {
  assert.equal(bhaktapurComponent.id, "121bis-003");
  assert.equal(bhaktapurComponent.propertyAreaHa, 3.61); assert.equal(bhaktapurComponent.bufferAreaHa, 10.71);
  assert.equal(bhaktapurComponent.accuracy, "VERIFIED");
  for (const id of bhaktapurComponent.sourceIds) assert.ok(sources.some(s => s.id === id));
  assert.equal(calibrationStatus.state, "CALIBRATED_APPROXIMATE");
  assert.deepEqual(calibrationStatus.imageDimensions, [3300, 2550]);
  assert.equal(mapCalibrations.length, 1); assert.equal(mapFeatures.length, 17); assert.equal(spatialFeatures.length, 17);
  assert.ok(spatialFeatures.every(f => f.accuracy === "APPROXIMATE" && f.heightMetres === null));
  assert.equal(localOrigin.geographicOrigin, null);
  assert.equal(localOrigin.northAxis, "-Z"); assert.equal(localOrigin.eastAxis, "+X");
  assert.equal(bhaktapurGround.accuracy, "PLACEHOLDER");
  const [x, y, z] = worldSpawns.BHAKTAPUR.position;
  assert.ok(Math.abs(x) < bhaktapurGround.size / 2 && Math.abs(z) < bhaktapurGround.size / 2 && y > bhaktapurGround.surfaceY);
});

test("calibrated map origin/east/north convert to metre X/Z without geographic assumptions", () => {
  validateCalibration(calibration, sources);
  const origin = mapPointToLocal([500, 500], calibration); close(origin[0], 0); close(origin[1], 0);
  assert.deepEqual(mapPointToLocal([520, 500], calibration), [10, -0]);
  assert.deepEqual(mapPointToLocal([500, 480], calibration), [0, -10]);
  assert.deepEqual(mapPointToLocal([480, 520], calibration), [-10, 10]);
  const world = buildSpatialRegistry([feature], [calibration], sources);
  close(polygonArea(world[0].vertices), 100); assert.equal(world[0].heightMetres, null);
  assert.equal(world[0].accuracy, "APPROXIMATE");
});

test("rotated and differently sized rasters preserve directions and distances", () => {
  const rotated = { ...calibration, northArrow: { base: [800, 200], tip: [900, 200] } };
  const n = mapPointToLocal([520, 500], rotated); close(n[0], 0); close(n[1], -10);
  const e = mapPointToLocal([500, 520], rotated); close(e[0], 10); close(e[1], 0);
  const doubled = { ...calibration, image: { ...calibration.image, width: 2000, height: 2000 }, origin: [1000, 1000], scaleBar: { start: [200, 1800], end: [600, 1800], metres: 100 }, northArrow: { base: [1800, 400], tip: [1800, 200] } };
  assert.deepEqual(mapPointToLocal([1040, 960], doubled), mapPointToLocal([520, 480], calibration));
});

test("calibration rejects missing sources, zero scale/north vectors, bad dimensions/hash and false precision", () => {
  for (const patch of [
    { sourceId: "missing" }, { scaleBar: { ...calibration.scaleBar, metres: 0 } },
    { scaleBar: { ...calibration.scaleBar, end: calibration.scaleBar.start } },
    { northArrow: { base: [1, 1], tip: [1, 1] } }, { origin: [NaN, 0] },
    { image: { ...calibration.image, width: 0 } }, { image: { ...calibration.image, sha256: "unknown" } },
    { accuracy: "VERIFIED" }, { uncertaintyNote: "" }, { pageIndex: -1 }, { origin: [501, 500] },
  ]) assert.throws(() => validateCalibration({ ...calibration, ...patch }, sources));
  assert.throws(() => buildSpatialRegistry([], [calibration, calibration], sources));
});

test("spatial records reject duplicates, missing calibration/source links and malformed geometry", () => {
  for (const patch of [
    { id: "" }, { sourceIds: [] }, { sourceIds: ["missing"] }, { calibrationId: "missing" },
    { accuracy: "VERIFIED" }, { kind: "invented-temple" }, { vertices: [[500, 500], [NaN, 500], [500, 520]] },
    { vertices: [[500, 500], [500, 500], [520, 520]] }, { vertices: [[0, 0], [1, 1], [2, 2]] },
    { vertices: [[500, 500], [5000, 500], [500, 520]] }, { uncertaintyNote: "" },
    { vertices: [[500, 500], [540, 530], [500, 520], [530, 500]] },
  ]) assert.throws(() => buildSpatialRegistry([{ ...feature, ...patch }], [calibration], sources));
  assert.throws(() => buildSpatialRegistry([feature, feature], [calibration], sources));
  const runtime = buildSpatialRegistry([feature], [calibration], sources);
  assert.throws(() => validateSpatialFeatures([{ ...runtime[0], heightMetres: 12 }], sources, [calibration]));
});

test("boundary, buffer, square, route and anchor shapes share the same pipeline", () => {
  for (const kind of ["core-boundary", "buffer-boundary", "open-square", "route", "landmark-anchor"]) {
    const vertices = kind === "landmark-anchor" ? [[500, 500]] : kind === "route" ? [[500, 500], [520, 520]] : feature.vertices;
    const [f] = buildSpatialRegistry([{ ...feature, kind, vertices }], [calibration], sources);
    assert.equal(f.kind, kind); assert.equal(f.heightMetres, null);
  }
});
