import {photographyExposure,photographyLookScale} from '../inventory/photography-settings';
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useRapier, type RapierRigidBody } from "@react-three/rapier";
import { Euler,Quaternion,Vector3, type PerspectiveCamera, type Group } from "three";
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
    handheldEuler:new Euler(0,0,0,"YXZ"),handheldRotation:new Quaternion(),handheldTime:0,actualTarget: new Vector3(), focus: new Vector3(), ideal: new Vector3(),
    candidate: new Vector3(), direction: new Vector3(), desiredBoom: new Vector3(),
    freeOrbit: new Vector3(), lookTarget: new Vector3(), renderedDistance: 0, sphere: new rapier.Ball(playerConfig.camera.collisionRadius),
  }), [rapier]);
  const {camera:renderCamera,gl}=useThree();
  const photography=useRef({applied:false,exposure:1,fov:50,lastExposure:1});
  useEffect(()=>()=>{const saved=photography.current;if(saved.applied){gl.toneMappingExposure=saved.exposure;const c=renderCamera as PerspectiveCamera;c.fov=saved.fov;c.updateProjectionMatrix();}},[gl,renderCamera]);
  // Runs after camera positioning, before the existing renderer/composer. No extra render pass.
  useFrame(({camera,gl},dt)=>{
    const motion=runtimeRef.current,settings=motion.photography,view=motion.handheldCamera?.view??0,cameraState=photography.current,c=camera as PerspectiveCamera;
    if(!c.isPerspectiveCamera)return;
    if(view>0&&settings){
      if(!cameraState.applied){cameraState.exposure=gl.toneMappingExposure;cameraState.fov=c.fov;cameraState.lastExposure=gl.toneMappingExposure;cameraState.applied=true;}
      else if(gl.toneMappingExposure!==cameraState.lastExposure)cameraState.exposure=gl.toneMappingExposure;
      const s=settings.getState(),weight=view*view*(3-2*view),fov=2*Math.atan(36/(2*s.focal*c.aspect))*180/Math.PI;
      c.fov+=(cameraState.fov+(fov-cameraState.fov)*weight-c.fov)*(1-Math.exp(-12*Math.min(dt,.05)));c.updateProjectionMatrix();
      gl.toneMappingExposure=cameraState.exposure*(1+(photographyExposure(s)-1)*weight);cameraState.lastExposure=gl.toneMappingExposure;
      inputRef.current.cameraLookScale=photographyLookScale(s.focal);

    }else{
      inputRef.current.cameraLookScale=1;
      if(cameraState.applied){gl.toneMappingExposure=cameraState.exposure;c.fov=cameraState.fov;c.updateProjectionMatrix();cameraState.applied=false;}
    }
  },-1);
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
    const held=motion.handheldCamera;
    if(held){
      if(!motion.photography?.getState().preview&&(controls.flying||controls.inputBlocked||controls.inventoryOpen||!controls.active||motion.seat||motion.bellAction||!held.wanted))held.using=false;
      held.view=Math.max(0,Math.min(1,held.view+(held.using?delta/.35:-delta/.35)));
      controls.cameraView=held.view>0;held.pitch=controls.pitch;
      if(held.view>0){
        const blend=held.view*held.view*(3-2*held.view);
        const eye=state.ideal;
        visual.getWorldPosition(eye);eye.y+=playerConfig.height/2-.12;
        state.direction.set(-Math.sin(controls.yaw)*Math.cos(controls.pitch),-Math.sin(controls.pitch),-Math.cos(controls.yaw)*Math.cos(controls.pitch));
        eye.addScaledVector(state.direction,.08);
        camera.position.copy(state.candidate).lerp(eye,blend);
        state.lookTarget.copy(state.focus).lerp(state.candidate.copy(eye).add(state.direction),blend);
        camera.lookAt(state.lookTarget);
        const photo=motion.photography?.getState();
        if(photo&&!photo.preview){
          state.handheldTime+=delta;const t=state.handheldTime;
          const moving=motion.movement==='WALK'||motion.movement==='RUN';
          const strength=(.65+photo.focal/135*.6)*(moving?1.5:1)*(photo.physical.held ? .55 : 1)*blend;
          state.handheldEuler.set((Math.sin(t*1.3)*.00015+Math.sin(t*3.7)*.000045)*strength,(Math.sin(t*.93)*.00017+Math.sin(t*4.1)*.00004)*strength,Math.sin(t*.7)*.000035*strength,'YXZ');
          camera.quaternion.multiply(state.handheldRotation.setFromEuler(state.handheldEuler));
        }
        initialized.current=true;lastReset.current=motion.resetSequence;return;
      }
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
