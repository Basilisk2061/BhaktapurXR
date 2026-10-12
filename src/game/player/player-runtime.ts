import type { MovementState } from "./movement";

export interface PlayerRuntime {
  velocity: { x: number; y: number; z: number };
  desiredTranslation: { x: number; y: number; z: number };
  nextPosition: { x: number; y: number; z: number };
  grounded: boolean;
  flying: boolean;
  horizontalSpeed: number;
  movement: MovementState;
  facingYaw: number;
  cameraDistance: number;
  resetSequence: number;
}

export function createPlayerRuntime(): PlayerRuntime {
  return {
    velocity: { x: 0, y: 0, z: 0 },
    desiredTranslation: { x: 0, y: 0, z: 0 },
    nextPosition: { x: 0, y: 0, z: 0 },
    grounded: false,
    flying: false, horizontalSpeed: 0, movement: "FALL", facingYaw: 0,
    cameraDistance: 0, resetSequence: 0,
  };
}
