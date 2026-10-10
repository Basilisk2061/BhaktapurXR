import type { LocalPoint, MapCalibration, MapFeature, MapPoint, SpatialFeature } from "@/types/spatial";
import type { SourceReference } from "@/types/landmark";
import { validateWorldData } from "./landmark-validation.ts";

function requirePoint(p: unknown, label: string): asserts p is MapPoint {
  if (!Array.isArray(p) || p.length !== 2 || !p.every(n => typeof n === "number" && Number.isFinite(n))) throw new Error(`${label}: expected finite pair`);
}
function requireText(v: unknown, label: string): asserts v is string {
  if (typeof v !== "string" || !v.trim()) throw new Error(`${label}: required text`);
}
export function validateCalibration(c: MapCalibration, sources: SourceReference[]): void {
  requireText(c.id, "Calibration ID");
  if (!sources.some(s => s.id === c.sourceId)) throw new Error("Calibration source missing");
  if (!Number.isInteger(c.pageIndex) || c.pageIndex < 0) throw new Error("Invalid page index");
  if (!Number.isInteger(c.image.width) || !Number.isInteger(c.image.height) || c.image.width <= 0 || c.image.height <= 0 || !/^[a-f0-9]{64}$/i.test(c.image.sha256)) throw new Error("Invalid raster dimensions/hash");
  for (const p of [c.origin, c.scaleBar.start, c.scaleBar.end, c.northArrow.base, c.northArrow.tip]) {
    requirePoint(p, "Calibration point");
    if (p[0] < 0 || p[0] > c.image.width || p[1] < 0 || p[1] > c.image.height) throw new Error("Calibration point outside raster");
  }
  if (c.originStrategy === "source-anchor") requireText(c.originRationale, "Source-anchor rationale");
  else {
    if (c.originStrategy !== undefined && c.originStrategy !== "page-centre") throw new Error("Invalid origin strategy");
    if (c.origin[0] !== c.image.width / 2 || c.origin[1] !== c.image.height / 2) throw new Error("Origin must follow the full-page-centre strategy");
  }
  if (!(c.scaleBar.metres > 0) || !Number.isFinite(c.scaleBar.metres) || distance(c.scaleBar.start, c.scaleBar.end) === 0 || distance(c.northArrow.base, c.northArrow.tip) === 0) throw new Error("Invalid scale/north calibration");
  if (c.accuracy !== "APPROXIMATE") throw new Error("Raster calibration must remain APPROXIMATE");
  requireText(c.measurementMethod, "Calibration method"); requireText(c.uncertaintyNote, "Calibration uncertainty");
}
const distance = (a: MapPoint, b: MapPoint) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Uniform scale + measured north rotation; no geographic conversion or invented anchor. */
export function mapPointToLocal(p: MapPoint, c: MapCalibration): LocalPoint {
  requirePoint(p, "Map point");
  const northLength = distance(c.northArrow.base, c.northArrow.tip);
  const scaleLength = distance(c.scaleBar.start, c.scaleBar.end);
  if (!(northLength > 0) || !(scaleLength > 0) || !(c.scaleBar.metres > 0)) throw new Error("Unusable calibration");
  const nx = (c.northArrow.tip[0] - c.northArrow.base[0]) / northLength;
  const ny = (c.northArrow.tip[1] - c.northArrow.base[1]) / northLength;
  const dx = p[0] - c.origin[0], dy = p[1] - c.origin[1];
  const metresPerPixel = c.scaleBar.metres / scaleLength;
  const result: LocalPoint = [(-ny * dx + nx * dy) * metresPerPixel, -(nx * dx + ny * dy) * metresPerPixel];
  requirePoint(result, "Converted coordinate");
  return result;
}

/** Inverse projection for comparing runtime metre geometry against original pixels. */
export function localPointToMap(p: LocalPoint, c: MapCalibration): MapPoint {
  requirePoint(p, "Local point");
  const length = distance(c.northArrow.base, c.northArrow.tip);
  const m = c.scaleBar.metres / distance(c.scaleBar.start, c.scaleBar.end);
  if (!(length > 0) || !(m > 0) || !Number.isFinite(m)) throw new Error("Unusable calibration");
  const nx = (c.northArrow.tip[0] - c.northArrow.base[0]) / length;
  const ny = (c.northArrow.tip[1] - c.northArrow.base[1]) / length;
  return [c.origin[0] + (-ny * p[0] - nx * p[1]) / m, c.origin[1] + (nx * p[0] - ny * p[1]) / m];
}

export function pointInsidePolygon(p: LocalPoint, ring: LocalPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

export function polygonArea(points: LocalPoint[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) { const a = points[i], b = points[(i + 1) % points.length]; sum += a[0] * b[1] - b[0] * a[1]; }
  return Math.abs(sum) / 2;
}

function intersects(a: LocalPoint, b: LocalPoint, c: LocalPoint, d: LocalPoint): boolean {
  const cross = (p: LocalPoint, q: LocalPoint, r: LocalPoint) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  const onSegment = (p: LocalPoint, q: LocalPoint, r: LocalPoint) => Math.abs(cross(p, q, r)) < 1e-9 && r[0] >= Math.min(p[0], q[0]) && r[0] <= Math.max(p[0], q[0]) && r[1] >= Math.min(p[1], q[1]) && r[1] <= Math.max(p[1], q[1]);
  const abC = cross(a, b, c), abD = cross(a, b, d), cdA = cross(c, d, a), cdB = cross(c, d, b);
  return ((abC > 0) !== (abD > 0) && (cdA > 0) !== (cdB > 0)) || onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b);
}

