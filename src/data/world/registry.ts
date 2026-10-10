import type { Landmark, SourceReference } from "@/types/landmark";
import { unescoSources } from "./sources.ts";

// Detailed landmark geometry remains empty until defensible map measurements exist.
export const landmarks: Landmark[] = [];
export const sources: SourceReference[] = unescoSources;
export const localOrigin = {
  units: "metres", upAxis: "+Y", eastAxis: "+X", northAxis: "-Z", geographicOrigin: null,
  strategy: "Full source-page raster centre; actual pixel anchor awaits measured raster dimensions",
  description: "Engineering origin [0,0,0]; map anchor strategy = full-page raster centre. Geographic origin UNRESOLVED.",
} as const;

/** Synthetic renderer fixture, never a Bhaktapur landmark. */
export const developmentReference: Landmark = {
  id: "dev-reference-volume-01", name: "Development reference volume", category: "development-reference",
  transform: { position: [3, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  approximateDimensions: { width: 2, height: 2, depth: 2 },
  accuracy: "PLACEHOLDER", sourceIds: [], collision: "bounds",
  interaction: { interactable: false, radius: 0 }, developmentOnly: true,
};
