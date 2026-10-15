import {AnimationClip,Quaternion,Vector3,type Object3D,type SkinnedMesh} from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
export const mixamoBoneName=(name:string)=>name.replace(/^mixamorig\d*[:_]?/i,'');
export interface BoneFrame {name:string;parent:string|null;world:Quaternion;parentWorld:Quaternion;position:Vector3}
export interface MixamoRig {bones:Map<string,BoneFrame>;legLength:number}
/** Read the true inverse-bind pose on a clone, never change a cached/player scene. */
export function mixamoRig(root:Object3D):MixamoRig{
 const copy=clone(root);copy.updateMatrixWorld(true);copy.traverse(o=>{if((o as SkinnedMesh).isSkinnedMesh)(o as SkinnedMesh).skeleton.pose();});copy.updateMatrixWorld(true);
 const bones=new Map<string,BoneFrame>();copy.traverse(o=>{if(o.type!=='Bone')return;const name=mixamoBoneName(o.name);bones.set(name,{name:o.name,parent:o.parent?.type==='Bone'?mixamoBoneName(o.parent.name):null,world:o.getWorldQuaternion(new Quaternion()),parentWorld:o.parent?.getWorldQuaternion(new Quaternion())??new Quaternion(),position:o.position.clone()});});
 const legLength=(bones.get('LeftLeg')?.position.length()??0)+(bones.get('LeftFoot')?.position.length()??0);
 if(!bones.has('Hips')||legLength<=0)throw Error('NPC needs a weighted, compatible Mixamo humanoid rig');
 return {bones,legLength};
}
/** Mixamo ground-based hip translation + bind-space quaternion conversion.
 * Every tracked bone and parent must map; failures are explicit, never silently dropped tracks.
 */
export function retargetMixamoClip(clip:AnimationClip,source:MixamoRig,target:MixamoRig,name=clip.name){
 const result=clip.clone();result.name=name;const rotation=new Quaternion(),pre=new Quaternion(),post=new Quaternion();
 for(const track of result.tracks){
  const dot=track.name.lastIndexOf('.'),bone=mixamoBoneName(track.name.slice(0,dot)),property=track.name.slice(dot+1),from=source.bones.get(bone),to=target.bones.get(bone);
  if(!from||!to||from.parent!==to.parent)throw Error('Incompatible Mixamo bone/parent: '+track.name);
  track.name=to.name+'.'+property;
  if(property==='quaternion'){
   pre.copy(to.parentWorld).invert().multiply(from.parentWorld);post.copy(from.world).invert().multiply(to.world);
   for(let i=0;i<track.values.length;i+=4){rotation.fromArray(track.values,i).premultiply(pre).multiply(post).normalize().toArray(track.values,i);}
  }else if(property==='position'){
   if(bone!=='Hips')throw Error('Unexpected translated non-root Mixamo bone: '+track.name);
   // Mixamo exports hip heights in ground-based metres, independent of the mesh's centred bind pose.
   const ratio=target.legLength/source.legLength;
   for(let i=0;i<track.values.length;i+=3){track.values[i]=0;track.values[i+1]*=ratio;track.values[i+2]=0;}
  }else throw Error('Unsupported Mixamo track '+property);
 }return result;
}
