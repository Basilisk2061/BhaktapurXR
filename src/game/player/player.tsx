import {arcadeSeatSpans,nearestArcadeSeat,sittingConfig} from "./arcade-sitting";
import {ArcadeSittingPrompt} from "./arcade-sitting-prompt";
import type {TransformOverrides} from "../../features/world-editor/transforms";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useBeforePhysicsStep, useRapier, type RapierRigidBody } from "@react-three/rapier";
import type { KinematicCharacterController } from "@dimforge/rapier3d-compat";
import type { Group } from "three";
import type { PlayerInput, PointerStatus } from "@/game/input/player-input";
import { usePlayerInput } from "@/game/input/use-player-input";
import type { SpawnPoint } from "@/types/world";
import { consumeJump } from "@/game/input/player-input";
import { worldConfig } from "@/game/world/world-config";
import { bodySpawnPosition, playerConfig } from "./player-config";
import { cameraRelativeDirection, approachVelocity, dampAngle, movementState, safeDelta } from "./movement";
import { createCharacterController, stepCharacter } from "./character-physics";
import { PlayerCharacter } from "./player-character";
import { ThirdPersonCamera } from "./third-person-camera";
import type { PlayerRuntime } from "./player-runtime";

export function Player({ input: inputRef, runtime: runtimeRef, spawn, onPointerStatus, reviewCamera=false, sittingEnabled=false, seatingTransforms }: { sittingEnabled?:boolean; seatingTransforms?:TransformOverrides; spawn: SpawnPoint; reviewCamera?:boolean; input: RefObject<PlayerInput>; runtime: RefObject<PlayerRuntime>; onPointerStatus: (status: PointerStatus) => void }) {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<Group>(null);
  const controller = useRef<KinematicCharacterController>(null);
  const { world, rapier } = useRapier();
  const spawnPosition = useMemo(() => bodySpawnPosition(spawn), [spawn]);
  const seats=useMemo(()=>sittingEnabled?arcadeSeatSpans(seatingTransforms):[],[sittingEnabled,seatingTransforms]);
  const direction = useMemo(() => ({ x: 0, z: 0 }), []);
  usePlayerInput(inputRef, onPointerStatus);

  useEffect(() => {
    const character = createCharacterController(world, playerConfig);
    controller.current = character;
    runtimeRef.current.facingYaw = spawn.rotation[1];
    return () => { controller.current = null; world.removeCharacterController(character); };
  }, [world, runtimeRef, spawn]);

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
      motion.facingYaw = spawn.rotation[1]; motion.resetSequence++;
      motion.seat=null; motion.sitPrompt=null; controls.sitting=false;
      controls.jumpRequested = false;
      controls.yaw = spawn.rotation[1]; controls.pitch = playerConfig.camera.initialPitch;
      return;
    }
    const position=rigidBody.translation();
    const candidate=!controls.flying&&!motion.seat?nearestArcadeSeat({x:position.x,y:position.y-playerConfig.height/2,z:position.z},seats):null;
    motion.sitPrompt=motion.seat?"stand":candidate?"sit":null;
    if(controls.interactRequested){
      controls.interactRequested=false;
      if(controls.active&&motion.seat){
        const exit=motion.seat.exit;
        const hit=world.castRay(new rapier.Ray({x:exit.x,y:exit.y+2,z:exit.z},{x:0,y:-1,z:0}),10,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,collider,rigidBody);
        if(hit){const target={x:exit.x,y:exit.y+2-hit.timeOfImpact+playerConfig.height/2+.015,z:exit.z};
          const blocked=world.intersectionWithShape(target,{x:0,y:0,z:0,w:1},new rapier.Capsule(playerConfig.capsuleHalfSegment,playerConfig.radius),rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,collider,rigidBody);
          if(!blocked){rigidBody.setTranslation(target,true);rigidBody.setNextKinematicTranslation(target);Object.assign(motion.nextPosition,target);motion.seat=null;motion.sitPrompt=null;motion.movement="IDLE";}
        }
      }else if(controls.active&&candidate){motion.seat=candidate;motion.facingYaw=candidate.yaw;motion.sitPrompt="stand";}
      controls.keys.clear();controls.jumpRequested=false;controls.lastSpacePress=null;
    }
    controls.sitting=!!motion.seat;
    if(motion.seat){
      const target={x:motion.seat.point.x,y:motion.seat.point.y+playerConfig.height/2+.015,z:motion.seat.point.z};
      rigidBody.setNextKinematicTranslation(target);Object.assign(motion.nextPosition,target);
      motion.velocity.x=0;motion.velocity.y=0;motion.velocity.z=0;motion.horizontalSpeed=0;motion.grounded=true;motion.movement="IDLE";
      controls.jumpRequested=false;controls.lastSpacePress=null;
      return;
    }
    const delta = safeDelta(worldConfig.physicsTimeStep, playerConfig.maxDelta);
    if (motion.flying !== controls.flying) {
      motion.flying = controls.flying;
      motion.velocity.y = 0;
      motion.grounded = false;
    }
    const keys = controls.keys;
    const touch=controls.touchMode?controls.touchMovement:undefined;
    const forward = controls.active ? touch?.forward ?? (Number(keys.has("KeyW")) - Number(keys.has("KeyS"))) : 0;
    const right = controls.active ? touch?.right ?? (Number(keys.has("KeyD")) - Number(keys.has("KeyA"))) : 0;
    const running = controls.active && (touch?.running ?? (keys.has("ShiftLeft") || keys.has("ShiftRight")));
    const speed = (running ? playerConfig.runSpeed : playerConfig.walkSpeed) * (touch ? Math.min(1,Math.hypot(forward,right)) : 1);
    cameraRelativeDirection(forward, right, controls.yaw, direction);
    const slowing = (forward === 0 && right === 0) || Math.hypot(motion.velocity.x, motion.velocity.z) > speed;
    approachVelocity(motion.velocity, direction, speed, slowing ? playerConfig.deceleration : playerConfig.acceleration, delta);
    if (motion.flying) {
      const vertical = controls.active ? Number(keys.has("Space")) - Number(keys.has("ControlLeft") || keys.has("ControlRight")) : 0;
      const target = vertical * speed;
      const rate = vertical === 0 ? playerConfig.deceleration : playerConfig.acceleration;
      motion.velocity.y += Math.sign(target - motion.velocity.y) * Math.min(Math.abs(target - motion.velocity.y), rate * delta);
      controls.jumpRequested = false;
    }
    stepCharacter(rigidBody, collider, character, motion, delta, playerConfig, worldConfig.gravity[1], rapier.QueryFilterFlags.EXCLUDE_SENSORS, consumeJump(controls, motion.grounded));
    motion.movement = movementState(motion.grounded, motion.horizontalSpeed, running, playerConfig.movementThreshold);
    if (motion.horizontalSpeed > playerConfig.movementThreshold) {
      const corrected = character.computedMovement();
      motion.facingYaw = dampAngle(motion.facingYaw, Math.atan2(-corrected.x, -corrected.z), playerConfig.turnResponsiveness, delta);
    }
  });

  useFrame(() => { if (visual.current) {visual.current.rotation.y = runtimeRef.current.facingYaw;visual.current.position.y=runtimeRef.current.seat?sittingConfig.visualY:0;} }, -20);

  return (
    <>
      <RigidBody ref={body} type="kinematicPosition" colliders={false} enabledRotations={[false, false, false]} position={[spawnPosition.x, spawnPosition.y, spawnPosition.z]} name="player-body">
        <CapsuleCollider args={[playerConfig.capsuleHalfSegment, playerConfig.radius]} />
        <PlayerCharacter visualRef={visual} runtime={runtimeRef} />
      </RigidBody>
      {sittingEnabled&&<ArcadeSittingPrompt runtime={runtimeRef} input={inputRef}/>}
      <ThirdPersonCamera reviewCamera={reviewCamera} bodyRef={body} visualRef={visual} input={inputRef} runtime={runtimeRef} />
    </>
  );
}
