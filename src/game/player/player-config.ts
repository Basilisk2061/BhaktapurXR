import type { SpawnPoint } from "@/types/world";

const height = 1.75;
const radius = 0.3;

export const playerConfig = {
  height,
  radius,
  capsuleHalfSegment: height / 2 - radius,
  walkSpeed: 2.3, // metres / second
  runSpeed: 5,
  acceleration: 14, // metres / second squared
  deceleration: 20,
  turnResponsiveness: 14, // exponential damping rate / second
  movementThreshold: 0.05,
  maxDelta: 0.05, // seconds; physics normally uses a fixed 1/60 s step
  physics: {
    contactOffset: 0.015,
    stepHeight: 0.25,
    stepMinWidth: 0.1,
    maxSlope: Math.PI / 4,
    slideSlope: Math.PI / 4,
    snapDistance: 0.22,
    groundStickSpeed: 0.5,
    terminalFallSpeed: 30,
    resetBelowY: -8,
  },
  camera: {
    distance: 4,
    targetHeight: 1.45, // metres above feet
    initialPitch: 0.22,
    minPitch: -0.3,
    maxPitch: 1.05,
    sensitivity: 0.0025, // radians / mouse pixel
    maxMouseDelta: 300,
    followResponsiveness: 18,
    targetResponsiveness: 18,
    collisionRadius: 0.18,
    collisionPadding: 0.04,
    near: 0.08,
    far: 100,
    fov: 50,
  },
  diagnosticsInterval: 200, // milliseconds; DOM text only, development-only
} as const;

export type PlayerConfig = typeof playerConfig;

export function bodySpawnPosition(spawn: SpawnPoint): { x: number; y: number; z: number } {
  return { x: spawn.position[0], y: spawn.position[1] + height / 2, z: spawn.position[2] };
}
