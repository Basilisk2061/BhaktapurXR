import type { SpawnPoint } from "@/types/world";

export type WorldMode = "ENGINEERING" | "BHAKTAPUR";
// Both spawns are temporary engineering coordinates, never claimed heritage entrances.
export const worldSpawns: Record<WorldMode, SpawnPoint> = {
  ENGINEERING: { position: [0, 0.05, 7], rotation: [0, 0, 0] },
  BHAKTAPUR: { position: [0, 0.05, 4], rotation: [0, 0, 0] },
};
export function resolveWorldMode(value: unknown): WorldMode {
  return value === "bhaktapur" ? "BHAKTAPUR" : "ENGINEERING";
}
