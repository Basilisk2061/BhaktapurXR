/** Idle/yielding kinematic actors must not inherit horizontal depenetration from another controller. */
export function npcHorizontalMovement(desired:{x:number;z:number},corrected:{x:number;z:number}){
 return Math.hypot(desired.x,desired.z)>.000001?corrected:{x:0,z:0};
}