function requireSimplePolygon(points: LocalPoint[]): void {
  const area = polygonArea(points);
  if (!Number.isFinite(area) || area <= 0.000001) throw new Error("Degenerate polygon");
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (j === i + 1 || (i === 0 && j === points.length - 1)) continue;
      if (intersects(points[i], points[(i + 1) % points.length], points[j], points[(j + 1) % points.length])) throw new Error("Self-intersecting polygon");
    }
  }
}

export function validateSpatialFeatures(features: SpatialFeature[], sources: SourceReference[], calibrations: MapCalibration[]): void {
  const ids = new Set<string>();
  const kinds = ["core-boundary", "buffer-boundary", "building-footprint", "open-square", "route", "landmark-anchor"];
  for (const f of features) {
    requireText(f.id, "Spatial ID"); requireText(f.name, "Spatial name");
    if (ids.has(f.id)) throw new Error("Duplicate spatial ID"); ids.add(f.id);
    if (!kinds.includes(f.kind)) throw new Error("Invalid feature kind");
    if (f.accuracy !== "APPROXIMATE") throw new Error("Map-derived geometry must remain APPROXIMATE");
    if (!Array.isArray(f.sourceIds) || !f.sourceIds.length || !f.sourceIds.every(id => sources.some(s => s.id === id))) throw new Error("Spatial sources missing");
    const c = calibrations.find(c => c.id === f.calibrationId);
    if (!c || !f.sourceIds.includes(c.sourceId)) throw new Error("Spatial calibration/source mismatch");
    if (!Array.isArray(f.vertices)) throw new Error("Spatial vertices missing");
    const count = f.kind === "landmark-anchor" ? 1 : f.kind === "route" ? 2 : 3;
    if (f.vertices.length < count || (f.kind === "landmark-anchor" && f.vertices.length !== 1)) throw new Error("Invalid vertex count");
    for (const p of f.vertices) requirePoint(p, "Local vertex");
    if (new Set(f.vertices.map(p => p.join(","))).size !== f.vertices.length) throw new Error("Duplicate vertices; polygons close implicitly");
    if (count === 3) requireSimplePolygon(f.vertices);
    if (f.footprintClass !== undefined && (f.kind !== "building-footprint" || !["monument", "ordinary-building"].includes(f.footprintClass))) throw new Error("Invalid footprint class");
    if (f.holes !== undefined) {
      if (count !== 3 || !Array.isArray(f.holes)) throw new Error("Holes require a polygon");
      const rings: LocalPoint[][] = [f.vertices];
      for (const hole of f.holes) {
        if (!Array.isArray(hole) || hole.length < 3) throw new Error("Invalid polygon hole");
        hole.forEach(p => requirePoint(p, "Hole vertex")); requireSimplePolygon(hole);
        if (!hole.every(p => pointInsidePolygon(p, f.vertices))) throw new Error("Hole outside polygon");
        for (const ring of rings) {
          for (let i = 0; i < ring.length; i++) for (let j = 0; j < hole.length; j++) {
            if (intersects(ring[i], ring[(i + 1) % ring.length], hole[j], hole[(j + 1) % hole.length])) throw new Error("Polygon rings intersect");
          }
          if (ring !== f.vertices && (pointInsidePolygon(hole[0], ring) || pointInsidePolygon(ring[0], hole))) throw new Error("Overlapping/nested holes");
        }
        rings.push(hole);
      }
    }
    requireText(f.measurementMethod, "Measurement method"); requireText(f.uncertaintyNote, "Uncertainty");
    if (f.heightMetres !== null) throw new Error("Architectural height is unresolved");
  }
}

export function buildSpatialRegistry(raw: MapFeature[], calibrations: MapCalibration[], sources: SourceReference[]): SpatialFeature[] {
  validateWorldData([], sources);
  const calibrationIds = new Set<string>();
  for (const c of calibrations) {
    validateCalibration(c, sources);
    if (calibrationIds.has(c.id)) throw new Error("Duplicate calibration ID"); calibrationIds.add(c.id);
  }
  const features = raw.map(f => {
    const c = calibrations.find(c => c.id === f.calibrationId);
    if (!c) throw new Error(`Missing calibration for ${f.id}`);
    for (const p of [...f.vertices, ...(f.holes ?? []).flat()]) {
      requirePoint(p, "Source vertex");
      if (p[0] < 0 || p[0] > c.image.width || p[1] < 0 || p[1] > c.image.height) throw new Error("Source vertex outside raster");
    }
    return { ...f, vertices: f.vertices.map(p => mapPointToLocal(p, c)), holes: f.holes?.map(r => r.map(p => mapPointToLocal(p, c))), heightMetres: null };
  });
  validateSpatialFeatures(features, sources, calibrations);
  return features;
}
