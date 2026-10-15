import type {World} from '@dimforge/rapier3d-compat';
import type {NavigationProbe} from './navigation.ts';
export function createNpcNavigationProbe(world:World,rapier:Pick<typeof import('@dimforge/rapier3d-compat'),'Capsule'|'Ray'|'QueryFilterFlags'>):NavigationProbe{
 const radius=.26,capsule=new rapier.Capsule(.84-radius,radius),identity={x:0,y:0,z:0,w:1};
 const fixed=(c:import('@dimforge/rapier3d-compat').Collider)=>!c.parent()||c.parent()!.isFixed();
 return {height:point=>{
  const hit=world.castRay(new rapier.Ray({x:point.x,y:2,z:point.z},{x:0,y:-1,z:0}),3,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,fixed);if(!hit)return null;
  const y=2-hit.timeOfImpact;if(y<-.1||y>.2)return null;
  const occupied=world.intersectionWithShape({x:point.x,y:y+.84+.03,z:point.z},identity,capsule,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,fixed);return occupied?null:y;
 },clear:(from,to)=>{
  const direction=to.clone().sub(from),length=direction.length();if(length<.001)return true;direction.divideScalar(length);
  return !world.castShape({x:from.x,y:from.y+.84+.03,z:from.z},identity,direction,capsule,0,length,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,fixed);
 }};
}
