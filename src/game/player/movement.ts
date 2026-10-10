export interface HorizontalVector { x: number; z: number }
export type MovementState = "IDLE" | "WALK" | "RUN" | "FALL";

/** Positive forward input points toward local -Z; yaw is a Three.js Y rotation. */
export function cameraRelativeDirection(forward: number, right: number, yaw: number, out: HorizontalVector): void {
  const length = Math.hypot(forward, right);
  if (length === 0) { out.x = 0; out.z = 0; return; }
  const sin = Math.sin(yaw), cos = Math.cos(yaw);
  out.x = (right * cos - forward * sin) / length;
  out.z = (-right * sin - forward * cos) / length;
}

export function approachVelocity(velocity: HorizontalVector, direction: HorizontalVector, speed: number, rate: number, delta: number): void {
  const x = direction.x * speed - velocity.x;
  const z = direction.z * speed - velocity.z;
  const length = Math.hypot(x, z);
  const amount = length === 0 ? 0 : Math.min(1, rate * delta / length);
  velocity.x += x * amount;
  velocity.z += z * amount;
}

export function dampAngle(current: number, target: number, rate: number, delta: number): number {
  const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + difference * (1 - Math.exp(-rate * delta));
}

export function movementState(grounded: boolean, speed: number, running: boolean, threshold: number): MovementState {
  if (!grounded) return "FALL";
  if (speed < threshold) return "IDLE";
  return running ? "RUN" : "WALK";
}

export function safeDelta(delta: number, maximum: number): number {
  return Number.isFinite(delta) ? Math.max(0, Math.min(delta, maximum)) : 0;
}
