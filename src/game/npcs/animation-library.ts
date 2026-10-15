import type {AnimationClip,Object3D} from 'three';
import {mixamoRig,retargetMixamoClip} from './mixamo-retarget';
import type {AnimationRole,NpcDefinition} from './definitions';
const cache=new WeakMap<Object3D,Partial<Record<AnimationRole,AnimationClip>>>();
/** Role maps are per character, clips/resources shared; each actor owns its mixer/actions. */
export function npcAnimationLibrary(definition:NpcDefinition,character:Object3D,native:AnimationClip[],player:Object3D,shared:AnimationClip[]){
 const cached=cache.get(character);if(cached)return cached;
 const result:Partial<Record<AnimationRole,AnimationClip>>={};
 for(const [role,reference]of Object.entries(definition.roles)){
  const clip=(reference.library==='player'?shared:native).find(c=>c.name===reference.clip);if(!clip)throw Error('NPC clip missing: '+reference.clip);
  result[role as AnimationRole]=reference.library==='player'?retargetMixamoClip(clip,mixamoRig(player),mixamoRig(character),definition.id+':'+reference.clip):clip;
 }
 for(const role of ['idle','walk','sit'] as const)if(!result[role])throw Error('NPC role missing: '+role);
 cache.set(character,result);return result;
}
