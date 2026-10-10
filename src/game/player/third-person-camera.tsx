import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useRapier, type RapierRigidBody } from "@react-three/rapier";
import { Vector3, type Group } from "three";
import type { PlayerInput } from "@/game/input/player-input";
import { playerConfig } from "./player-config";
import { safeDelta } from "./movement";
import type { PlayerRuntime } from "./player-runtime";

const identityRotation = { x: 0, y: 0, z: 0, w: 1 };

export function ThirdPersonCamera({ bodyRef, visualRef, input: inputRef, runtime: runtimeRef }: {
  bodyRef: RefObject<RapierRigidBody | null>; visualRef: RefObject<Group | null>;
  input: RefObject<PlayerInput>; runtime: RefObject<PlayerRuntime>;
}) {
  const { world, rapier } = useRapier();
  const state = useMemo(() => ({
    actualTarget: new Vector3(), focus: new Vector3(), ideal: new Vector3(),
    candidate: new Vector3(), direction: new Vector3(), sphere: new rapier.Ball(playerConfig.camera.collisionRadius),
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
    state.actualTarget.setY(state.actualTarget.y + config.targetHeight - playerConfig.height / 2);
    const reset = !initialized.current || lastReset.current !== motion.resetSequence;
    if (reset) state.focus.copy(state.actualTarget);
    else state.focus.lerp(state.actualTarget, 1 - Math.exp(-config.targetResponsiveness * delta));
    const horizontalDistance = config.distance * Math.cos(controls.pitch);
    state.ideal.set(
      state.focus.x + Math.sin(controls.yaw) * horizontalDistance,
      state.focus.y + Math.sin(controls.pitch) * config.distance,
      state.focus.z + Math.cos(controls.yaw) * horizontalDistance,
    );
    if (reset) state.candidate.copy(state.ideal);
    else state.candidate.lerpVectors(camera.position, state.ideal, 1 - Math.exp(-config.followResponsiveness * delta));

    state.direction.subVectors(state.candidate, state.actualTarget);
    const distance = state.direction.length();
    if (distance > 0) {
      state.direction.divideScalar(distance);
      // Sweep to the smoothed candidate too, so smoothing cannot cut through corners.
      const hit = world.castShape(state.actualTarget, identityRotation, state.direction, state.sphere, 0, distance, true,
        rapier.QueryFilterFlags.EXCLUDE_SENSORS, undefined, undefined, body);
      const safeDistance = hit ? Math.max(0, hit.time_of_impact - config.collisionPadding) : distance;
      state.candidate.copy(state.actualTarget).addScaledVector(state.direction, safeDistance);
      motion.cameraDistance = safeDistance;
    }
    camera.position.copy(state.candidate);
    camera.lookAt(state.focus);
    initialized.current = true;
    lastReset.current = motion.resetSequence;
  }, -10);
  return null;
}
