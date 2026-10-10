import type { Vector3Tuple } from "@/types/world";

export const worldConfig = {
  unitsPerMetre: 1,
  upAxis: "Y",
  gravity: [0, -9.81, 0] as Vector3Tuple,
  physicsTimeStep: 1 / 60,
  ground: { size: 32, thickness: 0.5, surfaceY: 0 },
  camera: {
    position: [17, 14, 19] as Vector3Tuple,
    target: [0, 1, 0] as Vector3Tuple,
    fov: 45,
    near: 0.1,
    far: 100,
    minDistance: 3,
    maxDistance: 45,
    maxPolarAngle: Math.PI / 2 - 0.05,
  },
} as const;
