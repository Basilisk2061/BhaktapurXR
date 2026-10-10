import type { Accuracy } from "./landmark";

export type MapPoint = [number, number]; // pixel X right, pixel Y down
export type LocalPoint = [number, number]; // metre X east, metre Z south
export type SpatialKind = "core-boundary" | "buffer-boundary" | "building-footprint" | "open-square" | "route" | "landmark-anchor";

export interface MapCalibration {
  id: string;
  sourceId: string;
  pageIndex: number;
  image: { width: number; height: number; sha256: string };
  origin: MapPoint;
  originStrategy?: "page-centre" | "source-anchor";
  originRationale?: string;
  scaleBar: { start: MapPoint; end: MapPoint; metres: number };
  northArrow: { base: MapPoint; tip: MapPoint };
  measurementMethod: string;
  uncertaintyNote: string;
  // A raster trace is approximate even when the publication is authoritative.
  accuracy: "APPROXIMATE";
}

export interface MapFeature {
  id: string;
  kind: SpatialKind;
  name: string;
  calibrationId: string;
  sourceIds: string[];
  vertices: MapPoint[];
  holes?: MapPoint[][];
  footprintClass?: "monument" | "ordinary-building";
  accuracy: "APPROXIMATE";
  measurementMethod: string;
  uncertaintyNote: string;
}

export interface SpatialFeature {
  id: string;
  kind: SpatialKind;
  name: string;
  vertices: LocalPoint[];
  holes?: LocalPoint[][];
  footprintClass?: "monument" | "ordinary-building";
  accuracy: Accuracy;
  sourceIds: string[];
  calibrationId: string;
  measurementMethod: string;
  uncertaintyNote: string;
  heightMetres: null; // No architectural height evidence in this phase.
}
