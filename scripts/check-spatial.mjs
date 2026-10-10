import { sources, landmarks } from "../src/data/world/registry.ts";
import { spatialFeatures } from "../src/data/world/spatial-registry.ts";
import { calibrationStatus, mapCalibrations } from "../src/data/world/map-measurements.ts";
import { validateWorldData } from "../src/lib/landmark-validation.ts";

validateWorldData(landmarks, sources);
const allIds = [...landmarks, ...spatialFeatures].map(entry => entry.id);
if (new Set(allIds).size !== allIds.length) throw new Error("Duplicate ID across spatial and architectural registries");
console.log(JSON.stringify({
  sources: sources.length, calibrationStatus: mapCalibrations.length ? "CALIBRATED_APPROXIMATE" : calibrationStatus.state,
  measuredCalibrations: mapCalibrations.length, measuredSpatialFeatures: spatialFeatures.length,
  architecturalLandmarks: landmarks.length, geographicOrigin: "UNRESOLVED",
  classificationCounts: Object.fromEntries(["VERIFIED", "APPROXIMATE", "PLACEHOLDER"].map(a => [a, spatialFeatures.filter(f => f.accuracy === a).length])),
}, null, 2));
