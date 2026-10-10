import type { QualityPreset } from "../../types/quality.ts";

// APPROXIMATE ARCHITECTURAL PARAMETERS: design assumptions, never source measurements.
export const architectureParameters = {
  accuracy: "APPROXIMATE", storeyHeight: 3.1, windowWidth: 0.85, windowHeight: 1.35,
  baySpacing: 2.4, timberBand: 0.16, doorWidth: 1.2, doorHeight: 2.2,
  eaveDepth: 0.65, roofRiseRatio: 0.32, stairRise: 0.18, stairTread: 0.36,
  plinthSteps: 4, plinthSetback: 0.3, shrineBodyRatio: 0.62, tierSpacing: 2.35,
  plinthShrinkPerStep: .04, tierShrink: .73, tierBodyRatio: .6, tierClearanceRatio: .65,
  stairWidth: 2.4, postWidth: .16, postHeight: 1.3, finialHeight: .7, facadeRoofDepth: 5,
  wallCollisionThickness: 0.24, collisionCell: 1.4,
  interpretation: "Restrained Newar-inspired procedural vocabulary requested for Phase 5; shapes and heights are not monument-specific historical evidence.",
} as const;

export const architectureQuality: Record<QualityPreset, { shadowSize: number; bayStride: number; contextStride: number; lattice: boolean }> = {
  LOW: { shadowSize: 1024, bayStride: 2, contextStride: 2, lattice: false },
  MEDIUM: { shadowSize: 2048, bayStride: 1, contextStride: 1, lattice: true },
  HIGH: { shadowSize: 4096, bayStride: 1, contextStride: 1, lattice: true },
};

export function stableSeed(id: string): number {
  let value = 2166136261;
  for (const char of id) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return value >>> 0;
}
