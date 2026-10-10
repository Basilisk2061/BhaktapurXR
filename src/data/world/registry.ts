import type { Landmark, SourceReference } from "@/types/landmark";

// Intentionally empty. No researched Bhaktapur data has been supplied.
export const landmarks: Landmark[] = [];
export const sources: SourceReference[] = [];
export const localOrigin = {
  units: "metres", upAxis: "+Y", geographicOrigin: null,
  description: "Local Cartesian origin [0,0,0]; geographic anchor UNSET pending research.",
} as const;

/** Synthetic renderer fixture, never a Bhaktapur landmark. */
export const developmentReference: Landmark = {
  id: "dev-reference-volume-01", name: "Development reference volume", category: "development-reference",
  transform: { position: [3, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  approximateDimensions: { width: 2, height: 2, depth: 2 },
  accuracy: "PLACEHOLDER", sourceIds: [], collision: "bounds",
  interaction: { interactable: false, radius: 0 }, developmentOnly: true,
};
