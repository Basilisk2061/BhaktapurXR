import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import { AnimationMixer, LoopOnce, LoopRepeat, type Group } from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import type { PlayerRuntime } from "./player-runtime";
import { playerConfig } from "./player-config";

class CharacterBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?(process.env.NODE_ENV==="development"?<Html center><span role="alert">Player character failed to load. Check character assets.</span></Html>:null):this.props.children;}
}
function AnimatedCharacter({runtime}:{runtime:RefObject<PlayerRuntime>}){
  const {scene,animations}=useGLTF("/assets/characters/player/player.glb",false,false);
  const model=useMemo(()=>{const model=clone(scene);model.traverse(object=>{object.castShadow=true;object.receiveShadow=true;});return model;},[scene]);
  const mixer=useMemo(()=>new AnimationMixer(model),[model]);
  const actions=useMemo(()=>Object.fromEntries(animations.map(clip=>{const action=mixer.clipAction(clip);action.setLoop(clip.name==="Jump"?LoopOnce:LoopRepeat,clip.name==="Jump"?1:Infinity);action.clampWhenFinished=clip.name==="Jump";return [clip.name,action];})),[animations,mixer]);
  const previous=useRef(""),reset=useRef(-1);
  useEffect(()=>{previous.current="";reset.current=-1;return ()=>{mixer.stopAllAction();};},[mixer]);
  useFrame((_,delta)=>{
    const motion=runtime.current;
    const airborne=!motion.flying&&!motion.grounded;
    const name=airborne&&(motion.velocity.y>0||previous.current==="Jump")?"Jump":motion.horizontalSpeed<playerConfig.movementThreshold?"Idle":motion.movement==="RUN"||motion.horizontalSpeed>playerConfig.walkSpeed+.15?"Run":"Walk";
    if(name!==previous.current||reset.current!==motion.resetSequence){
      actions[previous.current]?.fadeOut(.18);
      actions[name].reset().fadeIn(.18).play();
      previous.current=name;reset.current=motion.resetSequence;model.userData.animation=name;
    }
    mixer.update(Math.min(delta,.05));
  });
  return <primitive object={model} position={[0,-playerConfig.height/2,0]} dispose={null}/>;
}
/** Camera and smooth facing retain their original group; only its visual child changes. */
export function PlayerCharacter({visualRef,runtime}:{visualRef:RefObject<Group|null>;runtime:RefObject<PlayerRuntime>}){
  return <group ref={visualRef} name="player-character"><CharacterBoundary><Suspense fallback={null}><AnimatedCharacter runtime={runtime}/></Suspense></CharacterBoundary></group>;
}
