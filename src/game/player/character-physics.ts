import type { Collider, KinematicCharacterController, QueryFilterFlags, RigidBody, World } from "@dimforge/rapier3d-compat";
import type { PlayerConfig } from "./player-config";
import type { PlayerRuntime } from "./player-runtime";

export function createCharacterController(world: World, config: PlayerConfig): KinematicCharacterController {
  const controller = world.createCharacterController(config.physics.contactOffset);
  controller.setUp({ x: 0, y: 1, z: 0 });
  controller.setSlideEnabled(true);
  controller.enableAutostep(config.physics.stepHeight, config.physics.stepMinWidth, false);
  controller.enableSnapToGround(config.physics.snapDistance);
  controller.setMaxSlopeClimbAngle(config.physics.maxSlope);
  controller.setMinSlopeSlideAngle(config.physics.slideSlope);
  controller.setApplyImpulsesToDynamicBodies(false);
  return controller;
}

/** Called before each fixed physics step; Rapier resolves all contacts and steps. */
export function stepCharacter(
  body: RigidBody, collider: Collider, controller: KinematicCharacterController,
  runtime: PlayerRuntime, delta: number, config: PlayerConfig, gravityY: number,
  filterFlags: QueryFilterFlags, jump = false,
): void {
  if (jump && runtime.grounded) {
    runtime.velocity.y = Math.sqrt(-2 * gravityY * config.jumpHeight);
    runtime.grounded = false;
  }
  runtime.velocity.y = runtime.grounded
    ? -config.physics.groundStickSpeed
    : Math.max(runtime.velocity.y + gravityY * delta, -config.physics.terminalFallSpeed);
  const desired = runtime.desiredTranslation;
  desired.x = runtime.velocity.x * delta;
  desired.y = runtime.velocity.y * delta;
  desired.z = runtime.velocity.z * delta;
  if (runtime.velocity.y > 0) controller.disableSnapToGround();
  else controller.enableSnapToGround(config.physics.snapDistance);
  controller.computeColliderMovement(collider, desired, filterFlags);
  const corrected = controller.computedMovement();
  const position = body.translation();
  runtime.nextPosition.x = position.x + corrected.x;
  runtime.nextPosition.y = position.y + corrected.y;
  runtime.nextPosition.z = position.z + corrected.z;
  runtime.grounded = runtime.velocity.y <= 0 && controller.computedGrounded();
  // Stop upward velocity when a ceiling blocks the requested ascent.
  if (desired.y > 0 && corrected.y < desired.y * 0.5) runtime.velocity.y = 0;
  runtime.horizontalSpeed = delta > 0 ? Math.hypot(corrected.x, corrected.z) / delta : 0;
  if (runtime.grounded) runtime.velocity.y = 0;
  body.setNextKinematicTranslation(runtime.nextPosition);
}
