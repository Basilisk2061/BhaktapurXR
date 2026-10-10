import type { SpawnPoint } from "@/types/world";

export type WorldMode = "ENGINEERING" | "BHAKTAPUR";
export const PUBLIC_EXPLORE_HREF = "/explore?world=bhaktapur";
// Both spawns are temporary engineering coordinates, never claimed heritage entrances.
export const worldSpawns: Record<WorldMode, SpawnPoint> = {
  ENGINEERING: { position: [0, 0.05, 7], rotation: [0, 0, 0] },
  BHAKTAPUR: { position: [0, 0.05, 4], rotation: [0, 0, 0] },
};
export function resolveWorldMode(value: unknown): WorldMode {
  return value === "engineering" ? "ENGINEERING" : "BHAKTAPUR";
}
