import type { QualityPreset } from "@/types/quality";
import type { Vector3Tuple } from "@/types/world";

// Preset tuning will be introduced alongside real assets.
export const DEFAULT_QUALITY_PRESET: QualityPreset = "MEDIUM";

// A single neutral baseline; per-preset tuning waits for real assets.
export const renderingConfig = {
  dpr: [1, 1.5] as [number, number],
  exposure: 1,
  background: "#dce3e4",
  sunlight: { position: [10, 18, 8] as Vector3Tuple, intensity: 2.5, color: "#fff5e8" },
  ambient: { skyColor: "#edf3fa", groundColor: "#777469", intensity: 1.2 },
  shadows: { mapSize: 1024, extent: 18, normalBias: 0.025 },
} as const;
