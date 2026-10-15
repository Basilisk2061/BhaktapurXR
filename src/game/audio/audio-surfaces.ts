import {architecturalPartKey} from '../../features/world-editor/parts.ts';
import type {Collider} from '@dimforge/rapier3d-compat';
import type {CentralModel} from '../architecture/central-model.ts';
import type {SolidBox} from '../architecture/geometry.ts';
export type FootstepSurface='brick-stone'|'wood';
const bindings=new WeakMap<Collider,FootstepSurface>();
export function bindAudioSurface(collider:Collider,surface:FootstepSurface){bindings.set(collider,surface);}
export function colliderAudioSurface(collider:Collider):FootstepSurface{return bindings.get(collider)??'brick-stone';}
const register:Record<FootstepSurface,(collider:Collider|null)=>void>={
 'brick-stone':collider=>{if(collider)bindAudioSurface(collider,'brick-stone');},
 wood:collider=>{if(collider)bindAudioSurface(collider,'wood');},
};
export const audioSurfaceRef=(surface:FootstepSurface)=>register[surface];
const key=(box:SolidBox)=>JSON.stringify([box.position,box.size,box.yaw]);
const cache=new WeakMap<CentralModel,FootstepSurface[]>();
/** Exact collider ownership/material, independent of heritage/object names and editor transforms.
 * Uncertain surfaces default to masonry. Roof-support timber underneath tiles is not a wood floor.
 */
export function modelAudioSurfaces(model:CentralModel):FootstepSurface[]{
 let result=cache.get(model);if(result)return result;
 const owners=new Map(model.boxes.map(b=>[key(b),b]));
 result=model.colliders.map(c=>{
  const owner=owners.get(key(c));if(!owner||architecturalPartKey(model,owner)==='roof'||!['timber','carvedTimber'].includes(owner.material)||c.size[0]<.6||c.size[2]<.6||c.size[1]>.4)return 'brick-stone';
  const roofAbove=model.roofs.some(r=>Math.hypot(r.position[0]-c.position[0],r.position[2]-c.position[2])<.5&&r.position[1]>=c.position[1]-.1&&r.position[1]<c.position[1]+c.size[1]/2+.6);
  return roofAbove?'brick-stone':'wood';
 });cache.set(model,result);return result;
}
