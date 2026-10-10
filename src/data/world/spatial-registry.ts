import { mapCalibrations, mapFeatures, calibrationStatus } from "./map-measurements.ts";
import { sources } from "./registry.ts";
import { buildSpatialRegistry } from "../../lib/map-calibration.ts";

// One source-space -> local-metre pipeline. No coordinate literals in React.
export const spatialFeatures = buildSpatialRegistry(mapFeatures, mapCalibrations, sources);
export const spatialCalibrationState = mapCalibrations.length ? "CALIBRATED_APPROXIMATE" : calibrationStatus.state;
