import type { MapCalibration, MapFeature } from "@/types/spatial";
import { unescoMapFeatures } from "./unesco-traces.ts";

export const localMapSource = {
  pdfPath: "reference/bhaktapur/unesco/NP-121bis-bhaktapur.pdf",
  pdfSha256: "615b700df3706fd7e887f98d6b95e436e4a0667e6cddc7fdd1af38c3221b5666",
  rasterPath: "reference/bhaktapur/unesco/bhaktapur_map-1.png",
  rasterSha256: "03ba3aa18d0ec92887b23edfd716559ce11e5e9ec0916eafcd2e2727981761f5",
  width: 3300, height: 2550,
  drawingBounds: { left: 590, top: 640, right: 2860, bottom: 1830 },
  embeddedPdfMapResolution: [901, 1273],
} as const;

export const mapCalibrations: MapCalibration[] = [{
  id: "unesco-bhaktapur-local-png-001", sourceId: "unesco-bhaktapur-monument-zone-2006", pageIndex: 0,
  image: { width: localMapSource.width, height: localMapSource.height, sha256: localMapSource.rasterSha256 },
  origin: [1030, 1330], originStrategy: "source-anchor",
  originRationale: "Fixed pixel anchor in the principal unshaded Durbar Square strip, keeping the main prototype near zero; not an official entrance/geographic coordinate",
  scaleBar: { start: [2122, 1651], end: [2600, 1651], metres: 200 },
  northArrow: { base: [2362, 1537], tip: [2362, 1504] },
  accuracy: "APPROXIMATE",
  measurementMethod: "Read printed 0-200 m bar and N stem in supplied PNG. Full bar = 478 pixels; 200/478 metres per pixel. Cross-check 0-100 m tick at x2363 (241 pixels; about 1% difference). No DPI-derived scale.",
  uncertaintyNote: "Endpoint placement uncertain by a few resampled pixels; unequal printed segment spans differ by about 1%. PDF embeds a 901x1273 image; larger PNG adds no source detail. Uniform rotation/scale is a prototype approximation, not survey/geographic calibration.",
}];
export const mapFeatures: MapFeature[] = unescoMapFeatures;
export const calibrationStatus = {
  state: "CALIBRATED_APPROXIMATE",
  sourceId: "unesco-bhaktapur-monument-zone-2006",
  sourceDocumentUrl: "https://whc.unesco.org/document/103370",
  pageIndex: 0,
  imageDimensions: [3300,2550], scaleBar: mapCalibrations[0].scaleBar, northArrow: mapCalibrations[0].northArrow,
  originStrategy: "Fixed source anchor [1030,1330] in supplied full PNG",
  reason: "Supplied local PDF and raster inspected; printed scale and orientation measured. Manual visual approval still required.",
} as const;

export const bhaktapurGround = {
  size: 1800, thickness: 0.5, surfaceY: 0,
  accuracy: "PLACEHOLDER",
  purpose: "Broad development reference surface; not a measured square or monument-zone boundary",
} as const;
