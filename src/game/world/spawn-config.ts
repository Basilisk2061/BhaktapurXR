import type { SpawnPoint } from "@/types/world";

// Ground-level foot position, not a future capsule centre. Test coordinates only.
export const defaultSpawn: SpawnPoint = {
  position: [0, 0.05, 7],
  rotation: [0, 0, 0],
};
