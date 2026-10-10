import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { ShapeUtils, Vector2 } from "three";
import { localMapSource, mapCalibrations, mapFeatures } from "../src/data/world/map-measurements.ts";
import { spatialFeatures } from "../src/data/world/spatial-registry.ts";
import { localOrigin, sources } from "../src/data/world/registry.ts";
import { mapPointToLocal, localPointToMap, pointInsidePolygon, polygonArea, buildSpatialRegistry } from "../src/lib/map-calibration.ts";
import { spatialVisualConfig } from "../src/game/world/spatial-visual-config.ts";
import { PUBLIC_EXPLORE_HREF, resolveWorldMode, worldSpawns } from "../src/game/world/world-mode.ts";

const c = mapCalibrations[0];
const close = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);

test("supplied authoritative source files retain recorded hashes and raster dimensions", () => {
  const pdf = readFileSync(localMapSource.pdfPath), png = readFileSync(localMapSource.rasterPath);
  assert.equal(pdf.subarray(0, 4).toString(), "%PDF");
  assert.equal(createHash("sha256").update(pdf).digest("hex"), localMapSource.pdfSha256);
  assert.equal(createHash("sha256").update(png).digest("hex"), localMapSource.rasterSha256);
  assert.equal(png.readUInt32BE(16), 3300); assert.equal(png.readUInt32BE(20), 2550);
  assert.equal(c.image.sha256, localMapSource.rasterSha256);
});

test("printed full scale, cross-check, measured north and source origin govern all conversion", () => {
  assert.equal(c.scaleBar.metres, 200);
  close(Math.hypot(c.scaleBar.end[0] - c.scaleBar.start[0], c.scaleBar.end[1] - c.scaleBar.start[1]), 478);
  const a = mapPointToLocal(c.scaleBar.start, c), b = mapPointToLocal(c.scaleBar.end, c);
  close(Math.hypot(b[0] - a[0], b[1] - a[1]), 200);
  const half = mapPointToLocal([2363, 1651], c);
  assert.ok(Math.abs((half[0] - a[0]) / 100 - 1) < 0.015, "Half-bar cross-check agrees within printed/raster uncertainty");
  assert.deepEqual(localOrigin.sourcePixel, [1030, 1330]);
  const zero = mapPointToLocal(localOrigin.sourcePixel, c); close(zero[0], 0); close(zero[1], 0);
  const north = mapPointToLocal([1030, 1230], c); close(north[0], 0); assert.ok(north[1] < 0);
  for (const raw of mapFeatures) for (const p of [...raw.vertices, ...(raw.holes ?? []).flat()]) {
    const q = localPointToMap(mapPointToLocal(p, c), c); close(q[0], p[0]); close(q[1], p[1]);
  }
});

test("17 source-linked approximate features preserve monument/building distinction and unknown heights", () => {
  assert.equal(spatialFeatures.length, 17);
  assert.equal(spatialFeatures.filter(f => f.kind === "core-boundary").length, 1);
  assert.equal(spatialFeatures.filter(f => f.kind === "buffer-boundary").length, 1);
  assert.equal(spatialFeatures.filter(f => f.kind === "open-square").length, 1);
  assert.equal(spatialFeatures.filter(f => f.footprintClass === "monument").length, 9);
  assert.equal(spatialFeatures.filter(f => f.footprintClass === "ordinary-building").length, 5);
  assert.equal(new Set(spatialFeatures.map(f => f.id)).size, 17);
  for (const f of spatialFeatures) {
    assert.equal(f.accuracy, "APPROXIMATE"); assert.equal(f.heightMetres, null);
    assert.deepEqual(f.sourceIds, ["unesco-bhaktapur-monument-zone-2006"]);
    assert.ok(f.uncertaintyNote.length && f.measurementMethod.length);
  }
  assert.equal(spatialVisualConfig.extrusionHeight, 0);
  assert.equal(spatialVisualConfig.collision, "ground-only");
  const square = spatialFeatures.find(f => f.kind === "open-square");
  const [x, , z] = worldSpawns.BHAKTAPUR.position;
  assert.ok(pointInsidePolygon([x, z], square.vertices));
  assert.ok(!(square.holes ?? []).some(h => pointInsidePolygon([x, z], h)));
});

test("triangulated neutral footprints preserve source white voids instead of filling courtyards", () => {
  for (const f of spatialFeatures.filter(f => f.holes?.length)) {
    const contour = f.vertices.map(([x, z]) => new Vector2(x, -z));
    const holes = f.holes.map(r => r.map(([x, z]) => new Vector2(x, -z)));
    const triangles = ShapeUtils.triangulateShape(contour, holes);
    const points = [...contour, ...holes.flat()];
    const area = triangles.reduce((sum, tri) => sum + polygonArea(tri.map(i => [points[i].x, points[i].y])), 0);
    close(area, polygonArea(f.vertices) - f.holes.reduce((sum, h) => sum + polygonArea(h), 0), 1e-5);
  }
});

test("holes outside/between rings and inconsistent footprint classes are rejected", () => {
  const raw = mapFeatures.find(f => f.footprintClass === "monument" && !f.holes);
  assert.throws(() => buildSpatialRegistry([{ ...raw, holes: [[[500, 500], [510, 500], [510, 510]]] }], [c], sources));
  assert.throws(() => buildSpatialRegistry([{ ...raw, footprintClass: "guessed-temple" }], [c], sources));
  const square = { ...raw, vertices: [[900, 1300], [950, 1300], [950, 1350], [900, 1350]] };
  const hole = [[910, 1310], [920, 1310], [920, 1320], [910, 1320]];
  assert.throws(() => buildSpatialRegistry([{ ...square, holes: [hole, hole] }], [c], sources));
});

test("public Explore and plain route enter Bhaktapur; engineering requires explicit selection", () => {
  const url = new URL(PUBLIC_EXPLORE_HREF, "http://localhost");
  assert.equal(url.pathname, "/explore"); assert.equal(url.searchParams.get("world"), "bhaktapur");
  assert.equal(resolveWorldMode(url.searchParams.get("world")), "BHAKTAPUR");
  assert.equal(resolveWorldMode(undefined), "BHAKTAPUR"); assert.equal(resolveWorldMode("invalid"), "BHAKTAPUR");
  assert.equal(resolveWorldMode("engineering"), "ENGINEERING");
});
