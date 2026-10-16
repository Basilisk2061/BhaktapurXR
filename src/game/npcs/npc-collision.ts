import {QueryFilterFlags,type Collider,type KinematicCharacterController} from '@dimforge/rapier3d-compat';
/** Idle/yielding kinematic actors must not inherit horizontal depenetration from another controller. */
export function npcHorizontalMovement(desired:{x:number;z:number},corrected:{x:number;z:number}){
 return Math.hypot(desired.x,desired.z)>.000001?corrected:{x:0,z:0};
}

/** Navigation owns NPC motion. Moving actors are handled by simulation stop/yield,
 * never by accepting their contact/depenetration into the NPC world translation. */
export function computeNpcMovement(controller:KinematicCharacterController,collider:Collider,desired:{x:number;y:number;z:number},flags:QueryFilterFlags){
 controller.computeColliderMovement(collider,desired,flags|QueryFilterFlags.ONLY_FIXED);
 const corrected=controller.computedMovement(),horizontal=npcHorizontalMovement(desired,corrected);
 return {x:horizontal.x,y:corrected.y,z:horizontal.z};
}
