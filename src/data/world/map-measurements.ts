import type { MapCalibration, MapFeature } from "@/types/spatial";

// Source-space data only. Empty until actual inspectable map measurements exist.
export const mapCalibrations: MapCalibration[] = [];
export const mapFeatures: MapFeature[] = [];
export const calibrationStatus = {
  state: "PENDING_SOURCE_MEASUREMENTS",
  sourceId: "unesco-bhaktapur-monument-zone-2006",
  sourceDocumentUrl: "https://whc.unesco.org/document/103370",
  pageIndex: 0,
  imageDimensions: null, scaleBar: null, northArrow: null,
  originStrategy: "Centre of the full, uncropped source-page raster: [width/2, height/2]",
  reason: "Direct source PDF download returned HTTP 403; available screenshot tool did not expose inspectable pixels. No map measurements fabricated.",
} as const;

export const bhaktapurGround = {
  size: 400, thickness: 0.5, surfaceY: 0,
  accuracy: "PLACEHOLDER",
  purpose: "Broad development reference surface; not a measured square or monument-zone boundary",
} as const;
