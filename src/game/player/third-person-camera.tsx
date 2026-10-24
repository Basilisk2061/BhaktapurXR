import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useRapier, type RapierRigidBody } from "@react-three/rapier";
import { Vector3, type Group } from "three";
import type { PlayerInput } from "@/game/input/player-input";
import { playerConfig } from "./player-config";
import { safeDelta } from "./movement";
import type { PlayerRuntime } from "./player-runtime";

const identityRotation = { x: 0, y: 0, z: 0, w: 1 };

export function ThirdPersonCamera({ bodyRef, visualRef, input: inputRef, runtime: runtimeRef, reviewCamera=false }: {
  bodyRef: RefObject<RapierRigidBody | null>; visualRef: RefObject<Group | null>;
  input: RefObject<PlayerInput>; runtime: RefObject<PlayerRuntime>; reviewCamera?:boolean;
}) {
  const { world, rapier } = useRapier();
  const state = useMemo(() => ({
    actualTarget: new Vector3(), focus: new Vector3(), ideal: new Vector3(),
    candidate: new Vector3(), direction: new Vector3(), desiredBoom: new Vector3(),
    freeOrbit: new Vector3(), lookTarget: new Vector3(), renderedDistance: 0, sphere: new rapier.Ball(playerConfig.camera.collisionRadius),
  }), [rapier]);
  const initialized = useRef(false);
  const lastReset = useRef(-1);

  useFrame(({ camera }, frameDelta) => {
    const controls = inputRef.current, motion = runtimeRef.current;
    const body = bodyRef.current, visual = visualRef.current;
    if (!body || !visual) return;
    const config = playerConfig.camera;
    const delta = safeDelta(frameDelta, playerConfig.maxDelta);
    visual.getWorldPosition(state.actualTarget);
    state.actualTarget.setY(state.actualTarget.y + (reviewCamera ? 2.5 : config.targetHeight) - playerConfig.height / 2);
    const reset = !initialized.current || lastReset.current !== motion.resetSequence;
    if (reset) state.focus.copy(state.actualTarget);
    else state.focus.lerp(state.actualTarget, 1 - Math.exp(-config.targetResponsiveness * delta));
    const desiredOrbitDistance = reviewCamera ? 6 : config.distance;
    const horizontalDistance = desiredOrbitDistance * Math.cos(controls.pitch);
    state.desiredBoom.set(
      Math.sin(controls.yaw) * horizontalDistance,
      Math.sin(controls.pitch) * desiredOrbitDistance,
      Math.cos(controls.yaw) * horizontalDistance,
    );
    state.ideal.copy(state.focus).add(state.desiredBoom);
    // Preserve the existing free-camera follow smoothing independently of collision.
    // A shortened rendered boom must never become the next orbit's starting position.
    if (reset) state.freeOrbit.copy(state.ideal);
    else state.freeOrbit.lerp(state.ideal, 1 - Math.exp(-config.followResponsiveness * delta));
    state.direction.subVectors(state.freeOrbit, state.actualTarget);
    const desiredBoomDistance = state.direction.length();
    if (desiredBoomDistance > 0) {
      state.direction.divideScalar(desiredBoomDistance);
      // Fixed solid architecture only: omit the player, NPCs, dynamic bodies and sensors.
      // Permit escape from an initial shallow overlap rather than pinning the boom at TOI=0.
      const hit = world.castShape(state.actualTarget, identityRotation, state.direction, state.sphere, 0, desiredBoomDistance, false,
        rapier.QueryFilterFlags.EXCLUDE_SENSORS | rapier.QueryFilterFlags.ONLY_FIXED, undefined, undefined, body);
      const collisionLimitedDistance = hit ? Math.max(0, hit.time_of_impact - config.collisionPadding) : desiredBoomDistance;
      if (reset || collisionLimitedDistance < state.renderedDistance) state.renderedDistance = collisionLimitedDistance;
      else state.renderedDistance += (collisionLimitedDistance - state.renderedDistance) *
        (1 - Math.exp(-config.collisionRecoveryResponsiveness * delta));
      // The minimum is soft: never push through a wall to satisfy a framing preference.
      state.renderedDistance = Math.min(collisionLimitedDistance,
        Math.max(Math.min(config.minimumDistance, collisionLimitedDistance), state.renderedDistance));
      state.candidate.copy(state.actualTarget).addScaledVector(state.direction, state.renderedDistance);
      motion.cameraDistance = state.renderedDistance;
    } else {
      state.candidate.copy(state.actualTarget);
      state.renderedDistance = 0;
      motion.cameraDistance = 0;
    }
    camera.position.copy(state.candidate);
    state.lookTarget.copy(state.focus);
    // An exceptionally tight boom must not give lookAt a coincident/reversed target.
    if (state.renderedDistance < config.minimumDistance)
      state.lookTarget.copy(state.actualTarget).addScaledVector(state.desiredBoom, -1);
    camera.lookAt(state.lookTarget);
    initialized.current = true;
    lastReset.current = motion.resetSequence;
  }, -10);
  return null;
}
