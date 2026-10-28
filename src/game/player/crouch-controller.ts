import type {Collider,RigidBody,World} from '@dimforge/rapier3d-compat';
import type {PlayerRuntime} from './player-runtime';
import type {PlayerInput} from '../input/player-input';
import {playerConfig} from './player-config.ts';
/** Existing 6 mm query-only tolerance; actual collider dimensions are unchanged. */
export const crouchClearanceTolerance = 0.006;
/** Body origin stays at standing centre. Only capsule local height/centre change: feet invariant. */
export function createCrouchController(world:World,rapier:Pick<typeof import('@dimforge/rapier3d-compat'),'Capsule'|'QueryFilterFlags'>){
 // Sweep the crouched upper hemisphere to the standing head position. This contains
 // the newly occupied volume but excludes the lower body/floor already occupied safely.
 // Feet-relative bounds: 0.656..1.744 m, versus 0.006..1.744 m for the old full query.
 const expansion=new rapier.Capsule((playerConfig.height-playerConfig.crouchHeight)/2,playerConfig.radius-crouchClearanceTolerance),identity={x:0,y:0,z:0,w:1},local={x:0,y:0,z:0},query={x:0,y:0,z:0};
 const clear=(body:RigidBody,collider:Collider)=>{const p=body.translation();query.x=p.x;query.y=p.y+playerConfig.crouchHeight/2-playerConfig.radius;query.z=p.z;return !world.intersectionWithShape(query,identity,expansion,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,collider,body);};
 return {clear,reset(collider:Collider,motion:PlayerRuntime){motion.crouchWeight=motion.crouchProgress=0;motion.crouchWanted=false;motion.crouchState='STANDING';collider.setHalfHeight(playerConfig.capsuleHalfSegment);local.y=0;collider.setTranslationWrtParent(local);},
 step(body:RigidBody,collider:Collider,motion:PlayerRuntime,input:PlayerInput,dt:number){
  if(input.crouchRequested){input.crouchRequested=false;if(input.active&&!input.inputBlocked&&!input.inventoryOpen&&!motion.seat&&!motion.bellAction&&!input.flying&&(motion.crouchWanted||motion.grounded)){if(motion.crouchWanted){if(clear(body,collider))motion.crouchWanted=false;}else motion.crouchWanted=true;}}
  if(!motion.crouchWanted&&motion.crouchProgress>0&&!clear(body,collider))motion.crouchWanted=true;
  const old=motion.crouchWeight;
  motion.crouchProgress=Math.max(0,Math.min(1,motion.crouchProgress+(motion.crouchWanted?1:-1)*dt/playerConfig.crouchDuration));
  const p=motion.crouchProgress;motion.crouchWeight=p*p*(3-2*p);
  motion.crouchState=p===0?'STANDING':p===1?'CROUCHED':motion.crouchWanted?'CROUCHING_DOWN':'STANDING_UP';
  input.crouched=p>0||motion.crouchWanted;
  if(input.crouched)input.jumpRequested=false;
  if(old!==motion.crouchWeight){const height=playerConfig.height+(playerConfig.crouchHeight-playerConfig.height)*motion.crouchWeight;collider.setHalfHeight(height/2-playerConfig.radius);local.y=(height-playerConfig.height)/2;collider.setTranslationWrtParent(local);body.wakeUp();}
 }};
}

