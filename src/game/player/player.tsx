import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useBeforePhysicsStep, useRapier, type RapierRigidBody } from "@react-three/rapier";
import type { KinematicCharacterController } from "@dimforge/rapier3d-compat";
import type { Group } from "three";
import type { PlayerInput, PointerStatus } from "@/game/input/player-input";
import { usePlayerInput } from "@/game/input/use-player-input";
import { defaultSpawn } from "@/game/world/spawn-config";
import { worldConfig } from "@/game/world/world-config";
import { bodySpawnPosition, playerConfig } from "./player-config";
import { cameraRelativeDirection, approachVelocity, dampAngle, movementState, safeDelta } from "./movement";
import { createCharacterController, stepCharacter } from "./character-physics";
import { PlayerProxy } from "./player-proxy";
import { ThirdPersonCamera } from "./third-person-camera";
import type { PlayerRuntime } from "./player-runtime";

export function Player({ input: inputRef, runtime: runtimeRef, onPointerStatus }: { input: RefObject<PlayerInput>; runtime: RefObject<PlayerRuntime>; onPointerStatus: (status: PointerStatus) => void }) {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<Group>(null);
  const controller = useRef<KinematicCharacterController>(null);
  const { world, rapier } = useRapier();
  const spawnPosition = useMemo(() => bodySpawnPosition(defaultSpawn), []);
  const direction = useMemo(() => ({ x: 0, z: 0 }), []);
  usePlayerInput(inputRef, onPointerStatus);

  useEffect(() => {
    const character = createCharacterController(world, playerConfig);
    controller.current = character;
    runtimeRef.current.facingYaw = defaultSpawn.rotation[1];
    return () => { controller.current = null; world.removeCharacterController(character); };
  }, [world, runtimeRef]);

  useBeforePhysicsStep(() => {
    const motion = runtimeRef.current, controls = inputRef.current;
    const rigidBody = body.current, character = controller.current;
    if (!rigidBody || !character) return;
    const collider = rigidBody.collider(0);
    if (!collider) return;
    if (rigidBody.translation().y < playerConfig.physics.resetBelowY) {
      rigidBody.setTranslation(spawnPosition, true);
      rigidBody.setNextKinematicTranslation(spawnPosition);
      motion.nextPosition.x = spawnPosition.x; motion.nextPosition.y = spawnPosition.y; motion.nextPosition.z = spawnPosition.z;
      motion.velocity.x = 0; motion.velocity.y = 0; motion.velocity.z = 0;
      motion.grounded = false; motion.horizontalSpeed = 0; motion.movement = "FALL";
      motion.facingYaw = defaultSpawn.rotation[1]; motion.resetSequence++;
      controls.yaw = defaultSpawn.rotation[1]; controls.pitch = playerConfig.camera.initialPitch;
      return;
    }
    const delta = safeDelta(worldConfig.physicsTimeStep, playerConfig.maxDelta);
    const keys = controls.keys;
    const forward = controls.active ? Number(keys.has("KeyW")) - Number(keys.has("KeyS")) : 0;
    const right = controls.active ? Number(keys.has("KeyD")) - Number(keys.has("KeyA")) : 0;
    const running = controls.active && (keys.has("ShiftLeft") || keys.has("ShiftRight"));
    const speed = running ? playerConfig.runSpeed : playerConfig.walkSpeed;
    cameraRelativeDirection(forward, right, controls.yaw, direction);
    const slowing = (forward === 0 && right === 0) || Math.hypot(motion.velocity.x, motion.velocity.z) > speed;
    approachVelocity(motion.velocity, direction, speed, slowing ? playerConfig.deceleration : playerConfig.acceleration, delta);
    stepCharacter(rigidBody, collider, character, motion, delta, playerConfig, worldConfig.gravity[1], rapier.QueryFilterFlags.EXCLUDE_SENSORS);
    motion.movement = movementState(motion.grounded, motion.horizontalSpeed, running, playerConfig.movementThreshold);
    if (motion.horizontalSpeed > playerConfig.movementThreshold) {
      const corrected = character.computedMovement();
      motion.facingYaw = dampAngle(motion.facingYaw, Math.atan2(-corrected.x, -corrected.z), playerConfig.turnResponsiveness, delta);
    }
  });

  useFrame(() => { if (visual.current) visual.current.rotation.y = runtimeRef.current.facingYaw; }, -20);

  return (
    <>
      <RigidBody ref={body} type="kinematicPosition" colliders={false} enabledRotations={[false, false, false]} position={[spawnPosition.x, spawnPosition.y, spawnPosition.z]} name="player-body">
        <CapsuleCollider args={[playerConfig.capsuleHalfSegment, playerConfig.radius]} />
        <PlayerProxy visualRef={visual} />
      </RigidBody>
      <ThirdPersonCamera bodyRef={body} visualRef={visual} input={inputRef} runtime={runtimeRef} />
    </>
  );
}
