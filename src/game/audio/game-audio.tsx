import {createContext,useContext,useEffect,useMemo,useRef,type ReactNode,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useRapier} from '@react-three/rapier';
import {Vector3} from 'three';
import type {PlayerRuntime} from '../player/player-runtime';
import type {PlayerInput} from '../input/player-input';
import {gameplayCodes} from '../input/player-input';
import {GameAudioEngine} from './game-audio-engine';
import {canPlayFootstep} from './foot-contacts';
import {LandingAudioGate} from './landing-audio';
import {colliderAudioSurface} from './audio-surfaces';
const ContactAudio=createContext<((position:Vector3,running:boolean)=>void)|null>(null);
export const useFootContactAudio=()=>useContext(ContactAudio);
export function GameAudio({enabled,runtime,input,children}:{enabled:boolean;runtime:RefObject<PlayerRuntime>;input:RefObject<PlayerInput>;children:ReactNode}){
 const voiceVectors=useMemo(()=>({position:new Vector3(),forward:new Vector3(),up:new Vector3(),heads:Array.from({length:4},()=>new Vector3()),landing:new Vector3()}),[]);
 const landingGate=useMemo(()=>new LandingAudioGate(),[]);
 const canvas=useThree(state=>state.gl.domElement),{world,rapier}=useRapier(),engine=useRef<GameAudioEngine|null>(null);
 useEffect(()=>{
  if(!enabled)return;const audio=new GameAudioEngine();engine.current=audio;
  const pointer=(event:PointerEvent)=>{if(event.isTrusted)void audio.unlock();};
  const key=(event:KeyboardEvent)=>{if(event.isTrusted&&input.current.active&&gameplayCodes.has(event.code)&&(document.pointerLockElement===canvas||document.activeElement===canvas))void audio.unlock();};
  canvas.addEventListener('pointerdown',pointer);window.addEventListener('keydown',key);
  return ()=>{canvas.removeEventListener('pointerdown',pointer);window.removeEventListener('keydown',key);audio.dispose();engine.current=null;};
 },[enabled,canvas,input]);
 const surfaceAt=(position:Vector3)=>{
  const hit=world.castRay(new rapier.Ray({x:position.x,y:position.y+.15,z:position.z},{x:0,y:-1,z:0}),.65,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,c=>!c.parent()||c.parent()!.isFixed());
  return hit?colliderAudioSurface(hit.collider):'brick-stone';
 };
 const contact=(position:Vector3,running:boolean)=>{
  if(!enabled||!input.current.active||!canPlayFootstep(runtime.current)||!landingGate.canFootstep(performance.now()/1000))return;
  engine.current?.footstep(surfaceAt(position),running);
 };
 useFrame(({scene,camera})=>{
  const motion=runtime.current;
  const landed=landingGate.update(motion,performance.now()/1000,enabled&&input.current.active);
  if(!input.current.active||!canPlayFootstep(runtime.current))engine.current?.stopSteps();
  if(!enabled||!engine.current)return;
  if(landed){voiceVectors.landing.set(motion.nextPosition.x,motion.nextPosition.y-.875+.03,motion.nextPosition.z);engine.current.landing(surfaceAt(voiceVectors.landing));}
  const actors=['old-a','old-b','female-a','female-b'].flatMap((id,i)=>{
   const actor=scene.getObjectByName('npc:'+id),head=actor?.getObjectByName('mixamorigHead');
   return actor&&head?[{id,state:actor.userData.state as string,position:head.getWorldPosition(voiceVectors.heads[i])}]:[];
  });
  camera.getWorldPosition(voiceVectors.position);camera.getWorldDirection(voiceVectors.forward);voiceVectors.up.set(0,1,0).applyQuaternion(camera.quaternion);
  engine.current.updateOldManVoices(actors.filter(a=>a.id.startsWith('old-')),voiceVectors.position,voiceVectors.forward,voiceVectors.up,{position:runtime.current.nextPosition,running:runtime.current.grounded&&!runtime.current.flying&&!runtime.current.seat&&runtime.current.movement==='RUN',landed,flying:runtime.current.flying},actors.filter(a=>a.id.startsWith('female-')));
 },-10);
 return <ContactAudio.Provider value={enabled?contact:null}>{children}</ContactAudio.Provider>;
}
