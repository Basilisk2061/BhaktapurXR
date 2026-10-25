import {createContext,useContext,useEffect,useMemo,type ReactNode,type RefObject} from 'react';
import {useFrame} from '@react-three/fiber';
import {useRapier} from '@react-three/rapier';
import {Vector3,type Group} from 'three';
import type {PlayerInput} from '../input/player-input';
import type {PlayerRuntime} from '../player/player-runtime';
import {playerConfig} from '../player/player-config';
import {useBellStrikeAudio} from '../audio/game-audio';

export const interactiveBellIds=['large-bell','vatsala-bell'];
export const movableBellRole=(role:string)=>['large-hollow-bell','small-hollow-bell','bell-relief-ring','bell-clapper','bell-crown-hanger','bell-suspension'].includes(role);
export interface BellAction {id:string;elapsed:number;target:Vector3;impulsed:boolean;sounded:boolean}
export interface BellPrompt {id:string;name:string;start:()=>boolean}
export interface BellBinding {id:string;name:string;anchor:Vector3;target:Vector3;radius:number;pivot:Group;angle:number;time:number;cooldown:number;amplitude:number;frequency:number}
class BellSession {
 bells=new Map<string,BellBinding>();time=0;
 constructor(readonly runtime:RefObject<PlayerRuntime>,readonly input:RefObject<PlayerInput>){}
 clear:((bell:BellBinding)=>boolean)=()=>true;
 register=(bell:BellBinding)=>{this.bells.set(bell.id,bell);return()=>{this.bells.delete(bell.id);if(this.runtime.current.bellAction?.id===bell.id)this.runtime.current.bellAction=null;if(this.runtime.current.bellPrompt?.id===bell.id)this.runtime.current.bellPrompt=null;bell.pivot.rotation.x=0;};};
 eligible(bell:BellBinding){
  const motion=this.runtime.current,controls=this.input.current;
  if(!controls.active||controls.inputBlocked||motion.seat||controls.flying||!motion.grounded||motion.bellAction||!motion.bellRigReady||this.time<bell.cooldown||bell.time<5)return false;
  const p=motion.nextPosition;
  return Math.abs(p.y-playerConfig.height/2-bell.anchor.y)<.65&&Math.hypot(p.x-bell.anchor.x,p.z-bell.anchor.z)<=bell.radius&&this.clear(bell);
 }
 start=(id:string)=>{
  const bell=this.bells.get(id);if(!bell||!this.eligible(bell))return false;
  this.runtime.current.bellAction={id,elapsed:0,target:bell.target,impulsed:false,sounded:false};
  this.runtime.current.bellPrompt=null;bell.cooldown=this.time+3;
  this.input.current.jumpRequested=false;this.input.current.interactRequested=false;this.input.current.lastSpacePress=null;
  return true;
 };
 tick(delta:number,strike:((point:Vector3,small:boolean)=>void)|null){
  this.time+=delta;
  const motion=this.runtime.current,action=motion.bellAction;
  if(action){
   const bell=this.bells.get(action.id);
   if(!bell||this.input.current.inputBlocked||!this.input.current.active){motion.bellAction=null;}
   else{
    action.elapsed+=delta;
    if(!action.impulsed&&action.elapsed>=.6){action.impulsed=true;bell.time=0;}
    if(!action.sounded&&action.elapsed>=.74){action.sounded=true;strike?.(bell.target,bell.id==='vatsala-bell');}
    if(action.elapsed>=1.4)motion.bellAction=null;
   }
  }
  for(const bell of this.bells.values())if(bell.time<5){
   bell.time=Math.min(5,bell.time+delta);
   bell.angle=bell.time===5?0:bell.amplitude*Math.exp(-.95*bell.time)*Math.sin(bell.frequency*bell.time);
   bell.pivot.rotation.x=bell.angle;
  }
  let nearest:BellBinding|undefined,best=Infinity;
  for(const bell of this.bells.values())if(this.eligible(bell)){
   const distance=Math.hypot(motion.nextPosition.x-bell.anchor.x,motion.nextPosition.z-bell.anchor.z);
   if(distance<best||distance===best&&bell.id<(nearest?.id??'')){nearest=bell;best=distance;}
  }
  if(nearest){if(motion.bellPrompt?.id!==nearest.id)motion.bellPrompt={id:nearest.id,name:nearest.name,start:()=>this.start(nearest!.id)};}
  else motion.bellPrompt=null;
 }
 dispose(){for(const bell of this.bells.values())bell.pivot.rotation.x=0;this.bells.clear();this.runtime.current.bellAction=null;this.runtime.current.bellPrompt=null;}
}
const BellContext=createContext<BellSession|null>(null);
export const useBellSession=()=>useContext(BellContext);
export function BellInteractions({runtime,input,enabled,children}:{runtime:RefObject<PlayerRuntime>;input:RefObject<PlayerInput>;enabled:boolean;children:ReactNode}){
 const session=useMemo(()=>new BellSession(runtime,input),[runtime,input]),strike=useBellStrikeAudio(),{world,rapier}=useRapier();
 const direction=useMemo(()=>new Vector3(),[]);
 session.clear=bell=>{
  const p=runtime.current.nextPosition,origin={x:p.x,y:p.y+.35,z:p.z};
  direction.set(bell.target.x-origin.x,bell.target.y-origin.y,bell.target.z-origin.z);const distance=direction.length();direction.normalize();
  const hit=world.castRay(new rapier.Ray(origin,direction),distance,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,c=>!c.parent()||c.parent()!.isFixed());
  return !hit||hit.timeOfImpact>=distance-.15;
 };
 useEffect(()=>()=>session.dispose(),[session]);
 useFrame((_,delta)=>{if(enabled)session.tick(Math.min(delta,.05),strike);},-15);
 return <BellContext.Provider value={enabled?session:null}>{children}</BellContext.Provider>;
}
